import { useState, useCallback, useRef } from 'react';

function useValidation(initialFormValues, setFormValues) {
  const [validationPrompts, setValidationPrompts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const changesRef = useRef({});

  const updateFormValues = useCallback(
    (newValues) => {
      setFormValues((prevValues) => ({
        ...prevValues,
        ...newValues,
      }));
    },
    [setFormValues]
  );

  const validateFields = useCallback(
    async (fieldsToValidate) => {
      const newValidationPrompts = [];
      const values = initialFormValues;

      for (const {
        field,
        validate,
        message,
        suggestedValue,
      } of fieldsToValidate) {
        if (!validate(values[field])) {
          const suggestedValueResolved =
            typeof suggestedValue === 'function'
              ? await suggestedValue()
              : suggestedValue;

          newValidationPrompts.push({
            field,
            message,
            currentValue: values[field],
            suggestedValue: suggestedValueResolved,
          });
        }
      }

      setValidationPrompts(newValidationPrompts);
      setCurrentIndex(0);
      changesRef.current = {};

      if (newValidationPrompts.length > 0) {
        setIsDialogOpen(true);
        return false;
      }

      return true;
    },
    [initialFormValues]
  );

  const handleResponse = useCallback(
    (response) => {
      const currentPrompt = validationPrompts[currentIndex];

      if (response) {
        // User confirmed the update
        changesRef.current[currentPrompt.field] = currentPrompt.suggestedValue;
      }

      const nextIndex = currentIndex + 1;
      if (nextIndex < validationPrompts.length) {
        setCurrentIndex(nextIndex);
      } else {
        // We've reached the end of the prompts
        setIsDialogOpen(false);
        // Update form values with all accumulated changes
        updateFormValues(changesRef.current);
      }
    },
    [currentIndex, validationPrompts, updateFormValues]
  );

  return {
    validateFields,
    currentPrompt: validationPrompts[currentIndex],
    isDialogOpen,
    handleResponse,
  };
}

export default useValidation;
