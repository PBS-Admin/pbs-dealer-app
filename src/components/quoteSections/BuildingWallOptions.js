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

const BuildingWallOptions = ({
  values,
  activeBuilding,
  handleNestedChange,
  handleWallLinerPanelChange,
  handleWainscotChange,
  handlePartialWallChange,
  handleWallSkirtChange,
  handleCanopyChange,
  handleWallReliteChange,
  colorClicked,
  setValues,
  isDesktop,
  locked,
}) => {
  const [activeWallLinerPanel, setActiveWallLinerPanel] = useState(0);
  const [activeWainscot, setActiveWainscot] = useState(0);
  const [activePartialWall, setActivePartialWall] = useState(0);
  const [activeWallSkirt, setActiveWallSkirt] = useState(0);
  const [activeCanopy, setActiveCanopy] = useState(0);
  const [activeWallRelite, setActiveWallRelite] = useState(0);

  const addWallLinerPanel = (buildingIndex) => {
    setValues((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, index) =>
        index === buildingIndex
          ? {
              ...building,
              wallLinerPanels: [
                ...building.wallLinerPanels,
                {
                  wall: 'front',
                  start: '',
                  end: '',
                  height: '',
                  wallLinerPanelType: 'pbr',
                  wallLinerPanelGauge: '26',
                  wallLinerPanelFinish: 'painted',
                  wallLinerPanelColor: 'NC',
                  wallLinerTrim: {
                    trim: { vendor: 'PBS', gauge: 26, color: 'NC' },
                  },
                },
              ],
            }
          : building
      ),
    }));
  };

  const addWainscot = (buildingIndex) => {
    setValues((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, index) =>
        index === buildingIndex
          ? {
              ...building,
              wainscots: [
                ...building.wainscots,
                {
                  wall: 'front',
                  start: '',
                  end: '',
                  height: '',
                  panelOption: 'break',
                  wainscotPanelType: 'pbr',
                  wainscotPanelGauge: '26',
                  wainscotPanelFinish: 'painted',
                  wainscotPanelColor: 'NC',
                  wainscotTrim: {
                    base: { vendor: 'PBS', gauge: 26, color: 'NC' },
                    leftEnd: { vendor: 'PBS', gauge: 26, color: 'NC' },
                    rightEnd: { vendor: 'PBS', gauge: 26, color: 'NC' },
                    top: { vendor: 'PBS', gauge: 26, color: 'NC' },
                    jamb: { vendor: 'PBS', gauge: 26, color: 'NC' },
                  },
                },
              ],
            }
          : building
      ),
    }));
  };

  const addPartialWall = (buildingIndex) => {
    setValues((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, index) =>
        index === buildingIndex
          ? {
              ...building,
              partialWalls: [
                ...building.partialWalls,
                {
                  wall: 'front',
                  start: '',
                  end: '',
                  height: '',
                  topOfWall: 'B',
                },
              ],
            }
          : building
      ),
    }));
  };

  const addWallSkirt = (buildingIndex) => {
    setValues((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, index) =>
        index === buildingIndex
          ? {
              ...building,
              wallSkirts: [
                ...building.wallSkirts,
                {
                  wall: 'front',
                  startBay: '',
                  endBay: '',
                  height: '',
                  cutColumns: false,
                },
              ],
            }
          : building
      ),
    }));
  };

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
                  roofPanelColor: 'NC',
                  soffitPanelType: 'pbr',
                  soffitPanelGauge: '26',
                  soffitPanelFinish: 'painted',
                  soffitPanelColor: 'NC',
                },
              ],
            }
          : building
      ),
    }));
  };

  const addWallRelite = (buildingIndex) => {
    setValues((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, index) =>
        index === buildingIndex
          ? {
              ...building,
              wallRelites: [
                ...building.wallRelites,
                {
                  wall: 'front',
                  size: '3',
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

  const removeWallLinerPanel = (buildingIndex, wallLinerPanelIndex) => {
    setValues((prev) => {
      const newBuildings = prev.buildings.map((building, bIndex) =>
        bIndex === buildingIndex
          ? {
              ...building,
              wallLinerPanels: building.wallLinerPanels.filter(
                (_, lpIndex) => lpIndex !== wallLinerPanelIndex
              ),
            }
          : building
      );

      const remainingWallLinerPanels =
        newBuildings[buildingIndex].wallLinerPanels.length;
      if (
        wallLinerPanelIndex <= activeWallLinerPanel &&
        activeWallLinerPanel > 0
      ) {
        setActiveWallLinerPanel(
          Math.min(activeWallLinerPanel - 1, remainingWallLinerPanels - 1)
        );
      }

      return { ...prev, buildings: newBuildings };
    });
  };

  const removeWainscot = (buildingIndex, wainscotIndex) => {
    setValues((prev) => {
      const newBuildings = prev.buildings.map((building, bIndex) =>
        bIndex === buildingIndex
          ? {
              ...building,
              wainscots: building.wainscots.filter(
                (_, wIndex) => wIndex !== wainscotIndex
              ),
            }
          : building
      );

      const remainingWainscots = newBuildings[buildingIndex].wainscots.length;
      if (wainscotIndex <= activeWainscot && activeWainscot > 0) {
        setActiveWainscot(Math.min(activeWainscot - 1, remainingWainscots - 1));
      }

      return { ...prev, buildings: newBuildings };
    });
  };

  const removePartialWall = (buildingIndex, partialWallIndex) => {
    setValues((prev) => {
      const newBuildings = prev.buildings.map((building, bIndex) =>
        bIndex === buildingIndex
          ? {
              ...building,
              partialWalls: building.partialWalls.filter(
                (_, pwIndex) => pwIndex !== partialWallIndex
              ),
            }
          : building
      );

      const remainingPartialWalls =
        newBuildings[buildingIndex].partialWalls.length;
      if (partialWallIndex <= activePartialWall && activePartialWall > 0) {
        setActivePartialWall(
          Math.min(activePartialWall - 1, remainingPartialWalls - 1)
        );
      }

      return { ...prev, buildings: newBuildings };
    });
  };

  const removeWallSkirt = (buildingIndex, wallSkirtIndex) => {
    setValues((prev) => {
      const newBuildings = prev.buildings.map((building, bIndex) =>
        bIndex === buildingIndex
          ? {
              ...building,
              wallSkirts: building.wallSkirts.filter(
                (_, wsIndex) => wsIndex !== wallSkirtIndex
              ),
            }
          : building
      );

      const remainingWallSkirts = newBuildings[buildingIndex].wallSkirts.length;
      if (wallSkirtIndex <= activeWallSkirt && activeWallSkirt > 0) {
        setActiveWallSkirt(
          Math.min(activeWallSkirt - 1, remainingWallSkirts - 1)
        );
      }

      return { ...prev, buildings: newBuildings };
    });
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

  const removeWallRelites = (buildingIndex, wallReliteIndex) => {
    setValues((prev) => {
      const newBuildings = prev.buildings.map((building, bIndex) =>
        bIndex === buildingIndex
          ? {
              ...building,
              wallRelites: building.wallRelites.filter(
                (_, wsIndex) => wsIndex !== wallReliteIndex
              ),
            }
          : building
      );

      const remainingWallRelites =
        newBuildings[buildingIndex].wallRelites.length;
      if (wallReliteIndex <= activeWallRelite && activeWallRelite > 0) {
        setActiveWallRelite(
          Math.min(activeWallRelite - 1, remainingWallRelites - 1)
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
              disabled={
                !values.buildings[activeBuilding].allWallsSame || locked
              }
              label="Wall Insulation:"
            />
            <div className="checkboxGroup">
              <div className="checkRow">
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
                  checked={values.buildings[activeBuilding].allWallsSame}
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
            name="Wall"
            valueKey="wall"
            label="Wall"
            bldg={activeBuilding}
            value={values.buildings[activeBuilding]}
            onChange={(e, keyString) =>
              handleNestedChange(activeBuilding, keyString, e.target.value)
            }
            colorClicked={colorClicked}
            disabled={!values.buildings[activeBuilding].allWallsSame || locked}
          />
        </div>

        {!values.buildings[activeBuilding].allWallsSame && (
          <>
            <div className="divider"></div>

            <div className="grid4 alignTop">
              <div
                className={
                  values.buildings[activeBuilding].leftFrame == 'insetRF' ||
                  values.buildings[activeBuilding].rightFrame == 'insetRF'
                    ? 'span2'
                    : 'grid'
                }
              >
                <ReusablePanel
                  name="FrontWall"
                  valueKey="frontWall"
                  label="Front Sidewall"
                  bldg={activeBuilding}
                  value={values.buildings[activeBuilding]}
                  onChange={(e, keyString) =>
                    handleNestedChange(
                      activeBuilding,
                      keyString,
                      e.target.value
                    )
                  }
                  colorClicked={colorClicked}
                  disabled={locked}
                />
                <ReusableSelect
                  name={`buildingFrontWallInsulation-${activeBuilding}`}
                  value={values.buildings[activeBuilding].wallFrontInsulation}
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
                  values.buildings[activeBuilding].leftFrame == 'insetRF' ||
                  values.buildings[activeBuilding].rightFrame == 'insetRF'
                    ? 'span2'
                    : 'grid'
                }
              >
                <ReusablePanel
                  name="BackWall"
                  valueKey="backWall"
                  label="Back Sidewall"
                  bldg={activeBuilding}
                  value={values.buildings[activeBuilding]}
                  onChange={(e, keyString) =>
                    handleNestedChange(
                      activeBuilding,
                      keyString,
                      e.target.value
                    )
                  }
                  colorClicked={colorClicked}
                  disabled={locked}
                />
                <ReusableSelect
                  name={`buildingBackWallInsulation-${activeBuilding}`}
                  value={values.buildings[activeBuilding].wallBackInsulation}
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
                  values.buildings[activeBuilding].leftFrame == 'insetRF' ||
                  values.buildings[activeBuilding].rightFrame == 'insetRF'
                    ? 'divider span4'
                    : 'divider offOnDesktop span2'
                }
              ></div>
              {values.buildings[activeBuilding].leftFrame == 'insetRF' && (
                <>
                  <div className="grid">
                    <ReusablePanel
                      name="OuterLeftWall"
                      valueKey="outerLeftWall"
                      label="Outer Left Endwall"
                      bldg={activeBuilding}
                      value={values.buildings[activeBuilding]}
                      onChange={(e, keyString) =>
                        handleNestedChange(
                          activeBuilding,
                          keyString,
                          e.target.value
                        )
                      }
                      colorClicked={colorClicked}
                      disabled={locked}
                    />
                    <ReusableSelect
                      name={`buildingOuterLeftWallInsulation-${activeBuilding}`}
                      value={
                        values.buildings[activeBuilding].wallOuterLeftInsulation
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
              {values.buildings[activeBuilding].leftFrame != 'insetRF' &&
                values.buildings[activeBuilding].rightFrame == 'insetRF' && (
                  <div className="onPhone"></div>
                )}
              <div className="grid">
                <ReusablePanel
                  name="LeftWall"
                  valueKey="leftWall"
                  label="Left Endwall"
                  bldg={activeBuilding}
                  value={values.buildings[activeBuilding]}
                  onChange={(e, keyString) =>
                    handleNestedChange(
                      activeBuilding,
                      keyString,
                      e.target.value
                    )
                  }
                  colorClicked={colorClicked}
                  disabled={locked}
                />
                <ReusableSelect
                  name={`buildingLeftWallInsulation-${activeBuilding}`}
                  value={values.buildings[activeBuilding].wallLeftInsulation}
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
              {values.buildings[activeBuilding].leftFrame == 'insetRF' ||
              values.buildings[activeBuilding].rightFrame == 'insetRF' ? (
                <div className="divider offOnDesktop span2"></div>
              ) : (
                <div className="divider offOnTablet"></div>
              )}
              <div className="grid">
                <ReusablePanel
                  name="RightWall"
                  valueKey="rightWall"
                  label="Right Endwall"
                  bldg={activeBuilding}
                  value={values.buildings[activeBuilding]}
                  onChange={(e, keyString) =>
                    handleNestedChange(
                      activeBuilding,
                      keyString,
                      e.target.value
                    )
                  }
                  colorClicked={colorClicked}
                  disabled={locked}
                />
                <ReusableSelect
                  name={`buildingRightWallInsulation-${activeBuilding}`}
                  value={values.buildings[activeBuilding].wallRightInsulation}
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
              {values.buildings[activeBuilding].rightFrame == 'insetRF' && (
                <>
                  <div className="divider offOnTablet"></div>
                  <div className="grid">
                    <ReusablePanel
                      name="OuterRightWall"
                      valueKey="outerRightWall"
                      label="Outer Right Endwall"
                      bldg={activeBuilding}
                      value={values.buildings[activeBuilding]}
                      onChange={(e, keyString) =>
                        handleNestedChange(
                          activeBuilding,
                          keyString,
                          e.target.value
                        )
                      }
                      colorClicked={colorClicked}
                      disabled={locked}
                    />
                    <ReusableSelect
                      name={`buildingOuterRightWallInsulation-${activeBuilding}`}
                      value={
                        values.buildings[activeBuilding]
                          .wallOuterRightInsulation
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
        {values.buildings[activeBuilding].frontGirtType != 'open' ||
        values.buildings[activeBuilding].backGirtType != 'open' ||
        values.buildings[activeBuilding].leftGirtType != 'open' ||
        values.buildings[activeBuilding].rightGirtType != 'open' ? (
          <>
            {values.buildings[activeBuilding].wallLinerPanels?.length > 0 && (
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
            {values.buildings[activeBuilding].wallLinerPanels?.map(
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
                        removeWallLinerPanel(
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

            {values.buildings[activeBuilding].wallLinerPanels?.length > 0 && (
              <>
                <div className="divider onDesktop"></div>
                <div className="grid2">
                  <div className="onLaptop"></div>
                  <ReusablePanel
                    name="WallLiner"
                    valueKey="wallLiner"
                    label="Liner"
                    bldg={activeBuilding}
                    idx={activeWallLinerPanel}
                    value={
                      values.buildings[activeBuilding].wallLinerPanels[
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
                    colorClicked={colorClicked}
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
                    onClick={() => addWallLinerPanel(activeBuilding)}
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
        {values.buildings[activeBuilding].frontGirtType != 'open' ||
        values.buildings[activeBuilding].backGirtType != 'open' ||
        values.buildings[activeBuilding].leftGirtType != 'open' ||
        values.buildings[activeBuilding].rightGirtType != 'open' ? (
          <>
            {values.buildings[activeBuilding].wainscots.length > 0 && (
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
            {values.buildings[activeBuilding].wainscots.map(
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
                        removeWainscot(activeBuilding, wainscotIndex)
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

            {values.buildings[activeBuilding].wainscots.length > 0 && (
              <>
                <div className="divider onDesktop"></div>
                <div className="grid2">
                  <div className="onLaptop"></div>
                  <ReusablePanel
                    name="Wainscot"
                    valueKey="wainscot"
                    label="Wainscot"
                    bldg={activeBuilding}
                    idx={activeWainscot}
                    value={
                      values.buildings[activeBuilding].wainscots[activeWainscot]
                    }
                    onChange={(e, keyString) =>
                      handleWainscotChange(
                        activeBuilding,
                        activeWainscot,
                        keyString,
                        e.target.value
                      )
                    }
                    colorClicked={colorClicked}
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
                    onClick={() => addWainscot(activeBuilding)}
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
        {values.buildings[activeBuilding].frontGirtType != 'open' ||
        values.buildings[activeBuilding].backGirtType != 'open' ||
        values.buildings[activeBuilding].leftGirtType != 'open' ||
        values.buildings[activeBuilding].rightGirtType != 'open' ? (
          <>
            {values.buildings[activeBuilding].partialWalls.length > 0 && (
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
            {values.buildings[activeBuilding].partialWalls.map(
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
                        removePartialWall(activeBuilding, partialWallIndex)
                      }
                      disabled={locked}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  {partialWallIndex + 1 <
                    values.buildings[activeBuilding].partialWalls.length && (
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
                    onClick={() => addPartialWall(activeBuilding)}
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
        {values.buildings[activeBuilding].frontGirtType != 'open' ||
        values.buildings[activeBuilding].backGirtType != 'open' ||
        values.buildings[activeBuilding].leftGirtType != 'open' ||
        values.buildings[activeBuilding].rightGirtType != 'open' ? (
          <>
            {values.buildings[activeBuilding].wallSkirts.length > 0 && (
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
            {values.buildings[activeBuilding].wallSkirts.map(
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
                        removeWallSkirt(activeBuilding, wallSkirtIndex)
                      }
                      disabled={locked}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  {wallSkirtIndex + 1 <
                    values.buildings[activeBuilding].wallSkirts.length && (
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
                    onClick={() => addWallSkirt(activeBuilding)}
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
                  onClick={() => removeCanopy(activeBuilding, canopyIndex)}
                  disabled={locked}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              <div className="divider offOnDesktop"></div>
            </Fragment>
          )
        )}

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
                colorClicked={colorClicked}
                disabled={locked}
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
                colorClicked={colorClicked}
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
                onClick={() => addCanopy(activeBuilding)}
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
        {values.buildings[activeBuilding].frontGirtType != 'open' ||
        values.buildings[activeBuilding].backGirtType != 'open' ||
        values.buildings[activeBuilding].leftGirtType != 'open' ||
        values.buildings[activeBuilding].rightGirtType != 'open' ? (
          <>
            {values.buildings[activeBuilding].wallRelites?.length > 0 && (
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
            {values.buildings[activeBuilding].wallRelites?.map(
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
                              values.buildings[activeBuilding].length / 3
                            )
                          : Math.ceil(
                              values.buildings[activeBuilding].width / 3
                            )
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
                          ? values.buildings[activeBuilding].length
                          : values.buildings[activeBuilding].width
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
                        removeWallRelites(activeBuilding, wallReliteIndex)
                      }
                      disabled={locked}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  {wallReliteIndex + 1 <
                    values.buildings[activeBuilding].wallRelites.length && (
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
                    onClick={() => addWallRelite(activeBuilding)}
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
    </>
  );
};

export default BuildingWallOptions;
