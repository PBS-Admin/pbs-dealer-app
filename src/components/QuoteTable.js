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
import { getQuotes, getQuote } from '../util/quoteUtils';
import { redirect } from 'next/navigation';

export default function QuoteTable() {
  const { data: session, update: updateSession } = useSession();
  const [quotes, setQuotes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCompany, setCurrentCompany] = useState(session?.user?.company);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState(null);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [quoteToCopy, setQuoteToCopy] = useState(null);

  const handleCompanyChange = async (event) => {
    const newCompany = parseInt(event.target.value);
    setIsLoading(true);
    setError(null);

    try {
      // Get new token with updated company
      const response = await fetch('/api/auth/change-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newCompany }),
      });

      if (!response.ok) {
        throw new Error('Failed to update company');
      }

      await updateSession({
        ...session,
        user: {
          ...session?.user,
          company: newCompany,
        },
      });

      setCurrentCompany(newCompany);

      const quotesResponse = await fetch(
        `/api/auth/open?company=${newCompany}`
      );
      if (!quotesResponse.ok) {
        throw new Error('Failed to fetch quotes');
      }
      const quotesData = await quotesResponse.json();
      setQuotes(quotesData.quotes);
      setCompanies(quotesData.companies);
    } catch (err) {
      console.error('Error changing company:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
      const quote = await getQuote(quoteToCopy, session?.user?.accessToken);

      const currentQuote = 0;
      const company = quote.Company;
      const values = JSON.parse(quote.QuoteData);

      try {
        const response = await fetch('/api/auth/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentQuote, company, values }),
        });

        if (response.ok) {
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
      {/* Permission for a Super user who can view multiple companies jobs */}
      {session.user.permission >= 3 && (
        <div className={styles.companyList}>
          <select
            className="selectInput"
            id="companyList"
            name="companyList"
            value={currentCompany}
            onChange={handleCompanyChange}
          >
            {companies.map((option) => (
              <option key={option.ID} value={option.ID}>
                {option.Name}
              </option>
            ))}
          </select>
        </div>
      )}
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
