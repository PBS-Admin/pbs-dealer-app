import React from 'react';

const DeleteDialog = ({ isOpen, onClose, onDelete, title, message }) => {
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
          <button className="button reject" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;
