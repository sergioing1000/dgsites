import {
  parseSiteSpreadsheet,
  validateSpreadsheetFile,
} from "./siteSpreadsheet";

test("accepts supported spreadsheet extensions case-insensitively", () => {
  expect(validateSpreadsheetFile({ name: "sites.XLSX" })).toEqual([]);
  expect(validateSpreadsheetFile({ name: "sites.xls" })).toEqual([]);
});

test("rejects spreadsheet files larger than 5 MiB", () => {
  expect(
    validateSpreadsheetFile({
      name: "sites.xlsx",
      size: 5 * 1024 * 1024 + 1,
    })
  ).toEqual(["The spreadsheet must not exceed 5 MiB."]);
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
      "Row 3: State is required; Latitude must be between -4.23 and 12.44; Longitude must be between -79.09 and -66.88.",
    ],
  });
});

test("rejects coordinates outside the backend coverage for Colombia", () => {
  expect(
    parseSiteSpreadsheet([
      ["EB", "State", "Lat", "Long"],
      ["Station A", "Outside", 20, -74],
    ])
  ).toEqual({
    sites: [],
    errors: ["Row 2: Latitude must be between -4.23 and 12.44."],
  });
});

test("rejects spreadsheets with more than 100 site rows", () => {
  const rows = Array.from({ length: 101 }, (_, index) => [
    `Station ${index + 1}`,
    "State",
    4.6,
    -74.1,
  ]);

  expect(
    parseSiteSpreadsheet([["EB", "State", "Lat", "Long"], ...rows])
  ).toEqual({
    sites: [],
    errors: ["The spreadsheet must not contain more than 100 site rows."],
  });
});

test("rejects an empty spreadsheet", () => {
  expect(parseSiteSpreadsheet([])).toEqual({
    sites: [],
    errors: ["The spreadsheet is empty."],
  });
});
