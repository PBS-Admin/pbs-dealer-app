import React, { useEffect, useState } from 'react';

const ReusableSelect = ({
  id,
  name,
  value,
  onChange,
  options,
  label,
  labelHide,
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
    <div className="cardInput">
      <label className={labelHide} htmlFor={id}>
        {label}
      </label>
      <select
        className="selectInput"
        id={id}
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
