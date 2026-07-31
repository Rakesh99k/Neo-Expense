/**
 * SearchInput
 * Text input with a search icon prefix.
 * Props:
 *   value, onChange — controlled input
 *   placeholder — placeholder text
 *   onClear — optional callback shown as X button
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  onClear
}) {
  return (
    <div className="search-input">
      <span className="search-input-icon">
        <IconSearch />
      </span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-input-field"
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="search-input-clear"
          aria-label="Clear search"
        >
          <IconX />
        </button>
      )}
    </div>
  );
}

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}

function IconX() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}