const NASA_POWER_URL =
  "https://power.larc.nasa.gov/api/temporal/daily/point";

export class NasaPowerError extends Error {
  constructor(message) {
    super(message);
    this.name = "NasaPowerError";
  }
}

export const formatNasaDateKeys = (values) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      /^\d{8}$/.test(key)
        ? `${key.slice(0, 4)}-${key.slice(4, 6)}-${key.slice(6)}`
        : key,
      value,
    ])
  );

export const calculateNasaDateWindow = (now = new Date()) => ({
  start: new Date(now.getTime() - 720 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, ""),
  end: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, ""),
});

const buildNasaUrl = ({ parameters, latitude, longitude, start, end }) => {
  const query = new URLSearchParams({
    parameters,
    community: "RE",
    latitude: String(latitude),
    longitude: String(longitude),
    start,
    end,
    format: "JSON",
  });
  return `${NASA_POWER_URL}?${query.toString()}`;
};

const requestJson = async (url, label, fetchImplementation) => {
  let response;
  try {
    response = await fetchImplementation(url);
  } catch {
    throw new NasaPowerError(`${label} request could not be completed.`);
  }

  if (!response.ok) {
    throw new NasaPowerError(
      `${label} request failed with status ${response.status}.`
    );
  }

  try {
    return await response.json();
  } catch {
    throw new NasaPowerError(`${label} response was not valid JSON.`);
  }
};

const requireParameter = (response, parameter, label) => {
  const values = response?.properties?.parameter?.[parameter];
  if (!values || typeof values !== "object" || Object.keys(values).length === 0) {
    throw new NasaPowerError(`${label} response did not include ${parameter} data.`);
  }
  return formatNasaDateKeys(values);
};

export const fetchStationClimate = async (
  site,
  dateWindow,
  fetchImplementation = fetch
) => {
  const common = {
    latitude: site.latitude,
    longitude: site.longitude,
    start: dateWindow.start,
    end: dateWindow.end,
  };
  const solarResponse = await requestJson(
    buildNasaUrl({ ...common, parameters: "ALLSKY_SFC_SW_DWN" }),
    "Solar",
    fetchImplementation
  );
  const windResponse = await requestJson(
    buildNasaUrl({ ...common, parameters: "WS2M,WD2M" }),
    "Wind",
    fetchImplementation
  );

  return {
    solar: requireParameter(
      solarResponse,
      "ALLSKY_SFC_SW_DWN",
      "Solar"
    ),
    windSpeed: requireParameter(windResponse, "WS2M", "Wind"),
    windDirection: requireParameter(windResponse, "WD2M", "Wind"),
  };
};
