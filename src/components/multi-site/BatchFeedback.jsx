import BatchProgress from "./BatchProgress";

export default function BatchFeedback({ batch }) {
  if (batch.status === "pending") {
    return (
      <BatchProgress
        currentStation={batch.currentStation}
        progress={batch.progress}
      />
    );
  }

  if (batch.status === "error") {
    return (
      <div className="status-message status-message--error" role="alert">
        <strong>The report was not generated</strong>
        <ul>
          {batch.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (batch.status !== "success") return null;

  return (
    <div className="status-message status-message--success" role="status">
      <strong>Workbook exported</strong>
      <span>The download includes solar, wind and summary worksheets.</span>
    </div>
  );
}
