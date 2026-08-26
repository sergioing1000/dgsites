import { fetchStationWeather } from "./weatherDataApi";

export const fetchWeatherBatch = async (
  sites,
  dateWindow,
  {
    requestStation = fetchStationWeather,
    concurrency = 3,
    onProgress = () => {},
  } = {}
) => {
  const results = new Array(sites.length);
  const failures = [];
  const workerCount = Math.min(
    sites.length,
    Math.max(1, Math.floor(Number(concurrency) || 1))
  );
  let nextIndex = 0;
  let completed = 0;

  const worker = async () => {
    while (nextIndex < sites.length) {
      const index = nextIndex;
      nextIndex += 1;
      const site = sites[index];

      try {
        const climate = await requestStation(site, dateWindow);
        results[index] = { site, climate };
      } catch (error) {
        failures.push({
          index,
          message: `${site.baseStation}: ${
            error?.message || "Weather data request failed."
          }`,
        });
      } finally {
        completed += 1;
        onProgress({ completed, total: sites.length, site });
      }
    }
  };

  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  return {
    results: results.filter(Boolean),
    errors: failures
      .sort((left, right) => left.index - right.index)
      .map(({ message }) => message),
  };
};
