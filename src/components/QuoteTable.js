'use client';

import Link from 'next/link';
import { useState } from 'react';
import DeleteDialog from './DeleteDialog';
import styles from './QuoteTable.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function QuoteTable({ initialQuotes }) {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState(null);

  const openDeleteDialog = (quoteId) => {
    setQuoteToDelete(quoteId);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setQuoteToDelete(null);
  };

  const handleDeleteQuote = async () => {
    if (!quoteToDelete) return;

    try {
      const url = new URL(
        `/api/quotes/${quoteToDelete}`,
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
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

  return (
    <div className={styles.quoteTable}>
      <h2>Company Quotes</h2>
      {quotes.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Project</th>
              <th>Customer</th>
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
                    {quote.ID}
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/quote/${quote.ID}`}
                    className={styles.quoteLink}
                  >
                    {quote.QuoteData.projectName}
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/quote/${quote.ID}`}
                    className={styles.quoteLink}
                  >
                    {quote.QuoteData.customerName}
                  </Link>
                </td>
                <td onClick={() => openDeleteDialog(quote.ID)}>
                  <button
                    className={styles.removeQuote}
                    style={{ cursor: 'pointer' }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No quotes found.</p>
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
    </div>
  );
}
