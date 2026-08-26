const DEFAULT_API_BASE_URL =
  "https://wind-data-api-production.up.railway.app";

const configuredApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, "");

export const API_ENDPOINTS = Object.freeze({
  generateFiles: `${API_BASE_URL}/generate-files`,
});

export const resolveBackendUrl = (path) =>
  new URL(path, `${API_BASE_URL}/`).toString();
