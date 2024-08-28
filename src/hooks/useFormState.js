import { useState } from 'react';

function useFormState(initialState) {
  const [values, setValues] = useState(initialState);
  const [lastChangedWall, setLastChangedWall] = useState('frontSidewall');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (buildingIndex, field, value) => {
    setValues((prev) => {
      const updatedBuildings = prev.buildings.map((building, index) => {
        if (index === buildingIndex) {
          let updatedBuilding = { ...building, [field]: value };

          // Handle calculations for singleSlope and leanTo shapes
          if (building.shape === 'singleSlope' || building.shape === 'leanTo') {
            const { width, lowEaveHeight, highEaveHeight, roofPitch } =
              updatedBuilding;

            switch (field) {
              case 'width':
              case 'lowEaveHeight':
              case 'highEaveHeight':
                // Calculate roof pitch if we have all necessary values
                if (
                  width > 0 &&
                  lowEaveHeight >= 0 &&
                  highEaveHeight > lowEaveHeight
                ) {
                  const calculatedPitch =
                    ((highEaveHeight - lowEaveHeight) / width) * 12;
                  updatedBuilding.roofPitch = Math.min(
                    6,
                    Math.max(0, Number(calculatedPitch.toFixed(2)))
                  );
                }
                break;

              case 'roofPitch':
                // Adjust highEaveHeight based on new roof pitch
                if (width > 0 && lowEaveHeight >= 0 && roofPitch >= 0) {
                  const rise = (width * roofPitch) / 12;
                  updatedBuilding.highEaveHeight = Number(
                    (lowEaveHeight + rise).toFixed(2)
                  );
                }
                break;
            }
          }
          // Future expansion for nonSymmetrical shape
          else if (building.shape === 'nonSymmetrical') {
            // Add calculations for nonSymmetrical shape here
          }

          return updatedBuilding;
        }
        return building;
      });

      return { ...prev, buildings: updatedBuildings };
    });

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

  return {
    values,
    lastChangedWall,
    handleChange,
    handleNestedChange,
    handleCanopyChange,
    handlePartitionChange,
    handleLinerPanelChange,
    setValues,
  };
}

export default useFormState;
