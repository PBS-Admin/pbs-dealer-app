import React from 'react';

const ReusableToggle = ({ id, className, checked, onChange, label = '' }) => {
  return (
    <div className="toggle">
      <label htmlFor={id} className={`wrapper ${className}`}>
        <input type="checkbox" id={id} onChange={onChange} checked={checked} />
        <span className="toggleButton" />
      </label>
      {label != '' && <label htmlFor={id}>{label}</label>}
    </div>
  );
};

export default ReusableToggle;
