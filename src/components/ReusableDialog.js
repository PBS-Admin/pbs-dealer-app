import React from 'react';

const ReusableDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  onlyConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-title">
          <h4>{title}</h4>
        </div>
        <p className="center">
          {message.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
        <div className="dialog-buttons">
          {!onlyConfirm && (
            <button type="button" className="nuetral" onClick={onClose}>
              Cancel
            </button>
          )}
          <button type="button" className="prim" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReusableDialog;
