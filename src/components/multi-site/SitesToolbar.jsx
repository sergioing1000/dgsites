export default function SitesToolbar({ siteCount, table }) {
  return (
    <div className="table-toolbar">
      <div>
        <p className="table-count">Total sites loaded: {table.filteredCount}</p>
        <span>{siteCount} validated records</span>
      </div>
      <div className="table-controls">
        <label>
          <span className="sr-only">Search stations</span>
          <input
            onChange={(event) => table.actions.changeSearch(event.target.value)}
            placeholder="Search stations"
            type="search"
            value={table.searchTerm}
          />
        </label>
        <label>
          <span className="sr-only">Rows per page</span>
          <select
            onChange={(event) =>
              table.actions.changeRowsPerPage(event.target.value)
            }
            value={table.rowsPerPage}
          >
            <option value="10">10 rows</option>
            <option value="20">20 rows</option>
            <option value="50">50 rows</option>
          </select>
        </label>
      </div>
    </div>
  );
}
