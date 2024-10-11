import { useState, useEffect, Fragment } from 'react';
import ReusableSelect from '../Inputs/ReusableSelect';
import ReusablePanel from '../Inputs/ReusablePanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { wallInsulation, orientations } from '../../util/dropdownOptions';

const BuildingPartitions = ({
  values,
  activeBuilding,
  handlePartitionChange,
  setValues,
}) => {
  const [activePartition, setActivePartition] = useState(0);

  const addPartition = (buildingIndex) => {
    setValues((prev) => {
      const newBuilding = { ...prev.buildings[buildingIndex] };
      const newPartitionIndex = newBuilding.partitions.length;

      // Add new partition
      newBuilding.partitions = [
        ...newBuilding.partitions,
        {
          orientation: 't',
          start: '',
          end: '',
          offset: '',
          height: '',
          baySpacing: '',
          insulation: 'none',
          leftPanelType: 'pbr',
          leftPanelGauge: '26',
          leftPanelFinish: 'painted',
          rightPanelType: 'pbr',
          rightPanelGauge: '26',
          rightPanelFinish: 'painted',
        },
      ];

      // Add new wall to openings
      const newWallKey = `partition${newPartitionIndex + 1}`;
      newBuilding.openings = {
        ...newBuilding.openings,
        [newWallKey]: [],
      };

      return {
        ...prev,
        buildings: prev.buildings.map((building, index) =>
          index === buildingIndex ? newBuilding : building
        ),
      };
    });
  };

  const removePartition = (buildingIndex, partitionIndex) => {
    setValues((prev) => {
      const newBuilding = { ...prev.buildings[buildingIndex] };

      // Remove partition
      newBuilding.partitions = newBuilding.partitions.filter(
        (_, pIndex) => pIndex !== partitionIndex
      );

      // Remove corresponding wall from openings
      const wallKeyToRemove = `partition${partitionIndex + 1}`;
      const { [wallKeyToRemove]: _, ...remainingOpenings } =
        newBuilding.openings;
      newBuilding.openings = remainingOpenings;

      // Rename remaining partition walls in openings
      Object.keys(newBuilding.openings)
        .filter((key) => key.startsWith('partition'))
        .forEach((key, index) => {
          const newKey = `partition${index + 1}`;
          if (key !== newKey) {
            newBuilding.openings[newKey] = newBuilding.openings[key];
            delete newBuilding.openings[key];
          }
        });

      // Update activePartition if necessary
      const remainingPartitions = newBuilding.partitions.length;
      if (partitionIndex <= prev.activePartition && prev.activePartition > 0) {
        setActivePartition(
          Math.min(prev.activePartition - 1, remainingPartitions - 1)
        );
      }

      return {
        ...prev,
        buildings: prev.buildings.map((building, index) =>
          index === buildingIndex ? newBuilding : building
        ),
      };
    });
  };

  return (
    <>
      <section className="card start">
        <header>
          <h3>Partition Walls</h3>
        </header>
        {values.buildings[activeBuilding].partitions.length > 0 && (
          <div className="onDesktop">
            <div className="tableGrid8">
              <h5>Orientation</h5>
              <h5>
                Start <small>(Left to Right)</small>
              </h5>
              <h5>
                End <small>(Left to Right)</small>
              </h5>
              <h5>
                Offset <small>(Back to Front)</small>
              </h5>
              <h5>Height</h5>
              <h5>Bay Spacing</h5>
              <h5>Insulation</h5>
              <h5></h5>
            </div>
          </div>
        )}
        {values.buildings[activeBuilding].partitions.map(
          (partition, partitionIndex) => (
            <Fragment
              key={`building-${activeBuilding}-partition-${partitionIndex}`}
            >
              <div
                className={`tableGrid8 ${partitionIndex == activePartition ? 'activeRow' : ''}`}
              >
                <ReusableSelect
                  id={`building-${activeBuilding}-partitionWall-${partitionIndex}`}
                  name={`building-${activeBuilding}-partitionWall-${partitionIndex}`}
                  labelClass="offOnDesktop"
                  value={partition.orientation}
                  onChange={(e) =>
                    handlePartitionChange(
                      activeBuilding,
                      partitionIndex,
                      'orientation',
                      e.target.value
                    )
                  }
                  onFocus={() => {
                    if (activePartition !== partitionIndex) {
                      setActivePartition(partitionIndex);
                    }
                  }}
                  options={orientations}
                  label="Orientation"
                />
                <div className="cardInput">
                  <label
                    className="offOnDesktop"
                    htmlFor={`building-${activeBuilding}-partitionStart-${partitionIndex}`}
                  >
                    <span>
                      Start <small>(Left to Right)</small>
                    </span>
                  </label>
                  <input
                    type="text"
                    id={`building-${activeBuilding}-partitionStart-${partitionIndex}`}
                    name={`building-${activeBuilding}-partitionStart-${partitionIndex}`}
                    value={partition.start}
                    onChange={(e) =>
                      handlePartitionChange(
                        activeBuilding,
                        partitionIndex,
                        'start',
                        e.target.value
                      )
                    }
                    onFocus={() => {
                      if (activePartition !== partitionIndex) {
                        setActivePartition(partitionIndex);
                      }
                    }}
                    placeholder="Feet"
                  />
                </div>
                <div className="cardInput">
                  <label
                    className="offOnDesktop"
                    htmlFor={`building-${activeBuilding}-partitionEnd-${partitionIndex}`}
                  >
                    <span>
                      End <small>(Left to Right)</small>
                    </span>
                  </label>
                  <input
                    type="text"
                    id={`building-${activeBuilding}-partitionEnd-${partitionIndex}`}
                    name={`building-${activeBuilding}-partitionEnd-${partitionIndex}`}
                    value={partition.end}
                    onChange={(e) =>
                      handlePartitionChange(
                        activeBuilding,
                        partitionIndex,
                        'end',
                        e.target.value
                      )
                    }
                    onFocus={() => {
                      if (activePartition !== partitionIndex) {
                        setActivePartition(partitionIndex);
                      }
                    }}
                    placeholder="Feet"
                  />
                </div>
                <div className="cardInput">
                  <label
                    className="offOnDesktop"
                    htmlFor={`building-${activeBuilding}-partitionOffset-${partitionIndex}`}
                  >
                    <span>
                      Offset <small>(Back to Front)</small>
                    </span>
                  </label>
                  <input
                    type="text"
                    id={`building-${activeBuilding}-partitionOffset-${partitionIndex}`}
                    name={`building-${activeBuilding}-partitionOffset-${partitionIndex}`}
                    value={partition.offset}
                    onChange={(e) =>
                      handlePartitionChange(
                        activeBuilding,
                        partitionIndex,
                        'offset',
                        e.target.value
                      )
                    }
                    onFocus={() => {
                      if (activePartition !== partitionIndex) {
                        setActivePartition(partitionIndex);
                      }
                    }}
                    placeholder="Feet"
                  />
                </div>
                <div className="cardInput">
                  <label
                    className="offOnDesktop"
                    htmlFor={`building-${activeBuilding}-partitionHeight-${partitionIndex}`}
                  >
                    Height
                  </label>
                  <input
                    type="text"
                    id={`building-${activeBuilding}-partitionHeight-${partitionIndex}`}
                    name={`building-${activeBuilding}-partitionHeight-${partitionIndex}`}
                    value={partition.height}
                    onChange={(e) =>
                      handlePartitionChange(
                        activeBuilding,
                        partitionIndex,
                        'height',
                        e.target.value
                      )
                    }
                    onFocus={() => {
                      if (activePartition !== partitionIndex) {
                        setActivePartition(partitionIndex);
                      }
                    }}
                    placeholder="Leave Blank for Full Ht"
                  />
                </div>
                <div className="cardInput">
                  <label
                    className="offOnDesktop"
                    htmlFor={`building-${activeBuilding}-partitionBaySpacing-${partitionIndex}`}
                  >
                    Bay Spacing
                  </label>
                  <input
                    type="text"
                    id={`building-${activeBuilding}-partitionBaySpacing-${partitionIndex}`}
                    name={`building-${activeBuilding}-partitionBaySpacing-${partitionIndex}`}
                    value={partition.baySpacing}
                    onChange={(e) =>
                      handlePartitionChange(
                        activeBuilding,
                        partitionIndex,
                        'baySpacing',
                        e.target.value
                      )
                    }
                    onFocus={() => {
                      if (activePartition !== partitionIndex) {
                        setActivePartition(partitionIndex);
                      }
                    }}
                    placeholder="Separate Bays with Space"
                  />
                </div>
                <ReusableSelect
                  id={`building-${activeBuilding}-partitionInsulation-${partitionIndex}`}
                  name={`building-${activeBuilding}-partitionInsulation-${partitionIndex}`}
                  value={partition.insulation}
                  labelClass="offOnDesktop"
                  onChange={(e) =>
                    handlePartitionChange(
                      activeBuilding,
                      partitionIndex,
                      'insulation',
                      e.target.value
                    )
                  }
                  onFocus={() => {
                    if (activePartition !== partitionIndex) {
                      setActivePartition(partitionIndex);
                    }
                  }}
                  options={wallInsulation}
                  label="Insuation"
                />
                <button
                  onClick={() =>
                    removePartition(activeBuilding, partitionIndex)
                  }
                  className="icon red deleteRow"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              <div className="divider offOnDesktop"></div>
            </Fragment>
          )
        )}
        {values.buildings[activeBuilding].partitions.length > 5 ? (
          <button type="button" className="button addRow disabled">
            6 Max
          </button>
        ) : (
          <button
            type="button"
            className="button success addRow"
            onClick={() => addPartition(activeBuilding)}
          >
            Add
          </button>
        )}
        {values.buildings[activeBuilding].partitions.length > 0 && (
          <>
            <div className="divider onDesktop"></div>
            <div className="grid2 alignTop">
              <ReusablePanel
                name="PartitionLeft"
                valueKey="left"
                label="Left"
                bldg={activeBuilding}
                idx={activePartition}
                value={
                  values.buildings[activeBuilding].partitions[activePartition]
                }
                onChange={(e, keyString) =>
                  handlePartitionChange(
                    activeBuilding,
                    activePartition,
                    keyString,
                    e.target.value
                  )
                }
              />
              <div className="divider offOnLaptop"></div>
              <ReusablePanel
                name="PartitionRight"
                valueKey="right"
                label="Right"
                bldg={activeBuilding}
                idx={activePartition}
                value={
                  values.buildings[activeBuilding].partitions[activePartition]
                }
                onChange={(e, keyString) =>
                  handlePartitionChange(
                    activeBuilding,
                    activePartition,
                    keyString,
                    e.target.value
                  )
                }
              />
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default BuildingPartitions;
