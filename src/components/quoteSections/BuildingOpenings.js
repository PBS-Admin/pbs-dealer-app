import { useState, useMemo, useRef, useEffect, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const BuildingOpenings = ({
  values,
  activeBuilding,
  handleOpeningChange,
  setValues,
  isDesktop,
}) => {
  const [activeOpening, setActiveOpening] = useState(0);

  const addOpening = (buildingIndex, wall) => {
    setValues((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, index) =>
        index === buildingIndex
          ? {
              ...building,
              openings: {
                ...building.openings,
                [wall]: [
                  ...(building.openings[wall] || []),
                  {
                    bay: '',
                    openType: '',
                    width: '',
                    height: '',
                    sill: '',
                    offset: '',
                  },
                ],
              },
            }
          : building
      ),
    }));
  };

  const removeOpening = (buildingIndex, wall, openingIndex) => {
    setValues((prev) => {
      const newBuildings = prev.buildings.map((building, bIndex) =>
        bIndex === buildingIndex
          ? {
              ...building,
              openings: {
                ...building.openings,
                [wall]: (building.openings[wall] || []).filter(
                  (_, oIndex) => oIndex !== openingIndex
                ),
              },
            }
          : building
      );

      const remainingOpenings =
        newBuildings[buildingIndex].openings[wall]?.length || 0;
      if (openingIndex <= activeOpening && activeOpening > 0) {
        setActiveOpening(Math.min(activeOpening - 1, remainingOpenings - 1));
      }

      return { ...prev, buildings: newBuildings };
    });
  };

  const walls = useMemo(() => {
    const mainWalls = [
      {
        key: 'front',
        name: 'Front Sidewall',
        girtType: values.buildings[activeBuilding].frontGirtType,
      },
      {
        key: 'back',
        name: 'Back Sidewall',
        girtType: values.buildings[activeBuilding].backGirtType,
      },
      {
        key: 'left',
        name: 'Left Endwall',
        girtType: values.buildings[activeBuilding].leftGirtType,
      },
      {
        key: 'right',
        name: 'Right Endwall',
        girtType: values.buildings[activeBuilding].rightGirtType,
      },
    ].filter((wall) => wall.girtType !== 'open');

    const partitionWalls = values.buildings[activeBuilding].partitions.map(
      (partition, index) => ({
        key: `partition${index + 1}`,
        name: `Partition ${index + 1}`,
        girtType: 'partition',
      })
    );

    return [...mainWalls, ...partitionWalls];
  }, [values.buildings[activeBuilding]]);

  const [activeWallKey, setActiveWallKey] = useState(walls[0]?.key || '');

  const tabListRef = useRef(null);
  const activeTabRef = useRef(null);

  useEffect(() => {
    if (activeTabRef.current && tabListRef.current) {
      const tabList = tabListRef.current;
      const activeTab = activeTabRef.current;
      const scrollLeft =
        activeTab.offsetLeft -
        tabList.clientWidth / 2 +
        activeTab.clientWidth / 2;
      tabList.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeWallKey]);

  const renderOpeningInputs = (opening, openingIndex) => (
    <>
      <div className="tableGrid7">
        <div className="cardInput">
          <label
            className="offOnTablet"
            htmlFor={`building-${activeBuilding}-openingBay-${openingIndex}`}
          >
            Bay
          </label>
          <input
            type="text"
            id={`building-${activeBuilding}-openingBay-${openingIndex}`}
            value={opening.bay}
            onChange={(e) =>
              handleOpeningChange(
                activeBuilding,
                activeWallKey,
                openingIndex,
                'bay',
                e.target.value
              )
            }
          />
        </div>
        <div className="cardInput">
          <label
            className="offOnTablet"
            htmlFor={`building-${activeBuilding}-openingType-${openingIndex}`}
          >
            Type
          </label>
          <input
            type="text"
            id={`building-${activeBuilding}-openingType-${openingIndex}`}
            value={opening.openType}
            onChange={(e) =>
              handleOpeningChange(
                activeBuilding,
                activeWallKey,
                openingIndex,
                'openType',
                e.target.value
              )
            }
          />
        </div>
        <div className="cardInput">
          <label
            className="offOnTablet"
            htmlFor={`building-${activeBuilding}-openingWidth-${openingIndex}`}
          >
            Width
          </label>
          <input
            type="text"
            id={`building-${activeBuilding}-openingWidth-${openingIndex}`}
            value={opening.width}
            onChange={(e) =>
              handleOpeningChange(
                activeBuilding,
                activeWallKey,
                openingIndex,
                'width',
                e.target.value
              )
            }
          />
        </div>
        <div className="cardInput">
          <label
            className="offOnTablet"
            htmlFor={`building-${activeBuilding}-openingHeight-${openingIndex}`}
          >
            Height
          </label>
          <input
            type="text"
            id={`building-${activeBuilding}-openingHeight-${openingIndex}`}
            value={opening.height}
            onChange={(e) =>
              handleOpeningChange(
                activeBuilding,
                activeWallKey,
                openingIndex,
                'height',
                e.target.value
              )
            }
          />
        </div>
        <div className="cardInput">
          <label
            className="offOnTablet"
            htmlFor={`building-${activeBuilding}-openingSill-${openingIndex}`}
          >
            Sill
          </label>
          <input
            type="text"
            id={`building-${activeBuilding}-openingSill-${openingIndex}`}
            value={opening.sill}
            onChange={(e) =>
              handleOpeningChange(
                activeBuilding,
                activeWallKey,
                openingIndex,
                'sill',
                e.target.value
              )
            }
          />
        </div>
        <div className="cardInput">
          <label
            className="offOnTablet"
            htmlFor={`building-${activeBuilding}-openingOffset-${openingIndex}`}
          >
            Offset
          </label>
          <input
            type="text"
            id={`building-${activeBuilding}-openingOffset-${openingIndex}`}
            value={opening.offset}
            onChange={(e) =>
              handleOpeningChange(
                activeBuilding,
                activeWallKey,
                openingIndex,
                'offset',
                e.target.value
              )
            }
          />
        </div>
        <button
          onClick={() =>
            removeOpening(activeBuilding, activeWallKey, openingIndex)
          }
          className="icon red span2"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <div className="divider offOnTablet"></div>
    </>
  );

  return (
    <section className="card start">
      <header>
        <h3>Openings</h3>
      </header>
      <div className="tabsContainer">
        <div className="tabList" ref={tabListRef}>
          {walls.map((wall) => (
            <button
              type="button"
              key={wall.key}
              ref={activeWallKey === wall.key ? activeTabRef : null}
              className={`tab ${activeWallKey === wall.key ? 'activeTab' : ''}`}
              onClick={() => setActiveWallKey(wall.key)}
            >
              {wall.name}
            </button>
          ))}
        </div>
      </div>
      <div className="tabContent">
        {/* {values.buildings[activeBuilding].openings[activeWallKey].length >
          0 && (
          <div className="onTablet">
            <div className="tableGrid7">
              <h5>Bay</h5>
              <h5>Type</h5>
              <h5>Width</h5>
              <h5>Height</h5>
              <h5>Sill</h5>
              <h5>Offset</h5>
              <h5></h5>
            </div>
          </div>
        )} */}
        {values.buildings[activeBuilding].openings[activeWallKey]?.map(
          (opening, index) => (
            <Fragment
              key={`building-${activeBuilding}-opening-${activeWallKey}-${index}`}
            >
              {renderOpeningInputs(opening, index)}
            </Fragment>
          )
        )}
        <button
          type="button"
          className="button success w5"
          onClick={() => addOpening(activeBuilding, activeWallKey)}
        >
          Add
        </button>
      </div>
    </section>
  );
};

export default BuildingOpenings;
