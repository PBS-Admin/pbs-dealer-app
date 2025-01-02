import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalculator,
  faMagnifyingGlass,
  faCircleInfo,
  faFileInvoiceDollar,
} from '@fortawesome/free-solid-svg-icons';

const formatDouble = (value, decimalPlaces, prefix = '', suffix = '') => {
  const number = parseFloat(value);
  if (isNaN(number)) return '';
  const formatted = number.toFixed(decimalPlaces);
  return `${prefix}${formatted}${suffix}`;
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
  iconClass = '',
  iconOnClick = null,
  tooltip,
  disabled = false,
  placeholder,
  decimalPlaces = 2,
}) => {
  const [inputValue, setInputValue] = useState('');

  const iconMap = {
    calculator: faCalculator,
    lookup: faMagnifyingGlass,
    info: faCircleInfo,
    import: faFileInvoiceDollar,
  };

  useEffect(() => {
    const prefix = name === 'contractPrice' ? '$ ' : '';
    const suffix = name === 'contractWeight' ? ' lbs' : '';
    setInputValue(formatDouble(value, decimalPlaces, prefix, suffix));
  }, [value, decimalPlaces, name]);
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
    const prefix = name === 'contractPrice' ? '$ ' : '';
    const suffix = name === 'contractWeight' ? ' lbs' : '';
    const numericValue = parseFloat(inputValue.replace(/[^\d.-]/g, '')) || 0;
    setInputValue(formatDouble(numericValue, decimalPlaces, prefix, suffix));
    onChange({
      target: {
        name: name,
        value: numericValue,
        type: 'number',
      },
    });
  };

  return (
    <div className={`cardInput ${className}`}>
      <label htmlFor={name}>
        <span>{label}</span>
        {icon && (
          <button
            type="button"
            onClick={iconOnClick}
            className={`icon ${iconClass} ${tooltip ? 'tooltip' : ''}`}
          >
            <FontAwesomeIcon icon={iconMap[icon]} />
            {tooltip && <p>{tooltip}</p>}
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
