import { useState } from 'react';

function useFormState(initialState) {
  const [values, setValues] = useState(initialState);

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

  return {
    values,
    handleChange,
    handleNestedChange,
    handleCanopyChange,
    handlePartitionChange,
    handleLinerPanelChange,
    setValues,
  };
}

export default useFormState;
