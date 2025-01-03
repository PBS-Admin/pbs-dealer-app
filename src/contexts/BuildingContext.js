'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import {
  initialState as defaultInitialState,
  buildingTemplate,
  partitionTemplate,
  roofLinerTemplate,
  roofReliteTemplate,
  wallLinerTemplate,
  wainscotTemplate,
  partialWallTemplate,
  wallSkirtTemplate,
  canopyTemplate,
  wallReliteTemplate,
  openingTemplate,
  mandoorTemplate,
  noteTemplate,
  calculateBuildingMetrics,
} from '../lib/initialState';

const BuildingContext = createContext(undefined);

// Define action types
export const BUILDING_ACTIONS = {
  ADD_BUILDING: 'ADD_BUILDING',
  REMOVE_BUILDING: 'REMOVE_BUILDING',
  UPDATE_BUILDING: 'UPDATE_BUILDING',
  UPDATE_NESTED: 'UPDATE_NESTED',
  // Partitions
  ADD_PARTITION: 'ADD_PARTITION',
  REMOVE_PARTITION: 'REMOVE_PARTITION',
  UPDATE_PARTITION: 'UPDATE_PARTITION',
  // Roof Options
  ADD_ROOF_LINER: 'ADD_ROOF_LINER',
  REMOVE_ROOF_LINER: 'REMOVE_ROOF_LINER',
  UPDATE_ROOF_LINER: 'UPDATE_ROOF_LINER',
  ADD_ROOF_RELITE: 'ADD_ROOF_RELITE',
  REMOVE_ROOF_RELITE: 'REMOVE_ROOF_RELITE',
  UPDATE_ROOF_RELITE: 'UPDATE_ROOF_RELITE',
  // Wall Options
  ADD_WALL_LINER: 'ADD_WALL_LINER',
  REMOVE_WALL_LINER: 'REMOVE_WALL_LINER',
  UPDATE_WALL_LINER: 'UPDATE_WALL_LINER',
  ADD_WAINSCOT: 'ADD_WAINSCOT',
  REMOVE_WAINSCOT: 'REMOVE_WAINSCOT',
  UPDATE_WAINSCOT: 'UPDATE_WAINSCOT',
  ADD_PARTIAL_WALL: 'ADD_PARTIAL_WALL',
  REMOVE_PARTIAL_WALL: 'REMOVE_PARTIAL_WALL',
  UPDATE_PARTIAL_WALL: 'UPDATE_PARTIAL_WALL',
  ADD_WALL_SKIRT: 'ADD_WALL_SKIRT',
  REMOVE_WALL_SKIRT: 'REMOVE_WALL_SKIRT',
  UPDATE_WALL_SKIRT: 'UPDATE_WALL_SKIRT',
  ADD_CANOPY: 'ADD_CANOPY',
  REMOVE_CANOPY: 'REMOVE_CANOPY',
  UPDATE_CANOPY: 'UPDATE_CANOPY',
  ADD_WALL_RELITE: 'ADD_WALL_RELITE',
  REMOVE_WALL_RELITE: 'REMOVE_WALL_RELITE',
  UPDATE_WALL_RELITE: 'UPDATE_WALL_RELITE',
  // Openings
  ADD_OPENING: 'ADD_OPENING',
  REMOVE_OPENING: 'REMOVE_OPENING',
  UPDATE_OPENING: 'UPDATE_OPENING',

  // Accessories
  ADD_MANDOOR: 'ADD_MANDOOR',
  REMOVE_MANDOOR: 'REMOVE_MANDOOR',
  UPDATE_MANDOOR: 'UPDATE_MANDOOR',

  // Notes
  ADD_NOTE: 'ADD_NOTE',
  REMOVE_NOTE: 'REMOVE_NOTE',
  UPDATE_NOTE: 'UPDATE_NOTE',

  UPDATE_CALC: 'UPDATE_CALC',
  SET_VALUES: 'SET_VALUES',
};

// Reducer function
function buildingReducer(state, action) {
  switch (action.type) {
    // * Building Actions
    case BUILDING_ACTIONS.ADD_BUILDING: {
      return {
        ...state,
        buildings: [...state.buildings, { ...buildingTemplate }],
      };
    }

    case BUILDING_ACTIONS.REMOVE_BUILDING: {
      const { buildingIndex } = action.payload;
      const newBuildings = state.buildings.filter(
        (_, index) => index !== buildingIndex
      );

      return {
        ...state,
        buildings: newBuildings,
      };
    }

    case BUILDING_ACTIONS.COPY_BUILDING: {
      const { sourceBuildingIndex, targetIndex } = action.payload;
      const newBuildings = [...state.buildings];
      const sourceBuilding = newBuildings[sourceBuildingIndex];
      const buildingToCopy = JSON.parse(JSON.stringify(sourceBuilding));

      buildingToCopy.offsetX = '';
      buildingToCopy.offsetY = '';
      buildingToCopy.rotation = '';
      buildingToCopy.commonWall = '';

      if (targetIndex === 'new') {
        newBuildings.push(buildingToCopy);
      } else {
        newBuildings[targetIndex] = {
          ...newBuildings[targetIndex],
          ...buildingToCopy,
          offsetX: newBuildings[targetIndex].offsetX,
          offsetY: newBuildings[targetIndex].offsetY,
          rotation: newBuildings[targetIndex].rotation,
          commonWall: newBuildings[targetIndex].commonWall,
        };
      }

      return { ...state, buildings: newBuildings };
    }

    case BUILDING_ACTIONS.UPDATE_BUILDING: {
      const { name, value, type, checked } = action.payload;
      let updatedState = { ...state };

      if (type === 'checkbox') {
        // Update the main state value
        updatedState[name] = checked;

        // Only update buildings if they exist and the field exists in buildings
        if (state.buildings && Array.isArray(state.buildings)) {
          const updatedBuildings = state.buildings.map((building) => {
            if (building && name in building) {
              return {
                ...building,
                [name]: building[name] === false ? checked : building[name],
              };
            }
            return building;
          });
          updatedState.buildings = updatedBuildings;
        }
      } else {
        // Handle numeric fields
        const newValue = [
          'thermalFactor',
          'seismicSms',
          'seismicSm1',
          'seismicSs',
          'seismicS1',
          'windLoad',
          'collateralLoad',
          'liveLoad',
          'deadLoad',
          'roofSnowLoad',
          'groundSnowLoad',
          'contractPrice',
          'contractWeight',
        ].includes(name)
          ? parseFloat(value)
          : value;

        // Update the main state value
        updatedState[name] = newValue;

        // Only update buildings if they exist and the field exists in buildings
        if (state.buildings && Array.isArray(state.buildings)) {
          const fieldsToCompare = [
            'collateralLoad',
            'liveLoad',
            'deadLoad',
            'roofSnowLoad',
          ];
          const selectsToCompare = ['thermalFactor', 'windEnclosure'];

          const updatedBuildings = state.buildings.map((building) => {
            if (building && name in building) {
              if (fieldsToCompare.includes(name)) {
                return {
                  ...building,
                  [name]: building[name] < newValue ? newValue : building[name],
                };
              } else if (selectsToCompare.includes(name)) {
                return {
                  ...building,
                  [name]: newValue,
                };
              }
              return {
                ...building,
                [name]: building[name] == 0 ? newValue : building[name],
              };
            }
            return building;
          });
          updatedState.buildings = updatedBuildings;
        }
      }

      return updatedState;
    }

    case BUILDING_ACTIONS.UPDATE_NESTED: {
      const { buildingIndex, field, fieldValue } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) => {
          if (index === buildingIndex) {
            let updatedValue = fieldValue;
            if (
              field.includes('Qty') ||
              field.includes('Gauge') ||
              field.includes('gauge')
            ) {
              updatedValue = parseInt(fieldValue);
            } else if (field.includes('thermalFactor')) {
              updatedValue = parseFloat(fieldValue);
            } else if (
              field.includes('deadLoad') ||
              field.includes('liveLoad') ||
              field.includes('roofSnowLoad') ||
              field.includes('collateralLoad')
            ) {
              updatedValue = Math.round((fieldValue * 100) / 100);
            }
            return { ...building, [field]: updatedValue };
          }
          return building;
        }),
      };
    }

    // * Partition
    case BUILDING_ACTIONS.ADD_PARTITION: {
      const { buildingIndex } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) => {
          if (index === buildingIndex) {
            const newPartitionIndex = building.partitions.length;

            // Add new wall to openings
            const newWallKey = `partition${newPartitionIndex + 1}`;

            return {
              ...building,
              partitions: [...building.partitions, partitionTemplate],
              openings: {
                ...building.openings,
                [newWallKey]: [],
              },
            };
          }
          return building;
        }),
      };
    }

    case BUILDING_ACTIONS.REMOVE_PARTITION: {
      const { buildingIndex, partitionIndex } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) => {
          if (index === buildingIndex) {
            // Remove partition
            const newPartitions = building.partitions.filter(
              (_, pIndex) => pIndex !== partitionIndex
            );

            // Remove and rename partition walls in openings
            const newOpenings = { ...building.openings };
            const wallKeyToRemove = `partition${partitionIndex + 1}`;
            delete newOpenings[wallKeyToRemove];

            // Rename remaining partition walls
            Object.keys(newOpenings)
              .filter((key) => key.startsWith('partition'))
              .forEach((key, index) => {
                const newKey = `partition${index + 1}`;
                if (key !== newKey) {
                  newOpenings[newKey] = newOpenings[key];
                  delete newOpenings[key];
                }
              });

            return {
              ...building,
              partitions: newPartitions,
              openings: newOpenings,
            };
          }
          return building;
        }),
      };
    }

    case BUILDING_ACTIONS.UPDATE_PARTITION: {
      const { buildingIndex, partitionIndex, field, value } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, bIndex) =>
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
      };
    }

    // * Roof Options
    case BUILDING_ACTIONS.ADD_ROOF_LINER: {
      const { buildingIndex } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) =>
          index === buildingIndex
            ? {
                ...building,
                roofLinerPanels: [
                  ...building.roofLinerPanels,
                  roofLinerTemplate,
                ],
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.REMOVE_ROOF_LINER: {
      const { buildingIndex, roofLinerPanelIndex } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) =>
          index === buildingIndex
            ? {
                ...building,
                roofLinerPanels: building.roofLinerPanels.filter(
                  (_, lpIndex) => lpIndex !== roofLinerPanelIndex
                ),
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.UPDATE_ROOF_LINER: {
      const { buildingIndex, roofLinerPanelIndex, field, value } =
        action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, bIndex) =>
          bIndex === buildingIndex
            ? {
                ...building,
                roofLinerPanels: building.roofLinerPanels.map(
                  (panel, lpIndex) =>
                    lpIndex === roofLinerPanelIndex
                      ? {
                          ...panel,
                          [field]:
                            field.includes('Qty') ||
                            field.includes('Gauge') ||
                            field.includes('gauge')
                              ? parseInt(value)
                              : value,
                        }
                      : panel
                ),
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.ADD_ROOF_RELITE: {
      const { buildingIndex } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) =>
          index === buildingIndex
            ? {
                ...building,
                roofRelites: [...building.roofRelites, roofReliteTemplate],
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.REMOVE_ROOF_RELITE: {
      const { buildingIndex, roofReliteIndex } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) =>
          index === buildingIndex
            ? {
                ...building,
                roofRelites: building.roofRelites.filter(
                  (_, wsIndex) => wsIndex !== roofReliteIndex
                ),
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.UPDATE_ROOF_RELITE: {
      const { buildingIndex, roofReliteIndex, field, value } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, bIndex) =>
          bIndex === buildingIndex
            ? {
                ...building,
                roofRelites: building.roofRelites.map((relite, rrIndex) =>
                  rrIndex === roofReliteIndex
                    ? { ...relite, [field]: value }
                    : relite
                ),
              }
            : building
        ),
      };
    }

    // * Wall Options
    case BUILDING_ACTIONS.ADD_WALL_LINER: {
      const { buildingIndex } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) =>
          index === buildingIndex
            ? {
                ...building,
                wallLinerPanels: [
                  ...building.wallLinerPanels,
                  wallLinerTemplate,
                ],
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.REMOVE_WALL_LINER: {
      const { buildingIndex, wallLinerPanelIndex } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) =>
          index === buildingIndex
            ? {
                ...building,
                wallLinerPanels: building.wallLinerPanels.filter(
                  (_, lpIndex) => lpIndex !== wallLinerPanelIndex
                ),
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.UPDATE_WALL_LINER: {
      const { buildingIndex, wallLinerPanelIndex, field, value } =
        action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, bIndex) =>
          bIndex === buildingIndex
            ? {
                ...building,
                wallLinerPanels: building.wallLinerPanels.map(
                  (panel, lpIndex) =>
                    lpIndex === wallLinerPanelIndex
                      ? {
                          ...panel,
                          [field]:
                            field.includes('Qty') ||
                            field.includes('Gauge') ||
                            field.includes('gauge')
                              ? parseInt(value)
                              : value,
                        }
                      : panel
                ),
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.ADD_WAINSCOT: {
      const { buildingIndex } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) =>
          index === buildingIndex
            ? {
                ...building,
                wainscots: [...building.wainscots, wainscotTemplate],
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.REMOVE_WAINSCOT: {
      const { buildingIndex, wainscotIndex } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) =>
          index === buildingIndex
            ? {
                ...building,
                wainscots: building.wainscots.filter(
                  (_, wIndex) => wIndex !== wainscotIndex
                ),
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.UPDATE_WAINSCOT: {
      const { buildingIndex, wainscotIndex, field, value } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, bIndex) =>
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
      };
    }

    case BUILDING_ACTIONS.ADD_PARTIAL_WALL: {
      const { buildingIndex } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) =>
          index === buildingIndex
            ? {
                ...building,
                partialWalls: [...building.partialWalls, partialWallTemplate],
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.REMOVE_PARTIAL_WALL: {
      const { buildingIndex, partialWallIndex } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) =>
          index === buildingIndex
            ? {
                ...building,
                partialWalls: building.partialWalls.filter(
                  (_, pwIndex) => pwIndex !== partialWallIndex
                ),
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.UPDATE_PARTIAL_WALL: {
      const { buildingIndex, partialWallIndex, field, value } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, bIndex) =>
          bIndex === buildingIndex
            ? {
                ...building,
                partialWalls: building.partialWalls.map((wall, pwIndex) =>
                  pwIndex === partialWallIndex
                    ? { ...wall, [field]: value }
                    : wall
                ),
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.ADD_WALL_SKIRT: {
      const { buildingIndex } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) =>
          index === buildingIndex
            ? {
                ...building,
                wallSkirts: [...building.wallSkirts, wallSkirtTemplate],
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.REMOVE_WALL_SKIRT: {
      const { buildingIndex, wallSkirtIndex } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) =>
          index === buildingIndex
            ? {
                ...building,
                wallSkirts: building.wallSkirts.filter(
                  (_, wsIndex) => wsIndex !== wallSkirtIndex
                ),
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.UPDATE_WALL_SKIRT: {
      const { buildingIndex, wallSkirtIndex, field, value } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, bIndex) =>
          bIndex === buildingIndex
            ? {
                ...building,
                wallSkirts: building.wallSkirts.map((skirt, wsIndex) =>
                  wsIndex === wallSkirtIndex
                    ? { ...skirt, [field]: value }
                    : skirt
                ),
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.ADD_CANOPY: {
      const { buildingIndex } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) =>
          index === buildingIndex
            ? {
                ...building,
                canopies: [...building.canopies, canopyTemplate],
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.REMOVE_CANOPY: {
      const { buildingIndex, canopyIndex } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) =>
          index === buildingIndex
            ? {
                ...building,
                canopies: building.canopies.filter(
                  (_, cIndex) => cIndex !== canopyIndex
                ),
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.UPDATE_CANOPY: {
      const { buildingIndex, canopyIndex, field, value } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, bIndex) =>
          bIndex === buildingIndex
            ? {
                ...building,
                canopies: building.canopies.map((canopy, cIndex) =>
                  cIndex === canopyIndex
                    ? {
                        ...canopy,
                        [field]:
                          field.includes('Qty') ||
                          field.includes('Gauge') ||
                          field.includes('gauge')
                            ? parseInt(value)
                            : value,
                      }
                    : canopy
                ),
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.ADD_WALL_RELITE: {
      const { buildingIndex } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) =>
          index === buildingIndex
            ? {
                ...building,
                wallRelites: [...building.wallRelites, wallReliteTemplate],
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.REMOVE_WALL_RELITE: {
      const { buildingIndex, wallReliteIndex } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) =>
          index === buildingIndex
            ? {
                ...building,
                wallRelites: building.wallRelites.filter(
                  (_, wsIndex) => wsIndex !== wallReliteIndex
                ),
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.UPDATE_WALL_RELITE: {
      const { buildingIndex, wallReliteIndex, field, value } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, bIndex) =>
          bIndex === buildingIndex
            ? {
                ...building,
                wallRelites: building.wallRelites.map((relite, wrIndex) =>
                  wrIndex === wallReliteIndex
                    ? { ...relite, [field]: value }
                    : relite
                ),
              }
            : building
        ),
      };
    }

    //  * Openings
    case BUILDING_ACTIONS.ADD_OPENING: {
      const { buildingIndex, wall } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) =>
          index === buildingIndex
            ? {
                ...building,
                openings: {
                  ...building.openings,
                  [wall]: [...(building.openings[wall] || []), openingTemplate],
                },
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.REMOVE_OPENING: {
      const { buildingIndex, wall, openingIndex } = action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, index) =>
          index === buildingIndex
            ? {
                ...building,
                openings: {
                  ...building.openings,
                  [wall]: (building.openings[wall] || []).filter(
                    (_, oIndex) => oIndex !== openingIndex
                  ),
                },
              }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.UPDATE_OPENING: {
      const { buildingIndex, wall, openingIndex, field, value } =
        action.payload;
      return {
        ...state,
        buildings: state.buildings.map((building, bIndex) =>
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
      };
    }

    // * Accessories
    case BUILDING_ACTIONS.ADD_MANDOOR: {
      return {
        ...state,
        mandoors: [...state.mandoors, mandoorTemplate],
      };
    }

    case BUILDING_ACTIONS.REMOVE_MANDOOR: {
      const { mandoorIndex } = action.payload;
      return {
        ...state,
        mandoors: state.mandoors.filter((_, index) => index !== mandoorIndex),
      };
    }

    case BUILDING_ACTIONS.UPDATE_MANDOOR: {
      const { mandoorIndex, field, value, type, checked } = action.payload;
      return {
        ...state,
        mandoors: state.mandoors.map((mandoor, mdIndex) => {
          if (mdIndex === mandoorIndex) {
            if (type === 'checkbox') {
              if ((field === 'panic' || field === 'deadBolt') && checked) {
                return {
                  ...mandoor,
                  [field]: checked,
                  [field === 'panic' ? 'deadBolt' : 'panic']: false,
                };
              }
              return { ...mandoor, [field]: checked };
            }
            return { ...mandoor, [field]: value };
          }
          return mandoor;
        }),
      };
    }

    // * Notes

    case BUILDING_ACTIONS.ADD_NOTE: {
      return {
        ...state,
        notes: [...state.notes, noteTemplate],
      };
    }

    case BUILDING_ACTIONS.REMOVE_NOTE: {
      const { noteIndex } = action.payload;
      return {
        ...state,
        notes: state.notes.filter((_, index) => index !== noteIndex),
      };
    }

    case BUILDING_ACTIONS.UPDATE_NOTE: {
      const { noteIndex, field, value } = action.payload;
      return {
        ...state,
        notes: state.notes.map((note, nIndex) => {
          if (nIndex === noteIndex) {
            return { ...note, [field]: value };
          }
          return note;
        }),
      };
    }
    case BUILDING_ACTIONS.UPDATE_CALC: {
      const { buildingIndex, field } = action.payload;
      const building = state.buildings[buildingIndex];
      const { width, backEaveHeight, frontEaveHeight, backRoofPitch } =
        building;
      let calculatedValue;

      switch (field) {
        case 'backEaveHeight':
          calculatedValue = frontEaveHeight - (width * backRoofPitch) / 12;
          break;
        case 'frontEaveHeight':
          calculatedValue = backEaveHeight + (width * backRoofPitch) / 12;
          break;
        case 'backRoofPitch':
          calculatedValue = ((frontEaveHeight - backEaveHeight) / width) * 12;
          break;
        default:
          return state;
      }

      calculatedValue = Math.round(calculatedValue * 100) / 100;

      if (
        (field === 'backRoofPitch' &&
          (calculatedValue < 0 ||
            calculatedValue > 12 ||
            isNaN(calculatedValue))) ||
        ((field === 'backEaveHeight' || field === 'frontEaveHeight') &&
          calculatedValue <= 0)
      ) {
        return state;
      }

      return {
        ...state,
        buildings: state.buildings.map((building, index) =>
          index === buildingIndex
            ? { ...building, [field]: calculatedValue }
            : building
        ),
      };
    }

    case BUILDING_ACTIONS.SET_VALUES: {
      const newState =
        typeof action.payload === 'function'
          ? action.payload(state)
          : action.payload;

      if (JSON.stringify(newState) === JSON.stringify(state)) {
        return state;
      }

      return {
        ...state, // copy in original state first for backwards compatability
        ...newState,
      };
    }

    default:
      return state;
  }
}

// Provider component
export function BuildingProvider({
  children,
  initialState = defaultInitialState,
}) {
  const [state, dispatch] = useReducer(buildingReducer, {
    ...initialState,
  });

  // Call complexity hook to grab complexity info
  const complexityInfo = useMemo(
    () => calculateBuildingMetrics(state),
    [state]
  );

  useEffect(() => {
    // Reset state when component mounts
    setValues(initialState);
  }, [initialState]);

  // * Building
  const addBuilding = useCallback(() => {
    dispatch({ type: BUILDING_ACTIONS.ADD_BUILDING });
  }, []);

  const removeBuilding = useCallback((buildingIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.REMOVE_BUILDING,
      payload: { buildingIndex },
    });
  }, []);

  const copyBuilding = useCallback((sourceBuildingIndex, targetIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.COPY_BUILDING,
      payload: { sourceBuildingIndex, targetIndex },
    });
  }, []);

  const handleChange = useCallback((e) => {
    dispatch({
      type: BUILDING_ACTIONS.UPDATE_BUILDING,
      payload: {
        name: e.target.name,
        value: e.target.value,
        type: e.target.type,
        checked: e.target.checked,
      },
    });
  }, []);

  const handleNestedChange = useCallback((buildingIndex, field, value) => {
    dispatch({
      type: BUILDING_ACTIONS.UPDATE_NESTED,
      payload: { buildingIndex, field, fieldValue: value },
    });
  }, []);

  // * Partitions
  const addPartition = useCallback((buildingIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.ADD_PARTITION,
      payload: { buildingIndex },
    });
  }, []);

  const removePartition = useCallback((buildingIndex, partitionIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.REMOVE_PARTITION,
      payload: { buildingIndex, partitionIndex },
    });
  }, []);

  const handlePartitionChange = useCallback(
    (buildingIndex, partitionIndex, field, value) => {
      dispatch({
        type: BUILDING_ACTIONS.UPDATE_PARTITION,
        payload: { buildingIndex, partitionIndex, field, value },
      });
    },
    []
  );

  // * Roof Options
  const addRoofLinerPanel = useCallback((buildingIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.ADD_ROOF_LINER,
      payload: { buildingIndex },
    });
  }, []);

  const removeRoofLinerPanel = useCallback(
    (buildingIndex, roofLinerPanelIndex) => {
      dispatch({
        type: BUILDING_ACTIONS.REMOVE_ROOF_LINER,
        payload: { buildingIndex, roofLinerPanelIndex },
      });
    },
    []
  );

  const handleRoofLinerPanelChange = useCallback(
    (buildingIndex, roofLinerPanelIndex, field, value) => {
      dispatch({
        type: BUILDING_ACTIONS.UPDATE_ROOF_LINER,
        payload: { buildingIndex, roofLinerPanelIndex, field, value },
      });
    },
    []
  );

  const addRoofRelite = useCallback((buildingIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.ADD_ROOF_RELITE,
      payload: { buildingIndex },
    });
  }, []);

  const removeRoofRelite = useCallback((buildingIndex, roofReliteIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.REMOVE_ROOF_RELITE,
      payload: { buildingIndex, roofReliteIndex },
    });
  }, []);

  const handleRoofReliteChange = useCallback(
    (buildingIndex, roofReliteIndex, field, value) => {
      dispatch({
        type: BUILDING_ACTIONS.UPDATE_ROOF_RELITE,
        payload: { buildingIndex, roofReliteIndex, field, value },
      });
    },
    []
  );

  // * Wall Options
  const addWallLinerPanel = useCallback((buildingIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.ADD_WALL_LINER,
      payload: { buildingIndex },
    });
  }, []);

  const removeWallLinerPanel = useCallback(
    (buildingIndex, wallLinerPanelIndex) => {
      dispatch({
        type: BUILDING_ACTIONS.REMOVE_WALL_LINER,
        payload: { buildingIndex, wallLinerPanelIndex },
      });
    },
    []
  );

  const handleWallLinerPanelChange = useCallback(
    (buildingIndex, wallLinerPanelIndex, field, value) => {
      dispatch({
        type: BUILDING_ACTIONS.UPDATE_WALL_LINER,
        payload: { buildingIndex, wallLinerPanelIndex, field, value },
      });
    },
    []
  );

  const addWainscot = useCallback((buildingIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.ADD_WAINSCOT,
      payload: { buildingIndex },
    });
  }, []);

  const removeWainscot = useCallback((buildingIndex, wainscotIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.REMOVE_WAINSCOT,
      payload: { buildingIndex, wainscotIndex },
    });
  }, []);

  const handleWainscotChange = useCallback(
    (buildingIndex, wainscotIndex, field, value) => {
      dispatch({
        type: BUILDING_ACTIONS.UPDATE_WAINSCOT,
        payload: { buildingIndex, wainscotIndex, field, value },
      });
    },
    []
  );

  const addPartialWall = useCallback((buildingIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.ADD_PARTIAL_WALL,
      payload: { buildingIndex },
    });
  }, []);

  const removePartialWall = useCallback((buildingIndex, partialWallIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.REMOVE_PARTIAL_WALL,
      payload: { buildingIndex, partialWallIndex },
    });
  }, []);

  const handlePartialWallChange = useCallback(
    (buildingIndex, partialWallIndex, field, value) => {
      dispatch({
        type: BUILDING_ACTIONS.UPDATE_PARTIAL_WALL,
        payload: { buildingIndex, partialWallIndex, field, value },
      });
    },
    []
  );

  const addWallSkirt = useCallback((buildingIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.ADD_WALL_SKIRT,
      payload: { buildingIndex },
    });
  }, []);

  const removeWallSkirt = useCallback((buildingIndex, wallSkirtIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.REMOVE_WALL_SKIRT,
      payload: { buildingIndex, wallSkirtIndex },
    });
  }, []);

  const handleWallSkirtChange = (
    buildingIndex,
    wallSkirtIndex,
    field,
    value
  ) => {
    dispatch({
      type: BUILDING_ACTIONS.UPDATE_WALL_SKIRT,
      payload: { buildingIndex, wallSkirtIndex, field, value },
    });
  };

  const addCanopy = useCallback((buildingIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.ADD_CANOPY,
      payload: { buildingIndex },
    });
  }, []);

  const removeCanopy = useCallback((buildingIndex, canopyIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.REMOVE_CANOPY,
      payload: { buildingIndex, canopyIndex },
    });
  }, []);

  const handleCanopyChange = (buildingIndex, canopyIndex, field, value) => {
    dispatch({
      type: BUILDING_ACTIONS.UPDATE_CANOPY,
      payload: { buildingIndex, canopyIndex, field, value },
    });
  };

  const addWallRelite = useCallback((buildingIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.ADD_WALL_RELITE,
      payload: { buildingIndex },
    });
  }, []);

  const removeWallRelite = useCallback((buildingIndex, wallReliteIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.REMOVE_WALL_RELITE,
      payload: { buildingIndex, wallReliteIndex },
    });
  }, []);

  const handleWallReliteChange = (
    buildingIndex,
    wallReliteIndex,
    field,
    value
  ) => {
    dispatch({
      type: BUILDING_ACTIONS.UPDATE_WALL_RELITE,
      payload: { buildingIndex, wallReliteIndex, field, value },
    });
  };

  // * Openings
  const addOpening = useCallback((buildingIndex, wall) => {
    dispatch({
      type: BUILDING_ACTIONS.ADD_OPENING,
      payload: { buildingIndex, wall },
    });
  }, []);

  const removeOpening = useCallback((buildingIndex, wall, openingIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.REMOVE_OPENING,
      payload: { buildingIndex, wall, openingIndex },
    });
  }, []);

  const handleOpeningChange = useCallback(
    (buildingIndex, wall, openingIndex, field, value) => {
      dispatch({
        type: BUILDING_ACTIONS.UPDATE_OPENING,
        payload: {
          buildingIndex,
          wall,
          openingIndex,
          field,
          value,
        },
      });
    },
    []
  );

  // * Accessories
  const addMandoor = useCallback(() => {
    dispatch({
      type: BUILDING_ACTIONS.ADD_MANDOOR,
    });
  }, []);

  const removeMandoor = useCallback((mandoorIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.REMOVE_MANDOOR,
      payload: { mandoorIndex },
    });
  }, []);

  const handleMandoorChange = (mandoorIndex, field, e) => {
    dispatch({
      type: BUILDING_ACTIONS.UPDATE_MANDOOR,
      payload: {
        mandoorIndex,
        field,
        value: e.target.value,
        type: e.target.type,
        checked: e.target.checked,
      },
    });
  };

  // * Notes
  const addNote = useCallback(() => {
    dispatch({
      type: BUILDING_ACTIONS.ADD_NOTE,
    });
  }, []);

  const removeNote = useCallback((noteIndex) => {
    dispatch({
      type: BUILDING_ACTIONS.REMOVE_NOTE,
      payload: { noteIndex },
    });
  }, []);

  const handleNoteChange = (noteIndex, field, e) => {
    dispatch({
      type: BUILDING_ACTIONS.UPDATE_NOTE,
      payload: {
        noteIndex,
        field,
        value: e.target.value,
      },
    });
  };

  const handleCalcChange = (buildingIndex, field) => {
    dispatch({
      type: BUILDING_ACTIONS.UPDATE_CALC,
      payload: { buildingIndex, field },
    });
  };

  const setValues = useCallback((newValues) => {
    dispatch({
      type: BUILDING_ACTIONS.SET_VALUES,
      payload: newValues,
    });
  }, []);

  const value = {
    state,
    complexityInfo,
    addBuilding,
    removeBuilding,
    copyBuilding,
    handleChange,
    handleNestedChange,

    // Partitions
    addPartition,
    removePartition,
    handlePartitionChange,

    // Roof Options
    addRoofLinerPanel,
    removeRoofLinerPanel,
    handleRoofLinerPanelChange,
    addRoofRelite,
    removeRoofRelite,
    handleRoofReliteChange,

    // Wall Options
    addWallLinerPanel,
    removeWallLinerPanel,
    handleWallLinerPanelChange,
    addWainscot,
    removeWainscot,
    handleWainscotChange,
    addPartialWall,
    removePartialWall,
    handlePartialWallChange,
    addWallSkirt,
    removeWallSkirt,
    handleWallSkirtChange,
    addCanopy,
    removeCanopy,
    handleCanopyChange,
    addWallRelite,
    removeWallRelite,
    handleWallReliteChange,

    // Openings
    addOpening,
    removeOpening,
    handleOpeningChange,

    // Accessories
    addMandoor,
    removeMandoor,
    handleMandoorChange,

    // Notes
    addNote,
    removeNote,
    handleNoteChange,

    handleCalcChange,
    setValues,
  };

  return (
    <BuildingContext.Provider value={value}>
      {children}
    </BuildingContext.Provider>
  );
}

// Custom hook to use the building context
export function useBuildingContext() {
  const context = useContext(BuildingContext);
  if (!context) {
    throw new Error(
      'useBuildingContext must be used within a BuildingProvider'
    );
  }
  return context;
}
