'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faTrash,
  faCopy,
  faPlus,
  faCheck,
  faSave,
} from '@fortawesome/free-solid-svg-icons';

import useFormState from '@/hooks/useFormState';
import useNavigation from '@/hooks/useNavigation';
import useWind from '@/hooks/useWind';

import { initialState } from './_initialState';
// Quote Form Section
import ProjectInformation from '../../../components/quoteSections/ProjectInformation';
import BuildingLayout from '../../../components/quoteSections/BuildingLayout';
import BuildingOptions from '../../../components/quoteSections/BuildingOptions';
import BuildingExtensions from '../../../components/quoteSections/BuildingExtensions';
import BuildingPartitions from '../../../components/quoteSections/BuildingPartitions';
import BuildingOpenings from '../../../components/quoteSections/BuildingOpenings';
import FinalizeQuote from '../../../components/quoteSections/FinalizeQuote';

import CopyBuildingDialog from '../../../components/CopyBuildingDialog';
import DeleteDialog from '../../../components/DeleteDialog';
import BuildingSketch from '../../../components/BuildingSketch';
import FeetInchesInput from '../../../components/Inputs/FeetInchesInput';

import PageHeader from '@/components/PageHeader';

export default function ClientQuote({ session, quoteId, initialQuoteData }) {
  // State variables
  const [isDesktop, setDesktop] = useState(false);
  const [activeBuilding, setActiveBuilding] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [sourceBuildingIndex, setSourceBuildingIndex] = useState(0);
  const [isQuoteDeleteDialogOpen, setIsQuoteDeleteDialogOpen] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const initialRender = useRef(true);
  const router = useRouter();

  // Hooks
  const {
    values,
    lastChangedWall,
    handleChange,
    handleNestedChange,
    handleCanopyChange,
    handlePartitionChange,
    handleLinerPanelChange,
    handleWainscotChange,
    handlePartialWallChange,
    handleWallSkirtChange,
    handleOpeningChange,
    handleCalcChange,
    setValues,
  } = useFormState(initialState);

  const {
    navItems,
    activeCard,
    currentIndex,
    handlePrev,
    handleNext,
    handleDotClick,
    setActiveCardDirectly,
  } = useNavigation(activeBuilding, 0);

  const addBuilding = () => {
    setValues((prev) => ({
      ...prev,
      buildings: [
        ...prev.buildings,
        {
          width: '',
          length: '',
          offsetX: '',
          offsetY: '',
          rotation: '',
          commonWall: '',
          shape: 'symmetrical',
          backPeakOffset: '',
          eaveHeight: '',
          lowEaveHeight: '',
          highEaveHeight: '',
          backEaveHeight: '',
          frontEaveHeight: '',
          roofPitch: '',
          backRoofPitch: '',
          frontRoofPitch: '',
          swBaySpacing: '',
          lewBaySpacing: '',
          rewBaySpacing: '',
          collateralLoad: values.collateralLoad,
          liveLoad: values.liveLoad,
          deadLoad: values.deadLoad,
          enclosure: '',
          roofLoad: values.roofLoad,
          thermalFactor: '',
          frameType: 'rigidFrame',
          intColSpacing: '',
          straightExtColumns: false,
          noFlangeBraces: false,
          lewFrame: 'postAndBeam',
          leftEndwallInset: '',
          lewIntColSpacing: '',
          rewFrame: 'postAndBeam',
          rightEndwallInset: '',
          rewIntColSpacing: '',
          fswBracingType: 'xbrace',
          fswBracingHeight: '',
          bswBracingType: 'xbrace',
          bswBracingHeight: '',
          lewBracingType: 'xbrace',
          lewBracingHeight: '',
          rewBracingType: 'xbrace',
          rewBracingHeight: '',
          fswBracedBays: '',
          bswBracedBays: '',
          lewBracedBays: '',
          rewBracedBays: '',
          roofBracedBays: '',
          roofBreakPoints: 'left',
          fswGirtType: 'bipass',
          bswGirtType: 'bipass',
          lewGirtType: 'bipass',
          rewGirtType: 'bipass',
          fswGirtSpacing: 'default',
          bswGirtSpacing: 'default',
          lewGirtSpacing: 'default',
          rewGirtSpacing: 'default',
          baseCondition: 'angle',
          purlinSpacing: '',
          roofPanelType: 'pbr',
          roofPanelGauge: '',
          roofPanelFinish: '',
          wallPanelType: 'pbr',
          wallPanelGauge: '',
          wallPanelFinish: '',
          includeGutters: false,
          roofInsulation: '',
          roofInsulationOthers: false,
          wallInsulation: '',
          wallInsulationOthers: false,
          // Building - Extensions
          fswExtensionWidth: '',
          bswExtensionWidth: '',
          lewExtensionWidth: '',
          rewExtensionWidth: '',
          frontExtensionBays: '',
          frontExtensionColumns: false,
          backExtensionBays: '',
          backExtensionColumns: false,
          extensionInsulation: 'none',
          soffitPanelType: 'tuff',
          soffitPanelGauge: '',
          soffitPanelFinish: '',
          canopies: [],
          partitions: [],
          linerPanels: [],
          wainscots: [],
          partialWalls: [],
          wallSkirts: [],
          fswPolySize: '3',
          fswPolyColor: 'clear',
          fswPolyQty: '',
          bswPolySize: '3',
          bswPolyColor: 'clear',
          bswPolyQty: '',
          lewPolySize: '3',
          lewPolyColor: 'clear',
          lewPolyQty: '',
          rewPolySize: '3',
          rewPolyColor: 'clear',
          rewPolyQty: '',
          backRoofPolySize: '10',
          backRoofPolyColor: 'clear',
          backRoofPolyQty: '',
          frontRoofPolySize: '10',
          frontRoofPolyColor: 'clear',
          frontRoofPolyQty: '',
          openings: {
            fsw: [],
            bsw: [],
            lew: [],
            rew: [],
          },
        },
      ],
    }));
    setActiveBuilding(values.buildings.length);
  };

  const removeBuilding = (indexToRemove) => {
    setValues((prev) => ({
      ...prev,
      buildings: prev.buildings.filter((_, index) => index !== indexToRemove),
    }));

    // If the removed building was active, set the first building as active
    if (indexToRemove === activeBuilding) {
      setActiveBuilding(0);
    } else if (indexToRemove < activeBuilding) {
      // If a building before the active one is removed, adjust the active index
      setActiveBuilding((prev) => prev - 1);
    }
  };

  const openCopyDialog = (index) => {
    setSourceBuildingIndex(index);
    setDialogOpen(true);
  };

  const closeCopyDialog = () => {
    setDialogOpen(false);
    setSourceBuildingIndex(null);
  };

  const copyBuilding = (targetIndex) => {
    if (sourceBuildingIndex === null) {
      closeCopyDialog();
      return;
    }

    setValues((prev) => {
      const newBuildings = [...prev.buildings];
      const sourceBuilding = newBuildings[sourceBuildingIndex];

      // Create a deep copy of the source building
      const buildingToCopy = JSON.parse(JSON.stringify(sourceBuilding));

      // Reset certain properties that should not be copied
      buildingToCopy.offsetX = '';
      buildingToCopy.offsetY = '';
      buildingToCopy.rotation = '';
      buildingToCopy.commonWall = '';

      if (targetIndex === 'new') {
        newBuildings.push(buildingToCopy);
      } else {
        // Merge the copied building with the existing one at the target index
        newBuildings[targetIndex] = {
          ...newBuildings[targetIndex],
          ...buildingToCopy,
          // Preserve the original offsets and rotation for existing buildings
          offsetX: newBuildings[targetIndex].offsetX,
          offsetY: newBuildings[targetIndex].offsetY,
          rotation: newBuildings[targetIndex].rotation,
          commonWall: newBuildings[targetIndex].commonWall,
        };
      }

      return { ...prev, buildings: newBuildings };
    });

    closeCopyDialog();
  };

  const openDeleteDialog = (index) => {
    setBuildingToDelete(index);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setBuildingToDelete(null);
  };

  const confirmRemoveBuilding = () => {
    if (buildingToDelete !== null) {
      removeBuilding(buildingToDelete);
      closeDeleteDialog();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let company = session.user.company;

    try {
      const response = await fetch('/api/auth/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentQuote, company, values }),
      });

      if (response.ok) {
        const data = await response.json();
        if (isNaN(data.message)) {
          console.log(data.message);
        } else {
          setCurrentQuote(data.message);
        }

        setSaveSuccess(true);
        // Reset saveSuccess after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Something went wrong');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const openQuoteDeleteDialog = () => {
    setIsQuoteDeleteDialogOpen(true);
  };

  const closeQuoteDeleteDialog = () => {
    setIsQuoteDeleteDialogOpen(false);
  };

  const handleDeleteQuote = async () => {
    if (!session) return;

    try {
      const url = new URL(`/api/quotes/${quoteId}`, window.location.origin);

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

      router.push('/dashboard');
      closeDeleteDialog();
    } catch (error) {
      console.error('Error deleting quote:', error);
      alert('Failed to delete quote. Please try again.');
    }
  };

  // Checking for screen width to conditionally render DOM elements
  useEffect(() => {
    if (initialRender.current) {
      if (initialQuoteData) {
        setCurrentQuote(quoteId);
        setValues(initialQuoteData);
      }
      initialRender.current = false;
    }

    if (window.innerWidth > 1000) {
      setDesktop(true);
    } else {
      setDesktop(false);
    }

    const updateMedia = () => {
      if (window.innerWidth > 1000) {
        setDesktop(true);
      } else {
        setDesktop(false);
      }
    };
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, [initialQuoteData, currentIndex]);

  return (
    <main>
      <PageHeader session={session} title="Quote Input" isLogOut={false} />
      {/* Sidebar Navigation */}
      {isDesktop && (
        <div>
          <div className={styles.tabContainer}>
            {quoteId != 0 && (
              <button
                onClick={openQuoteDeleteDialog}
                className={styles.deleteTab}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
            <button onClick={handleSubmit} className={styles.saveTab}>
              <FontAwesomeIcon icon={saveSuccess ? faCheck : faSave} />
            </button>
          </div>
          <nav className={styles.sidebar}>
            <button onClick={() => setActiveCardDirectly('quote-info')}>
              Project Information
            </button>
            {/* <button onClick={() => setActiveCardDirectly('design-code')}>
              Design Codes
            </button> */}
            <button onClick={() => setActiveCardDirectly('building-project')}>
              Building Project
            </button>
            <button onClick={() => setActiveCardDirectly('bldg-layout')}>
              Building {activeBuilding + 1} - Layout
            </button>
            <button onClick={() => setActiveCardDirectly('bldg-extensions')}>
              Building {activeBuilding + 1} - Extensions
            </button>
            <button onClick={() => setActiveCardDirectly('bldg-partitions')}>
              Building {activeBuilding + 1} - Partitions
            </button>
            <button onClick={() => setActiveCardDirectly('bldg-options')}>
              Building {activeBuilding + 1} - Options
            </button>
            {/* <button onClick={() => setActiveCardDirectly('bldg-cranes')}>
              Building {activeBuilding + 1} - Cranes
            </button> */}
            <button onClick={() => setActiveCardDirectly('bldg-openings')}>
              Building {activeBuilding + 1} - Openings
            </button>
            <button onClick={() => setActiveCardDirectly('accessories')}>
              Accessories
            </button>
            <button onClick={() => setActiveCardDirectly('finalize-quote')}>
              Finalize Quote
            </button>
          </nav>
          {(values.buildings[activeBuilding].width > 0 ||
            values.buildings[activeBuilding].length > 0) && (
            <section className={`card start ${styles.sketchBox}`}>
              <header>
                <h3>Active Building</h3>
              </header>

              <div className={styles.sketch}>
                <BuildingSketch
                  buildingData={values.buildings[activeBuilding]}
                  lastChangedWall={lastChangedWall}
                />
              </div>
            </section>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="inputForm">
        {/* Project Info Page */}
        {activeCard == 'quote-info' && (
          <ProjectInformation
            values={values}
            handleChange={handleChange}
            setValues={setValues}
          />
        )}
        {/* Design Code Page */}
        {/* {activeCard == 'design-code' && (
          <DesignCodes values={values} handleChange={handleChange} />
        )} */}
        {/* Building Project Page */}
        {activeCard == 'building-project' && (
          <section className="page">
            <div className="projectCard">
              {/* Buildings section */}
              {values.buildings.map((building, index) => (
                <div key={index} className={styles.buildingContainer}>
                  <div className={styles.buildingTitleContainer}>
                    <h3>Building {index + 1}</h3>
                    <button
                      className={styles.copyBuilding}
                      type="button"
                      onClick={() => openCopyDialog(index)}
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </button>
                  </div>
                  <div className={styles.buildingProjectContainer}>
                    <FeetInchesInput
                      name={`buildingWidth-${index}`}
                      label="Width:"
                      value={building.width}
                      onChange={(name, value) =>
                        handleNestedChange(index, 'width', value)
                      }
                      row={true}
                      disabled={index != activeBuilding}
                    />
                  </div>
                  <div className={styles.buildingProjectContainer}>
                    <FeetInchesInput
                      name={`buildingLength-${index}`}
                      label="Length:"
                      value={building.length}
                      onChange={(name, value) =>
                        handleNestedChange(index, 'length', value)
                      }
                      row={true}
                      disabled={index != activeBuilding}
                    />
                  </div>
                  <div className={styles.buildingProjectContainer}>
                    <FeetInchesInput
                      name={`buildingOffsetX-${index}`}
                      label="Left/Right:"
                      value={building.offsetX}
                      onChange={(name, value) =>
                        handleNestedChange(index, 'offsetX', value)
                      }
                      row={true}
                      disabled={index != activeBuilding}
                    />
                  </div>
                  <div className={styles.buildingProjectContainer}>
                    <FeetInchesInput
                      name={`buildingOffsetY-${index}`}
                      label="Back/Front:"
                      value={building.offsetY}
                      onChange={(name, value) =>
                        handleNestedChange(index, 'offsetY', value)
                      }
                      row={true}
                      disabled={index != activeBuilding}
                    />
                  </div>
                  <div className={styles.buildingProjectContainer}>
                    <label htmlFor={`buildingRotation-${index}`}>
                      Rotation:
                    </label>
                    <input
                      type="number"
                      id={`buildingRotation-${index}`}
                      name={`buildingRotation-${index}`}
                      value={building.rotation}
                      onChange={(name, value) =>
                        handleNestedChange(index, 'rotation', value)
                      }
                      min="0"
                      max="360"
                      step="15"
                      disabled={index != activeBuilding}
                    />
                  </div>
                  <div className={styles.buildingProjectContainer}>
                    <label htmlFor={`buildingCommonWall-${index}`}>
                      Common Wall:
                    </label>
                    <select
                      id={`buildingCommonWall-${index}`}
                      name={`buildingCommonWall-${index}`}
                      value={building.commonWall}
                      onChange={(name, value) =>
                        handleNestedChange(index, 'commonWall', value)
                      }
                      disabled={index != activeBuilding}
                    >
                      <option value="">Select a building</option>
                      {values.buildings.map(
                        (_, buildingIndex) =>
                          buildingIndex !== index && (
                            <option
                              key={buildingIndex}
                              value={buildingIndex + 1}
                            >
                              Building {buildingIndex + 1}
                            </option>
                          )
                      )}
                    </select>
                  </div>
                  <div className={styles.buttonContainer}>
                    {/* Active Button */}
                    <button
                      className={`${styles.activeBuilding} ${activeBuilding === index ? styles.activeBuildingSelected : ''}`}
                      type="button"
                      onClick={() => setActiveBuilding(index)}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>

                    {/* Delete Button */}
                    {values.buildings.length > 1 && index !== 0 && (
                      <button
                        className={styles.removeBuilding}
                        type="button"
                        onClick={() => openDeleteDialog(index)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                className={styles.addBuilding}
                type="button"
                onClick={addBuilding}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </section>
        )}
        {/* Building Layout Page */}
        {activeCard == 'bldg-layout' && activeBuilding != null && (
          <BuildingLayout
            values={values}
            activeBuilding={activeBuilding}
            handleNestedChange={handleNestedChange}
            handleCalcChange={handleCalcChange}
          />
        )}
        {/* Building Extensions Page */}
        {activeCard == 'bldg-extensions' && (
          <>
            <BuildingExtensions
              values={values}
              activeBuilding={activeBuilding}
              handleNestedChange={handleNestedChange}
              handleCanopyChange={handleCanopyChange}
              setValues={setValues}
              isDesktop={isDesktop}
            />
          </>
        )}
        {/* Building Partitions Page */}
        {activeCard == 'bldg-partitions' && (
          <>
            <BuildingPartitions
              values={values}
              activeBuilding={activeBuilding}
              handlePartitionChange={handlePartitionChange}
              setValues={setValues}
              isDesktop={isDesktop}
            />
          </>
        )}
        {/* Building Options Page */}
        {activeCard == 'bldg-options' && (
          <>
            <BuildingOptions
              values={values}
              activeBuilding={activeBuilding}
              handleNestedChange={handleNestedChange}
              handleLinerPanelChange={handleLinerPanelChange}
              handleWainscotChange={handleWainscotChange}
              handlePartialWallChange={handlePartialWallChange}
              handleWallSkirtChange={handleWallSkirtChange}
              setValues={setValues}
              isDesktop={isDesktop}
            />
          </>
        )}
        {activeCard == 'bldg-cranes' && <section></section>}
        {activeCard == 'bldg-openings' && (
          <>
            <BuildingOpenings
              values={values}
              activeBuilding={activeBuilding}
              handleOpeningChange={handleOpeningChange}
              setValues={setValues}
              isDesktop={isDesktop}
            />
          </>
        )}
        {activeCard == 'accessories' && <section></section>}
        {activeCard == 'finalize-quote' && (
          <FinalizeQuote values={values} handleChange={handleChange} />
        )}
        {!isDesktop &&
          (values.buildings[activeBuilding].width > 0 ||
            values.buildings[activeBuilding].length > 0) && (
            <section className={`card start ${styles.sketchBox}`}>
              <header>
                <h3>Active Building</h3>
              </header>

              <div className={styles.sketch}>
                <BuildingSketch
                  buildingData={values.buildings[activeBuilding]}
                  lastChangedWall={lastChangedWall}
                />
              </div>
            </section>
          )}
      </form>
      {/* Carousel Navigation */}
      {!isDesktop && (
        <nav className={styles.carouselNav}>
          <button className={styles.navArrow} onClick={handlePrev}>
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
                  className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to ${item.label}`}
                />
              ))}
            </div>
          </div>
          <button className={styles.navArrow} onClick={handleNext}>
            <FontAwesomeIcon icon={faChevronRight} size="2x" />
          </button>
        </nav>
      )}
      <CopyBuildingDialog
        isOpen={dialogOpen}
        onClose={closeCopyDialog}
        buildings={values.buildings}
        onCopy={copyBuilding}
        sourceBuildingIndex={sourceBuildingIndex}
      />
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onDelete={confirmRemoveBuilding}
        title="Confirm Deletion"
        message={`Are you sure you want to delete Building ${buildingToDelete !== null ? buildingToDelete + 1 : ''}?`}
      />
      <DeleteDialog
        isOpen={isQuoteDeleteDialogOpen}
        onClose={closeQuoteDeleteDialog}
        onDelete={handleDeleteQuote}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this whole quote?`}
      />
    </main>
  );
}
