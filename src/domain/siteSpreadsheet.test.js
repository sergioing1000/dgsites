import {
  parseSiteSpreadsheet,
  validateSpreadsheetFile,
} from "./siteSpreadsheet";

test("accepts supported spreadsheet extensions case-insensitively", () => {
  expect(validateSpreadsheetFile({ name: "sites.XLSX" })).toEqual([]);
  expect(validateSpreadsheetFile({ name: "sites.xls" })).toEqual([]);
});

test("maps required columns by header instead of position", () => {
  expect(
    parseSiteSpreadsheet([
      ["Longitude", "State", "Load", "Base Station", "Latitude"],
      [-74.0817, "Cundinamarca", 50, "Station A", 4.6097],
    ])
  ).toEqual({
    sites: [
      {
        baseStation: "Station A",
        state: "Cundinamarca",
        latitude: 4.6097,
        longitude: -74.0817,
        load: 50,
      },
    ],
    errors: [],
  });
});

test("supports the headers in the published template", () => {
  expect(
    parseSiteSpreadsheet([
      ["Site", "EB", "State", "Lat", "Long"],
      [1, "Station A", "State A", 4.6097, -74.0817],
    ])
  ).toEqual({
    sites: [
      {
        baseStation: "Station A",
        state: "State A",
        latitude: 4.6097,
        longitude: -74.0817,
        load: "",
      },
    ],
    errors: [],
  });
});

test("reports all missing required columns", () => {
  expect(parseSiteSpreadsheet([["Site", "Name"]])).toEqual({
    sites: [],
    errors: ["Missing required columns: EB, State, Lat, Long."],
  });
});

test("rejects the complete upload when a row is invalid", () => {
  expect(
    parseSiteSpreadsheet([
      ["EB", "State", "Lat", "Long"],
      ["Station A", "State A", 4.6097, -74.0817],
      ["Station B", "", 95, -181],
    ])
  ).toEqual({
    sites: [],
    errors: [
      "Row 3: State is required; Latitude must be between -90 and 90; Longitude must be between -180 and 180.",
    ],
  });
});

test("rejects an empty spreadsheet", () => {
  expect(parseSiteSpreadsheet([])).toEqual({
    sites: [],
    errors: ["The spreadsheet is empty."],
  });
});
