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
          <button type="button" className="nuetral" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="prim" onClick={onCopy}>
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopyDialog;
