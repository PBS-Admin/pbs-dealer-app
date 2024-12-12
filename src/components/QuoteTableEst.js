'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect, useMemo, useRef } from 'react';
import DeleteDialog from './DeleteDialog';
import styles from './QuoteTableEst.module.css';
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
import { redirect, useRouter } from 'next/navigation';
import { useUserContext } from '@/contexts/UserContext';
import { useUIContext } from '@/contexts/UIContext';

export default function QuoteTableEst() {
  const router = useRouter();
  const { data: session } = useSession();

  // Contexts
  const {
    quotes,
    rsms,
    isLoading,
    error,
    fetchQuotes,
    deleteQuote,
    copyQuote,
    getNameById,
  } = useUserContext();

  const { dialogs, updateDialog, showToast } = useUIContext();

  const tabs = [
    { key: 'all', name: 'All Quotes' },
    { key: 'started', name: 'Started' },
    { key: '00000100', name: 'Submitted' },
    { key: '00010000', name: 'In Checking' },
    { key: '01000000', name: 'Completed' },
  ];

  const [activeTabKey, setActiveTabKey] = useState(tabs[0].key);
  const tabListRef = useRef(null);
  const activeTabRef = useRef(null);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  useEffect(() => {
    if (activeTabRef.current && tabListRef.current) {
      const tabList = tabListRef.current;
      const activeTab = activeTabRef.current;
      const scrollLeft =
        activeTab.offsetLeft -
        tabList.clientWidth / 2 +
        activeTab.clientWidth / 2;
      tabList.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeTabKey]);

  const handleQuoteClick = (e, quoteId) => {
    e.preventDefault();
    router.refresh();
    router.push(`/quote/${quoteId}`);
  };

  const handleDeleteQuote = async () => {
    const quoteId = dialogs.deleteQuote.data;
    const success = await deleteQuote(quoteId);

    if (success) {
      showToast({
        title: 'Success',
        message: 'Quote deleted successfully',
        type: 'success',
      });
    } else {
      showToast({
        title: 'Error',
        message: 'Failed to delete quote',
        type: 'error',
      });
    }

    updateDialog('deleteQuote', { isOpen: false, data: null });
  };

  const handleCopyQuote = async () => {
    const quoteId = dialogs.copyBuilding.data;
    const success = await copyQuote(quoteId);

    if (success) {
      showToast({
        title: 'Success',
        message: 'Quote copied successfully',
        type: 'success',
      });
    } else {
      showToast({
        title: 'Error',
        message: 'Failed to copy quote',
        type: 'error',
      });
    }

    updateDialog('copyBuilding', { isOpen: false, data: null });
  };

  const openDeleteDialog = (quoteId) => {
    updateDialog('deleteQuote', {
      isOpen: true,
      data: quoteId,
    });
  };

  const openCopyDialog = (quoteId) => {
    updateDialog('copyBuilding', {
      isOpen: true,
      data: quoteId,
    });
  };

  const filteredQuotes = useMemo(() => {
    if (activeTabKey === 'all') return quotes;
    if (activeTabKey === 'started') {
      return quotes.filter((quote) => quote.Progress.toString() == 1);
    }
    return quotes.filter((quote) => quote.Progress.toString() & activeTabKey);
  }, [quotes, activeTabKey]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.quoteContainer}>
      <section className="card">
        <div className="tabsContainer">
          <div className="tabList" ref={tabListRef}>
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.key}
                ref={activeTabKey === tab.key ? activeTabRef : null}
                className={`tab ${activeTabKey === tab.key ? 'activeTab' : ''}`}
                onClick={() => setActiveTabKey(tab.key)}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.quoteTableEst}>
          {filteredQuotes.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Started</th>
                  <th>Quote</th>
                  <th>Complex</th>
                  <th>Project</th>
                  <th>Customer</th>
                  <th>Sales Person</th>
                  <th>Date Started</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.map((quote) => (
                  <tr key={quote.ID} className={styles.quoteRow}>
                    <td>
                      <a
                        href={`/quote/${quote.ID}`}
                        className={styles.quoteLink}
                        onClick={(e) => handleQuoteClick(e, quote.ID)}
                      >
                        {quote.Progress & 0b100 ? (
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            style={{ color: 'var(--green)' }}
                          />
                        ) : (
                          <FontAwesomeIcon icon={faCircle} color="var(--red)" />
                        )}
                      </a>
                    </td>
                    <td>
                      <a
                        href={`/quote/${quote.ID}`}
                        className={styles.quoteLink}
                        onClick={(e) => handleQuoteClick(e, quote.ID)}
                      >
                        {quote.Rev > 0
                          ? `${quote.Quote} R${quote.Rev}`
                          : `${quote.Quote}`}
                      </a>
                    </td>
                    <td>
                      <a
                        href={`/quote/${quote.ID}`}
                        className={styles.quoteLink}
                        onClick={(e) => handleQuoteClick(e, quote.ID)}
                      >
                        {quote.Complexity}
                      </a>
                    </td>
                    <td>
                      <a
                        href={`/quote/${quote.ID}`}
                        className={styles.quoteLink}
                        onClick={(e) => handleQuoteClick(e, quote.ID)}
                      >
                        {quote.ProjectName}
                      </a>
                    </td>
                    <td>
                      <a
                        href={`/quote/${quote.ID}`}
                        className={styles.quoteLink}
                        onClick={(e) => handleQuoteClick(e, quote.ID)}
                      >
                        {quote.Customer}
                      </a>
                    </td>
                    <td>
                      <a
                        href={`/quote/${quote.ID}`}
                        className={styles.quoteLink}
                        onClick={(e) => handleQuoteClick(e, quote.ID)}
                      >
                        {quote.SalesPerson}
                        {/* {rsms[quote.SalesPerson].name || quote.SalesPerson} */}
                      </a>
                    </td>
                    <td>
                      <a
                        href={`/quote/${quote.ID}`}
                        className={styles.quoteLink}
                        onClick={(e) => handleQuoteClick(e, quote.ID)}
                      >
                        {new Date(quote.DateStarted).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                          }
                        )}
                      </a>
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
            <h5 className={styles.message}>No quotes found</h5>
          )}
          {dialogs.deleteQuote.isOpen && (
            <DeleteDialog
              isOpen={dialogs.deleteQuote.isOpen}
              onDelete={handleDeleteQuote}
              onClose={() =>
                updateDialog('deleteQuote', { isOpen: false, data: null })
              }
              title="Confirm Deletion"
              message="Are you sure you want to delete this quote?"
            />
          )}
          {dialogs.copyBuilding.isOpen && (
            <CopyDialog
              isOpen={dialogs.copyBuilding.isOpen}
              onCopy={handleCopyQuote}
              onClose={() =>
                updateDialog('copyBuilding', { isOpen: false, data: null })
              }
              title="Confirm Copy"
              message="Do you want to copy this quote to a new quote?"
            />
          )}
        </div>
      </section>
    </div>
  );
}
