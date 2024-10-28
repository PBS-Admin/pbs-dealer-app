import React from 'react';

const CopyBuildingDialog = ({
  isOpen,
  onClose,
  buildings,
  onCopy,
  sourceBuildingIndex,
}) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      {console.log(sourceBuildingIndex)}
      <div className="dialog-content">
        <div className="dialog-title">
          <h4>Copy Building {String.fromCharCode(sourceBuildingIndex + 65)}</h4>
          <p className="black">Select the building you want to copy to:</p>
        </div>
        <ul>
          {buildings.map((building, index) => (
            <li key={index}>
              <button
                type="button"
                className={index !== sourceBuildingIndex ? 'prim' : 'nuetral'}
                onClick={() => onCopy(index)}
                disabled={index === sourceBuildingIndex ? 'disabled' : ''}
              >
                Building {String.fromCharCode(index + 65)}
              </button>
            </li>
          ))}
          {buildings.length < 9 && (
            <li>
              <button
                type="button"
                className="accent"
                onClick={() => onCopy('new')}
              >
                New Building
              </button>
            </li>
          )}
        </ul>
        <button type="button" className="nuetral" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CopyBuildingDialog;
