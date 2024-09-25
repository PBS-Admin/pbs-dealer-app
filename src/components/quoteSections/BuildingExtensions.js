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

const BuildingExtensions = ({
  values,
  activeBuilding,
  handleNestedChange,
  handleCanopyChange,
  setValues,
  isDesktop,
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
      <section className="card">
        <header>
          <h3>Roof Extensions</h3>
        </header>
        <div className="cardGrid">
          <div className="cardInput">
            <label htmlFor={`buildingFswExtensionWidth-${activeBuilding}`}>
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
            <label htmlFor={`buildingBswExtensionWidth-${activeBuilding}`}>
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
            <label htmlFor={`buildingLewExtensionWidth-${activeBuilding}`}>
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
            <label htmlFor={`buildingRewExtensionWidth-${activeBuilding}`}>
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
          <div className="checkRow">
            <input
              type="checkbox"
              id={`buildingFrontExtensionColumns-${activeBuilding}`}
              name={`buildingFrontExtensionColumns-${activeBuilding}`}
              checked={values.buildings[activeBuilding].frontExtensionColumns}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'frontExtensionColumns',
                  e.target.checked
                )
              }
            />
            <label htmlFor={`buildingFrontExtensionColumns-${activeBuilding}`}>
              Add Columns
            </label>
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
          <div className="checkRow">
            <input
              type="checkbox"
              id={`buildingBackExtensionColumns-${activeBuilding}`}
              name={`buildingBackExtensionColumns-${activeBuilding}`}
              checked={values.buildings[activeBuilding].backExtensionColumns}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'backExtensionColumns',
                  e.target.checked
                )
              }
            />
            <label htmlFor={`buildingBackExtensionColumns-${activeBuilding}`}>
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
            {values.buildings[activeBuilding].soffitPanelType != 'none' && (
              <>
                <div className="cardInput">
                  <ReusableSelect
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
                </div>
                <div className="cardInput">
                  <ReusableSelect
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
                </div>
                {selectedSoffitPanel && selectedSoffitPanel.image && (
                  <Image
                    alt={`${selectedSoffitPanel.label}`}
                    src={selectedSoffitPanel.image}
                    className="panelImage"
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
                  onClick={() => removeCanopy(activeBuilding, canopyIndex)}
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
            type="button"
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
              </div>
              <div className="cardInput">
                <ReusableSelect
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
              </div>
              <div className="cardInput">
                <ReusableSelect
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
              </div>
              {selectedCanopyRoofPanel && selectedCanopyRoofPanel.image && (
                <Image
                  alt={`${selectedCanopyRoofPanel.label}`}
                  src={selectedCanopyRoofPanel.image}
                  className="panelImage"
                />
              )}
            </div>
            <div className="extGrid start">
              <div className="cardInput">
                <ReusableSelect
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
              </div>
              <div className="cardInput">
                <ReusableSelect
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
              </div>
              <div className="cardInput">
                <ReusableSelect
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
              </div>
              {selectedCanopySoffitPanel && selectedCanopySoffitPanel.image && (
                <Image
                  alt={`${selectedCanopySoffitPanel.label}`}
                  src={selectedCanopySoffitPanel.image}
                  className="panelImage"
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
  );
};

export default BuildingExtensions;
