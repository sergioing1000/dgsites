export default function ReportFeedback({ report }) {
  if (report.status === "pending") {
    return (
      <div className="inline-status" data-testid="loader" role="status">
        <span className="activity-dot" />
        NASA POWER is preparing the weather workbook.
      </div>
    );
  }

  if (report.error) {
    return (
      <div className="status-message status-message--error" role="alert">
        <strong>Report unavailable</strong>
        <span>{report.error}</span>
      </div>
    );
  }

  if (!report.file) return null;

  return (
    <div className="download-result" role="status">
      <div>
        <span className="download-result__icon" aria-hidden="true">
          XLSX
        </span>
        <p>
          <strong>Your report is ready</strong>
          <small>{report.file.fileName}</small>
        </p>
      </div>
      <a
        className="button button--download"
        download={report.file.fileName}
        href={report.file.url}
      >
        Download Excel file
      </a>
    </div>
  );
}
