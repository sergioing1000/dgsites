import { validateReportCoordinates } from "./siteValidation";

const MAX_SPREADSHEET_BYTES = 5 * 1024 * 1024;
const MAX_SITE_ROWS = 100;

const REQUIRED_COLUMNS = [
  { key: "baseStation", label: "EB", aliases: ["eb", "base station"] },
  { key: "state", label: "State", aliases: ["state"] },
  { key: "latitude", label: "Lat", aliases: ["lat", "latitude"] },
  {
    key: "longitude",
    label: "Long",
    aliases: ["long", "lng", "longitude"],
  },
];

const OPTIONAL_COLUMNS = [
  { key: "load", aliases: ["load"] },
];

const normalizeHeader = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const isBlankRow = (row) =>
  !Array.isArray(row) || row.every((value) => String(value ?? "").trim() === "");

const findColumnIndex = (headers, aliases) =>
  headers.findIndex((header) => aliases.includes(header));

export const validateSpreadsheetFile = (file) => {
  if (!file) return ["Please select a spreadsheet file."];
  if (!/\.(xlsx|xls)$/i.test(file.name || "")) {
    return ["Unsupported file type. Please upload an .xls or .xlsx file."];
  }
  if (Number.isFinite(file.size) && file.size > MAX_SPREADSHEET_BYTES) {
    return ["The spreadsheet must not exceed 5 MiB."];
  }
  return [];
};

export const parseSiteSpreadsheet = (matrix) => {
  if (!Array.isArray(matrix) || matrix.length === 0 || isBlankRow(matrix[0])) {
    return { sites: [], errors: ["The spreadsheet is empty."] };
  }

  const headers = matrix[0].map(normalizeHeader);
  const requiredIndexes = Object.fromEntries(
    REQUIRED_COLUMNS.map((column) => [
      column.key,
      findColumnIndex(headers, column.aliases),
    ])
  );
  const missingColumns = REQUIRED_COLUMNS.filter(
    (column) => requiredIndexes[column.key] === -1
  );

  if (missingColumns.length > 0) {
    return {
      sites: [],
      errors: [
        `Missing required columns: ${missingColumns
          .map((column) => column.label)
          .join(", ")}.`,
      ],
    };
  }

  const optionalIndexes = Object.fromEntries(
    OPTIONAL_COLUMNS.map((column) => [
      column.key,
      findColumnIndex(headers, column.aliases),
    ])
  );
  const dataRows = matrix
    .slice(1)
    .map((row, index) => ({ row, rowNumber: index + 2 }))
    .filter(({ row }) => !isBlankRow(row));

  if (dataRows.length === 0) {
    return {
      sites: [],
      errors: ["The spreadsheet does not contain any site rows."],
    };
  }

  if (dataRows.length > MAX_SITE_ROWS) {
    return {
      sites: [],
      errors: ["The spreadsheet must not contain more than 100 site rows."],
    };
  }

  const sites = [];
  const errors = [];

  dataRows.forEach(({ row, rowNumber }) => {
    const baseStation = String(row[requiredIndexes.baseStation] ?? "").trim();
    const state = String(row[requiredIndexes.state] ?? "").trim();
    const latitude = row[requiredIndexes.latitude];
    const longitude = row[requiredIndexes.longitude];
    const rowMessages = [];

    if (!baseStation) rowMessages.push("Base Station is required");
    if (!state) rowMessages.push("State is required");

    const coordinateErrors = validateReportCoordinates({ latitude, longitude });
    if (coordinateErrors.latitude) rowMessages.push(coordinateErrors.latitude);
    if (coordinateErrors.longitude) rowMessages.push(coordinateErrors.longitude);

    if (rowMessages.length > 0) {
      errors.push(`Row ${rowNumber}: ${rowMessages.join("; ")}.`);
      return;
    }

    const loadIndex = optionalIndexes.load;
    sites.push({
      baseStation,
      state,
      latitude: Number(latitude),
      longitude: Number(longitude),
      load: loadIndex === -1 ? "" : row[loadIndex] ?? "",
    });
  });

  return errors.length > 0 ? { sites: [], errors } : { sites, errors: [] };
};
