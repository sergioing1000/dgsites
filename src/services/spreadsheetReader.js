import {
  parseSiteSpreadsheet,
  validateSpreadsheetFile,
} from "../domain/siteSpreadsheet";

export class SpreadsheetReadError extends Error {
  constructor(messages) {
    super(messages[0]);
    this.name = "SpreadsheetReadError";
    this.messages = messages;
  }
}

export const readSiteSpreadsheet = (file) => {
  const fileErrors = validateSpreadsheetFile(file);
  if (fileErrors.length) {
    return Promise.reject(new SpreadsheetReadError(fileErrors));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const XLSX = await import("xlsx");
        const workbook = XLSX.read(new Uint8Array(event.target.result), {
          type: "array",
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        if (!sheetName || !worksheet) {
          throw new SpreadsheetReadError([
            "Spreadsheet does not contain a worksheet.",
          ]);
        }

        const matrix = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const result = parseSiteSpreadsheet(matrix);
        if (result.errors.length) throw new SpreadsheetReadError(result.errors);
        resolve(result.sites);
      } catch (error) {
        reject(
          error instanceof SpreadsheetReadError
            ? error
            : new SpreadsheetReadError([
                "The spreadsheet could not be read. Verify that the file is not corrupted.",
              ])
        );
      }
    };

    reader.onerror = () => {
      reject(
        new SpreadsheetReadError([
          "The spreadsheet file could not be loaded.",
        ])
      );
    };

    reader.readAsArrayBuffer(file);
  });
};
