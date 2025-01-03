'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { redirect, useRouter } from 'next/navigation';
import styles from './page.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faTrash,
  faComment,
  faCheck,
  faSave,
} from '@fortawesome/free-solid-svg-icons';

// Quote Form Section
import ProjectInformation from '../../../components/quoteSections/ProjectInformation';
import BuildingLayout from '../../../components/quoteSections/BuildingLayout';
import BuildingWallOptions from '../../../components/quoteSections/BuildingWallOptions';
import BuildingRoofOptions from '../../../components/quoteSections/BuildingRoofOptions';
import BuildingPartitions from '../../../components/quoteSections/BuildingPartitions';
import BuildingOpenings from '../../../components/quoteSections/BuildingOpenings';
import Notes from '@/components/quoteSections/Notes';
import FinalizeQuote from '../../../components/quoteSections/FinalizeQuote';
import BuildingProject from '@/components/quoteSections/BuildingProject';

import DeleteDialog from '../../../components/DeleteDialog';
import BuildingSketch from '../../../components/BuildingSketch';
import ReusableLoader from '@/components/ReusableLoader';

import PageHeader from '@/components/PageHeader';
import Accessories from '@/components/quoteSections/Accessories';

import { useUIContext } from '@/contexts/UIContext';
import { useBuildingContext } from '@/contexts/BuildingContext';
import { useUserContext } from '@/contexts/UserContext';
import { useSession } from 'next-auth/react';

const QuoteClient = () => {
  const router = useRouter();

  // Local State
  const [isDesktop, setDesktop] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const initialRender = useRef(true);

  // Contexts
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });
  const isEstimator = session?.user?.estimator === 1;
  const {
    activeBuilding,
    activeCard,
    currentIndex,
    navItems,
    dialogs,
    setActiveBuilding,
    setActiveCard,
    handlePrev,
    handleNext,
    handleDotClick,
    updateDialog,
    setLoading,
    showToast,
  } = useUIContext();
  const { companyData, hasPermission } = useUserContext();
  const { state, complexityInfo, setValues } = useBuildingContext();

  // Derived State
  const submitted = !!(state.quoteProgress & 0b00000100);
  const inChecking = !!(state.quoteProgress & 0b00010000);
  const locked =
    (submitted || inChecking) &&
    session?.user?.estimator == 0 &&
    !hasPermission(3);

  /*
  Progress Bits:
    00 00 00 00
    ││ ││ ││ │└─ Started     -Quote was started and saved
    ││ ││ ││ └── InHouse     -Quote was price from MBS, never submitted to PBS
    ││ ││ │└──── Submitted   -Quote was submitted to PBS for estimating ──────┐
    ││ ││ └───── Rejected    -Quote was returned to dealer with fixes needed ─┴── When turning on Rejected need to turn off Submitted but leave Rejected on when resubmitting
    ││ │└─────── InChecking  -Quote was estimated and is being checked
    ││ └──────── Returned    -Quote was finished by estimating and returned to dealer
    │└────────── Completed   -Quote was Closed Out
    └─────────── OPEN

  Status Bits:
    00 00 00 00
    ││ ││ ││ │└─ Active      -Quote is active and not deleted
    ││ ││ ││ └── Canceled    -Quote is canceled
    ││ ││ │└──── OnHold      -Quote is on hold
    ││ ││ └───── Archived    -Quote is archived
    ││ │└─────── Sold        -Quote is sold and now a job
    ││ └──────── OPEN
    │└────────── OPEN
    └─────────── OPEN
  */

  // Local Functions
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Early validation
    if (!companyData?.ID) {
      showToast({
        title: 'Error',
        message: 'Company information not available',
        type: 'error',
      });
      return;
    }

    setLoading(true, 'Saving quote...');

    try {
      const saveData = {
        currentQuote: state.quoteId || 0,
        user: {
          id: session?.user?.id,
          company: companyData.ID,
        },
        state: {
          ...state,
        },
        salesPerson: state.salesPerson,
        projectManager: state.projectManager,
        estimator: state.estimator,
        checker: state.checker,
        complexity: complexityInfo?.complexity || 1,
      };

      const response = await fetch('/api/auth/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData),
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save quote');
      }

      const data = await response.json();

      // Handle new quote case
      if (!state.quoteId && data.message?.quoteId) {
        setValues({
          ...state,
          quoteId: data.message.quoteId,
          quoteNumber: data.message.quoteNum,
          quoteProgress: 1,
          quoteStatus: 1,
        });
      }

      showToast({
        title: 'Success',
        message: 'Quote saved successfully',
        type: 'success',
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      // Handle submission case
      if (submitted && !isEstimator) {
        router.replace('/tracker');
      }
    } catch (error) {
      console.error('Save error:', error);
      showToast({
        title: 'Error',
        message: error.message || 'Failed to save quote',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete functionality
  const handleDeleteClick = () => {
    updateDialog('deleteQuote', {
      isOpen: true,
      data: {
        quoteId: state.id,
        quoteName: `Quote ${state.quoteNumber}`,
        redirectUrl: '/dashboard',
      },
    });
  };

  useEffect(() => {
    const handleResize = () => setDesktop(window.innerWidth > 1000);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBackWithClear = useCallback(() => {
    setValues(null); // Clear the building context
    router.replace('/tracker');
  }, [setValues, router]);

  return (
    <main>
      <PageHeader
        title="Quote Input"
        subtitle={[
          state.quoteNumber,
          state.revNumber > 0 && `R${state.revNumber}`,
          state.customerName && state.quoteNumber && '-',
          state.customerName,
          (state.quoteNumber || state.customerName) && state.projectName && '-',
          state.projectName,
        ]
          .filter(Boolean)
          .join(' ')}
        complexityInfo={complexityInfo}
        backPage={'tracker'}
        onBack={handleBackWithClear}
      />
      {/* Sidebar Navigation */}
      {isDesktop && (
        <div>
          <div className={styles.tabContainer}>
            {state.quoteId != 0 && (
              <>
                {/* <button
                  type="button"
                  className={styles.noteTab}
                  // onClick={openQuoteEstimatorNotes}
                >
                  <FontAwesomeIcon icon={faComment} />
                  <div className={styles.noteQty}>3</div>
                </button> */}
                {!locked && (
                  <button
                    type="button"
                    className={styles.deleteTab}
                    onClick={handleDeleteClick}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </>
            )}
            {!locked && (
              <button
                type="button"
                className={styles.saveTab}
                onClick={handleSubmit}
              >
                <FontAwesomeIcon icon={saveSuccess ? faCheck : faSave} />
              </button>
            )}
          </div>
          {/* Sidebar Nav */}
          <nav className={styles.sidebar}>
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`${item.id.includes('bldg-') ? styles.bldg : ''} ${
                  activeCard === item.id ? styles.activeCard : ''
                }`}
                onClick={() => setActiveCard(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          {(state.buildings[activeBuilding].width > 0 ||
            state.buildings[activeBuilding].length > 0) && (
            <section className={`card ${styles.sketchBox}`}>
              <header>
                <h3>Active Building</h3>
              </header>

              <div className={styles.sketch}>
                <BuildingSketch />
              </div>
            </section>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="inputForm">
        {/* Project Info Page */}
        {activeCard == 'quote-info' && <ProjectInformation locked={locked} />}
        {/* Building Project Page */}
        {activeCard == 'building-project' && (
          <BuildingProject locked={locked} />
        )}
        {/* Building Layout Page */}
        {activeCard == 'bldg-layout' && activeBuilding != null && (
          <BuildingLayout locked={locked} />
        )}
        {/* Building Partitions Page */}
        {activeCard == 'bldg-partitions' && (
          <>
            <BuildingPartitions locked={locked} />
          </>
        )}
        {/* Building Roof Options Page */}
        {activeCard == 'bldg-roof-options' && (
          <>
            <BuildingRoofOptions locked={locked} />
          </>
        )}
        {/* Building Wall Options Page */}
        {activeCard == 'bldg-wall-options' && (
          <>
            <BuildingWallOptions locked={locked} />
          </>
        )}
        {/* {activeCard == 'bldg-cranes' && <section></section>} */}
        {activeCard == 'bldg-openings' && (
          <>
            <BuildingOpenings locked={locked} />
          </>
        )}
        {/* Accessories Page */}
        {activeCard == 'accessories' && <Accessories locked={locked} />}
        {/* Notes Page */}
        {activeCard == 'notes' && <Notes locked={locked} />}
        {/* Finalize Page */}
        {activeCard == 'finalize-quote' && <FinalizeQuote locked={locked} />}
        {!isDesktop &&
          (state.buildings[activeBuilding].width > 0 ||
            state.buildings[activeBuilding].length > 0) && (
            <section className={`card ${styles.sketchBox}`}>
              <header>
                <h3>Active Building</h3>
              </header>

              <div className={styles.sketch}>
                <BuildingSketch />
              </div>
            </section>
          )}
      </form>
      {/* Carousel Navigation */}
      {!isDesktop && (
        <nav className={styles.carouselNav}>
          <button
            type="button"
            className={styles.navArrow}
            onClick={handlePrev}
          >
            <FontAwesomeIcon icon={faChevronLeft} size="2x" />
          </button>
          <div className={styles.carouselContainer}>
            <div className={styles.carouselItem}>
              {navItems[currentIndex].label}
            </div>
            <div className={styles.dotContainer}>
              {navItems.map((item, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${
                    index === currentIndex ? styles.activeDot : ''
                  }`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to ${item.label}`}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            className={styles.navArrow}
            onClick={handleNext}
          >
            <FontAwesomeIcon icon={faChevronRight} size="2x" />
          </button>
        </nav>
      )}

      {/* Dialogs */}
      <DeleteDialog
        isOpen={dialogs.deleteQuote.isOpen}
        onClose={() => updateDialog('deleteQuote', { isOpen: false })}
        onDelete={handleDeleteClick}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${dialogs.deleteQuote.data?.quoteName}?`}
      />

      <ReusableLoader
        isOpen={dialogs.loader.isOpen}
        title={dialogs.loader.title}
        message={dialogs.loader.message}
      />
    </main>
  );
};

export default QuoteClient;
