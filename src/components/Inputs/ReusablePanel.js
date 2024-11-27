import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ReusableSelect from '../Inputs/ReusableSelect';
import {
  masterColorList,
  roofPanels,
  roofGauge,
  roofFinish,
  wallPanels,
  wallGauge,
  wallFinish,
  soffitPanels,
  soffitGauge,
  soffitFinish,
} from '../../util/dropdownOptions';

const ReusablePanel = ({
  name,
  label,
  bldg = '0',
  idx = '',
  value,
  className = '',
  onChange,
  disabled,
  colorClicked,
}) => {
  const panelKey = `${name}PanelType`;

  const gaugeKey = `${name}PanelGauge`;

  const finishKey = `${name}PanelFinish`;

  const colorKey = `${name}PanelColor`;

  const [internalPanelValue, setInternalPanelValue] = useState(
    value[panelKey] || ''
  );

  const [internalGaugeValue, setInternalGaugeValue] = useState(
    value[gaugeKey] || ''
  );

  const [internalFinishValue, setInternalFinishValue] = useState(
    value[finishKey] || ''
  );

  const [internalColorValue, setInternalColorValue] = useState(
    value[colorKey] || ''
  );

  const panelMap = {
    roof: roofPanels,
    wall: wallPanels,
    frontWall: wallPanels,
    backWall: wallPanels,
    outerLeftWall: wallPanels,
    leftWall: wallPanels,
    rightWall: wallPanels,
    outerRightWall: wallPanels,
    soffit: soffitPanels,
    canopyRoof: roofPanels,
    canopySoffit: soffitPanels,
    partitionLeft: wallPanels,
    partitionRight: wallPanels,
    wallLiner: wallPanels,
    roofLiner: soffitPanels,
    wainscot: wallPanels,
  };

  const gaugeMap = {
    roof: roofGauge,
    wall: wallGauge,
    frontWall: wallGauge,
    backWall: wallGauge,
    outerLeftWall: wallGauge,
    leftWall: wallGauge,
    rightWall: wallGauge,
    outerRightWall: wallGauge,
    soffit: soffitGauge,
    canopyRoof: roofGauge,
    canopySoffit: soffitGauge,
    partitionLeft: wallGauge,
    partitionRight: wallGauge,
    wallLiner: wallGauge,
    roofLiner: soffitGauge,
    wainscot: wallGauge,
  };

  const finishMap = {
    roof: roofFinish,
    wall: wallFinish,
    frontWall: wallFinish,
    backWall: wallFinish,
    outerLeftWall: wallFinish,
    leftWall: wallFinish,
    rightWall: wallFinish,
    outerRightWall: wallFinish,
    soffit: soffitFinish,
    canopyRoof: roofFinish,
    canopySoffit: soffitFinish,
    partitionLeft: wallFinish,
    partitionRight: wallFinish,
    wallLiner: wallFinish,
    roofLiner: soffitFinish,
    wainscot: wallFinish,
  };

  const selectedPanel = panelMap[name].find(
    (panel) => panel.id === internalPanelValue
  );

  const colorData = (colorId) => {
    return masterColorList.filter((color) => color.id == colorId)[0];
  };

  const overlayColor = (color) => {
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', 0.5)';
  };

  // const getTextContract = (color) => {
  //   const r = parseInt(color.substring(0, 2), 16);
  //   const g = parseInt(color.substring(2, 4), 16);
  //   const b = parseInt(color.substring(4, 6), 16);
  //   const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);
  //   return brightness > 125 ? '#181818' : '#fafafa';
  // };

  useEffect(() => {
    if (value[panelKey] !== undefined && value[panelKey] != '') {
      setInternalPanelValue(value[panelKey]);
    }
  }, [value[panelKey]]);

  useEffect(() => {
    if (value[gaugeKey] !== undefined && value[gaugeKey] != '') {
      setInternalGaugeValue(String.valueOf(value[gaugeKey]));
    }
  }, [value[gaugeKey]]);

  useEffect(() => {
    if (value[finishKey] !== undefined && value[finishKey] != '') {
      setInternalFinishValue(value[finishKey]);
    }
  }, [value[finishKey]]);

  useEffect(() => {
    if (value[colorKey] !== undefined && value[colorKey] != '') {
      setInternalColorValue(value[colorKey]);
    }
  }, [value[colorKey]]);

  const handlePanelChange = (e) => {
    const newValue = e.target.value;
    setInternalPanelValue(newValue);
    onChange(e, panelKey);
  };

  const handleGaugeChange = (e) => {
    const newValue = e.target.value;
    setInternalGaugeValue(newValue);
    onChange(e, gaugeKey);
  };

  const handleFinishChange = (e) => {
    const newValue = e.target.value;
    setInternalFinishValue(newValue);
    onChange(e, finishKey);
    console.log(e);
    // if (newValue == 'galv') {
    //   setInternalColorValue('GV');
    //   // onChange(e, colorKey);
    // } else if (newValue != 'galv' && internalColorValue == 'GV') {
    //   // setInternalColorValue(value[colorKey]);
    //   setInternalColorValue('NC');
    // }
  };

  const handleColorClick = () => {
    colorClicked({
      panelType: name,
      panelLocation: idx,
      buildingIndex: bldg,
      gauge: internalGaugeValue,
      panel: internalPanelValue,
      color: internalColorValue,
    });
  };

  return (
    <div className="panelGrid">
      {panelMap[name] && gaugeMap[name] && finishMap[name] && (
        <>
          <ReusableSelect
            className="panelType"
            name={`building-${bldg}-${name}Panel${idx}`}
            value={internalPanelValue}
            onChange={handlePanelChange}
            options={panelMap[name]}
            label={`${label} Panels:`}
            disabled={disabled}
          />
          {internalPanelValue != 'none' && internalPanelValue != 'open' ? (
            <>
              <ReusableSelect
                className="panelGauge"
                name={`building-${bldg}-${name}Gauge${idx}`}
                value={internalGaugeValue}
                dependantOn={internalPanelValue}
                onChange={handleGaugeChange}
                options={gaugeMap[name]}
                label="Gauge:"
                disabled={disabled}
              />
              <ReusableSelect
                className="panelFinish"
                name={`building-${bldg}-${name}Finish${idx}`}
                value={internalFinishValue}
                dependantOn={internalGaugeValue}
                onChange={handleFinishChange}
                options={finishMap[name]}
                label="Finish:"
                icon={internalFinishValue != 'galv' ? 'color' : ''}
                iconClass={'success'}
                iconOnClick={handleColorClick}
                tooltip="Select Color"
                disabled={disabled}
              />
              <div className="cardInput panelImage">
                {selectedPanel && selectedPanel.image && (
                  <Image
                    alt={`${selectedPanel.label}`}
                    src={selectedPanel.image}
                    className="panelImage"
                  />
                )}
                <div
                  className="imageOverlay"
                  style={{
                    backgroundColor: overlayColor(
                      colorData(internalColorValue).color
                    ),
                  }}
                >
                  {colorData(internalColorValue).label}
                </div>
              </div>
            </>
          ) : (
            <div className="openWall"></div>
          )}
        </>
      )}
    </div>
  );
};

export default ReusablePanel;
