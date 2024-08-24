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
      <div className="dialog-content">
        <div className="dialog-title">
          <h4>Copy Building</h4>
          <p className="black">Select the building you want to copy to:</p>
        </div>
        <ul>
          {buildings.map(
            (building, index) =>
              index !== sourceBuildingIndex && (
                <li key={index}>
                  <button className="button prim" onClick={() => onCopy(index)}>
                    Building {index + 1}
                  </button>
                </li>
              )
          )}
          <li>
            <button className="button accent" onClick={() => onCopy('new')}>
              New Building
            </button>
          </li>
        </ul>
        <button className="button nuetral" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CopyBuildingDialog;
