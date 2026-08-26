import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";

import SingleSite from "./singlesite1.jsx";

vi.mock("axios", () => ({
  default: { post: vi.fn() },
}));

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => null,
  Marker: () => null,
  useMapEvents: vi.fn(),
}));

const fillCoordinates = (container, latitude, longitude) => {
  fireEvent.change(container.querySelector('input[name="latitude"]'), {
    target: { value: latitude },
  });
  fireEvent.change(container.querySelector('input[name="longitude"]'), {
    target: { value: longitude },
  });
};

const advanceToDates = (container) => {
  fillCoordinates(container, "4.6097", "-74.0817");
  fireEvent.click(screen.getByRole("button", { name: /next/i }));
};

const chooseCustomDates = (container, startDate, endDate) => {
  fireEvent.click(screen.getByRole("radio", { name: /use custom dates/i }));
  fireEvent.change(container.querySelector('input[name="startDate"]'), {
    target: { value: startDate },
  });
  fireEvent.change(container.querySelector('input[name="endDate"]'), {
    target: { value: endDate },
  });
};

beforeEach(() => {
  axios.post.mockReset();
  URL.createObjectURL = vi.fn(() => "blob:station-report");
  URL.revokeObjectURL = vi.fn();
});

test("rejects non-numeric coordinates before advancing", () => {
  const { container } = render(<SingleSite />);

  fillCoordinates(container, "north", "-74.0817");
  fireEvent.click(screen.getByRole("button", { name: /next/i }));

  expect(screen.getByText("Latitude must be a number")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /send/i })).not.toBeInTheDocument();
  expect(axios.post).not.toHaveBeenCalled();
});

test("rejects coordinates outside Colombia before advancing", () => {
  const { container } = render(<SingleSite />);

  fillCoordinates(container, "20", "-74.0817");
  fireEvent.click(screen.getByRole("button", { name: /next/i }));

  expect(
    screen.getByText("Latitude must be between -4.23 and 12.44")
  ).toBeInTheDocument();
  expect(axios.post).not.toHaveBeenCalled();
});

test("rejects an inverted custom date range without calling the backend", () => {
  const { container } = render(<SingleSite />);
  advanceToDates(container);
  chooseCustomDates(container, "2020-08-20", "2020-08-19");

  fireEvent.click(screen.getByRole("button", { name: /send/i }));

  expect(
    screen.getByText("Start date must be before end date")
  ).toBeInTheDocument();
  expect(axios.post).not.toHaveBeenCalled();
});

test("shows a visible message when the backend request fails", async () => {
  axios.post.mockRejectedValueOnce(new Error("Network unavailable"));
  const { container } = render(<SingleSite />);
  advanceToDates(container);
  chooseCustomDates(container, "2020-08-18", "2020-08-19");

  fireEvent.click(screen.getByRole("button", { name: /send/i }));

  expect(
    await screen.findByRole("alert")
  ).toHaveTextContent("We could not generate the report. Please try again.");
});

test("shows a visible message when the backend returns a non-binary report", async () => {
  axios.post.mockResolvedValueOnce({ data: {} });
  const { container } = render(<SingleSite />);
  advanceToDates(container);
  chooseCustomDates(container, "2020-08-18", "2020-08-19");

  fireEvent.click(screen.getByRole("button", { name: /send/i }));

  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "The server response did not contain a valid Excel report."
  );
});

test("shows a local download link and releases it after use", async () => {
  const workbook = new Blob(["xlsx"], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  axios.post.mockResolvedValueOnce({
    data: workbook,
    headers: {
      "content-disposition": 'attachment; filename="station-report.xlsx"',
    },
  });
  const { container, unmount } = render(<SingleSite />);
  advanceToDates(container);
  chooseCustomDates(container, "2020-08-18", "2020-08-19");

  fireEvent.click(screen.getByRole("button", { name: /send/i }));

  const downloadLink = await screen.findByRole("link", {
    name: /download excel file/i,
  });
  expect(downloadLink).toHaveAttribute("href", "blob:station-report");
  expect(downloadLink).toHaveAttribute("download", "station-report.xlsx");
  expect(URL.createObjectURL).toHaveBeenCalledWith(workbook);
  expect(axios.post).toHaveBeenCalledWith(
    expect.stringMatching(/\/api\/v1\/excel-report$/),
    {
      station_name: "Station Site A",
      latitude: 4.6097,
      longitude: -74.0817,
      start: "2020-08-18",
      end: "2020-08-19",
    },
    {
      headers: { "Content-Type": "application/json" },
      responseType: "blob",
    }
  );

  unmount();
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:station-report");
});
