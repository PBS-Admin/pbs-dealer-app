'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
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
import PropTypes from 'prop-types';

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
  const [currentIndex, setCurrentIndex] = useState(2);
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
      <header>
        {isDesktop ? (
          <Link href="/dashboard" className={styles.leftBox}>
            <FontAwesomeIcon icon={faHouse} size="2x" />
          </Link>
        ) : (
          <Link href="/dashboard" className={styles.leftBox}>
            <FontAwesomeIcon icon={faHouse} size="1x" />
          </Link>
        )}

        <h1 className={styles.pageTitle}>Quote Input</h1>
        <p className={styles.rightBox}>{session.user.email}</p>
      </header>
      <div className={styles.inputBody}>
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
        <div className={styles.sectionContainer}>
          <form onSubmit={handleSubmit}>
            {/* Project Info Page */}
            {activeCard == 'quote-info' && (
              <section id="projectInfo">
                <div className={styles.inputContainer}>
                  <label htmlFor="customerName">Customer Name:</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    className={styles.textInput}
                    value={values.customerName}
                    onChange={handleChange}
                    placeholder="Customer Name"
                  />
                </div>
                <div className={styles.inputContainer}>
                  <label htmlFor="contactName">Contact Name:</label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    className={styles.textInput}
                    value={values.contactName}
                    onChange={handleChange}
                    placeholder="Contact Name"
                  />
                </div>
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
              </section>
            )}
            {/* Design Code Page */}
            {activeCard == 'design-code' && (
              <section>
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
                <div className={styles.inputContainer}>
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
              </section>
            )}
            {/* Building Project Page */}
            {activeCard == 'building-project' && (
              <section className={styles.projectPage}>
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
                          handleFeetInchesChange(
                            index,
                            'length',
                            e.target.value
                          )
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
                          handleFeetInchesChange(
                            index,
                            'offsetX',
                            e.target.value
                          )
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
                          handleFeetInchesChange(
                            index,
                            'offsetY',
                            e.target.value
                          )
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
                          handleNestedChange(
                            index,
                            'commonWall',
                            e.target.value
                          )
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
              </section>
            )}
            {/* Building Layout Page */}
            {activeCard == 'bldg-layout' && activeBuilding != null && (
              <section>
                <h2>Building {activeBuilding + 1} - Layout</h2>
                <div className={styles.buildingProjectContainer}>
                  <label htmlFor={`buildingWidth-${activeBuilding}`}>
                    Front Sidewall:
                  </label>
                  <input
                    type="text"
                    id={`buildingWidth-${activeBuilding}`}
                    name={`buildingWidth-${activeBuilding}`}
                    value={values.buildings[activeBuilding].fswBays}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'fswBays',
                        e.target.value
                      )
                    }
                    placeholder="Separate Bays with Space"
                  />
                </div>
              </section>
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
        </div>
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
      </div>
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

ClientQuote.propTypes = {
  session: PropTypes.node.isRequired,
};
