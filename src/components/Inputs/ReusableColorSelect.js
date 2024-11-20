import React from 'react';
import { useState } from 'react';
import ReusableToggle from './ReusableToggle';
import {
  panels_pbr_26,
  panels_flat_26,
  panels_ssq_24,
  panels_pbrDrip_26,
  panels_pbrDrip_24,
} from '../../util/dropdownOptions';

const ReusableColorSelect = ({
  isOpen,
  onClick,
  onClose,
  panel = 'pbr',
  gauge = 26,
  value = 'NC',
}) => {
  if (!isOpen) return null;

  const [showColorNames, setShowColorNames] = useState(false);

  const panelTitle = {
    pbr: { 26: '26 gauge PBR panels' },
    ssq: { 24: '24 gauge SSQ-275 Standing Seam panels' },
    flat: { 26: '26 gauge Flat Soffit panels' },
    pbrDrip: {
      26: '26 gauge PBR panels with DripStop',
      24: '24 gauge PBR panels with DripStop',
    },
  };

  const panelColors = {
    pbr: { 26: panels_pbr_26 },
    ssq: { 24: panels_ssq_24 },
    flat: { 26: panels_flat_26 },
    pbrDrip: { 26: panels_pbrDrip_26, 24: panels_pbrDrip_24 },
  };

  //   const [colorNameHover, setHoverColor] = useState();

  const getTextContract = (color) => {
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);
    return brightness > 125 ? '#181818' : '#fafafa';
  };

  const toggleColorNames = () => {
    setShowColorNames(!showColorNames);
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3>{panelTitle[panel][gauge]}</h3>
        <div className="buttonGroup" style={{ width: '100%' }}>
          {panelColors[panel][gauge]
            .filter((color) => color.optionGroup == 'Category Colors')
            .map((color) => (
              <div
                className={`buttonWrapper ${value == color.id ? 'selected' : ''}`}
              >
                <button
                  type="button"
                  style={{
                    backgroundColor: `#${color.color}`,
                    color: `${getTextContract(color.color)}`,
                  }}
                >
                  {color.label}
                </button>
              </div>
            ))}
          <ReusableToggle
            id="colorNameToggle"
            onClick={toggleColorNames}
            label="Show Names"
            className="prim"
          />
        </div>
        <h4>Standard Colors</h4>
        <div className="buttonGroup">
          {panelColors[panel][gauge]
            .filter(
              (color) =>
                color.optionGroup != 'Category Colors' &&
                color.optionGroup != 'Premium Colors'
            )
            .map((color) => (
              <div
                className={`buttonWrapper ${value == color.id ? 'selected' : ''}`}
              >
                <button
                  type="button"
                  style={{
                    backgroundColor: `#${color.color}`,
                    color: `${getTextContract(color.color)}`,
                  }}
                  //   onHouseEnter={() => console.log(color.label)}
                  //   onHouseLeave={() => setHoverColor('Standard Color')}
                >
                  {showColorNames ? color.label : ''}
                </button>
              </div>
            ))}
        </div>
        {panelColors[panel][gauge].filter(
          (color) => color.optionGroup == 'Premium Colors'
        ).length > 0 && (
          <>
            <h4>Premium Colors</h4>
            <div className="buttonGroup">
              {panelColors[panel][gauge]
                .filter((color) => color.optionGroup == 'Premium Colors')
                .map((color) => (
                  <div
                    className={`buttonWrapper ${value == color.id ? 'selected' : ''}`}
                  >
                    <button
                      type="button"
                      style={{
                        backgroundColor: `#${color.color}`,
                        color: `${getTextContract(color.color)}`,
                      }}
                    >
                      {showColorNames ? color.label : ''}
                    </button>
                  </div>
                ))}
            </div>
          </>
        )}
        <div className="divider" style={{ width: '100%' }}></div>
        <div className="dialog-buttons">
          <div>Standard Color</div>
          <button
            type="button"
            className="prim"
            style={{ width: '70px', marginLeft: 'auto' }}
            onClick={onClose}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReusableColorSelect;
