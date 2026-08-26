import axios from "axios";

import {
  calculateWeatherDateWindow,
  fetchStationWeather,
  WeatherDataApiError,
} from "./weatherDataApi";

vi.mock("axios", () => ({
  default: { post: vi.fn() },
}));

const site = {
  baseStation: "Station A",
  latitude: 4.6097,
  longitude: -74.0817,
};
const dateWindow = { start: "2024-01-01", end: "2024-01-31" };

beforeEach(() => {
  axios.post.mockReset();
});

test("calculates an ISO date window accepted by the backend", () => {
  expect(
    calculateWeatherDateWindow(new Date("2026-08-25T12:00:00.000Z"))
  ).toEqual({ start: "2024-09-04", end: "2026-07-26" });
});

test("maps daily backend observations to the existing report structure", async () => {
  axios.post.mockResolvedValueOnce({
    data: {
      daily_data: [
        {
          date: "20240101",
          wind_speed_ms: 3.2,
          wind_direction_deg: 180,
          solar_radiation_kwh: 5.5,
        },
        {
          date: "20240102",
          wind_speed_ms: null,
          wind_direction_deg: 175,
          solar_radiation_kwh: 5.2,
        },
      ],
      monthly_summary: [],
      metadata: {},
    },
  });

  await expect(fetchStationWeather(site, dateWindow)).resolves.toEqual({
    solar: { "2024-01-01": 5.5, "2024-01-02": 5.2 },
    windSpeed: { "2024-01-01": 3.2 },
    windDirection: { "2024-01-01": 180, "2024-01-02": 175 },
  });
  expect(axios.post).toHaveBeenCalledWith(
    expect.stringMatching(/\/api\/v1\/weather-data$/),
    {
      station_name: "Station A",
      latitude: 4.6097,
      longitude: -74.0817,
      start: "2024-01-01",
      end: "2024-01-31",
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 35000,
    }
  );
});

test.each([
  [422, "Station data was rejected by the backend."],
  [502, "NASA POWER is currently unavailable."],
  [504, "NASA POWER request timed out."],
])("maps backend status %s to an explicit error", async (status, message) => {
  axios.post.mockRejectedValueOnce({ response: { status } });

  await expect(fetchStationWeather(site, dateWindow)).rejects.toMatchObject({
    name: "WeatherDataApiError",
    message,
    status,
  });
});

test("rejects a successful response without daily observations", async () => {
  axios.post.mockResolvedValueOnce({ data: { daily_data: [] } });

  await expect(fetchStationWeather(site, dateWindow)).rejects.toEqual(
    new WeatherDataApiError("Backend response did not include daily data.")
  );
});
