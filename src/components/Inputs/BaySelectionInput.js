import React, { useState, useEffect, useCallback } from 'react';

const BaySelectionInput = ({
  value,
  name,
  label,
  className = '',
  onChange,
  baySpacing,
  multiSelect = false,
  disabled = false,
}) => {
  const [selectedBays, setSelectedBays] = useState(value || []);

  // Function to safely get the number of bays
  const getNumberOfBays = useCallback((spacing) => {
    if (Array.isArray(spacing)) {
      return spacing.length;
    }
    if (typeof spacing === 'number') {
      return spacing;
    }
    if (typeof spacing === 'string') {
      const numBays = parseInt(spacing, 10);
      return isNaN(numBays) ? 0 : numBays;
    }
    return 0;
  }, []);

  const numberOfBays = getNumberOfBays(baySpacing);

  useEffect(() => {
    // Update selected bays when baySpacing changes
    setSelectedBays((prevSelected) =>
      prevSelected.filter((bay) => bay <= numberOfBays)
    );
  }, [baySpacing, numberOfBays]);

  const handleBayClick = useCallback(
    (bayNumber) => {
      setSelectedBays((prevSelected) => {
        let newSelected;
        if (multiSelect) {
          newSelected = prevSelected.includes(bayNumber)
            ? prevSelected.filter((bay) => bay !== bayNumber)
            : [...prevSelected, bayNumber].sort((a, b) => a - b);
        } else {
          newSelected = [bayNumber];
        }
        return newSelected;
      });
    },
    [multiSelect]
  );

  // Use useEffect to synchronize the internal state with the parent component
  useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(selectedBays)) {
      onChange(name, selectedBays);
    }
  }, [selectedBays, onChange, name, value]);

  // Use useEffect to update internal state when prop changes
  useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(selectedBays)) {
      setSelectedBays(value || []);
    }
  }, [value]);

  return (
    <div className={`cardInput ${className}`}>
      <h5>{label}</h5>
      <div
        style={{
          // display: disabled ? 'none' : 'flex',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {[...Array(numberOfBays)].map((_, index) => {
          const bayNumber = index + 1;
          const isSelected = selectedBays.includes(bayNumber);
          return (
            <button
              type="button"
              key={bayNumber}
              onClick={() => handleBayClick(bayNumber)}
              style={{
                width: '40px',
                height: '40px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: isSelected ? '#103494' : 'white',
                color: isSelected ? 'white' : 'black',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
              disabled={disabled}
            >
              {bayNumber}
              <label htmlFor={`${name}-insetBay${bayNumber}`}>
                <input
                  id={`${name}-insetBay${bayNumber}`}
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  style={{
                    position: 'absolute',
                    opacity: 0,
                    cursor: 'pointer',
                  }}
                  disabled={disabled}
                />
              </label>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BaySelectionInput;
