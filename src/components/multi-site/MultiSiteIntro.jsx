import templateArchive from "../../assets/sitestemplate.zip";

export default function MultiSiteIntro({ onFileChange }) {
  return (
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
          onChange={onFileChange}
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
  );
}
