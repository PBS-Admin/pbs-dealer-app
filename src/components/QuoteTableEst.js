'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useMemo, useRef } from 'react';
import DeleteDialog from './DeleteDialog';
import styles from './QuoteTableEst.module.css';
import Image from 'next/image';
import { logo } from '../../public/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faCopy,
  faCircleNotch,
  faUserSlash,
} from '@fortawesome/free-solid-svg-icons';
import { faCircle, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import CopyDialog from './CopyDialog';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/contexts/UserContext';
import { useUIContext } from '@/contexts/UIContext';

export default function QuoteTableEst() {
  const router = useRouter();
  const { data: session } = useSession();
  const isEstimator = session?.user?.estimator === 1;

  // Contexts
  const {
    quotes,
    isLoading,
    error,
    fetchQuotes,
    deleteQuote,
    copyQuote,
    getNameById,
  } = useUserContext();

  const { dialogs, updateDialog, showToast } = useUIContext();

  const tabs = useMemo(() => {
    if (isEstimator) {
      return [
        { key: 'all', name: 'All Quotes' },
        { key: '00000100', name: 'Submitted' },
        { key: '00010000', name: 'In Checking' },
        { key: '00100000', name: 'Returned' },
        { key: '01000000', name: 'Completed' },
      ];
    }
    return [
      { key: 'all', name: 'All Quotes' },
      { key: 'started', name: 'Started' },
      { key: '00000100', name: 'Submitted' },
      { key: '00100000', name: 'Returned' },
      { key: '01000000', name: 'Completed' },
    ];
  }, [isEstimator]);

  const [activeTabKey, setActiveTabKey] = useState(tabs[0].key);
  const tabListRef = useRef(null);
  const activeTabRef = useRef(null);

  useEffect(() => {
    fetchQuotes(true);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchQuotes(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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
    router.replace(`/quote/${quoteId}?t=${Date.now()}`);
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

  const renderEstTable = (filteredQuotes) => {
    return (
      <table>
        <thead>
          <tr>
            <th>Started</th>
            <th>Quote</th>
            <th>Complex</th>
            <th>Project</th>
            <th>Customer</th>
            <th>Sales Person</th>
            <th>Estimator</th>
            <th>Checker</th>
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
                  {getNameById(quote.SalesPerson, 'rsm').name || (
                    <FontAwesomeIcon
                      icon={faUserSlash}
                      color={`var(--light-gray)`}
                    />
                  )}
                </a>
              </td>
              <td>
                <a
                  href={`/quote/${quote.ID}`}
                  className={styles.quoteLink}
                  onClick={(e) => handleQuoteClick(e, quote.ID)}
                >
                  {getNameById(quote.Estimator, 'estimator').name || (
                    <FontAwesomeIcon
                      icon={faUserSlash}
                      color={`var(--light-gray)`}
                    />
                  )}
                  {/* {estimators[quote.Estimator]?.name || quote.Estimator} */}
                </a>
              </td>
              <td>
                <a
                  href={`/quote/${quote.ID}`}
                  className={styles.quoteLink}
                  onClick={(e) => handleQuoteClick(e, quote.ID)}
                >
                  {getNameById(quote.Checker, 'estimator').name || (
                    <FontAwesomeIcon
                      icon={faUserSlash}
                      color={`var(--light-gray)`}
                    />
                  )}
                </a>
              </td>
              <td>
                <a
                  href={`/quote/${quote.ID}`}
                  className={styles.quoteLink}
                  onClick={(e) => handleQuoteClick(e, quote.ID)}
                >
                  {new Date(quote.DateStarted).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })}
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
    );
  };

  const renderSalesTable = (filteredQuotes) => {
    return (
      <table>
        <thead>
          <tr>
            <th>Started</th>
            <th>Quote</th>
            <th>Complex</th>
            <th>Project</th>
            <th>Customer</th>
            <th>Sales Person</th>
            <th>Project Manager</th>
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
                  {getNameById(quote.SalesPerson, 'rsm').name || (
                    <FontAwesomeIcon
                      icon={faUserSlash}
                      color={`var(--light-gray)`}
                    />
                  )}
                </a>
              </td>
              <td>
                <a
                  href={`/quote/${quote.ID}`}
                  className={styles.quoteLink}
                  onClick={(e) => handleQuoteClick(e, quote.ID)}
                >
                  {getNameById(quote.ProjectManager, 'pm').name || (
                    <FontAwesomeIcon
                      icon={faUserSlash}
                      color={`var(--light-gray)`}
                    />
                  )}
                </a>
              </td>
              <td>
                <a
                  href={`/quote/${quote.ID}`}
                  className={styles.quoteLink}
                  onClick={(e) => handleQuoteClick(e, quote.ID)}
                >
                  {new Date(quote.DateStarted).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })}
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
    );
  };

  if (isLoading) {
    return (
      <div className={styles.quoteLoadingContainer}>
        <div className="loadingCard">
          <div className="loadingMessage">
            <h3>Building your Quote Table</h3>
            <FontAwesomeIcon className="rotate" icon={faCircleNotch} />
          </div>
          <Image alt="PBS Buildings Logo" src={logo} className="loadingImage" />
        </div>
      </div>
    );
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
            isEstimator ? (
              renderEstTable(filteredQuotes)
            ) : (
              renderSalesTable(filteredQuotes)
            )
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
