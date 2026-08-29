export function UploadErrors({ errors }) {
  if (!errors.length) return null;

  return (
    <div className="status-message status-message--error" role="alert">
      <strong>The spreadsheet could not be accepted</strong>
      <ul>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
}

export function UploadEmptyState() {
  return (
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
  );
}
