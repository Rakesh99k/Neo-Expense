/**
 * FilterSelect
 * Styled dropdown for filters.
 * Props:
 *   value, onChange — controlled select
 *   options — array of { value, label } or plain strings
 *   placeholder — first "All" option label
 *   name, id
 */
export default function FilterSelect({
  value,
  onChange,
  options = [],
  placeholder = 'All',
  name,
  id
}) {
  return (
    <div className="filter-select-wrapper">
      <select
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        className="filter-select"
      >
        <option value="">{placeholder}</option>
        {options.map(opt => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const label = typeof opt === 'string' ? opt : opt.label;
          return <option key={val} value={val}>{label}</option>;
        })}
      </select>
      <span className="filter-select-arrow">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
    </div>
  );
}