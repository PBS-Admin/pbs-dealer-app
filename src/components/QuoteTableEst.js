'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
  faTriangleExclamation,
  faForward,
  faBackward,
} from '@fortawesome/free-solid-svg-icons';
import {
  faCircle,
  faCircleCheck,
  faCircleDot,
  faCircleXmark,
} from '@fortawesome/free-regular-svg-icons';
import CopyDialog from './CopyDialog';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/contexts/UserContext';
import { useUIContext } from '@/contexts/UIContext';

const ITEMS_PER_PAGE = 10;

export default function QuoteTableEst() {
  const router = useRouter();
  const { data: session } = useSession();
  const isEstimator = session?.user?.estimator === 1;
  const [currentPage, setCurrentPage] = useState(1);

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

  const {
    dialogs,
    updateDialog,
    openDeleteQuoteDialog,
    showToast,
    setActiveBuilding,
    setActiveCard,
  } = useUIContext();

  const tabs = useMemo(() => {
    const commonTabs = [
      { key: 'all', name: 'All Quotes' },
      { key: '00000100', name: 'Submitted' },
      { key: '00100000|00001000', name: 'Returned' },
      { key: '01000000', name: 'Completed' },
    ];

    if (isEstimator) {
      return [
        ...commonTabs.slice(0, 2),
        { key: '00010000', name: 'In Checking' },
        ...commonTabs.slice(2),
      ];
    }

    return [
      ...commonTabs.slice(0, 1),
      { key: 'started', name: 'Started' },
      ...commonTabs.slice(1),
    ];
  }, [isEstimator]);

  const columns = useMemo(() => {
    const commonColumns = [
      { key: 'status', label: 'Status' },
      { key: 'quote', label: 'Quote' },
      { key: 'complex', label: 'Complex' },
      { key: 'project', label: 'Project' },
      { key: 'customer', label: 'Customer' },
      { key: 'salesPerson', label: 'Sales Person' },
      { key: 'dateStarted', label: 'Date Started' },
    ];

    if (isEstimator) {
      return [
        ...commonColumns.slice(0, 6),
        { key: 'estimator', label: 'Estimator' },
        { key: 'checker', label: 'Checker' },
        ...commonColumns.slice(6),
      ];
    }

    return [
      ...commonColumns.slice(0, 6),
      { key: 'projectManager', label: 'Project Manager' },
      ...commonColumns.slice(6),
    ];
  }, [isEstimator]);

  const [activeTabKey, setActiveTabKey] = useState(tabs[0].key);
  const tabListRef = useRef(null);
  const activeTabRef = useRef(null);

  const filteredQuotes = useMemo(() => {
    if (activeTabKey === 'all') return quotes;
    if (activeTabKey === 'started') {
      return quotes.filter((quote) => quote.Progress.toString() == 1);
    }
    const combinedKeys = activeTabKey.split('|');
    const tabKeyNums = combinedKeys.map((key) => parseInt(key, 2));

    return quotes.filter((quote) =>
      tabKeyNums.some((tabKeyNum) => (quote.Progress & tabKeyNum) === tabKeyNum)
    );
  }, [quotes, activeTabKey]);

  const handleQuoteClick = (e, quoteId) => {
    e.preventDefault();
    router.replace(`/quote/${quoteId}?t=${Date.now()}`);
  };

  const CustomTooltip = ({ content, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const tooltipRef = useRef(null);

    return (
      <div
        className={styles.tooltipContainer}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
        {isVisible && (
          <div className={styles.tooltip} ref={tooltipRef}>
            {content}
          </div>
        )}
      </div>
    );
  };

  const STATUS_MAP = {
    0b1000000: {
      label: 'Completed',
      icon: faCircleDot,
      color: 'var(--dark-blue)',
    },
    0b100000: { label: 'Returned', icon: faCircleCheck, color: 'var(--green)' },
    0b10000: { label: 'In Checking', icon: faCircle, color: 'var(--green)' },
    0b1000: {
      label: 'Rejected',
      icon: faTriangleExclamation,
      color: 'var(--yellow)',
    },
    0b100: { label: 'Submitted', icon: faCircle, color: 'var(--light-blue)' },
    0b1: { label: 'Started', icon: faCircle, color: 'var(--red)' },
  };

  const StatusIcon = ({ progress }) => {
    // Convert the binary string keys to numbers when comparing
    const status =
      Object.entries(STATUS_MAP).find(
        ([key]) => (progress & Number(key)) === Number(key)
      )?.[1] || STATUS_MAP[0b1]; // Default to Started if no match found

    return (
      <CustomTooltip content={status.label}>
        <FontAwesomeIcon icon={status.icon} color={status.color} />
      </CustomTooltip>
    );
  };

  const renderCell = useCallback(
    (quote, column) => {
      const baseProps = {
        href: `/quote/${quote.ID}`,
        className: styles.quoteLink,
        onClick: (e) => handleQuoteClick(e, quote.ID),
      };

      const content = {
        status: () => <StatusIcon progress={quote.Progress} />,
        quote: () =>
          quote.Rev > 0 ? `${quote.Quote} R${quote.Rev}` : quote.Quote,
        complex: () => quote.Complexity,
        project: () => quote.ProjectName,
        customer: () => quote.Customer,
        salesPerson: () =>
          getNameById(quote.SalesPerson, 'rsm').name || (
            <FontAwesomeIcon icon={faUserSlash} color="var(--light-gray)" />
          ),
        estimator: () =>
          getNameById(quote.Estimator, 'estimator').name || (
            <FontAwesomeIcon icon={faUserSlash} color="var(--light-gray)" />
          ),
        checker: () =>
          getNameById(quote.Checker, 'estimator').name || (
            <FontAwesomeIcon icon={faUserSlash} color="var(--light-gray)" />
          ),
        projectManager: () =>
          getNameById(quote.ProjectManager, 'pm').name || (
            <FontAwesomeIcon icon={faUserSlash} color="var(--light-gray)" />
          ),
        dateStarted: () =>
          new Date(quote.DateStarted).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }),
      };

      return <a {...baseProps}>{content[column.key]?.()}</a>;
    },
    [handleQuoteClick, getNameById]
  );

  // Pagination logic
  const paginatedQuotes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredQuotes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredQuotes, currentPage]);

  const totalPages = Math.ceil(filteredQuotes.length / ITEMS_PER_PAGE);

  const renderPagination = () => (
    <div className={styles.pagination}>
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className={styles.pageButton}
      >
        <FontAwesomeIcon icon={faBackward} />
      </button>
      <span className={styles.pageInfo}>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className={styles.pageButton}
      >
        <FontAwesomeIcon icon={faForward} />
      </button>
    </div>
  );

  useEffect(() => {
    fetchQuotes(true);

    setActiveBuilding(0);
    setActiveCard('quote-info');

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

  const handleDeleteClick = (quote) => {
    openDeleteQuoteDialog(
      quote.ID,
      `Quote ${quote.Quote}${quote.Rev > 0 ? ` R${quote.Rev}` : ''}`,
      null,
      fetchQuotes
    );
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

  const openCopyDialog = (quoteId) => {
    updateDialog('copyBuilding', {
      isOpen: true,
      data: quoteId,
    });
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
          {paginatedQuotes.length > 0 ? (
            <>
              <table>
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.key}>{column.label}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedQuotes.map((quote) => (
                    <tr key={quote.ID} className={styles.quoteRow}>
                      {columns.map((column) => (
                        <td key={column.key}>{renderCell(quote, column)}</td>
                      ))}
                      <td>
                        <div>
                          <button
                            className="icon actionButton reject"
                            onClick={() => handleDeleteClick(quote)}
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
              {filteredQuotes.length > ITEMS_PER_PAGE - 1 && renderPagination()}
            </>
          ) : (
            <h5 className={styles.message}>No quotes found</h5>
          )}
          <DeleteDialog />
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
