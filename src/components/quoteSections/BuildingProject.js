import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy,
  faTrash,
  faCircle,
  faCircleDot,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import styles from './BuildingProject.module.css';
import FeetInchesInput from '../Inputs/FeetInchesInput';
import RoofPitchInput from '../Inputs/RoofPitchInput';
import ReusableSlider from '../Inputs/ReusableSlider';
import { shapes } from '../../util/dropdownOptions';

const BuildingProject = ({
  values,
  activeBuilding,
  handleNestedChange,
  setActiveBuilding,
  openCopyDialog,
  openDeleteDialog,
  addBuilding,
  locked,
}) => {
  return (
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
                    handleNestedChange(index, 'backPeakOffset', e.target.value)
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
                      handleNestedChange(index, 'rotation', e.target.value)
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
                      onChange={(e) =>
                        handleNestedChange(index, 'commonWall', e.target.value)
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
                              Building {String.fromCharCode(buildingIndex + 65)}
                            </option>
                          )
                      )}
                    </select>
                  </div>
                </div>
              </>
            )}
            <div className={styles.buttonContainer}>
              <button
                type="button"
                className={`icon actionButton ${
                  activeBuilding === index ? 'success' : 'nuetral'
                }`}
                onClick={() => setActiveBuilding(index)}
              >
                <FontAwesomeIcon
                  icon={activeBuilding === index ? faCircleDot : faCircle}
                />
              </button>

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
          <button type="button" className="addButton" onClick={addBuilding}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        )}
      </div>
    </section>
  );
};

export default BuildingProject;
