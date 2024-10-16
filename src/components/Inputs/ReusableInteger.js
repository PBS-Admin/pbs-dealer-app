import React, { useState, useEffect } from 'react';

const parseInteger = (
  input,
  min,
  max,
  neg,
  valid,
  defaultValue,
  prefix,
  suffix
) => {
  const parsedInput = parseInt(input);
  const parsedMin = parseInt(min);
  const parsedMax = parseInt(max);
  const allowed = valid //if there is an array of allowed values
    ? valid.includes(parsedInput) || valid.includes(input) //if the input is in that array
      ? parsedInput //allow that value
      : defaultValue //don't allow that value
    : (neg == false && parsedInput < 0) || (min && parsedInput < parsedMin) //else if neg is not allowed and value is less than 0 or if there is an min and value is less than min
      ? min //if there is a min
        ? parsedMin //set value to min
        : defaultValue //else set value to default value
      : max && parsedInput > parsedMax //else if there is a max and value is greater than max
        ? parsedMax //set value to max
        : parsedInput; //else set value to input if in range
  console.log(suffix);
  return isNaN(parsedInput) ? defaultValue : prefix + allowed + suffix;
};

const ReusableInteger = ({
  value,
  name,
  className = '',
  onChange,
  onFocus,
  label,
  labelClass,
  min,
  max,
  validValues,
  defaultValue = '',
  negative = true,
  prefix = '',
  suffix = '',
  disabled = false,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);
  };

  const handleBlur = () => {
    const parsedValue = parseInteger(
      inputValue,
      min,
      max,
      negative,
      validValues,
      defaultValue,
      prefix,
      suffix
    );
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
      <div className={labelClass}>
        <label className={labelClass} htmlFor={name}>
          {label}
        </label>
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

export default ReusableInteger;
