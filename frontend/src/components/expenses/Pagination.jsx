import React from 'react';

export default function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function go(delta) {
    const next = Math.min(Math.max(1, page + delta), totalPages);
    if (next !== page) onPageChange(next);
  }

  const startIdx = (page - 1) * pageSize + 1;
  const endIdx = Math.min(total, page * pageSize);

  return (
    <div className="pagination-bar">
      <div className="pagination-left">
        <span className="range">{total ? `${startIdx}–${endIdx}` : '0'} of {total}</span>
        <select
          className="page-size-select"
          value={pageSize}
          onChange={e => onPageSizeChange(parseInt(e.target.value, 10))}
        >
          {[10,25,50,100].map(sz => <option key={sz} value={sz}>{sz}/page</option>)}
        </select>
      </div>
      <div className="pagination-controls">
        <button className="btn-inline" onClick={() => go(-1)} disabled={page === 1}>Prev</button>
        <span className="page-indicator">Page {page} / {totalPages}</span>
        <button className="btn-inline" onClick={() => go(1)} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
}
