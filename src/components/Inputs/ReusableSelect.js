import React, { Fragment, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalculator,
  faMagnifyingGlass,
  faCircleInfo,
  faCopy,
  faPaintBrush,
} from '@fortawesome/free-solid-svg-icons';

const ReusableSelect = ({
  name,
  value,
  className = '',
  onChange,
  onFocus,
  options,
  dependantOn,
  label,
  labelClass,
  icon = '',
  iconClass = '',
  iconOnClick = null,
  tooltip,
  defaultValue,
  disabled,
}) => {
  const [internalValue, setInternalValue] = useState(
    value || defaultValue || ''
  );

  const iconMap = {
    calculator: faCalculator,
    lookup: faMagnifyingGlass,
    info: faCircleInfo,
    copy: faCopy,
    color: faPaintBrush,
  };

  //Option Groups
  const groupedOptions = options.reduce((acc, option) => {
    const accOptionGroup = acc[option.optionGroup] || [];

    return {
      ...acc,
      [option.optionGroup]: [...accOptionGroup, option],
    };
  }, {});

  useEffect(() => {
    if (value !== undefined && value != '') {
      setInternalValue(value);
    }
  }, [value]);

  useEffect(() => {
    let needsSet = false;
    let firstItem = '';
    options.map((option) => {
      firstItem =
        option.validFor &&
        option.validFor.includes(dependantOn) &&
        firstItem == ''
          ? option.id
          : firstItem;
      needsSet =
        option.validFor && !option.validFor.includes(dependantOn)
          ? true
          : needsSet;
    });

    if (needsSet) {
      onChange({ target: { name, value: firstItem } });
      setInternalValue(firstItem);
    }
  }, [dependantOn]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange(e);
  };

  return (
    <div className={`cardInput ${className}`}>
      <label className={labelClass} htmlFor={name}>
        <span>{label}</span>
        {icon && (
          <button
            type="button"
            onClick={iconOnClick}
            className={`icon ${iconClass} ${tooltip ? 'tooltip' : ''}`}
          >
            <FontAwesomeIcon icon={iconMap[icon]} />
            {tooltip && <p>{tooltip}</p>}
          </button>
        )}
      </label>
      <select
        className="selectInput"
        id={name}
        name={name}
        value={internalValue}
        onChange={handleChange}
        onFocus={(e) => {
          if (onFocus) {
            onFocus();
          }
        }}
        disabled={disabled}
      >
        {Object.keys(groupedOptions).map((optionGroupName, i) => (
          <Fragment key={`${optionGroupName}${i}`}>
            {optionGroupName !== 'undefined' ? (
              <optgroup label={optionGroupName}>
                {groupedOptions[optionGroupName].map(({ id, label }) => (
                  <option key={label} value={id}>
                    {label}
                  </option>
                ))}
              </optgroup>
            ) : (
              <Fragment key={`${i}`}>
                {groupedOptions[optionGroupName].map(
                  ({ id, label, validFor }) => (
                    <option
                      key={label}
                      value={id}
                      disabled={
                        validFor &&
                        dependantOn &&
                        !validFor.includes(dependantOn) &&
                        !validFor.includes(dependantOn.toString())
                          ? 'disabled'
                          : ''
                      }
                    >
                      {label}
                    </option>
                  )
                )}
              </Fragment>
            )}
          </Fragment>
        ))}
      </select>
    </div>
  );
};

export default ReusableSelect;
