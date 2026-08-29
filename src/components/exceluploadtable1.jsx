import { useState } from "react";

import BatchFeedback from "./multi-site/BatchFeedback";
import MultiSiteIntro from "./multi-site/MultiSiteIntro";
import SitesTable from "./multi-site/SitesTable";
import SitesToolbar from "./multi-site/SitesToolbar";
import StationMapDialog from "./multi-site/StationMapDialog";
import TableFooter from "./multi-site/TableFooter";
import { UploadEmptyState, UploadErrors } from "./multi-site/UploadState";
import useSitesTable from "./multi-site/useSitesTable";
import useSpreadsheetSites from "./multi-site/useSpreadsheetSites";
import useWeatherWorkbook from "./multi-site/useWeatherWorkbook";

import "./exceluploadtable1.css";
import "leaflet/dist/leaflet.css";

export default function ExcelUploadTable() {
  const spreadsheet = useSpreadsheetSites();
  const table = useSitesTable(spreadsheet.sites);
  const batch = useWeatherWorkbook(spreadsheet.sites);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleFileChange = (event) => {
    table.actions.reset();
    batch.reset();
    setSelectedLocation(null);
    spreadsheet.readFile(event);
  };

  return (
    <div className="multi-site-workspace">
      <MultiSiteIntro onFileChange={handleFileChange} />
      <UploadErrors errors={spreadsheet.errors} />

      {!spreadsheet.sites.length && !spreadsheet.errors.length && (
        <UploadEmptyState />
      )}

      {spreadsheet.sites.length > 0 && (
        <div className="station-data">
          <SitesToolbar siteCount={spreadsheet.sites.length} table={table} />
          <SitesTable
            onSelect={setSelectedLocation}
            onSort={table.actions.sortBy}
            rows={table.visibleSites}
            sortConfig={table.sortConfig}
          />
          <TableFooter
            batchStatus={batch.status}
            onGenerate={batch.generate}
            table={table}
          />
        </div>
      )}

      <BatchFeedback batch={batch} />

      {selectedLocation && (
        <StationMapDialog
          onClose={() => setSelectedLocation(null)}
          station={selectedLocation}
        />
      )}
    </div>
  );
}
