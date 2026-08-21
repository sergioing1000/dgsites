import {
  API_BASE_URL,
  API_ENDPOINTS,
  resolveBackendUrl,
} from "./api";

test("builds the file generation endpoint from the backend URL", () => {
  expect(API_ENDPOINTS.generateFiles).toBe(
    `${API_BASE_URL}/generate-files`
  );
});

test("resolves a download path against the backend URL", () => {
  expect(resolveBackendUrl("/download/report.xlsx")).toBe(
    `${API_BASE_URL}/download/report.xlsx`
  );
});

test("uses the backend URL configured for the environment", () => {
  const previousApiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  process.env.REACT_APP_API_BASE_URL = "https://api.example.com/";
  jest.resetModules();

  const configuredApi = require("./api");

  expect(configuredApi.API_BASE_URL).toBe("https://api.example.com");
  expect(configuredApi.API_ENDPOINTS.generateFiles).toBe(
    "https://api.example.com/generate-files"
  );

  if (previousApiBaseUrl === undefined) {
    delete process.env.REACT_APP_API_BASE_URL;
  } else {
    process.env.REACT_APP_API_BASE_URL = previousApiBaseUrl;
  }
  jest.resetModules();
});
