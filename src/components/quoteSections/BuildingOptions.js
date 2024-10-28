import { React, useState, Fragment } from 'react';
import ReusableSelect from '../Inputs/ReusableSelect';
import ReusablePanel from '../Inputs/ReusablePanel';
import ReusableInteger from '../Inputs/ReusableInteger';
import FeetInchesInput from '../Inputs/FeetInchesInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  walls,
  panelOptions,
  topOfWall,
  polycarbWallSize,
  polycarbRoofSize,
  polycarbWallColor,
  polycarbRoofColor,
} from '../../util/dropdownOptions';

const BuildingOptions = ({
  values,
  activeBuilding,
  handleNestedChange,
  handleLinerPanelChange,
  handleWainscotChange,
  handlePartialWallChange,
  handleWallSkirtChange,
  setValues,
  isDesktop,
}) => {
  const [activeLinerPanel, setActiveLinerPanel] = useState(0);
  const [activeWainscot, setActiveWainscot] = useState(0);
  const [activePartialWall, setActivePartialWall] = useState(0);
  const [activeWallSkirt, setActiveWallSkirt] = useState(0);

  const addLinerPanel = (buildingIndex) => {
    setValues((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, index) =>
        index === buildingIndex
          ? {
              ...building,
              linerPanels: [
                ...building.linerPanels,
                {
                  wall: 'front',
                  start: '',
                  end: '',
                  height: '',
                  linerPanelType: 'pbr',
                  linerPanelGauge: '26',
                  linerPanelFinish: 'painted',
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
                  topOfWall: 'bc',
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

  const removeLinerPanel = (buildingIndex, linerPanelIndex) => {
    setValues((prev) => {
      const newBuildings = prev.buildings.map((building, bIndex) =>
        bIndex === buildingIndex
          ? {
              ...building,
              linerPanels: building.linerPanels.filter(
                (_, lpIndex) => lpIndex !== linerPanelIndex
              ),
            }
          : building
      );

      // Update activePartition if necessary
      const remainingLinerPanels =
        newBuildings[buildingIndex].linerPanels.length;
      if (linerPanelIndex <= activeLinerPanel && activeLinerPanel > 0) {
        setActiveLinerPanel(
          Math.min(activeLinerPanel - 1, remainingLinerPanels - 1)
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

      // Update activePartition if necessary
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

      // Update activePartition if necessary
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

      // Update activePartition if necessary
      const remainingWallSkirts = newBuildings[buildingIndex].wallSkirts.length;
      if (wallSkirtIndex <= activeWallSkirt && activeWallSkirt > 0) {
        setActiveWallSkirt(
          Math.min(activeWallSkirt - 1, remainingWallSkirts - 1)
        );
      }

      return { ...prev, buildings: newBuildings };
    });
  };

  return (
    <>
      {/* Liner Panel Options */}
      <section className="card">
        <header>
          <h3>Liner Panels</h3>
        </header>
        {values.buildings[activeBuilding].linerPanels.length > 0 && (
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
        {values.buildings[activeBuilding].linerPanels.map(
          (linerPanel, linerPanelIndex) => (
            <Fragment
              key={`building-${activeBuilding}-linerPanel-${linerPanelIndex}`}
            >
              <div
                className={`tableGrid5 ${linerPanelIndex == activeLinerPanel ? 'activeRow' : ''}`}
              >
                <ReusableSelect
                  name={`building-${activeBuilding}-linerPanelWall-${linerPanelIndex}`}
                  labelClass="offOnTablet"
                  value={linerPanel.wall}
                  onChange={(e) =>
                    handleLinerPanelChange(
                      activeBuilding,
                      linerPanelIndex,
                      'wall',
                      e.target.value
                    )
                  }
                  onFocus={() => {
                    if (activeLinerPanel !== linerPanelIndex) {
                      setActiveLinerPanel(linerPanelIndex);
                    }
                  }}
                  options={walls}
                  label="Wall:"
                />
                <FeetInchesInput
                  name={`building-${activeBuilding}-linerPanelStart-${linerPanelIndex}`}
                  label={
                    <>
                      <span>
                        Start: <small>(Left to Right)</small>
                      </span>
                    </>
                  }
                  labelClass="offOnTablet"
                  value={linerPanel.start}
                  allowBlankValue={true}
                  allowZero={true}
                  onChange={(name, value) =>
                    handleLinerPanelChange(
                      activeBuilding,
                      linerPanelIndex,
                      'start',
                      value
                    )
                  }
                  onFocus={() => {
                    if (activeLinerPanel !== linerPanelIndex) {
                      setActiveLinerPanel(linerPanelIndex);
                    }
                  }}
                />
                <FeetInchesInput
                  name={`building-${activeBuilding}-linerPanelEnd-${linerPanelIndex}`}
                  label={
                    <>
                      <span>
                        End: <small>(Left to Right)</small>
                      </span>
                    </>
                  }
                  labelClass="offOnTablet"
                  value={linerPanel.end}
                  allowBlankValue={true}
                  onChange={(name, value) =>
                    handleLinerPanelChange(
                      activeBuilding,
                      linerPanelIndex,
                      'end',
                      value
                    )
                  }
                  onFocus={() => {
                    if (activeLinerPanel !== linerPanelIndex) {
                      setActiveLinerPanel(linerPanelIndex);
                    }
                  }}
                />
                <FeetInchesInput
                  name={`building-${activeBuilding}-linerPanelHeight-${linerPanelIndex}`}
                  label="Height:"
                  labelClass="offOnTablet"
                  value={linerPanel.height}
                  allowBlankValue={true}
                  onChange={(name, value) =>
                    handleLinerPanelChange(
                      activeBuilding,
                      linerPanelIndex,
                      'height',
                      value
                    )
                  }
                  onFocus={() => {
                    if (activeLinerPanel !== linerPanelIndex) {
                      setActiveLinerPanel(linerPanelIndex);
                    }
                  }}
                  placeholder="Leave Blank for Full Ht"
                />
                <button
                  type="button"
                  className="icon reject deleteRow"
                  onClick={() =>
                    removeLinerPanel(activeBuilding, linerPanelIndex)
                  }
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              <div className="divider offOnTablet"></div>
            </Fragment>
          )
        )}

        {values.buildings[activeBuilding].linerPanels.length > 0 && (
          <>
            <div className="divider onDesktop"></div>
            <div className="grid2">
              <div className="onLaptop"></div>
              <ReusablePanel
                name="Liner"
                valueKey="liner"
                label="Liner"
                bldg={activeBuilding}
                idx={activeLinerPanel}
                value={
                  values.buildings[activeBuilding].linerPanels[activeLinerPanel]
                }
                onChange={(e, keyString) =>
                  handleLinerPanelChange(
                    activeBuilding,
                    activeLinerPanel,
                    keyString,
                    e.target.value
                  )
                }
              />
            </div>
          </>
        )}

        <div className="divider"></div>
        <div className="buttonFooter">
          <button
            type="button"
            className="addButton"
            onClick={() => addLinerPanel(activeBuilding)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </section>

      {/* Wainscot Options */}
      <section className="card">
        <header>
          <h3>Wainscots</h3>
        </header>
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
                  onChange={(name, value) =>
                    handleWainscotChange(
                      activeBuilding,
                      wainscotIndex,
                      'start',
                      value
                    )
                  }
                  onFocus={() => {
                    if (activeWainscot !== wainscotIndex) {
                      setActiveWainscot(wainscotIndex);
                    }
                  }}
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
                  onChange={(name, value) =>
                    handleWainscotChange(
                      activeBuilding,
                      wainscotIndex,
                      'end',
                      value
                    )
                  }
                  onFocus={() => {
                    if (activeWainscot !== wainscotIndex) {
                      setActiveWainscot(wainscotIndex);
                    }
                  }}
                />
                <FeetInchesInput
                  name={`building-${activeBuilding}-wainscotHeight-${wainscotIndex}`}
                  label="Height:"
                  labelClass="offOnTablet"
                  value={wainscot.height}
                  allowBlankValue={true}
                  onChange={(name, value) =>
                    handleWainscotChange(
                      activeBuilding,
                      wainscotIndex,
                      'height',
                      value
                    )
                  }
                  onFocus={() => {
                    if (activeWainscot !== wainscotIndex) {
                      setActiveWainscot(wainscotIndex);
                    }
                  }}
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
                />
                <button
                  type="button"
                  className="icon reject deleteRow"
                  onClick={() => removeWainscot(activeBuilding, wainscotIndex)}
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
              />
            </div>
          </>
        )}

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
      </section>

      {/* Partial Wall Options */}
      <section className="card">
        <header>
          <h3>Partial Walls</h3>
        </header>
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
                  onChange={(name, value) =>
                    handlePartialWallChange(
                      activeBuilding,
                      partialWallIndex,
                      'start',
                      value
                    )
                  }
                  onFocus={() => {
                    if (activePartialWall !== partialWallIndex) {
                      setActivePartialWall(partialWallIndex);
                    }
                  }}
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
                  onChange={(name, value) =>
                    handlePartialWallChange(
                      activeBuilding,
                      partialWallIndex,
                      'end',
                      value
                    )
                  }
                  onFocus={() => {
                    if (activePartialWall !== partialWallIndex) {
                      setActivePartialWall(partialWallIndex);
                    }
                  }}
                />
                <FeetInchesInput
                  name={`building-${activeBuilding}-partialWallHeight-${partialWallIndex}`}
                  label="Height:"
                  labelClass="offOnTablet"
                  value={partialWall.height}
                  allowBlankValue={true}
                  onChange={(name, value) =>
                    handlePartialWallChange(
                      activeBuilding,
                      partialWallIndex,
                      'height',
                      value
                    )
                  }
                  onFocus={() => {
                    if (activePartialWall !== partialWallIndex) {
                      setActivePartialWall(partialWallIndex);
                    }
                  }}
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
                />
                <button
                  type="button"
                  className="icon reject deleteRow"
                  onClick={() =>
                    removePartialWall(activeBuilding, partialWallIndex)
                  }
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
      </section>

      {/* Wall Skirt Options */}
      <section className="card">
        <header>
          <h3>Wall Skirts</h3>
        </header>
        {values.buildings[activeBuilding].wallSkirts.length > 0 && (
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
                />
                <FeetInchesInput
                  name={`building-${activeBuilding}-wallSkirtStartBay-${wallSkirtIndex}`}
                  label="Start Bay:"
                  labelClass="offOnTablet"
                  value={wallSkirt.startBay}
                  allowBlankValue={true}
                  allowZero={true}
                  onChange={(name, value) =>
                    handleWallSkirtChange(
                      activeBuilding,
                      wallSkirtIndex,
                      'startBay',
                      value
                    )
                  }
                  onFocus={() => {
                    if (activeWallSkirt !== wallSkirtIndex) {
                      setActiveWallSkirt(wallSkirtIndex);
                    }
                  }}
                />
                <FeetInchesInput
                  name={`building-${activeBuilding}-wallSkirtEndBay-${wallSkirtIndex}`}
                  label="End Bay:"
                  labelClass="offOnTablet"
                  value={wallSkirt.endBay}
                  allowBlankValue={true}
                  onChange={(name, value) =>
                    handleWallSkirtChange(
                      activeBuilding,
                      wallSkirtIndex,
                      'endBay',
                      value
                    )
                  }
                  onFocus={() => {
                    if (activeWallSkirt !== wallSkirtIndex) {
                      setActiveWallSkirt(wallSkirtIndex);
                    }
                  }}
                />
                <FeetInchesInput
                  name={`building-${activeBuilding}-wallSkirtHeight-${wallSkirtIndex}`}
                  label="Height:"
                  labelClass="offOnTablet"
                  value={wallSkirt.height}
                  allowBlankValue={true}
                  onChange={(name, value) =>
                    handleWallSkirtChange(
                      activeBuilding,
                      wallSkirtIndex,
                      'height',
                      value
                    )
                  }
                  onFocus={() => {
                    if (activeWallSkirt !== wallSkirtIndex) {
                      setActiveWallSkirt(wallSkirtIndex);
                    }
                  }}
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
      </section>

      {/* Polycarbonate Relite Options */}
      <section className="card">
        <header>
          <h3>Polycarbonate Relites</h3>
        </header>
        <h4>Wall Relites</h4>
        {values.buildings[activeBuilding].frontGirtType != 'open' ||
        values.buildings[activeBuilding].backGirtType != 'open' ||
        values.buildings[activeBuilding].leftGirtType != 'open' ||
        values.buildings[activeBuilding].rightGirtType != 'open' ? (
          <div className="grid4 alignTop">
            <div className="grid">
              {values.buildings[activeBuilding].frontGirtType != 'open' ? (
                <>
                  <ReusableSelect
                    name={`buildingfrontPolySize-${activeBuilding}`}
                    value={values.buildings[activeBuilding].frontPolySize}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'frontPolySize',
                        e.target.value
                      )
                    }
                    options={polycarbWallSize}
                    label="Front Sidewall Relite Size:"
                  />
                  <ReusableSelect
                    name={`buildingfrontPolyColor-${activeBuilding}`}
                    value={values.buildings[activeBuilding].frontPolyColor}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'frontPolyColor',
                        e.target.value
                      )
                    }
                    options={polycarbWallColor}
                    label="Front Sidewall Relite Color:"
                  />
                  <ReusableInteger
                    name="frontPolyQty"
                    value={values.buildings[activeBuilding].frontPolyQty}
                    label="Front Sidewall Relite Qty:"
                    negative={false}
                    allowBlankValue={true}
                    max={Math.ceil(values.buildings[activeBuilding].length / 3)}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'frontPolyQty',
                        e.target.value
                      )
                    }
                    placeholder="Qty"
                  />
                </>
              ) : (
                <h5>
                  No Relites Available
                  <br />
                  Front Sidewall Is Open
                </h5>
              )}
            </div>

            <div className="divider offOnPhone"></div>
            <div className="grid">
              {values.buildings[activeBuilding].backGirtType != 'open' ? (
                <>
                  <ReusableSelect
                    name={`buildingbackPolySize-${activeBuilding}`}
                    value={values.buildings[activeBuilding].backPolySize}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'backPolySize',
                        e.target.value
                      )
                    }
                    options={polycarbWallSize}
                    label="Back Sidewall Relite Size:"
                  />
                  <ReusableSelect
                    name={`buildingbackPolyColor-${activeBuilding}`}
                    value={values.buildings[activeBuilding].backPolyColor}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'backPolyColor',
                        e.target.value
                      )
                    }
                    options={polycarbWallColor}
                    label="Back Sidewall Relite Color:"
                  />
                  <ReusableInteger
                    name="backPolyQty"
                    value={values.buildings[activeBuilding].backPolyQty}
                    label="Back Sidewall Relite Qty:"
                    negative={false}
                    allowBlankValue={true}
                    max={Math.ceil(values.buildings[activeBuilding].length / 3)}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'backPolyQty',
                        e.target.value
                      )
                    }
                    placeholder="Qty"
                  />
                </>
              ) : (
                <h5>
                  No Relites Available
                  <br />
                  Back Sidewall Is Open
                </h5>
              )}
            </div>

            <div className="divider showWithSidebar span2"></div>
            <div className="grid">
              {values.buildings[activeBuilding].leftGirtType != 'open' ? (
                <>
                  <ReusableSelect
                    name={`buildingleftPolySize-${activeBuilding}`}
                    value={values.buildings[activeBuilding].leftPolySize}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'leftPolySize',
                        e.target.value
                      )
                    }
                    options={polycarbWallSize}
                    label="Left Endwall Relite Size:"
                  />
                  <ReusableSelect
                    name={`buildingleftPolyColor-${activeBuilding}`}
                    value={values.buildings[activeBuilding].leftPolyColor}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'leftPolyColor',
                        e.target.value
                      )
                    }
                    options={polycarbWallColor}
                    label="Left Endwall Relite Color:"
                  />
                  <ReusableInteger
                    name="leftPolyQty"
                    value={values.buildings[activeBuilding].leftPolyQty}
                    label="Left Endwall Relite Qty:"
                    negative={false}
                    allowBlankValue={true}
                    max={Math.ceil(values.buildings[activeBuilding].width / 3)}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'leftPolyQty',
                        e.target.value
                      )
                    }
                    placeholder="Qty"
                  />
                </>
              ) : (
                <h5>
                  No Relites Available
                  <br />
                  Left Endwall Is Open
                </h5>
              )}
            </div>

            <div className="divider offOnPhone"></div>
            <div className="grid">
              {values.buildings[activeBuilding].rightGirtType != 'open' ? (
                <>
                  <ReusableSelect
                    name={`buildingrightPolySize-${activeBuilding}`}
                    value={values.buildings[activeBuilding].rightPolySize}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'rightPolySize',
                        e.target.value
                      )
                    }
                    options={polycarbWallSize}
                    label="Right Endwall Relite Size:"
                  />
                  <ReusableSelect
                    name={`buildingrightPolyColor-${activeBuilding}`}
                    value={values.buildings[activeBuilding].rightPolyColor}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'rightPolyColor',
                        e.target.value
                      )
                    }
                    options={polycarbWallColor}
                    label="Right Endwall Relite Color:"
                  />
                  <ReusableInteger
                    name="rightPolyQty"
                    value={values.buildings[activeBuilding].rightPolyQty}
                    label="Right Endwall Relite Qty:"
                    negative={false}
                    allowBlankValue={true}
                    max={Math.ceil(values.buildings[activeBuilding].width / 3)}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'rightPolyQty',
                        e.target.value
                      )
                    }
                    placeholder="Qty"
                  />
                </>
              ) : (
                <h5>
                  No Relites Available
                  <br />
                  Right Endwall Is Open
                </h5>
              )}
            </div>
          </div>
        ) : (
          <h4 className="center">
            No Relites Available
            <br />
            All Walls Are Open
          </h4>
        )}

        <div className="divider"></div>
        <h4>Roof Relites</h4>
        <div className="grid4 alignTop">
          {values.buildings[activeBuilding].shape == 'singleSlope' ||
          values.buildings[activeBuilding].shape == 'leanTo' ? (
            <>
              <div className="grid">
                <ReusableSelect
                  name={`buildingbackRoofPolySize-${activeBuilding}`}
                  value={values.buildings[activeBuilding].backRoofPolySize}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'backRoofPolySize',
                      e.target.value
                    )
                  }
                  options={polycarbRoofSize}
                  label="Roof Relite Size:"
                />
                <ReusableSelect
                  name={`buildingbackRoofPolyColor-${activeBuilding}`}
                  value={values.buildings[activeBuilding].backRoofPolyColor}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'backRoofPolyColor',
                      e.target.value
                    )
                  }
                  options={polycarbRoofColor}
                  label="Roof Relite Color:"
                />
                <ReusableInteger
                  name="backRoofPolyQty"
                  value={values.buildings[activeBuilding].backRoofPolyQty}
                  label="Roof Relite Qty:"
                  negative={false}
                  allowBlankValue={true}
                  max={Math.floor(
                    Math.floor(values.buildings[activeBuilding].length / 3) / 2
                  )}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'backRoofPolyQty',
                      e.target.value
                    )
                  }
                  placeholder="Qty"
                />
              </div>
              <div className="grid hideWithSidebar"></div>
              <div className="divider offOnPhone span2"></div>
            </>
          ) : (
            <>
              <div className="grid">
                <ReusableSelect
                  name={`buildingbackRoofPolySize-${activeBuilding}`}
                  value={values.buildings[activeBuilding].backRoofPolySize}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'backRoofPolySize',
                      e.target.value
                    )
                  }
                  options={polycarbRoofSize}
                  label="Back Roof Relite Size:"
                />
                <ReusableSelect
                  name={`buildingbackRoofPolyColor-${activeBuilding}`}
                  value={values.buildings[activeBuilding].backRoofPolyColor}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'backRoofPolyColor',
                      e.target.value
                    )
                  }
                  options={polycarbRoofColor}
                  label="Back Roof Relite Color:"
                />
                <ReusableInteger
                  name="backRoofPolyQty"
                  value={values.buildings[activeBuilding].backRoofPolyQty}
                  label="Back Roof Relite Qty:"
                  negative={false}
                  allowBlankValue={true}
                  max={Math.floor(
                    Math.floor(values.buildings[activeBuilding].length / 3) / 2
                  )}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'backRoofPolyQty',
                      e.target.value
                    )
                  }
                  placeholder="Qty"
                />
              </div>

              <div className="divider offOnPhone"></div>
              <div className="grid">
                <ReusableSelect
                  name={`buildingfrontRoofPolySize-${activeBuilding}`}
                  value={values.buildings[activeBuilding].frontRoofPolySize}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'frontRoofPolySize',
                      e.target.value
                    )
                  }
                  options={polycarbRoofSize}
                  label="Front Roof Relite Size:"
                />
                <ReusableSelect
                  name={`buildingfrontRoofPolyColor-${activeBuilding}`}
                  value={values.buildings[activeBuilding].frontRoofPolyColor}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'frontRoofPolyColor',
                      e.target.value
                    )
                  }
                  options={polycarbRoofColor}
                  label="Front Roof Relite Color:"
                />
                <ReusableInteger
                  name="frontRoofPolyQty"
                  value={values.buildings[activeBuilding].frontRoofPolyQty}
                  label="Front Roof Relite Qty:"
                  negative={false}
                  allowBlankValue={true}
                  max={Math.floor(
                    Math.floor(values.buildings[activeBuilding].length / 3) / 2
                  )}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'frontRoofPolyQty',
                      e.target.value
                    )
                  }
                  placeholder="Qty"
                />
              </div>
              <div className="divider showWithSidebar span2"></div>
            </>
          )}
          <div className="span2">
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
                      Math.floor(values.buildings[activeBuilding].length / 3) /
                        2
                    )}
                  </strong>
                </div>
                <div className="center small">
                  Every Third Panel: &nbsp;
                  <strong>
                    {Math.floor(
                      Math.floor(values.buildings[activeBuilding].length / 3) /
                        3
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
                      Math.floor(values.buildings[activeBuilding].length / 3) /
                        2
                    )}
                  </strong>
                </div>
                <div className="center small">
                  Every Third Panel: &nbsp;
                  <strong>
                    {Math.floor(
                      Math.floor(values.buildings[activeBuilding].length / 3) /
                        3
                    )}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BuildingOptions;
