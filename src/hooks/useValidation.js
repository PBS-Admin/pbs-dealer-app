import { useState, useCallback, useRef, useEffect } from 'react';

function useValidation(initialFormValues, setFormValues) {
  const [validationPrompts, setValidationPrompts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [autoResolveMessage, setAutoResolveMessage] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const changesRef = useRef({});
  const resolutionRef = useRef(null);

  const setFormValuesRef = useRef(setFormValues);
  useEffect(() => {
    setFormValuesRef.current = setFormValues;
  }, [setFormValues]);

  const resetValidation = useCallback(() => {
    setValidationPrompts([]);
    setCurrentIndex(0);
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

  const validateFields = useCallback(
    async (fieldsToValidate, autoFillRules = []) => {
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
          setCurrentIndex(0);
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
    },
    [initialFormValues, autoResolveFields]
  );

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

      const currentPrompt = validationPrompts[currentIndex];

      if (response) {
        changesRef.current[currentPrompt.field] = currentPrompt.suggestedValue;
      }

      const nextIndex = currentIndex + 1;
      if (nextIndex < validationPrompts.length) {
        setCurrentIndex(nextIndex);
      } else {
        setIsDialogOpen(false);
        setIsValidating(false);
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
    isValidating,
    resetValidation,
  };
}

export default useValidation;
