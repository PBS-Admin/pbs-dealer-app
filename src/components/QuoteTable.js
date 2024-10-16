'use client';

import Link from 'next/link';
import { useState } from 'react';
import DeleteDialog from './DeleteDialog';
import styles from './QuoteTable.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCopy } from '@fortawesome/free-solid-svg-icons';
import { faCircle, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import CopyDialog from './CopyDialog';

export default function QuoteTable({ initialQuotes, onCopyQuote }) {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState(null);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [quoteToCopy, setQuoteToCopy] = useState(null);

  const openDeleteDialog = (quoteId) => {
    setQuoteToDelete(quoteId);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setQuoteToDelete(null);
  };

  const openCopyDialog = (quoteId) => {
    setQuoteToCopy(quoteId);
    setIsCopyDialogOpen(true);
  };

  const closeCopyDialog = () => {
    setIsCopyDialogOpen(false);
    setQuoteToCopy(null);
  };

  const handleDeleteQuote = async () => {
    if (!quoteToDelete) return;

    try {
      const url = new URL(
        `/api/quotes/${quoteToDelete}`,
        window.location.origin
      );

      const response = await fetch(url.toString(), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete quote');
      }

      // Remove the deleted quote from the list
      setQuotes(quotes.filter((quote) => quote.ID !== quoteToDelete));
      closeDeleteDialog();
    } catch (error) {
      console.error('Error deleting quote:', error);
      alert('Failed to delete quote. Please try again.');
    }
  };

  const handleCopyQuote = async () => {
    if (!quoteToCopy) return;

    try {
      console.log('testing handle copy in Table');
      const quote = await onCopyQuote(quoteToCopy);

      const currentQuote = 0;
      const company = quote.Company;
      const values = JSON.parse(quote.QuoteData);

      try {
        console.log('attempting to save');
        const response = await fetch('/api/auth/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentQuote, company, values }),
        });

        if (response.ok) {
          console.log('Response was ok');
          const data = await response.json();

          if (isNaN(data.message.quoteId)) {
            console.log("Couldn't find a quote id");
          } else {
            quote.ID = data.message.quoteId;
            quote.Quote = data.message.quoteNum;
            setQuotes([...quotes, quote]);
          }
        } else {
          console.log('Response was not ok');
        }
      } catch (error) {
        console.log('Errored out');
        alert('Failed to copy quote. Please try again.');
      }

      closeCopyDialog();
    } catch (error) {
      console.error('Error copying quote:', error);
      alert('Failed to copy quote. Please try again.');
    }
  };

  return (
    <div className={styles.quoteContainer}>
      <h2>Company Quotes</h2>
      <div className={styles.quoteTable}>
        {quotes.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Submitted</th>
                <th>Quote</th>
                <th>Rev</th>
                <th>Project</th>
                <th>Customer</th>
                <th>Date Started</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.ID} className={styles.quoteRow}>
                  <td>
                    <Link
                      href={`/quote/${quote.ID}`}
                      className={styles.quoteLink}
                    >
                      {quote.Submitted ? (
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          style={{ color: 'var(--green)' }}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faCircle}
                          style={{ color: 'var(--red)' }}
                        />
                      )}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/quote/${quote.ID}`}
                      className={styles.quoteLink}
                    >
                      {quote.Quote}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/quote/${quote.ID}`}
                      className={styles.quoteLink}
                    >
                      {quote.Rev}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/quote/${quote.ID}`}
                      className={styles.quoteLink}
                    >
                      {quote.ProjectName}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/quote/${quote.ID}`}
                      className={styles.quoteLink}
                    >
                      {quote.Customer}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/quote/${quote.ID}`}
                      className={styles.quoteLink}
                    >
                      {new Date(quote.DateStarted).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                      })}
                    </Link>
                  </td>
                  <td>
                    <div>
                      <button
                        className={`${styles.removeQuote} ${styles.actionButton}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => openDeleteDialog(quote.ID)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button
                        className={`${styles.copyQuote} ${styles.actionButton}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => openCopyDialog(quote.ID)}
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.message}>No quotes found.</p>
        )}
        {isDeleteDialogOpen && (
          <DeleteDialog
            isOpen={isDeleteDialogOpen}
            onDelete={handleDeleteQuote}
            onClose={closeDeleteDialog}
            title="Confirm Deletion"
            message="Are you sure you want to delete this quote?"
          />
        )}
        {isCopyDialogOpen && (
          <CopyDialog
            isOpen={isCopyDialogOpen}
            onCopy={handleCopyQuote}
            onClose={closeCopyDialog}
            title="Confirm Copy"
            message="Do you want to copy this quote to a new building?"
          />
        )}
      </div>
    </div>
  );
}
