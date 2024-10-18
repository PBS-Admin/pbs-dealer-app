import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalculator,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

const formatDouble = (value, decimalPlaces) => {
  const number = parseFloat(value);

  /*
  return isNaN(number)
    ? `0.${'0'.repeat(decimalPlaces)}`
    : number.toFixed(decimalPlaces);
*/
  return isNaN(number) ? '' : number.toFixed(decimalPlaces);
};

const parseDouble = (input) => {
  const parsed = parseFloat(input);
  return isNaN(parsed) ? 0 : parsed;
};

const ReusableDouble = ({
  value,
  name,
  className = '',
  label,
  onChange,
  icon = '',
  iconColor = '',
  iconOnClick = null,
  disabled = false,
  placeholder,
  decimalPlaces = 2,
}) => {
  const [inputValue, setInputValue] = useState('');

  const iconMap = {
    calculator: faCalculator,
    lookup: faMagnifyingGlass,
  };

  useEffect(() => {
    setInputValue(formatDouble(value, decimalPlaces));
  }, [value, decimalPlaces]);
  /*
  useEffect(() => {
    // Update placeholder when decimalPlaces changes
    if (!placeholder) {
      setInputValue((prev) => formatDouble(parseDouble(prev), decimalPlaces));
    }
  }, [decimalPlaces, placeholder]);
*/
  const handleInputChange = (e) => {
    const newInputValue = e.target.value;
    // Allow only numbers and a single decimal point
    if (/^-?\d*\.?\d*$/.test(newInputValue)) {
      setInputValue(newInputValue);
    }
  };

  const handleBlur = () => {
    /*
    const parsedValue = parseDouble(inputValue);
    const formattedValue = formatDouble(parsedValue, decimalPlaces);
    setInputValue(formattedValue);
*/
    const parsedValue = formatDouble(inputValue, decimalPlaces);
    setInputValue(parsedValue);
    // Only call onChange when the input loses focus
    onChange({
      target: {
        name: name,
        value: parsedValue,
      },
    });
  };

  return (
    <div className={`cardInput ${className}`}>
      <label htmlFor={name}>
        <span>{label}</span>
        {icon && (
          <button onClick={iconOnClick} className={`icon ${iconColor}`}>
            <FontAwesomeIcon icon={iconMap[icon]} />
          </button>
        )}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={placeholder /* || `0.${'0'.repeat(decimalPlaces)}`*/}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
      />
    </div>
  );
};

export default ReusableDouble;
