import { useState, useEffect, Fragment } from 'react';
import ReusablePanel from '../Inputs/ReusablePanel';
import ReusableSelect from '../Inputs/ReusableSelect';
import ReusableInteger from '../Inputs/ReusableInteger';
import ReusableLocation from '../Inputs/ReusableLocation';
import ReusableToggle from '../Inputs/ReusableToggle';
import FeetInchesInput from '../Inputs/FeetInchesInput';
import RoofPitchInput from '../Inputs/RoofPitchInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  roofs,
  roofInsulation,
  polycarbRoofSize,
  polycarbRoofColor,
  roof,
} from '../../util/dropdownOptions';
import { useUIContext } from '@/contexts/UIContext';
import { useBuildingContext } from '@/contexts/BuildingContext';
import { useColorSelection } from '@/hooks/useColorSelection';
import ReusableColorSelect from '../Inputs/ReusableColorSelect';

const BuildingRoofOptions = ({ locked }) => {
  // Local State
  const [activeRoofLinerPanel, setActiveRoofLinerPanel] = useState(0);
  const [activeRoofRelite, setActiveRoofRelite] = useState(0);

  // Contexts
  const { activeBuilding } = useUIContext();
  const {
    state,
    handleNestedChange,
    addRoofLinerPanel,
    removeRoofLinerPanel,
    handleRoofLinerPanelChange,
    addRoofRelite,
    removeRoofRelite,
    handleRoofReliteChange,
  } = useBuildingContext();

  // Hooks
  const { colorSelectInfo, handleColorClick, handleColorSelect } =
    useColorSelection();

  // Local Functions
  const handleAddRoofLinerPanel = () => {
    addRoofLinerPanel(activeBuilding);
    setActiveRoofLinerPanel(
      state.buildings[activeBuilding].roofLinerPanels.length
    );
  };

  const handleRemoveRoofLinerPanel = (roofLinerPanelIndex) => {
    removeRoofLinerPanel(activeBuilding, roofLinerPanelIndex);
    if (roofLinerPanelIndex === activeRoofLinerPanel) {
      setActiveRoofLinerPanel(0);
    } else if (roofLinerPanelIndex < activeRoofLinerPanel) {
      setActiveRoofLinerPanel((prev) => prev - 1);
    }
  };

  const handleAddRoofRelite = () => {
    addRoofRelite(activeBuilding);
    setActiveRoofRelite(state.buildings[activeBuilding].roofRelites.length);
  };

  const handleRemoveRoofRelite = (roofReliteIndex) => {
    removeRoofRelite(activeBuilding, roofReliteIndex);
    if (roofReliteIndex === activeRoofRelite) {
      setActiveRoofRelite(0);
    } else if (roofReliteIndex < activeRoofRelite) {
      setActiveRoofRelite((prev) => prev - 1);
    }
  };

  // JSX
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
              value={state.buildings[activeBuilding].roofInsulation}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'roofInsulation',
                  e.target.value
                )
              }
              options={roofInsulation}
              label="Roof Insulation:"
              disabled={locked}
            />
            <div className="checkboxGroup">
              <div className="checkRow">
                <input
                  type="checkbox"
                  id={`buildingRoofInsulationOthers-${activeBuilding}`}
                  name={`buildingRoofInsulationOthers-${activeBuilding}`}
                  checked={state.buildings[activeBuilding].roofInsulationOthers}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'roofInsulationOthers',
                      e.target.checked
                    )
                  }
                  disabled={locked}
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
            name="roof"
            label="Roof"
            bldg={activeBuilding}
            value={state.buildings[activeBuilding]}
            onChange={(e, keyString) =>
              handleNestedChange(activeBuilding, keyString, e.target.value)
            }
            colorClicked={handleColorClick}
            disabled={locked}
          />
        </div>

        <div className="divider"></div>

        <h4>Gutters and Downspouts</h4>
        <div className="grid">
          <div className="toggleGroup">
            <ReusableToggle
              id={`buildingIncludeGutters-${activeBuilding}`}
              checked={state.buildings[activeBuilding].includeGutters}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'includeGutters',
                  e.target.checked
                )
              }
              label="Include Gutters and Downspouts"
              className="prim"
              disabled={locked}
            />
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
              value={state.buildings[activeBuilding].frontExtensionWidth}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'frontExtensionWidth',
                  e.target.value
                )
              }
              allowZero={true}
              disabled={locked}
            />
            <div className="toggleGroup">
              <ReusableToggle
                id={`buildingFrontExtensionColumns-${activeBuilding}`}
                checked={state.buildings[activeBuilding].frontExtensionColumns}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'frontExtensionColumns',
                    e.target.checked
                  )
                }
                label="Add Columns"
                className="prim"
                disabled={locked}
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
                value={state.buildings[activeBuilding].frontExtensionBays}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'frontExtensionBays',
                    e.target.value
                  )
                }
                placeholder="Separate Bays with Space"
                disabled={locked}
              />
            </div>
          </div>
          <div className="grid">
            <FeetInchesInput
              name={`buildingbackExtensionWidth-${activeBuilding}`}
              label="Back Sidewall Extension Width:"
              allowBlankValue={true}
              value={state.buildings[activeBuilding].backExtensionWidth}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'backExtensionWidth',
                  e.target.value
                )
              }
              allowZero={true}
              disabled={locked}
            />
            <div className="toggleGroup">
              <ReusableToggle
                id={`buildingBackExtensionColumns-${activeBuilding}`}
                checked={state.buildings[activeBuilding].backExtensionColumns}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'backExtensionColumns',
                    e.target.checked
                  )
                }
                label="Add Columns"
                className="prim"
                disabled={locked}
              />
            </div>
            <div className="cardInput">
              <label htmlFor={`buildingBackExtensionBays-${activeBuilding}`}>
                Back Extension Bays:
              </label>
              <input
                type="text"
                id={`buildingBackExtensionBays-${activeBuilding}`}
                name={`buildingBackExtensionBays-${activeBuilding}`}
                value={state.buildings[activeBuilding].backExtensionBays}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'backExtensionBays',
                    e.target.value
                  )
                }
                placeholder="Separate Bays with Space"
                disabled={locked}
              />
            </div>
          </div>
          <FeetInchesInput
            name={`buildingleftExtensionWidth-${activeBuilding}`}
            label="Left Endwall Extension Width:"
            allowBlankValue={true}
            value={state.buildings[activeBuilding].leftExtensionWidth}
            onChange={(e) =>
              handleNestedChange(
                activeBuilding,
                'leftExtensionWidth',
                e.target.value
              )
            }
            allowZero={true}
            disabled={locked}
          />
          <FeetInchesInput
            name={`buildingrightExtensionWidth-${activeBuilding}`}
            label="Right Endwall Extension Width:"
            allowBlankValue={true}
            value={state.buildings[activeBuilding].rightExtensionWidth}
            onChange={(e) =>
              handleNestedChange(
                activeBuilding,
                'rightExtensionWidth',
                e.target.value
              )
            }
            allowZero={true}
            disabled={locked}
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
                checked={state.buildings[activeBuilding].extensionInsulation}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'extensionInsulation',
                    e.target.checked
                  )
                }
                disabled={locked}
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
            name="soffit"
            label="Soffit"
            bldg={activeBuilding}
            value={state.buildings[activeBuilding]}
            onChange={(e, keyString) =>
              handleNestedChange(activeBuilding, keyString, e.target.value)
            }
            colorClicked={handleColorClick}
            disabled={locked}
          />
        </div>
      </section>

      {/* Roof Liner Panel Options */}
      <section className="card">
        <header>
          <h3>Roof Liner Panels</h3>
        </header>
        <>
          {state.buildings[activeBuilding].roofLinerPanels?.length > 0 && (
            <div className="onTablet">
              <div className="tableGrid5">
                <h5>Location</h5>
                <h5>
                  Start <small>(Left to Right)</small>
                </h5>
                <h5>
                  End <small>(Left to Right)</small>
                </h5>
                <h5>Height</h5>
                <h5></h5>
                <h5></h5>
              </div>
            </div>
          )}
          {state.buildings[activeBuilding].roofLinerPanels?.map(
            (roofLinerPanel, roofLinerPanelIndex) => (
              <Fragment
                key={`building-${activeBuilding}-roofLinerPanel-${roofLinerPanelIndex}`}
              >
                <div
                  className={`tableGrid5 ${roofLinerPanelIndex == activeRoofLinerPanel ? 'activeRow' : ''}`}
                >
                  <ReusableSelect
                    name={`building-${activeBuilding}-roofLinerPanelWall-${roofLinerPanelIndex}`}
                    labelClass="offOnTablet"
                    value={roofLinerPanel.wall}
                    onChange={(e) =>
                      handleRoofLinerPanelChange(
                        activeBuilding,
                        roofLinerPanelIndex,
                        'wall',
                        e.target.value
                      )
                    }
                    onFocus={() => {
                      if (activeRoofLinerPanel !== roofLinerPanelIndex) {
                        setActiveRoofLinerPanel(roofLinerPanelIndex);
                      }
                    }}
                    options={roof}
                    label="Location:"
                    disabled={locked}
                  />
                  <FeetInchesInput
                    name={`building-${activeBuilding}-roofLinerPanelStart-${roofLinerPanelIndex}`}
                    label={
                      <>
                        <span>
                          Start: <small>(Left to Right)</small>
                        </span>
                      </>
                    }
                    labelClass="offOnTablet"
                    value={roofLinerPanel.start}
                    allowBlankValue={true}
                    allowZero={true}
                    onChange={(e) =>
                      handleRoofLinerPanelChange(
                        activeBuilding,
                        roofLinerPanelIndex,
                        'start',
                        e.target.value
                      )
                    }
                    onFocus={() => {
                      if (activeRoofLinerPanel !== roofLinerPanelIndex) {
                        setActiveRoofLinerPanel(roofLinerPanelIndex);
                      }
                    }}
                    disabled={locked}
                  />
                  <FeetInchesInput
                    name={`building-${activeBuilding}-roofLinerPanelEnd-${roofLinerPanelIndex}`}
                    label={
                      <>
                        <span>
                          End: <small>(Left to Right)</small>
                        </span>
                      </>
                    }
                    labelClass="offOnTablet"
                    value={roofLinerPanel.end}
                    allowBlankValue={true}
                    onChange={(e) =>
                      handleRoofLinerPanelChange(
                        activeBuilding,
                        roofLinerPanelIndex,
                        'end',
                        e.target.value
                      )
                    }
                    onFocus={() => {
                      if (activeRoofLinerPanel !== roofLinerPanelIndex) {
                        setActiveRoofLinerPanel(roofLinerPanelIndex);
                      }
                    }}
                    disabled={locked}
                  />
                  <FeetInchesInput
                    name={`building-${activeBuilding}-roofLinerPanelHeight-${roofLinerPanelIndex}`}
                    label="Height:"
                    labelClass="offOnTablet"
                    value={roofLinerPanel.height}
                    allowBlankValue={true}
                    onChange={(e) =>
                      handleRoofLinerPanelChange(
                        activeBuilding,
                        roofLinerPanelIndex,
                        'height',
                        e.target.value
                      )
                    }
                    onFocus={() => {
                      if (activeRoofLinerPanel !== roofLinerPanelIndex) {
                        setActiveRoofLinerPanel(roofLinerPanelIndex);
                      }
                    }}
                    placeholder="Leave Blank for Full Ht"
                    disabled={true}
                  />
                  <button
                    type="button"
                    className="icon reject deleteRow"
                    onClick={() =>
                      handleRemoveRoofLinerPanel(roofLinerPanelIndex)
                    }
                    disabled={locked}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
                <div className="divider offOnTablet"></div>
              </Fragment>
            )
          )}

          {state.buildings[activeBuilding].roofLinerPanels?.length > 0 && (
            <>
              <div className="divider onDesktop"></div>
              <div className="grid2">
                <div className="onLaptop"></div>
                <ReusablePanel
                  name="roofLiner"
                  label="Liner"
                  bldg={activeBuilding}
                  idx={activeRoofLinerPanel}
                  value={
                    state.buildings[activeBuilding].roofLinerPanels[
                      activeRoofLinerPanel
                    ]
                  }
                  onChange={(e, keyString) =>
                    handleRoofLinerPanelChange(
                      activeBuilding,
                      activeRoofLinerPanel,
                      keyString,
                      e.target.value
                    )
                  }
                  colorClicked={handleColorClick}
                  disabled={locked}
                />
              </div>
            </>
          )}
          {!locked && (
            <>
              <div className="divider"></div>
              <div className="buttonFooter">
                <button
                  type="button"
                  className="addButton"
                  onClick={() => handleAddRoofLinerPanel(activeBuilding)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </>
          )}
        </>
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
        {state.buildings[activeBuilding].roofRelites?.length > 0 && (
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
        {state.buildings[activeBuilding].roofRelites?.map(
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
                  disabled={locked}
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
                  disabled={locked}
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
                  disabled={locked}
                />
                <ReusableInteger
                  name={`building-${activeBuilding}-roofReliteQty-${roofReliteIndex}`}
                  value={roofRelite.qty}
                  min={1}
                  max={Math.floor(
                    Math.floor(state.buildings[activeBuilding].length / 3) / 2
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
                  disabled={locked}
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
                  compareValue={state.buildings[activeBuilding].length}
                  placeholder=""
                  disabled={locked}
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
                  disabled={locked}
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
                      disabled={locked}
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
                  onClick={() => handleRemoveRoofRelite(roofReliteIndex)}
                  disabled={locked}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              {roofReliteIndex + 1 <
                state.buildings[activeBuilding].roofRelites.length && (
                <div className="divider offOnTablet"></div>
              )}
            </Fragment>
          )
        )}
        {!locked && (
          <>
            <div className="divider"></div>
            <div className="buttonFooter">
              <button
                type="button"
                className="addButton"
                onClick={() => handleAddRoofRelite(activeBuilding)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </>
        )}
      </section>

      {/* Dialogs */}
      <ReusableColorSelect
        isOpen={colorSelectInfo.isOpen}
        onClose={() => handleColorClick({ ...colorSelectInfo, isOpen: false })}
        onColorSelect={handleColorSelect}
        {...colorSelectInfo}
      />
    </>
  );
};

export default BuildingRoofOptions;
