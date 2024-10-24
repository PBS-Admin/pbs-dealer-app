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
      console.log('autoFillRules:', autoFillRules); // Check structure
      console.log('initialFormValues:', initialFormValues);

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
            console.log('Processing building:', index);
            let updatedBuilding = { ...building };
            let buildingChanges = {};

            for (const rule of autoFillRules) {
              console.log('Rule:', rule);
              console.log('Rule condition type:', typeof rule.condition);
              console.log('Rule setValue type:', typeof rule.setValue);

              try {
                if (rule.condition(building)) {
                  const newValue = rule.setValue(building);
                  if (newValue !== building[rule.field]) {
                    buildingChanges[rule.field] = newValue;
                    updatedBuilding[rule.field] = newValue;
                    hasChanges = true;
                  }
                }
              } catch (error) {
                console.error('Error processing rule:', error);
                throw error;
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
    [
      initialFormValues,
      updateFormValues,
      setAutoResolveMessage,
      setIsDialogOpen,
    ]
  );

  const validateFields = useCallback(
    async (fieldsToValidate, autoFillRules = []) => {
      console.log('fieldsToValidate:', fieldsToValidate); // Check structure
      console.log('autoFillRules:', autoFillRules); // Check structure

      try {
        console.log('autoResolveFields type:', typeof autoResolveFields);
        const hasAutoResolved = await autoResolveFields(autoFillRules);
        console.log('hasAutoResolved:', hasAutoResolved);

        // Then proceed with regular validation
        const newValidationPrompts = [];

        for (const {
          field,
          validate,
          message,
          suggestedValue,
        } of fieldsToValidate) {
          console.log('Validating field:', field);
          console.log('validate function type:', typeof field.validate);

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
  };
}

export default useValidation;
