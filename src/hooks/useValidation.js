import { useState, useCallback, useRef, useEffect } from 'react';

function useValidation(initialFormValues, setFormValues) {
  if (!initialFormValues || typeof setFormValues !== 'function') {
    throw new Error('useValidation: Invalid parameters provided');
  }

  const [validationPrompts, setValidationPrompts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [autoResolveMessage, setAutoResolveMessage] = useState('');
  const changesRef = useRef({});

  const setFormValuesRef = useRef(setFormValues);
  useEffect(() => {
    setFormValuesRef.current = setFormValues;
  }, [setFormValues]);

  const updateFormValues = useCallback(async (newValues) => {
    if (typeof setFormValuesRef.current !== 'function') {
      console.error('setFormValues is not a function');
      return;
    }

    try {
      setFormValuesRef.current((prevValues) => {
        const updatedValues = {
          ...prevValues,
          ...newValues,
        };
        return updatedValues;
      });
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
                let conditionResult;
                try {
                  conditionResult = rule.condition(building);
                } catch (conditionError) {
                  console.error('Error executing condition:', conditionError);
                  continue;
                }

                if (conditionResult) {
                  // Execute setValue with try/catch
                  let newValue;
                  try {
                    newValue = rule.setValue(building);
                  } catch (setValueError) {
                    console.error('Error executing setValue:', setValueError);
                    continue;
                  }

                  // Safe comparison
                  const currentValue = building[rule.field];

                  if (newValue !== currentValue) {
                    buildingChanges[rule.field] = newValue;
                    updatedBuilding[rule.field] = newValue;
                    hasChanges = true;
                  }
                }
              } catch (error) {
                console.error('Error processing rule:', error);
                console.error('Error context:', {
                  rule,
                  building,
                  buildingChanges,
                  updatedBuilding,
                });
                continue;
              }
            }

            if (Object.keys(buildingChanges).length > 0) {
              try {
                autoFilledChanges.buildings[index] = buildingChanges;
              } catch (error) {
                console.error('Error setting autoFilledChanges:', error);
              }
            }

            return updatedBuilding;
          }
        );

        if (hasChanges) {
          try {
            await updateFormValues({ buildings: updatedBuildings });
          } catch (error) {
            console.error('Error in updateFormValues:', error);
            throw error;
          }

          try {
            const changeMessage = generateChangeMessage(autoFilledChanges);

            setAutoResolveMessage(
              'The following changes were made to ensure compatibility:\n\n' +
                changeMessage
            );

            setIsDialogOpen(true);
          } catch (error) {
            console.error('Error in message generation/dialog:', error);
            throw error;
          }
        }
      }
      return hasChanges;
    },
    [
      initialFormValues,
      updateFormValues,
      setAutoResolveMessage,
      setIsDialogOpen,
    ]
  );

  const validateFields = useCallback(
    async (fieldsToValidate, autoFillRules = []) => {
      try {
        const hasAutoResolved = await autoResolveFields(autoFillRules);

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
          setCurrentIndex(0);
          if (!hasAutoResolved) {
            setIsDialogOpen(true);
          }
          return false;
        }

        return true;
      } catch (error) {
        console.error('Validation error:', error);
        throw error;
      }
    },
    [initialFormValues, autoResolveFields]
  );

  const handleResponse = useCallback(
    (response) => {
      if (autoResolveMessage) {
        // If we're showing an auto-resolve message, just close the dialog
        setAutoResolveMessage('');
        setIsDialogOpen(false);
        return;
      }

      const currentPrompt = validationPrompts[currentIndex];

      if (response) {
        changesRef.current[currentPrompt.field] = currentPrompt.suggestedValue;
      }

      const nextIndex = currentIndex + 1;
      if (nextIndex < validationPrompts.length) {
        setCurrentIndex(nextIndex);
      } else {
        setIsDialogOpen(false);
        if (Object.keys(changesRef.current).length > 0) {
          updateFormValues(changesRef.current);
        }
      }
    },
    [currentIndex, validationPrompts, updateFormValues, autoResolveMessage]
  );

  return {
    validateFields,
    currentPrompt: validationPrompts[currentIndex],
    isDialogOpen,
    handleResponse,
    autoResolveMessage,
    updateFormValues,
  };
}

export default useValidation;
