import { useState, useCallback, useRef } from 'react';

function useValidation(initialFormValues, setFormValues) {
  const [validationPrompts, setValidationPrompts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [autoResolveMessage, setAutoResolveMessage] = useState('');
  const changesRef = useRef({});

  const updateFormValues = useCallback(
    (newValues) => {
      setFormValues((prevValues) => {
        const updatedValues = {
          ...prevValues,
          ...newValues,
        };
        return updatedValues;
      });
    },
    [setFormValues]
  );

  const generateChangeMessage = (changes) => {
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
  };

  const autoResolveFields = useCallback(
    async (autoFillRules) => {
      let updatedValues = { ...initialFormValues };
      let autoFilledChanges = { buildings: [] };
      let hasChanges = false;

      if (updatedValues.buildings && Array.isArray(updatedValues.buildings)) {
        const updatedBuildings = updatedValues.buildings.map(
          (building, index) => {
            let updatedBuilding = { ...building };
            let buildingChanges = {};

            for (const rule of autoFillRules) {
              if (rule.condition(building)) {
                const newValue = rule.setValue(building);
                if (newValue !== building[rule.field]) {
                  buildingChanges[rule.field] = newValue;
                  updatedBuilding[rule.field] = newValue;
                  hasChanges = true;
                }
              }
            }

            if (Object.keys(buildingChanges).length > 0) {
              autoFilledChanges.buildings[index] = buildingChanges;
            }

            return updatedBuilding;
          }
        );

        if (hasChanges) {
          updateFormValues({ buildings: updatedBuildings });
          const changeMessage = generateChangeMessage(autoFilledChanges);
          setAutoResolveMessage(
            'The following changes were made to ensure compatibility:\n\n' +
              changeMessage
          );
          setIsDialogOpen(true);
        }
      }

      return hasChanges;
    },
    [initialFormValues, updateFormValues]
  );

  const validateFields = useCallback(
    async (fieldsToValidate, autoFillRules = []) => {
      // First, try to auto-resolve any issues
      const hasAutoResolved = await autoResolveFields(autoFillRules);

      // Then proceed with regular validation
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
  };
}

export default useValidation;
