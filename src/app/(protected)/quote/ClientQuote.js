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
import useFormState from '../../../hooks/useFormState';
import { initialState } from './_initialState';
import CopyBuildingDialog from '../../../components/CopyBuildingDialog';
import DeleteDialog from '../../../components/DeleteDialog';
import ReusableSelect from '../../../components/ReusableSelect';
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
  canopyWalls,
  orientations,
} from './_dropdownOptions';
import PageHeader from '@/components/PageHeader';

export default function ClientQuote({ session }) {
  const {
    values,
    handleChange,
    handleNestedChange,
    handleCanopyChange,
    handlePartitionChange,
    setValues,
  } = useFormState(initialState);
  const [activeCard, setActiveCard] = useState('quote-info');
  const [isDesktop, setDesktop] = useState(false);
  const [activeBuilding, setActiveBuilding] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState(null);
  const [activeCanopy, setActiveCanopy] = useState(0);
  const [activePartition, setActivePartition] = useState(0);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [sourceBuildingIndex, setSourceBuildingIndex] = useState(0);

  // Adjust index to change initial starting page, helpful to work on page on save
  const [currentIndex, setCurrentIndex] = useState(5);
  const navItems = [
    {
      id: 'quote-info',
      label: 'Project Information',
    },
    { id: 'design-code', label: 'Design Codes' },
    {
      id: 'building-project',
      label: 'Building Project',
    },
    {
      id: 'bldg-layout',
      label: 'Building ' + (activeBuilding + 1) + ' - Layout',
    },
    {
      id: 'bldg-extensions',
      label: 'Building ' + (activeBuilding + 1) + ' - Extensions',
    },
    {
      id: 'bldg-partitions',
      label: 'Building ' + (activeBuilding + 1) + ' - Partitions',
    },
    {
      id: 'bldg-options',
      label: 'Building ' + (activeBuilding + 1) + ' - Options',
    },
    {
      id: 'bldg-cranes',
      label: 'Building ' + (activeBuilding + 1) + ' - Cranes',
    },
    {
      id: 'bldg-openings',
      label: 'Building ' + (activeBuilding + 1) + ' - Openings',
    },
    { id: 'accessories', label: 'Accessories' },
    {
      id: 'finalize-quote',
      label: 'Finalize Quote',
    },
  ];

  // Carousel Nav handlers
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex > 0 ? prevIndex - 1 : navItems.length - 1;
      setActiveCard(navItems[newIndex].id);
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex < navItems.length - 1 ? prevIndex + 1 : 0;
      setActiveCard(navItems[newIndex].id);
      return newIndex;
    });
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setActiveCard(navItems[index].id);
  };

  // Activate/Add/Remove Buildings
  const setActiveBuildingHandler = (index) => {
    console.log('index');
    setActiveBuilding(index);
  };

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
          leftEnwallInset: '',
          lewIntColSpacing: '',
          rewFrame: 'postAndBeam',
          rightEnwallInset: '',
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

  const handleFeetInchesChange = (index, field, value) => {
    const feetInchesRegex = /^(\d+)'?\s*(\d*)"?$/;
    if (feetInchesRegex.test(value) || value === '') {
      handleNestedChange(index, field, value);
    }
  };

  const handleRotationChange = (index, value) => {
    const numValue = parseInt(value, 10);
    if (numValue >= 0 && numValue <= 360 && numValue % 15 === 0) {
      handleNestedChange(index, 'rotation', numValue.toString());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with values:', values);
    // Here you would typically send the data to your backend
  };

  const selectedRoofPanel = roofPanels.find(
    (panel) => panel.id === values.buildings[activeBuilding].roofPanelType
  );

  const selectedWallPanel = wallPanels.find(
    (panel) => panel.id === values.buildings[activeBuilding].wallPanelType
  );

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

  // Checking for screen width to conditionally render DOM elements
  useEffect(() => {
    setActiveCard(navItems[currentIndex].id);
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
      {isDesktop && (
        <nav className={styles.sidebar}>
          <button onClick={() => setActiveCard('quote-info')}>
            Project Information
          </button>
          <button onClick={() => setActiveCard('design-code')}>
            Design Codes
          </button>
          <button onClick={() => setActiveCard('building-project')}>
            Building Project
          </button>
          <button onClick={() => setActiveCard('bldg-layout')}>
            Building {activeBuilding + 1} - Layout
          </button>
          <button onClick={() => setActiveCard('bldg-extensions')}>
            Building {activeBuilding + 1} - Extensions
          </button>
          <button onClick={() => setActiveCard('bldg-partitions')}>
            Building {activeBuilding + 1} - Partitions
          </button>
          <button onClick={() => setActiveCard('bldg-options')}>
            Building {activeBuilding + 1} - Options
          </button>
          <button onClick={() => setActiveCard('bldg-cranes')}>
            Building {activeBuilding + 1} - Cranes
          </button>
          <button onClick={() => setActiveCard('bldg-openings')}>
            Building {activeBuilding + 1} - Openings
          </button>
          <button onClick={() => setActiveCard('accessories')}>
            Accessories
          </button>
          <button onClick={() => setActiveCard('finalize-quote')}>
            Finalize Quote
          </button>
        </nav>
      )}
      <form onSubmit={handleSubmit} className="inputForm">
        {/* Project Info Page */}
        {activeCard == 'quote-info' && (
          <>
            <section className="card">
              <header className="cardHeader">
                <h3>Customer Information</h3>
              </header>
              <div className="cardBox col end">
                <div className="cardInnerBox col end">
                  <div className="cardInput">
                    <label htmlFor="customerName">Customer Name:</label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={values.customerName}
                      onChange={handleChange}
                      placeholder="Customer Name"
                    />
                  </div>
                  <div className="cardInput">
                    <label htmlFor="contactName">Contact Name:</label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      value={values.contactName}
                      onChange={handleChange}
                      placeholder="Contact Name"
                    />
                  </div>
                  <div className="cardInput">
                    <label htmlFor="customerStreet">Street Address:</label>
                    <input
                      type="text"
                      id="customerStreet"
                      name="customerStreet"
                      className={styles.textInput}
                      value={values.customerStreet}
                      onChange={handleChange}
                      placeholder="Street Address"
                    />
                  </div>
                  <div className="cardInput">
                    <label htmlFor="customerCity">City:</label>
                    <input
                      type="text"
                      id="customerCity"
                      name="customerCity"
                      className={styles.textInput}
                      value={values.customerCity}
                      onChange={handleChange}
                      placeholder="City"
                    />
                  </div>
                  <div className="cardInput">
                    <label htmlFor="customerState">State:</label>
                    <input
                      type="text"
                      id="customerState"
                      name="customerState"
                      className={styles.textInput}
                      value={values.customerState}
                      onChange={handleChange}
                      placeholder="State"
                    />
                  </div>
                  <div className="cardInput">
                    <label htmlFor="customerZip">Zip Code:</label>
                    <input
                      type="text"
                      id="customerZip"
                      name="customerZip"
                      className={styles.textInput}
                      value={values.customerZip}
                      onChange={handleChange}
                      placeholder="Zip"
                    />
                  </div>
                  <div className="cardInput">
                    <label htmlFor="customerPhone">Phone:</label>
                    <input
                      type="text"
                      id="customerPhone"
                      name="customerPhone"
                      className={styles.textInput}
                      value={values.customerPhone}
                      onChange={handleChange}
                      placeholder="Phone"
                    />
                  </div>
                  <div className="cardInput">
                    <label htmlFor="customerFax">Fax:</label>
                    <input
                      type="text"
                      id="customerFax"
                      name="customerFax"
                      className={styles.textInput}
                      value={values.customerFax}
                      onChange={handleChange}
                      placeholder="Fax"
                    />
                  </div>
                  <div className="cardInput">
                    <label htmlFor="customerCell">Cell:</label>
                    <input
                      type="text"
                      id="customerCell"
                      name="customerCell"
                      className={styles.textInput}
                      value={values.customerCell}
                      onChange={handleChange}
                      placeholder="Cell"
                    />
                  </div>
                  <div className="cardInput">
                    <label htmlFor="customerEmail">Email:</label>
                    <input
                      type="text"
                      id="customerEmail"
                      name="customerEmail"
                      className={styles.textInput}
                      value={values.customerEmail}
                      onChange={handleChange}
                      placeholder="Email"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="card">
              <header className="cardHeader">
                <h3>Project Information</h3>
              </header>
              <div className="cardBox col center">
                <div className="cardInnerBox col end">
                  <div className="cardInput">
                    <label htmlFor="projectName">Project Name:</label>
                    <input
                      type="text"
                      id="projectName"
                      name="projectName"
                      className={styles.textInput}
                      value={values.projectName}
                      onChange={handleChange}
                      placeholder="Project Name"
                    />
                  </div>
                  <div className="cardInput">
                    <label htmlFor="projectFor">Project For:</label>
                    <input
                      type="text"
                      id="projectFor"
                      name="projectFor"
                      className={styles.textInput}
                      value={values.projectFor}
                      onChange={handleChange}
                      placeholder="Project For"
                    />
                  </div>
                  <div className="cardInput">
                    <label htmlFor="projectAddress">Street Address:</label>
                    <input
                      type="text"
                      id="projectAddress"
                      name="projectAddress"
                      className={styles.textInput}
                      value={values.projectAddress}
                      onChange={handleChange}
                      placeholder="Address"
                    />
                  </div>
                  <div className="cardInput">
                    <label htmlFor="projectCity">City:</label>
                    <input
                      type="text"
                      id="projectCity"
                      name="projectCity"
                      className={styles.textInput}
                      value={values.projectCity}
                      onChange={handleChange}
                      placeholder="City"
                    />
                  </div>
                  <div className="cardInput">
                    <label htmlFor="projectState">State:</label>
                    <input
                      type="text"
                      id="projectState"
                      name="projectState"
                      className={styles.textInput}
                      value={values.projectState}
                      onChange={handleChange}
                      placeholder="State"
                    />
                  </div>
                  <div className="cardInput">
                    <label htmlFor="projectZip">Zip Code:</label>
                    <input
                      type="text"
                      id="projectZip"
                      name="projectZip"
                      className={styles.textInput}
                      value={values.projectZip}
                      onChange={handleChange}
                      placeholder="Zip"
                    />
                  </div>
                  <div className="cardInput">
                    <label htmlFor="projectCounty">County:</label>
                    <input
                      type="text"
                      id="projectCounty"
                      name="projectCounty"
                      className={styles.textInput}
                      value={values.projectCounty}
                      onChange={handleChange}
                      placeholder="County"
                    />
                  </div>
                  <div className="cardInput">
                    <label htmlFor="buildingUse">Building Use:</label>
                    <input
                      type="text"
                      id="buildingUse"
                      name="buildingUse"
                      className={styles.textInput}
                      value={values.buildingUse}
                      onChange={handleChange}
                      placeholder="Building Use"
                    />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
        {/* Design Code Page */}
        {activeCard == 'design-code' && (
          <section className="card">
            <header className="cardHeader">
              <h3>Design Codes</h3>
            </header>
            <div className="cardBox col center">
              <div className="cardInnerBox col end">
                <div className="cardInput">
                  <label htmlFor="buildingCode">Building Code:</label>
                  <input
                    type="text"
                    id="buildingCode"
                    name="buildingCode"
                    className={styles.textInput}
                    value={values.buildingCode}
                    onChange={handleChange}
                    placeholder="Building Code"
                  />
                </div>
                <div className="cardInput">
                  <label htmlFor="riskCategory">Risk Category:</label>
                  <input
                    type="text"
                    id="riskCategory"
                    name="riskCategory"
                    className={styles.textInput}
                    value={values.riskCategory}
                    onChange={handleChange}
                    placeholder="Risk Category"
                  />
                </div>
                <div className="cardInput">
                  <label htmlFor="collateralLoad">Collateral Load:</label>
                  <input
                    type="text"
                    id="collateralLoad"
                    name="collateralLoad"
                    className={styles.textInput}
                    value={values.collateralLoad}
                    onChange={handleChange}
                    placeholder="Collateral Load"
                  />
                </div>
                <div className="cardInput">
                  <label htmlFor="liveLoad">Live Load:</label>
                  <input
                    type="text"
                    id="liveLoad"
                    name="liveLoad"
                    className={styles.textInput}
                    value={values.liveLoad}
                    onChange={handleChange}
                    placeholder="Live Load"
                  />
                </div>
                <div className="cardInput">
                  <label htmlFor="deadLoad">Dead Load:</label>
                  <input
                    type="text"
                    id="deadLoad"
                    name="deadLoad"
                    className={styles.textInput}
                    value={values.deadLoad}
                    onChange={handleChange}
                    placeholder="Dead Load"
                  />
                </div>
                <div className="cardInput">
                  <label htmlFor="windLoad">Wind Load:</label>
                  <input
                    type="text"
                    id="windLoad"
                    name="windLoad"
                    className={styles.textInput}
                    value={values.windLoad}
                    onChange={handleChange}
                    placeholder="Wind Load"
                  />
                </div>
                <div className="cardInput">
                  <label htmlFor="exposure">Exposure:</label>
                  <input
                    type="text"
                    id="exposure"
                    name="exposure"
                    className={styles.textInput}
                    value={values.exposure}
                    onChange={handleChange}
                    placeholder="Exposure"
                  />
                </div>
                <div className="cardInput">
                  <label htmlFor="enclosure">Enclosure:</label>
                  <input
                    type="text"
                    id="enclosure"
                    name="enclosure"
                    className={styles.textInput}
                    value={values.enclosure}
                    onChange={handleChange}
                    placeholder="Enclosure"
                  />
                </div>
                <div className="cardInput">
                  <label htmlFor="groundLoad">Ground Load:</label>
                  <input
                    type="text"
                    id="groundLoad"
                    name="groundLoad"
                    className={styles.textInput}
                    value={values.groundLoad}
                    onChange={handleChange}
                    placeholder="Ground Load"
                  />
                </div>
                <div className="cardInput">
                  <label htmlFor="roofLoad">Roof Load:</label>
                  <input
                    type="text"
                    id="roofLoad"
                    name="roofLoad"
                    className={styles.textInput}
                    value={values.roofLoad}
                    onChange={handleChange}
                    placeholder="Roof Load"
                  />
                </div>
                <div className="cardInput">
                  <label htmlFor="thermalFactor">Thermal Factor:</label>
                  <input
                    type="text"
                    id="thermalFactor"
                    name="thermalFactor"
                    className={styles.textInput}
                    value={values.thermalFactor}
                    onChange={handleChange}
                    placeholder="Thermal Factor"
                  />
                </div>
                <div className="cardInput">
                  <label htmlFor="seismicCategory">Seismic Category:</label>
                  <input
                    type="text"
                    id="seismicCategory"
                    name="seismicCategory"
                    className={styles.textInput}
                    value={values.seismicCategory}
                    onChange={handleChange}
                    placeholder="Seismic Category"
                  />
                </div>
                <div className="cardInput">
                  <label htmlFor="seismicSs">SeismicSs:</label>
                  <input
                    type="text"
                    id="seismicSs"
                    name="seismicSs"
                    className={styles.textInput}
                    value={values.seismicSs}
                    onChange={handleChange}
                    placeholder="SeismicSs"
                  />
                </div>
                <div className="cardInput">
                  <label htmlFor="seismicS1">SeismicS1:</label>
                  <input
                    type="text"
                    id="seismicS1"
                    name="seismicS1"
                    className={styles.textInput}
                    value={values.seismicS1}
                    onChange={handleChange}
                    placeholder="SeismicS1"
                  />
                </div>
                <div className="cardInput">
                  <label htmlFor="seismicSms">SeismicSms:</label>
                  <input
                    type="text"
                    id="seismicSms"
                    name="seismicSms"
                    className={styles.textInput}
                    value={values.seismicSms}
                    onChange={handleChange}
                    placeholder="SeismicSms"
                  />
                </div>
                <div className="cardInput">
                  <label htmlFor="seismicSm1">SeismicSm1:</label>
                  <input
                    type="text"
                    id="seismicSm1"
                    name="seismicSm1"
                    className={styles.textInput}
                    value={values.seismicSm1}
                    onChange={handleChange}
                    placeholder="SeismicSm1"
                  />
                </div>
              </div>
            </div>
          </section>
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
                      onChange={(e) =>
                        handleFeetInchesChange(index, 'width', e.target.value)
                      }
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
                      onChange={(e) =>
                        handleFeetInchesChange(index, 'length', e.target.value)
                      }
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
                      onChange={(e) =>
                        handleFeetInchesChange(index, 'offsetX', e.target.value)
                      }
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
                      onChange={(e) =>
                        handleFeetInchesChange(index, 'offsetY', e.target.value)
                      }
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
                      onChange={(e) =>
                        handleRotationChange(index, e.target.value)
                      }
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
                      onClick={() => setActiveBuildingHandler(index)}
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
          <>
            <section className="card">
              <header>
                <h3>Building Shape</h3>
              </header>
              <h4>Building Size</h4>

              <div className="radioGrid">
                <fieldset className={`radio ${styles.radioGroup}`}>
                  {shapes.map(({ id, label }) => (
                    <div key={id}>
                      <input
                        type="radio"
                        id={id}
                        name="shape"
                        value={id}
                        checked={values.buildings[activeBuilding].shape === id}
                        onChange={(e) =>
                          handleNestedChange(
                            activeBuilding,
                            'shape',
                            e.target.value
                          )
                        }
                      />
                      <label htmlFor={id}>{label}</label>
                    </div>
                  ))}
                </fieldset>
                {values.buildings[activeBuilding].shape == 'nonSymmetrical' && (
                  <div className="cardInput">
                    <label htmlFor={`buildingPeakOffset-${activeBuilding}`}>
                      Back Peak Offset:
                    </label>
                    <input
                      type="text"
                      id={`buildingPeakOffset-${activeBuilding}`}
                      name={`buildingPeakOffset-${activeBuilding}`}
                      value={values.buildings[activeBuilding].backPeakOffset}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'backPeakOffset',
                          e.target.value
                        )
                      }
                      placeholder="Feet"
                    />
                  </div>
                )}
              </div>
              <div className="divider"></div>
              <div className="cardGrid">
                <div className="cardInput">
                  <label htmlFor={`buildingWidth-${activeBuilding}`}>
                    Width:
                  </label>
                  <input
                    type="text"
                    id={`buildingWidth-${activeBuilding}`}
                    name={`buildingWidth-${activeBuilding}`}
                    value={values.buildings[activeBuilding].width}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'width',
                        e.target.value
                      )
                    }
                    placeholder="Feet"
                  />
                </div>
                <div className="cardInput">
                  <label htmlFor={`buildingLength-${activeBuilding}`}>
                    Length:
                  </label>
                  <input
                    type="text"
                    id={`buildingLength-${activeBuilding}`}
                    name={`buildingLength-${activeBuilding}`}
                    value={values.buildings[activeBuilding].length}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'length',
                        e.target.value
                      )
                    }
                    placeholder="Feet"
                  />
                </div>
                {values.buildings[activeBuilding].shape == 'symmetrical' && (
                  <div className="cardInput">
                    <label htmlFor={`buildingEaveHeight-${activeBuilding}`}>
                      Eave Height:
                    </label>
                    <input
                      type="text"
                      id={`buildingEaveHeight-${activeBuilding}`}
                      name={`buildingEaveHeight-${activeBuilding}`}
                      value={values.buildings[activeBuilding].eaveHeight}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'eaveHeight',
                          e.target.value
                        )
                      }
                      placeholder="Feet"
                    />
                  </div>
                )}
                {(values.buildings[activeBuilding].shape == 'singleSlope' ||
                  values.buildings[activeBuilding].shape == 'leanTo') && (
                  <>
                    <div className="cardInput">
                      <label
                        htmlFor={`buildingLowEaveHeight-${activeBuilding}`}
                      >
                        Low Eave Height:
                      </label>
                      <input
                        type="text"
                        id={`buildingLowEaveHeight-${activeBuilding}`}
                        name={`buildingLowEaveHeight-${activeBuilding}`}
                        value={values.buildings[activeBuilding].lowEaveHeight}
                        onChange={(e) =>
                          handleNestedChange(
                            activeBuilding,
                            'lowEaveHeight',
                            e.target.value
                          )
                        }
                        placeholder="Feet"
                      />
                    </div>
                    <div className="cardInput">
                      <label
                        htmlFor={`buildingHighEaveHeight-${activeBuilding}`}
                      >
                        Low Eave Height:
                      </label>
                      <input
                        type="text"
                        id={`buildingHighEaveHeight-${activeBuilding}`}
                        name={`buildingHighEaveHeight-${activeBuilding}`}
                        value={values.buildings[activeBuilding].highEaveHeight}
                        onChange={(e) =>
                          handleNestedChange(
                            activeBuilding,
                            'highEaveHeight',
                            e.target.value
                          )
                        }
                        placeholder="Feet"
                      />
                    </div>
                  </>
                )}
                {values.buildings[activeBuilding].shape != 'nonSymmetrical' && (
                  <div className="cardInput">
                    <label htmlFor={`buildingRoofPitch-${activeBuilding}`}>
                      Roof Pitch:
                    </label>
                    <input
                      type="text"
                      id={`buildingRoofPitch-${activeBuilding}`}
                      name={`buildingRoofPitch-${activeBuilding}`}
                      value={values.buildings[activeBuilding].roofPitch}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'roofPitch',
                          e.target.value
                        )
                      }
                      placeholder="x:12"
                    />
                  </div>
                )}
                {values.buildings[activeBuilding].shape == 'nonSymmetrical' && (
                  <>
                    <div className="cardInput">
                      <label
                        htmlFor={`buildingBackEaveHeight-${activeBuilding}`}
                      >
                        Back Eave Height:
                      </label>
                      <input
                        type="text"
                        id={`buildingBackEaveHeight-${activeBuilding}`}
                        name={`buildingBackEaveHeight-${activeBuilding}`}
                        value={values.buildings[activeBuilding].backEaveHeight}
                        onChange={(e) =>
                          handleNestedChange(
                            activeBuilding,
                            'backEaveHeight',
                            e.target.value
                          )
                        }
                        placeholder="Feet"
                      />
                    </div>
                    <div className="cardInput">
                      <label
                        htmlFor={`buildingFrontEaveHeight-${activeBuilding}`}
                      >
                        Front Eave Height:
                      </label>
                      <input
                        type="text"
                        id={`buildingFrontEaveHeight-${activeBuilding}`}
                        name={`buildingFrontEaveHeight-${activeBuilding}`}
                        value={values.buildings[activeBuilding].frontEaveHeight}
                        onChange={(e) =>
                          handleNestedChange(
                            activeBuilding,
                            'frontEaveHeight',
                            e.target.value
                          )
                        }
                        placeholder="Feet"
                      />
                    </div>
                    <div className="cardInput">
                      <label
                        htmlFor={`buildingBackRoofPitch-${activeBuilding}`}
                      >
                        Back Roof Pitch:
                      </label>
                      <input
                        type="text"
                        id={`buildingBackRoofPitch-${activeBuilding}`}
                        name={`buildingBackRoofPitch-${activeBuilding}`}
                        value={values.buildings[activeBuilding].backRoofPitch}
                        onChange={(e) =>
                          handleNestedChange(
                            activeBuilding,
                            'backRoofPitch',
                            e.target.value
                          )
                        }
                        placeholder="Feet"
                      />
                    </div>
                    <div className="cardInput">
                      <label
                        htmlFor={`buildingFrontRoofPitch-${activeBuilding}`}
                      >
                        Front Roof Pitch:
                      </label>
                      <input
                        type="text"
                        id={`buildingFrontRoofPitch-${activeBuilding}`}
                        name={`buildingFrontRoofPitch-${activeBuilding}`}
                        value={values.buildings[activeBuilding].frontRoofPitch}
                        onChange={(e) =>
                          handleNestedChange(
                            activeBuilding,
                            'frontRoofPitch',
                            e.target.value
                          )
                        }
                        placeholder="Feet"
                      />
                    </div>
                  </>
                )}
              </div>
              <h4>Bay Spacing</h4>
              <div className="cardGrid">
                <div className="cardInput">
                  <label htmlFor={`buildingSWBaySpacing-${activeBuilding}`}>
                    Sidewall Bay Spacing:
                  </label>
                  <input
                    type="text"
                    id={`buildingSWBaySpacing-${activeBuilding}`}
                    name={`buildingSWBaySpacing-${activeBuilding}`}
                    value={values.buildings[activeBuilding].swBaySpacing}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'swBaySpacing',
                        e.target.value
                      )
                    }
                    placeholder="Separate Bays with Spaces"
                  />
                </div>
                <div className="cardInput">
                  <label htmlFor={`buildingLEWBaySpacing-${activeBuilding}`}>
                    Left Endwall Bay Spacing:
                  </label>
                  <input
                    type="text"
                    id={`buildingLEWBaySpacing-${activeBuilding}`}
                    name={`buildingLEWBaySpacing-${activeBuilding}`}
                    value={values.buildings[activeBuilding].lewBaySpacing}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'lewBaySpacing',
                        e.target.value
                      )
                    }
                    placeholder="Separate Bays with Spaces"
                  />
                </div>
                <div className="cardInput">
                  <label htmlFor={`buildingREWBaySpacing-${activeBuilding}`}>
                    Right Endwall Bay Spacing:
                  </label>
                  <input
                    type="text"
                    id={`buildingREWBaySpacing-${activeBuilding}`}
                    name={`buildingREWBaySpacing-${activeBuilding}`}
                    value={values.buildings[activeBuilding].rewBaySpacing}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'rewBaySpacing',
                        e.target.value
                      )
                    }
                    placeholder="Separate Bays with Spaces"
                  />
                </div>
              </div>
            </section>

            <section className="card">
              <header className="cardHeader">
                <h3>Frame Type</h3>
              </header>
              <div className="radioGrid">
                <fieldset className={`center ${styles.radioGroup}`}>
                  {frames.map(({ id, label }) => (
                    <div key={id}>
                      <input
                        type="radio"
                        id={id}
                        name="frame"
                        value={id}
                        checked={
                          values.buildings[activeBuilding].frameType === id
                        }
                        onChange={(e) =>
                          handleNestedChange(
                            activeBuilding,
                            'frameType',
                            e.target.value
                          )
                        }
                      />
                      <label htmlFor={id}>{label}</label>
                    </div>
                  ))}
                </fieldset>
                {values.buildings[activeBuilding].frameType == 'multiSpan' && (
                  <div className="cardInput">
                    <label htmlFor={`buildingIntColSpacing-${activeBuilding}`}>
                      Int Column Spacing:
                    </label>
                    <input
                      type="text"
                      id={`buildingIntColSpacing-${activeBuilding}`}
                      name={`buildingIntColSpacing-${activeBuilding}`}
                      value={values.buildings[activeBuilding].intColSpacing}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'intColSpacing',
                          e.target.value
                        )
                      }
                      placeholder="Feet"
                    />
                  </div>
                )}
                <div className="center">
                  <div className="checkRow">
                    <input
                      type="checkbox"
                      id={`buildingStraightExtColumns-${activeBuilding}`}
                      name={`buildingStraightExtColumns-${activeBuilding}`}
                      checked={
                        values.buildings[activeBuilding].straightExtColumns
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'straightExtColumns',
                          e.target.checked
                        )
                      }
                    />
                    <label
                      htmlFor={`buildingStraightExtColumns-${activeBuilding}`}
                    >
                      Straight Exterior Columns
                    </label>
                  </div>
                  <div className="checkRow">
                    <input
                      type="checkbox"
                      id={`buildingNoFlangeBraces-${activeBuilding}`}
                      name={`buildingNoFlangeBraces-${activeBuilding}`}
                      checked={values.buildings[activeBuilding].noFlangeBraces}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'noFlangeBraces',
                          e.target.checked
                        )
                      }
                    />
                    <label htmlFor={`buildingNoFlangeBraces-${activeBuilding}`}>
                      No Flange Braces On Columns
                    </label>
                  </div>
                </div>
              </div>
              <div className="divider"></div>

              <h4>Endwall Frames</h4>
              <div className="frameGrid">
                <div className="cardInput">
                  <ReusableSelect
                    id={`buildinglewFrame-${activeBuilding}`}
                    name={`buildinglewFrame-${activeBuilding}`}
                    value={values.buildings[activeBuilding].lewFrame}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'lewFrame',
                        e.target.value
                      )
                    }
                    options={FrameOptions}
                    label="Left Endwall Frame:"
                  />
                  {values.buildings[activeBuilding].lewFrame == 'insetRF' && (
                    <>
                      <label
                        htmlFor={`buildingLeftEnwallInset-${activeBuilding}`}
                      >
                        Inset # of Bays
                      </label>
                      <input
                        type="text"
                        id={`buildingLeftEnwallInset-${activeBuilding}`}
                        name={`buildingLeftEnwallInset-${activeBuilding}`}
                        value={values.buildings[activeBuilding].leftEnwallInset}
                        onChange={(e) =>
                          handleNestedChange(
                            activeBuilding,
                            'leftEnwallInset',
                            e.target.value
                          )
                        }
                        placeholder=""
                      />
                    </>
                  )}
                </div>

                <div className="cardInput">
                  <label
                    htmlFor={`buildingLeftEnwallIntColSpacing-${activeBuilding}`}
                  >
                    Interior Column Spacing
                  </label>
                  <input
                    type="text"
                    id={`buildingLeftEnwallIntColSpacing-${activeBuilding}`}
                    name={`buildingLeftEnwallIntColSpacing-${activeBuilding}`}
                    value={values.buildings[activeBuilding].lewIntColSpacing}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'lewIntColSpacing',
                        e.target.value
                      )
                    }
                    placeholder="Separate Bays with Comma"
                  />
                </div>
                <div className="tabHide divider"></div>
                <div className="cardInput">
                  <ReusableSelect
                    id={`buildingrewFrame-${activeBuilding}`}
                    name={`buildingrewFrame-${activeBuilding}`}
                    value={values.buildings[activeBuilding].rewFrame}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'rewFrame',
                        e.target.value
                      )
                    }
                    options={FrameOptions}
                    label="Right Endwall Frame:"
                  />
                  {values.buildings[activeBuilding].rewFrame == 'insetRF' && (
                    <>
                      <div className="cardInput">
                        <label
                          htmlFor={`buildingRightEnwallInset-${activeBuilding}`}
                        >
                          Inset # of Bays
                        </label>
                        <input
                          type="text"
                          id={`buildingRightEnwallInset-${activeBuilding}`}
                          name={`buildingRightEnwallInset-${activeBuilding}`}
                          value={
                            values.buildings[activeBuilding].rightEnwallInset
                          }
                          onChange={(e) =>
                            handleNestedChange(
                              activeBuilding,
                              'rightEnwallInset',
                              e.target.value
                            )
                          }
                          placeholder=""
                        />
                      </div>
                      <div></div>
                    </>
                  )}
                </div>

                <div className="cardInput">
                  <label
                    htmlFor={`buildingRightEnwallIntColSpacing-${activeBuilding}`}
                  >
                    Interior Column Spacing
                  </label>
                  <input
                    type="text"
                    id={`buildingRightEnwallIntColSpacing-${activeBuilding}`}
                    name={`buildingRightEnwallIntColSpacing-${activeBuilding}`}
                    value={values.buildings[activeBuilding].rewIntColSpacing}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'rewIntColSpacing',
                        e.target.value
                      )
                    }
                    placeholder="Separate Bays with Comma"
                  />
                </div>
              </div>
            </section>

            <section className="card">
              <header className="cardHeader">
                <h3>Bracing</h3>
              </header>
              <div className="cardGrid">
                <ReusableSelect
                  id={`buildingfswBracing-${activeBuilding}`}
                  name={`buildingfswBracing-${activeBuilding}`}
                  value={values.buildings[activeBuilding].fswBracingType}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'fswBracingType',
                      e.target.value
                    )
                  }
                  options={SidewallBracingType}
                  label="Front Sidewall Bracing Type:"
                />
                {values.buildings[activeBuilding].fswBracingType == 'tier' && (
                  <div className="cardInput">
                    <label htmlFor={`buildingbswBracing-${activeBuilding}`}>
                      Height of Portal Frame:
                    </label>
                    <input
                      type="text"
                      id={`buildingbswBracing-${activeBuilding}`}
                      name={`buildingbswBracing-${activeBuilding}`}
                      value={values.buildings[activeBuilding].fswBracingHeight}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'fswBracingHeight',
                          e.target.value
                        )
                      }
                      placeholder="Feet"
                    />
                  </div>
                )}
                <ReusableSelect
                  id={`buildingbswBracing-${activeBuilding}`}
                  name={`buildingbswBracing-${activeBuilding}`}
                  value={values.buildings[activeBuilding].bswBracingType}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'bswBracingType',
                      e.target.value
                    )
                  }
                  options={SidewallBracingType}
                  label="Back Sidewall Bracing Type:"
                />
                {values.buildings[activeBuilding].bswBracingType == 'tier' && (
                  <div className="cardInput">
                    <label
                      htmlFor={`buildingbswBracingHeight-${activeBuilding}`}
                    >
                      Height of Portal Frame:
                    </label>
                    <input
                      type="text"
                      id={`buildingbswBracingHeight-${activeBuilding}`}
                      name={`buildingbswBracingHeight-${activeBuilding}`}
                      value={values.buildings[activeBuilding].bswBracingHeight}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'bswBracingHeight',
                          e.target.value
                        )
                      }
                      placeholder="Feet"
                    />
                  </div>
                )}
                {values.buildings[activeBuilding].lewFrame == 'postAndBeam' && (
                  <ReusableSelect
                    id={`buildinglewBracing-${activeBuilding}`}
                    name={`buildinglewBracing-${activeBuilding}`}
                    value={values.buildings[activeBuilding].lewBracingType}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'lewBracingType',
                        e.target.value
                      )
                    }
                    options={EndwallBracingType}
                    label="Left Endwall Bracing Type:"
                  />
                )}
                {values.buildings[activeBuilding].rewFrame == 'postAndBeam' && (
                  <ReusableSelect
                    id={`buildingrewBracing-${activeBuilding}`}
                    name={`buildingrewBracing-${activeBuilding}`}
                    value={values.buildings[activeBuilding].rewBracingType}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'rewBracingType',
                        e.target.value
                      )
                    }
                    options={EndwallBracingType}
                    label="Right Endwall Bracing Type:"
                  />
                )}
              </div>
              <div className="divider"></div>

              <h4>Wall Braced Bays</h4>
              <div className="cardGrid">
                {values.buildings[activeBuilding].fswBracingType !=
                  'torsional' && (
                  <div className="cardInput">
                    <label htmlFor={`buildingfswBracedBays-${activeBuilding}`}>
                      Front Sidewall:
                    </label>
                    <input
                      type="text"
                      id={`buildingfswBracedBays-${activeBuilding}`}
                      name={`buildingfswBracedBays-${activeBuilding}`}
                      value={values.buildings[activeBuilding].fswBracedBays}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'fswBracedBays',
                          e.target.value
                        )
                      }
                      placeholder="Separate Bays with Space"
                    />
                  </div>
                )}
                {values.buildings[activeBuilding].bswBracingType !=
                  'torsional' && (
                  <div className="cardInput">
                    <label htmlFor={`buildingbswBracedBays-${activeBuilding}`}>
                      Back Sidewall:
                    </label>
                    <input
                      type="text"
                      id={`buildingbswBracedBays-${activeBuilding}`}
                      name={`buildingbswBracedBays-${activeBuilding}`}
                      value={values.buildings[activeBuilding].bswBracedBays}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'bswBracedBays',
                          e.target.value
                        )
                      }
                      placeholder="Separate Bays with Space"
                    />
                  </div>
                )}
                {values.buildings[activeBuilding].lewFrame == 'postAndBeam' && (
                  <div className="cardInput">
                    <label htmlFor={`buildinglewBracedBays-${activeBuilding}`}>
                      Back Sidewall:
                    </label>
                    <input
                      type="text"
                      id={`buildinglewBracedBays-${activeBuilding}`}
                      name={`buildinglewBracedBays-${activeBuilding}`}
                      value={values.buildings[activeBuilding].lewBracedBays}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'lewBracedBays',
                          e.target.value
                        )
                      }
                      placeholder="Separate Bays with Space"
                    />
                  </div>
                )}
                {values.buildings[activeBuilding].rewFrame == 'postAndBeam' && (
                  <div className="cardInput">
                    <label htmlFor={`buildingrewBracedBays-${activeBuilding}`}>
                      Right Endwall:
                    </label>
                    <input
                      type="text"
                      id={`buildingrewBracedBays-${activeBuilding}`}
                      name={`buildingrewBracedBays-${activeBuilding}`}
                      value={values.buildings[activeBuilding].rewBracedBays}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'rewBracedBays',
                          e.target.value
                        )
                      }
                      placeholder="Separate Bays with Space"
                    />
                  </div>
                )}
              </div>

              <h4>Roof Bracing</h4>
              <div className="cardGrid">
                <div className="cardInput">
                  <label htmlFor={`buildingRoofBracedBays-${activeBuilding}`}>
                    Roof Braced Bays:
                  </label>
                  <input
                    type="text"
                    id={`buildingRoofBracedBays-${activeBuilding}`}
                    name={`buildingRoofBracedBays-${activeBuilding}`}
                    value={values.buildings[activeBuilding].roofBracedBays}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'roofBracedBays',
                        e.target.value
                      )
                    }
                    placeholder="Separate Bays with Space"
                  />
                </div>
                <div className="cardInput">
                  <h5>Break Points to Match</h5>
                  <fieldset className={`column ${styles.radioGroup}`}>
                    {breakPoints.map(({ id, label }) => (
                      <div key={id}>
                        <input
                          type="radio"
                          id={id}
                          name="breakPoints"
                          value={id}
                          checked={
                            values.buildings[activeBuilding].roofBreakPoints ===
                            id
                          }
                          onChange={(e) =>
                            handleNestedChange(
                              activeBuilding,
                              'roofBreakPoints',
                              e.target.value
                            )
                          }
                        />
                        <label htmlFor={id}>{label}</label>
                      </div>
                    ))}
                  </fieldset>
                </div>
              </div>
            </section>

            <section className="card">
              <header className="cardHeader">
                <h3>Purlins and Girts</h3>
              </header>
              <div className="cardGrid">
                <div className="cardInput">
                  <ReusableSelect
                    id={`buildingfswGirtType-${activeBuilding}`}
                    name={`buildingfswGirtType-${activeBuilding}`}
                    value={values.buildings[activeBuilding].fswGirtType}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'fswGirtType',
                        e.target.value
                      )
                    }
                    options={girtTypes}
                    label="Front Sidewall Girt Type:"
                  />
                </div>
                <div className="cardInput">
                  <ReusableSelect
                    id={`buildingbswGirtType-${activeBuilding}`}
                    name={`buildingbswGirtType-${activeBuilding}`}
                    value={values.buildings[activeBuilding].bswGirtType}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'bswGirtType',
                        e.target.value
                      )
                    }
                    options={girtTypes}
                    label="Back Sidewall Girt Type:"
                  />
                </div>
                <div className="cardInput">
                  <ReusableSelect
                    id={`buildinglewGirtType-${activeBuilding}`}
                    name={`buildinglewGirtType-${activeBuilding}`}
                    value={values.buildings[activeBuilding].lewGirtType}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'lewGirtType',
                        e.target.value
                      )
                    }
                    options={girtTypes}
                    label="Left Endwall Girt Type:"
                  />
                </div>
                <div className="cardInput">
                  <ReusableSelect
                    id={`buildingrewGirtType-${activeBuilding}`}
                    name={`buildingrewGirtType-${activeBuilding}`}
                    value={values.buildings[activeBuilding].rewGirtType}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'rewGirtType',
                        e.target.value
                      )
                    }
                    options={girtTypes}
                    label="Right Endwall Girt Type:"
                  />
                </div>
              </div>
              <div className="divider"></div>

              <div className="cardGrid">
                {values.buildings[activeBuilding].fswGirtType != 'open' ? (
                  <div className="cardInput">
                    <ReusableSelect
                      id={`buildingfswGirtSpacing-${activeBuilding}`}
                      name={`buildingfswGirtSpacing-${activeBuilding}`}
                      value={values.buildings[activeBuilding].fswGirtSpacing}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'fswGirtSpacing',
                          e.target.value
                        )
                      }
                      options={girtSpacing}
                      label="Front Sidewall Girt Spacing:"
                    />
                  </div>
                ) : (
                  <div></div>
                )}
                {values.buildings[activeBuilding].bswGirtType != 'open' ? (
                  <div className="cardInput">
                    <ReusableSelect
                      id={`buildingbswGirtSpacing-${activeBuilding}`}
                      name={`buildingbswGirtSpacing-${activeBuilding}`}
                      value={values.buildings[activeBuilding].bswGirtSpacing}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'bswGirtSpacing',
                          e.target.value
                        )
                      }
                      options={girtSpacing}
                      label="Back Sidewall Girt Spacing:"
                    />
                  </div>
                ) : (
                  <div></div>
                )}
                {values.buildings[activeBuilding].lewGirtType != 'open' ? (
                  <div className="cardInput">
                    <ReusableSelect
                      id={`buildinglewGirtSpacing-${activeBuilding}`}
                      name={`buildinglewGirtSpacing-${activeBuilding}`}
                      value={values.buildings[activeBuilding].lewGirtSpacing}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'lewGirtSpacing',
                          e.target.value
                        )
                      }
                      options={girtSpacing}
                      label="Left Endwall Girt Spacing:"
                    />
                  </div>
                ) : (
                  <div></div>
                )}
                {values.buildings[activeBuilding].rewGirtType != 'open' ? (
                  <div className="cardInput">
                    <ReusableSelect
                      id={`buildingrewGirtSpacing-${activeBuilding}`}
                      name={`buildingrewGirtSpacing-${activeBuilding}`}
                      value={values.buildings[activeBuilding].rewGirtSpacing}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'rewGirtSpacing',
                          e.target.value
                        )
                      }
                      options={girtSpacing}
                      label="Right Endwall Girt Spacing:"
                    />
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
              <div className="divider"></div>
              <div className="cardGrid">
                <div className="cardInput">
                  <ReusableSelect
                    id={`buildingBaseCondition-${activeBuilding}`}
                    name={`buildingBaseCondition-${activeBuilding}`}
                    value={values.buildings[activeBuilding].baseCondition}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'baseCondition',
                        e.target.value
                      )
                    }
                    options={baseCondition}
                    label="Base Condition:"
                  />
                </div>
              </div>
              <div className="divider"></div>

              <h4>Purlins</h4>
              <div className="cardGrid">
                <div className="cardInput">
                  <ReusableSelect
                    id={`buildingPurlinSpacing-${activeBuilding}`}
                    name={`buildingPurlinSpacing-${activeBuilding}`}
                    value={values.buildings[activeBuilding].purlinSpacing}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'purlinSpacing',
                        e.target.value
                      )
                    }
                    options={purlinSpacing}
                    label="Purlin Spacing:"
                  />
                </div>
              </div>
            </section>

            <section className="card">
              <header className="cardHeader">
                <h3>Sheeting & Insulation</h3>
              </header>

              <div className="extendGrid">
                <div className="extGrid">
                  <div className="cardInput">
                    <ReusableSelect
                      id={`buildingRoofPanels-${activeBuilding}`}
                      name={`buildingRoofPanels-${activeBuilding}`}
                      value={values.buildings[activeBuilding].roofPanelType}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
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
                      id={`buildingRoofGauge-${activeBuilding}`}
                      name={`buildingRoofGauge-${activeBuilding}`}
                      value={values.buildings[activeBuilding].roofPanelGauge}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
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
                      id={`buildingRoofFinish-${activeBuilding}`}
                      name={`buildingRoofFinish-${activeBuilding}`}
                      value={values.buildings[activeBuilding].roofPanelFinish}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'roofPanelFinish',
                          e.target.value
                        )
                      }
                      options={roofFinish}
                      label="Finish:"
                    />
                  </div>
                  {selectedRoofPanel && selectedRoofPanel.image && (
                    <Image
                      alt={`${selectedRoofPanel.label}`}
                      src={selectedRoofPanel.image}
                      className={styles.panelImage}
                    />
                  )}
                </div>
                <div className="extGrid">
                  <div className="cardInput">
                    <ReusableSelect
                      id={`buildingWallPanels-${activeBuilding}`}
                      name={`buildingWallPanels-${activeBuilding}`}
                      value={values.buildings[activeBuilding].wallPanelType}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'wallPanelType',
                          e.target.value
                        )
                      }
                      options={wallPanels}
                      label="Wall Panels:"
                    />
                  </div>
                  <div className="cardInput">
                    <ReusableSelect
                      id={`buildingWallGauge-${activeBuilding}`}
                      name={`buildingWallGauge-${activeBuilding}`}
                      value={values.buildings[activeBuilding].wallPanelGauge}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'wallPanelGauge',
                          e.target.value
                        )
                      }
                      options={wallGauge}
                      label="Gauge:"
                    />
                  </div>
                  <div className="cardInput">
                    <ReusableSelect
                      id={`buildingWallFinish-${activeBuilding}`}
                      name={`buildingWallFinish-${activeBuilding}`}
                      value={values.buildings[activeBuilding].wallPanelFinish}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'wallPanelFinish',
                          e.target.value
                        )
                      }
                      options={wallFinish}
                      label="Finish:"
                    />
                  </div>
                  {selectedWallPanel && selectedWallPanel.image && (
                    <Image
                      alt={`${selectedWallPanel.label}`}
                      src={selectedWallPanel.image}
                      className={styles.panelImage}
                    />
                  )}
                </div>
              </div>

              <div className="divider"></div>

              <h4>Gutters and Downspouts</h4>
              <div className="cardGrid">
                <div className="checkRow">
                  <input
                    type="checkbox"
                    id={`buildingIncludeGutters-${activeBuilding}`}
                    name={`buildingIncludeGutters-${activeBuilding}`}
                    checked={values.buildings[activeBuilding].includeGutters}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'includeGutters',
                        e.target.checked
                      )
                    }
                  />
                  <label htmlFor={`buildingIncludeGutters-${activeBuilding}`}>
                    Include Gutters and Downspouts
                  </label>
                </div>
              </div>

              <h4>Building Insulation</h4>
              <div className="cardGrid">
                <div className="cardInput">
                  <ReusableSelect
                    id={`buildingRoofInsulation-${activeBuilding}`}
                    name={`buildingRoofInsulation-${activeBuilding}`}
                    value={values.buildings[activeBuilding].roofInsulation}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'roofInsulation',
                        e.target.value
                      )
                    }
                    options={roofInsulation}
                    label="Roof Insulation:"
                  />
                </div>
                <div className="checkRow">
                  <input
                    type="checkbox"
                    id={`buildingRoofInsulationOthers-${activeBuilding}`}
                    name={`buildingRoofInsulationOthers-${activeBuilding}`}
                    checked={
                      values.buildings[activeBuilding].roofInsulationOthers
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'roofInsulationOthers',
                        e.target.checked
                      )
                    }
                  />
                  <label
                    htmlFor={`buildingRoofInsulationOthers-${activeBuilding}`}
                  >
                    By Others (Roof Insulation)
                  </label>
                </div>
                <div className="cardInput">
                  <ReusableSelect
                    id={`buildingWallInsulation-${activeBuilding}`}
                    name={`buildingWallInsulation-${activeBuilding}`}
                    value={values.buildings[activeBuilding].wallInsulation}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'wallInsulation',
                        e.target.value
                      )
                    }
                    options={wallInsulation}
                    label="Wall Insulation:"
                  />
                </div>
                <div className="checkRow">
                  <input
                    type="checkbox"
                    id={`buildingWallInsulationOthers-${activeBuilding}`}
                    name={`buildingWallInsulationOthers-${activeBuilding}`}
                    checked={
                      values.buildings[activeBuilding].wallInsulationOthers
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'wallInsulationOthers',
                        e.target.checked
                      )
                    }
                  />
                  <label
                    htmlFor={`buildingWallInsulationOthers-${activeBuilding}`}
                  >
                    By Others (Wall Insulation)
                  </label>
                </div>
              </div>
            </section>
          </>
        )}
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
                          options={canopyWalls}
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
        {activeCard == 'bldg-options' && <section></section>}
        {activeCard == 'bldg-cranes' && <section></section>}
        {activeCard == 'bldg-openings' && <section></section>}
        {activeCard == 'accessories' && <section></section>}
        {activeCard == 'finalize-quote' && (
          <section>
            <button type="submit">Submit Quote</button>
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
