export default function TableFooter({ batchStatus, onGenerate, table }) {
  return (
    <div className="table-footer">
      <div className="pagination" aria-label="Table pagination">
        <button
          aria-label="Previous page"
          disabled={table.page === 1}
          onClick={table.actions.previousPage}
          type="button"
        >
          ←
        </button>
        <span>
          Page {table.page} of {table.totalPages}
        </span>
        <button
          aria-label="Next page"
          disabled={table.page === table.totalPages}
          onClick={table.actions.nextPage}
          type="button"
        >
          →
        </button>
      </div>

      <button
        aria-label="API"
        className="button button--primary"
        disabled={batchStatus === "pending"}
        onClick={onGenerate}
        type="button"
      >
        {batchStatus === "pending"
          ? "Processing…"
          : "Generate weather workbook"}
      </button>
    </div>
  );
}
