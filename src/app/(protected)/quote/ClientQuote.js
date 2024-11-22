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
import BuildingWallOptions from '../../../components/quoteSections/BuildingWallOptions';
import BuildingRoofOptions from '../../../components/quoteSections/BuildingRoofOptions';
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
import ReusableColorSelect from '@/components/Inputs/ReusableColorSelect';

export default function ClientQuote({
  session,
  quoteId,
  initialQuoteData,
  progress,
  status,
  rsms,
  salesPerson,
  projectManager,
  estimator,
  checker,
}) {
  // State variables
  const [isDesktop, setDesktop] = useState(false);
  const [activeBuilding, setActiveBuilding] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState(null);

  const [selectedSalesPerson, setSelectedSalesPerson] = useState(salesPerson);
  const [selectedProjectManager, setSelectedProjectManager] =
    useState(projectManager);
  const [selectedEstimator, setSelectedEstimator] = useState(estimator);
  const [selectedChecker, setSelectedChecker] = useState(checker);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [sourceBuildingIndex, setSourceBuildingIndex] = useState(0);
  const [isQuoteDeleteDialogOpen, setIsQuoteDeleteDialogOpen] = useState(false);

  const [isColorOpen, setIsColorOpen] = useState(false);
  const [activeColor, setActiveColor] = useState('NC');
  const [colorSelectInfo, setColorSelectInfo] = useState({
    isOpen: false,
    panelType: '',
    panelLocation: '',
    buildingIndex: 0,
    gauge: '',
    panel: '',
    color: '',
  });

  const [saveStatus, setSaveStatus] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const initialRender = useRef(true);
  const router = useRouter();
  const permission = session.user.permission;
  const submitted = !!(progress & 0b00000100);
  const inChecking = !!(progress & 0b00010000);
  const locked = (submitted || inChecking) && permission < 4;

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

  // Hooks
  const {
    values,
    lastChangedWall,
    handleChange,
    handleNestedChange,
    handleCanopyChange,
    handlePartitionChange,
    handleWallLinerPanelChange,
    handleRoofLinerPanelChange,
    handleWainscotChange,
    handlePartialWallChange,
    handleWallSkirtChange,
    handleWallReliteChange,
    handleRoofReliteChange,
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
          steelFinish: 'NC',
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
          outerLeftGirtType: 'bipass',
          leftGirtType: 'bipass',
          rightGirtType: 'bipass',
          outerRightGirtType: 'bipass',
          frontGirtSpacing: 'default',
          backGirtSpacing: 'default',
          outerLeftGirtSpacing: 'default',
          leftGirtSpacing: 'default',
          rightGirtSpacing: 'default',
          outerRightGirtSpacing: 'default',
          frontBaseCondition: 'angle',
          backBaseCondition: 'angle',
          leftBaseCondition: 'angle',
          outerLeftBaseCondition: 'angle',
          rightBaseCondition: 'angle',
          outerRightBaseCondition: 'angle',
          purlinSpacing: 'default',
          roofPanelType: 'pbr',
          roofPanelGauge: '26',
          roofPanelFinish: 'painted',
          roofPanelColor: 'NC',
          wallPanelType: 'pbr',
          wallPanelGauge: '26',
          wallPanelFinish: 'painted',
          wallPanelColor: 'NC',
          allWallsSame: true,
          frontWallPanelType: 'pbr',
          frontWallPanelGauge: '26',
          frontWallPanelFinish: 'painted',
          frontWallPanelColor: 'NC',
          backWallPanelType: 'pbr',
          backWallPanelGauge: '26',
          backWallPanelFinish: 'painted',
          backWallPanelColor: 'NC',
          outerLeftWallPanelType: 'pbr',
          outerLeftWallPanelGauge: '26',
          outerLeftWallPanelFinish: 'painted',
          outerLeftWallPanelColor: 'NC',
          leftWallPanelType: 'pbr',
          leftWallPanelGauge: '26',
          leftWallPanelFinish: 'painted',
          leftWallPanelColor: 'NC',
          rightWallPanelType: 'pbr',
          rightWallPanelGauge: '26',
          rightWallPanelFinish: 'painted',
          rightWallPanelColor: 'NC',
          outerRightWallPanelType: 'pbr',
          outerRightWallPanelGauge: '26',
          outerRightWallPanelFinish: 'painted',
          outerRightWallPanelColor: 'NC',
          includeGutters: true,
          roofInsulation: 'none',
          roofInsulationOthers: false,
          wallInsulation: 'none',
          wallInsulationOthers: false,
          frontWallInsulation: 'none',
          backWallInsulation: 'none',
          outerLeftWallInsulation: 'none',
          leftWallInsulation: 'none',
          rightWallInsulation: 'none',
          outerRightWallInsulation: 'none',
          // Building - Extensions
          frontExtensionWidth: 0,
          backExtensionWidth: 0,
          leftExtensionWidth: 0,
          rightExtensionWidth: 0,
          frontExtensionBays: '',
          frontExtensionColumns: false,
          backExtensionBays: '',
          backExtensionColumns: false,
          extensionInsulation: true,
          soffitPanelType: 'pbr',
          soffitPanelGauge: '26',
          soffitPanelFinish: 'painted',
          soffitPanelColor: 'NC',
          buildingTrim: {
            gable: { vendor: 'PBS', gauge: 26, color: 'NC' },
            eave: { vendor: 'PBS', gauge: 26, color: 'NC' },
            gutter: { vendor: 'PBS', gauge: 26, color: 'NC' },
            corner: { vendor: 'PBS', gauge: 26, color: 'NC' },
            jamb: { vendor: 'PBS', gauge: 26, color: 'NC' },
            downspout: { vendor: 'PBS', gauge: 26, color: 'NC' },
            base: { vendor: 'PBS', gauge: 26, color: 'NC' },
          },
          canopies: [],
          partitions: [],
          wallLinerPanels: [],
          roofLinerPanels: [],
          wainscots: [],
          partialWalls: [],
          wallSkirts: [],
          wallRelites: [],
          roofRelites: [],
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('/api/auth/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentQuote,
          user,
          values,
          salesPerson: selectedSalesPerson,
          projectManager: selectedProjectManager,
          estimator: selectedEstimator,
          checker: selectedChecker,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save quote');
      }

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
    } catch (error) {
      setSaveStatus(false);
      if (error.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Save error:', error);
    }
  };

  const handleSubmitted = async (e) => {
    e.preventDefault();
    setError('');
    setSaveStatus(true);

    let user = session.user;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('/api/auth/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentQuote, user, values, progress: 6 }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        await router.replace('/tracker');
      } else {
        const data = await response.json();
        setError(data.message || 'Something went wrong');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const handleAssign = async (e) => {
    switch (e.target.name) {
      case 'salesPerson':
        setSelectedSalesPerson(e.target.value);
        break;
      case 'projectManager':
        setSelectedProjectManager(e.target.value);
        break;
      case 'estimator':
        setSelectedEstimator(e.target.value);
        break;
      case 'checker':
        setSelectedChecker(e.target.value);
        break;
      default:
        setSelectedSalesPerson(e.target.value);
        break;
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

  const openColorDialog = (info) => {
    setColorSelectInfo({
      isOpen: true,
      ...info,
    });
  };

  const closeColorDialog = () => {
    setIsColorOpen(false);
  };

  const handleColorSelect = (colorInfo) => {
    const { color, panelType, panelLocation, buildingIndex } = colorInfo;

    console.log('cInfo: ', colorInfo);

    switch (panelType) {
      case 'roof':
        handleNestedChange(buildingIndex, 'roofPanelColor', color);
        break;
      case 'wall':
        if (panelLocation) {
          handleNestedChange(
            buildingIndex,
            `${panelLocation}PanelColor`,
            color
          );
        } else {
          handleNestedChange(buildingIndex, 'wallPanelColor', color);
        }
        break;
      case 'wainscot':
        handleWainscotChange(buildingIndex, panelLocation, 'panelColor', color);
        break;
      case 'roofliner':
        handleRoofLinerPanelChange(
          buildingIndex,
          panelLocation,
          'roofLinerPanelColor',
          color
        );
        break;
      case 'wallLiner':
        handleWallLinerPanelChange(
          buildingIndex,
          panelLocation,
          'panelColor',
          color
        );
        break;
      case 'soffit':
        handleNestedChange(buildingIndex, 'soffitPanelColor', color);
        break;
    }
    setColorSelectInfo((prev) => ({ ...prev, isOpen: false }));
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
      <PageHeader
        session={session}
        title="Quote Input"
        subtitle={
          values.quoteNumber +
          (values.revNumber > 0 ? ' R' + values.revNumber : '') +
          (values.customerName
            ? (values.quoteNumber ? ' - ' : '') + values.customerName
            : '') +
          (values.projectName
            ? (values.quoteNumber || values.customerName ? ' - ' : '') +
              values.projectName
            : '')
        }
        isLogOut={false}
      />
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
                {!locked && (
                  <button
                    type="button"
                    className={styles.deleteTab}
                    onClick={openQuoteDeleteDialog}
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
          <nav className={styles.sidebar}>
            <button
              className={`${activeCard == 'quote-info' ? styles.activeCard : ''}`}
              onClick={() => setActiveCardDirectly('quote-info')}
            >
              Project Information
            </button>
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
              className={`${styles.bldg} ${activeCard == 'bldg-partitions' ? styles.activeCard : ''}`}
              onClick={() => setActiveCardDirectly('bldg-partitions')}
            >
              Building {String.fromCharCode(activeBuilding + 65)} - Partitions
            </button>
            <button
              className={`${styles.bldg} ${activeCard == 'bldg-roof-options' ? styles.activeCard : ''}`}
              onClick={() => setActiveCardDirectly('bldg-roof-options')}
            >
              Building {String.fromCharCode(activeBuilding + 65)} - Roof Options
            </button>
            <button
              className={`${styles.bldg} ${activeCard == 'bldg-wall-options' ? styles.activeCard : ''}`}
              onClick={() => setActiveCardDirectly('bldg-wall-options')}
            >
              Building {String.fromCharCode(activeBuilding + 65)} - Wall Options
            </button>
            {/* <button
              className={`${styles.bldg} ${activeCard == 'bldg-cranes' ? styles.activeCard : ''}`}
              onClick={() => setActiveCardDirectly('bldg-cranes')}
            >
              Building {String.fromCharCode(activeBuilding + 65)} - Cranes
            </button> */}
            {/* <button
              className={`${styles.bldg} ${activeCard == 'bldg-mezzanines' ? styles.activeCard : ''}`}
              onClick={() => setActiveCardDirectly('bldg-mezzanines')}
            >
              Building {String.fromCharCode(activeBuilding + 65)} - Mezzanines
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
            locked={locked}
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
                    {!locked && (
                      <button
                        type="button"
                        className="icon actionButton sec"
                        onClick={() => openCopyDialog(index)}
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </button>
                    )}
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
                            disabled={index != activeBuilding || locked}
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
                        onChange={(e) =>
                          handleNestedChange(
                            index,
                            'backPeakOffset',
                            e.target.value
                          )
                        }
                        disabled={index != activeBuilding || locked}
                      />
                    )}
                  </div>
                  <div className="grid4">
                    <FeetInchesInput
                      name={`buildingWidth-${index}`}
                      label="Width:"
                      value={building.width}
                      allowBlankValue={true}
                      onChange={(e) =>
                        handleNestedChange(index, 'width', e.target.value)
                      }
                      disabled={index != activeBuilding || locked}
                    />
                    <FeetInchesInput
                      name={`buildingLength-${index}`}
                      label="Length:"
                      value={building.length}
                      allowBlankValue={true}
                      onChange={(e) =>
                        handleNestedChange(index, 'length', e.target.value)
                      }
                      disabled={index != activeBuilding || locked}
                    />
                    {building.shape == 'symmetrical' && (
                      <>
                        <FeetInchesInput
                          name={`buildingBackEaveHeight-${index}`}
                          label="Eave Height:"
                          value={building.backEaveHeight}
                          allowBlankValue={true}
                          onChange={(e) =>
                            handleNestedChange(
                              index,
                              'backEaveHeight',
                              e.target.value
                            )
                          }
                          disabled={index != activeBuilding || locked}
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
                          disabled={index != activeBuilding || locked}
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
                          onChange={(e) =>
                            handleNestedChange(
                              index,
                              'backEaveHeight',
                              e.target.value
                            )
                          }
                          disabled={index != activeBuilding || locked}
                        />
                        <FeetInchesInput
                          name={`buildingFrontEaveHeight-${index}`}
                          label="High Eave Height:"
                          value={building.frontEaveHeight}
                          allowBlankValue={true}
                          onChange={(e) =>
                            handleNestedChange(
                              index,
                              'frontEaveHeight',
                              e.target.value
                            )
                          }
                          disabled={index != activeBuilding || locked}
                        />
                        <RoofPitchInput
                          name={`buildingBackRoofPitch-${index}`}
                          label="Roof Pitch:"
                          value={building.backRoofPitch}
                          onChange={(name, value) =>
                            handleNestedChange(index, 'backRoofPitch', value)
                          }
                          disabled={index != activeBuilding || locked}
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
                          onChange={(e) =>
                            handleNestedChange(
                              index,
                              'backEaveHeight',
                              e.target.value
                            )
                          }
                          disabled={index != activeBuilding || locked}
                        />
                        <FeetInchesInput
                          name={`buildingFrontEaveHeight-${index}`}
                          label="Front Eave Height:"
                          value={building.frontEaveHeight}
                          allowBlankValue={true}
                          onChange={(e) =>
                            handleNestedChange(
                              index,
                              'frontEaveHeight',
                              e.target.value
                            )
                          }
                          disabled={index != activeBuilding || locked}
                        />
                        <RoofPitchInput
                          name={`buildingBackRoofPitch-${index}`}
                          label="Back Roof Pitch:"
                          value={building.backRoofPitch}
                          onChange={(name, value) =>
                            handleNestedChange(index, 'backRoofPitch', value)
                          }
                          disabled={index != activeBuilding || locked}
                        />
                        <RoofPitchInput
                          name={`buildingFrontRoofPitch-${index}`}
                          label="Front Roof Pitch:"
                          value={building.frontRoofPitch}
                          onChange={(name, value) =>
                            handleNestedChange(index, 'frontRoofPitch', value)
                          }
                          disabled={index != activeBuilding || locked}
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
                          disabled={index != activeBuilding || locked}
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
                          disabled={index != activeBuilding || locked}
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
                          disabled={index != activeBuilding || locked}
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
                            disabled={index != activeBuilding || locked}
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
                    {values.buildings.length > 1 && index !== 0 && !locked && (
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
              {values.buildings.length < 9 && !locked && (
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
            locked={locked}
          />
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
              colorClicked={openColorDialog}
              locked={locked}
            />
          </>
        )}
        {/* Building Roof Options Page */}
        {activeCard == 'bldg-roof-options' && (
          <>
            <BuildingRoofOptions
              values={values}
              activeBuilding={activeBuilding}
              handleNestedChange={handleNestedChange}
              handleRoofLinerPanelChange={handleRoofLinerPanelChange}
              handleRoofReliteChange={handleRoofReliteChange}
              setValues={setValues}
              isDesktop={isDesktop}
              colorClicked={openColorDialog}
              locked={locked}
            />
          </>
        )}
        {/* Building Wall Options Page */}
        {activeCard == 'bldg-wall-options' && (
          <>
            <BuildingWallOptions
              values={values}
              activeBuilding={activeBuilding}
              handleNestedChange={handleNestedChange}
              handleWallLinerPanelChange={handleWallLinerPanelChange}
              handleWainscotChange={handleWainscotChange}
              handlePartialWallChange={handlePartialWallChange}
              handleWallSkirtChange={handleWallSkirtChange}
              handleCanopyChange={handleCanopyChange}
              handleWallReliteChange={handleWallReliteChange}
              setValues={setValues}
              isDesktop={isDesktop}
              colorClicked={openColorDialog}
              locked={locked}
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
              locked={locked}
            />
          </>
        )}
        {activeCard == 'accessories' && (
          <Accessories
            values={values}
            handleChange={handleChange}
            handleMandoorChange={handleMandoorChange}
            setValues={setValues}
            locked={locked}
          />
        )}
        {activeCard == 'finalize-quote' && (
          <FinalizeQuote
            values={values}
            setValues={setValues}
            handleChange={handleChange}
            handleAssign={handleAssign}
            onSubmitted={handleSubmitted}
            quoteProgress={progress}
            quoteStatus={status}
            locked={locked}
            rsms={rsms}
            salesPerson={selectedSalesPerson}
            projectManager={selectedProjectManager}
            estimator={selectedEstimator}
            checker={selectedChecker}
          />
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
      <ReusableColorSelect
        isOpen={colorSelectInfo.isOpen}
        onClose={() =>
          setColorSelectInfo((prev) => ({ ...prev, isOpen: false }))
        }
        onColorSelect={handleColorSelect}
        panel={colorSelectInfo.panel}
        gauge={colorSelectInfo.gauge}
        panelType={colorSelectInfo.panelType}
        panelLocation={colorSelectInfo.panelLocation}
        buildingIndex={colorSelectInfo.buildingIndex}
        value={colorSelectInfo.color}
      />
      <ReusableLoader
        isOpen={saveStatus}
        title="Loading"
        message="Trying to save Quote..."
      />
    </main>
  );
}
