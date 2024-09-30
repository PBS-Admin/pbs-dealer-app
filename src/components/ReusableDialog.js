import React from 'react';

const ReusableDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-title">
          <h4>{title}</h4>
        </div>
        <p className="center">{message}</p>
        <div className="dialog-buttons">
          <button className="button nuetral" onClick={onClose}>
            Cancel
          </button>
          <button className="button prim" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReusableDialog;
