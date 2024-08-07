import React from 'react';

const DeleteDialog = ({ isOpen, onClose, onDelete, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="dialog-overlay">
            <div className='dialog-content'>
                <div className='dialog-title'>
                    <h2>{title}</h2>
                </div>
                <p>{message}</p>
                <div className='dialog-buttons'>
                    <button className='cancel' onClick={onClose}>Cancel</button>
                    <button className='delete' onClick={onDelete}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteDialog;