import React, { useState, useEffect } from 'react';

const formatRoofPitch = (value) => {
  return `${value}:12`;
};

const parseRoofPitch = (input) => {
  // Handle inputs starting with a dot
  if (input.startsWith('.')) {
    input = '0' + input;
  }

  const match = input.match(/^(\d*(?:\.\d+)?)/);
  if (match) {
    const value = parseFloat(match[1]);
    return !isNaN(value) && value >= 0 && value <= 6 ? value : null;
  }
  return null;
};

const RoofPitchInput = ({ value, onChange, name, label }) => {
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
        placeholder="0:12"
      />
    </div>
  );
};

export default RoofPitchInput;