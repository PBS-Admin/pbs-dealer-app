import React from 'react';
import { useUIContext } from '@/contexts/UIContext';

const DeleteDialog = ({
  isOpen,
  onClose,
  onDelete,
  title = 'Confirm Deletion',
  message,
}) => {
  const { dialogs, updateDialog, handleDeleteQuote } = useUIContext();

  // If this is a quote deletion dialog (no props passed), use the centralized quote deletion
  if (!onDelete && !onClose) {
    const { isOpen, data } = dialogs.deleteQuote;

    if (!isOpen) return null;

    return (
      <div className="dialog-overlay">
        <div className="dialog-content">
          <div className="dialog-title">
            <h4>Confirm Deletion</h4>
          </div>
          <p className="black">
            {data?.quoteName
              ? `Are you sure you want to delete ${data.quoteName}?`
              : 'Are you sure you want to delete this quote?'}
          </p>
          <div className="dialog-buttons">
            <button
              type="button"
              className="nuetral"
              onClick={() =>
                updateDialog('deleteQuote', { isOpen: false, data: null })
              }
            >
              Cancel
            </button>
            <button
              type="button"
              className="reject"
              onClick={handleDeleteQuote}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  // For other deletion dialogs (like building deletion), use props
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
          <button type="button" className="reject" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;
