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
  faComment,
  faCopy,
  faPlus,
  faCheck,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import { faCircle, faCircleDot } from '@fortawesome/free-regular-svg-icons';
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
import RoofPitchInput from '../../../components/Inputs/RoofPitchInput';
import ReusableLoader from '@/components/ReusableLoader';
import ReusableInteger from '../../../components/Inputs/ReusableInteger';
import ReusableSlider from '../../../components/Inputs/ReusableSlider';

import PageHeader from '@/components/PageHeader';
import Accessories from '@/components/quoteSections/Accessories';

import { updateStateStructure } from '@/components/StateUpdater';

import { shapes } from '../../../util/dropdownOptions';

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

  const [saveStatus, setSaveStatus] = useState(false);
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
    handleMandoorChange,
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
          offsetX: 0,
          offsetY: 0,
          rotation: 0,
          commonWall: '',
          shape: 'symmetrical',
          backPeakOffset: '',
          backEaveHeight: '',
          frontEaveHeight: '',
          backRoofPitch: '',
          frontRoofPitch: '',
          roofBaySpacing: '',
          frontBaySpacing: '',
          backBaySpacing: '',
          leftBaySpacing: '',
          rightBaySpacing: '',
          collateralLoad: 1.0,
          liveLoad: 20.0,
          deadLoad: 2.5,
          windEnclosure: 'C',
          roofSnowLoad: 0.0,
          thermalFactor: 1,
          frameType: 'rigidFrame',
          intColSpacing: '',
          straightExtColumns: false,
          noFlangeBraces: false,
          leftFrame: 'postAndBeam',
          leftEndwallInset: '',
          leftIntColSpacing: '',
          rightFrame: 'postAndBeam',
          rightEndwallInset: '',
          rightIntColSpacing: '',
          frontBracingType: 'xBrace',
          frontBracingHeight: '',
          backBracingType: 'xBrace',
          backBracingHeight: '',
          leftBracingType: 'xBrace',
          leftBracingHeight: '',
          rightBracingType: 'xBrace',
          rightBracingHeight: '',
          interiorBracingType: 'xBrace',
          interiorBracingHeight: '',
          frontBracedBays: '',
          backBracedBays: '',
          leftBracedBays: '',
          rightBracedBays: '',
          roofBracedBays: '',
          roofBreakPoints: 'left',
          frontGirtType: 'bipass',
          backGirtType: 'bipass',
          leftGirtType: 'bipass',
          rightGirtType: 'bipass',
          frontGirtSpacing: 'default',
          backGirtSpacing: 'default',
          leftGirtSpacing: 'default',
          rightGirtSpacing: 'default',
          leftBaseCondition: 'angle',
          rightBaseCondition: 'angle',
          frontBaseCondition: 'angle',
          backBaseCondition: 'angle',
          purlinSpacing: '',
          roofPanelType: 'pbr',
          roofPanelGauge: '26',
          roofPanelFinish: 'painted',
          wallPanelType: 'pbr',
          wallPanelGauge: '26',
          wallPanelFinish: 'painted',
          includeGutters: true,
          roofInsulation: 'none',
          roofInsulationOthers: false,
          wallInsulation: 'none',
          wallInsulationOthers: false,
          // Building - Extensions
          frontExtensionWidth: 0,
          backExtensionWidth: 0,
          leftExtensionWidth: 0,
          rightExtensionWidth: 0,
          frontExtensionBays: '',
          frontExtensionColumns: false,
          backExtensionBays: '',
          backExtensionColumns: false,
          extensionInsulation: 'none',
          soffitPanelType: 'pbr',
          soffitPanelGauge: '26',
          soffitPanelFinish: 'painted',
          canopies: [],
          partitions: [],
          linerPanels: [],
          wainscots: [],
          partialWalls: [],
          wallSkirts: [],
          frontPolySize: '3',
          frontPolyColor: 'clear',
          frontPolyQty: '',
          backPolySize: '3',
          backPolyColor: 'clear',
          backPolyQty: '',
          leftPolySize: '3',
          leftPolyColor: 'clear',
          leftPolyQty: '',
          rightPolySize: '3',
          rightPolyColor: 'clear',
          rightPolyQty: '',
          backRoofPolySize: '10',
          backRoofPolyColor: 'clear',
          backRoofPolyQty: '',
          frontRoofPolySize: '10',
          frontRoofPolyColor: 'clear',
          frontRoofPolyQty: '',
          openings: {
            front: [],
            back: [],
            left: [],
            right: [],
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
    setSaveStatus(true);

    let user = session.user;

    try {
      const response = await fetch('/api/auth/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentQuote, user, values }),
      });

      if (response.ok) {
        const data = await response.json();
        if (isNaN(data.message.quoteId)) {
          console.log(data.message);
        } else {
          setCurrentQuote(data.message.quoteId);
          setValues({ ...values, quoteNumber: data.message.quoteNum });
        }

        setSaveSuccess(true);
        setSaveStatus(false);
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
        const updatedQuoteData = updateStateStructure(initialQuoteData);
        setValues(updatedQuoteData);
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
              <>
                <button
                  type="button"
                  className={styles.noteTab}
                  // onClick={openQuoteEstimatorNotes}
                >
                  <FontAwesomeIcon icon={faComment} />
                  <div className={styles.noteQty}>3</div>
                </button>
                <button
                  type="button"
                  className={styles.deleteTab}
                  onClick={openQuoteDeleteDialog}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </>
            )}
            <button
              type="button"
              className={styles.saveTab}
              onClick={handleSubmit}
            >
              <FontAwesomeIcon icon={saveSuccess ? faCheck : faSave} />
            </button>
          </div>
          <nav className={styles.sidebar}>
            <button
              className={`${activeCard == 'quote-info' ? styles.activeCard : ''}`}
              onClick={() => setActiveCardDirectly('quote-info')}
            >
              Project Information
            </button>
            {/* <button
              className={`${activeCard == 'design-code' ? styles.activeCard : ''}`}
              onClick={() => setActiveCardDirectly('design-code')}
            >
              Design Codes
            </button> */}
            <button
              className={`${activeCard == 'building-project' ? styles.activeCard : ''}`}
              onClick={() => setActiveCardDirectly('building-project')}
            >
              Building Project
            </button>
            <button
              className={`${styles.bldg} ${activeCard == 'bldg-layout' ? styles.activeCard : ''}`}
              onClick={() => setActiveCardDirectly('bldg-layout')}
            >
              Building {String.fromCharCode(activeBuilding + 65)} - Layout
            </button>
            <button
              className={`${styles.bldg} ${activeCard == 'bldg-extensions' ? styles.activeCard : ''}`}
              onClick={() => setActiveCardDirectly('bldg-extensions')}
            >
              Building {String.fromCharCode(activeBuilding + 65)} - Extensions
            </button>
            <button
              className={`${styles.bldg} ${activeCard == 'bldg-partitions' ? styles.activeCard : ''}`}
              onClick={() => setActiveCardDirectly('bldg-partitions')}
            >
              Building {String.fromCharCode(activeBuilding + 65)} - Partitions
            </button>
            <button
              className={`${styles.bldg} ${activeCard == 'bldg-options' ? styles.activeCard : ''}`}
              onClick={() => setActiveCardDirectly('bldg-options')}
            >
              Building {String.fromCharCode(activeBuilding + 65)} - Options
            </button>
            {/* <button
              className={`${styles.bldg} ${activeCard == 'bldg-cranes' ? styles.activeCard : ''}`}
              onClick={() => setActiveCardDirectly('bldg-cranes')}
            >
              Building {String.fromCharCode(activeBuilding + 65)} - Cranes
            </button> */}
            <button
              className={`${styles.bldg} ${activeCard == 'bldg-openings' ? styles.activeCard : ''}`}
              onClick={() => setActiveCardDirectly('bldg-openings')}
            >
              Building {String.fromCharCode(activeBuilding + 65)} - Openings
            </button>
            <button
              className={`${activeCard == 'accessories' ? styles.activeCard : ''}`}
              onClick={() => setActiveCardDirectly('accessories')}
            >
              Accessories
            </button>
            <button
              className={`${activeCard == 'finalize-quote' ? styles.activeCard : ''}`}
              onClick={() => setActiveCardDirectly('finalize-quote')}
            >
              Finalize Quote
            </button>
          </nav>
          {(values.buildings[activeBuilding].width > 0 ||
            values.buildings[activeBuilding].length > 0) && (
            <section className={`card ${styles.sketchBox}`}>
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
                    <h3>Building {String.fromCharCode(index + 65)}</h3>
                    <button
                      type="button"
                      className="icon actionButton sec"
                      onClick={() => openCopyDialog(index)}
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </button>
                  </div>

                  <div className="grid4">
                    <fieldset
                      className={`${styles.whiteGroup} radioGroup span2 center`}
                    >
                      {shapes.map(({ id, label }) => (
                        <div key={id}>
                          <input
                            type="radio"
                            id={`${id}-${index}`}
                            name={`shape-${index}`}
                            value={id}
                            checked={building.shape === id}
                            onChange={(e) =>
                              handleNestedChange(index, 'shape', e.target.value)
                            }
                            disabled={index != activeBuilding}
                          />
                          <label htmlFor={`${id}-${index}`}>{label}</label>
                        </div>
                      ))}
                    </fieldset>
                    {building.shape == 'nonSymmetrical' && (
                      <FeetInchesInput
                        name={`buildingPeakOffset-${index}`}
                        label="Back Peak Offset:"
                        value={building.backPeakOffset}
                        allowBlankValue={true}
                        onChange={(name, value) =>
                          handleNestedChange(index, 'backPeakOffset', value)
                        }
                        disabled={index != activeBuilding}
                      />
                    )}
                  </div>
                  <div className="grid4">
                    <FeetInchesInput
                      name={`buildingWidth-${index}`}
                      label="Width:"
                      value={building.width}
                      allowBlankValue={true}
                      onChange={(name, value) =>
                        handleNestedChange(index, 'width', value)
                      }
                      disabled={index != activeBuilding}
                    />
                    <FeetInchesInput
                      name={`buildingLength-${index}`}
                      label="Length:"
                      value={building.length}
                      allowBlankValue={true}
                      onChange={(name, value) =>
                        handleNestedChange(index, 'length', value)
                      }
                      disabled={index != activeBuilding}
                    />
                    {building.shape == 'symmetrical' && (
                      <>
                        <FeetInchesInput
                          name={`buildingBackEaveHeight-${index}`}
                          label="Eave Height:"
                          value={building.backEaveHeight}
                          allowBlankValue={true}
                          onChange={(name, value) =>
                            handleNestedChange(index, 'backEaveHeight', value)
                          }
                          disabled={index != activeBuilding}
                        />
                        <div className="onDesktop"></div>
                        <RoofPitchInput
                          name={`buildingBackRoofPitch-${index}`}
                          label="Roof Pitch:"
                          value={building.backRoofPitch}
                          allowBlankValue={true}
                          onChange={(name, value) =>
                            handleNestedChange(index, 'backRoofPitch', value)
                          }
                          disabled={index != activeBuilding}
                        />
                      </>
                    )}
                    {(building.shape == 'singleSlope' ||
                      building.shape == 'leanTo') && (
                      <>
                        <FeetInchesInput
                          name={`buildingBackEaveHeight-${index}`}
                          label="Low Eave Height:"
                          value={building.backEaveHeight}
                          allowBlankValue={true}
                          onChange={(name, value) =>
                            handleNestedChange(index, 'backEaveHeight', value)
                          }
                          disabled={index != activeBuilding}
                        />
                        <FeetInchesInput
                          name={`buildingFrontEaveHeight-${index}`}
                          label="High Eave Height:"
                          value={building.frontEaveHeight}
                          allowBlankValue={true}
                          onChange={(name, value) =>
                            handleNestedChange(index, 'frontEaveHeight', value)
                          }
                          disabled={index != activeBuilding}
                        />
                        <RoofPitchInput
                          name={`buildingBackRoofPitch-${index}`}
                          label="Roof Pitch:"
                          value={building.backRoofPitch}
                          onChange={(name, value) =>
                            handleNestedChange(index, 'backRoofPitch', value)
                          }
                          disabled={index != activeBuilding}
                        />
                      </>
                    )}
                    {building.shape == 'nonSymmetrical' && (
                      <>
                        <FeetInchesInput
                          name={`buildingBackEaveHeight-${index}`}
                          label="Back Eave Height:"
                          value={building.backEaveHeight}
                          allowBlankValue={true}
                          onChange={(name, value) =>
                            handleNestedChange(index, 'backEaveHeight', value)
                          }
                          disabled={index != activeBuilding}
                        />
                        <FeetInchesInput
                          name={`buildingFrontEaveHeight-${index}`}
                          label="Front Eave Height:"
                          value={building.frontEaveHeight}
                          allowBlankValue={true}
                          onChange={(name, value) =>
                            handleNestedChange(index, 'frontEaveHeight', value)
                          }
                          disabled={index != activeBuilding}
                        />
                        <RoofPitchInput
                          name={`buildingBackRoofPitch-${index}`}
                          label="Back Roof Pitch:"
                          value={building.backRoofPitch}
                          onChange={(name, value) =>
                            handleNestedChange(index, 'backRoofPitch', value)
                          }
                          disabled={index != activeBuilding}
                        />
                        <RoofPitchInput
                          name={`buildingFrontRoofPitch-${index}`}
                          label="Front Roof Pitch:"
                          value={building.frontRoofPitch}
                          onChange={(name, value) =>
                            handleNestedChange(index, 'frontRoofPitch', value)
                          }
                          disabled={index != activeBuilding}
                        />
                      </>
                    )}
                  </div>

                  {values.buildings.length > 1 && index !== 0 && (
                    <>
                      <div className="divider white"></div>
                      <div className="grid4">
                        <ReusableSlider
                          className="blue"
                          type="leftRight"
                          name={`buildingOffsetX-${index}`}
                          value={building.offsetX}
                          allowBlankValue={false}
                          increment={10}
                          placeholder="Feet"
                          label="Left/Right:"
                          labelClass="white center"
                          onChange={(e) =>
                            handleNestedChange(index, 'offsetX', e.target.value)
                          }
                          disabled={index != activeBuilding}
                        />
                        <ReusableSlider
                          className="blue"
                          type="upDown"
                          name={`buildingOffsetY-${index}`}
                          value={building.offsetY}
                          allowBlankValue={false}
                          increment={10}
                          placeholder="Feet"
                          label="Back/Front:"
                          labelClass="white center"
                          onChange={(e) =>
                            handleNestedChange(index, 'offsetY', e.target.value)
                          }
                          disabled={index != activeBuilding}
                        />
                        <ReusableSlider
                          className="blue"
                          type="rotation"
                          name={`buildingRotation-${index}`}
                          value={building.rotation}
                          allowBlankValue={false}
                          increment={90}
                          placeholder="Degree"
                          label="Rotation:"
                          labelClass="white center"
                          onChange={(e) =>
                            handleNestedChange(
                              index,
                              'rotation',
                              e.target.value
                            )
                          }
                          disabled={index != activeBuilding}
                        />
                        <div className="cardInput">
                          <div className="center">
                            <label htmlFor={`buildingCommonWall-${index}`}>
                              Common Wall:
                            </label>
                          </div>
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
                                    Building{' '}
                                    {String.fromCharCode(buildingIndex + 65)}
                                  </option>
                                )
                            )}
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                  <div className={styles.buttonContainer}>
                    {/* Active Button */}
                    <button
                      type="button"
                      className={`icon actionButton ${activeBuilding === index ? 'success' : 'nuetral'}`}
                      onClick={() => setActiveBuilding(index)}
                    >
                      <FontAwesomeIcon
                        icon={activeBuilding === index ? faCircleDot : faCircle}
                      />
                    </button>

                    {/* Delete Button */}
                    {values.buildings.length > 1 && index !== 0 && (
                      <button
                        type="button"
                        className="icon actionButton reject"
                        onClick={() => openDeleteDialog(index)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {values.buildings.length < 9 && (
                <button
                  type="button"
                  className="addButton"
                  onClick={addBuilding}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              )}
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
        {activeCard == 'accessories' && (
          <Accessories
            values={values}
            handleChange={handleChange}
            handleMandoorChange={handleMandoorChange}
            setValues={setValues}
          />
        )}
        {activeCard == 'finalize-quote' && (
          <FinalizeQuote values={values} handleChange={handleChange} />
        )}
        {!isDesktop &&
          (values.buildings[activeBuilding].width > 0 ||
            values.buildings[activeBuilding].length > 0) && (
            <section className={`card ${styles.sketchBox}`}>
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
                  className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
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
        message={`Are you sure you want to delete Building ${buildingToDelete !== null ? String.fromCharCode(buildingToDelete + 65) : ''}?`}
      />
      <DeleteDialog
        isOpen={isQuoteDeleteDialogOpen}
        onClose={closeQuoteDeleteDialog}
        onDelete={handleDeleteQuote}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this whole quote?`}
      />
      <ReusableLoader
        isOpen={saveStatus}
        title="Loading"
        message="Trying to save Quote..."
      />
    </main>
  );
}
