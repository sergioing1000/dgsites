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

test("returns an absolute download URL for a valid response", async () => {
  axios.post.mockResolvedValueOnce({
    data: { excel_file_url: "/download/report.xlsx" },
  });

  await expect(requestReport({ station_name: "Site" })).resolves.toMatch(
    /\/download\/report\.xlsx$/
  );
});

test("classifies a backend error response", async () => {
  axios.post.mockResolvedValueOnce({ data: { error: "generation failed" } });

  await expect(requestReport({})).rejects.toMatchObject({
    name: "ReportApiError",
    code: "server-error",
  });
});

test("classifies a response without a download URL", async () => {
  axios.post.mockResolvedValueOnce({ data: {} });

  await expect(requestReport({})).rejects.toMatchObject({
    name: "ReportApiError",
    code: "missing-download-link",
  });
});

test("maps controlled and unexpected errors to user messages", () => {
  expect(
    getReportErrorMessage(new ReportApiError("missing-download-link"))
  ).toBe("The server response did not include a download link.");
  expect(getReportErrorMessage(new ReportApiError("server-error"))).toBe(
    "The server could not generate the report."
  );
  expect(getReportErrorMessage(new Error("Network unavailable"))).toBe(
    "We could not generate the report. Please try again."
  );
});
