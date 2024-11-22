import React from 'react';
import { useState } from 'react';
import ReusableToggle from './ReusableToggle';
import {
  masterColorList,
  PBS_PBR,
  PBS_SSQ,
  PBS_FWQ,
  TM_Armorteck,
  TM_Kynar500,
  MBCI_Signature200,
  MBCI_Signature300,
} from '../../util/dropdownOptions';

const ReusableColorSelect = ({
  isOpen,
  onClose,
  onClick,
  panel = 'pbr',
  gauge = 26,
  value = 'NC',
}) => {
  if (!isOpen) return null;

  const [showColorNames, setShowColorNames] = useState(false);

  const [hoverColor, setHoverColor] = useState(
    masterColorList
      .filter((color) => color.id == value)
      .map((color) => color.label)
  );

  const colorTitleMap = {
    pbr: { 26: '26 gauge PBR Panels', 24: '24 gauge PBR Panels' },
    pbrRev: {
      26: '26 gauge Reverse Rolled PBR Panels',
      24: '24 gauge Reverse Rolled PBR Panels',
    },
    ssq: { 24: '24 gauge SSQ-275 Standing Seam Panels' },
    flat: { 26: '26 gauge Flat Soffit Panels' },
    ms200: { 24: '24 gauge MS-200 Standing Seam Panels' },
    pbrDrip: {
      26: '26 gauge PBR Panels with DripStop',
      24: '24 gauge PBR Panels with DripStop',
    },
    hr34: { 26: '26 gauge HR-34 panels', 24: '24 gauge HR-34 Panels' },
    corr: {
      26: '26 gauge Classic 7/8" Corrugated Panels',
      24: '24 gauge Classic 7/8" Corrugated Panels',
    },
    tuff: { 29: '29 gauge Tuff Rib Panels' },
    doubleLok: { 24: '24 gauge Double-Lok Standing Seam Panels' },
    ultraDek: { 24: '24 gauge Ultra-Dek Standing Seam Panels' },
    battenLok: { 24: '24 gauge BattenLok Standing Seam Panels' },
    superLok: { 24: '24 gauge SuperLok Standing Seam Panels' },
  };

  const colorMap = {
    pbr: { 26: PBS_PBR, 24: TM_Kynar500 },
    pbrRev: { 26: PBS_PBR, 24: TM_Kynar500 },
    ssq: { 24: PBS_SSQ },
    flat: { 26: PBS_FWQ },
    ms200: { 24: TM_Kynar500 },
    pbrDrip: { 26: TM_Armorteck, 24: TM_Kynar500 },
    hr34: { 26: TM_Armorteck, 24: TM_Kynar500 },
    corr: { 26: TM_Armorteck, 24: TM_Kynar500 },
    tuff: { 29: TM_Armorteck },
    doubleLok: { 24: MBCI_Signature300 },
    ultraDek: { 24: MBCI_Signature300 },
    battenLok: { 24: MBCI_Signature300 },
    superLok: { 24: MBCI_Signature300 },
  };

  const getTextContract = (color) => {
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);
    return brightness > 125 ? '#181818' : '#fafafa';
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3>{colorTitleMap[panel][gauge]}</h3>
        <div className="buttonGroup" style={{ width: '100%' }}>
          {colorMap[panel][gauge]
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
                  onClick={onClick}
                  onMouseEnter={() => setHoverColor(color.label)}
                  onMouseLeave={() =>
                    setHoverColor(
                      masterColorList
                        .filter((color) => color.id == value)
                        .map((color) => color.label)
                    )
                  }
                >
                  {color.label}
                </button>
              </div>
            ))}
          <ReusableToggle
            id="colorNameToggle"
            checked={showColorNames}
            onChange={(e) => setShowColorNames(!showColorNames)}
            label="Show Names"
            className="prim right"
          />
        </div>
        <h4>Standard Colors</h4>
        <div className="buttonGroup">
          {colorMap[panel][gauge]
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
                  onClick={onClick}
                  onMouseEnter={() => setHoverColor(color.label)}
                  onMouseLeave={() =>
                    setHoverColor(
                      masterColorList
                        .filter((color) => color.id == value)
                        .map((color) => color.label)
                    )
                  }
                >
                  {showColorNames ? color.label : ''}
                </button>
              </div>
            ))}
        </div>
        {colorMap[panel][gauge].filter(
          (color) => color.optionGroup == 'Premium Colors'
        ).length > 0 && (
          <>
            <h4>Premium Colors</h4>
            <div className="buttonGroup">
              {colorMap[panel][gauge]
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
                      onClick={onClick}
                      onMouseEnter={() => setHoverColor(color.label)}
                      onMouseLeave={() =>
                        setHoverColor(
                          masterColorList
                            .filter((color) => color.id == value)
                            .map((color) => color.label)
                        )
                      }
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
          <div>{hoverColor}</div>
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
