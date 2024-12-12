import { useState, useCallback } from 'react';
import { useBuildingContext } from '@/contexts/BuildingContext';
import { useUIContext } from '@/contexts/UIContext';

export const useColorSelection = () => {
  const [colorSelectInfo, setColorSelectInfo] = useState({
    isOpen: false,
    panelType: '',
    panelLocation: '',
    buildingIndex: 0,
    gauge: '',
    panel: '',
    color: '',
  });

  const { activeBuilding } = useUIContext();
  const {
    handlePartitionChange,
    handleNestedChange,
    handleWainscotChange,
    handleCanopyChange,
    handleWallLinerPanelChange,
    handleRoofLinerPanelChange,
    // ... other change handlers from BuildingContext
  } = useBuildingContext();

  const handleColorSelect = useCallback(
    (colorInfo) => {
      const { color, panelType, panelLocation } = colorInfo;

      console.log(panelType);

      // Map of panel types to their respective update functions
      const updateFunctions = {
        partitionLeft: handlePartitionChange,
        partitionRight: handlePartitionChange,
        roof: handleNestedChange,
        roofLiner: handleRoofLinerPanelChange,
        soffit: handleNestedChange,
        wall: handleNestedChange,
        wallLiner: handleWallLinerPanelChange,
        wainscot: handleWainscotChange,
        canopyRoof: handleCanopyChange,
        canopySoffit: handleCanopyChange,
        // Add other panel types and their corresponding handlers
      };

      const updateFunction = updateFunctions[panelType];
      if (updateFunction) {
        switch (panelType) {
          case 'roof':
          case 'soffit':
          case 'wall':
            updateFunction(activeBuilding, `${panelType}PanelColor`, color);
            break;
          case 'partitionLeft':
          case 'partitionRight':
          case 'roofLiner':
          case 'wallLiner':
          case 'wainscot':
          case 'canopyRoof':
          case 'canopySoffit':
            updateFunction(
              activeBuilding,
              panelLocation,
              `${panelType}PanelColor`,
              color
            );
            break;
          default:
            console.warn(`Unhandled panel type: ${panelType}`);
        }
      }

      setColorSelectInfo((prev) => ({ ...prev, isOpen: false }));
    },
    [
      activeBuilding,
      handlePartitionChange,
      handleNestedChange,
      handleWainscotChange,
      handleCanopyChange,
    ]
  );

  const handleColorClick = useCallback(
    (info) => {
      setColorSelectInfo({
        isOpen: true,
        ...info,
        buildingIndex: activeBuilding,
      });
    },
    [activeBuilding]
  );

  return {
    colorSelectInfo,
    handleColorClick,
    handleColorSelect,
  };
};
