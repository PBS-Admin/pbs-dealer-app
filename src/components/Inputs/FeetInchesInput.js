import React, { useState, useEffect } from 'react';

const feetToDecimal = (feet, inches) => {
  return parseFloat(feet) + parseFloat(inches) / 12;
};

const decimalToFeetInches = (decimal) => {
  const feet = Math.floor(decimal);
  const inches = Math.round((decimal - feet) * 12);
  return { feet, inches };
};

const formatFeetInches = (feet, inches) => {
  return `${feet}'-${inches.toString().padStart(1, '0')}"`;
};

const parseFeetInches = (input) => {
  // Handle decimal input
  if (!isNaN(parseFloat(input))) {
    return decimalToFeetInches(parseFloat(input));
  }

  const regex =
    /^(\d+(?:\.\d+)?)(?:'|ft)?(?:\s*-?\s*(\d+(?:\.\d+)?)(?:"|in)?)?$/;
  const match = input.match(regex);
  if (match) {
    const feet = parseFloat(match[1]);
    const inches = match[2] ? parseFloat(match[2]) : 0;
    return { feet, inches };
  }
  return null;
};

const FeetInchesInput = ({ value, onChange, name, label }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const { feet, inches } = decimalToFeetInches(value);
    setInputValue(formatFeetInches(feet, inches));
  }, [value]);

  const handleInputChange = (e) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);
  };

  const handleBlur = () => {
    const parsed = parseFeetInches(inputValue);
    if (parsed) {
      const { feet, inches } = parsed;
      const decimalValue = feetToDecimal(feet, inches);
      onChange(name, decimalValue);
      setInputValue(formatFeetInches(feet, inches));
    } else {
      // Reset to the last valid value
      const { feet, inches } = decimalToFeetInches(value);
      setInputValue(formatFeetInches(feet, inches));
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
        placeholder="0'-0&quot;"
      />
    </div>
  );
};

export default FeetInchesInput;
