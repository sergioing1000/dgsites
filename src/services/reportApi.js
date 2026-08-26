import axios from "axios";

import { API_ENDPOINTS } from "../config/api";

const GENERIC_ERROR_MESSAGE =
  "We could not generate the report. Please try again.";
const INVALID_REPORT_MESSAGE =
  "The server response did not contain a valid Excel report.";
const DEFAULT_REPORT_FILENAME = "weather-report.xlsx";

export class ReportApiError extends Error {
  constructor(code) {
    super(code);
    this.name = "ReportApiError";
    this.code = code;
  }
}

const getHeader = (headers, name) =>
  headers?.get?.(name) ?? headers?.[name] ?? headers?.[name.toLowerCase()];

const getReportFilename = (headers) => {
  const disposition = getHeader(headers, "content-disposition");
  if (!disposition) return DEFAULT_REPORT_FILENAME;

  const encodedMatch = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  const quotedMatch = disposition.match(/filename="([^"]+)"/i);
  const plainMatch = disposition.match(/filename=([^;]+)/i);
  const candidate = encodedMatch?.[1] ?? quotedMatch?.[1] ?? plainMatch?.[1];

  if (!candidate) return DEFAULT_REPORT_FILENAME;

  try {
    const decoded = decodeURIComponent(candidate.trim());
    const safeName = decoded.split(/[\\/]/).pop().replace(/[\r\n"]/g, "");
    return safeName || DEFAULT_REPORT_FILENAME;
  } catch {
    return DEFAULT_REPORT_FILENAME;
  }
};

export const requestReport = async (payload) => {
  const response = await axios.post(API_ENDPOINTS.excelReport, payload, {
    headers: { "Content-Type": "application/json" },
    responseType: "blob",
  });

  if (!(response?.data instanceof Blob) || response.data.size === 0) {
    throw new ReportApiError("invalid-report");
  }

  return {
    blob: response.data,
    fileName: getReportFilename(response.headers),
  };
};

export const getReportErrorMessage = (error) => {
  if (error instanceof ReportApiError && error.code === "invalid-report") {
    return INVALID_REPORT_MESSAGE;
  }

  return GENERIC_ERROR_MESSAGE;
};
