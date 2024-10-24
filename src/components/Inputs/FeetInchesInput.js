import React, { useState, useEffect } from 'react';

const feetToDecimal = (feet, inches) => {
  return feet < 0
    ? parseFloat(feet) - parseFloat(inches) / 12
    : parseFloat(feet) + parseFloat(inches) / 12;
};

const decimalToFeetInches = (decimal) => {
  const feet = parseInt(decimal);
  const inches = Math.abs(Math.round((decimal - feet) * 12 * 10000) / 10000); //round to 4 decimal places
  return { feet, inches };
};

const formatFeetInches = (feet, inches) => {
  let ft = feet;
  let inch = Math.floor(inches);
  let numerator = Math.round((inches - inch) * 16);
  let denominator = 0;

  if (numerator > 15) {
    numerator = 0;
    inch += inch;
  }
  if (inch > 11) {
    inch = 0;
    ft += 1;
  }

  if (numerator % 8 == 0) {
    numerator = Math.floor(numerator / 8);
    denominator = 2;
  } else if (numerator % 4 == 0) {
    numerator = Math.floor(numerator / 4);
    denominator = 4;
  } else if (numerator % 2 == 0) {
    numerator = Math.floor(numerator / 2);
    denominator = 8;
  } else {
    denominator = 16;
  }

  if (isNaN(feet) || isNaN(inches)) {
    return `0'-0"`;
  } else if (numerator > 0) {
    return `${ft}'-${inch} ${numerator}/${denominator}"`;
  } else {
    return `${ft}'-${inch}"`;
  }
  // return `${feet}'-${inches.toString().padStart(1, '0')}"`;
};

const parseFeetInches = (input, neg) => {
  // Handle decimal input
  if (input == '') {
    return decimalToFeetInches(0);
  } else if ((parseFloat(input) >= 0 || neg) && !isNaN(parseFloat(input))) {
    return decimalToFeetInches(parseFloat(input));
  } else if (parseFloat(input) < 0 && !neg) {
    return null;
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

  useEffect(() => {
    const { feet, inches } = decimalToFeetInches(value);
    setInputValue(
      value == 0 && !allowZero ? '' : formatFeetInches(feet, inches)
    );
  }, [value]);

  const handleInputChange = (e) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);
  };

  const handleBlur = () => {
    const parsed = parseFeetInches(inputValue, negative);
    if (parsed) {
      const { feet, inches } = parsed;
      const decimalValue = feetToDecimal(feet, inches);
      onChange(name, decimalValue);
      setInputValue(
        (inputValue == 0 && !allowZero) || (inputValue == '' && allowBlankValue)
          ? ''
          : formatFeetInches(feet, inches)
      );
    } else {
      // Reset to the last valid value
      const { feet, inches } = decimalToFeetInches(value);
      setInputValue(
        value == 0 && !allowZero ? '' : formatFeetInches(feet, inches)
      );
    }
  };

  const condition = row ? 'projInput' : '';
  const calcClass = calc ? 'calcInput' : '';

  return (
    <div className={`cardInput ${condition}`}>
      {showLabel && (
        <div className={`${calcClass} ${labelClass}`}>
          <label className={labelClass} htmlFor={name}>
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

export default FeetInchesInput;
