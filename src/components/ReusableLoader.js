import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const ReusableLoader = ({ isOpen, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-title">
          <h4>{title}</h4>
        </div>
        <p className="center">{message}</p>
        <FontAwesomeIcon className="rotate" icon={faCircleNotch} />
        {/* <div className="dialog-buttons">
          <button type="button" className="nuetral" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="prim" onClick={onConfirm}>
            Confirm
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ReusableLoader;
