import { fetchWeatherBatch } from "./multiSiteWeather";

const sites = Array.from({ length: 7 }, (_, index) => ({
  baseStation: `Station ${index + 1}`,
}));
const dateWindow = { start: "2024-01-01", end: "2024-01-31" };

test("limits backend requests to three concurrent stations", async () => {
  let active = 0;
  let maximumActive = 0;
  const requestStation = vi.fn(async (site) => {
    active += 1;
    maximumActive = Math.max(maximumActive, active);
    await new Promise((resolve) => setTimeout(resolve, 5));
    active -= 1;
    return { station: site.baseStation };
  });

  const outcome = await fetchWeatherBatch(sites, dateWindow, {
    requestStation,
    concurrency: 3,
  });

  expect(maximumActive).toBe(3);
  expect(outcome.errors).toEqual([]);
  expect(outcome.results).toHaveLength(7);
  expect(outcome.results.map(({ site }) => site.baseStation)).toEqual(
    sites.map(({ baseStation }) => baseStation)
  );
});

test("reports failed stations without discarding their identity", async () => {
  const requestStation = vi.fn(async (site) => {
    if (site.baseStation === "Station 2") {
      throw new Error("NASA POWER request timed out.");
    }
    return { solar: {} };
  });
  const onProgress = vi.fn();

  const outcome = await fetchWeatherBatch(sites.slice(0, 3), dateWindow, {
    requestStation,
    concurrency: 2,
    onProgress,
  });

  expect(outcome.errors).toEqual([
    "Station 2: NASA POWER request timed out.",
  ]);
  expect(outcome.results).toHaveLength(2);
  expect(onProgress).toHaveBeenLastCalledWith({
    completed: 3,
    total: 3,
    site: sites[2],
  });
});
