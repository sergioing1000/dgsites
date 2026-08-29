const GUIDES = [
  {
    number: "01",
    title: "Single site",
    body: "Choose one coordinate and a time range. The service returns an Excel report for that point.",
  },
  {
    number: "02",
    title: "Station portfolio",
    body: "Use the template for several Colombian stations. Validate the table before generating the combined workbook.",
  },
  {
    number: "03",
    title: "Current position",
    body: "Let the browser read your coordinates, then send them directly into the single-site workflow.",
  },
];

export default function Docs() {
  return (
    <div className="docs-workspace">
      <div className="docs-intro section-heading">
        <p className="eyebrow">Operating guide</p>
        <h2>From coordinates to a usable workbook</h2>
        <p>
          Three routes to the same source: NASA POWER meteorological data,
          prepared for engineering review.
        </p>
      </div>

      <ol className="guide-list">
        {GUIDES.map((guide) => (
          <li key={guide.number}>
            <span>{guide.number}</span>
            <div>
              <h3>{guide.title}</h3>
              <p>{guide.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <aside className="data-reference">
        <div>
          <p className="eyebrow">Data reference</p>
          <h3>What the reports contain</h3>
        </div>
        <dl>
          <div>
            <dt>Solar</dt>
            <dd>Daily irradiation · kWh/m²/day</dd>
          </div>
          <div>
            <dt>Wind</dt>
            <dd>Speed and direction at 2 m</dd>
          </div>
          <div>
            <dt>Area</dt>
            <dd>Coordinates within Colombia</dd>
          </div>
        </dl>
        <a
          className="text-action text-action--light"
          href="https://power.larc.nasa.gov/docs/"
          rel="noreferrer"
          target="_blank"
        >
          Open NASA POWER documentation ↗
        </a>
      </aside>
    </div>
  );
}
