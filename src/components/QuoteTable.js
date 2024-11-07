'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import DeleteDialog from './DeleteDialog';
import styles from './QuoteTable.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faCopy,
  faExclamationTriangle,
  faCircleQuestion,
} from '@fortawesome/free-solid-svg-icons';
import {
  faCircle,
  faCircleCheck,
  faMessage,
  faRectangleXmark,
  faComment,
} from '@fortawesome/free-regular-svg-icons';
import CopyDialog from './CopyDialog';
import { redirect } from 'next/navigation';

export default function QuoteTable() {
  const { data: session } = useSession();
  const [quotes, setQuotes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState(null);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [quoteToCopy, setQuoteToCopy] = useState(null);

  useEffect(() => {
    if (!session) {
      console.log('No session, redirecting to login');
      redirect('/login');
      return;
    }

    const fetchQuotes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/auth/open?company=${session.user.company}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch quotes');
        }
        const data = await response.json();
        setQuotes(data.quotes);
        setCompanies(data.companies);
      } catch (err) {
        console.error('Error fetching quotes:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
  }, [session]);

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
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/auth/quote/${quoteToCopy}`);
        if (!response.ok) {
          throw new Error('Failed to copy quote');
        }
        const data = await response.json();

        const currentQuote = 0;
        const company = data.quote.Company;
        const user = {
          company: company,
          id: session.user.id,
        };
        const values = JSON.parse(data.quote.QuoteData);

        const saveResponse = await fetch('/api/auth/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentQuote, user, values }),
        });

        if (saveResponse.ok) {
          const saveData = await saveResponse.json();

          if (isNaN(saveData.message.quoteId)) {
            console.log("Couldn't find a quote id");
          } else {
            data.quote.ID = saveData.message.quoteId;
            data.quote.Quote = saveData.message.quoteNum;
            setQuotes([...quotes, data.quote]);
          }
        } else {
          console.log('Response was not ok');
        }
      } catch (err) {
        console.error('Error fetching quotes:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }

      closeCopyDialog();
    } catch (error) {
      console.error('Error copying quote:', error);
      alert('Failed to copy quote. Please try again.');
    }
  };

  return (
    <div className={styles.quoteContainer}>
      <div className={styles.quoteTable}>
        {quotes.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Submitted</th>
                <th>Quote</th>
                <th>Complex</th>
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
                        <FontAwesomeIcon icon={faCircle} color="var(--red)" />
                      )}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/quote/${quote.ID}`}
                      className={styles.quoteLink}
                    >
                      {quote.Rev > 0
                        ? `${quote.Quote} R${quote.Rev}`
                        : `${quote.Quote}`}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/quote/${quote.ID}`}
                      className={styles.quoteLink}
                    >
                      {quote.Complexity}
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
                        className="icon actionButton reject"
                        onClick={() => openDeleteDialog(quote.ID)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button
                        className="icon actionButton sec"
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
