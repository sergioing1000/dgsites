import {
  calculateNasaDateWindow,
  fetchStationClimate,
  formatNasaDateKeys,
} from "./nasaPowerApi";

const site = { latitude: 4.6097, longitude: -74.0817 };
const dateWindow = { start: "20240101", end: "20240131" };

const response = (body, options = {}) => ({
  ok: options.ok ?? true,
  status: options.status ?? 200,
  json: vi.fn().mockResolvedValue(body),
});

test("calculates the NASA date window deterministically", () => {
  expect(
    calculateNasaDateWindow(new Date("2026-08-25T12:00:00.000Z"))
  ).toEqual({ start: "20240904", end: "20260726" });
});

test("formats NASA date keys", () => {
  expect(formatNasaDateKeys({ 20240101: 10, metadata: "value" })).toEqual({
    "2024-01-01": 10,
    metadata: "value",
  });
});

test("returns normalized solar and wind data", async () => {
  const fetchImplementation = vi
    .fn()
    .mockResolvedValueOnce(
      response({
        properties: {
          parameter: { ALLSKY_SFC_SW_DWN: { 20240101: 5.5 } },
        },
      })
    )
    .mockResolvedValueOnce(
      response({
        properties: {
          parameter: {
            WS2M: { 20240101: 3.2 },
            WD2M: { 20240101: 180 },
          },
        },
      })
    );

  await expect(
    fetchStationClimate(site, dateWindow, fetchImplementation)
  ).resolves.toEqual({
    solar: { "2024-01-01": 5.5 },
    windSpeed: { "2024-01-01": 3.2 },
    windDirection: { "2024-01-01": 180 },
  });
  expect(fetchImplementation).toHaveBeenCalledTimes(2);
});

test("rejects a non-successful HTTP response before parsing JSON", async () => {
  const failedResponse = response({}, { ok: false, status: 503 });
  const fetchImplementation = vi.fn().mockResolvedValue(failedResponse);

  await expect(
    fetchStationClimate(site, dateWindow, fetchImplementation)
  ).rejects.toThrow("Solar request failed with status 503.");
  expect(failedResponse.json).not.toHaveBeenCalled();
  expect(fetchImplementation).toHaveBeenCalledTimes(1);
});

test("rejects a successful response without the required parameter", async () => {
  const fetchImplementation = vi
    .fn()
    .mockResolvedValueOnce(response({ properties: { parameter: {} } }))
    .mockResolvedValueOnce(
      response({
        properties: {
          parameter: { WS2M: { 20240101: 3 }, WD2M: { 20240101: 180 } },
        },
      })
    );

  await expect(
    fetchStationClimate(site, dateWindow, fetchImplementation)
  ).rejects.toThrow("Solar response did not include ALLSKY_SFC_SW_DWN data.");
});

test("normalizes network failures", async () => {
  const fetchImplementation = vi
    .fn()
    .mockRejectedValue(new TypeError("Network unavailable"));

  await expect(
    fetchStationClimate(site, dateWindow, fetchImplementation)
  ).rejects.toThrow("Solar request could not be completed.");
});
