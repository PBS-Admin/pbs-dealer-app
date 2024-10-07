import { useState, useEffect, Fragment } from 'react';
import Image from 'next/image';
import ReusableSelect from '../Inputs/ReusableSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  roofPanels,
  roofGauge,
  roofFinish,
  soffitPanels,
  soffitGauge,
  soffitFinish,
  extInsulation,
  walls,
} from '../../util/dropdownOptions';
import FeetInchesInput from '../Inputs/FeetInchesInput';

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
          </div>
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
              <div className="tableGrid8">
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
                  className="icon red"
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
          className="button success w5"
          onClick={() => addCanopy(activeBuilding)}
        >
          Add
        </button>

        {values.buildings[activeBuilding].canopies.length > 0 && (
          <>
            <div className="divider onDesktop"></div>
            <div className="grid2">
              <div className="panelGrid">
                <ReusableSelect
                  className="panelType"
                  id={`building-${activeBuilding}-canopyRoofPanels${activeCanopy}`}
                  name={`building-${activeBuilding}-canopyRoofPanels${activeCanopy}`}
                  value={
                    values.buildings[activeBuilding].canopies[activeCanopy]
                      .roofPanelType
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
                <ReusableSelect
                  className="panelGauge"
                  id={`building-${activeBuilding}-canopyRoofGauge${activeCanopy}`}
                  name={`building-${activeBuilding}-canopyRoofGauge${activeCanopy}`}
                  value={
                    values.buildings[activeBuilding].canopies[activeCanopy]
                      .roofPanelGauge
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
                <ReusableSelect
                  className="panelFinish"
                  id={`building-${activeBuilding}-canopyRoofFinish${activeCanopy}`}
                  name={`building-${activeBuilding}-canopyRoofFinish${activeCanopy}`}
                  value={
                    values.buildings[activeBuilding].canopies[activeCanopy]
                      .roofPanelFinish
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
                <div className="cardInput panelImage">
                  {selectedCanopyRoofPanel && selectedCanopyRoofPanel.image && (
                    <Image
                      alt={`${selectedCanopyRoofPanel.label}`}
                      src={selectedCanopyRoofPanel.image}
                      className="panelImage"
                    />
                  )}
                </div>
              </div>
              <div className="divider offOnLaptop"></div>
              <div className="panelGrid">
                <ReusableSelect
                  className="panelType"
                  id={`building-${activeBuilding}-canopySoffitPanels${activeCanopy}`}
                  name={`building-${activeBuilding}-canopySoffitPanels${activeCanopy}`}
                  value={
                    values.buildings[activeBuilding].canopies[activeCanopy]
                      .soffitPanelType
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
                <ReusableSelect
                  className="panelGauge"
                  id={`building-${activeBuilding}-canopySoffitGauge${activeCanopy}`}
                  name={`building-${activeBuilding}-canopySoffitGauge${activeCanopy}`}
                  value={
                    values.buildings[activeBuilding].canopies[activeCanopy]
                      .soffitPanelGauge
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
                <ReusableSelect
                  className="panelFinish"
                  id={`building-${activeBuilding}-canopySoffitFinish${activeCanopy}`}
                  name={`building-${activeBuilding}-canopySoffitFinish${activeCanopy}`}
                  value={
                    values.buildings[activeBuilding].canopies[activeCanopy]
                      .soffitPanelFinish
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
                <div className="cardInput panelImage">
                  {selectedCanopySoffitPanel &&
                    selectedCanopySoffitPanel.image && (
                      <Image
                        alt={`${selectedCanopySoffitPanel.label}`}
                        src={selectedCanopySoffitPanel.image}
                        className="panelImage"
                      />
                    )}
                </div>
              </div>
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
