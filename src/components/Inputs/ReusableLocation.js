import React, { useState, useEffect } from 'react';

const formatFeetInches = (value) => {
  const feet = Math.floor(value);
  const inches = Math.round((value - feet) * 12);
  return `${feet}'-${inches.toString().padStart(1, '0')}"`;
};

const parseFeetInput = (input) => {
  // Check for multiplier format (e.g., 4x20 or 3x20.5)
  const multiplierRegex = /^(\d+)x(\d+(?:\.\d+)?)$/;
  const multiplierMatch = input.match(multiplierRegex);
  if (multiplierMatch) {
    const count = parseInt(multiplierMatch[1], 10);
    const value = parseFloat(multiplierMatch[2]);
    return Array(count).fill(value);
  }

  // First, try to parse as a decimal number
  const parsed = parseFloat(input);
  if (!isNaN(parsed)) {
    return parsed;
  }

  // If not a simple number, try to parse feet and inches
  const regex = /(\d+)'?\s*-?\s*(\d+(?:\.\d+)?)?"/;
  const match = input.match(regex);
  if (match) {
    const feet = parseInt(match[1], 10);
    const inches = match[2] ? parseFloat(match[2]) : 0;
    return feet + inches / 12;
  }

  // If all else fails, return NaN
  return NaN;
};

const ReusableLocation = ({
  value,
  name,
  label,
  labelClass,
  className = '',
  onChange,
  onFocus,
  placeholder = `25'-0", 25'-0" or 4x20`,
  compareLabel,
  compareValue,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (value && Array.isArray(value)) {
      setInputValue(value.map(formatFeetInches).join(', '));
    }
  }, [value]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setError('');
  };

  const handleBlur = () => {
    if (inputValue.trim() === '') {
      onChange(name, []);
      setError('');
      return;
    }

    const spacings = inputValue
      .split(',')
      .flatMap((s) => parseFeetInput(s.trim()));

    if (spacings.some(isNaN)) {
      setError(
        'Invalid input. Please enter values in feet, feet and inches (e.g., 25 or 25\'6"), or use the multiplier format (e.g., 4x20 or 3x20.5)'
      );
      return;
    }

    const sum = spacings.reduce((acc, curr) => acc + curr, 0);

    if (compareValue - sum > 0.01) {
      onChange(name, spacings);
      setInputValue(spacings.map(formatFeetInches).join(', '));
      setError('');
    } else {
      setError(
        `Locations total (${formatFeetInches(sum)}) is equal to or greater than ${compareLabel} (${formatFeetInches(compareValue)})`
      );
    }
  };

  return (
    <div className={`cardInput ${className}`}>
      <label className={labelClass} htmlFor={name}>
        <span>{label}</span>
      </label>
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
        className={error ? 'error' : ''}
      />
      {error && (
        <div className="errorMsg">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ReusableLocation;
