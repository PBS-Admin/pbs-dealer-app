import { useState, useEffect, Fragment } from 'react';
import Image from 'next/image';
import ReusableSelect from '../Inputs/ReusableSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  wallPanels,
  wallGauge,
  wallFinish,
  wallInsulation,
  orientations,
} from '../../util/dropdownOptions';

const BuildingPartitions = ({
  values,
  activeBuilding,
  handlePartitionChange,
  setValues,
  isDesktop,
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
          insulation: 'vrr4',
          leftPanelType: 'pbr',
          leftPanelGauge: '',
          leftPanelFinish: '',
          rightPanelType: 'pbr',
          rightPanelGauge: '',
          rightPanelFinish: '',
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

  const selectedPartitionLeftPanel = wallPanels.find(
    (panel) =>
      panel.id ===
      values.buildings[activeBuilding].partitions[activePartition]
        ?.leftPanelType
  );

  const selectedPartitionRightPanel = wallPanels.find(
    (panel) =>
      panel.id ===
      values.buildings[activeBuilding].partitions[activePartition]
        ?.rightPanelType
  );

  return (
    <>
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
              <div className="tableGrid8">
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
                  className="icon red"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              <div className="divider offOnDesktop"></div>
            </Fragment>
          )
        )}
        {values.buildings[activeBuilding].partitions.length > 5 ? (
          <button type="button" className="button w5 disabled">
            6 Max
          </button>
        ) : (
          <button
            type="button"
            className="button success w5"
            onClick={() => addPartition(activeBuilding)}
          >
            Add
          </button>
        )}
        {values.buildings[activeBuilding].partitions.length > 0 && (
          <>
            <div className="divider onDesktop"></div>
            <div className="grid2">
              <div className="panelGrid">
                <ReusableSelect
                  className="panelType"
                  id={`building-${activeBuilding}-partitionLeftPanels${activePartition}`}
                  name={`building-${activeBuilding}-partitionLeftPanels${activePartition}`}
                  value={
                    values.buildings[activeBuilding].partitions[activePartition]
                      .leftPanelType
                  }
                  onChange={(e) =>
                    handlePartitionChange(
                      activeBuilding,
                      activePartition,
                      'leftPanelType',
                      e.target.value
                    )
                  }
                  options={wallPanels}
                  label="Left Panels:"
                />
                <ReusableSelect
                  className="panelGauge"
                  id={`building-${activeBuilding}-partitionLeftGauge${activePartition}`}
                  name={`building-${activeBuilding}-partitionLeftGauge${activePartition}`}
                  value={
                    values.buildings[activeBuilding].partitions[activePartition]
                      .leftPanelGauge
                  }
                  onChange={(e) =>
                    handlePartitionChange(
                      activeBuilding,
                      activePartition,
                      'leftPanelGauge',
                      e.target.value
                    )
                  }
                  options={wallGauge}
                  label="Gauge:"
                />
                <ReusableSelect
                  className="panelFinish"
                  id={`building-${activeBuilding}-partitionLeftFinish${activePartition}`}
                  name={`building-${activeBuilding}-partitionLeftFinish${activePartition}`}
                  value={
                    values.buildings[activeBuilding].partitions[activePartition]
                      .leftPanelFinish
                  }
                  onChange={(e) =>
                    handlePartitionChange(
                      activeBuilding,
                      activePartition,
                      'leftPanelFinish',
                      e.target.value
                    )
                  }
                  options={wallFinish}
                  label="Finish:"
                />
                <div className="cardInput panelImage">
                  {selectedPartitionLeftPanel &&
                    selectedPartitionLeftPanel.image && (
                      <Image
                        alt={`${selectedPartitionLeftPanel.label}`}
                        src={selectedPartitionLeftPanel.image}
                        className="panelImage"
                      />
                    )}
                </div>
              </div>
              <div className="divider offOnLaptop"></div>
              <div className="panelGrid">
                <ReusableSelect
                  className="panelType"
                  id={`building-${activeBuilding}-partitionRightPanels${activePartition}`}
                  name={`building-${activeBuilding}-partitionRightPanels${activePartition}`}
                  value={
                    values.buildings[activeBuilding].partitions[activePartition]
                      .rightPanelType
                  }
                  onChange={(e) =>
                    handlePartitionChange(
                      activeBuilding,
                      activePartition,
                      'rightPanelType',
                      e.target.value
                    )
                  }
                  options={wallPanels}
                  label="Right Panels:"
                />
                <ReusableSelect
                  className="panelGauge"
                  id={`building-${activeBuilding}-partitionRightGauge${activePartition}`}
                  name={`building-${activeBuilding}-partitionRightGauge${activePartition}`}
                  value={
                    values.buildings[activeBuilding].partitions[activePartition]
                      .rightPanelGauge
                  }
                  onChange={(e) =>
                    handlePartitionChange(
                      activeBuilding,
                      activePartition,
                      'rightPanelGauge',
                      e.target.value
                    )
                  }
                  options={wallGauge}
                  label="Gauge:"
                />
                <ReusableSelect
                  className="panelFinish"
                  id={`building-${activeBuilding}-partitionRightFinish${activePartition}`}
                  name={`building-${activeBuilding}-partitionRightFinish${activePartition}`}
                  value={
                    values.buildings[activeBuilding].partitions[activePartition]
                      .rightPanelFinish
                  }
                  onChange={(e) =>
                    handlePartitionChange(
                      activeBuilding,
                      activePartition,
                      'rightPanelFinish',
                      e.target.value
                    )
                  }
                  options={wallFinish}
                  label="Finish:"
                />
                <div className="cardInput panelImage">
                  {selectedPartitionRightPanel &&
                    selectedPartitionRightPanel.image && (
                      <Image
                        alt={`${selectedPartitionRightPanel.label}`}
                        src={selectedPartitionRightPanel.image}
                        className="panelImage"
                      />
                    )}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default BuildingPartitions;
