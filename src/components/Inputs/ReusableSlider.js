import React, { useState, useEffect } from 'react';
import FeetInchesInput from '../Inputs/FeetInchesInput';
import ReusableInteger from '../Inputs/ReusableInteger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faChevronUp,
  faArrowRotateRight,
  faArrowRotateLeft,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';

const ReusableSlider = ({
  type = 'leftRight',
  value,
  name,
  row = false,
  label,
  labelClass = '',
  increment = 10,
  onChange,
  onFocus,
  negative = true,
  allowBlankValue = true,
  allowZero = allowBlankValue ? false : true,
  placeholder = '',
  disabled,
}) => {
  const validValues = Array.from(
    { length: Math.ceil(360 / increment) },
    (_, i) => i * increment
  );

  const handleChangeDecrease = (name) => {
    const distValue =
      !negative && value - increment < 0 ? 0 : value - increment;
    const rotValue =
      value - increment < 0 ? value - increment + 360 : value - increment;
    const newValue = type == 'rotation' ? rotValue : distValue;
    const event = { target: { name: name, value: newValue } };
    onChange(event);
  };

  const handleChangeIncrease = (name) => {
    const distValue = value + increment;
    const rotValue =
      value + increment >= 360 ? value + increment - 360 : value + increment;
    const newValue = type == 'rotation' ? rotValue : distValue;
    const event = { target: { name: name, value: newValue } };
    onChange(event);
  };

  const handleInputChange = (e) => {
    const newInputValue = e.target.value;
    const event = { target: { name: name, value: newInputValue } };
    onChange(event);
  };

  const iconLeftSide =
    type == 'leftRight'
      ? faChevronLeft
      : type == 'upDown'
        ? faChevronDown
        : type == 'rotation'
          ? faArrowRotateRight
          : type == 'number'
            ? faMinus
            : faChevronLeft;

  const iconRightSide =
    type == 'leftRight'
      ? faChevronRight
      : type == 'upDown'
        ? faChevronUp
        : type == 'rotation'
          ? faArrowRotateLeft
          : type == 'number'
            ? faPlus
            : faChevronRight;

  const rowLayout = row ? 'row' : '';

  return (
    <div className={`cardInput ${rowLayout}`}>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      <div className="sliderGrid">
        <button
          className="sliderLeftButton"
          type="button"
          tabIndex="-1"
          onClick={() => {
            handleChangeDecrease(name);
          }}
          disabled={disabled}
        >
          <FontAwesomeIcon icon={iconLeftSide} />
        </button>
        {type == 'number' ? (
          <ReusableInteger
            name={name}
            value={value}
            validValues={validValues}
            negative={negative}
            allowBlankValue={allowBlankValue}
            showLabel={false}
            onChange={onChange}
            onFocus={onFocus}
            placeholder={placeholder}
            disabled={disabled}
          />
        ) : type == 'rotation' ? (
          <ReusableInteger
            name={name}
            value={value}
            validValues={validValues}
            allowZero={true}
            suffix="°"
            showLabel={false}
            onChange={() => {
              handleInputChange(name);
            }}
            placeholder={placeholder}
            disabled={disabled}
          />
        ) : (
          <FeetInchesInput
            name={name}
            value={value}
            showLabel={false}
            negative={negative}
            allowBlankValue={allowBlankValue}
            allowZero={allowZero}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
          />
        )}
        <button
          className="sliderRightButton"
          type="button"
          tabIndex="-1"
          onClick={() => {
            handleChangeIncrease(name);
          }}
          disabled={disabled}
        >
          <FontAwesomeIcon icon={iconRightSide} />
        </button>
      </div>
    </div>
  );
};

export default ReusableSlider;
