import React from 'react';

const ReusableDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  onlyConfirm,
  isComplexity,
}) => {
  if (!isOpen) return null;

  const getContent = () => {
    if (isComplexity && message?.reasonsByComplexity) {
      // Handle complexity reasons format
      return (
        <div>
          {message.reasonsByComplexity.map(({ complexity, reasons }) => (
            <div key={complexity}>
              <h5 className="dialog-category">Complexity {complexity}:</h5>
              <ul className="dialog-bullets">
                {reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    } else {
      // Handle original string/array format
      const lines = Array.isArray(message)
        ? message
        : typeof message === 'string'
          ? message.split('\n')
          : [];

      return (
        <p className="center">
          {lines.map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-title">
          <h4>{title}</h4>
        </div>
        {getContent()}
        <div className="dialog-buttons">
          {!onlyConfirm && (
            <button type="button" className="nuetral" onClick={onClose}>
              Cancel
            </button>
          )}
          <button
            type="button"
            className="prim dialog-button"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReusableDialog;
