import { React, useState, Fragment } from 'react';
import Image from 'next/image';
import ReusableSelect from '../Inputs/ReusableSelect';
import PolycarbReliteRow from '../../components/Inputs/PolycarbReliteRow';
import {
  walls,
  wallPanels,
  wallGauge,
  wallFinish,
  panelOptions,
  topOfWall,
  polycarbWallSize,
  polycarbRoofSize,
  polycarbColor,
} from '../../util/dropdownOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

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
                  wall: 'frontSidewall',
                  start: '',
                  end: '',
                  height: '',
                  panelType: 'pbr',
                  panelGauge: '',
                  panelFinish: '',
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
                  wall: 'frontSidewall',
                  start: '',
                  end: '',
                  height: '',
                  panelOption: 'break',
                  panelType: 'pbr',
                  panelGauge: '',
                  panelFinish: '',
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
                  wall: 'frontSidewall',
                  start: '',
                  end: '',
                  height: '',
                  topOfWall: 'hrb',
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
                  wall: 'frontSidewall',
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

  const selectedLinerPanel = wallPanels.find(
    (panel) =>
      panel.id ===
      values.buildings[activeBuilding].linerPanels[activeLinerPanel]?.panelType
  );

  const selectedWainscotPanel = wallPanels.find(
    (panel) =>
      panel.id ===
      values.buildings[activeBuilding].wainscots[activeWainscot]?.panelType
  );
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
              <div className="tableGrid5">
                <ReusableSelect
                  id={`building-${activeBuilding}-linerPanelWall-${linerPanelIndex}`}
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
                  label="Wall"
                />
                <div className="cardInput">
                  <label
                    className="offOnTablet"
                    htmlFor={`building-${activeBuilding}-linerPanelStart-${linerPanelIndex}`}
                  >
                    <span>
                      Start <small>(Left to Right)</small>
                    </span>
                  </label>
                  <input
                    type="text"
                    id={`building-${activeBuilding}-linerPanelStart-${linerPanelIndex}`}
                    name={`building-${activeBuilding}-linerPanelStart-${linerPanelIndex}`}
                    value={linerPanel.start}
                    onChange={(e) =>
                      handleLinerPanelChange(
                        activeBuilding,
                        linerPanelIndex,
                        'start',
                        e.target.value
                      )
                    }
                    onFocus={() => {
                      if (activeLinerPanel !== linerPanelIndex) {
                        setActiveLinerPanel(linerPanelIndex);
                      }
                    }}
                    placeholder="Feet"
                  />
                </div>
                <div className="cardInput">
                  <label
                    className="offOnTablet"
                    htmlFor={`building-${activeBuilding}-linerPanelEnd-${linerPanelIndex}`}
                  >
                    <span>
                      End <small>(Left to Right)</small>
                    </span>
                  </label>
                  <input
                    type="text"
                    id={`building-${activeBuilding}-linerPanelEnd-${linerPanelIndex}`}
                    name={`building-${activeBuilding}-linerPanelEnd-${linerPanelIndex}`}
                    value={linerPanel.end}
                    onChange={(e) =>
                      handleLinerPanelChange(
                        activeBuilding,
                        linerPanelIndex,
                        'end',
                        e.target.value
                      )
                    }
                    onFocus={() => {
                      if (activeLinerPanel !== linerPanelIndex) {
                        setActiveLinerPanel(linerPanelIndex);
                      }
                    }}
                    placeholder="Feet"
                  />
                </div>
                <div className="cardInput">
                  <label
                    className="offOnTablet"
                    htmlFor={`building-${activeBuilding}-linerPanelHeight-${linerPanelIndex}`}
                  >
                    Height
                  </label>
                  <input
                    type="text"
                    id={`building-${activeBuilding}-linerPanelHeight-${linerPanelIndex}`}
                    name={`building-${activeBuilding}-linerPanelHeight-${linerPanelIndex}`}
                    value={linerPanel.height}
                    onChange={(e) =>
                      handleLinerPanelChange(
                        activeBuilding,
                        linerPanelIndex,
                        'height',
                        e.target.value
                      )
                    }
                    onFocus={() => {
                      if (activeLinerPanel !== linerPanelIndex) {
                        setActiveLinerPanel(linerPanelIndex);
                      }
                    }}
                    placeholder="Leave Blank for Full Ht"
                  />
                </div>
                <button
                  onClick={() =>
                    removeLinerPanel(activeBuilding, linerPanelIndex)
                  }
                  className="icon red span2"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              <div className="divider offOnTablet"></div>
            </Fragment>
          )
        )}
        <button
          type="button"
          className="button success w5"
          onClick={() => addLinerPanel(activeBuilding)}
        >
          Add
        </button>

        {values.buildings[activeBuilding].linerPanels.length > 0 && (
          <>
            <div className="divider onDesktop"></div>
            <div className="grid2">
              <div className="onLaptop"></div>
              <div className="panelGrid">
                <ReusableSelect
                  className="panelType"
                  id={`building-${activeBuilding}-linerPanelType${activeLinerPanel}`}
                  name={`building-${activeBuilding}-linerPanelType${activeLinerPanel}`}
                  value={
                    values.buildings[activeBuilding].linerPanels[
                      activeLinerPanel
                    ].panelType
                  }
                  onChange={(e) =>
                    handleLinerPanelChange(
                      activeBuilding,
                      activeLinerPanel,
                      'panelType',
                      e.target.value
                    )
                  }
                  options={wallPanels}
                  label="Liner Panels:"
                />
                <ReusableSelect
                  className="panelGauge"
                  id={`building-${activeBuilding}-linerPanelGauge${activeLinerPanel}`}
                  name={`building-${activeBuilding}-linerPanelGauge${activeLinerPanel}`}
                  value={
                    values.buildings[activeBuilding].linerPanels[
                      activeLinerPanel
                    ].panelGauge
                  }
                  onChange={(e) =>
                    handleLinerPanelChange(
                      activeBuilding,
                      activeLinerPanel,
                      'panelGauge',
                      e.target.value
                    )
                  }
                  options={wallGauge}
                  label="Gauge:"
                />
                <ReusableSelect
                  className="panelFinish"
                  id={`building-${activeBuilding}-linerPanelFinish${activeLinerPanel}`}
                  name={`building-${activeBuilding}-linerPanelFinish${activeLinerPanel}`}
                  value={
                    values.buildings[activeBuilding].linerPanels[
                      activeLinerPanel
                    ].panelFinish
                  }
                  onChange={(e) =>
                    handleLinerPanelChange(
                      activeBuilding,
                      activeLinerPanel,
                      'panelFinish',
                      e.target.value
                    )
                  }
                  options={wallFinish}
                  label="Finish:"
                />
                <div className="cardInput panelImage">
                  {selectedLinerPanel && selectedLinerPanel.image && (
                    <Image
                      alt={`${selectedLinerPanel.label}`}
                      src={selectedLinerPanel.image}
                      className="panelImage"
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
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
              <div className="tableGrid6">
                <ReusableSelect
                  id={`building-${activeBuilding}-wainscotWall-${wainscotIndex}`}
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
                  label="Wall"
                />
                <div className="cardInput">
                  <label
                    className="offOnTablet"
                    htmlFor={`building-${activeBuilding}-wainscotStart-${wainscotIndex}`}
                  >
                    <span>
                      Start <small>(Left to Right)</small>
                    </span>
                  </label>
                  <input
                    type="text"
                    id={`building-${activeBuilding}-wainscotStart-${wainscotIndex}`}
                    name={`building-${activeBuilding}-wainscotStart-${wainscotIndex}`}
                    value={wainscot.start}
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
                    placeholder="Feet"
                  />
                </div>
                <div className="cardInput">
                  <label
                    className="offOnTablet"
                    htmlFor={`building-${activeBuilding}-wainscotEnd-${wainscotIndex}`}
                  >
                    <span>
                      End <small>(Left to Right)</small>
                    </span>
                  </label>
                  <input
                    type="text"
                    id={`building-${activeBuilding}-wainscotEnd-${wainscotIndex}`}
                    name={`building-${activeBuilding}-wainscotEnd-${wainscotIndex}`}
                    value={wainscot.end}
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
                    placeholder="Feet"
                  />
                </div>
                <div className="cardInput">
                  <label
                    className="offOnTablet"
                    htmlFor={`building-${activeBuilding}-wainscotHeight-${wainscotIndex}`}
                  >
                    Height
                  </label>
                  <input
                    type="text"
                    id={`building-${activeBuilding}-wainscotHeight-${wainscotIndex}`}
                    name={`building-${activeBuilding}-wainscotHeight-${wainscotIndex}`}
                    value={wainscot.height}
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
                    placeholder="Feet"
                  />
                </div>
                <ReusableSelect
                  id={`building-${activeBuilding}-wainscotPanelOption-${wainscotIndex}`}
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
                  label="Panel Option"
                />
                <button
                  onClick={() => removeWainscot(activeBuilding, wainscotIndex)}
                  className="icon red"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              <div className="divider offOnTablet"></div>
            </Fragment>
          )
        )}
        <button
          type="button"
          className="button success w5"
          onClick={() => addWainscot(activeBuilding)}
        >
          Add
        </button>
        {values.buildings[activeBuilding].wainscots.length > 0 && (
          <>
            <div className="divider onDesktop"></div>
            <div className="grid2">
              <div className="onLaptop"></div>
              <div className="panelGrid">
                <ReusableSelect
                  className="panelType"
                  id={`building-${activeBuilding}-wainscotType${activeWainscot}`}
                  name={`building-${activeBuilding}-wainscotType${activeWainscot}`}
                  value={
                    values.buildings[activeBuilding].wainscots[activeWainscot]
                      .panelType
                  }
                  onChange={(e) =>
                    handleWainscotChange(
                      activeBuilding,
                      activeWainscot,
                      'panelType',
                      e.target.value
                    )
                  }
                  options={wallPanels}
                  label="Liner Panels:"
                />
                <ReusableSelect
                  className="panelGauge"
                  id={`building-${activeBuilding}-wainscotGauge${activeWainscot}`}
                  name={`building-${activeBuilding}-wainscotGauge${activeWainscot}`}
                  value={
                    values.buildings[activeBuilding].wainscots[activeWainscot]
                      .panelGauge
                  }
                  onChange={(e) =>
                    handleWainscotChange(
                      activeBuilding,
                      activeWainscot,
                      'panelGauge',
                      e.target.value
                    )
                  }
                  options={wallGauge}
                  label="Gauge:"
                />
                <ReusableSelect
                  className="panelFinish"
                  id={`building-${activeBuilding}-wainscotFinish${activeWainscot}`}
                  name={`building-${activeBuilding}-wainscotFinish${activeWainscot}`}
                  value={
                    values.buildings[activeBuilding].wainscots[activeWainscot]
                      .panelFinish
                  }
                  onChange={(e) =>
                    handleWainscotChange(
                      activeBuilding,
                      activeWainscot,
                      'panelFinish',
                      e.target.value
                    )
                  }
                  options={wallFinish}
                  label="Finish:"
                />
                <div className="cardInput panelImage">
                  {selectedWainscotPanel && selectedWainscotPanel.image && (
                    <Image
                      alt={`${selectedWainscotPanel.label}`}
                      src={selectedWainscotPanel.image}
                      className="panelImage"
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
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
              <div className="tableGrid6">
                <ReusableSelect
                  id={`building-${activeBuilding}-partialWallWall-${partialWallIndex}`}
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
                  label="Wall"
                />
                <div className="cardInput">
                  <label
                    className="offOnTablet"
                    htmlFor={`building-${activeBuilding}-partialWallStart-${partialWallIndex}`}
                  >
                    <span>
                      Start <small>(Left to Right)</small>
                    </span>
                  </label>
                  <input
                    type="text"
                    id={`building-${activeBuilding}-partialWallStart-${partialWallIndex}`}
                    name={`building-${activeBuilding}-partialWallStart-${partialWallIndex}`}
                    value={partialWall.start}
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
                    placeholder="Feet"
                  />
                </div>
                <div className="cardInput">
                  <label
                    className="offOnTablet"
                    htmlFor={`building-${activeBuilding}-partialWallEnd-${partialWallIndex}`}
                  >
                    <span>
                      End <small>(Left to Right)</small>
                    </span>
                  </label>
                  <input
                    type="text"
                    id={`building-${activeBuilding}-partialWallEnd-${partialWallIndex}`}
                    name={`building-${activeBuilding}-partialWallEnd-${partialWallIndex}`}
                    value={partialWall.end}
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
                    placeholder="Feet"
                  />
                </div>
                <div className="cardInput">
                  <label
                    className="offOnTablet"
                    htmlFor={`building-${activeBuilding}-partialWallHeight-${partialWallIndex}`}
                  >
                    Height
                  </label>
                  <input
                    type="text"
                    id={`building-${activeBuilding}-partialWallHeight-${partialWallIndex}`}
                    name={`building-${activeBuilding}-partialWallHeight-${partialWallIndex}`}
                    value={partialWall.height}
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
                    placeholder="Feet"
                  />
                </div>
                <ReusableSelect
                  id={`building-${activeBuilding}-partialWallTopWall-${partialWallIndex}`}
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
                  label="Top of Wall"
                />
                <button
                  onClick={() =>
                    removePartialWall(activeBuilding, partialWallIndex)
                  }
                  className="icon red"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              <div className="divider offOnTablet"></div>
            </Fragment>
          )
        )}
        <button
          type="button"
          className="button success w5"
          onClick={() => addPartialWall(activeBuilding)}
        >
          Add
        </button>
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
              <div className="tableGrid6">
                <ReusableSelect
                  id={`building-${activeBuilding}-wallSkirtWall-${wallSkirtIndex}`}
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
                  label="Wall"
                />
                <div className="cardInput">
                  <label
                    className="offOnTablet"
                    htmlFor={`building-${activeBuilding}-wallSkirtStartBay-${wallSkirtIndex}`}
                  >
                    Start Bay
                  </label>
                  <input
                    type="text"
                    id={`building-${activeBuilding}-wallSkirtStartBay-${wallSkirtIndex}`}
                    name={`building-${activeBuilding}-wallSkirtStartBay-${wallSkirtIndex}`}
                    value={wallSkirt.startBay}
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
                    placeholder="Feet"
                  />
                </div>
                <div className="cardInput">
                  <label
                    className="offOnTablet"
                    htmlFor={`building-${activeBuilding}-wallSkirtEndBay-${wallSkirtIndex}`}
                  >
                    End Bay
                  </label>
                  <input
                    type="text"
                    id={`building-${activeBuilding}-wallSkirtEndBay-${wallSkirtIndex}`}
                    name={`building-${activeBuilding}-wallSkirtEndBay-${wallSkirtIndex}`}
                    value={wallSkirt.endBay}
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
                    placeholder="Feet"
                  />
                </div>
                <div className="cardInput">
                  <label
                    className="offOnTablet"
                    htmlFor={`building-${activeBuilding}-wallSkirtHeight-${wallSkirtIndex}`}
                  >
                    Height
                  </label>
                  <input
                    type="text"
                    id={`building-${activeBuilding}-wallSkirtHeight-${wallSkirtIndex}`}
                    name={`building-${activeBuilding}-wallSkirtHeight-${wallSkirtIndex}`}
                    value={wallSkirt.height}
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
                    placeholder="Feet"
                  />
                </div>
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
                  onClick={() =>
                    removeWallSkirt(activeBuilding, wallSkirtIndex)
                  }
                  className="icon red"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </Fragment>
          )
        )}
        <button
          type="button"
          className="button success w5"
          onClick={() => addWallSkirt(activeBuilding)}
        >
          Add
        </button>
      </section>

      {/* Polycarbonate Relite Options */}
      <section className="card">
        <header>
          <h3>Polycarbonate Relites</h3>
        </header>
        <h4>Wall Relites</h4>
        <div className="polycarbGrid">
          <div></div>
          <p className="center">Size</p>
          <p className="center">Color</p>
          <p className="center">Qty</p>
        </div>
        <div className="polycarbGrid">
          <PolycarbReliteRow
            wallName="Front Sidewall"
            shortName="fsw"
            activeBuilding={activeBuilding}
            values={values}
            handleNestedChange={handleNestedChange}
            polycarbWallSize={polycarbWallSize}
            polycarbColor={polycarbColor}
            dimensionToUse="length"
            isDesktop={isDesktop}
          />
          <PolycarbReliteRow
            wallName="Back Sidewall"
            shortName="bsw"
            activeBuilding={activeBuilding}
            values={values}
            handleNestedChange={handleNestedChange}
            polycarbWallSize={polycarbWallSize}
            polycarbColor={polycarbColor}
            dimensionToUse="length"
            isDesktop={isDesktop}
          />
          <PolycarbReliteRow
            wallName="Left Endwall"
            shortName="lew"
            activeBuilding={activeBuilding}
            values={values}
            handleNestedChange={handleNestedChange}
            polycarbWallSize={polycarbWallSize}
            polycarbColor={polycarbColor}
            dimensionToUse="width"
            isDesktop={isDesktop}
          />
          <PolycarbReliteRow
            wallName="Right Endwall"
            shortName="rew"
            activeBuilding={activeBuilding}
            values={values}
            handleNestedChange={handleNestedChange}
            polycarbWallSize={polycarbWallSize}
            polycarbColor={polycarbColor}
            dimensionToUse="width"
            isDesktop={isDesktop}
          />
        </div>
        <div className="divider"></div>
        <h4>Roof Relites</h4>
        <div className="polycarbGrid">
          <div></div>
          <p className="center">Size</p>
          <p className="center">Color</p>
          <p className="center">Qty</p>
        </div>
        <div className="polycarbGrid">
          <PolycarbReliteRow
            wallName="Back Roof"
            shortName="backRoof"
            activeBuilding={activeBuilding}
            values={values}
            handleNestedChange={handleNestedChange}
            polycarbWallSize={polycarbRoofSize}
            polycarbColor={polycarbColor}
            dimensionToUse="length"
            isDesktop={isDesktop}
          />
          <PolycarbReliteRow
            wallName="Front Roof"
            shortName="frontRoof"
            activeBuilding={activeBuilding}
            values={values}
            handleNestedChange={handleNestedChange}
            polycarbWallSize={polycarbRoofSize}
            polycarbColor={polycarbColor}
            dimensionToUse="length"
            isDesktop={isDesktop}
          />
        </div>

        <div className="divider"></div>
      </section>
    </>
  );
};

export default BuildingOptions;
