import { useState, useEffect, Fragment } from 'react';
import ReusablePanel from '../Inputs/ReusablePanel';
import ReusableSelect from '../Inputs/ReusableSelect';
import BaySpacingInput from '../Inputs/BaySpacingInput';
import FeetInchesInput from '../Inputs/FeetInchesInput';
import ReusableColorSelect from '../Inputs/ReusableColorSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { wallInsulation, orientations } from '../../util/dropdownOptions';
import { useUIContext } from '@/contexts/UIContext';
import { useBuildingContext } from '@/contexts/BuildingContext';
import { useColorSelection } from '@/hooks/useColorSelection';
import BuildingFlatSketch from '../BuildingFlatSketch';

const BuildingPartitions = ({ locked }) => {
  // Local State
  const [activePartition, setActivePartition] = useState(0);

  // Contexts
  const { activeBuilding } = useUIContext();
  const { state, addPartition, removePartition, handlePartitionChange } =
    useBuildingContext();

  // Hooks
  const { colorSelectInfo, handleColorClick, handleColorSelect } =
    useColorSelection();

  // Local Functions
  const handleAddPartition = () => {
    addPartition(activeBuilding);
    setActivePartition(state.buildings[activeBuilding].partitions.length);
  };

  const handleRemovePartition = (partitionIndex) => {
    removePartition(activeBuilding, partitionIndex);
    if (partitionIndex === activePartition) {
      setActivePartition(0);
    } else if (partitionIndex < activePartition) {
      setActivePartition((prev) => prev - 1);
    }
  };

  // JSX
  return (
    <>
      {/* Partition Walls */}
      <section className="card">
        <header>
          <h3>Partition Walls</h3>
        </header>
        {state.buildings[activeBuilding].partitions.length > 0 && (
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
        {state.buildings[activeBuilding].partitions.map(
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
                  compareValue={
                    partition.orientation === 't'
                      ? Math.min(
                          state.buildings[activeBuilding].width,
                          partition.end
                        )
                      : Math.min(
                          state.buildings[activeBuilding].length,
                          partition.end
                        )
                  }
                  compareLabel={
                    partition.end !== undefined && partition.end !== null
                      ? 'end'
                      : partition.orientation === 't'
                        ? 'width'
                        : 'length'
                  }
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
                  compareValue={
                    // Only compare with start if start has a valid value
                    partition.start !== undefined &&
                    partition.start !== null &&
                    partition.start !== '' &&
                    partition.start > 0
                      ? partition.start
                      : null // Use null to skip validation when start is not meaningful
                  }
                  compareLabel={
                    // Only set label to 'start' if start has a valid value
                    partition.start !== undefined &&
                    partition.start !== null &&
                    partition.start !== '' &&
                    partition.start > 0
                      ? 'start'
                      : partition.orientation === 't'
                        ? 'width'
                        : 'length'
                  }
                  disabled={locked}
                />
                {/*// todo: make sure this gets changed to bay spacing */}
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
                    handleRemovePartition(activeBuilding, partitionIndex)
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

        {state.buildings[activeBuilding].partitions.length > 0 && (
          <>
            <div className="divider onDesktop"></div>
            <div className="grid2 alignTop">
              <ReusablePanel
                name="partitionLeft"
                label="Left"
                bldg={activeBuilding}
                idx={activePartition}
                value={
                  state.buildings[activeBuilding].partitions[activePartition]
                }
                onChange={(e, keyString) =>
                  handlePartitionChange(
                    activeBuilding,
                    activePartition,
                    keyString,
                    e.target.value
                  )
                }
                colorClicked={handleColorClick}
                disabled={locked}
              />
              <div className="divider offOnLaptop"></div>
              <ReusablePanel
                name="partitionRight"
                label="Right"
                bldg={activeBuilding}
                idx={activePartition}
                value={
                  state.buildings[activeBuilding].partitions[activePartition]
                }
                onChange={(e, keyString) =>
                  handlePartitionChange(
                    activeBuilding,
                    activePartition,
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

        {state.buildings[activeBuilding].partitions.length < 6 && !locked && (
          <>
            <div className="divider"></div>
            <div className="buttonFooter">
              <button
                type="button"
                className="addButton"
                onClick={() => handleAddPartition(activeBuilding)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </>
        )}
      </section>

      <section className="card">
        <header>
          <h3>Overhead Sketch</h3>
        </header>
        <BuildingFlatSketch
          activeWall={'partRoof'}
          activePartition={activePartition}
        />
      </section>

      <ReusableColorSelect
        isOpen={colorSelectInfo.isOpen}
        onClose={() => handleColorClick({ ...colorSelectInfo, isOpen: false })}
        onColorSelect={handleColorSelect}
        {...colorSelectInfo}
      />
    </>
  );
};

export default BuildingPartitions;
