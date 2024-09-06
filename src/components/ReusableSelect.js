import React from 'react';

const ReusableSelect = ({
  id,
  name,
  value,
  onChange,
  options,
  label,
  labelHide,
}) => {
  return (
    <div className="cardInput">
      <label className={labelHide} htmlFor={id}>
        {label}
      </label>
      <select
        className="selectInput"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ReusableSelect;
