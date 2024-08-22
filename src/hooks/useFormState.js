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

  const handleDeeplyNestedChange = (
    buildingIndex,
    canopyIndex,
    field,
    value
  ) => {
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

  return {
    values,
    handleChange,
    handleNestedChange,
    handleDeeplyNestedChange,
    setValues,
  };
}

export default useFormState;
