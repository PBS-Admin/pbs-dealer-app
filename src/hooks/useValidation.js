import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import useSeismic from './useSeismic';
import { useBuildingContext } from '@/contexts/BuildingContext';
import { useUIContext } from '@/contexts/UIContext';

function useValidation(initialFormValues, setFormValues) {
  // Local State
  const [validationPrompts, setValidationPrompts] = useState([]);
  const [validationIndex, setValidationIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [autoResolveMessage, setAutoResolveMessage] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // References
  const changesRef = useRef({});
  const resolutionRef = useRef(null);

  // Contexts
  const { state, handleChange, complexityInfo, setValues } =
    useBuildingContext();
  const { activeBuilding } = useUIContext();

  // Hooks
  const { getSeismicLoad, seismicData, getSmsLoad, smsData } =
    useSeismic(state);

  const setFormValuesRef = useRef(setFormValues);
  useEffect(() => {
    setFormValuesRef.current = setFormValues;
  }, [setFormValues]);

  // Local Functions
  const fieldsToValidate = [
    {
      field: 'windLoad',
      validate: (value) => value >= 60 && value <= 145,
      message:
        'Wind load should be between 60 and 145 mph. Would you like to update it to 100?',
      suggestedValue: 100,
    },
    {
      field: 'seismicSs',
      validate: (value) => value > 0,
      message:
        'Seismic Ss value was never found, would you like to look it up?',
      suggestedValue: () => seismicData?.response?.data?.ss || 0,
    },
    {
      field: 'seismicS1',
      validate: (value) => value > 0,
      message:
        'Seismic S1 value was never found, would you like to look it up?',
      suggestedValue: () => seismicData?.response?.data?.s1 || 0,
    },
    {
      field: 'seismicSms',
      validate: (value) => value > 0,
      message:
        'Seismic Sms value was never found, would you like to look it up?',
      suggestedValue: () => smsData?.Sms || 0,
    },
    {
      field: 'seismicSm1',
      validate: (value) => value > 0,
      message:
        'Seismic Sm1 value was never found, would you like to look it up?',
      suggestedValue: () => smsData?.Sm1 || 0,
    },
    {
      field: 'seismicFa',
      validate: (value) => value > 0,
      message:
        'Seismic Fa value was never found, would you like to calculate it?',
      suggestedValue: () => seismicData?.response?.data?.fa || 0,
    },
  ];

  const autoFillRules = useMemo(
    () => [
      {
        field: 'backPeakOffset',
        condition: (building) => building.shape === 'symmetrical',
        setValue: (building) => building.width / 2,
      },
      {
        field: 'frontEaveHeight',
        condition: (building) => building.shape === 'symmetrical',
        setValue: (building) => building.backEaveHeight,
      },
      {
        field: 'leftBracingType',
        condition: (building) => building.leftFrame !== 'postAndBeam',
        setValue: (building) => 'none',
      },
    ],
    []
  );

  const resetValidation = useCallback(() => {
    setValidationPrompts([]);
    setValidationIndex(0);
    setIsDialogOpen(false);
    setAutoResolveMessage('');
    setIsValidating(false);
    changesRef.current = {};
    resolutionRef.current = null;
  }, []);

  const updateFormValues = useCallback(async (newValues) => {
    if (typeof setFormValuesRef.current !== 'function') {
      console.error('setFormValues is not a function');
      return;
    }

    try {
      setFormValuesRef.current((prevValues) => ({
        ...prevValues,
        ...newValues,
      }));
    } catch (error) {
      console.error('Error in updateFormValues:', error);
      throw error;
    }
  }, []);

  const generateChangeMessage = useCallback((changes) => {
    const messages = [];
    if (changes.buildings) {
      changes.buildings.forEach((building, index) => {
        Object.entries(building).forEach(([field, value]) => {
          messages.push(
            `Building ${index + 1}: ${field} was updated to ${value}`
          );
        });
      });
    }
    return messages.join('\n');
  }, []);

  const autoResolveFields = useCallback(
    async (autoFillRules) => {
      let updatedValues = { ...initialFormValues };
      let autoFilledChanges = { buildings: [] };
      let hasChanges = false;

      if (!autoFillRules || !Array.isArray(autoFillRules)) {
        console.error('autoFillRules is not an array:', autoFillRules);
        return false;
      }

      if (updatedValues.buildings && Array.isArray(updatedValues.buildings)) {
        const updatedBuildings = updatedValues.buildings.map(
          (building, index) => {
            let updatedBuilding = { ...building };
            let buildingChanges = {};

            for (const rule of autoFillRules) {
              try {
                if (typeof rule.condition !== 'function') {
                  console.error('Rule condition is not a function:', rule);
                  continue;
                }

                if (rule.condition(building)) {
                  const newValue = rule.setValue(building);
                  const currentValue = building[rule.field];

                  if (newValue !== currentValue) {
                    buildingChanges[rule.field] = newValue;
                    updatedBuilding[rule.field] = newValue;
                    hasChanges = true;
                  }
                }
              } catch (error) {
                console.error('Error processing rule:', error);
                continue;
              }
            }

            if (Object.keys(buildingChanges).length > 0) {
              autoFilledChanges.buildings[index] = buildingChanges;
            }

            return updatedBuilding;
          }
        );

        if (hasChanges) {
          await updateFormValues({ buildings: updatedBuildings });

          const changeMessage = generateChangeMessage(autoFilledChanges);

          setAutoResolveMessage(
            'The following changes were made to ensure compatibility:\n' +
              changeMessage
          );

          setIsDialogOpen(true);

          return new Promise((resolve) => {
            resolutionRef.current = resolve;
          });
        }
      }
      return false;
    },
    [initialFormValues, updateFormValues]
  );

  const validateFields = useCallback(async () => {
    try {
      setIsValidating(true);
      const hasAutoResolved = await autoResolveFields(autoFillRules);
      if (hasAutoResolved instanceof Promise) {
        await hasAutoResolved;
      }

      const newValidationPrompts = [];

      for (const {
        field,
        validate,
        message,
        suggestedValue,
      } of fieldsToValidate) {
        if (!validate(initialFormValues[field])) {
          const suggestedValueResolved =
            typeof suggestedValue === 'function'
              ? await suggestedValue(initialFormValues)
              : suggestedValue;

          newValidationPrompts.push({
            field,
            message,
            currentValue: initialFormValues[field],
            suggestedValue: suggestedValueResolved,
            isAutoResolved: false,
          });
        }
      }

      if (newValidationPrompts.length > 0) {
        setValidationPrompts(newValidationPrompts);
        setValidationIndex(0);
        setIsDialogOpen(true);
        return false;
      }

      setIsValidating(false);
      return true;
    } catch (error) {
      console.error('Validation error:', error);
      setIsValidating(false);
      throw error;
    }
  }, [initialFormValues, autoResolveFields]);

  const handleResponse = useCallback(
    (response) => {
      if (autoResolveMessage) {
        setAutoResolveMessage('');
        setIsDialogOpen(false);
        if (resolutionRef.current) {
          resolutionRef.current(response);
          resolutionRef.current = null;
        }

        return;
      }

      const currentPrompt = validationPrompts[validationIndex];

      if (response) {
        changesRef.current[currentPrompt.field] = currentPrompt.suggestedValue;
      }

      const nextIndex = validationIndex + 1;
      if (nextIndex < validationPrompts.length) {
        setValidationIndex(nextIndex);
      } else {
        setIsDialogOpen(false);
        setIsValidating(false);
        if (Object.keys(changesRef.current).length > 0) {
          updateFormValues(changesRef.current);
        }
      }
    },
    [validationIndex, validationPrompts, updateFormValues, autoResolveMessage]
  );

  return {
    validateFields,
    currentPrompt: validationPrompts[validationIndex],
    isDialogOpen,
    handleResponse,
    autoResolveMessage,
    updateFormValues,
    isValidating,
    resetValidation,
  };
}

export default useValidation;
