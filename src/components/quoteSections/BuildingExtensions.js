import { useState, useEffect, Fragment } from 'react';
import ReusableSelect from '../Inputs/ReusableSelect';
import ReusablePanel from '../Inputs/ReusablePanel';
import FeetInchesInput from '../Inputs/FeetInchesInput';
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
                  wall: 'frontSidewall',
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
          />
          <FeetInchesInput
            name={`buildingrightExtensionWidth-${activeBuilding}`}
            label="Right Endwall Extension Width:"
            value={values.buildings[activeBuilding].rightExtensionWidth}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'rightExtensionWidth', value)
            }
          />
        </div>
        <div className="divider"></div>

        <div className="grid2 alignTop">
          <ReusableSelect
            id={`buildingExtensionInsulation-${activeBuilding}`}
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
          {/* 
          <div className="panelGrid">
            <ReusableSelect
              className="panelType"
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
            {values.buildings[activeBuilding].soffitPanelType != 'none' && (
              <>
                <ReusableSelect
                  className="panelGauge"
                  id={`buildingSoffitGauge-${activeBuilding}`}
                  name={`buildingSoffitGauge-${activeBuilding}`}
                  value={values.buildings[activeBuilding].soffitPanelGauge}
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
                <ReusableSelect
                  className="panelFinish"
                  id={`buildingSoffitFinish-${activeBuilding}`}
                  name={`buildingSoffitFinish-${activeBuilding}`}
                  value={values.buildings[activeBuilding].soffitPanelFinish}
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
                <div className="cardInput panelImage">
                  {selectedSoffitPanel && selectedSoffitPanel.image && (
                    <Image
                      alt={`${selectedSoffitPanel.label}`}
                      src={selectedSoffitPanel.image}
                      className="panelImage"
                    />
                  )}
                </div>
              </>
            )}
          </div> */}
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
                  id={`building-${activeBuilding}-canopyWall-${canopyIndex}`}
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
                  label="Wall"
                />
                <div className="cardInput">
                  <label
                    className="offOnDesktop"
                    htmlFor={`building-${activeBuilding}-canopyWidth-${canopyIndex}`}
                  >
                    Width
                  </label>
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
                    className="offOnDesktop"
                    htmlFor={`building-${activeBuilding}-canopySlope-${canopyIndex}`}
                  >
                    Slope
                  </label>
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
                    className="offOnDesktop"
                    htmlFor={`building-${activeBuilding}-canopyStartBay-${canopyIndex}`}
                  >
                    Start Bay
                  </label>
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
                    className="offOnDesktop"
                    htmlFor={`building-${activeBuilding}-canopyEndBay-${canopyIndex}`}
                  >
                    End Bay
                  </label>
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
                    placeholder="Bay#"
                  />
                </div>
                <div className="cardInput">
                  <label
                    className="offOnDesktop"
                    htmlFor={`building-${activeBuilding}-canopyElevation-${canopyIndex}`}
                  >
                    Elevation
                  </label>
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
            <div className="grid2">
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
