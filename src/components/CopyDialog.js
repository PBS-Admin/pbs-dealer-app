import React from 'react';

const CopyDialog = ({ isOpen, onClose, onCopy, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-title">
          <h4>{title}</h4>
        </div>
        <p className="black">{message}</p>
        <div className="dialog-buttons">
          <button className="button nuetral" onClick={onClose}>
            Cancel
          </button>
          <button className="button reject" onClick={onCopy}>
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopyDialog;
