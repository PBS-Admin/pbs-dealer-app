import React, { useState, useEffect } from 'react';

const formatRoofPitch = (value) => {
  return value == '' ? '' : value || value == 0 ? `${value}:12` : '';
};

const parseRoofPitch = (input) => {
  // Handle inputs starting with a dot
  if (input.startsWith('.')) {
    input = '0' + input;
  }

  const match = input.match(/^(\d*(?:\.\d+)?)/);
  if (match) {
    const value = parseFloat(match[1]);
    return !isNaN(value) && value >= 0 && value <= 12
      ? value
      : input == ''
        ? ''
        : null;
  }
  return input == '' ? '' : null;
};

const RoofPitchInput = ({
  value,
  name,
  label,
  labelClass,
  onChange,
  onFocus,
  calc,
  onCalc,
  placeholder = 'x:12',
  disabled,
}) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue(formatRoofPitch(value));
  }, [value]);

  const handleInputChange = (e) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);
  };

  const handleBlur = () => {
    const parsed = parseRoofPitch(inputValue);
    if (parsed !== null) {
      onChange(name, parsed);
      setInputValue(formatRoofPitch(parsed));
    } else {
      // Reset to the last valid value
      setInputValue(formatRoofPitch(value));
    }
  };

  const calcClass = calc ? 'calcInput' : '';

  return (
    <div className="cardInput">
      <div className={`${calcClass} ${labelClass}`}>
        <label className={labelClass} htmlFor={name}>
          {label}
        </label>
        {calc && (
          <button type="button" onClick={onCalc}>
            Calc
          </button>
        )}
      </div>
      <input
        type="text"
        id={name}
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={(e) => {
          e.target.select();
          if (onFocus) {
            onFocus();
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default RoofPitchInput;
