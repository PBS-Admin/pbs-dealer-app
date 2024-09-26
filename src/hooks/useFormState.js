import useWind from '@/util/oregonWind';
import { useState } from 'react';

function useFormState(initialState) {
  const [values, setValues] = useState(initialState);
  const [lastChangedWall, setLastChangedWall] = useState('frontSidewall');

  const { getWindLoad } = useWind(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => {
      // Parse the value if it's a number field
      const newValue = [
        'collateralLoad',
        'liveLoad',
        'deadLoad',
        'roofLoad',
      ].includes(name)
        ? parseFloat(value)
        : value;

      // Update buildings if the field exists in building objects
      const updatedBuildings = prev.buildings.map((building) => {
        if (name in building) {
          return {
            ...building,
            [name]: building[name] == 0 ? newValue : building[name],
          };
        }
        return building;
      });

      // Return the updated state
      return {
        ...prev,
        [name]: newValue,
        buildings: updatedBuildings,
      };
    });
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
                  lowEaveHeight > 0 &&
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
                if (width > 0 && lowEaveHeight > 0 && roofPitch > 0) {
                  const rise = (width * roofPitch) / 12;
                  updatedBuilding.highEaveHeight = Number(
                    (lowEaveHeight + rise).toFixed(2)
                  );
                }
                break;
            }
          } else if (building.shape === 'nonSymmetrical') {
            const {
              width,
              backPeakOffset,
              backEaveHeight,
              frontEaveHeight,
              backRoofPitch,
              frontRoofPitch,
            } = updatedBuilding;

            switch (field) {
              case 'backEaveHeight':
                // Calculate roof pitch if we have all necessary values
                if (
                  width > 0 &&
                  backEaveHeight > 0 &&
                  frontEaveHeight > 0 &&
                  backPeakOffset > 0 &&
                  frontRoofPitch > 0
                ) {
                  const peak =
                    frontEaveHeight +
                    (frontRoofPitch * (width - backPeakOffset)) / 12;
                  const calculatedPitch =
                    ((peak - backEaveHeight) / backPeakOffset) * 12;
                  updatedBuilding.backRoofPitch = Math.min(
                    6,
                    Math.max(0, Number(calculatedPitch.toFixed(2)))
                  );
                }
                break;
              case 'frontEaveHeight':
                // Calculate roof pitch if we have all necessary values
                if (
                  width > 0 &&
                  backEaveHeight > 0 &&
                  frontEaveHeight > 0 &&
                  backPeakOffset > 0 &&
                  backRoofPitch > 0
                ) {
                  const peak =
                    backEaveHeight + (backRoofPitch * backPeakOffset) / 12;
                  const calculatedPitch =
                    ((peak - frontEaveHeight) / (width - backPeakOffset)) * 12;
                  updatedBuilding.frontRoofPitch = Math.min(
                    6,
                    Math.max(0, Number(calculatedPitch.toFixed(2)))
                  );
                }
                break;
              case 'backRoofPitch':
                // Calculate roof pitch if we have all necessary values
                if (
                  width > 0 &&
                  backRoofPitch > 0 &&
                  frontEaveHeight > 0 &&
                  backPeakOffset > 0 &&
                  frontRoofPitch > 0
                ) {
                  const peak =
                    frontEaveHeight +
                    (frontRoofPitch * (width - backPeakOffset)) / 12;
                  const calculatedEaveHeight =
                    peak - (backPeakOffset * backRoofPitch) / 12;
                  updatedBuilding.backEaveHeight = Math.max(
                    0,
                    Number(calculatedEaveHeight.toFixed(2))
                  );
                }
                break;
              case 'frontRoofPitch':
                // Calculate roof pitch if we have all necessary values
                if (
                  width > 0 &&
                  backRoofPitch > 0 &&
                  backEaveHeight > 0 &&
                  backPeakOffset > 0 &&
                  frontRoofPitch > 0
                ) {
                  const peak =
                    backEaveHeight + (backRoofPitch * backPeakOffset) / 12;
                  const calculatedEaveHeight =
                    peak - ((width - backPeakOffset) * frontRoofPitch) / 12;
                  updatedBuilding.frontEaveHeight = Math.max(
                    0,
                    Number(calculatedEaveHeight.toFixed(2))
                  );
                }
                break;
              case 'backPeakOffset':
                // Calculate roof pitch if we have all necessary values
                if (
                  width > 0 &&
                  frontEaveHeight > 0 &&
                  backEaveHeight > 0 &&
                  backPeakOffset > 0 &&
                  backRoofPitch > 0 &&
                  frontRoofPitch == 0
                ) {
                  const peak =
                    backEaveHeight + (backRoofPitch * backPeakOffset) / 12;
                  const calculatedRoofPitch =
                    ((peak - frontEaveHeight) / (width - backPeakOffset)) * 12;
                  updatedBuilding.frontRoofPitch = Math.min(
                    6,
                    Math.max(0, Number(calculatedRoofPitch.toFixed(2)))
                  );
                } else if (
                  width > 0 &&
                  frontEaveHeight > 0 &&
                  backEaveHeight > 0 &&
                  backPeakOffset > 0 &&
                  frontRoofPitch > 0 &&
                  backRoofPitch == 0
                ) {
                  const peak =
                    frontEaveHeight +
                    (frontRoofPitch * (width - backPeakOffset)) / 12;
                  const calculatedRoofPitch =
                    ((peak - backEaveHeight) / backPeakOffset) * 12;
                  updatedBuilding.backRoofPitch = Math.min(
                    6,
                    Math.max(0, Number(calculatedRoofPitch.toFixed(2)))
                  );
                }
                break;
            }
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

  const handleOpeningChange = (
    buildingIndex,
    wall,
    openingIndex,
    field,
    value
  ) => {
    setValues((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building, bIndex) =>
        bIndex === buildingIndex
          ? {
              ...building,
              openings: {
                ...building.openings,
                [wall]: building.openings[wall].map((opening, oIndex) =>
                  oIndex === openingIndex
                    ? { ...opening, [field]: value }
                    : opening
                ),
              },
            }
          : building
      ),
    }));
  };

  const handleCalcChange = (buildingIndex = 1, field) => {
    setValues((prev) => {
      const building = prev.buildings[buildingIndex];
      // todo: fix this Building index causing undefined buildings
      console.log(building);
      const { width, lowEaveHeight, highEaveHeight, roofPitch } = building;

      let calculatedValue, calcValue;

      switch (field) {
        case 'lowEaveHeight':
          calculatedValue = highEaveHeight - (width * roofPitch) / 12;
          break;
        case 'highEaveHeight':
          calculatedValue = lowEaveHeight + (width * roofPitch) / 12;
          break;
        case 'roofPitch':
          calculatedValue = ((highEaveHeight - lowEaveHeight) / width) * 12;
          break;
        case 'windLoad':
          calculatedValue = getWindLoad;
          break;
        default:
          return prev; // If the field is not recognized, return the previous state unchanged
      }

      // Round the calculated value to 2 decimal places
      calculatedValue = Math.round(calculatedValue * 100) / 100;

      // Perform validation
      if (
        field === 'roofPitch' &&
        (calculatedValue < 0 || calculatedValue > 12 || isNaN(calculatedValue))
      ) {
        console.error('Calculated roof pitch is out of valid range (0-12)');
        return prev; // Return previous state if validation fails
      }

      if (
        (field === 'lowEaveHeight' || field === 'highEaveHeight') &&
        calculatedValue <= 0
      ) {
        console.error('Calculated eave height must be greater than 0');
        return prev; // Return previous state if validation fails
      }

      // If all checks pass, update the state
      return {
        ...prev,
        buildings: prev.buildings.map((building, index) =>
          index === buildingIndex
            ? { ...building, [field]: calculatedValue }
            : building
        ),
      };
    });
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
    handleOpeningChange,
    handleCalcChange,
    setValues,
  };
}

export default useFormState;
