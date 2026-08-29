import { useMemo, useState } from "react";

import templateArchive from "../assets/sitestemplate.zip";
import { calculateWeatherDateWindow } from "../services/weatherDataApi";
import { fetchWeatherBatch } from "../services/multiSiteWeather";
import {
  readSiteSpreadsheet,
  SpreadsheetReadError,
} from "../services/spreadsheetReader";
import BatchProgress from "./multi-site/BatchProgress";
import SitesTable from "./multi-site/SitesTable";
import StationMapDialog from "./multi-site/StationMapDialog";

import "./exceluploadtable1.css";
import "leaflet/dist/leaflet.css";

const EMPTY_BATCH = Object.freeze({
  status: "idle",
  progress: 0,
  currentStation: "",
  errors: [],
});

const collator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

export default function ExcelUploadTable() {
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "baseStation",
    direction: "asc",
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [batch, setBatch] = useState(EMPTY_BATCH);

  const filteredData = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase();
    if (!query) return tableData;
    return tableData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLocaleLowerCase().includes(query)
      )
    );
  }, [searchTerm, tableData]);

  const sortedData = useMemo(
    () =>
      [...filteredData].sort((left, right) => {
        const comparison = collator.compare(
          String(left[sortConfig.key] ?? ""),
          String(right[sortConfig.key] ?? "")
        );
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }),
    [filteredData, sortConfig]
  );

  const totalPages = Math.max(1, Math.ceil(sortedData.length / rowsPerPage));
  const visiblePage = Math.min(currentPage, totalPages);
  const paginatedData = useMemo(() => {
    const start = (visiblePage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, visiblePage, rowsPerPage]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadErrors([]);
    setBatch(EMPTY_BATCH);
    setTableData([]);
    setCurrentPage(1);

    try {
      const sites = await readSiteSpreadsheet(file);
      setTableData(sites);
    } catch (error) {
      setUploadErrors(
        error instanceof SpreadsheetReadError
          ? error.messages
          : ["The spreadsheet file could not be loaded."]
      );
    } finally {
      event.target.value = "";
    }
  };

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const generateWorkbook = async () => {
    setBatch({
      status: "pending",
      progress: 0,
      currentStation: "",
      errors: [],
    });

    try {
      const { results, errors } = await fetchWeatherBatch(
        tableData,
        calculateWeatherDateWindow(),
        {
          concurrency: 3,
          onProgress: ({ completed, total, site }) => {
            setBatch((current) => ({
              ...current,
              currentStation: site.baseStation,
              progress: Math.round((completed / total) * 100),
            }));
          },
        }
      );

      if (errors.length) {
        setBatch({
          status: "error",
          progress: 0,
          currentStation: "",
          errors,
        });
        return;
      }

      const { exportWeatherWorkbook } = await import(
        "../services/weatherWorkbook"
      );
      await exportWeatherWorkbook(results);
      setBatch({
        status: "success",
        progress: 100,
        currentStation: "",
        errors: [],
      });
    } catch {
      setBatch({
        status: "error",
        progress: 0,
        currentStation: "",
        errors: ["The results file could not be generated."],
      });
    }
  };

  return (
    <div className="multi-site-workspace">
      <div className="multi-site-intro">
        <div className="section-heading">
          <p className="eyebrow">Multi-site report</p>
          <h2>Process a station portfolio</h2>
          <p>
            Upload the approved spreadsheet, inspect the stations, then export
            one workbook with solar, wind and monthly summaries.
          </p>
        </div>

        <div className="upload-control">
          <input
            accept=".xlsx,.xls"
            id="station-spreadsheet"
            onChange={handleFileUpload}
            type="file"
          />
          <label className="button button--primary" htmlFor="station-spreadsheet">
            <span aria-hidden="true">＋</span>
            Choose spreadsheet
          </label>
          <a className="template-link" download href={templateArchive}>
            Download Excel template
          </a>
        </div>
      </div>

      {uploadErrors.length > 0 && (
        <div className="status-message status-message--error" role="alert">
          <strong>The spreadsheet could not be accepted</strong>
          <ul>
            {uploadErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {tableData.length === 0 && uploadErrors.length === 0 && (
        <div className="upload-empty-state">
          <span aria-hidden="true">XLS</span>
          <p>
            <strong>No stations loaded</strong>
            Start from the template to preserve the required column names.
          </p>
          <dl>
            <div>
              <dt>Format</dt>
              <dd>.xls or .xlsx</dd>
            </div>
            <div>
              <dt>Coverage</dt>
              <dd>Colombia</dd>
            </div>
          </dl>
        </div>
      )}

      {tableData.length > 0 && (
        <div className="station-data">
          <div className="table-toolbar">
            <div>
              <p className="table-count">Total sites loaded: {sortedData.length}</p>
              <span>{tableData.length} validated records</span>
            </div>
            <div className="table-controls">
              <label>
                <span className="sr-only">Search stations</span>
                <input
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search stations"
                  type="search"
                  value={searchTerm}
                />
              </label>
              <label>
                <span className="sr-only">Rows per page</span>
                <select
                  onChange={(event) => {
                    setRowsPerPage(Number(event.target.value));
                    setCurrentPage(1);
                  }}
                  value={rowsPerPage}
                >
                  <option value="10">10 rows</option>
                  <option value="20">20 rows</option>
                  <option value="50">50 rows</option>
                </select>
              </label>
            </div>
          </div>

          <SitesTable
            onSelect={(row) => setSelectedLocation(row)}
            onSort={handleSort}
            rows={paginatedData}
            sortConfig={sortConfig}
          />

          <div className="table-footer">
            <div className="pagination" aria-label="Table pagination">
              <button
                aria-label="Previous page"
                disabled={visiblePage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
                type="button"
              >
                ←
              </button>
              <span>
                Page {visiblePage} of {totalPages}
              </span>
              <button
                aria-label="Next page"
                disabled={visiblePage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
                type="button"
              >
                →
              </button>
            </div>

            <button
              aria-label="API"
              className="button button--primary"
              disabled={batch.status === "pending"}
              onClick={generateWorkbook}
              type="button"
            >
              {batch.status === "pending"
                ? "Processing…"
                : "Generate weather workbook"}
            </button>
          </div>
        </div>
      )}

      {batch.status === "pending" && (
        <BatchProgress
          currentStation={batch.currentStation}
          progress={batch.progress}
        />
      )}

      {batch.status === "error" && (
        <div className="status-message status-message--error" role="alert">
          <strong>The report was not generated</strong>
          <ul>
            {batch.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {batch.status === "success" && (
        <div className="status-message status-message--success" role="status">
          <strong>Workbook exported</strong>
          <span>The download includes solar, wind and summary worksheets.</span>
        </div>
      )}

      {selectedLocation && (
        <StationMapDialog
          onClose={() => setSelectedLocation(null)}
          station={selectedLocation}
        />
      )}
    </div>
  );
}
