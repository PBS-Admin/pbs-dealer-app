import React from 'react';

const ReusableToggle = ({ id, className, onClick, label = '' }) => {
  return (
    <div className="toggle">
      <label htmlFor={id} className="wrapper">
        <input type="checkbox" id={id} onClick={onClick} />
        <span className={`toggleButton ${className}`} />
      </label>
      {label != '' && <label htmlFor={id}>{label}</label>}
    </div>
  );
};

export default ReusableToggle;
