import axios from "axios";

import { API_ENDPOINTS, resolveBackendUrl } from "../config/api";

const GENERIC_ERROR_MESSAGE =
  "We could not generate the report. Please try again.";
const MISSING_LINK_MESSAGE =
  "The server response did not include a download link.";
const SERVER_ERROR_MESSAGE = "The server could not generate the report.";

export class ReportApiError extends Error {
  constructor(code) {
    super(code);
    this.name = "ReportApiError";
    this.code = code;
  }
}

export const requestReport = async (payload) => {
  const response = await axios.post(API_ENDPOINTS.generateFiles, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response?.data?.error) {
    throw new ReportApiError("server-error");
  }

  const downloadPath = response?.data?.excel_file_url;
  if (!downloadPath) {
    throw new ReportApiError("missing-download-link");
  }

  return resolveBackendUrl(downloadPath);
};

export const getReportErrorMessage = (error) => {
  if (error instanceof ReportApiError) {
    if (error.code === "missing-download-link") return MISSING_LINK_MESSAGE;
    if (error.code === "server-error") return SERVER_ERROR_MESSAGE;
  }

  return GENERIC_ERROR_MESSAGE;
};
