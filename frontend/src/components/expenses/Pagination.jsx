import { motion } from 'framer-motion';

/**
 * Pagination
 * Bottom pagination bar with range info and controls.
 */
export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIdx = (page - 1) * pageSize + 1;
  const endIdx = Math.min(total, page * pageSize);

  function go(delta) {
    const next = Math.min(Math.max(1, page + delta), totalPages);
    if (next !== page) onPageChange(next);
  }

  return (
    <motion.div
      className="pagination"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="pagination-info">
        <span className="pagination-range">
          {total ? `${startIdx}–${endIdx}` : '0'} of {total}
        </span>
        <select
          className="pagination-select"
          value={pageSize}
          onChange={e => onPageSizeChange(parseInt(e.target.value, 10))}
        >
          {[10, 25, 50, 100].map(sz => (
            <option key={sz} value={sz}>{sz} per page</option>
          ))}
        </select>
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={() => go(-1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <IconChevronLeft />
          <span>Prev</span>
        </button>
        <span className="pagination-page">
          Page <strong>{page}</strong> / {totalPages}
        </span>
        <button
          className="pagination-btn"
          onClick={() => go(1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <span>Next</span>
          <IconChevronRight />
        </button>
      </div>
    </motion.div>
  );
}

function IconChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}