import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';

const ReusableSelect = ({
  name,
  value,
  className = '',
  onChange,
  onFocus,
  options,
  dependantOn,
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

  useEffect(() => {
    let needsSet = false;
    let firstItem = '';
    options.map((option) => {
      firstItem =
        option.validFor &&
        option.validFor.includes(dependantOn) &&
        firstItem == ''
          ? option.id
          : firstItem;
      needsSet =
        option.validFor && !option.validFor.includes(dependantOn)
          ? true
          : needsSet;
    });
    // console.log(name, needsSet, firstItem, dependantOn);
    if (needsSet) {
      onChange({ target: { name, value: firstItem } });
      setInternalValue(firstItem);
    }
  }, [dependantOn]);

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
        onFocus={(e) => {
          if (onFocus) {
            onFocus();
          }
        }}
        disabled={disabled}
      >
        {options.map((option) => (
          <option
            key={option.id}
            value={option.id}
            disabled={
              option.validFor && !option.validFor.includes(dependantOn)
                ? 'disabled'
                : ''
            }
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ReusableSelect;
