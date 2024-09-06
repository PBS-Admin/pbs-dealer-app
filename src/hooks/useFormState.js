import { useState } from 'react';

function useFormState(initialState) {
  const [values, setValues] = useState(initialState);
  const [lastChangedWall, setLastChangedWall] = useState('frontSidewall');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (buildingIndex, field, value) => {
    setValues((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, index) =>
        index === buildingIndex ? { ...building, [field]: value } : building
      ),
    }));
    // Update lastChangedWall when relevant fields change
    if (field === 'lewBaySpacing') setLastChangedWall('leftEndwall');
    if (field === 'rewBaySpacing') setLastChangedWall('rightEndwall');
    if (field === 'sidewallBaySpacing') setLastChangedWall('frontSidewall');
  };

  const handleCanopyChange = (buildingIndex, canopyIndex, field, value) => {
    setValues((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, bIndex) =>
        bIndex === buildingIndex
          ? {
              ...building,
              canopies: building.canopies.map((canopy, cIndex) =>
                cIndex === canopyIndex ? { ...canopy, [field]: value } : canopy
              ),
            }
          : building
      ),
    }));
  };

  const handlePartitionChange = (
    buildingIndex,
    partitionIndex,
    field,
    value
  ) => {
    setValues((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, bIndex) =>
        bIndex === buildingIndex
          ? {
              ...building,
              partitions: building.partitions.map((partition, pIndex) =>
                pIndex === partitionIndex
                  ? { ...partition, [field]: value }
                  : partition
              ),
            }
          : building
      ),
    }));
  };

  const handleLinerPanelChange = (
    buildingIndex,
    linerPanelIndex,
    field,
    value
  ) => {
    setValues((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, bIndex) =>
        bIndex === buildingIndex
          ? {
              ...building,
              linerPanels: building.linerPanels.map((linerPanel, lpIndex) =>
                lpIndex === linerPanelIndex
                  ? { ...linerPanel, [field]: value }
                  : linerPanel
              ),
            }
          : building
      ),
    }));
  };

  const handleWainscotChange = (buildingIndex, wainscotIndex, field, value) => {
    setValues((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, bIndex) =>
        bIndex === buildingIndex
          ? {
              ...building,
              wainscots: building.wainscots.map((wainscot, wIndex) =>
                wIndex === wainscotIndex
                  ? { ...wainscot, [field]: value }
                  : wainscot
              ),
            }
          : building
      ),
    }));
  };

  const handlePartialWallChange = (
    buildingIndex,
    partialWallIndex,
    field,
    value
  ) => {
    setValues((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, bIndex) =>
        bIndex === buildingIndex
          ? {
              ...building,
              partialWalls: building.partialWalls.map((partialWall, pwIndex) =>
                pwIndex === partialWallIndex
                  ? { ...partialWall, [field]: value }
                  : partialWall
              ),
            }
          : building
      ),
    }));
  };

  const handleWallSkirtChange = (
    buildingIndex,
    wallSkirtIndex,
    field,
    value
  ) => {
    setValues((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, bIndex) =>
        bIndex === buildingIndex
          ? {
              ...building,
              wallSkirts: building.wallSkirts.map((wallSkirt, wsIndex) =>
                wsIndex === wallSkirtIndex
                  ? { ...wallSkirt, [field]: value }
                  : wallSkirt
              ),
            }
          : building
      ),
    }));
  };

  return {
    values,
    lastChangedWall,
    handleChange,
    handleNestedChange,
    handleCanopyChange,
    handlePartitionChange,
    handleLinerPanelChange,
    handleWainscotChange,
    handlePartialWallChange,
    handleWallSkirtChange,
    setValues,
  };
}

export default useFormState;
