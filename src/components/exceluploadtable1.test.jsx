import { fireEvent, render, screen } from "@testing-library/react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { fetchStationClimate } from "../services/nasaPowerApi";

import ExcelUploadTable from "./exceluploadtable1.jsx";

vi.mock("xlsx", () => ({
  read: vi.fn(() => ({
    SheetNames: ["Sites"],
    Sheets: { Sites: {} },
  })),
  utils: {
    sheet_to_json: vi.fn(),
  },
}));

vi.mock("exceljs", () => ({
  __esModule: true,
  default: { Workbook: vi.fn() },
}));

vi.mock("file-saver", () => ({ saveAs: vi.fn() }));

vi.mock("../services/nasaPowerApi", async () => {
  const actual = await vi.importActual("../services/nasaPowerApi");
  return {
    ...actual,
    fetchStationClimate: vi.fn(),
  };
});

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => null,
  Marker: ({ children }) => <div>{children}</div>,
  Popup: ({ children }) => <div>{children}</div>,
  useMap: () => ({ setView: vi.fn() }),
}));

vi.mock("leaflet", () => ({
  __esModule: true,
  default: {
    Icon: {
      Default: {
        prototype: {},
        mergeOptions: vi.fn(),
      },
    },
  },
}));

class ImmediateFileReader {
  readAsArrayBuffer() {
    this.onload({ target: { result: new ArrayBuffer(8) } });
  }
}

const uploadFile = (container, name = "sites.xlsx") => {
  const file = new File(["content"], name);
  fireEvent.change(container.querySelector('input[type="file"]'), {
    target: { files: [file] },
  });
};

beforeEach(() => {
  global.FileReader = ImmediateFileReader;
  XLSX.read.mockReturnValue({
    SheetNames: ["Sites"],
    Sheets: { Sites: {} },
  });
  XLSX.utils.sheet_to_json.mockReset();
  XLSX.utils.sheet_to_json.mockReturnValue([
    ["Site", "EB", "State", "Lat", "Long"],
    [1, "Station A", "State A", 4.6097, -74.0817],
  ]);
  fetchStationClimate.mockReset();
  saveAs.mockReset();
});

test("rejects files with an unsupported extension", async () => {
  const { container } = render(<ExcelUploadTable />);

  uploadFile(container, "sites.txt");

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Unsupported file type. Please upload an .xls or .xlsx file."
  );
  expect(screen.queryByRole("button", { name: "API" })).not.toBeInTheDocument();
});

test("rejects a spreadsheet without the required columns", async () => {
  XLSX.utils.sheet_to_json.mockReturnValue([
    ["Site", "Name", "Region"],
    [1, "Station A", "State A"],
  ]);
  const { container } = render(<ExcelUploadTable />);

  uploadFile(container);

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Missing required columns: EB, State, Lat, Long."
  );
  expect(screen.queryByRole("button", { name: "API" })).not.toBeInTheDocument();
});

test("rejects rows with coordinates outside their valid range", async () => {
  XLSX.utils.sheet_to_json.mockReturnValue([
    ["Site", "EB", "State", "Lat", "Long"],
    [1, "Station A", "State A", 120, -74.0817],
  ]);
  const { container } = render(<ExcelUploadTable />);

  uploadFile(container);

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Row 2: Latitude must be between -90 and 90."
  );
  expect(screen.queryByRole("button", { name: "API" })).not.toBeInTheDocument();
});

test("loads a valid template and enables the NASA request", async () => {
  const { container } = render(<ExcelUploadTable />);

  uploadFile(container);

  expect(await screen.findByText("Station A")).toBeInTheDocument();
  expect(screen.getByText("Total sites loaded: 1")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "API" })).toBeInTheDocument();
});

test("shows the failed station and does not export a partial report", async () => {
  fetchStationClimate.mockRejectedValueOnce(
    new Error("Solar request failed with status 503.")
  );
  const { container } = render(<ExcelUploadTable />);
  uploadFile(container);
  const apiButton = await screen.findByRole("button", { name: "API" });

  fireEvent.click(apiButton);

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Station A: Solar request failed with status 503."
  );
  expect(saveAs).not.toHaveBeenCalled();
});
