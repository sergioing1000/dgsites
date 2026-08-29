const COLUMNS = [
  ["baseStation", "Base station"],
  ["state", "State"],
  ["latitude", "Latitude"],
  ["longitude", "Longitude"],
  ["load", "Load"],
];

function SortIndicator({ active, direction }) {
  return (
    <span aria-hidden="true" className="sort-indicator">
      {active ? (direction === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );
}

export default function SitesTable({
  onSelect,
  onSort,
  rows,
  sortConfig,
}) {
  return (
    <div className="table-scroll" tabIndex="0">
      <table className="sites-table">
        <caption className="sr-only">
          Uploaded stations. Select a station name to inspect it on a map.
        </caption>
        <thead>
          <tr>
            {COLUMNS.map(([key, label]) => {
              const active = sortConfig.key === key;
              return (
                <th
                  aria-sort={
                    active
                      ? sortConfig.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  key={key}
                  scope="col"
                >
                  <button onClick={() => onSort(key)} type="button">
                    {label}
                    <SortIndicator
                      active={active}
                      direction={sortConfig.direction}
                    />
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={`${row.baseStation}-${row.latitude}-${row.longitude}`}
            >
              <th scope="row">
                <button
                  className="station-link"
                  onClick={() => onSelect(row)}
                  type="button"
                >
                  {row.baseStation}
                </button>
              </th>
              <td>{row.state}</td>
              <td className="numeric-cell">{row.latitude}</td>
              <td className="numeric-cell">{row.longitude}</td>
              <td>{row.load || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
