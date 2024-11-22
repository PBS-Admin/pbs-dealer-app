import { useState, useEffect, Fragment } from 'react';
import ReusablePanel from '../Inputs/ReusablePanel';
import ReusableSelect from '../Inputs/ReusableSelect';
import BaySpacingInput from '../Inputs/BaySpacingInput';
import FeetInchesInput from '../Inputs/FeetInchesInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { wallInsulation, orientations } from '../../util/dropdownOptions';

const BuildingPartitions = ({
  values,
  activeBuilding,
  handlePartitionChange,
  colorClicked,
  setValues,
  locked,
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
          leftPanelColor: 'NC',
          leftTrim: {
            corner: { vendor: 'PBS', gauge: 26, color: 'NC' },
            jamb: { vendor: 'PBS', gauge: 26, color: 'NC' },
            top: { vendor: 'PBS', gauge: 26, color: 'NC' },
            base: { vendor: 'PBS', gauge: 26, color: 'NC' },
          },
          rightPanelType: 'pbr',
          rightPanelGauge: '26',
          rightPanelFinish: 'painted',
          rightPanelColor: 'NC',
          rightTrim: {
            corner: { vendor: 'PBS', gauge: 26, color: 'NC' },
            jamb: { vendor: 'PBS', gauge: 26, color: 'NC' },
            top: { vendor: 'PBS', gauge: 26, color: 'NC' },
            base: { vendor: 'PBS', gauge: 26, color: 'NC' },
          },
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
      {/* Partition Walls */}
      <section className="card">
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
                  label="Orientation:"
                  disabled={locked}
                />
                <FeetInchesInput
                  name={`building-${activeBuilding}-partitionStart-${partitionIndex}`}
                  label={
                    <>
                      Start: <small>(Left to Right)</small>
                    </>
                  }
                  labelClass="offOnDesktop"
                  value={partition.start}
                  allowBlankValue={true}
                  allowZero={true}
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
                  disabled={locked}
                />
                <FeetInchesInput
                  name={`building-${activeBuilding}-partitionEnd-${partitionIndex}`}
                  label={
                    <>
                      End: <small>(Left to Right)</small>
                    </>
                  }
                  labelClass="offOnDesktop"
                  value={partition.end}
                  allowBlankValue={true}
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
                  disabled={locked}
                />
                <FeetInchesInput
                  name={`building-${activeBuilding}-partitionOffset-${partitionIndex}`}
                  label={
                    <>
                      Offset: <small>(Back to Front)</small>
                    </>
                  }
                  labelClass="offOnDesktop"
                  value={partition.offset}
                  allowBlankValue={true}
                  allowZero={true}
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
                  disabled={locked}
                />
                <FeetInchesInput
                  name={`building-${activeBuilding}-partitionHeight-${partitionIndex}`}
                  label="Height:"
                  labelClass="offOnDesktop"
                  value={partition.height}
                  allowBlankValue={true}
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
                  disabled={locked}
                />
                <BaySpacingInput
                  name={`building-${activeBuilding}-partitionBaySpacing-${partitionIndex}`}
                  label="Bay Spacing:"
                  value={partition.baySpacing}
                  labelClass="offOnDesktop"
                  onChange={(name, value) =>
                    handlePartitionChange(
                      activeBuilding,
                      partitionIndex,
                      'baySpacing',
                      value
                    )
                  }
                  onFocus={() => {
                    if (activePartition !== partitionIndex) {
                      setActivePartition(partitionIndex);
                    }
                  }}
                  compareLabel="partition length"
                  compareValue={partition.end - partition.start}
                  disabled={locked}
                />
                <ReusableSelect
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
                  label="Insuation:"
                  disabled={locked}
                />
                <button
                  type="button"
                  className="icon reject deleteRow"
                  onClick={() =>
                    removePartition(activeBuilding, partitionIndex)
                  }
                  disabled={locked}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              <div className="divider offOnDesktop"></div>
            </Fragment>
          )
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
                colorClicked={colorClicked}
                disabled={locked}
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
                colorClicked={colorClicked}
                disabled={locked}
              />
            </div>
          </>
        )}

        {values.buildings[activeBuilding].partitions.length < 6 && !locked && (
          <>
            <div className="divider"></div>
            <div className="buttonFooter">
              <button
                type="button"
                className="addButton"
                onClick={() => addPartition(activeBuilding)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default BuildingPartitions;
