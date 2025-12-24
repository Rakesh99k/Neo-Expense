/**
 * Pagination
 * Stateless pagination controls with page-size selector.
 * Props:
 * - page: number (1-based)
 * - pageSize: number
 * - total: number (total items)
 * - onPageChange: (nextPage) => void
 * - onPageSizeChange: (size) => void
 */
import React from 'react'; // functional, stateless pagination controls

export default function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }) { // render pager UI
  const totalPages = Math.max(1, Math.ceil(total / pageSize)); // compute number of pages

  function go(delta) { // advance or go back by delta pages
    const next = Math.min(Math.max(1, page + delta), totalPages); // clamp within [1, totalPages]
    if (next !== page) onPageChange(next); // notify only if changed
  }

  const startIdx = (page - 1) * pageSize + 1; // first index on current page (1-based)
  const endIdx = Math.min(total, page * pageSize); // last index on current page

  return (
    <div className="pagination-bar"> {/* container */}
      <div className="pagination-left"> {/* range + size picker */}
        <span className="range">{total ? `${startIdx}–${endIdx}` : '0'} of {total}</span> {/* visible range */}
        <select
          className="page-size-select" // style
          value={pageSize} // current option
          onChange={e => onPageSizeChange(parseInt(e.target.value, 10))} // notify size change
        >
          {[10,25,50,100].map(sz => <option key={sz} value={sz}>{sz}/page</option>)} {/* options */}
        </select>
      </div>
      <div className="pagination-controls"> {/* prev/next */}
        <button className="btn-inline" onClick={() => go(-1)} disabled={page === 1}>Prev</button>
        <span className="page-indicator">Page {page} / {totalPages}</span> {/* indicator */}
        <button className="btn-inline" onClick={() => go(1)} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
}
