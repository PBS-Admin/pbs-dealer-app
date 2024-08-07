import React from 'react';
import PropTypes from 'prop-types';
import styles from './Dialog.module.css';

const DeleteDialog = ({ isOpen, onClose, onDelete, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.title}>
          <h2>{title}</h2>
        </div>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttons}>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="delete" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;

DeleteDialog.propTypes = {
  isOpen: PropTypes.node.isRequired,
  onClose: PropTypes.node.isRequired,
  onDelete: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  message: PropTypes.node.isRequired,
};
