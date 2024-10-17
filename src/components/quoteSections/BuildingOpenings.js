import { useState, useMemo, useRef, useEffect, Fragment } from 'react';
import ReusableSelect from '../Inputs/ReusableSelect';
import ReusableInteger from '../Inputs/ReusableInteger';
import FeetInchesInput from '../Inputs/FeetInchesInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { openingTypes } from '../../util/dropdownOptions';

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
      <div
        className={`tableGrid7 ${openingIndex == activeOpening ? 'activeRow' : ''}`}
      >
        <ReusableInteger
          name={`building-${activeBuilding}-openingBay-${openingIndex}`}
          value={opening.bay}
          label="Bay:"
          labelClass="offOnTablet"
          // min="1"
          // max={`${values.buildings[`${activeBuilding}`][`${activeWallKey}BaySpacing`].length}`}
          onChange={(name, value) =>
            handleOpeningChange(
              activeBuilding,
              activeWallKey,
              openingIndex,
              'bay',
              value
            )
          }
          onFocus={() => {
            if (activeOpening !== openingIndex) {
              setActiveOpening(openingIndex);
            }
          }}
        />
        <ReusableSelect
          name={`building-${activeBuilding}-openingType-${openingIndex}`}
          value={opening.openType}
          label="Type:"
          labelClass="offOnTablet"
          onChange={(e) =>
            handleOpeningChange(
              activeWallKey,
              openingIndex,
              'openType',
              e.target.value
            )
          }
          onFocus={() => {
            if (activeOpening !== openingIndex) {
              setActiveOpening(openingIndex);
            }
          }}
          options={openingTypes}
        />
        <FeetInchesInput
          name={`building-${activeBuilding}-openingWidth-${openingIndex}`}
          label="Width:"
          labelClass="offOnTablet"
          value={opening.width}
          onChange={(name, value) =>
            handleOpeningChange(
              activeBuilding,
              activeWallKey,
              openingIndex,
              'width',
              value
            )
          }
          onFocus={() => {
            if (activeOpening !== openingIndex) {
              setActiveOpening(openingIndex);
            }
          }}
        />
        <FeetInchesInput
          name={`building-${activeBuilding}-openingHeight-${openingIndex}`}
          label="Height:"
          labelClass="offOnTablet"
          value={opening.height}
          onChange={(name, value) =>
            handleOpeningChange(
              activeBuilding,
              activeWallKey,
              openingIndex,
              'height',
              value
            )
          }
          onFocus={() => {
            if (activeOpening !== openingIndex) {
              setActiveOpening(openingIndex);
            }
          }}
        />
        <FeetInchesInput
          name={`building-${activeBuilding}-openingSill-${openingIndex}`}
          label="Sill:"
          labelClass="offOnTablet"
          value={opening.sill}
          allowZero={true}
          onChange={(name, value) =>
            handleOpeningChange(
              activeBuilding,
              activeWallKey,
              openingIndex,
              'sill',
              value
            )
          }
          onFocus={() => {
            if (activeOpening !== openingIndex) {
              setActiveOpening(openingIndex);
            }
          }}
        />
        <FeetInchesInput
          name={`building-${activeBuilding}-openingOffset-${openingIndex}`}
          label="Offset:"
          labelClass="offOnTablet"
          value={opening.offset}
          allowZero={true}
          onChange={(name, value) =>
            handleOpeningChange(
              activeBuilding,
              activeWallKey,
              openingIndex,
              'offset',
              value
            )
          }
          onFocus={() => {
            if (activeOpening !== openingIndex) {
              setActiveOpening(openingIndex);
            }
          }}
        />
        <button
          onClick={() =>
            removeOpening(activeBuilding, activeWallKey, openingIndex)
          }
          className="icon red deleteRow span2"
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
        {values.buildings[activeBuilding].openings[activeWallKey]?.length >
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
        )}
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
          className="button success addRow"
          onClick={() => addOpening(activeBuilding, activeWallKey)}
        >
          Add
        </button>
      </div>
    </section>
  );
};

export default BuildingOpenings;
