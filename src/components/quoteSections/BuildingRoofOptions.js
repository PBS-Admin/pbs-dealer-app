import { useState, useEffect, Fragment } from 'react';
import ReusablePanel from '../Inputs/ReusablePanel';
import ReusableSelect from '../Inputs/ReusableSelect';
import ReusableInteger from '../Inputs/ReusableInteger';
import ReusableLocation from '../Inputs/ReusableLocation';
import FeetInchesInput from '../Inputs/FeetInchesInput';
import RoofPitchInput from '../Inputs/RoofPitchInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  roofs,
  roofInsulation,
  polycarbRoofSize,
  polycarbRoofColor,
} from '../../util/dropdownOptions';

const BuildingRoofOptions = ({
  values,
  activeBuilding,
  handleNestedChange,
  handleRoofReliteChange,
  setValues,
}) => {
  const [activeRoofRelite, setActiveRoofRelite] = useState(0);

  const addRoofRelite = (buildingIndex) => {
    setValues((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, index) =>
        index === buildingIndex
          ? {
              ...building,
              roofRelites: [
                ...building.roofRelites,
                {
                  roof: 'back',
                  size: '10',
                  color: 'clear',
                  qty: '',
                  location: '',
                  offset: '',
                  cutPanels: false,
                },
              ],
            }
          : building
      ),
    }));
  };

  const removeRoofRelites = (buildingIndex, roofReliteIndex) => {
    setValues((prev) => {
      const newBuildings = prev.buildings.map((building, bIndex) =>
        bIndex === buildingIndex
          ? {
              ...building,
              roofRelites: building.roofRelites.filter(
                (_, wsIndex) => wsIndex !== roofReliteIndex
              ),
            }
          : building
      );

      const remainingRoofRelites =
        newBuildings[buildingIndex].roofRelites.length;
      if (roofReliteIndex <= activeRoofRelite && activeRoofRelite > 0) {
        setActiveRoofRelite(
          Math.min(activeRoofRelite - 1, remainingRoofRelites - 1)
        );
      }

      return { ...prev, buildings: newBuildings };
    });
  };

  return (
    <>
      {/* Sheeting & Insulation */}
      <section className="card">
        <header className="cardHeader">
          <h3>Sheeting & Insulation</h3>
        </header>

        <div className="grid2 alignTop">
          <div className="grid2">
            <ReusableSelect
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
            <div className="checkboxGroup">
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
            </div>
          </div>
          <div className="divider offOnLaptop"></div>
          <ReusablePanel
            name="Roof"
            valueKey="roof"
            label="Roof"
            bldg={activeBuilding}
            value={values.buildings[activeBuilding]}
            onChange={(e, keyString) =>
              handleNestedChange(activeBuilding, keyString, e.target.value)
            }
          />
        </div>

        <div className="divider"></div>

        <h4>Gutters and Downspouts</h4>
        <div className="grid">
          <div className="checkboxGroup">
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
        </div>
      </section>

      {/* Roof Extensions */}
      <section className="card">
        <header>
          <h3>Roof Extensions</h3>
        </header>
        <div className="grid4 alignTop">
          <div className="grid">
            <FeetInchesInput
              name={`buildingfrontExtensionWidth-${activeBuilding}`}
              label="Front Sidewall Extension Width:"
              allowBlankValue={true}
              value={values.buildings[activeBuilding].frontExtensionWidth}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'frontExtensionWidth',
                  e.target.value
                )
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
              allowBlankValue={true}
              value={values.buildings[activeBuilding].backExtensionWidth}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'backExtensionWidth',
                  e.target.value
                )
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
            allowBlankValue={true}
            value={values.buildings[activeBuilding].leftExtensionWidth}
            onChange={(e) =>
              handleNestedChange(
                activeBuilding,
                'leftExtensionWidth',
                e.target.value
              )
            }
            allowZero={true}
          />
          <FeetInchesInput
            name={`buildingrightExtensionWidth-${activeBuilding}`}
            label="Right Endwall Extension Width:"
            allowBlankValue={true}
            value={values.buildings[activeBuilding].rightExtensionWidth}
            onChange={(e) =>
              handleNestedChange(
                activeBuilding,
                'rightExtensionWidth',
                e.target.value
              )
            }
            allowZero={true}
          />
        </div>
        <div className="divider"></div>

        <div className="grid2 alignTop">
          <div className="checkboxGroup">
            <div className="checkRow">
              <input
                type="checkbox"
                id={`buildingExtensionInsulation-${activeBuilding}`}
                name={`buildingExtensionInsulation-${activeBuilding}`}
                checked={values.buildings[activeBuilding].extensionInsulation}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'extensionInsulation',
                    e.target.checked
                  )
                }
              />
              <label htmlFor={`buildingExtensionInsulation-${activeBuilding}`}>
                Insulation In Extension
              </label>
            </div>
          </div>

          {/* <ReusableSelect
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
          /> */}

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

      {/* Point Loads */}
      {/* <section className="card">
        <header>
          <h3>Point Loads</h3>
        </header>
      </section> */}

      {/* Roof Relite Options */}
      <section className="card">
        <header>
          <h3>Roof Relites</h3>
        </header>
        {values.buildings[activeBuilding].roofRelites?.length > 0 && (
          <div className="onDesktop">
            <div className="tableGrid8">
              <h5>Roof</h5>
              <h5>Size</h5>
              <h5>Color</h5>
              <h5>Qty</h5>
              <h5>Locations</h5>
              <h5>Offset</h5>
              <h5>Panel Option</h5>
              <h5></h5>
            </div>
          </div>
        )}
        {values.buildings[activeBuilding].roofRelites?.map(
          (roofRelite, roofReliteIndex) => (
            <Fragment
              key={`building-${activeBuilding}-roofRelite-${roofReliteIndex}`}
            >
              <div
                className={`tableGrid8 ${roofReliteIndex == activeRoofRelite ? 'activeRow' : ''}`}
              >
                <ReusableSelect
                  name={`building-${activeBuilding}-roofReliteRoof-${roofReliteIndex}`}
                  label="Roof:"
                  labelClass="offOnDesktop"
                  value={roofRelite.roof}
                  onChange={(e) =>
                    handleRoofReliteChange(
                      activeBuilding,
                      roofReliteIndex,
                      'roof',
                      e.target.value
                    )
                  }
                  onFocus={() => {
                    if (activeRoofRelite !== roofReliteIndex) {
                      setActiveRoofRelite(roofReliteIndex);
                    }
                  }}
                  options={roofs}
                />
                <ReusableSelect
                  name={`building-${activeBuilding}-roofReliteSize-${roofReliteIndex}`}
                  label="Size:"
                  labelClass="offOnDesktop"
                  value={roofRelite.size}
                  onChange={(e) =>
                    handleRoofReliteChange(
                      activeBuilding,
                      roofReliteIndex,
                      'size',
                      e.target.value
                    )
                  }
                  onFocus={() => {
                    if (activeRoofRelite !== roofReliteIndex) {
                      setActiveRoofRelite(roofReliteIndex);
                    }
                  }}
                  options={polycarbRoofSize}
                />
                <ReusableSelect
                  name={`building-${activeBuilding}-roofReliteColor-${roofReliteIndex}`}
                  label="Color:"
                  labelClass="offOnDesktop"
                  value={roofRelite.color}
                  onChange={(e) =>
                    handleRoofReliteChange(
                      activeBuilding,
                      roofReliteIndex,
                      'color',
                      e.target.value
                    )
                  }
                  onFocus={() => {
                    if (activeRoofRelite !== roofReliteIndex) {
                      setActiveRoofRelite(roofReliteIndex);
                    }
                  }}
                  options={polycarbRoofColor}
                />
                <ReusableInteger
                  name={`building-${activeBuilding}-roofReliteQty-${roofReliteIndex}`}
                  value={roofRelite.qty}
                  min={1}
                  max={Math.floor(
                    Math.floor(values.buildings[activeBuilding].length / 3) / 2
                  )}
                  negative={false}
                  allowBlankValue={true}
                  label="Qty:"
                  labelClass="offOnDesktop"
                  onChange={(e) =>
                    handleRoofReliteChange(
                      activeBuilding,
                      roofReliteIndex,
                      'qty',
                      e.target.value
                    )
                  }
                  onFocus={() => {
                    if (activeRoofRelite !== roofReliteIndex) {
                      setActiveRoofRelite(roofReliteIndex);
                    }
                  }}
                  placeholder="Qty"
                />
                <ReusableLocation
                  name={`building-${activeBuilding}-roofReliteLocation-${roofReliteIndex}`}
                  label="Locations:"
                  labelClass="offOnDesktop"
                  value={roofRelite.location}
                  onChange={(name, value) =>
                    handleRoofReliteChange(
                      activeBuilding,
                      roofReliteIndex,
                      'location',
                      value
                    )
                  }
                  onFocus={() => {
                    if (activeRoofRelite !== roofReliteIndex) {
                      setActiveRoofRelite(roofReliteIndex);
                    }
                  }}
                  compareLabel="building length"
                  compareValue={values.buildings[activeBuilding].length}
                  placeholder=""
                />
                <FeetInchesInput
                  name={`building-${activeBuilding}-roofReliteOffset-${roofReliteIndex}`}
                  label="Offset:"
                  labelClass="offOnDesktop"
                  value={roofRelite.offset}
                  allowBlankValue={true}
                  onChange={(e) =>
                    handleRoofReliteChange(
                      activeBuilding,
                      roofReliteIndex,
                      'offset',
                      e.target.value
                    )
                  }
                  onFocus={() => {
                    if (activeRoofRelite !== roofReliteIndex) {
                      setActiveRoofRelite(roofReliteIndex);
                    }
                  }}
                />
                <div className="checkboxGroup">
                  <div className="checkRow">
                    <input
                      type="checkbox"
                      id={`building-${activeBuilding}-roofReliteCutPanels-${roofReliteIndex}`}
                      name={`building-${activeBuilding}-roofReliteCutPanels-${roofReliteIndex}`}
                      checked={roofRelite.cutPanels}
                      onChange={(e) =>
                        handleRoofReliteChange(
                          activeBuilding,
                          roofReliteIndex,
                          'cutPanels',
                          e.target.checked
                        )
                      }
                    />
                    <label
                      htmlFor={`building-${activeBuilding}-roofReliteCutPanels-${roofReliteIndex}`}
                    >
                      Cut Panels
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  className="icon reject deleteRow"
                  onClick={() =>
                    removeRoofRelites(activeBuilding, roofReliteIndex)
                  }
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              {roofReliteIndex + 1 <
                values.buildings[activeBuilding].roofRelites.length && (
                <div className="divider offOnTablet"></div>
              )}
            </Fragment>
          )
        )}
        <div className="divider"></div>
        <div className="buttonFooter">
          <button
            type="button"
            className="addButton"
            onClick={() => addRoofRelite(activeBuilding)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </section>
    </>
  );
};

export default BuildingRoofOptions;
