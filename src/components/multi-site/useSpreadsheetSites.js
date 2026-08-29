import { useState } from "react";

import {
  readSiteSpreadsheet,
  SpreadsheetReadError,
} from "../../services/spreadsheetReader";

export default function useSpreadsheetSites() {
  const [sites, setSites] = useState([]);
  const [errors, setErrors] = useState([]);

  const readFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setErrors([]);
    setSites([]);

    try {
      setSites(await readSiteSpreadsheet(file));
    } catch (error) {
      setErrors(
        error instanceof SpreadsheetReadError
          ? error.messages
          : ["The spreadsheet file could not be loaded."]
      );
    } finally {
      event.target.value = "";
    }
  };

  return { errors, readFile, sites };
}
