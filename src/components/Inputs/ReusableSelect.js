import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';

const ReusableSelect = ({
  name,
  value,
  className = '',
  onChange,
  options,
  label,
  labelClass,
  icon = '',
  iconColor = '',
  iconOnClick = null,
  defaultValue,
  disabled,
}) => {
  const [internalValue, setInternalValue] = useState(
    value || defaultValue || ''
  );

  useEffect(() => {
    if (value !== undefined && value != '') {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange(e);
  };

  return (
    <div className={`cardInput ${className}`}>
      <label className={labelClass} htmlFor={name}>
        <span>{label}</span>
        {icon && (
          <button onClick={iconOnClick} className={`icon ${iconColor}`}>
            <FontAwesomeIcon icon={faCalculator} />
          </button>
        )}
      </label>
      <select
        className="selectInput"
        id={name}
        name={name}
        value={internalValue}
        onChange={handleChange}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ReusableSelect;
