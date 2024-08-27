'use client';
import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faChevronLeft,
  faChevronRight,
  faTrash,
  faCopy,
  faPlus,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
// import { useFormState, useNavigation } from '../../../hooks';
import useFormState from '../../../hooks/useFormState';
import useNavigation from '../../../hooks/useNavigation';

import { initialState } from './_initialState';
// Quote Form Section
import QuoteInformation from '../../../components/quoteSections/QuoteInformation';
import DesignCodes from '../../../components/quoteSections/DesignCodes';
import BuildingLayout from '../../../components/quoteSections/BuildingLayout';

import CopyBuildingDialog from '../../../components/CopyBuildingDialog';
import DeleteDialog from '../../../components/DeleteDialog';
import ReusableSelect from '../../../components/ReusableSelect';
import BuildingSketch from '../../../components/BuildingSketch';
import { logo } from '../../../../public/images';
import {
  shapes,
  frames,
  FrameOptions,
  SidewallBracingType,
  EndwallBracingType,
  breakPoints,
  girtTypes,
  girtSpacing,
  baseCondition,
  purlinSpacing,
  roofPanels,
  roofGauge,
  roofFinish,
  wallPanels,
  wallGauge,
  wallFinish,
  soffitPanels,
  soffitGauge,
  soffitFinish,
  roofInsulation,
  wallInsulation,
  extInsulation,
  orientations,
  walls,
} from '../../../util/dropdownOptions';
import PageHeader from '@/components/PageHeader';

export default function ClientQuote({ session }) {
  // State variables
  const [isDesktop, setDesktop] = useState(false);
  const [activeBuilding, setActiveBuilding] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState(null);
  const [activeCanopy, setActiveCanopy] = useState(0);
  const [activePartition, setActivePartition] = useState(0);
  const [activeLinerPanel, setActiveLinerPanel] = useState(0);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [sourceBuildingIndex, setSourceBuildingIndex] = useState(0);
  // Hooks
  const {
    values,
    handleChange,
    handleNestedChange,
    handleCanopyChange,
    handlePartitionChange,
    handleLinerPanelChange,
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
        },
      ],
    }));
  };

  const addCanopy = (buildingIndex) => {
    setValues((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, index) =>
        index === buildingIndex
          ? {
              ...building,
              canopies: [
                ...building.canopies,
                {
                  wall: 'frontSidewall',
                  width: '',
                  slope: '',
                  startBay: '',
                  endBay: '',
                  elevation: '',
                  addColumns: false,
                  roofPanelType: 'pbr',
                  roofPanelGauge: '',
                  roofPanelFinish: '',
                  soffitPanelType: 'tuff',
                  soffitPanelGauge: '',
                  soffitPanelFinish: '',
                },
              ],
            }
          : building
      ),
    }));
  };

  const addPartition = (buildingIndex) => {
    setValues((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, index) =>
        index === buildingIndex
          ? {
              ...building,
              partitions: [
                ...building.partitions,
                {
                  orientation: 't',
                  start: '',
                  end: '',
                  offset: '',
                  height: '',
                  baySpacing: '',
                  insulation: 'vrr4',
                  leftPanelType: 'pbr',
                  leftPanelGauge: '',
                  leftPanelFinish: '',
                  rightPanelType: 'pbr',
                  rightPanelGauge: '',
                  rightPanelFinish: '',
                },
              ],
            }
          : building
      ),
    }));
  };

  const addLinerPanel = (buildingIndex) => {
    setValues((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, index) =>
        index === buildingIndex
          ? {
              ...building,
              linerPanels: [
                ...building.linerPanels,
                {
                  wall: 'frontSidewall',
                  start: '',
                  end: '',
                  height: '',
                  panelType: 'pbr',
                  panelGauge: '',
                  panelFinish: '',
                },
              ],
            }
          : building
      ),
    }));
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

  const removeCanopy = (buildingIndex, canopyIndex) => {
    setValues((prev) => {
      const newBuildings = prev.buildings.map((building, bIndex) =>
        bIndex === buildingIndex
          ? {
              ...building,
              canopies: building.canopies.filter(
                (_, cIndex) => cIndex !== canopyIndex
              ),
            }
          : building
      );

      // Update activeCanopy if necessary
      const remainingCanopies = newBuildings[buildingIndex].canopies.length;
      if (canopyIndex <= activeCanopy && activeCanopy > 0) {
        setActiveCanopy(Math.min(activeCanopy - 1, remainingCanopies - 1));
      }

      return { ...prev, buildings: newBuildings };
    });
  };

  const removePartition = (buildingIndex, partitionIndex) => {
    setValues((prev) => {
      const newBuildings = prev.buildings.map((building, bIndex) =>
        bIndex === buildingIndex
          ? {
              ...building,
              partitions: building.partitions.filter(
                (_, pIndex) => pIndex !== partitionIndex
              ),
            }
          : building
      );

      // Update activePartition if necessary
      const remainingPartitions = newBuildings[buildingIndex].partitions.length;
      if (partitionIndex <= activePartition && activePartition > 0) {
        setActivePartition(
          Math.min(activePartition - 1, remainingPartitions - 1)
        );
      }

      return { ...prev, buildings: newBuildings };
    });
  };

  const removeLinerPanel = (buildingIndex, linerPanelIndex) => {
    setValues((prev) => {
      const newBuildings = prev.buildings.map((building, bIndex) =>
        bIndex === buildingIndex
          ? {
              ...building,
              linerPanels: building.linerPanels.filter(
                (_, lpIndex) => lpIndex !== linerPanelIndex
              ),
            }
          : building
      );

      // Update activePartition if necessary
      const remainingLinerPanels =
        newBuildings[buildingIndex].linerPanels.length;
      if (linerPanelIndex <= activeLinerPanel && activeLinerPanel > 0) {
        setActiveLinerPanel(
          Math.min(activeLinerPanel - 1, remainingLinerPanels - 1)
        );
      }

      return { ...prev, buildings: newBuildings };
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with values:', values);
    // Here you would typically send the data to your backend
  };

  const selectedSoffitPanel = soffitPanels.find(
    (panel) => panel.id === values.buildings[activeBuilding].soffitPanelType
  );

  const selectedCanopyRoofPanel = roofPanels.find(
    (panel) =>
      panel.id ===
      values.buildings[activeBuilding].canopies[activeCanopy]?.roofPanelType
  );

  const selectedCanopySoffitPanel = soffitPanels.find(
    (panel) =>
      panel.id ===
      values.buildings[activeBuilding].canopies[activeCanopy]?.soffitPanelType
  );

  const selectedPartitionLeftPanel = wallPanels.find(
    (panel) =>
      panel.id ===
      values.buildings[activeBuilding].partitions[activePartition]
        ?.leftPanelType
  );

  const selectedPartitionRightPanel = wallPanels.find(
    (panel) =>
      panel.id ===
      values.buildings[activeBuilding].partitions[activePartition]
        ?.rightPanelType
  );

  const selectedLinerPanel = wallPanels.find(
    (panel) =>
      panel.id ===
      values.buildings[activeBuilding].linerPanels[activeLinerPanel]?.panelType
  );

  // Checking for screen width to conditionally render DOM elements
  useEffect(() => {
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
  }, [currentIndex]);

  return (
    <main>
      <PageHeader session={session} title="Quote Input" isLogOut={false} />
      {/* <div> */}
      {isDesktop && (
        <div>
          <nav className={styles.sidebar}>
            <button onClick={() => setActiveCardDirectly('quote-info')}>
              Project Information
            </button>
            <button onClick={() => setActiveCardDirectly('design-code')}>
              Design Codes
            </button>
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
            <button onClick={() => setActiveCardDirectly('bldg-cranes')}>
              Building {activeBuilding + 1} - Cranes
            </button>
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
                />
              </div>
            </section>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="inputForm">
        {/* Project Info Page */}
        {activeCard == 'quote-info' && (
          <QuoteInformation values={values} handleChange={handleChange} />
        )}
        {/* Design Code Page */}
        {activeCard == 'design-code' && (
          <DesignCodes values={values} handleChange={handleChange} />
        )}
        {/* Building Project Page */}
        {activeCard == 'building-project' && (
          <section className="page">
            <div className="card gap-1">
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
                    <label htmlFor={`buildingWidth-${index}`}>Width:</label>
                    <input
                      type="text"
                      id={`buildingWidth-${index}`}
                      name={`buildingWidth-${index}`}
                      value={building.width}
                      placeholder="Feet"
                    />
                  </div>
                  <div className={styles.buildingProjectContainer}>
                    <label htmlFor={`buildingLength-${index}`}>Length:</label>
                    <input
                      type="text"
                      id={`buildingLength-${index}`}
                      name={`buildingLength-${index}`}
                      value={building.length}
                      placeholder="Feet"
                    />
                  </div>
                  <div className={styles.buildingProjectContainer}>
                    <label htmlFor={`buildingOffsetX-${index}`}>
                      Left/Right:
                    </label>
                    <input
                      type="text"
                      id={`buildingOffsetX-${index}`}
                      name={`buildingOffsetX-${index}`}
                      value={building.offsetX}
                      placeholder="Feet From Left"
                    />
                  </div>
                  <div className={styles.buildingProjectContainer}>
                    <label htmlFor={`buildingOffsetY-${index}`}>
                      Back/Front:
                    </label>
                    <input
                      type="text"
                      id={`buildingOffsetY-${index}`}
                      name={`buildingOffsetY-${index}`}
                      value={building.offsetY}
                      placeholder="Feet From Back"
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
                      min="0"
                      max="360"
                      step="15"
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
                      onChange={(e) =>
                        handleNestedChange(index, 'commonWall', e.target.value)
                      }
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
          />
        )}
        {/* Building Extensions Page */}
        {activeCard == 'bldg-extensions' && (
          <>
            <section className="card">
              <header>
                <h3>Roof Extensions</h3>
              </header>
              <div className="cardGrid">
                <div className="cardInput">
                  <label
                    htmlFor={`buildingFswExtensionWidth-${activeBuilding}`}
                  >
                    Front Sidewall Extension Width:
                  </label>
                  <input
                    type="text"
                    id={`buildingFswExtensionWidth-${activeBuilding}`}
                    name={`buildingFswExtensionWidth-${activeBuilding}`}
                    value={values.buildings[activeBuilding].fswExtensionWidth}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'fswExtensionWidth',
                        e.target.value
                      )
                    }
                    placeholder="Feet"
                  />
                </div>
                <div className="cardInput">
                  <label
                    htmlFor={`buildingBswExtensionWidth-${activeBuilding}`}
                  >
                    Back Sidewall Extension Width:
                  </label>
                  <input
                    type="text"
                    id={`buildingBswExtensionWidth-${activeBuilding}`}
                    name={`buildingBswExtensionWidth-${activeBuilding}`}
                    value={values.buildings[activeBuilding].bswExtensionWidth}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'bswExtensionWidth',
                        e.target.value
                      )
                    }
                    placeholder="Feet"
                  />
                </div>
                <div className="cardInput">
                  <label
                    htmlFor={`buildingLewExtensionWidth-${activeBuilding}`}
                  >
                    Left Endwall Extension Width:
                  </label>
                  <input
                    type="text"
                    id={`buildingLewExtensionWidth-${activeBuilding}`}
                    name={`buildingLewExtensionWidth-${activeBuilding}`}
                    value={values.buildings[activeBuilding].lewExtensionWidth}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'lewExtensionWidth',
                        e.target.value
                      )
                    }
                    placeholder="Feet"
                  />
                </div>
                <div className="cardInput">
                  <label
                    htmlFor={`buildingRewExtensionWidth-${activeBuilding}`}
                  >
                    Right Endwall Extension Width
                  </label>
                  <input
                    type="text"
                    id={`buildingRewExtensionWidth-${activeBuilding}`}
                    name={`buildingRewExtensionWidth-${activeBuilding}`}
                    value={values.buildings[activeBuilding].rewExtensionWidth}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'rewExtensionWidth',
                        e.target.value
                      )
                    }
                    placeholder="Feet"
                  />
                </div>
                <div className="cardInput">
                  <label
                    htmlFor={`buildingFrontExtensionBays-${activeBuilding}`}
                  >
                    Front Extension Bays:
                  </label>
                  <input
                    type="text"
                    id={`buildingFrontExtensionBays-${activeBuilding}`}
                    name={`buildingFrontExtensionBays-${activeBuilding}`}
                    value={values.buildings[activeBuilding].frontExtensionBays}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'frontExtensionBays',
                        e.target.value
                      )
                    }
                    placeholder="Separate Bays with Space"
                  />
                </div>
                <div className="checkRow">
                  <input
                    type="checkbox"
                    id={`buildingFrontExtensionColumns-${activeBuilding}`}
                    name={`buildingFrontExtensionColumns-${activeBuilding}`}
                    checked={
                      values.buildings[activeBuilding].frontExtensionColumns
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'frontExtensionColumns',
                        e.target.checked
                      )
                    }
                  />
                  <label
                    htmlFor={`buildingFrontExtensionColumns-${activeBuilding}`}
                  >
                    Add Columns
                  </label>
                </div>
                <div className="cardInput">
                  <label
                    htmlFor={`buildingBackExtensionBays-${activeBuilding}`}
                  >
                    Back Extension Bays:
                  </label>
                  <input
                    type="text"
                    id={`buildingBackExtensionBays-${activeBuilding}`}
                    name={`buildingBackExtensionBays-${activeBuilding}`}
                    value={values.buildings[activeBuilding].backExtensionBays}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'backExtensionBays',
                        e.target.value
                      )
                    }
                    placeholder="Separate Bays with Space"
                  />
                </div>
                <div className="checkRow">
                  <input
                    type="checkbox"
                    id={`buildingBackExtensionColumns-${activeBuilding}`}
                    name={`buildingBackExtensionColumns-${activeBuilding}`}
                    checked={
                      values.buildings[activeBuilding].backExtensionColumns
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'backExtensionColumns',
                        e.target.checked
                      )
                    }
                  />
                  <label
                    htmlFor={`buildingBackExtensionColumns-${activeBuilding}`}
                  >
                    Add Columns
                  </label>
                </div>
              </div>
              <div className="divider"></div>

              <div className="extendGrid">
                <div className="extGrid start">
                  <div className="cardInput">
                    <ReusableSelect
                      id={`buildingExtensionInsulation-${activeBuilding}`}
                      name={`buildingExtensionInsulation-${activeBuilding}`}
                      value={
                        values.buildings[activeBuilding].extensionInsulation
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'extensionInsulation',
                          e.target.value
                        )
                      }
                      options={extInsulation}
                      label="Insulation In Extension:"
                    />
                  </div>
                </div>

                <div className="extGrid start">
                  <div className="cardInput">
                    <ReusableSelect
                      id={`buildingSoffitPanels-${activeBuilding}`}
                      name={`buildingSoffitPanels-${activeBuilding}`}
                      value={values.buildings[activeBuilding].soffitPanelType}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'soffitPanelType',
                          e.target.value
                        )
                      }
                      options={soffitPanels}
                      label="Soffit Panels:"
                    />
                  </div>
                  {values.buildings[activeBuilding].soffitPanelType !=
                    'none' && (
                    <>
                      <div className="cardInput">
                        <ReusableSelect
                          id={`buildingSoffitGauge-${activeBuilding}`}
                          name={`buildingSoffitGauge-${activeBuilding}`}
                          value={
                            values.buildings[activeBuilding].soffitPanelGauge
                          }
                          onChange={(e) =>
                            handleNestedChange(
                              activeBuilding,
                              'soffitPanelGauge',
                              e.target.value
                            )
                          }
                          options={soffitGauge}
                          label="Gauge:"
                        />
                      </div>
                      <div className="cardInput">
                        <ReusableSelect
                          id={`buildingSoffitFinish-${activeBuilding}`}
                          name={`buildingSoffitFinish-${activeBuilding}`}
                          value={
                            values.buildings[activeBuilding].soffitPanelFinish
                          }
                          onChange={(e) =>
                            handleNestedChange(
                              activeBuilding,
                              'soffitPanelFinish',
                              e.target.value
                            )
                          }
                          options={soffitFinish}
                          label="Finish:"
                        />
                      </div>
                      {selectedSoffitPanel && selectedSoffitPanel.image && (
                        <Image
                          alt={`${selectedSoffitPanel.label}`}
                          src={selectedSoffitPanel.image}
                          className={styles.panelImage}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </section>

            <section className="card">
              <header>
                <h3>Canopies</h3>
              </header>
              <div className="tableGrid">
                {values.buildings[activeBuilding].canopies.map(
                  (canopy, canopyIndex) => (
                    <Fragment
                      key={`building-${activeBuilding}-canopy-${canopyIndex}`}
                    >
                      <div className="cardInput">
                        <ReusableSelect
                          id={`building-${activeBuilding}-canopyWall-${canopyIndex}`}
                          name={`building-${activeBuilding}-canopyWall-${canopyIndex}`}
                          value={canopy.wall}
                          onChange={(e) =>
                            handleCanopyChange(
                              activeBuilding,
                              canopyIndex,
                              'wall',
                              e.target.value
                            )
                          }
                          onFocus={() => {
                            if (activeCanopy !== canopyIndex) {
                              setActiveCanopy(canopyIndex);
                            }
                          }}
                          options={walls}
                        />
                      </div>
                      <div className="cardInput">
                        <label
                          htmlFor={`building-${activeBuilding}-canopyWidth-${canopyIndex}`}
                        ></label>
                        <input
                          type="text"
                          id={`building-${activeBuilding}-canopyWidth-${canopyIndex}`}
                          name={`building-${activeBuilding}-canopyWidth-${canopyIndex}`}
                          value={canopy.width}
                          onChange={(e) =>
                            handleCanopyChange(
                              activeBuilding,
                              canopyIndex,
                              'width',
                              e.target.value
                            )
                          }
                          onFocus={() => {
                            if (activeCanopy !== canopyIndex) {
                              setActiveCanopy(canopyIndex);
                            }
                          }}
                          placeholder="Feet"
                        />
                      </div>
                      <div className="cardInput">
                        <label
                          htmlFor={`building-${activeBuilding}-canopySlope-${canopyIndex}`}
                        ></label>
                        <input
                          type="text"
                          id={`building-${activeBuilding}-canopySlope-${canopyIndex}`}
                          name={`building-${activeBuilding}-canopySlope-${canopyIndex}`}
                          value={canopy.slope}
                          onChange={(e) =>
                            handleCanopyChange(
                              activeBuilding,
                              canopyIndex,
                              'slope',
                              e.target.value
                            )
                          }
                          onFocus={() => {
                            if (activeCanopy !== canopyIndex) {
                              setActiveCanopy(canopyIndex);
                            }
                          }}
                          placeholder="x:12"
                        />
                      </div>
                      <div className="cardInput">
                        <label
                          htmlFor={`building-${activeBuilding}-canopyStartBay-${canopyIndex}`}
                        ></label>
                        <input
                          type="text"
                          id={`building-${activeBuilding}-canopyStartBay-${canopyIndex}`}
                          name={`building-${activeBuilding}-canopyStartBay-${canopyIndex}`}
                          value={canopy.startBay}
                          onChange={(e) =>
                            handleCanopyChange(
                              activeBuilding,
                              canopyIndex,
                              'startBay',
                              e.target.value
                            )
                          }
                          onFocus={() => {
                            if (activeCanopy !== canopyIndex) {
                              setActiveCanopy(canopyIndex);
                            }
                          }}
                          placeholder="Bay #"
                        />
                      </div>
                      <div className="cardInput">
                        <label
                          htmlFor={`building-${activeBuilding}-canopyEndBay-${canopyIndex}`}
                        ></label>
                        <input
                          type="text"
                          id={`building-${activeBuilding}-canopyEndBay-${canopyIndex}`}
                          name={`building-${activeBuilding}-canopyEndBay-${canopyIndex}`}
                          value={canopy.endBay}
                          onChange={(e) =>
                            handleCanopyChange(
                              activeBuilding,
                              canopyIndex,
                              'endBay',
                              e.target.value
                            )
                          }
                          onFocus={() => {
                            if (activeCanopy !== canopyIndex) {
                              setActiveCanopy(canopyIndex);
                            }
                          }}
                          placeholder="Bay #"
                        />
                      </div>
                      <div className="cardInput">
                        <label
                          htmlFor={`building-${activeBuilding}-canopyElevation-${canopyIndex}`}
                        ></label>
                        <input
                          type="text"
                          id={`building-${activeBuilding}-canopyElevation-${canopyIndex}`}
                          name={`building-${activeBuilding}-canopyElevation-${canopyIndex}`}
                          value={canopy.elevation}
                          onChange={(e) =>
                            handleCanopyChange(
                              activeBuilding,
                              canopyIndex,
                              'elevation',
                              e.target.value
                            )
                          }
                          onFocus={() => {
                            if (activeCanopy !== canopyIndex) {
                              setActiveCanopy(canopyIndex);
                            }
                          }}
                          placeholder="Feet"
                        />
                      </div>
                      <div className="checkRow">
                        <input
                          type="checkbox"
                          id={`building-${activeBuilding}-canopyAddColumns-${canopyIndex}`}
                          name={`building-${activeBuilding}-canopyAddColumns-${canopyIndex}`}
                          checked={canopy.addColumns}
                          onChange={(e) =>
                            handleCanopyChange(
                              activeBuilding,
                              canopyIndex,
                              'addColumns',
                              e.target.checked
                            )
                          }
                          onFocus={() => {
                            if (activeCanopy !== canopyIndex) {
                              setActiveCanopy(canopyIndex);
                            }
                          }}
                        />
                        <label
                          htmlFor={`building-${activeBuilding}-canopyAddColumns-${canopyIndex}`}
                        >
                          Add Columns
                        </label>
                      </div>
                      <button
                        onClick={() =>
                          removeCanopy(activeBuilding, canopyIndex)
                        }
                        className="iconReject"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      {!isDesktop && (
                        <>
                          <div></div>
                          <div className="divider span2"></div>
                        </>
                      )}
                    </Fragment>
                  )
                )}
                <button
                  className="button success w5"
                  onClick={() => addCanopy(activeBuilding)}
                >
                  Add
                </button>
              </div>

              <div className="divider"></div>
              {values.buildings[activeBuilding].canopies.length > 0 && (
                <div className="extendGrid">
                  <div className="extGrid start">
                    <div className="cardInput">
                      <ReusableSelect
                        id={`building-${activeBuilding}-canopyRoofPanels${activeCanopy}`}
                        name={`building-${activeBuilding}-canopyRoofPanels${activeCanopy}`}
                        value={
                          values.buildings[activeBuilding].canopies[
                            activeCanopy
                          ].roofPanelType
                        }
                        onChange={(e) =>
                          handleCanopyChange(
                            activeBuilding,
                            activeCanopy,
                            'roofPanelType',
                            e.target.value
                          )
                        }
                        options={roofPanels}
                        label="Roof Panels:"
                      />
                    </div>
                    <div className="cardInput">
                      <ReusableSelect
                        id={`building-${activeBuilding}-canopyRoofGauge${activeCanopy}`}
                        name={`building-${activeBuilding}-canopyRoofGauge${activeCanopy}`}
                        value={
                          values.buildings[activeBuilding].canopies[
                            activeCanopy
                          ].roofPanelGauge
                        }
                        onChange={(e) =>
                          handleCanopyChange(
                            activeBuilding,
                            activeCanopy,
                            'roofPanelGauge',
                            e.target.value
                          )
                        }
                        options={roofGauge}
                        label="Gauge:"
                      />
                    </div>
                    <div className="cardInput">
                      <ReusableSelect
                        id={`building-${activeBuilding}-canopyRoofFinish${activeCanopy}`}
                        name={`building-${activeBuilding}-canopyRoofFinish${activeCanopy}`}
                        value={
                          values.buildings[activeBuilding].canopies[
                            activeCanopy
                          ].roofPanelFinish
                        }
                        onChange={(e) =>
                          handleCanopyChange(
                            activeBuilding,
                            activeCanopy,
                            'roofPanelFinish',
                            e.target.value
                          )
                        }
                        options={roofFinish}
                        label="Finish:"
                      />
                    </div>
                    {selectedCanopyRoofPanel &&
                      selectedCanopyRoofPanel.image && (
                        <Image
                          alt={`${selectedCanopyRoofPanel.label}`}
                          src={selectedCanopyRoofPanel.image}
                          className={styles.panelImage}
                        />
                      )}
                  </div>
                  <div className="extGrid start">
                    <div className="cardInput">
                      <ReusableSelect
                        id={`building-${activeBuilding}-canopySoffitPanels${activeCanopy}`}
                        name={`building-${activeBuilding}-canopySoffitPanels${activeCanopy}`}
                        value={
                          values.buildings[activeBuilding].canopies[
                            activeCanopy
                          ].soffitPanelType
                        }
                        onChange={(e) =>
                          handleCanopyChange(
                            activeBuilding,
                            activeCanopy,
                            'soffitPanelType',
                            e.target.value
                          )
                        }
                        options={soffitPanels}
                        label="Soffit Panels:"
                      />
                    </div>
                    <div className="cardInput">
                      <ReusableSelect
                        id={`building-${activeBuilding}-canopySoffitGauge${activeCanopy}`}
                        name={`building-${activeBuilding}-canopySoffitGauge${activeCanopy}`}
                        value={
                          values.buildings[activeBuilding].canopies[
                            activeCanopy
                          ].soffitPanelGauge
                        }
                        onChange={(e) =>
                          handleCanopyChange(
                            activeBuilding,
                            activeCanopy,
                            'soffitPanelGauge',
                            e.target.value
                          )
                        }
                        options={soffitGauge}
                        label="Gauge:"
                      />
                    </div>
                    <div className="cardInput">
                      <ReusableSelect
                        id={`building-${activeBuilding}-canopySoffitFinish${activeCanopy}`}
                        name={`building-${activeBuilding}-canopySoffitFinish${activeCanopy}`}
                        value={
                          values.buildings[activeBuilding].canopies[
                            activeCanopy
                          ].soffitPanelFinish
                        }
                        onChange={(e) =>
                          handleCanopyChange(
                            activeBuilding,
                            activeCanopy,
                            'soffitPanelFinish',
                            e.target.value
                          )
                        }
                        options={soffitFinish}
                        label="Finish:"
                      />
                    </div>
                    {selectedCanopySoffitPanel &&
                      selectedCanopySoffitPanel.image && (
                        <Image
                          alt={`${selectedCanopySoffitPanel.label}`}
                          src={selectedCanopySoffitPanel.image}
                          className={styles.panelImage}
                        />
                      )}
                  </div>
                </div>
              )}
            </section>

            <section className="card">
              <header>
                <h3>Facia</h3>
              </header>
            </section>

            <section className="card">
              <header>
                <h3>Parapet Walls</h3>
              </header>
            </section>
            <section className="card">
              <header>
                <h3>Bumpouts</h3>
              </header>
            </section>
          </>
        )}
        {/* Building Partitions Page */}
        {activeCard == 'bldg-partitions' && (
          <>
            <section className="card start">
              <header>
                <h3>Partition Walls</h3>
              </header>
              <div className="tableGrid">
                {values.buildings[activeBuilding].partitions.map(
                  (partition, partitionIndex) => (
                    <Fragment
                      key={`building-${activeBuilding}-partition-${partitionIndex}`}
                    >
                      <div className="cardInput">
                        <ReusableSelect
                          id={`building-${activeBuilding}-partitionWall-${partitionIndex}`}
                          name={`building-${activeBuilding}-partitionWall-${partitionIndex}`}
                          value={partition.orientation}
                          onChange={(e) =>
                            handlePartitionChange(
                              activeBuilding,
                              partitionIndex,
                              'orientation',
                              e.target.value
                            )
                          }
                          onFocus={() => {
                            if (activePartition !== partitionIndex) {
                              setActivePartition(partitionIndex);
                            }
                          }}
                          options={orientations}
                        />
                      </div>
                      <div className="cardInput">
                        <label
                          htmlFor={`building-${activeBuilding}-partitionStart-${partitionIndex}`}
                        ></label>
                        <input
                          type="text"
                          id={`building-${activeBuilding}-partitionStart-${partitionIndex}`}
                          name={`building-${activeBuilding}-partitionStart-${partitionIndex}`}
                          value={partition.start}
                          onChange={(e) =>
                            handlePartitionChange(
                              activeBuilding,
                              partitionIndex,
                              'start',
                              e.target.value
                            )
                          }
                          onFocus={() => {
                            if (activePartition !== partitionIndex) {
                              setActivePartition(partitionIndex);
                            }
                          }}
                          placeholder="Feet"
                        />
                      </div>
                      <div className="cardInput">
                        <label
                          htmlFor={`building-${activeBuilding}-partitionEnd-${partitionIndex}`}
                        ></label>
                        <input
                          type="text"
                          id={`building-${activeBuilding}-partitionEnd-${partitionIndex}`}
                          name={`building-${activeBuilding}-partitionEnd-${partitionIndex}`}
                          value={partition.end}
                          onChange={(e) =>
                            handlePartitionChange(
                              activeBuilding,
                              partitionIndex,
                              'end',
                              e.target.value
                            )
                          }
                          onFocus={() => {
                            if (activePartition !== partitionIndex) {
                              setActivePartition(partitionIndex);
                            }
                          }}
                          placeholder="Feet"
                        />
                      </div>
                      <div className="cardInput">
                        <label
                          htmlFor={`building-${activeBuilding}-partitionOffset-${partitionIndex}`}
                        ></label>
                        <input
                          type="text"
                          id={`building-${activeBuilding}-partitionOffset-${partitionIndex}`}
                          name={`building-${activeBuilding}-partitionOffset-${partitionIndex}`}
                          value={partition.offset}
                          onChange={(e) =>
                            handlePartitionChange(
                              activeBuilding,
                              partitionIndex,
                              'offset',
                              e.target.value
                            )
                          }
                          onFocus={() => {
                            if (activePartition !== partitionIndex) {
                              setActivePartition(partitionIndex);
                            }
                          }}
                          placeholder="Feet"
                        />
                      </div>
                      <div className="cardInput">
                        <label
                          htmlFor={`building-${activeBuilding}-partitionHeight-${partitionIndex}`}
                        ></label>
                        <input
                          type="text"
                          id={`building-${activeBuilding}-partitionHeight-${partitionIndex}`}
                          name={`building-${activeBuilding}-partitionHeight-${partitionIndex}`}
                          value={partition.height}
                          onChange={(e) =>
                            handlePartitionChange(
                              activeBuilding,
                              partitionIndex,
                              'height',
                              e.target.value
                            )
                          }
                          onFocus={() => {
                            if (activePartition !== partitionIndex) {
                              setActivePartition(partitionIndex);
                            }
                          }}
                          placeholder="Bay #"
                        />
                      </div>
                      <div className="cardInput">
                        <label
                          htmlFor={`building-${activeBuilding}-partitionBaySpacing-${partitionIndex}`}
                        ></label>
                        <input
                          type="text"
                          id={`building-${activeBuilding}-partitionBaySpacing-${partitionIndex}`}
                          name={`building-${activeBuilding}-partitionBaySpacing-${partitionIndex}`}
                          value={partition.baySpacing}
                          onChange={(e) =>
                            handlePartitionChange(
                              activeBuilding,
                              partitionIndex,
                              'baySpacing',
                              e.target.value
                            )
                          }
                          onFocus={() => {
                            if (activePartition !== partitionIndex) {
                              setActivePartition(partitionIndex);
                            }
                          }}
                          placeholder="Separate Bays with Space"
                        />
                      </div>
                      <div className="cardInput">
                        <ReusableSelect
                          id={`building-${activeBuilding}-partitionInsulation-${partitionIndex}`}
                          name={`building-${activeBuilding}-partitionInsulation-${partitionIndex}`}
                          value={partition.insulation}
                          onChange={(e) =>
                            handlePartitionChange(
                              activeBuilding,
                              partitionIndex,
                              'insulation',
                              e.target.value
                            )
                          }
                          onFocus={() => {
                            if (activePartition !== partitionIndex) {
                              setActivePartition(partitionIndex);
                            }
                          }}
                          options={wallInsulation}
                        />
                      </div>
                      <button
                        onClick={() =>
                          removePartition(activeBuilding, partitionIndex)
                        }
                        className="iconReject"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      {!isDesktop && (
                        <>
                          <div></div>
                          <div className="divider span2"></div>
                        </>
                      )}
                    </Fragment>
                  )
                )}
                <button
                  className="button success w5"
                  onClick={() => addPartition(activeBuilding)}
                >
                  Add
                </button>
              </div>

              <div className="divider"></div>
              {values.buildings[activeBuilding].partitions.length > 0 && (
                <div className="extendGrid">
                  <div className="extGrid start">
                    <div className="cardInput">
                      <ReusableSelect
                        id={`building-${activeBuilding}-partitionLeftPanels${activePartition}`}
                        name={`building-${activeBuilding}-partitionLeftPanels${activePartition}`}
                        value={
                          values.buildings[activeBuilding].partitions[
                            activePartition
                          ].leftPanelType
                        }
                        onChange={(e) =>
                          handlePartitionChange(
                            activeBuilding,
                            activePartition,
                            'leftPanelType',
                            e.target.value
                          )
                        }
                        options={wallPanels}
                        label="Left Panels:"
                      />
                    </div>
                    <div className="cardInput">
                      <ReusableSelect
                        id={`building-${activeBuilding}-partitionLeftGauge${activePartition}`}
                        name={`building-${activeBuilding}-partitionLeftGauge${activePartition}`}
                        value={
                          values.buildings[activeBuilding].partitions[
                            activePartition
                          ].leftPanelGauge
                        }
                        onChange={(e) =>
                          handlePartitionChange(
                            activeBuilding,
                            activePartition,
                            'leftPanelGauge',
                            e.target.value
                          )
                        }
                        options={wallGauge}
                        label="Gauge:"
                      />
                    </div>
                    <div className="cardInput">
                      <ReusableSelect
                        id={`building-${activeBuilding}-partitionLeftFinish${activePartition}`}
                        name={`building-${activeBuilding}-partitionLeftFinish${activePartition}`}
                        value={
                          values.buildings[activeBuilding].partitions[
                            activePartition
                          ].leftPanelFinish
                        }
                        onChange={(e) =>
                          handlePartitionChange(
                            activeBuilding,
                            activePartition,
                            'leftPanelFinish',
                            e.target.value
                          )
                        }
                        options={wallFinish}
                        label="Finish:"
                      />
                    </div>
                    {selectedPartitionLeftPanel &&
                      selectedPartitionLeftPanel.image && (
                        <Image
                          alt={`${selectedPartitionLeftPanel.label}`}
                          src={selectedPartitionLeftPanel.image}
                          className={styles.panelImage}
                        />
                      )}
                  </div>
                  <div className="extGrid start">
                    <div className="cardInput">
                      <ReusableSelect
                        id={`building-${activeBuilding}-partitionRightPanels${activePartition}`}
                        name={`building-${activeBuilding}-partitionRightPanels${activePartition}`}
                        value={
                          values.buildings[activeBuilding].partitions[
                            activePartition
                          ].rightPanelType
                        }
                        onChange={(e) =>
                          handlePartitionChange(
                            activeBuilding,
                            activePartition,
                            'rightPanelType',
                            e.target.value
                          )
                        }
                        options={wallPanels}
                        label="Right Panels:"
                      />
                    </div>
                    <div className="cardInput">
                      <ReusableSelect
                        id={`building-${activeBuilding}-partitionRightGauge${activePartition}`}
                        name={`building-${activeBuilding}-partitionRightGauge${activePartition}`}
                        value={
                          values.buildings[activeBuilding].partitions[
                            activePartition
                          ].rightPanelGauge
                        }
                        onChange={(e) =>
                          handlePartitionChange(
                            activeBuilding,
                            activePartition,
                            'rightPanelGauge',
                            e.target.value
                          )
                        }
                        options={wallGauge}
                        label="Gauge:"
                      />
                    </div>
                    <div className="cardInput">
                      <ReusableSelect
                        id={`building-${activeBuilding}-partitionRightFinish${activePartition}`}
                        name={`building-${activeBuilding}-partitionRightFinish${activePartition}`}
                        value={
                          values.buildings[activeBuilding].partitions[
                            activePartition
                          ].rightPanelFinish
                        }
                        onChange={(e) =>
                          handlePartitionChange(
                            activeBuilding,
                            activePartition,
                            'rightPanelFinish',
                            e.target.value
                          )
                        }
                        options={wallFinish}
                        label="Finish:"
                      />
                    </div>
                    {selectedPartitionRightPanel &&
                      selectedPartitionRightPanel.image && (
                        <Image
                          alt={`${selectedPartitionRightPanel.label}`}
                          src={selectedPartitionRightPanel.image}
                          className={styles.panelImage}
                        />
                      )}
                  </div>
                </div>
              )}
            </section>
          </>
        )}
        {/* Building Options Page */}
        {activeCard == 'bldg-options' && (
          <>
            <section className="card start">
              <header>
                <h3>Liner Panels</h3>
              </header>
              <div className="linerGrid">
                {values.buildings[activeBuilding].linerPanels.map(
                  (linerPanel, linerPanelIndex) => (
                    <Fragment
                      key={`building-${activeBuilding}-linerPanel-${linerPanelIndex}`}
                    >
                      <div className="cardInput">
                        <ReusableSelect
                          id={`building-${activeBuilding}-linerPanelWall-${linerPanelIndex}`}
                          name={`building-${activeBuilding}-linerPanelWall-${linerPanelIndex}`}
                          value={linerPanel.wall}
                          onChange={(e) =>
                            handleLinerPanelChange(
                              activeBuilding,
                              linerPanelIndex,
                              'wall',
                              e.target.value
                            )
                          }
                          onFocus={() => {
                            if (activeLinerPanel !== linerPanelIndex) {
                              setActiveLinerPanel(linerPanelIndex);
                            }
                          }}
                          options={walls}
                          label="Wall"
                        />
                      </div>
                      <div className="cardInput">
                        <label
                          htmlFor={`building-${activeBuilding}-linerPanelStart-${linerPanelIndex}`}
                        >
                          Start (Left to Right)
                        </label>
                        <input
                          type="text"
                          id={`building-${activeBuilding}-linerPanelStart-${linerPanelIndex}`}
                          name={`building-${activeBuilding}-linerPanelStart-${linerPanelIndex}`}
                          value={linerPanel.start}
                          onChange={(e) =>
                            handleLinerPanelChange(
                              activeBuilding,
                              linerPanelIndex,
                              'start',
                              e.target.value
                            )
                          }
                          onFocus={() => {
                            if (activeLinerPanel !== linerPanelIndex) {
                              setActiveLinerPanel(linerPanelIndex);
                            }
                          }}
                          placeholder="Feet"
                        />
                      </div>
                      <div className="cardInput">
                        <label
                          htmlFor={`building-${activeBuilding}-linerPanelEnd-${linerPanelIndex}`}
                        >
                          End (Left to Right)
                        </label>
                        <input
                          type="text"
                          id={`building-${activeBuilding}-linerPanelEnd-${linerPanelIndex}`}
                          name={`building-${activeBuilding}-linerPanelEnd-${linerPanelIndex}`}
                          value={linerPanel.end}
                          onChange={(e) =>
                            handleLinerPanelChange(
                              activeBuilding,
                              linerPanelIndex,
                              'end',
                              e.target.value
                            )
                          }
                          onFocus={() => {
                            if (activeLinerPanel !== linerPanelIndex) {
                              setActiveLinerPanel(linerPanelIndex);
                            }
                          }}
                          placeholder="Feet"
                        />
                      </div>
                      <div className="cardInput">
                        <label
                          htmlFor={`building-${activeBuilding}-linerPanelHeight-${linerPanelIndex}`}
                        >
                          Height
                        </label>
                        <input
                          type="text"
                          id={`building-${activeBuilding}-linerPanelHeight-${linerPanelIndex}`}
                          name={`building-${activeBuilding}-linerPanelHeight-${linerPanelIndex}`}
                          value={linerPanel.height}
                          onChange={(e) =>
                            handleLinerPanelChange(
                              activeBuilding,
                              linerPanelIndex,
                              'height',
                              e.target.value
                            )
                          }
                          onFocus={() => {
                            if (activePartition !== linerPanelIndex) {
                              setActivePartition(linerPanelIndex);
                            }
                          }}
                          placeholder="Feet"
                        />
                      </div>
                      {!isDesktop && (
                        <>
                          <div></div>
                        </>
                      )}
                      <button
                        onClick={() =>
                          removeLinerPanel(activeBuilding, linerPanelIndex)
                        }
                        className="iconReject"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      {!isDesktop && (
                        <>
                          <div className="divider span2"></div>
                        </>
                      )}
                    </Fragment>
                  )
                )}
                <button
                  className="button success w5"
                  onClick={() => addLinerPanel(activeBuilding)}
                >
                  Add
                </button>
              </div>

              <div className="divider"></div>
              {values.buildings[activeBuilding].linerPanels.length > 0 && (
                <div className="extendGrid">
                  <div className="extGrid start"></div>
                  <div className="extGrid start">
                    <div className="cardInput">
                      <ReusableSelect
                        id={`building-${activeBuilding}-linerPanelType${activeLinerPanel}`}
                        name={`building-${activeBuilding}-linerPanelType${activeLinerPanel}`}
                        value={
                          values.buildings[activeBuilding].linerPanels[
                            activeLinerPanel
                          ].panelType
                        }
                        onChange={(e) =>
                          handleLinerPanelChange(
                            activeBuilding,
                            activeLinerPanel,
                            'panelType',
                            e.target.value
                          )
                        }
                        options={wallPanels}
                        label="Liner Panels:"
                      />
                    </div>
                    <div className="cardInput">
                      <ReusableSelect
                        id={`building-${activeBuilding}-linerPanelGauge${activeLinerPanel}`}
                        name={`building-${activeBuilding}-linerPanelGauge${activeLinerPanel}`}
                        value={
                          values.buildings[activeBuilding].linerPanels[
                            activeLinerPanel
                          ].panelGauge
                        }
                        onChange={(e) =>
                          handleLinerPanelChange(
                            activeBuilding,
                            activeLinerPanel,
                            'panelGauge',
                            e.target.value
                          )
                        }
                        options={wallGauge}
                        label="Gauge:"
                      />
                    </div>
                    <div className="cardInput">
                      <ReusableSelect
                        id={`building-${activeBuilding}-linerPanelFinish${activeLinerPanel}`}
                        name={`building-${activeBuilding}-linerPanelFinish${activeLinerPanel}`}
                        value={
                          values.buildings[activeBuilding].linerPanels[
                            activeLinerPanel
                          ].panelFinish
                        }
                        onChange={(e) =>
                          handleLinerPanelChange(
                            activeBuilding,
                            activeLinerPanel,
                            'panelFinish',
                            e.target.value
                          )
                        }
                        options={wallFinish}
                        label="Finish:"
                      />
                    </div>
                    {selectedLinerPanel && selectedLinerPanel.image && (
                      <Image
                        alt={`${selectedLinerPanel.label}`}
                        src={selectedLinerPanel.image}
                        className={styles.panelImage}
                      />
                    )}
                  </div>
                </div>
              )}
            </section>
          </>
        )}
        {activeCard == 'bldg-cranes' && <section></section>}
        {activeCard == 'bldg-openings' && <section></section>}
        {activeCard == 'accessories' && <section></section>}
        {activeCard == 'finalize-quote' && (
          <section>
            <button type="submit">Submit Quote</button>
          </section>
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
                />
              </div>
            </section>
          )}
      </form>
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
    </main>
  );
}
