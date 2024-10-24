import { useState, useCallback, useRef } from 'react';

function useValidation(initialFormValues, setFormValues) {
  const [validationPrompts, setValidationPrompts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [autoResolveMessage, setAutoResolveMessage] = useState('');
  const changesRef = useRef({});

  const updateFormValues = useCallback(
    async (newValues) => {
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
                console.log('Building being validated:', building);

                if (typeof rule.condition !== 'function') {
                  console.error('Rule condition is not a function:', rule);
                  continue;
                }
                let conditionResult;
                try {
                  console.log('Executing condition...');
                  conditionResult = rule.condition(building);
                  console.log('Condition result:', conditionResult);
                } catch (conditionError) {
                  console.error('Error executing condition:', conditionError);
                  continue;
                }

                if (conditionResult) {
                  // Execute setValue with try/catch
                  let newValue;
                  try {
                    console.log('Executing setValue...');
                    newValue = rule.setValue(building);
                    console.log('New value:', newValue);
                  } catch (setValueError) {
                    console.error('Error executing setValue:', setValueError);
                    continue;
                  }

                  // Safe comparison
                  const currentValue = building[rule.field];
                  console.log('Comparing values:', {
                    current: currentValue,
                    new: newValue,
                  });

                  if (newValue !== currentValue) {
                    console.log('Updating values...');
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
              console.log('Building changes exist:', buildingChanges);
              try {
                console.log('Setting autoFilledChanges for index:', index);
                console.log('Current autoFilledChanges:', autoFilledChanges);
                autoFilledChanges.buildings[index] = buildingChanges;
                console.log('Updated autoFilledChanges:', autoFilledChanges);
              } catch (error) {
                console.error('Error setting autoFilledChanges:', error);
              }
            }

            console.log('Returning updatedBuilding:', updatedBuilding);
            return updatedBuilding;
          }
        );

        if (hasChanges) {
          console.log('Has changes, preparing to update...');

          try {
            console.log('Calling updateFormValues with:', {
              buildings: updatedBuildings,
            });
            await updateFormValues({ buildings: updatedBuildings });
            console.log('UpdateFormValues completed');
          } catch (error) {
            console.error('Error in updateFormValues:', error);
            throw error;
          }

          try {
            console.log('Generating change message...');
            console.log('autoFilledChanges:', autoFilledChanges);
            const changeMessage = generateChangeMessage(autoFilledChanges);
            console.log('Change message generated:', changeMessage);

            setAutoResolveMessage(
              'The following changes were made to ensure compatibility:\n\n' +
                changeMessage
            );
            console.log('Auto resolve message set');

            setIsDialogOpen(true);
            console.log('Dialog opened');
          } catch (error) {
            console.error('Error in message generation/dialog:', error);
            throw error;
          }
        }
      }

      console.log('Returning hasChanges:', hasChanges);
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
