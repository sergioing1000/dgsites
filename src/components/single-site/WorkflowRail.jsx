export default function WorkflowRail({ step }) {
  return (
    <aside className="workflow-rail" aria-label="Report progress">
      <p className="eyebrow">Single-site report</p>
      <ol>
        <li className={step === 1 ? "is-active" : "is-complete"}>
          <span>01</span>
          <div>
            <strong>Position</strong>
            <small>Coordinates</small>
          </div>
        </li>
        <li className={step === 2 ? "is-active" : ""}>
          <span>02</span>
          <div>
            <strong>Period</strong>
            <small>Date window</small>
          </div>
        </li>
      </ol>
      <div className="coverage-note">
        <span aria-hidden="true">CO</span>
        <p>
          <strong>Coverage</strong>
          Colombia · daily solar and wind observations
        </p>
      </div>
    </aside>
  );
}
