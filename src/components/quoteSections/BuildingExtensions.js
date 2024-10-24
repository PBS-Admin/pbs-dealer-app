import { useState, useEffect, Fragment } from 'react';
import ReusableSelect from '../Inputs/ReusableSelect';
import ReusableInteger from '../Inputs/ReusableInteger';
import ReusablePanel from '../Inputs/ReusablePanel';
import FeetInchesInput from '../Inputs/FeetInchesInput';
import RoofPitchInput from '../Inputs/RoofPitchInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { extInsulation, walls } from '../../util/dropdownOptions';

const BuildingExtensions = ({
  values,
  activeBuilding,
  handleNestedChange,
  handleCanopyChange,
  setValues,
}) => {
  const [activeCanopy, setActiveCanopy] = useState(0);
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
                  wall: 'front',
                  width: '',
                  slope: '',
                  startBay: '',
                  endBay: '',
                  elevation: '',
                  addColumns: false,
                  roofPanelType: 'pbr',
                  roofPanelGauge: '26',
                  roofPanelFinish: 'painted',
                  soffitPanelType: 'pbr',
                  soffitPanelGauge: '26',
                  soffitPanelFinish: 'painted',
                },
              ],
            }
          : building
      ),
    }));
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

  return (
    <>
      <section className="card start">
        <header>
          <h3>Roof Extensions</h3>
        </header>
        <div className="grid4 alignTop">
          <div className="grid">
            <FeetInchesInput
              name={`buildingfrontExtensionWidth-${activeBuilding}`}
              label="Front Sidewall Extension Width:"
              value={values.buildings[activeBuilding].frontExtensionWidth}
              onChange={(name, value) =>
                handleNestedChange(activeBuilding, 'frontExtensionWidth', value)
              }
              allowZero={true}
            />
            <div className="checkboxGroup">
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
            </div>
            <div className="cardInput">
              <label htmlFor={`buildingFrontExtensionBays-${activeBuilding}`}>
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
          </div>
          <div className="grid">
            <FeetInchesInput
              name={`buildingbackExtensionWidth-${activeBuilding}`}
              label="Back Sidewall Extension Width:"
              value={values.buildings[activeBuilding].backExtensionWidth}
              onChange={(name, value) =>
                handleNestedChange(activeBuilding, 'backExtensionWidth', value)
              }
              allowZero={true}
            />
            <div className="checkboxGroup">
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
            <div className="cardInput">
              <label htmlFor={`buildingBackExtensionBays-${activeBuilding}`}>
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
          </div>
          <FeetInchesInput
            name={`buildingleftExtensionWidth-${activeBuilding}`}
            label="Left Endwall Extension Width:"
            value={values.buildings[activeBuilding].leftExtensionWidth}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'leftExtensionWidth', value)
            }
            allowZero={true}
          />
          <FeetInchesInput
            name={`buildingrightExtensionWidth-${activeBuilding}`}
            label="Right Endwall Extension Width:"
            value={values.buildings[activeBuilding].rightExtensionWidth}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'rightExtensionWidth', value)
            }
            allowZero={true}
          />
        </div>
        <div className="divider"></div>

        <div className="grid2 alignTop">
          <ReusableSelect
            name={`buildingExtensionInsulation-${activeBuilding}`}
            value={values.buildings[activeBuilding].extensionInsulation}
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

          <div className="divider offOnLaptop"></div>
          <ReusablePanel
            name="Soffit"
            valueKey="soffit"
            label="Soffit"
            bldg={activeBuilding}
            value={values.buildings[activeBuilding]}
            onChange={(e, keyString) =>
              handleNestedChange(activeBuilding, keyString, e.target.value)
            }
          />
        </div>
      </section>

      <section className="card start">
        <header>
          <h3>Canopies</h3>
        </header>
        {values.buildings[activeBuilding].canopies.length > 0 && (
          <div className="onDesktop">
            <div className="tableGrid8">
              <h5>Wall</h5>
              <h5>Width</h5>
              <h5>Slope</h5>
              <h5>Start Bay</h5>
              <h5>End Bay</h5>
              <h5>Elevation</h5>
              <h5>Add Columns</h5>
              <h5></h5>
            </div>
          </div>
        )}
        {values.buildings[activeBuilding].canopies.map(
          (canopy, canopyIndex) => (
            <Fragment key={`building-${activeBuilding}-canopy-${canopyIndex}`}>
              <div
                className={`tableGrid8 ${canopyIndex == activeCanopy ? 'activeRow' : ''}`}
              >
                <ReusableSelect
                  name={`building-${activeBuilding}-canopyWall-${canopyIndex}`}
                  labelClass="offOnDesktop"
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
                  label="Wall:"
                />
                <FeetInchesInput
                  name={`building-${activeBuilding}-canopyWidth-${canopyIndex}`}
                  label="Width:"
                  labelClass="offOnDesktop"
                  value={canopy.width}
                  onChange={(name, value) =>
                    handleCanopyChange(
                      activeBuilding,
                      canopyIndex,
                      'width',
                      value
                    )
                  }
                  onFocus={() => {
                    if (activeCanopy !== canopyIndex) {
                      setActiveCanopy(canopyIndex);
                    }
                  }}
                />
                <RoofPitchInput
                  name={`building-${activeBuilding}-canopySlope-${canopyIndex}`}
                  label="Slope:"
                  labelClass="offOnDesktop"
                  value={canopy.slope}
                  onChange={(name, value) =>
                    handleCanopyChange(
                      activeBuilding,
                      canopyIndex,
                      'slope',
                      value
                    )
                  }
                  onFocus={() => {
                    if (activeCanopy !== canopyIndex) {
                      setActiveCanopy(canopyIndex);
                    }
                  }}
                />
                <ReusableInteger
                  name={`building-${activeBuilding}-canopyStartBay-${canopyIndex}`}
                  value={canopy.startBay}
                  negative={false}
                  label="Start Bay:"
                  labelClass="offOnDesktop"
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
                  placeholder="Bay#"
                />
                <ReusableInteger
                  name={`building-${activeBuilding}-canopyEndBay-${canopyIndex}`}
                  value={canopy.endBay}
                  negative={false}
                  label="End Bay:"
                  labelClass="offOnDesktop"
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
                  placeholder="Bay#"
                />
                <FeetInchesInput
                  name={`building-${activeBuilding}-canopyElevation-${canopyIndex}`}
                  label="Elevation:"
                  labelClass="offOnDesktop"
                  value={canopy.elevation}
                  onChange={(name, value) =>
                    handleCanopyChange(
                      activeBuilding,
                      canopyIndex,
                      'elevation',
                      value
                    )
                  }
                  onFocus={() => {
                    if (activeCanopy !== canopyIndex) {
                      setActiveCanopy(canopyIndex);
                    }
                  }}
                />
                <div className="checkboxGroup">
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
                </div>
                <button
                  onClick={() => removeCanopy(activeBuilding, canopyIndex)}
                  className="icon red deleteRow"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              <div className="divider offOnDesktop"></div>
            </Fragment>
          )
        )}
        <button
          type="button"
          className="button success addRow"
          onClick={() => addCanopy(activeBuilding)}
        >
          Add
        </button>

        {values.buildings[activeBuilding].canopies.length > 0 && (
          <>
            <div className="divider onDesktop"></div>
            <div className="grid2 alignTop">
              <ReusablePanel
                name="CanopyRoof"
                valueKey="roof"
                label="Roof"
                bldg={activeBuilding}
                idx={activeCanopy}
                value={values.buildings[activeBuilding].canopies[activeCanopy]}
                onChange={(e, keyString) =>
                  handleCanopyChange(
                    activeBuilding,
                    activeCanopy,
                    keyString,
                    e.target.value
                  )
                }
              />
              <div className="divider offOnLaptop"></div>
              <ReusablePanel
                name="CanopySoffit"
                valueKey="soffit"
                label="Soffit"
                bldg={activeBuilding}
                idx={activeCanopy}
                value={values.buildings[activeBuilding].canopies[activeCanopy]}
                onChange={(e, keyString) =>
                  handleCanopyChange(
                    activeBuilding,
                    activeCanopy,
                    keyString,
                    e.target.value
                  )
                }
              />
            </div>
          </>
        )}
      </section>

      <section className="card start">
        <header>
          <h3>Facia</h3>
        </header>
      </section>

      <section className="card start">
        <header>
          <h3>Parapet Walls</h3>
        </header>
      </section>
      <section className="card start">
        <header>
          <h3>Bumpouts</h3>
        </header>
      </section>
    </>
  );
};

export default BuildingExtensions;
