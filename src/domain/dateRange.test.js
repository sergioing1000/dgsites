import { buildReportPayload, calculateDateRange } from "./dateRange";

const now = new Date("2026-08-25T12:00:00.000Z");

test("calculates the last 30 days deterministically", () => {
  expect(
    calculateDateRange({ useCustomDates: false, years: "30" }, now)
  ).toEqual({ start: "2026-07-26", end: "2026-08-25" });
});

test("calculates historic month ranges", () => {
  expect(
    calculateDateRange({ useCustomDates: false, years: "12" }, now)
  ).toEqual({ start: "2025-08-25", end: "2026-08-25" });
});

test("preserves custom dates and builds the backend payload", () => {
  expect(
    buildReportPayload(
      {
        latitude: "4.6097",
        longitude: "-74.0817",
        useCustomDates: true,
        startDate: "2026-08-18",
        endDate: "2026-08-19",
      },
      now
    )
  ).toEqual({
    station_name: "Station Site A",
    latitude: 4.6097,
    longitude: -74.0817,
    start: "2026-08-18",
    end: "2026-08-19",
  });
});
