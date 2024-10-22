import React, { useState, useEffect } from 'react';

const parseInteger = (input, min, max, neg, valid) => {
  const parsedInput = parseInt(input);
  const parsedMin = parseInt(min);
  const parsedMax = parseInt(max);
  const allowed = valid //if there is an array of allowed values
    ? valid.includes(parsedInput) || valid.includes(input) //if the input is in that array
      ? parsedInput //allow that value
      : 0 //don't allow that value
    : (neg == false && parsedInput < 0) || (min && parsedInput < parsedMin) //else if neg is not allowed and value is less than 0 or if there is an min and value is less than min
      ? min //if there is a min
        ? parsedMin //set value to min
        : 0 //else set value to default value
      : max && parsedInput > parsedMax //else if there is a max and value is greater than max
        ? parsedMax //set value to max
        : parsedInput; //else set value to input if in range

  return isNaN(parsedInput) ? 0 : allowed;
};

const ReusableInteger = ({
  value,
  name,
  className = '',
  onChange,
  onFocus,
  label,
  labelClass,
  showLabel = true,
  min,
  max,
  validValues,
  negative = true,
  allowBlankValue = true,
  allowZero = allowBlankValue ? false : true,
  suffix = '',
  disabled = false,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState(0);

  useEffect(() => {
    setInputValue((value == 0 && !allowZero ? '' : value) + suffix);
    // console.log('in useEffect:: value=', value);
  }, [value]);

  const handleInputChange = (e) => {
    const newInputValue = e.target.value;
    // console.log(
    //   'in handleInputChange:: value=',
    //   value,
    //   ', newInputValue=',
    //   newInputValue
    // );
    // Allow only numbers
    if (/^-?\d*$/.test(newInputValue)) {
      setInputValue(newInputValue);
    }
  };

  const handleBlur = () => {
    const parsedValue = parseInteger(
      inputValue,
      min,
      max,
      negative,
      validValues
    );
    // console.log(
    //   'in handleBlur:: value=',
    //   value,
    //   ' inputValue=',
    //   inputValue,
    //   ', parsedValue=',
    //   parsedValue
    // );
    setInputValue((parsedValue == 0 && !allowZero ? '' : parsedValue) + suffix);
    onChange({
      target: {
        name: name,
        value: parsedValue,
      },
    });
  };

  return (
    <div className={`cardInput ${className}`}>
      {showLabel && (
        <div className={labelClass}>
          <label className={labelClass} htmlFor={name}>
            {label}
          </label>
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

export default ReusableInteger;
