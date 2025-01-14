import { useState, useMemo, useRef, useEffect, Fragment } from 'react';
import ReusableSelect from '../Inputs/ReusableSelect';
import ReusableInteger from '../Inputs/ReusableInteger';
import FeetInchesInput from '../Inputs/FeetInchesInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { openingTypes } from '../../util/dropdownOptions';
import { useUIContext } from '@/contexts/UIContext';
import { useBuildingContext } from '@/contexts/BuildingContext';
import OpeningSketch from '../OpeningSketch';

const BuildingOpenings = ({ locked }) => {
  // Local State
  const [activeOpening, setActiveOpening] = useState(0);
  const [activeWallKey, setActiveWallKey] = useState('');

  // Contexts
  const { activeBuilding } = useUIContext();
  const { state, addOpening, removeOpening, handleOpeningChange } =
    useBuildingContext();

  // References
  const tabListRef = useRef(null);
  const activeTabRef = useRef(null);

  // Local Functions
  const walls = useMemo(() => {
    const mainWalls = [
      {
        key: 'front',
        name: 'Front Sidewall',
        girtType: state.buildings[activeBuilding].frontGirtType,
      },
      {
        key: 'back',
        name: 'Back Sidewall',
        girtType: state.buildings[activeBuilding].backGirtType,
      },
      {
        key: 'left',
        name: 'Left Endwall',
        girtType: state.buildings[activeBuilding].leftGirtType,
      },
      {
        key: 'right',
        name: 'Right Endwall',
        girtType: state.buildings[activeBuilding].rightGirtType,
      },
    ].filter((wall) => wall.girtType !== 'open');

    const partitionWalls = state.buildings[activeBuilding].partitions.map(
      (partition, index) => {
        // console.log(partition);
        return {
          key: `partition${index + 1}`,
          name: `Partition ${index + 1}`,
          girtType: 'partition',
        };
      }
    );

    return [...mainWalls, ...partitionWalls];
  }, [state.buildings[activeBuilding]]);

  useEffect(() => {
    if (walls.length > 0 && !activeWallKey) {
      setActiveWallKey(walls[0].key);
    }
  }, [walls, activeWallKey]);

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

  const handleAddOpening = () => {
    addOpening(activeBuilding, activeWallKey);
    setActiveOpening(
      state.buildings[activeBuilding].openings[activeWallKey]?.length
    );
  };

  const handleRemoveOpening = (openingIndex) => {
    removeOpening(activeBuilding, activeWallKey, openingIndex);
    const remainingOpenings =
      state.buildings[activeBuilding].openings[activeWallKey]?.length - 1 || 0;
    if (openingIndex <= activeOpening && activeOpening > 0) {
      setActiveOpening(Math.min(activeOpening - 1, remainingOpenings - 1));
    }
  };

  const renderOpeningInputs = (opening, openingIndex) => {
    return (
      <>
        <div
          className={`tableGrid7 ${openingIndex == activeOpening ? 'activeRow' : ''}`}
        >
          <ReusableInteger
            name={`building-${activeBuilding}-openingBay-${openingIndex}`}
            value={opening.bay}
            label="Bay:"
            labelClass="offOnTablet"
            min="1"
            max={
              activeWallKey.includes('partition')
                ? state.buildings[activeBuilding].partitions[
                    activeWallKey.replace('partition', '') - 1
                  ].baySpacing.length
                : `${state.buildings[`${activeBuilding}`][`${activeWallKey}BaySpacing`].length}`
            }
            allowBlankValue={true}
            onChange={(e) => {
              handleOpeningChange(
                activeBuilding,
                activeWallKey,
                openingIndex,
                'bay',
                e.target.value
              );
            }}
            onFocus={() => {
              if (activeOpening !== openingIndex) {
                setActiveOpening(openingIndex);
              }
            }}
            placeholder="Bay"
            disabled={locked}
          />
          <ReusableSelect
            name={`building-${activeBuilding}-openingType-${openingIndex}`}
            value={opening.openType}
            label="Type:"
            labelClass="offOnTablet"
            onChange={(e) =>
              handleOpeningChange(
                activeBuilding,
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
            disabled={locked}
          />
          <FeetInchesInput
            name={`building-${activeBuilding}-openingWidth-${openingIndex}`}
            label="Width:"
            labelClass="offOnTablet"
            value={opening.width}
            allowBlankValue={true}
            onChange={(e) => {
              handleOpeningChange(
                activeBuilding,
                activeWallKey,
                openingIndex,
                'width',
                e.target.value
              );
            }}
            onFocus={() => {
              if (activeOpening !== openingIndex) {
                setActiveOpening(openingIndex);
              }
            }}
            disabled={locked}
          />
          <FeetInchesInput
            name={`building-${activeBuilding}-openingHeight-${openingIndex}`}
            label="Height:"
            labelClass="offOnTablet"
            value={opening.height}
            allowBlankValue={true}
            onChange={(e) =>
              handleOpeningChange(
                activeBuilding,
                activeWallKey,
                openingIndex,
                'height',
                e.target.value
              )
            }
            onFocus={() => {
              if (activeOpening !== openingIndex) {
                setActiveOpening(openingIndex);
              }
            }}
            disabled={locked}
          />
          <FeetInchesInput
            name={`building-${activeBuilding}-openingSill-${openingIndex}`}
            label="Sill:"
            labelClass="offOnTablet"
            value={opening.sill}
            allowBlankValue={true}
            allowZero={true}
            onChange={(e) =>
              handleOpeningChange(
                activeBuilding,
                activeWallKey,
                openingIndex,
                'sill',
                e.target.value
              )
            }
            onFocus={() => {
              if (activeOpening !== openingIndex) {
                setActiveOpening(openingIndex);
              }
            }}
            disabled={locked}
          />
          <FeetInchesInput
            name={`building-${activeBuilding}-openingOffset-${openingIndex}`}
            label="Offset:"
            labelClass="offOnTablet"
            value={opening.offset}
            allowBlankValue={true}
            allowZero={true}
            onChange={(e) =>
              handleOpeningChange(
                activeBuilding,
                activeWallKey,
                openingIndex,
                'offset',
                e.target.value
              )
            }
            onFocus={() => {
              if (activeOpening !== openingIndex) {
                setActiveOpening(openingIndex);
              }
            }}
            disabled={locked}
          />
          <button
            type="button"
            className="icon reject deleteRow"
            onClick={() => handleRemoveOpening(openingIndex)}
            disabled={locked}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
        <div className="divider offOnTablet"></div>
      </>
    );
  };

  // JSX
  return (
    <>
      <section className="card">
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
          {state.buildings[activeBuilding].openings[activeWallKey]?.length >
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
          {state.buildings[activeBuilding].openings[activeWallKey]?.map(
            (opening, index) => (
              <Fragment
                key={`building-${activeBuilding}-opening-${activeWallKey}-${index}`}
              >
                {renderOpeningInputs(opening, index)}
              </Fragment>
            )
          )}
          {!locked && (
            <>
              {state.buildings[activeBuilding].openings[activeWallKey]?.length >
                0 && <div className="divider onTablet"></div>}
              <div className="buttonFooter">
                <button
                  type="button"
                  className="addButton"
                  onClick={() => handleAddOpening()}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>
      {/* Opening Sketch placeholder */}
      <section className="card">
        <header>
          <h3>Wall Sketch</h3>
        </header>
        <OpeningSketch wallType={activeWallKey} />
      </section>
    </>
  );
};

export default BuildingOpenings;
