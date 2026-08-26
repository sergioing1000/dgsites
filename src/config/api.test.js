import { API_BASE_URL, API_ENDPOINTS } from "./api";

test("builds the Excel report endpoint from the backend URL", () => {
  expect(API_ENDPOINTS.excelReport).toBe(
    `${API_BASE_URL}/api/v1/excel-report`
  );
});

test("builds the weather data endpoint from the backend URL", () => {
  expect(API_ENDPOINTS.weatherData).toBe(
    `${API_BASE_URL}/api/v1/weather-data`
  );
});

test("uses Render as the default backend", () => {
  expect(API_BASE_URL).toBe(
    "https://wind-data-api.onrender.com"
  );
});

test("uses the backend URL configured for the environment", async () => {
  vi.stubEnv("VITE_API_BASE_URL", "https://api.example.com/");
  vi.resetModules();

  const configuredApi = await import("./api");

  expect(configuredApi.API_BASE_URL).toBe("https://api.example.com");
  expect(configuredApi.API_ENDPOINTS.excelReport).toBe(
    "https://api.example.com/api/v1/excel-report"
  );
  expect(configuredApi.API_ENDPOINTS.weatherData).toBe(
    "https://api.example.com/api/v1/weather-data"
  );

  vi.unstubAllEnvs();
  vi.resetModules();
});
