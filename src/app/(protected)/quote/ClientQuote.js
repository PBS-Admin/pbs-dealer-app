'use client';
import { useState, useEffect } from 'react';
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
  roofInsulation,
  wallInsulation,
} from './_dropdownOptions';
import PageHeader from '@/components/PageHeader';

export default function ClientQuote({ session }) {
  const { values, handleChange, handleNestedChange, setValues } =
    useFormState(initialState);
  const [activeCard, setActiveCard] = useState('quote-info');
  const [isDesktop, setDesktop] = useState(false);
  const [activeBuilding, setActiveBuilding] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [sourceBuildingIndex, setSourceBuildingIndex] = useState(0);

  // Adjust index to change initial starting page, helpful to work on page on save
  const [currentIndex, setCurrentIndex] = useState(3);
  const navItems = [
    { id: 'quote-info', label: 'Project Information' },
    { id: 'design-code', label: 'Design Codes' },
    { id: 'building-project', label: 'Building Project' },
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
    { id: 'finalize-quote', label: 'Finalize Quote' },
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
          leftEndwallFrame: 'postAndBeam',
          leftEnwallInset: '',
          leftEndwallIntColSpacing: '',
          rightEndwallFrame: 'postAndBeam',
          rightEnwallInset: '',
          rightEndwallIntColSpacing: '',
          frontSidewallBracingType: 'xbrace',
          frontSidewallBracingHeight: '',
          backSidewallBracingType: 'xbrace',
          backSidewallBracingHeight: '',
          leftEndwallBracingType: 'xbrace',
          leftEndwallBracingHeight: '',
          rightEndwallBracingType: 'xbrace',
          rightEndwallBracingHeight: '',
          frontSidewallBracedBays: '',
          backSidewallBracedBays: '',
          leftEndwallBracedBays: '',
          rightEndwallBracedBays: '',
          roofBracedBays: '',
          roofBreakPoints: 'left',
          frontSidewallGirtType: 'bipass',
          backSidewallGirtType: 'bipass',
          leftEndwallGirtType: 'bipass',
          rightEndwallGirtType: 'bipass',
          frontSidewallGirtSpacing: 'default',
          backSidewallGirtSpacing: 'default',
          leftEndwallGirtSpacing: 'default',
          rightEndwallGirtSpacing: 'default',
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
        },
      ],
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
      const buildingToCopy = {
        width: sourceBuilding.width,
        length: sourceBuilding.length,
        offsetX: sourceBuilding.offsetX,
        offsetY: sourceBuilding.offsetY,
        rotation: sourceBuilding.rotation,
        commonWall: sourceBuilding.commonWall,
      };

      if (targetIndex === 'new') {
        newBuildings.push(buildingToCopy);
      } else {
        newBuildings[targetIndex] = {
          ...newBuildings[targetIndex],
          ...buildingToCopy,
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
              <div className="cardGrid">
                <h4>Building Size</h4>
                <fieldset className={styles.radioGroup}>
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
                  <>
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
              </div>
              <div className="cardBox">
                <h4>Bay Spacing</h4>
                <div className="cardInnerBox col end">
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
              </div>
            </section>
            <section className="card">
              <header className="cardHeader">
                <h3>Frame Type</h3>
              </header>
              <div className="cardBox col center">
                <fieldset className={styles.radioGroup}>
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
                <div className="cardBox col center">
                  {values.buildings[activeBuilding].frameType ==
                    'multiSpan' && (
                    <div className="cardInnerBox col end">
                      <div className="cardInput">
                        <label
                          htmlFor={`buildingIntColSpacing-${activeBuilding}`}
                        >
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
                    </div>
                  )}
                  <div className="cardInnerBox col start">
                    <div className="cardInput">
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
                    <div className="cardInput">
                      <input
                        type="checkbox"
                        id={`buildingNoFlangeBraces-${activeBuilding}`}
                        name={`buildingNoFlangeBraces-${activeBuilding}`}
                        checked={
                          values.buildings[activeBuilding].noFlangeBraces
                        }
                        onChange={(e) =>
                          handleNestedChange(
                            activeBuilding,
                            'noFlangeBraces',
                            e.target.checked
                          )
                        }
                      />
                      <label
                        htmlFor={`buildingNoFlangeBraces-${activeBuilding}`}
                      >
                        No Flange Braces On Columns
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cardBox col center">
                <h4>Endwall Frames</h4>
                <div className="cardInnerBox col end">
                  <div className="cardInput">
                    <ReusableSelect
                      id={`buildingLeftEndwallFrame-${activeBuilding}`}
                      name={`buildingLeftEndwallFrame-${activeBuilding}`}
                      value={values.buildings[activeBuilding].leftEndwallFrame}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'leftEndwallFrame',
                          e.target.value
                        )
                      }
                      options={FrameOptions}
                      label="Left Endwall Frame:"
                    />
                  </div>
                  {values.buildings[activeBuilding].leftEndwallFrame ==
                    'insetRF' && (
                    <div className="cardInput">
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
                    </div>
                  )}

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
                      value={
                        values.buildings[activeBuilding]
                          .leftEndwallIntColSpacing
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'leftEndwallIntColSpacing',
                          e.target.value
                        )
                      }
                      placeholder="Separate Bays with Comma"
                    />
                  </div>
                  <div className="cardInput">
                    <ReusableSelect
                      id={`buildingRightEndwallFrame-${activeBuilding}`}
                      name={`buildingRightEndwallFrame-${activeBuilding}`}
                      value={values.buildings[activeBuilding].rightEndwallFrame}
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'rightEndwallFrame',
                          e.target.value
                        )
                      }
                      options={FrameOptions}
                      label="Right Endwall Frame:"
                    />
                  </div>
                  {values.buildings[activeBuilding].rightEndwallFrame ==
                    'insetRF' && (
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
                  )}

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
                      value={
                        values.buildings[activeBuilding]
                          .rightEndwallIntColSpacing
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'rightEndwallIntColSpacing',
                          e.target.value
                        )
                      }
                      placeholder="Separate Bays with Comma"
                    />
                  </div>
                </div>
              </div>
            </section>
            <section className="card">
              <header className="cardHeader">
                <h3>Bracing</h3>
              </header>
              <div className="cardBox col center">
                <div className="cardInnerBox col end">
                  <div className="cardInput">
                    <ReusableSelect
                      id={`buildingFrontSideWallBracing-${activeBuilding}`}
                      name={`buildingFrontSideWallBracing-${activeBuilding}`}
                      value={
                        values.buildings[activeBuilding]
                          .frontSidewallBracingType
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'frontSidewallBracingType',
                          e.target.value
                        )
                      }
                      options={SidewallBracingType}
                      label="Front Sidewall Bracing Type:"
                    />
                  </div>
                  {values.buildings[activeBuilding].frontSidewallBracingType ==
                    'tier' && (
                    <div className="cardInput">
                      <label
                        htmlFor={`buildingBackSidewallBracing-${activeBuilding}`}
                      >
                        Height of Portal Frame:
                      </label>
                      <input
                        type="text"
                        id={`buildingBackSidewallBracing-${activeBuilding}`}
                        name={`buildingBackSidewallBracing-${activeBuilding}`}
                        value={
                          values.buildings[activeBuilding]
                            .frontSidewallBracingHeight
                        }
                        onChange={(e) =>
                          handleNestedChange(
                            activeBuilding,
                            'frontSidewallBracingHeight',
                            e.target.value
                          )
                        }
                        placeholder="Feet"
                      />
                    </div>
                  )}
                  <div className="cardInput">
                    <ReusableSelect
                      id={`buildingBackSidewallBracing-${activeBuilding}`}
                      name={`buildingBackSidewallBracing-${activeBuilding}`}
                      value={
                        values.buildings[activeBuilding].backSidewallBracingType
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'backSidewallBracingType',
                          e.target.value
                        )
                      }
                      options={SidewallBracingType}
                      label="Back Sidewall Bracing Type:"
                    />
                  </div>
                  {values.buildings[activeBuilding].backSidewallBracingType ==
                    'tier' && (
                    <div className="cardInput">
                      <label
                        htmlFor={`buildingBackSidewallBracingHeight-${activeBuilding}`}
                      >
                        Height of Portal Frame:
                      </label>
                      <input
                        type="text"
                        id={`buildingBackSidewallBracingHeight-${activeBuilding}`}
                        name={`buildingBackSidewallBracingHeight-${activeBuilding}`}
                        value={
                          values.buildings[activeBuilding]
                            .backSidewallBracingHeight
                        }
                        onChange={(e) =>
                          handleNestedChange(
                            activeBuilding,
                            'backSidewallBracingHeight',
                            e.target.value
                          )
                        }
                        placeholder="Feet"
                      />
                    </div>
                  )}
                  {values.buildings[activeBuilding].leftEndwallFrame ==
                    'postAndBeam' && (
                    <div className="cardInput">
                      <ReusableSelect
                        id={`buildingLeftEndwallBracing-${activeBuilding}`}
                        name={`buildingLeftEndwallBracing-${activeBuilding}`}
                        value={
                          values.buildings[activeBuilding]
                            .leftEndwallBracingType
                        }
                        onChange={(e) =>
                          handleNestedChange(
                            activeBuilding,
                            'leftEndwallBracingType',
                            e.target.value
                          )
                        }
                        options={EndwallBracingType}
                        label="Left Endwall Bracing Type:"
                      />
                    </div>
                  )}
                  {values.buildings[activeBuilding].rightEndwallFrame ==
                    'postAndBeam' && (
                    <div className="cardInput">
                      <ReusableSelect
                        id={`buildingRightEndWallBracing-${activeBuilding}`}
                        name={`buildingRightEndWallBracing-${activeBuilding}`}
                        value={
                          values.buildings[activeBuilding]
                            .rightEndwallBracingType
                        }
                        onChange={(e) =>
                          handleNestedChange(
                            activeBuilding,
                            'rightEndwallBracingType',
                            e.target.value
                          )
                        }
                        options={EndwallBracingType}
                        label="Right Endwall Bracing Type:"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="cardBox col center">
                <h4>Wall Braced Bays</h4>
                {values.buildings[activeBuilding].frontSidewallBracingType !=
                  'torsional' && (
                  <div className="cardInput">
                    <label
                      htmlFor={`buildingFrontSidewallBracedBays-${activeBuilding}`}
                    >
                      Front Sidewall:
                    </label>
                    <input
                      type="text"
                      id={`buildingFrontSidewallBracedBays-${activeBuilding}`}
                      name={`buildingFrontSidewallBracedBays-${activeBuilding}`}
                      value={
                        values.buildings[activeBuilding].frontSidewallBracedBays
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'frontSidewallBracedBays',
                          e.target.value
                        )
                      }
                      placeholder="Separate Bays with Space"
                    />
                  </div>
                )}
                {values.buildings[activeBuilding].backSidewallBracingType !=
                  'torsional' && (
                  <div className="cardInput">
                    <label
                      htmlFor={`buildingBackSidewallBracedBays-${activeBuilding}`}
                    >
                      Back Sidewall:
                    </label>
                    <input
                      type="text"
                      id={`buildingBackSidewallBracedBays-${activeBuilding}`}
                      name={`buildingBackSidewallBracedBays-${activeBuilding}`}
                      value={
                        values.buildings[activeBuilding].backSidewallBracedBays
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'backSidewallBracedBays',
                          e.target.value
                        )
                      }
                      placeholder="Separate Bays with Space"
                    />
                  </div>
                )}
                {values.buildings[activeBuilding].leftEndwallFrame ==
                  'postAndBeam' && (
                  <div className="cardInput">
                    <label
                      htmlFor={`buildingLeftEndwallBracedBays-${activeBuilding}`}
                    >
                      Back Sidewall:
                    </label>
                    <input
                      type="text"
                      id={`buildingLeftEndwallBracedBays-${activeBuilding}`}
                      name={`buildingLeftEndwallBracedBays-${activeBuilding}`}
                      value={
                        values.buildings[activeBuilding].leftEndwallBracedBays
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'leftEndwallBracedBays',
                          e.target.value
                        )
                      }
                      placeholder="Separate Bays with Space"
                    />
                  </div>
                )}
                {values.buildings[activeBuilding].rightEndwallFrame ==
                  'postAndBeam' && (
                  <div className="cardInput">
                    <label
                      htmlFor={`buildingRightEndwallBracedBays-${activeBuilding}`}
                    >
                      Right Endwall:
                    </label>
                    <input
                      type="text"
                      id={`buildingRightEndwallBracedBays-${activeBuilding}`}
                      name={`buildingRightEndwallBracedBays-${activeBuilding}`}
                      value={
                        values.buildings[activeBuilding].rightEndwallBracedBays
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'rightEndwallBracedBays',
                          e.target.value
                        )
                      }
                      placeholder="Separate Bays with Space"
                    />
                  </div>
                )}
              </div>
              <div className="cardBox col center">
                <h4>Roof Bracing</h4>
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
                <h5>Break Points to Match</h5>
                <fieldset className={styles.radioGroup}>
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
            </section>
            <section className="card">
              <header className="cardHeader">
                <h3>Purlins and Girts</h3>
              </header>
              <div className="cardBox col center">
                <div className="cardInnerBox col end">
                  <div className="cardInput">
                    <ReusableSelect
                      id={`buildingFrontSidewallGirtType-${activeBuilding}`}
                      name={`buildingFrontSidewallGirtType-${activeBuilding}`}
                      value={
                        values.buildings[activeBuilding].frontSidewallGirtType
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'frontSidewallGirtType',
                          e.target.value
                        )
                      }
                      options={girtTypes}
                      label="Front Sidewall Girt Type:"
                    />
                  </div>
                  <div className="cardInput">
                    <ReusableSelect
                      id={`buildingBackSidewallGirtType-${activeBuilding}`}
                      name={`buildingBackSidewallGirtType-${activeBuilding}`}
                      value={
                        values.buildings[activeBuilding].backSidewallGirtType
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'backSidewallGirtType',
                          e.target.value
                        )
                      }
                      options={girtTypes}
                      label="Back Sidewall Girt Type:"
                    />
                  </div>
                  <div className="cardInput">
                    <ReusableSelect
                      id={`buildingLeftEndwallGirtType-${activeBuilding}`}
                      name={`buildingLeftEndwallGirtType-${activeBuilding}`}
                      value={
                        values.buildings[activeBuilding].leftEndwallGirtType
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'leftEndwallGirtType',
                          e.target.value
                        )
                      }
                      options={girtTypes}
                      label="Left Endwall Girt Type:"
                    />
                  </div>
                  <div className="cardInput">
                    <ReusableSelect
                      id={`buildingRightEndwallGirtType-${activeBuilding}`}
                      name={`buildingRightEndwallGirtType-${activeBuilding}`}
                      value={
                        values.buildings[activeBuilding].rightEndwallGirtType
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'rightEndwallGirtType',
                          e.target.value
                        )
                      }
                      options={girtTypes}
                      label="Right Endwall Girt Type:"
                    />
                  </div>
                  {values.buildings[activeBuilding].frontSidewallGirtType !=
                    'open' && (
                    <div className="cardInput">
                      <ReusableSelect
                        id={`buildingFrontSidewallGirtSpacing-${activeBuilding}`}
                        name={`buildingFrontSidewallGirtSpacing-${activeBuilding}`}
                        value={
                          values.buildings[activeBuilding]
                            .frontSidewallGirtSpacing
                        }
                        onChange={(e) =>
                          handleNestedChange(
                            activeBuilding,
                            'frontSidewallGirtSpacing',
                            e.target.value
                          )
                        }
                        options={girtSpacing}
                        label="Front Sidewall Girt Spacing:"
                      />
                    </div>
                  )}
                  {values.buildings[activeBuilding].backSidewallGirtType !=
                    'open' && (
                    <div className="cardInput">
                      <ReusableSelect
                        id={`buildingBackSidewallGirtSpacing-${activeBuilding}`}
                        name={`buildingBackSidewallGirtSpacing-${activeBuilding}`}
                        value={
                          values.buildings[activeBuilding]
                            .backSidewallGirtSpacing
                        }
                        onChange={(e) =>
                          handleNestedChange(
                            activeBuilding,
                            'backSidewallGirtSpacing',
                            e.target.value
                          )
                        }
                        options={girtSpacing}
                        label="Back Sidewall Girt Spacing:"
                      />
                    </div>
                  )}
                  {values.buildings[activeBuilding].leftEndwallGirtType !=
                    'open' && (
                    <div className="cardInput">
                      <ReusableSelect
                        id={`buildingLeftEndwallGirtSpacing-${activeBuilding}`}
                        name={`buildingLeftEndwallGirtSpacing-${activeBuilding}`}
                        value={
                          values.buildings[activeBuilding]
                            .leftEndwallGirtSpacing
                        }
                        onChange={(e) =>
                          handleNestedChange(
                            activeBuilding,
                            'leftEndwallGirtSpacing',
                            e.target.value
                          )
                        }
                        options={girtSpacing}
                        label="Left Endwall Girt Spacing:"
                      />
                    </div>
                  )}
                  {values.buildings[activeBuilding].rightEndwallGirtType !=
                    'open' && (
                    <div className="cardInput">
                      <ReusableSelect
                        id={`buildingRightEndwallGirtSpacing-${activeBuilding}`}
                        name={`buildingRightEndwallGirtSpacing-${activeBuilding}`}
                        value={
                          values.buildings[activeBuilding]
                            .rightEndwallGirtSpacing
                        }
                        onChange={(e) =>
                          handleNestedChange(
                            activeBuilding,
                            'rightEndwallGirtSpacing',
                            e.target.value
                          )
                        }
                        options={girtSpacing}
                        label="Right Endwall Girt Spacing:"
                      />
                    </div>
                  )}
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
                  <h4>Purlins</h4>
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
              </div>
            </section>
            <section className="card">
              <header className="cardHeader">
                <h3>Sheeting & Insulation</h3>
              </header>
              <div className="cardBox col center">
                <div className="cardBox col end">
                  <h4>Roof</h4>
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
                  <h4>Walls</h4>
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
                  <h4>Gutters and Downspouts</h4>
                  <div className="cardInput">
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
                  <h4>Building Insulation</h4>
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
                  <div className="cardInput">
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
                  <div className="cardInput">
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
              </div>
            </section>
          </>
        )}
        {activeCard == 'bldg-extensions' && <section></section>}
        {activeCard == 'bldg-partitions' && <section></section>}
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
