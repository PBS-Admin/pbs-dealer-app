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

const BaySpacingInput = ({
  value,
  onChange,
  name,
  label,
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

    if (Math.abs(sum - compareValue) < 0.01) {
      onChange(name, spacings);
      setInputValue(spacings.map(formatFeetInches).join(', '));
      setError('');
    } else {
      setError(
        `Bay spacing (${formatFeetInches(sum)}) does not equal ${compareLabel} (${formatFeetInches(compareValue)})`
      );
    }
  };

  const suggestDistribution = () => {
    if (inputValue === '') {
      const optimalBaySize = 25; // Midpoint of 20-30 range
      const numBays = Math.round(compareValue / optimalBaySize);
      const baySize = compareValue / numBays;
      const suggestion = Array(numBays).fill(baySize);
      setInputValue(suggestion.map(formatFeetInches).join(', '));
    }
  };

  return (
    <div className="cardInput">
      <label htmlFor={name}>{label}</label>
      <input
        type="text"
        id={name}
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        // onFocus={suggestDistribution}
        placeholder="25'-0&quot;, 25'-0&quot; or 4x20"
        onFocus={(e) => e.target.select()}
      />
      {error && <div style={{ color: 'red', fontSize: '0.8em' }}>{error}</div>}
    </div>
  );
};

export default BaySpacingInput;
