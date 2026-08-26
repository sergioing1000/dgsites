const DEFAULT_API_BASE_URL =
  "https://wind-data-api.onrender.com";

const configuredApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, "");

export const API_ENDPOINTS = Object.freeze({
  excelReport: `${API_BASE_URL}/api/v1/excel-report`,
  weatherData: `${API_BASE_URL}/api/v1/weather-data`,
});
