import axios from "axios";

import {
  getReportErrorMessage,
  ReportApiError,
  requestReport,
} from "./reportApi";

vi.mock("axios", () => ({
  default: { post: vi.fn() },
}));

beforeEach(() => {
  axios.post.mockReset();
});

test("returns the streamed workbook and its response filename", async () => {
  const workbook = new Blob(["xlsx"], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  axios.post.mockResolvedValueOnce({
    data: workbook,
    headers: {
      "content-disposition": 'attachment; filename="station-report.xlsx"',
    },
  });

  await expect(requestReport({ station_name: "Site" })).resolves.toEqual({
    blob: workbook,
    fileName: "station-report.xlsx",
  });
  expect(axios.post).toHaveBeenCalledWith(
    expect.stringMatching(/\/api\/v1\/excel-report$/),
    { station_name: "Site" },
    {
      headers: { "Content-Type": "application/json" },
      responseType: "blob",
    }
  );
});

test("uses a safe default filename when the response omits it", async () => {
  const workbook = new Blob(["xlsx"]);
  axios.post.mockResolvedValueOnce({ data: workbook, headers: {} });

  await expect(requestReport({})).resolves.toEqual({
    blob: workbook,
    fileName: "weather-report.xlsx",
  });
});

test("rejects an empty or non-binary report", async () => {
  axios.post.mockResolvedValueOnce({ data: {}, headers: {} });

  await expect(requestReport({})).rejects.toMatchObject({
    name: "ReportApiError",
    code: "invalid-report",
  });
});

test("maps controlled and unexpected errors to user messages", () => {
  expect(
    getReportErrorMessage(new ReportApiError("invalid-report"))
  ).toBe(
    "The server response did not contain a valid Excel report."
  );
  expect(getReportErrorMessage(new Error("Network unavailable"))).toBe(
    "We could not generate the report. Please try again."
  );
});
