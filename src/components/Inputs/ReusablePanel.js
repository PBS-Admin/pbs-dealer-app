import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ReusableSelect from '../Inputs/ReusableSelect';
import {
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
  valueKey = name,
  label,
  bldg = '0',
  idx = '',
  value,
  className = '',
  onChange,
  disabled,
  colorClicked,
}) => {
  const panelKey = `${valueKey}PanelType`;

  const gaugeKey = `${valueKey}PanelGauge`;

  const finishKey = `${valueKey}PanelFinish`;

  const [internalPanelValue, setInternalPanelValue] = useState(
    value[panelKey] || ''
  );

  const [internalGaugeValue, setInternalGaugeValue] = useState(
    value[gaugeKey] || ''
  );

  const [internalFinishValue, setInternalFinishValue] = useState(
    value[finishKey] || ''
  );

  const panelMap = {
    Roof: roofPanels,
    Wall: wallPanels,
    FrontWall: wallPanels,
    BackWall: wallPanels,
    OuterLeftWall: wallPanels,
    LeftWall: wallPanels,
    RightWall: wallPanels,
    OuterRightWall: wallPanels,
    Soffit: soffitPanels,
    CanopyRoof: roofPanels,
    CanopySoffit: soffitPanels,
    PartitionLeft: wallPanels,
    PartitionRight: wallPanels,
    WallLiner: wallPanels,
    RoofLiner: soffitPanels,
    Wainscot: wallPanels,
  };

  const gaugeMap = {
    Roof: roofGauge,
    Wall: wallGauge,
    FrontWall: wallGauge,
    BackWall: wallGauge,
    OuterLeftWall: wallGauge,
    LeftWall: wallGauge,
    RightWall: wallGauge,
    OuterRightWall: wallGauge,
    Soffit: soffitGauge,
    CanopyRoof: roofGauge,
    CanopySoffit: soffitGauge,
    PartitionLeft: wallGauge,
    PartitionRight: wallGauge,
    WallLiner: wallGauge,
    RoofLiner: soffitGauge,
    Wainscot: wallGauge,
  };

  const finishMap = {
    Roof: roofFinish,
    Wall: wallFinish,
    FrontWall: wallFinish,
    BackWall: wallFinish,
    OuterLeftWall: wallFinish,
    LeftWall: wallFinish,
    RightWall: wallFinish,
    OuterRightWall: wallFinish,
    Soffit: soffitFinish,
    CanopyRoof: roofFinish,
    CanopySoffit: soffitFinish,
    PartitionLeft: wallFinish,
    PartitionRight: wallFinish,
    WallLiner: wallFinish,
    RoofLiner: soffitFinish,
    Wainscot: wallFinish,
  };

  const selectedPanel = panelMap[name].find(
    (panel) => panel.id === internalPanelValue
  );

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
                // icon={'color'}
                // iconClass={'success'}
                // iconOnClick={colorClicked}
                // tooltip="Select Color"
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
