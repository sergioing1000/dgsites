export default function BatchProgress({ currentStation, progress }) {
  return (
    <div aria-live="polite" className="batch-progress" role="status">
      <div className="batch-progress__copy">
        <div>
          <span className="activity-dot" />
          <strong>Processing station data</strong>
        </div>
        <span>{progress}%</span>
      </div>
      <p>{currentStation || "Preparing requests…"}</p>
      <progress
        aria-label={`${progress}% complete`}
        className="progress-track"
        max="100"
        value={progress}
      >
        {progress}%
      </progress>
    </div>
  );
}
