import { useState } from 'react';

/**
 * InputWithIcon
 * Text input with leading icon and label.
 * Props:
 *   label — text above input
 *   icon — element rendered inside on the left
 *   type — html input type
 *   value, onChange — controlled input
 *   placeholder — placeholder text
 *   error — error message (shown below input)
 *   autoComplete — autocomplete hint
 *   name, id — form field identifiers
 */
export default function InputWithIcon({
  label,
  icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  name,
  id
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="input-group">
      {label && <label htmlFor={id || name} className="input-label">{label}</label>}
      <div className={`input-wrapper ${focused ? 'focused' : ''} ${error ? 'has-error' : ''}`}>
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="input-field"
        />
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}