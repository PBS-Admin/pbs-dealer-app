import React, { useState, useEffect } from 'react';

const snapToFraction = (decimal) => {
  const fraction = 1 / 192; // 1/16 of an inch in feet (1/16 * 1/12)
  return Math.round(decimal / fraction) * fraction;
};

const feetToDecimal = (feet, inches) => {
  const totalFeet = parseFloat(inches) / 12;
  return feet < 0
    ? snapToFraction(parseFloat(feet) - totalFeet)
    : snapToFraction(parseFloat(feet) + totalFeet);
};

const decimalToFeetInches = (decimal) => {
  const snappedDecimal = snapToFraction(decimal);
  const feet = Math.floor(snappedDecimal);
  const inches = (snappedDecimal - feet) * 12;
  return { feet, inches };
};

const formatFeetInches = (feet, inches) => {
  if (isNaN(feet) || isNaN(inches)) return `0'-0"`;

  let ft = feet;
  let inch = Math.floor(inches);
  let numerator = Math.round((inches - inch) * 16);

  if (numerator === 16) {
    numerator = 0;
    inch += 1;
  }
  if (inch === 12) {
    inch = 0;
    ft += 1;
  }

  if (numerator === 0) {
    return `${ft}'-${inch}"`;
  }

  // Simplify fraction
  let denominator = 16;
  if (numerator % 8 === 0) {
    numerator /= 8;
    denominator = 2;
  } else if (numerator % 4 === 0) {
    numerator /= 4;
    denominator = 4;
  } else if (numerator % 2 === 0) {
    numerator /= 2;
    denominator = 8;
  }

  return `${ft}'-${inch} ${numerator}/${denominator}"`;
};

const parseFeetInches = (input, neg) => {
  if (!input || input === '') return decimalToFeetInches(0);

  // Handle decimal input
  const numericValue = parseFloat(input);
  if (!isNaN(numericValue) && !input.includes("'")) {
    if (numericValue >= 0 || neg) {
      return decimalToFeetInches(numericValue);
    }
    return null;
  }

  // Parse feet and inches format with fractions
  const regex = /^(-?\d+)'(?:-?\s*(\d+)(?:\s+(\d+)\/(\d+))?)?"/;
  const match = input.match(regex);

  if (match) {
    const feet = match[1] ? parseFloat(match[1]) : 0;
    let inches = 0;

    if (match[2]) {
      inches = parseFloat(match[2]);
      if (match[3] && match[4]) {
        inches += parseFloat(match[3]) / parseFloat(match[4]);
      }
    }

    return { feet, inches };
  }
  return null;
};

const FeetInchesInput = ({
  value,
  name,
  label,
  labelClass = '',
  showLabel = true,
  onChange,
  onFocus,
  negative = false,
  allowBlankValue = false,
  allowZero = allowBlankValue ? false : true,
  row,
  calc,
  onCalc,
  placeholder = 'Feet',
  disabled,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      const { feet, inches } = decimalToFeetInches(value);
      setInputValue(
        value === 0 && !allowZero ? '' : formatFeetInches(feet, inches)
      );
    }
  }, [value, allowZero, isFocused]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseFeetInches(inputValue, negative);
    if (parsed) {
      const { feet, inches } = parsed;
      const decimalValue = feetToDecimal(feet, inches);
      onChange({ target: { name, value: decimalValue } });

      if ((inputValue === '0' || inputValue === '') && !allowZero) {
        setInputValue('');
      } else if (inputValue === '' && allowBlankValue) {
        setInputValue('');
      } else {
        const formatted = formatFeetInches(feet, inches);
        setInputValue(formatted);
      }
    } else {
      const { feet, inches } = decimalToFeetInches(value);
      setInputValue(
        value === 0 && !allowZero ? '' : formatFeetInches(feet, inches)
      );
    }
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    e.target.select();
    if (onFocus) onFocus();
  };

  return (
    <div className={`cardInput ${row ? 'projInput' : ''}`}>
      {showLabel && (
        <div className={`${calc ? 'calcInput' : ''} ${labelClass}`}>
          <label htmlFor={name}>
            <span>{label}</span>
          </label>
          {calc && (
            <button type="button" onClick={onCalc}>
              Calc
            </button>
          )}
        </div>
      )}
      <input
        type="text"
        id={name}
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default FeetInchesInput;
