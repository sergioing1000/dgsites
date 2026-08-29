import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const average = (values) =>
  values.reduce((total, value) => total + value, 0) / values.length;

const buildClimateRows = (results) => {
  const solarRows = [];
  const windRows = [];

  results.forEach(({ site, climate }) => {
    const base = {
      baseStation: site.baseStation,
      state: site.state,
      latitude: site.latitude,
      longitude: site.longitude,
      load: site.load,
    };

    solarRows.push({
      ...base,
      ...Object.fromEntries(
        Object.entries(climate.solar).map(([date, value]) => [
          `Solar_${date}`,
          value,
        ])
      ),
    });

    windRows.push({
      ...base,
      ...Object.fromEntries(
        Object.entries(climate.windSpeed).map(([date, value]) => [
          `WS2M_${date}`,
          value,
        ])
      ),
      ...Object.fromEntries(
        Object.entries(climate.windDirection).map(([date, value]) => [
          `WD2M_${date}`,
          value,
        ])
      ),
    });
  });

  return { solarRows, windRows };
};

const addDataSheet = (workbook, name, rows) => {
  const sheet = workbook.addWorksheet(name);
  const headers = Object.keys(rows[0] ?? {});
  sheet.addRow(headers);
  rows.forEach((row) => sheet.addRow(headers.map((key) => row[key] ?? "")));
  sheet.views = [{ state: "frozen", xSplit: 5, ySplit: 1 }];
  sheet.columns.forEach((column) => {
    let width = 10;
    column.eachCell({ includeEmpty: true }, (cell) => {
      width = Math.max(width, String(cell.value ?? "").length);
    });
    column.width = width + 2;
  });
};

const collectMonthlyValues = (rows, prefix, targetKey, summary) => {
  rows.forEach((row) => {
    Object.entries(row).forEach(([key, value]) => {
      if (!key.startsWith(`${prefix}_`)) return;

      const month = key.slice(prefix.length + 1, prefix.length + 8);
      const summaryKey = `${row.baseStation}-${month}`;
      const entry = summary.get(summaryKey) ?? {
        baseStation: row.baseStation,
        state: row.state,
        latitude: row.latitude,
        longitude: row.longitude,
        month,
        solar: [],
        wind: [],
        direction: [],
      };
      entry[targetKey].push(Number(value));
      summary.set(summaryKey, entry);
    });
  });
};

const addSummarySheet = (workbook, solarRows, windRows) => {
  const sheet = workbook.addWorksheet("Summary");
  sheet.addRow([
    "Base Station",
    "State",
    "Latitude",
    "Longitude",
    "Month",
    "Avg Solar Radiation (kWh/m²/day)",
    "Avg Wind Speed (m/s)",
    "Avg Wind Direction (degrees)",
  ]);
  sheet.addRow(["", "", "", "", "", "kWh/m²/day", "m/s", "degrees"]);

  const summary = new Map();
  collectMonthlyValues(solarRows, "Solar", "solar", summary);
  collectMonthlyValues(windRows, "WS2M", "wind", summary);
  collectMonthlyValues(windRows, "WD2M", "direction", summary);

  summary.forEach((entry) => {
    sheet.addRow([
      entry.baseStation,
      entry.state,
      entry.latitude,
      entry.longitude,
      entry.month,
      entry.solar.length ? average(entry.solar).toFixed(2) : "",
      entry.wind.length ? average(entry.wind).toFixed(2) : "",
      entry.direction.length ? average(entry.direction).toFixed(0) : "",
    ]);
  });

  sheet.views = [{ state: "frozen", ySplit: 2 }];
  sheet.columns.forEach((column) => {
    let width = 12;
    column.eachCell({ includeEmpty: true }, (cell) => {
      width = Math.max(width, String(cell.value ?? "").length);
    });
    column.width = width + 2;
  });
};

export const exportWeatherWorkbook = async (results) => {
  const workbook = new ExcelJS.Workbook();
  const { solarRows, windRows } = buildClimateRows(results);

  addDataSheet(workbook, "Solar", solarRows);
  addDataSheet(workbook, "Wind", windRows);
  addSummarySheet(workbook, solarRows, windRows);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "weather-results.xlsx");
};
