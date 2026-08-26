import axios from "axios";

import { API_ENDPOINTS } from "../config/api";

const REQUEST_TIMEOUT_MS = 35000;
const DAY_MS = 24 * 60 * 60 * 1000;

export class WeatherDataApiError extends Error {
  constructor(message, status = null) {
    super(message);
    this.name = "WeatherDataApiError";
    this.status = status;
  }
}

const formatIsoDate = (date) => date.toISOString().slice(0, 10);

export const calculateWeatherDateWindow = (now = new Date()) => ({
  start: formatIsoDate(new Date(now.getTime() - 720 * DAY_MS)),
  end: formatIsoDate(new Date(now.getTime() - 30 * DAY_MS)),
});

const formatObservationDate = (date) => {
  const value = String(date ?? "");
  if (!/^\d{8}$/.test(value)) return value;
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
};

const observationsToMap = (observations, field) =>
  Object.fromEntries(
    observations
      .filter((observation) => observation[field] != null)
      .map((observation) => [
        formatObservationDate(observation.date),
        observation[field],
      ])
  );

const messageForFailure = (error) => {
  const status = error?.response?.status ?? null;
  if (status === 422) return "Station data was rejected by the backend.";
  if (status === 502) return "NASA POWER is currently unavailable.";
  if (status === 504 || error?.code === "ECONNABORTED") {
    return "NASA POWER request timed out.";
  }
  return "Weather data request could not be completed.";
};

export const fetchStationWeather = async (site, dateWindow) => {
  let response;

  try {
    response = await axios.post(
      API_ENDPOINTS.weatherData,
      {
        station_name: site.baseStation,
        latitude: site.latitude,
        longitude: site.longitude,
        start: dateWindow.start,
        end: dateWindow.end,
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: REQUEST_TIMEOUT_MS,
      }
    );
  } catch (error) {
    throw new WeatherDataApiError(
      messageForFailure(error),
      error?.response?.status ?? null
    );
  }

  const observations = response?.data?.daily_data;
  if (!Array.isArray(observations) || observations.length === 0) {
    throw new WeatherDataApiError(
      "Backend response did not include daily data."
    );
  }

  return {
    solar: observationsToMap(observations, "solar_radiation_kwh"),
    windSpeed: observationsToMap(observations, "wind_speed_ms"),
    windDirection: observationsToMap(observations, "wind_direction_deg"),
  };
};
