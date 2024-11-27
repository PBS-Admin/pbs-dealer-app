import React from 'react';
import { useState, Fragment } from 'react';
import ReusableToggle from './ReusableToggle';
import {
  masterColorList,
  PBS_26_PBR,
  PBS_24_SSQ,
  PBS_26_FWQ,
  TM_24_MS200,
  TM_26_PBR,
  TM_24_PBR,
  TM_26_CORR,
  TM_24_CORR,
  MBCI_24_DLOK,
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
  onColorSelect,
  panel = 'pbr',
  gauge = 26,
  value = 'NC',
  panelType,
  panelLocation,
  buildingIndex,
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
    pbr: { 26: PBS_26_PBR, 24: TM_24_PBR },
    pbrRev: { 26: PBS_26_PBR, 24: TM_24_PBR },
    ssq: { 24: PBS_24_SSQ },
    flat: { 26: PBS_26_FWQ },
    ms200: { 24: TM_24_MS200 },
    pbrDrip: { 26: TM_26_PBR, 24: TM_24_PBR },
    hr34: { 26: TM_26_PBR, 24: TM_24_PBR },
    corr: { 26: TM_26_CORR, 24: TM_24_CORR },
    tuff: { 29: TM_26_PBR },
    doubleLok: { 24: MBCI_24_DLOK },
    ultraDek: { 24: MBCI_24_DLOK },
    battenLok: { 24: MBCI_24_DLOK },
    superLok: { 24: MBCI_24_DLOK },
  };

  const handleColorSelect = (colorId) => {
    onColorSelect({
      color: colorId,
      panelType,
      panelLocation,
      buildingIndex,
    });
    onClose();
  };

  const getTextContract = (color) => {
    const r = parseInt(color.toString().substring(0, 2), 16);
    const g = parseInt(color.toString().substring(2, 4), 16);
    const b = parseInt(color.toString().substring(4, 6), 16);
    const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);
    return brightness > 125 ? '#181818' : '#fafafa';
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3>{colorTitleMap[panel][gauge]}</h3>
        <div className="colorGroups">
          {colorMap[panel][gauge].map((group, groupIdx) => (
            <Fragment key={groupIdx}>
              {group.colors?.length > 0 && (
                <>
                  {group.label != '' && (
                    <h4>
                      {group.label}
                      {group.label.includes('*') && (
                        <small>
                          <em> (subject to availability)</em>
                        </small>
                      )}
                    </h4>
                  )}
                  <div
                    className="buttonGroup"
                    style={{ width: '100%', marginBottom: '1px' }}
                  >
                    {group.colors.map((colorId, colorIdx) => (
                      <div
                        key={colorIdx}
                        className={`buttonWrapper ${value == colorId ? 'selected' : ''}`}
                      >
                        <button
                          type="button"
                          style={{
                            backgroundColor: `#${masterColorList.filter((color) => color.id == colorId).map((color) => color.color)}`,
                            color: `${getTextContract(masterColorList.filter((color) => color.id == colorId).map((color) => color.color))}`,
                          }}
                          onClick={() => handleColorSelect(colorId)}
                          onMouseEnter={() =>
                            setHoverColor(
                              masterColorList
                                .filter((color) => color.id == colorId)
                                .map((color) => color.label)
                            )
                          }
                          onMouseLeave={() =>
                            setHoverColor(
                              masterColorList
                                .filter((color) => color.id == value)
                                .map((color) => color.label)
                            )
                          }
                        >
                          {(showColorNames || group.id == 'categoryColors') &&
                            masterColorList
                              .filter((color) => color.id == colorId)
                              .map((color) => color.label)}
                        </button>
                      </div>
                    ))}
                    {group.id == 'categoryColors' && (
                      <ReusableToggle
                        id="colorNameToggle"
                        checked={showColorNames}
                        onChange={(e) => setShowColorNames(!showColorNames)}
                        label="Show Names"
                        className="prim right"
                      />
                    )}
                  </div>
                </>
              )}
            </Fragment>
          ))}
        </div>
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
