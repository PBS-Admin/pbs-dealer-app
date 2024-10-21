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
} from '@fortawesome/free-solid-svg-icons';

const ReusableSlider = ({
  type = 'leftRight',
  value,
  name,
  label,
  labelClass = '',
  increment = 10,
  onChange,
  negative = true,
  noBlankValue = true,
  allowZero = noBlankValue ? true : false,
  disabled,
}) => {
  const validValues = Array.from(
    { length: Math.ceil(360 / increment) },
    (_, i) => i * increment
  );

  const handleChangeDecrease = (e) => {
    // console.log(validValues);
    const distValue =
      !negative && value - increment < 0 ? 0 : value - increment;
    const rotValue =
      value - increment < 0 ? value - increment + 360 : value - increment;
    const newValue = type == 'rotation' ? rotValue : distValue;
    onChange(name, newValue);
  };

  const handleChangeIncrease = (e) => {
    const distValue = value + increment;
    const rotValue =
      value + increment >= 360 ? value + increment - 360 : value + increment;
    const newValue = type == 'rotation' ? rotValue : distValue;
    onChange(name, newValue);
  };

  const handleInputChange = (e) => {
    const newInputValue = e.target.value;
    onChange(name, newInputValue);
  };

  const iconLeftSide =
    type == 'leftRight'
      ? faChevronLeft
      : type == 'upDown'
        ? faChevronDown
        : type == 'rotation'
          ? faArrowRotateRight
          : faChevronLeft;

  const iconRightSide =
    type == 'leftRight'
      ? faChevronRight
      : type == 'upDown'
        ? faChevronUp
        : type == 'rotation'
          ? faArrowRotateLeft
          : faChevronRight;

  return (
    <div className="cardInput">
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      <div className="sliderGrid">
        <button
          className="sliderLeftButton"
          type="button"
          tabIndex="-1"
          onClick={handleChangeDecrease}
          disabled={disabled}
        >
          <FontAwesomeIcon icon={iconLeftSide} />
        </button>
        {type == 'rotation' ? (
          <ReusableInteger
            name={name}
            value={value}
            validValues={validValues}
            defaultValue={0}
            suffix="°"
            showLabel={false}
            onChange={handleInputChange}
            disabled={disabled}
          />
        ) : (
          <FeetInchesInput
            name={name}
            value={value}
            showLabel={false}
            negative={negative}
            noBlankValue={noBlankValue}
            allowZero={allowZero}
            onChange={onChange}
            placeholder=""
            disabled={disabled}
          />
        )}
        <button
          className="sliderRightButton"
          type="button"
          tabIndex="-1"
          onClick={handleChangeIncrease}
          disabled={disabled}
        >
          <FontAwesomeIcon icon={iconRightSide} />
        </button>
      </div>
    </div>
  );
};

export default ReusableSlider;
