import { React, useState, Fragment } from 'react';
import ReusablePanel from '../Inputs/ReusablePanel';
import ReusableSelect from '../Inputs/ReusableSelect';
import ReusableInteger from '../Inputs/ReusableInteger';
import ReusableLocation from '../Inputs/ReusableLocation';
import FeetInchesInput from '../Inputs/FeetInchesInput';
import RoofPitchInput from '../Inputs/RoofPitchInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  walls,
  wallInsulation,
  panelOptions,
  topOfWall,
  polycarbWallSize,
  polycarbWallColor,
} from '../../util/dropdownOptions';
import { useColorSelection } from '@/hooks/useColorSelection';
import { useUIContext } from '@/contexts/UIContext';
import { useBuildingContext } from '@/contexts/BuildingContext';
import ReusableColorSelect from '../Inputs/ReusableColorSelect';

const BuildingWallOptions = ({ locked }) => {
  // Local State
  const [activeWallLinerPanel, setActiveWallLinerPanel] = useState(0);
  const [activeWainscot, setActiveWainscot] = useState(0);
  const [activePartialWall, setActivePartialWall] = useState(0);
  const [activeWallSkirt, setActiveWallSkirt] = useState(0);
  const [activeCanopy, setActiveCanopy] = useState(0);
  const [activeWallRelite, setActiveWallRelite] = useState(0);

  // Contexts
  const { activeBuilding } = useUIContext();
  const {
    state,
    handleNestedChange,
    addWallLinerPanel,
    removeWallLinerPanel,
    handleWallLinerPanelChange,
    addWainscot,
    removeWainscot,
    handleWainscotChange,
    addPartialWall,
    removePartialWall,
    handlePartialWallChange,
    addWallSkirt,
    removeWallSkirt,
    handleWallSkirtChange,
    addCanopy,
    removeCanopy,
    handleCanopyChange,
    addWallRelite,
    removeWallRelite,
    handleWallReliteChange,
  } = useBuildingContext();

  // Hooks
  const { colorSelectInfo, handleColorClick, handleColorSelect } =
    useColorSelection();

  // Local Functions
  const handleAddWallLinerPanel = () => {
    addWallLinerPanel(activeBuilding);
    setActiveWallLinerPanel(
      state.buildings[activeBuilding].wallLinerPanels.length
    );
  };

  const handleRemoveWallLinerPanel = (wallLinerPanelIndex) => {
    removeWallLinerPanel(activeBuilding, wallLinerPanelIndex);
    if (wallLinerPanelIndex === activeWallLinerPanel) {
      setActiveWallLinerPanel(0);
    } else if (wallLinerPanelIndex < activeWallLinerPanel) {
      setActiveWallLinerPanel((prev) => prev - 1);
    }
  };

  const handleAddWainscot = () => {
    addWainscot(activeBuilding);
    setActiveWainscot(state.buildings[activeBuilding].wainscots.length);
  };

  const handleRemoveWainscot = (wainscotIndex) => {
    removeWainscot(activeBuilding, wainscotIndex);
    if (wainscotIndex === activeWainscot) {
      setActiveWainscot(0);
    } else if (wainscotIndex < activeWainscot) {
      setActiveWainscot((prev) => prev - 1);
    }
  };

  const handleAddPartialWall = () => {
    addPartialWall(activeBuilding);
    setActivePartialWall(state.buildings[activeBuilding].partialWalls.length);
  };

  const handleRemovePartialWall = (partialWallIndex) => {
    removePartialWall(activeBuilding, partialWallIndex);
    if (partialWallIndex === activePartialWall) {
      setActivePartialWall(0);
    } else if (partialWallIndex < activePartialWall) {
      setActivePartialWall((prev) => prev - 1);
    }
  };

  const handleAddWallSkirt = () => {
    addWallSkirt(activeBuilding);
    setActiveWallSkirt(state.buildings[activeBuilding].wallSkirts.length);
  };

  const handleRemoveWallSkirt = (wallSkirtIndex) => {
    removeWallSkirt(activeBuilding, wallSkirtIndex);
    if (wallSkirtIndex === activeWallSkirt) {
      setActiveWallSkirt(0);
    } else if (wallSkirtIndex < activeWallSkirt) {
      setActiveWallSkirt((prev) => prev - 1);
    }
  };

  const handleAddCanopy = () => {
    addCanopy(activeBuilding);
    setActiveCanopy(state.buildings[activeBuilding].canopies.length);
  };

  const handleRemoveCanopy = (canopyIndex) => {
    removeCanopy(activeBuilding, canopyIndex);
    if (canopyIndex === activeCanopy) {
      setActiveCanopy(0);
    } else if (canopyIndex < activeCanopy) {
      setActiveCanopy((prev) => prev - 1);
    }
  };

  const handleAddWallRelite = () => {
    addWallRelite(activeBuilding);
    setActiveWallRelite(state.buildings[activeBuilding].wallRelites.length);
  };

  const handleRemoveWallRelite = (wallReliteIndex) => {
    removeWallRelite(activeBuilding, wallReliteIndex);
    if (wallReliteIndex === activeWallRelite) {
      setActiveWallRelite(0);
    } else if (wallReliteIndex < activeWallRelite) {
      setActiveWallRelite((prev) => prev - 1);
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
              name={`buildingWallInsulation-${activeBuilding}`}
              value={state.buildings[activeBuilding].wallInsulation}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'wallInsulation',
                  e.target.value
                )
              }
              options={wallInsulation}
              disabled={!state.buildings[activeBuilding].allWallsSame || locked}
              label="Wall Insulation:"
            />
            <div className="checkboxGroup">
              <div className="checkRow">
                <input
                  type="checkbox"
                  id={`buildingWallInsulationOthers-${activeBuilding}`}
                  name={`buildingWallInsulationOthers-${activeBuilding}`}
                  checked={state.buildings[activeBuilding].wallInsulationOthers}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'wallInsulationOthers',
                      e.target.checked
                    )
                  }
                  disabled={locked}
                />
                <label
                  htmlFor={`buildingWallInsulationOthers-${activeBuilding}`}
                >
                  By Others (Wall Insulation)
                </label>
              </div>
            </div>
            <div>
              &nbsp;
              <br />
              &nbsp;
            </div>
            <div className="checkboxGroup span2">
              <div className="checkRow">
                <input
                  type="checkbox"
                  id={`buildingAllWallsSame-${activeBuilding}`}
                  name={`buildingAllWallsSame-${activeBuilding}`}
                  checked={state.buildings[activeBuilding].allWallsSame}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'allWallsSame',
                      e.target.checked
                    )
                  }
                  disabled={locked}
                />
                <label htmlFor={`buildingAllWallsSame-${activeBuilding}`}>
                  All Walls Same
                </label>
              </div>
            </div>
          </div>

          <div className="divider offOnLaptop"></div>
          <ReusablePanel
            name="wall"
            label="Wall"
            bldg={activeBuilding}
            value={state.buildings[activeBuilding]}
            onChange={(e, keyString) =>
              handleNestedChange(activeBuilding, keyString, e.target.value)
            }
            colorClicked={handleColorClick}
            disabled={!state.buildings[activeBuilding].allWallsSame || locked}
          />
        </div>

        {!state.buildings[activeBuilding].allWallsSame && (
          <>
            <div className="divider"></div>

            <div className="grid4 alignTop">
              <div
                className={
                  state.buildings[activeBuilding].leftFrame == 'insetRF' ||
                  state.buildings[activeBuilding].rightFrame == 'insetRF'
                    ? 'span2'
                    : 'grid'
                }
              >
                <ReusablePanel
                  name="frontWall"
                  label="Front Sidewall"
                  bldg={activeBuilding}
                  value={state.buildings[activeBuilding]}
                  onChange={(e, keyString) =>
                    handleNestedChange(
                      activeBuilding,
                      keyString,
                      e.target.value
                    )
                  }
                  colorClicked={handleColorClick}
                  disabled={locked}
                />
                <ReusableSelect
                  name={`buildingFrontWallInsulation-${activeBuilding}`}
                  value={state.buildings[activeBuilding].wallFrontInsulation}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'wallFrontInsulation',
                      e.target.value
                    )
                  }
                  options={wallInsulation}
                  label="Front Sidewall Insulation:"
                  disabled={locked}
                />
              </div>
              <div className="divider offOnTablet"></div>
              <div
                className={
                  state.buildings[activeBuilding].leftFrame == 'insetRF' ||
                  state.buildings[activeBuilding].rightFrame == 'insetRF'
                    ? 'span2'
                    : 'grid'
                }
              >
                <ReusablePanel
                  name="backWall"
                  label="Back Sidewall"
                  bldg={activeBuilding}
                  value={state.buildings[activeBuilding]}
                  onChange={(e, keyString) =>
                    handleNestedChange(
                      activeBuilding,
                      keyString,
                      e.target.value
                    )
                  }
                  colorClicked={handleColorClick}
                  disabled={locked}
                />
                <ReusableSelect
                  name={`buildingBackWallInsulation-${activeBuilding}`}
                  value={state.buildings[activeBuilding].wallBackInsulation}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'wallBackInsulation',
                      e.target.value
                    )
                  }
                  options={wallInsulation}
                  label="Back Sidewall Insulation:"
                  disabled={locked}
                />
              </div>
              <div
                className={
                  state.buildings[activeBuilding].leftFrame == 'insetRF' ||
                  state.buildings[activeBuilding].rightFrame == 'insetRF'
                    ? 'divider span4'
                    : 'divider offOnDesktop span2'
                }
              ></div>
              {state.buildings[activeBuilding].leftFrame == 'insetRF' && (
                <>
                  <div className="grid">
                    <ReusablePanel
                      name="outerLeftWall"
                      label="Outer Left Endwall"
                      bldg={activeBuilding}
                      value={state.buildings[activeBuilding]}
                      onChange={(e, keyString) =>
                        handleNestedChange(
                          activeBuilding,
                          keyString,
                          e.target.value
                        )
                      }
                      colorClicked={handleColorClick}
                      disabled={locked}
                    />
                    <ReusableSelect
                      name={`buildingOuterLeftWallInsulation-${activeBuilding}`}
                      value={
                        state.buildings[activeBuilding].wallOuterLeftInsulation
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'wallOuterLeftInsulation',
                          e.target.value
                        )
                      }
                      options={wallInsulation}
                      label="OuterLeft Left Endwall Insulation:"
                      disabled={locked}
                    />
                  </div>
                  <div className="divider offOnTablet"></div>
                </>
              )}
              {state.buildings[activeBuilding].leftFrame != 'insetRF' &&
                state.buildings[activeBuilding].rightFrame == 'insetRF' && (
                  <div className="onPhone"></div>
                )}
              <div className="grid">
                <ReusablePanel
                  name="leftWall"
                  label="Left Endwall"
                  bldg={activeBuilding}
                  value={state.buildings[activeBuilding]}
                  onChange={(e, keyString) =>
                    handleNestedChange(
                      activeBuilding,
                      keyString,
                      e.target.value
                    )
                  }
                  colorClicked={handleColorClick}
                  disabled={locked}
                />
                <ReusableSelect
                  name={`buildingLeftWallInsulation-${activeBuilding}`}
                  value={state.buildings[activeBuilding].wallLeftInsulation}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'wallLeftInsulation',
                      e.target.value
                    )
                  }
                  options={wallInsulation}
                  label="Left Endwall Insulation:"
                  disabled={locked}
                />
              </div>
              {state.buildings[activeBuilding].leftFrame == 'insetRF' ||
              state.buildings[activeBuilding].rightFrame == 'insetRF' ? (
                <div className="divider offOnDesktop span2"></div>
              ) : (
                <div className="divider offOnTablet"></div>
              )}
              <div className="grid">
                <ReusablePanel
                  name="rightWall"
                  label="Right Endwall"
                  bldg={activeBuilding}
                  value={state.buildings[activeBuilding]}
                  onChange={(e, keyString) =>
                    handleNestedChange(
                      activeBuilding,
                      keyString,
                      e.target.value
                    )
                  }
                  colorClicked={handleColorClick}
                  disabled={locked}
                />
                <ReusableSelect
                  name={`buildingRightWallInsulation-${activeBuilding}`}
                  value={state.buildings[activeBuilding].wallRightInsulation}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'wallRightInsulation',
                      e.target.value
                    )
                  }
                  options={wallInsulation}
                  label="Right Endwall Insulation:"
                  disabled={locked}
                />
              </div>
              {state.buildings[activeBuilding].rightFrame == 'insetRF' && (
                <>
                  <div className="divider offOnTablet"></div>
                  <div className="grid">
                    <ReusablePanel
                      name="outerRightWall"
                      label="Outer Right Endwall"
                      bldg={activeBuilding}
                      value={state.buildings[activeBuilding]}
                      onChange={(e, keyString) =>
                        handleNestedChange(
                          activeBuilding,
                          keyString,
                          e.target.value
                        )
                      }
                      colorClicked={handleColorClick}
                      disabled={locked}
                    />
                    <ReusableSelect
                      name={`buildingOuterRightWallInsulation-${activeBuilding}`}
                      value={
                        state.buildings[activeBuilding].wallOuterRightInsulation
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'wallOuterRightInsulation',
                          e.target.value
                        )
                      }
                      options={wallInsulation}
                      label="Outer Right Endwall Insulation:"
                      disabled={locked}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </section>

      {/* Wall Liner Panel Options */}
      <section className="card">
        <header>
          <h3>Wall Liner Panels</h3>
        </header>
        {state.buildings[activeBuilding].frontGirtType != 'open' ||
        state.buildings[activeBuilding].backGirtType != 'open' ||
        state.buildings[activeBuilding].leftGirtType != 'open' ||
        state.buildings[activeBuilding].rightGirtType != 'open' ? (
          <>
            {state.buildings[activeBuilding].wallLinerPanels?.length > 0 && (
              <div className="onTablet">
                <div className="tableGrid5">
                  <h5>Wall</h5>
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
            {state.buildings[activeBuilding].wallLinerPanels?.map(
              (wallLinerPanel, wallLinerPanelIndex) => (
                <Fragment
                  key={`building-${activeBuilding}-wallLinerPanel-${wallLinerPanelIndex}`}
                >
                  <div
                    className={`tableGrid5 ${wallLinerPanelIndex == activeWallLinerPanel ? 'activeRow' : ''}`}
                  >
                    <ReusableSelect
                      name={`building-${activeBuilding}-wallLinerPanelWall-${wallLinerPanelIndex}`}
                      labelClass="offOnTablet"
                      value={wallLinerPanel.wall}
                      onChange={(e) =>
                        handleWallLinerPanelChange(
                          activeBuilding,
                          wallLinerPanelIndex,
                          'wall',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activeWallLinerPanel !== wallLinerPanelIndex) {
                          setActiveWallLinerPanel(wallLinerPanelIndex);
                        }
                      }}
                      options={walls}
                      label="Wall:"
                      disabled={locked}
                    />
                    <FeetInchesInput
                      name={`building-${activeBuilding}-wallLinerPanelStart-${wallLinerPanelIndex}`}
                      label={
                        <>
                          <span>
                            Start: <small>(Left to Right)</small>
                          </span>
                        </>
                      }
                      labelClass="offOnTablet"
                      value={wallLinerPanel.start}
                      allowBlankValue={true}
                      allowZero={true}
                      onChange={(e) =>
                        handleWallLinerPanelChange(
                          activeBuilding,
                          wallLinerPanelIndex,
                          'start',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activeWallLinerPanel !== wallLinerPanelIndex) {
                          setActiveWallLinerPanel(wallLinerPanelIndex);
                        }
                      }}
                      disabled={locked}
                    />
                    <FeetInchesInput
                      name={`building-${activeBuilding}-wallLinerPanelEnd-${wallLinerPanelIndex}`}
                      label={
                        <>
                          <span>
                            End: <small>(Left to Right)</small>
                          </span>
                        </>
                      }
                      labelClass="offOnTablet"
                      value={wallLinerPanel.end}
                      allowBlankValue={true}
                      onChange={(e) =>
                        handleWallLinerPanelChange(
                          activeBuilding,
                          wallLinerPanelIndex,
                          'end',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activeWallLinerPanel !== wallLinerPanelIndex) {
                          setActiveWallLinerPanel(wallLinerPanelIndex);
                        }
                      }}
                      disabled={locked}
                    />
                    <FeetInchesInput
                      name={`building-${activeBuilding}-wallLinerPanelHeight-${wallLinerPanelIndex}`}
                      label="Height:"
                      labelClass="offOnTablet"
                      value={wallLinerPanel.height}
                      allowBlankValue={true}
                      onChange={(e) =>
                        handleWallLinerPanelChange(
                          activeBuilding,
                          wallLinerPanelIndex,
                          'height',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activeWallLinerPanel !== wallLinerPanelIndex) {
                          setActiveWallLinerPanel(wallLinerPanelIndex);
                        }
                      }}
                      placeholder="Leave Blank for Full Ht"
                      disabled={locked}
                    />
                    <button
                      type="button"
                      className="icon reject deleteRow"
                      onClick={() =>
                        handleRemoveWallLinerPanel(
                          activeBuilding,
                          wallLinerPanelIndex
                        )
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

            {state.buildings[activeBuilding].wallLinerPanels?.length > 0 && (
              <>
                <div className="divider onDesktop"></div>
                <div className="grid2">
                  <div className="onLaptop"></div>
                  <ReusablePanel
                    name="wallLiner"
                    label="Liner"
                    bldg={activeBuilding}
                    idx={activeWallLinerPanel}
                    value={
                      state.buildings[activeBuilding].wallLinerPanels[
                        activeWallLinerPanel
                      ]
                    }
                    onChange={(e, keyString) =>
                      handleWallLinerPanelChange(
                        activeBuilding,
                        activeWallLinerPanel,
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
                    onClick={() => {
                      handleAddWallLinerPanel(activeBuilding);
                      setActiveWallLinerPanel(
                        state.buildings[activeBuilding].wallLinerPanels.length
                      );
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <h4 className="openWallNote">
            No Liner Panels Available
            <br />
            All Walls Are Open
          </h4>
        )}
      </section>

      {/* Wainscot Options */}
      <section className="card">
        <header>
          <h3>Wainscots</h3>
        </header>
        {state.buildings[activeBuilding].frontGirtType != 'open' ||
        state.buildings[activeBuilding].backGirtType != 'open' ||
        state.buildings[activeBuilding].leftGirtType != 'open' ||
        state.buildings[activeBuilding].rightGirtType != 'open' ? (
          <>
            {state.buildings[activeBuilding].wainscots.length > 0 && (
              <div className="onTablet">
                <div className="tableGrid6">
                  <h5>Wall</h5>
                  <h5>
                    Start <small>(Left to Right)</small>
                  </h5>
                  <h5>
                    End <small>(Left to Right)</small>
                  </h5>
                  <h5>Height</h5>
                  <h5>Panel Option</h5>
                  <h5></h5>
                </div>
              </div>
            )}
            {state.buildings[activeBuilding].wainscots.map(
              (wainscot, wainscotIndex) => (
                <Fragment
                  key={`building-${activeBuilding}-wainscot-${wainscotIndex}`}
                >
                  <div
                    className={`tableGrid6 ${wainscotIndex == activeWainscot ? 'activeRow' : ''}`}
                  >
                    <ReusableSelect
                      name={`building-${activeBuilding}-wainscotWall-${wainscotIndex}`}
                      labelClass="offOnTablet"
                      value={wainscot.wall}
                      onChange={(e) =>
                        handleWainscotChange(
                          activeBuilding,
                          wainscotIndex,
                          'wall',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activeWainscot !== wainscotIndex) {
                          setActiveWainscot(wainscotIndex);
                        }
                      }}
                      options={walls}
                      label="Wall:"
                      disabled={locked}
                    />
                    <FeetInchesInput
                      name={`building-${activeBuilding}-wainscotStart-${wainscotIndex}`}
                      label={
                        <>
                          <span>
                            Start: <small>(Left to Right)</small>
                          </span>
                        </>
                      }
                      labelClass="offOnTablet"
                      value={wainscot.start}
                      allowBlankValue={true}
                      allowZero={true}
                      onChange={(e) =>
                        handleWainscotChange(
                          activeBuilding,
                          wainscotIndex,
                          'start',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activeWainscot !== wainscotIndex) {
                          setActiveWainscot(wainscotIndex);
                        }
                      }}
                      disabled={locked}
                    />
                    <FeetInchesInput
                      name={`building-${activeBuilding}-wainscotEnd-${wainscotIndex}`}
                      label={
                        <>
                          <span>
                            End: <small>(Left to Right)</small>
                          </span>
                        </>
                      }
                      labelClass="offOnTablet"
                      value={wainscot.end}
                      allowBlankValue={true}
                      onChange={(e) =>
                        handleWainscotChange(
                          activeBuilding,
                          wainscotIndex,
                          'end',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activeWainscot !== wainscotIndex) {
                          setActiveWainscot(wainscotIndex);
                        }
                      }}
                      disabled={locked}
                    />
                    <FeetInchesInput
                      name={`building-${activeBuilding}-wainscotHeight-${wainscotIndex}`}
                      label="Height:"
                      labelClass="offOnTablet"
                      value={wainscot.height}
                      allowBlankValue={true}
                      onChange={(e) =>
                        handleWainscotChange(
                          activeBuilding,
                          wainscotIndex,
                          'height',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activeWainscot !== wainscotIndex) {
                          setActiveWainscot(wainscotIndex);
                        }
                      }}
                      disabled={locked}
                    />
                    <ReusableSelect
                      name={`building-${activeBuilding}-wainscotPanelOption-${wainscotIndex}`}
                      labelClass="offOnTablet"
                      value={wainscot.panelOption}
                      onChange={(e) =>
                        handleWainscotChange(
                          activeBuilding,
                          wainscotIndex,
                          'panelOption',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activeWainscot !== wainscotIndex) {
                          setActiveWainscot(wainscotIndex);
                        }
                      }}
                      options={panelOptions}
                      label="Panel Option:"
                      disabled={locked}
                    />
                    <button
                      type="button"
                      className="icon reject deleteRow"
                      onClick={() =>
                        handleRemoveWainscot(activeBuilding, wainscotIndex)
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

            {state.buildings[activeBuilding].wainscots.length > 0 && (
              <>
                <div className="divider onDesktop"></div>
                <div className="grid2">
                  <div className="onLaptop"></div>
                  <ReusablePanel
                    name="wainscot"
                    label="Wainscot"
                    bldg={activeBuilding}
                    idx={activeWainscot}
                    value={
                      state.buildings[activeBuilding].wainscots[activeWainscot]
                    }
                    onChange={(e, keyString) =>
                      handleWainscotChange(
                        activeBuilding,
                        activeWainscot,
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
                    onClick={() => handleAddWainscot(activeBuilding)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <h4 className="openWallNote">
            No Wainscots Available
            <br />
            All Walls Are Open
          </h4>
        )}
      </section>

      {/* Partial Wall Options */}
      <section className="card">
        <header>
          <h3>Partial Walls</h3>
        </header>
        {state.buildings[activeBuilding].frontGirtType != 'open' ||
        state.buildings[activeBuilding].backGirtType != 'open' ||
        state.buildings[activeBuilding].leftGirtType != 'open' ||
        state.buildings[activeBuilding].rightGirtType != 'open' ? (
          <>
            {state.buildings[activeBuilding].partialWalls.length > 0 && (
              <div className="onTablet">
                <div className="tableGrid6">
                  <h5>Wall</h5>
                  <h5>
                    Start <small>(Left to Right)</small>
                  </h5>
                  <h5>
                    End <small>(Left to Right)</small>
                  </h5>
                  <h5>Height</h5>
                  <h5>Top of Wall</h5>
                  <h5></h5>
                </div>
              </div>
            )}
            {state.buildings[activeBuilding].partialWalls.map(
              (partialWall, partialWallIndex) => (
                <Fragment
                  key={`building-${activeBuilding}-partialWall-${partialWallIndex}`}
                >
                  <div
                    className={`tableGrid6 ${partialWallIndex == activePartialWall ? 'activeRow' : ''}`}
                  >
                    <ReusableSelect
                      name={`building-${activeBuilding}-partialWallWall-${partialWallIndex}`}
                      labelClass="offOnTablet"
                      value={partialWall.wall}
                      onChange={(e) =>
                        handlePartialWallChange(
                          activeBuilding,
                          partialWallIndex,
                          'wall',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activePartialWall !== partialWallIndex) {
                          setActivePartialWall(partialWallIndex);
                        }
                      }}
                      options={walls}
                      label="Wall:"
                      disabled={locked}
                    />
                    <FeetInchesInput
                      name={`building-${activeBuilding}-partialWallStart-${partialWallIndex}`}
                      label={
                        <>
                          <span>
                            Start: <small>(Left to Right)</small>
                          </span>
                        </>
                      }
                      labelClass="offOnTablet"
                      value={partialWall.start}
                      allowBlankValue={true}
                      allowZero={true}
                      onChange={(e) =>
                        handlePartialWallChange(
                          activeBuilding,
                          partialWallIndex,
                          'start',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activePartialWall !== partialWallIndex) {
                          setActivePartialWall(partialWallIndex);
                        }
                      }}
                      disabled={locked}
                    />
                    <FeetInchesInput
                      name={`building-${activeBuilding}-partialWallEnd-${partialWallIndex}`}
                      label={
                        <>
                          <span>
                            End: <small>(Left to Right)</small>
                          </span>
                        </>
                      }
                      labelClass="offOnTablet"
                      value={partialWall.end}
                      allowBlankValue={true}
                      onChange={(e) =>
                        handlePartialWallChange(
                          activeBuilding,
                          partialWallIndex,
                          'end',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activePartialWall !== partialWallIndex) {
                          setActivePartialWall(partialWallIndex);
                        }
                      }}
                      disabled={locked}
                    />
                    <FeetInchesInput
                      name={`building-${activeBuilding}-partialWallHeight-${partialWallIndex}`}
                      label="Height:"
                      labelClass="offOnTablet"
                      value={partialWall.height}
                      allowBlankValue={true}
                      onChange={(e) =>
                        handlePartialWallChange(
                          activeBuilding,
                          partialWallIndex,
                          'height',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activePartialWall !== partialWallIndex) {
                          setActivePartialWall(partialWallIndex);
                        }
                      }}
                      disabled={locked}
                    />
                    <ReusableSelect
                      name={`building-${activeBuilding}-partialWallTopWall-${partialWallIndex}`}
                      labelClass="offOnTablet"
                      value={partialWall.topOfWall}
                      onChange={(e) =>
                        handlePartialWallChange(
                          activeBuilding,
                          partialWallIndex,
                          'topOfWall',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activePartialWall !== partialWallIndex) {
                          setActivePartialWall(partialWallIndex);
                        }
                      }}
                      options={topOfWall}
                      label="Top of Wall:"
                      disabled={locked}
                    />
                    <button
                      type="button"
                      className="icon reject deleteRow"
                      onClick={() =>
                        handleRemovePartialWall(
                          activeBuilding,
                          partialWallIndex
                        )
                      }
                      disabled={locked}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  {partialWallIndex + 1 <
                    state.buildings[activeBuilding].partialWalls.length && (
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
                    onClick={() => handleAddPartialWall(activeBuilding)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <h4 className="openWallNote">
            No Partial Walls Available
            <br />
            All Walls Are Open
          </h4>
        )}
      </section>

      {/* Wall Skirt Options */}
      <section className="card">
        <header>
          <h3>Wall Skirts</h3>
        </header>
        {state.buildings[activeBuilding].frontGirtType != 'open' ||
        state.buildings[activeBuilding].backGirtType != 'open' ||
        state.buildings[activeBuilding].leftGirtType != 'open' ||
        state.buildings[activeBuilding].rightGirtType != 'open' ? (
          <>
            {state.buildings[activeBuilding].wallSkirts.length > 0 && (
              <div className="onTablet">
                <div className="tableGrid6">
                  <h5>Wall</h5>
                  <h5>Start Bay</h5>
                  <h5>End Bay</h5>
                  <h5>Open Below</h5>
                  <h5>Column Option</h5>
                  <h5></h5>
                </div>
              </div>
            )}
            {state.buildings[activeBuilding].wallSkirts.map(
              (wallSkirt, wallSkirtIndex) => (
                <Fragment
                  key={`building-${activeBuilding}-wallSkirt-${wallSkirtIndex}`}
                >
                  <div
                    className={`tableGrid6 ${wallSkirtIndex == activeWallSkirt ? 'activeRow' : ''}`}
                  >
                    <ReusableSelect
                      name={`building-${activeBuilding}-wallSkirtWall-${wallSkirtIndex}`}
                      labelClass="offOnTablet"
                      value={wallSkirt.wall}
                      onChange={(e) =>
                        handleWallSkirtChange(
                          activeBuilding,
                          wallSkirtIndex,
                          'wall',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activeWallSkirt !== wallSkirtIndex) {
                          setActiveWallSkirt(wallSkirtIndex);
                        }
                      }}
                      options={walls}
                      label="Wall:"
                      disabled={locked}
                    />
                    <ReusableInteger
                      name={`building-${activeBuilding}-wallSkirtStartBay-${wallSkirtIndex}`}
                      value={wallSkirt.startBay}
                      min={1}
                      negative={false}
                      allowBlankValue={true}
                      label="Start Bay:"
                      labelClass="offOnTablet"
                      onChange={(e) =>
                        handleWallSkirtChange(
                          activeBuilding,
                          wallSkirtIndex,
                          'startBay',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activeWallSkirt !== wallSkirtIndex) {
                          setActiveWallSkirt(wallSkirtIndex);
                        }
                      }}
                      placeholder="Bay#"
                      disabled={locked}
                    />
                    <ReusableInteger
                      name={`building-${activeBuilding}-wallSkirtEndBay-${wallSkirtIndex}`}
                      value={wallSkirt.endBay}
                      negative={false}
                      allowBlankValue={true}
                      label="End Bay:"
                      labelClass="offOnTablet"
                      onChange={(e) =>
                        handleWallSkirtChange(
                          activeBuilding,
                          wallSkirtIndex,
                          'endBay',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activeWallSkirt !== wallSkirtIndex) {
                          setActiveWallSkirt(wallSkirtIndex);
                        }
                      }}
                      placeholder="Bay#"
                      disabled={locked}
                    />
                    <FeetInchesInput
                      name={`building-${activeBuilding}-wallSkirtHeight-${wallSkirtIndex}`}
                      label="Open Below:"
                      labelClass="offOnTablet"
                      value={wallSkirt.height}
                      allowBlankValue={true}
                      onChange={(e) =>
                        handleWallSkirtChange(
                          activeBuilding,
                          wallSkirtIndex,
                          'height',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activeWallSkirt !== wallSkirtIndex) {
                          setActiveWallSkirt(wallSkirtIndex);
                        }
                      }}
                      disabled={locked}
                    />
                    <div className="checkboxGroup">
                      <div className="checkRow">
                        <input
                          type="checkbox"
                          id={`building-${activeBuilding}-wallSkirtCutColumns-${wallSkirtIndex}`}
                          name={`building-${activeBuilding}-wallSkirtCutColumns-${wallSkirtIndex}`}
                          checked={wallSkirt.cutColumns}
                          onChange={(e) =>
                            handleWallSkirtChange(
                              activeBuilding,
                              wallSkirtIndex,
                              'cutColumns',
                              e.target.checked
                            )
                          }
                          disabled={locked}
                        />
                        <label
                          htmlFor={`building-${activeBuilding}-wallSkirtCutColumns-${wallSkirtIndex}`}
                        >
                          Cut Columns
                        </label>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="icon reject deleteRow"
                      onClick={() =>
                        handleRemoveWallSkirt(activeBuilding, wallSkirtIndex)
                      }
                      disabled={locked}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  {wallSkirtIndex + 1 <
                    state.buildings[activeBuilding].wallSkirts.length && (
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
                    onClick={() => handleAddWallSkirt(activeBuilding)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <h4 className="openWallNote">
            No Wall Skirts Available
            <br />
            All Walls Are Open
          </h4>
        )}
      </section>

      {/* Canopy Options */}
      <section className="card">
        <header>
          <h3>Canopies</h3>
        </header>
        {state.buildings[activeBuilding].canopies.length > 0 && (
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
        {state.buildings[activeBuilding].canopies.map((canopy, canopyIndex) => (
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
                disabled={locked}
              />
              <FeetInchesInput
                name={`building-${activeBuilding}-canopyWidth-${canopyIndex}`}
                label="Width:"
                labelClass="offOnDesktop"
                value={canopy.width}
                allowBlankValue={true}
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
                disabled={locked}
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
                disabled={locked}
              />
              <ReusableInteger
                name={`building-${activeBuilding}-canopyStartBay-${canopyIndex}`}
                value={canopy.startBay}
                min={1}
                negative={false}
                allowBlankValue={true}
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
                disabled={locked}
              />
              <ReusableInteger
                name={`building-${activeBuilding}-canopyEndBay-${canopyIndex}`}
                value={canopy.endBay}
                negative={false}
                allowBlankValue={true}
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
                disabled={locked}
              />
              <FeetInchesInput
                name={`building-${activeBuilding}-canopyElevation-${canopyIndex}`}
                label="Elevation:"
                labelClass="offOnDesktop"
                value={canopy.elevation}
                allowBlankValue={true}
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
                disabled={locked}
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
                    disabled={locked}
                  />
                  <label
                    htmlFor={`building-${activeBuilding}-canopyAddColumns-${canopyIndex}`}
                  >
                    Add Columns
                  </label>
                </div>
              </div>
              <button
                type="button"
                className="icon reject deleteRow"
                onClick={() => handleRemoveCanopy(activeBuilding, canopyIndex)}
                disabled={locked}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            <div className="divider offOnDesktop"></div>
          </Fragment>
        ))}

        {state.buildings[activeBuilding].canopies.length > 0 && (
          <>
            <div className="divider onDesktop"></div>
            <div className="grid2 alignTop">
              <ReusablePanel
                name="canopyRoof"
                label="Roof"
                bldg={activeBuilding}
                idx={activeCanopy}
                value={state.buildings[activeBuilding].canopies[activeCanopy]}
                onChange={(e, keyString) =>
                  handleCanopyChange(
                    activeBuilding,
                    activeCanopy,
                    keyString,
                    e.target.value
                  )
                }
                colorClicked={handleColorClick}
                disabled={locked}
              />
              <div className="divider offOnLaptop"></div>
              <ReusablePanel
                name="canopySoffit"
                label="Soffit"
                bldg={activeBuilding}
                idx={activeCanopy}
                value={state.buildings[activeBuilding].canopies[activeCanopy]}
                onChange={(e, keyString) =>
                  handleCanopyChange(
                    activeBuilding,
                    activeCanopy,
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
                onClick={() => handleAddCanopy(activeBuilding)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </>
        )}
      </section>

      {/* Facias */}
      {/* <section className="card">
        <header>
          <h3>Facia</h3>
        </header>
      </section> */}

      {/* Parapet Walls */}
      {/* <section className="card">
        <header>
          <h3>Parapet Walls</h3>
        </header>
      </section> */}

      {/* Bumpouts */}
      {/* <section className="card">
        <header>
          <h3>Bumpouts</h3>
        </header>
      </section> */}

      {/* Relite Options */}
      <section className="card">
        <header>
          <h3>Wall Relites</h3>
        </header>
        {state.buildings[activeBuilding].frontGirtType != 'open' ||
        state.buildings[activeBuilding].backGirtType != 'open' ||
        state.buildings[activeBuilding].leftGirtType != 'open' ||
        state.buildings[activeBuilding].rightGirtType != 'open' ? (
          <>
            {state.buildings[activeBuilding].wallRelites?.length > 0 && (
              <div className="onDesktop">
                <div className="tableGrid8">
                  <h5>Wall</h5>
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
            {state.buildings[activeBuilding].wallRelites?.map(
              (wallRelite, wallReliteIndex) => (
                <Fragment
                  key={`building-${activeBuilding}-wallRelite-${wallReliteIndex}`}
                >
                  <div
                    className={`tableGrid8 ${wallReliteIndex == activeWallRelite ? 'activeRow' : ''}`}
                  >
                    <ReusableSelect
                      name={`building-${activeBuilding}-wallReliteWall-${wallReliteIndex}`}
                      label="Wall:"
                      labelClass="offOnDesktop"
                      value={wallRelite.wall}
                      onChange={(e) =>
                        handleWallReliteChange(
                          activeBuilding,
                          wallReliteIndex,
                          'wall',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activeWallRelite !== wallReliteIndex) {
                          setActiveWallRelite(wallReliteIndex);
                        }
                      }}
                      options={walls}
                      disabled={locked}
                    />
                    <ReusableSelect
                      name={`building-${activeBuilding}-wallReliteSize-${wallReliteIndex}`}
                      label="Size:"
                      labelClass="offOnDesktop"
                      value={wallRelite.size}
                      onChange={(e) =>
                        handleWallReliteChange(
                          activeBuilding,
                          wallReliteIndex,
                          'size',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activeWallRelite !== wallReliteIndex) {
                          setActiveWallRelite(wallReliteIndex);
                        }
                      }}
                      options={polycarbWallSize}
                      disabled={locked}
                    />
                    <ReusableSelect
                      name={`building-${activeBuilding}-wallReliteColor-${wallReliteIndex}`}
                      label="Color:"
                      labelClass="offOnDesktop"
                      value={wallRelite.color}
                      onChange={(e) =>
                        handleWallReliteChange(
                          activeBuilding,
                          wallReliteIndex,
                          'color',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activeWallRelite !== wallReliteIndex) {
                          setActiveWallRelite(wallReliteIndex);
                        }
                      }}
                      options={polycarbWallColor}
                      disabled={locked}
                    />
                    <ReusableInteger
                      name={`building-${activeBuilding}-wallReliteQty-${wallReliteIndex}`}
                      value={wallRelite.qty}
                      min={1}
                      max={
                        wallRelite.wall == 'front' || wallRelite.wall == 'back'
                          ? Math.ceil(
                              state.buildings[activeBuilding].length / 3
                            )
                          : Math.ceil(state.buildings[activeBuilding].width / 3)
                      }
                      negative={false}
                      allowBlankValue={true}
                      label="Qty:"
                      labelClass="offOnDesktop"
                      onChange={(e) =>
                        handleWallReliteChange(
                          activeBuilding,
                          wallReliteIndex,
                          'qty',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activeWallRelite !== wallReliteIndex) {
                          setActiveWallRelite(wallReliteIndex);
                        }
                      }}
                      placeholder="Qty"
                      disabled={locked}
                    />
                    <ReusableLocation
                      name={`building-${activeBuilding}-wallReliteLocation-${wallReliteIndex}`}
                      label="Locations:"
                      labelClass="offOnDesktop"
                      value={wallRelite.location}
                      onChange={(name, value) =>
                        handleWallReliteChange(
                          activeBuilding,
                          wallReliteIndex,
                          'location',
                          value
                        )
                      }
                      onFocus={() => {
                        if (activeWallRelite !== wallReliteIndex) {
                          setActiveWallRelite(wallReliteIndex);
                        }
                      }}
                      compareLabel={
                        wallRelite.wall == 'front' || wallRelite.wall == 'back'
                          ? 'building length'
                          : 'building width'
                      }
                      compareValue={
                        wallRelite.wall == 'front' || wallRelite.wall == 'back'
                          ? state.buildings[activeBuilding].length
                          : state.buildings[activeBuilding].width
                      }
                      placeholder=""
                      disabled={locked}
                    />
                    <FeetInchesInput
                      name={`building-${activeBuilding}-wallReliteOffset-${wallReliteIndex}`}
                      label="Offset:"
                      labelClass="offOnDesktop"
                      value={wallRelite.offset}
                      allowBlankValue={true}
                      onChange={(e) =>
                        handleWallReliteChange(
                          activeBuilding,
                          wallReliteIndex,
                          'offset',
                          e.target.value
                        )
                      }
                      onFocus={() => {
                        if (activeWallRelite !== wallReliteIndex) {
                          setActiveWallRelite(wallReliteIndex);
                        }
                      }}
                      disabled={locked}
                    />
                    <div className="checkboxGroup">
                      <div className="checkRow">
                        <input
                          type="checkbox"
                          id={`building-${activeBuilding}-wallReliteCutPanels-${wallReliteIndex}`}
                          name={`building-${activeBuilding}-wallReliteCutPanels-${wallReliteIndex}`}
                          checked={
                            (wallRelite.wall == 'front' ||
                              wallRelite.wall == 'back') &&
                            wallRelite.cutPanels
                          }
                          onChange={(e) =>
                            handleWallReliteChange(
                              activeBuilding,
                              wallReliteIndex,
                              'cutPanels',
                              e.target.checked
                            )
                          }
                          disabled={
                            (wallRelite.wall != 'front' &&
                              wallRelite.wall != 'back') ||
                            locked
                              ? 'disabled'
                              : ''
                          }
                        />
                        <label
                          htmlFor={`building-${activeBuilding}-wallReliteCutPanels-${wallReliteIndex}`}
                        >
                          Cut Panels
                        </label>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="icon reject deleteRow"
                      onClick={() =>
                        handleRemoveWallRelite(activeBuilding, wallReliteIndex)
                      }
                      disabled={locked}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  {wallReliteIndex + 1 <
                    state.buildings[activeBuilding].wallRelites.length && (
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
                    onClick={() => handleAddWallRelite(activeBuilding)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <h4 className="openWallNote">
            No Wall Relites Available
            <br />
            All Walls Are Open
          </h4>
        )}
      </section>

      {/* <div className="grid2">
        <section className="card">
          <header>
            <h3>Relite Temp</h3>
          </header>
          <div className="reliteGroup">
            <h5>Sidewall Relite Qty Calculator</h5>
            <div className="grid3">
              <div className="center small">
                Continuous Panels: &nbsp;
                <strong>
                  {Math.ceil(values.buildings[activeBuilding].length / 3)}
                </strong>
              </div>
              <div className="center small">
                Every Other Panel: &nbsp;
                <strong>
                  {Math.floor(
                    Math.floor(values.buildings[activeBuilding].length / 3) / 2
                  )}
                </strong>
              </div>
              <div className="center small">
                Every Third Panel: &nbsp;
                <strong>
                  {Math.floor(
                    Math.floor(values.buildings[activeBuilding].length / 3) / 3
                  )}
                </strong>
              </div>
            </div>
          </div>
          <div className="reliteGroup">
            <h5>Endwall Relite Qty Calculator</h5>
            <div className="grid3">
              <div className="center small">
                Continuous Panels: &nbsp;
                <strong>
                  {Math.ceil(values.buildings[activeBuilding].width / 3)}
                </strong>
              </div>
              <div className="center small">
                Every Other Panel: &nbsp;
                <strong>
                  {Math.floor(
                    Math.floor(values.buildings[activeBuilding].width / 3) / 2
                  )}
                </strong>
              </div>
              <div className="center small">
                Every Third Panel: &nbsp;
                <strong>
                  {Math.floor(
                    Math.floor(values.buildings[activeBuilding].width / 3) / 3
                  )}
                </strong>
              </div>
            </div>
          </div>
          <div className="reliteGroup">
            <h5>Roof Relite Qty Calculator</h5>
            <div className="grid3">
              <div className="center small">(Every Other Panel Max)</div>
              <div className="center small">
                Every Other Panel: &nbsp;
                <strong>
                  {Math.floor(
                    Math.floor(values.buildings[activeBuilding].length / 3) / 2
                  )}
                </strong>
              </div>
              <div className="center small">
                Every Third Panel: &nbsp;
                <strong>
                  {Math.floor(
                    Math.floor(values.buildings[activeBuilding].length / 3) / 3
                  )}
                </strong>
              </div>
            </div>
          </div>
        </section>
      </div> */}

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

export default BuildingWallOptions;
