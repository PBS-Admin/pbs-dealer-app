import React from 'react';
import PropTypes from 'prop-types';

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
          <h2>Copy Building</h2>
          <p>Select the building you want to copy to:</p>
        </div>
        <ul>
          {buildings.map(
            (building, index) =>
              index !== sourceBuildingIndex && (
                <li key={index}>
                  <button
                    className="primary-button"
                    onClick={() => onCopy(index)}
                  >
                    Building {index + 1}
                  </button>
                </li>
              )
          )}
          <li>
            <button className="primary-button" onClick={() => onCopy('new')}>
              New Building
            </button>
          </li>
        </ul>
        <button className="cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CopyBuildingDialog;

CopyBuildingDialog.propTypes = {
  isOpen: PropTypes.node.isRequired,
  onClose: PropTypes.node.isRequired,
  buildings: PropTypes.node.isRequired,
  onCopy: PropTypes.node.isRequired,
  sourceBuildingIndex: PropTypes.node.isRequired,
};
