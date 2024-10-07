import React from 'react';
import Image from 'next/image';
import ReusableSelect from '../Inputs/ReusableSelect';
import {
  shapes,
  frames,
  FrameOptions,
  SidewallBracingType,
  EndwallBracingType,
  breakPoints,
  girtTypes,
  girtSpacing,
  baseCondition,
  purlinSpacing,
  roofPanels,
  roofGauge,
  roofFinish,
  wallPanels,
  wallGauge,
  wallFinish,
  roofInsulation,
  wallInsulation,
  enclosure,
  thermalFactor,
} from '../../util/dropdownOptions';
import FeetInchesInput from '../Inputs/FeetInchesInput';
import RoofPitchInput from '../Inputs/RoofPitchInput';
import BaySpacingInput from '../Inputs/BaySpacingInput';
import BaySelectionInput from '../Inputs/BaySelectionInput';
import ReusableDouble from '../Inputs/ReusableDouble';

const BuildingLayout = ({
  values,
  activeBuilding,
  handleNestedChange,
  handleCalcChange,
}) => {
  const selectedRoofPanel = roofPanels.find(
    (panel) => panel.id === values.buildings[activeBuilding].roofPanelType
  );

  const selectedWallPanel = wallPanels.find(
    (panel) => panel.id === values.buildings[activeBuilding].wallPanelType
  );
  return (
    <>
      <section className="card start">
        <header>
          <h3>Building Shape</h3>
        </header>

        <div className="grid4">
          <fieldset className="radioGroup span2 center">
            {shapes.map(({ id, label }) => (
              <div key={id}>
                <input
                  type="radio"
                  id={id}
                  name="shape"
                  value={id}
                  checked={values.buildings[activeBuilding].shape === id}
                  onChange={(e) =>
                    handleNestedChange(activeBuilding, 'shape', e.target.value)
                  }
                />
                <label htmlFor={id}>{label}</label>
              </div>
            ))}
          </fieldset>
          {values.buildings[activeBuilding].shape == 'nonSymmetrical' && (
            <FeetInchesInput
              name={`buildingPeakOffset-${activeBuilding}`}
              label="Back Peak Offset:"
              value={values.buildings[activeBuilding].backPeakOffset}
              onChange={(name, value) =>
                handleNestedChange(activeBuilding, 'backPeakOffset', value)
              }
            />
          )}
        </div>
        <h4>Building Size</h4>
        <div className="grid4">
          <FeetInchesInput
            name={`buildingWidth-${activeBuilding}`}
            label="Width:"
            value={values.buildings[activeBuilding].width}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'width', value)
            }
          />
          <FeetInchesInput
            name={`buildingLength-${activeBuilding}`}
            label="Length:"
            value={values.buildings[activeBuilding].length}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'length', value)
            }
          />
          {values.buildings[activeBuilding].shape == 'symmetrical' && (
            <>
              <FeetInchesInput
                name={`buildingBackEaveHeight-${activeBuilding}`}
                label="Eave Height:"
                value={values.buildings[activeBuilding].backEaveHeight}
                onChange={(name, value) =>
                  handleNestedChange(activeBuilding, 'backEaveHeight', value)
                }
              />
              <div className="onDesktop"></div>
              <RoofPitchInput
                name={`buildingBackRoofPitch-${activeBuilding}`}
                label="Roof Pitch:"
                value={values.buildings[activeBuilding].backRoofPitch}
                onChange={(name, value) =>
                  handleNestedChange(activeBuilding, 'backRoofPitch', value)
                }
              />
            </>
          )}
          {(values.buildings[activeBuilding].shape == 'singleSlope' ||
            values.buildings[activeBuilding].shape == 'leanTo') && (
            <>
              <FeetInchesInput
                name={`buildingBackEaveHeight-${activeBuilding}`}
                label="Low Eave Height:"
                value={values.buildings[activeBuilding].backEaveHeight}
                onChange={(name, value) =>
                  handleNestedChange(activeBuilding, 'backEaveHeight', value)
                }
                calc={true}
                onCalc={() =>
                  handleCalcChange(activeBuilding, 'backEaveHeight')
                }
              />
              <FeetInchesInput
                name={`buildingFrontEaveHeight-${activeBuilding}`}
                label="High Eave Height:"
                value={values.buildings[activeBuilding].frontEaveHeight}
                onChange={(name, value) =>
                  handleNestedChange(activeBuilding, 'frontEaveHeight', value)
                }
                calc={true}
                onCalc={() =>
                  handleCalcChange(activeBuilding, 'frontEaveHeight')
                }
              />
              <RoofPitchInput
                name={`buildingBackRoofPitch-${activeBuilding}`}
                label="Roof Pitch:"
                value={values.buildings[activeBuilding].backRoofPitch}
                onChange={(name, value) =>
                  handleNestedChange(activeBuilding, 'backRoofPitch', value)
                }
                calc={true}
                onCalc={() => handleCalcChange(activeBuilding, 'backRoofPitch')}
              />
            </>
          )}
          {values.buildings[activeBuilding].shape == 'nonSymmetrical' && (
            <>
              <FeetInchesInput
                name={`buildingBackEaveHeight-${activeBuilding}`}
                label="Back Eave Height:"
                value={values.buildings[activeBuilding].backEaveHeight}
                onChange={(name, value) =>
                  handleNestedChange(activeBuilding, 'backEaveHeight', value)
                }
              />
              <FeetInchesInput
                name={`buildingFrontEaveHeight-${activeBuilding}`}
                label="Front Eave Height:"
                value={values.buildings[activeBuilding].frontEaveHeight}
                onChange={(name, value) =>
                  handleNestedChange(activeBuilding, 'frontEaveHeight', value)
                }
              />
              <RoofPitchInput
                name={`buildingBackRoofPitch-${activeBuilding}`}
                label="Back Roof Pitch:"
                value={values.buildings[activeBuilding].backRoofPitch}
                onChange={(name, value) =>
                  handleNestedChange(activeBuilding, 'backRoofPitch', value)
                }
              />
              <RoofPitchInput
                name={`buildingFrontRoofPitch-${activeBuilding}`}
                label="Front Roof Pitch:"
                value={values.buildings[activeBuilding].frontRoofPitch}
                onChange={(name, value) =>
                  handleNestedChange(activeBuilding, 'frontRoofPitch', value)
                }
              />
            </>
          )}
        </div>
        <h4>Bay Spacing</h4>
        <div className="grid3">
          <BaySpacingInput
            name={`buildingRoofBaySpacing-${activeBuilding}`}
            label="Sidewall Bay Spacing:"
            value={values.buildings[activeBuilding].roofBaySpacing}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'roofBaySpacing', value)
            }
            compareLabel="building length"
            compareValue={values.buildings[activeBuilding].length}
          />
          <BaySpacingInput
            name={`buildingLeftBaySpacing-${activeBuilding}`}
            label="Left Endwall Bay Spacing:"
            value={values.buildings[activeBuilding].leftBaySpacing}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'leftBaySpacing', value)
            }
            compareLabel="building width"
            compareValue={values.buildings[activeBuilding].width}
          />
          <BaySpacingInput
            name={`buildingRightBaySpacing-${activeBuilding}`}
            label="Right Endwall Bay Spacing:"
            value={values.buildings[activeBuilding].rightBaySpacing}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'rightBaySpacing', value)
            }
            compareLabel="building width"
            compareValue={values.buildings[activeBuilding].width}
          />
        </div>
      </section>

      <section className="card start">
        <header className="cardHeader">
          <h3>
            Design Codes <small>- Individual Building Override</small>
          </h3>
        </header>
        <h4>Roof Load</h4>
        <div className="grid3">
          <ReusableDouble
            id={'collateralLoad'}
            value={values.buildings[activeBuilding].collateralLoad}
            onChange={(e) =>
              handleNestedChange(
                activeBuilding,
                'collateralLoad',
                e.target.value
              )
            }
            name={'collateralLoad'}
            label={'Collateral Load (psf):'}
            disabled={false}
            placeholder={'0'}
            decimalPlaces={2}
          />
          <ReusableDouble
            id={'liveLoad'}
            value={values.buildings[activeBuilding].liveLoad}
            onChange={(e) =>
              handleNestedChange(activeBuilding, 'liveLoad', e.target.value)
            }
            name={'liveLoad'}
            label={'Live Load (psf):'}
            disabled={false}
            placeholder={'0'}
            decimalPlaces={2}
          />
          <ReusableDouble
            id={'deadLoad'}
            value={values.buildings[activeBuilding].deadLoad}
            onChange={(e) =>
              handleNestedChange(activeBuilding, 'deadLoad', e.target.value)
            }
            name={'deadLoad'}
            label={'Dead Load (psf):'}
            disabled={false}
            placeholder={'0'}
            decimalPlaces={2}
          />
        </div>
        <h4>Wind Load</h4>
        <div className="grid3">
          <ReusableSelect
            id={`enclosure`}
            name={`enclosure`}
            value={values.buildings[activeBuilding].enclosure}
            onChange={(e) =>
              handleNestedChange(activeBuilding, 'enclosure', e.target.value)
            }
            options={enclosure}
            label="Enclosure:"
            defaultValue="closed"
          />
        </div>
        <h4>Snow Load</h4>
        <div className="grid3">
          <ReusableDouble
            id={'roofSnowLoad'}
            value={values.buildings[activeBuilding].roofSnowLoad}
            onChange={(e) =>
              handleNestedChange(activeBuilding, 'roofSnowLoad', e.target.value)
            }
            name={'roofSnowLoad'}
            label={'Roof Load (psf):'}
            disabled={false}
            placeholder={'0'}
            decimalPlaces={2}
          />
          <ReusableSelect
            id={`thermalFactor`}
            name={`thermalFactor`}
            value={values.buildings[activeBuilding].thermalFactor}
            onChange={(e) =>
              handleNestedChange(
                activeBuilding,
                'thermalFactor',
                e.target.value
              )
            }
            options={thermalFactor}
            label="Thermal Factor:"
            defaultValue="heated"
          />
        </div>
      </section>

      <section className="card start">
        <header className="cardHeader">
          <h3>Frame Type</h3>
        </header>
        <div className="grid4">
          <fieldset className="radioGroup center">
            {frames.map(({ id, label }) => (
              <div key={id}>
                <input
                  type="radio"
                  id={id}
                  name="frame"
                  value={id}
                  checked={values.buildings[activeBuilding].frameType === id}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'frameType',
                      e.target.value
                    )
                  }
                />
                <label htmlFor={id}>{label}</label>
              </div>
            ))}
          </fieldset>
          {values.buildings[activeBuilding].frameType == 'multiSpan' && (
            <BaySpacingInput
              name={`buildingIntColSpacing-${activeBuilding}`}
              label="Int Column Spacing:"
              value={values.buildings[activeBuilding].intColSpacing}
              onChange={(name, value) =>
                handleNestedChange(activeBuilding, 'intColSpacing', value)
              }
              compareLabel="building width"
              compareValue={values.buildings[activeBuilding].width}
            />
          )}
          <div className="checkboxGroup center">
            <div className="checkRow">
              <input
                type="checkbox"
                id={`buildingStraightExtColumns-${activeBuilding}`}
                name={`buildingStraightExtColumns-${activeBuilding}`}
                checked={values.buildings[activeBuilding].straightExtColumns}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'straightExtColumns',
                    e.target.checked
                  )
                }
              />
              <label htmlFor={`buildingStraightExtColumns-${activeBuilding}`}>
                Straight Exterior Columns
              </label>
            </div>
            <div className="checkRow">
              <input
                type="checkbox"
                id={`buildingNoFlangeBraces-${activeBuilding}`}
                name={`buildingNoFlangeBraces-${activeBuilding}`}
                checked={values.buildings[activeBuilding].noFlangeBraces}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'noFlangeBraces',
                    e.target.checked
                  )
                }
              />
              <label htmlFor={`buildingNoFlangeBraces-${activeBuilding}`}>
                No Flange Braces On Columns
              </label>
            </div>
          </div>
        </div>

        <h4>Endwall Frames</h4>
        <div className="grid2 alignTop">
          <div className="grid2">
            <ReusableSelect
              id={`buildingleftFrame-${activeBuilding}`}
              name={`buildingleftFrame-${activeBuilding}`}
              value={values.buildings[activeBuilding].leftFrame}
              onChange={(e) =>
                handleNestedChange(activeBuilding, 'leftFrame', e.target.value)
              }
              options={FrameOptions}
              label="Left Endwall Frame:"
            />
            {values.buildings[activeBuilding].leftFrame == 'postAndBeam' && (
              <div></div>
            )}
            {values.buildings[activeBuilding].leftFrame != 'postAndBeam' && (
              <BaySpacingInput
                name={`buildingLeftEndwallIntColSpacing-${activeBuilding}`}
                label="Interior Column Spacing:"
                value={values.buildings[activeBuilding].leftIntColSpacing}
                onChange={(name, value) =>
                  handleNestedChange(activeBuilding, 'leftIntColSpacing', value)
                }
                compareLabel="building width"
                compareValue={values.buildings[activeBuilding].width}
              />
            )}
            {values.buildings[activeBuilding].leftFrame == 'insetRF' && (
              <BaySelectionInput
                name={`buildingLeftEndwallInset-${activeBuilding}`}
                label="Inset # of Bays"
                className="span2"
                value={values.buildings[activeBuilding].leftEndwallInset}
                onChange={(name, value) =>
                  handleNestedChange(activeBuilding, 'leftEndwallInset', value)
                }
                baySpacing={values.buildings[activeBuilding].roofBaySpacing}
                multiSelect={false}
              />
            )}
          </div>
          <div className="divider offOnPhone"></div>
          <div className="grid2">
            <ReusableSelect
              id={`buildingrightFrame-${activeBuilding}`}
              name={`buildingrightFrame-${activeBuilding}`}
              value={values.buildings[activeBuilding].rightFrame}
              onChange={(e) =>
                handleNestedChange(activeBuilding, 'rightFrame', e.target.value)
              }
              options={FrameOptions}
              label="Right Endwall Frame:"
            />
            {values.buildings[activeBuilding].rightFrame == 'postAndBeam' && (
              <div></div>
            )}
            {values.buildings[activeBuilding].rightFrame != 'postAndBeam' && (
              <BaySpacingInput
                name={`buildingRightEndwallIntColSpacing-${activeBuilding}`}
                label="Interior Column Spacing:"
                value={values.buildings[activeBuilding].rightIntColSpacing}
                onChange={(name, value) =>
                  handleNestedChange(
                    activeBuilding,
                    'rightIntColSpacing',
                    value
                  )
                }
                compareLabel="building width"
                compareValue={values.buildings[activeBuilding].width}
              />
            )}
            {values.buildings[activeBuilding].rightFrame == 'insetRF' && (
              <BaySelectionInput
                name={`buildingRightEndwallInset-${activeBuilding}`}
                label="Inset # of Bays"
                className="span2"
                value={values.buildings[activeBuilding].rightEndwallInset}
                onChange={(name, value) =>
                  handleNestedChange(activeBuilding, 'rightEndwallInset', value)
                }
                baySpacing={values.buildings[activeBuilding].roofBaySpacing}
                multiSelect={false}
              />
            )}
          </div>
        </div>
      </section>

      <section className="card start">
        <header className="cardHeader">
          <h3>Bracing</h3>
        </header>
        <div className="grid4 alignTop">
          <div className="grid">
            <ReusableSelect
              id={`buildingfswBracing-${activeBuilding}`}
              name={`buildingfswBracing-${activeBuilding}`}
              value={values.buildings[activeBuilding].fswBracingType}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'fswBracingType',
                  e.target.value
                )
              }
              options={SidewallBracingType}
              label="Front Sidewall Bracing Type:"
            />
            {values.buildings[activeBuilding].fswBracingType == 'tier' && (
              <>
                <FeetInchesInput
                  name={`buildingfswBracingHeight-${activeBuilding}`}
                  label="Height of Portal Frame:"
                  value={values.buildings[activeBuilding].fswBracingHeight}
                  onChange={(name, value) =>
                    handleNestedChange(
                      activeBuilding,
                      'fswBracingHeight',
                      value
                    )
                  }
                />
                <div className="divider offOnPhone"></div>
              </>
            )}
          </div>
          <div className="grid">
            <ReusableSelect
              id={`buildingbswBracing-${activeBuilding}`}
              name={`buildingbswBracing-${activeBuilding}`}
              value={values.buildings[activeBuilding].bswBracingType}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'bswBracingType',
                  e.target.value
                )
              }
              options={SidewallBracingType}
              label="Back Sidewall Bracing Type:"
            />
            {values.buildings[activeBuilding].bswBracingType == 'tier' && (
              <>
                <FeetInchesInput
                  name={`buildingbswBracingHeight-${activeBuilding}`}
                  label="Height of Portal Frame:"
                  value={values.buildings[activeBuilding].bswBracingHeight}
                  onChange={(name, value) =>
                    handleNestedChange(
                      activeBuilding,
                      'bswBracingHeight',
                      value
                    )
                  }
                />
                <div className="divider offOnPhone"></div>
              </>
            )}
          </div>
          <div className="grid">
            <ReusableSelect
              id={`buildinglewBracing-${activeBuilding}`}
              name={`buildinglewBracing-${activeBuilding}`}
              value={
                values.buildings[activeBuilding].leftFrame == 'postAndBeam'
                  ? values.buildings[activeBuilding].lewBracingType
                  : 'none'
              }
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'lewBracingType',
                  e.target.value
                )
              }
              options={EndwallBracingType}
              label="Left Endwall Bracing Type:"
              disabled={
                values.buildings[activeBuilding].leftFrame != 'postAndBeam'
              }
            />
          </div>
          <ReusableSelect
            id={`buildingrewBracing-${activeBuilding}`}
            name={`buildingrewBracing-${activeBuilding}`}
            value={
              values.buildings[activeBuilding].rightFrame == 'postAndBeam'
                ? values.buildings[activeBuilding].rewBracingType
                : 'none'
            }
            onChange={(e) =>
              handleNestedChange(
                activeBuilding,
                'rewBracingType',
                e.target.value
              )
            }
            options={EndwallBracingType}
            label="Right Endwall Bracing Type:"
            disabled={
              values.buildings[activeBuilding].rightFrame != 'postAndBeam'
            }
          />
        </div>
        <div className="divider"></div>

        <h4>Wall Braced Bays</h4>
        <div className="grid4 alignTop">
          <BaySelectionInput
            name={`buildingfswBracedBays-${activeBuilding}`}
            label="Front Sidewall"
            value={values.buildings[activeBuilding].fswBracedBays}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'fswBracedBays', value)
            }
            baySpacing={values.buildings[activeBuilding].roofBaySpacing}
            multiSelect={true}
            disabled={
              values.buildings[activeBuilding].fswBracingType == 'torsional'
            }
          />
          <BaySelectionInput
            name={`buildingbswBracedBays-${activeBuilding}`}
            label="Back Sidewall"
            value={values.buildings[activeBuilding].bswBracedBays}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'bswBracedBays', value)
            }
            baySpacing={values.buildings[activeBuilding].roofBaySpacing}
            multiSelect={true}
            disabled={
              values.buildings[activeBuilding].bswBracingType == 'torsional'
            }
          />
          <BaySelectionInput
            name={`buildinglewBracedBays-${activeBuilding}`}
            label="Left Endwall"
            value={values.buildings[activeBuilding].lewBracedBays}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'lewBracedBays', value)
            }
            baySpacing={values.buildings[activeBuilding].leftBaySpacing}
            multiSelect={true}
            disabled={
              values.buildings[activeBuilding].leftFrame != 'postAndBeam'
            }
          />
          <BaySelectionInput
            name={`buildingrewBracedBays-${activeBuilding}`}
            label="Right Endwall"
            value={values.buildings[activeBuilding].rewBracedBays}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'rewBracedBays', value)
            }
            baySpacing={values.buildings[activeBuilding].rightBaySpacing}
            multiSelect={true}
            disabled={
              values.buildings[activeBuilding].rightFrame != 'postAndBeam'
            }
          />
        </div>

        <h4>Roof Bracing</h4>
        <div className="grid2">
          <BaySelectionInput
            name={`buildingRoofBracedBays-${activeBuilding}`}
            label="Roof Braced Bays"
            value={values.buildings[activeBuilding].roofBracedBays}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'roofBracedBays', value)
            }
            baySpacing={values.buildings[activeBuilding].roofBaySpacing}
            multiSelect={true}
          />
          <div className="cardInput">
            <h5>Break Points to Match</h5>
            <fieldset className="radioGroup center">
              {breakPoints.map(({ id, label }) => (
                <div key={id}>
                  <input
                    type="radio"
                    id={id}
                    name="breakPoints"
                    value={id}
                    checked={
                      values.buildings[activeBuilding].roofBreakPoints === id
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'roofBreakPoints',
                        e.target.value
                      )
                    }
                  />
                  <label htmlFor={id}>{label}</label>
                </div>
              ))}
            </fieldset>
          </div>
        </div>
      </section>

      <section className="card start">
        <header className="cardHeader">
          <h3>Purlins and Girts</h3>
        </header>
        <div className="grid4 alignTop">
          <div className="grid">
            <ReusableSelect
              id={`buildingfswGirtType-${activeBuilding}`}
              name={`buildingfswGirtType-${activeBuilding}`}
              value={values.buildings[activeBuilding].fswGirtType}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'fswGirtType',
                  e.target.value
                )
              }
              options={girtTypes}
              label="Front Sidewall Girt Type:"
            />
            {values.buildings[activeBuilding].fswGirtType != 'open' && (
              <>
                <ReusableSelect
                  id={`buildingfswGirtSpacing-${activeBuilding}`}
                  name={`buildingfswGirtSpacing-${activeBuilding}`}
                  value={values.buildings[activeBuilding].fswGirtSpacing}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'fswGirtSpacing',
                      e.target.value
                    )
                  }
                  options={girtSpacing}
                  label="Front Sidewall Girt Spacing:"
                />
                <ReusableSelect
                  id={`buildingBaseCondition-${activeBuilding}`}
                  name={`buildingBaseCondition-${activeBuilding}`}
                  value={values.buildings[activeBuilding].baseCondition}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'baseCondition',
                      e.target.value
                    )
                  }
                  options={baseCondition}
                  label="Front Sidewall Base Condition:"
                />
              </>
            )}
          </div>
          <div className="divider offOnPhone"></div>
          <div className="grid">
            <ReusableSelect
              id={`buildingbswGirtType-${activeBuilding}`}
              name={`buildingbswGirtType-${activeBuilding}`}
              value={values.buildings[activeBuilding].bswGirtType}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'bswGirtType',
                  e.target.value
                )
              }
              options={girtTypes}
              label="Back Sidewall Girt Type:"
            />
            {values.buildings[activeBuilding].bswGirtType != 'open' && (
              <>
                <ReusableSelect
                  id={`buildingbswGirtSpacing-${activeBuilding}`}
                  name={`buildingbswGirtSpacing-${activeBuilding}`}
                  value={values.buildings[activeBuilding].bswGirtSpacing}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'bswGirtSpacing',
                      e.target.value
                    )
                  }
                  options={girtSpacing}
                  label="Back Sidewall Girt Spacing:"
                />
                <ReusableSelect
                  id={`buildingBaseCondition-${activeBuilding}`}
                  name={`buildingBaseCondition-${activeBuilding}`}
                  value={values.buildings[activeBuilding].baseCondition}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'baseCondition',
                      e.target.value
                    )
                  }
                  options={baseCondition}
                  label="Back Sidewall Base Condition:"
                />
              </>
            )}
          </div>
          <div className="divider showWithSidebar span2"></div>
          <div className="grid">
            <ReusableSelect
              id={`buildinglewGirtType-${activeBuilding}`}
              name={`buildinglewGirtType-${activeBuilding}`}
              value={values.buildings[activeBuilding].lewGirtType}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'lewGirtType',
                  e.target.value
                )
              }
              options={girtTypes}
              label="Left Endwall Girt Type:"
            />
            {values.buildings[activeBuilding].lewGirtType != 'open' && (
              <>
                <ReusableSelect
                  id={`buildinglewGirtSpacing-${activeBuilding}`}
                  name={`buildinglewGirtSpacing-${activeBuilding}`}
                  value={values.buildings[activeBuilding].lewGirtSpacing}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'lewGirtSpacing',
                      e.target.value
                    )
                  }
                  options={girtSpacing}
                  label="Left Endwall Girt Spacing:"
                />
                <ReusableSelect
                  id={`buildingBaseCondition-${activeBuilding}`}
                  name={`buildingBaseCondition-${activeBuilding}`}
                  value={values.buildings[activeBuilding].baseCondition}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'baseCondition',
                      e.target.value
                    )
                  }
                  options={baseCondition}
                  label="Left Endwall Base Condition:"
                />
              </>
            )}
          </div>
          <div className="divider offOnPhone"></div>
          <div className="grid">
            <ReusableSelect
              id={`buildingrewGirtType-${activeBuilding}`}
              name={`buildingrewGirtType-${activeBuilding}`}
              value={values.buildings[activeBuilding].rewGirtType}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'rewGirtType',
                  e.target.value
                )
              }
              options={girtTypes}
              label="Right Endwall Girt Type:"
            />
            {values.buildings[activeBuilding].rewGirtType != 'open' && (
              <>
                <ReusableSelect
                  id={`buildingrewGirtSpacing-${activeBuilding}`}
                  name={`buildingrewGirtSpacing-${activeBuilding}`}
                  value={values.buildings[activeBuilding].rewGirtSpacing}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'rewGirtSpacing',
                      e.target.value
                    )
                  }
                  options={girtSpacing}
                  label="Right Endwall Girt Spacing:"
                />
                <ReusableSelect
                  id={`buildingBaseCondition-${activeBuilding}`}
                  name={`buildingBaseCondition-${activeBuilding}`}
                  value={values.buildings[activeBuilding].baseCondition}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'baseCondition',
                      e.target.value
                    )
                  }
                  options={baseCondition}
                  label="Right Endwall Base Condition:"
                />
              </>
            )}
          </div>
        </div>
        <div className="divider"></div>

        <h4>Purlins</h4>
        <div className="grid4">
          <ReusableSelect
            id={`buildingPurlinSpacing-${activeBuilding}`}
            name={`buildingPurlinSpacing-${activeBuilding}`}
            value={values.buildings[activeBuilding].purlinSpacing}
            onChange={(e) =>
              handleNestedChange(
                activeBuilding,
                'purlinSpacing',
                e.target.value
              )
            }
            options={purlinSpacing}
            label="Purlin Spacing:"
          />
        </div>
      </section>

      <section className="card start">
        <header className="cardHeader">
          <h3>Sheeting & Insulation</h3>
        </header>

        <div className="grid2">
          <div className="panelGrid">
            <ReusableSelect
              className="panelType"
              id={`buildingRoofPanels-${activeBuilding}`}
              name={`buildingRoofPanels-${activeBuilding}`}
              value={values.buildings[activeBuilding].roofPanelType}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'roofPanelType',
                  e.target.value
                )
              }
              options={roofPanels}
              label="Roof Panels:"
            />
            <ReusableSelect
              className="panelGauge"
              id={`buildingRoofGauge-${activeBuilding}`}
              name={`buildingRoofGauge-${activeBuilding}`}
              value={values.buildings[activeBuilding].roofPanelGauge}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'roofPanelGauge',
                  e.target.value
                )
              }
              options={roofGauge}
              label="Gauge:"
            />
            <ReusableSelect
              className="panelFinish"
              id={`buildingRoofFinish-${activeBuilding}`}
              name={`buildingRoofFinish-${activeBuilding}`}
              value={values.buildings[activeBuilding].roofPanelFinish}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'roofPanelFinish',
                  e.target.value
                )
              }
              options={roofFinish}
              label="Finish:"
            />
            <div className="cardInput panelImage">
              {selectedRoofPanel && selectedRoofPanel.image && (
                <Image
                  alt={`${selectedRoofPanel.label}`}
                  src={selectedRoofPanel.image}
                  className="panelImage"
                />
              )}
            </div>
          </div>
          <div className="divider offOnLaptop"></div>
          <div className="panelGrid">
            <ReusableSelect
              className="panelType"
              id={`buildingWallPanels-${activeBuilding}`}
              name={`buildingWallPanels-${activeBuilding}`}
              value={values.buildings[activeBuilding].wallPanelType}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'wallPanelType',
                  e.target.value
                )
              }
              options={wallPanels}
              label="Wall Panels:"
            />
            <ReusableSelect
              className="panelGauge"
              id={`buildingWallGauge-${activeBuilding}`}
              name={`buildingWallGauge-${activeBuilding}`}
              value={values.buildings[activeBuilding].wallPanelGauge}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'wallPanelGauge',
                  e.target.value
                )
              }
              options={wallGauge}
              label="Gauge:"
            />
            <ReusableSelect
              className="panelFinish"
              id={`buildingWallFinish-${activeBuilding}`}
              name={`buildingWallFinish-${activeBuilding}`}
              value={values.buildings[activeBuilding].wallPanelFinish}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'wallPanelFinish',
                  e.target.value
                )
              }
              options={wallFinish}
              label="Finish:"
            />
            <div className="cardInput panelImage">
              {selectedWallPanel && selectedWallPanel.image && (
                <Image
                  alt={`${selectedWallPanel.label}`}
                  src={selectedWallPanel.image}
                  className="panelImage"
                />
              )}
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <h4>Gutters and Downspouts</h4>
        <div className="grid">
          <div className="checkboxGroup">
            <div className="checkRow">
              <input
                type="checkbox"
                id={`buildingIncludeGutters-${activeBuilding}`}
                name={`buildingIncludeGutters-${activeBuilding}`}
                checked={values.buildings[activeBuilding].includeGutters}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'includeGutters',
                    e.target.checked
                  )
                }
              />
              <label htmlFor={`buildingIncludeGutters-${activeBuilding}`}>
                Include Gutters and Downspouts
              </label>
            </div>
          </div>
        </div>

        <h4>Building Insulation</h4>
        <div className="grid4">
          <ReusableSelect
            id={`buildingRoofInsulation-${activeBuilding}`}
            name={`buildingRoofInsulation-${activeBuilding}`}
            value={values.buildings[activeBuilding].roofInsulation}
            onChange={(e) =>
              handleNestedChange(
                activeBuilding,
                'roofInsulation',
                e.target.value
              )
            }
            options={roofInsulation}
            label="Roof Insulation:"
          />
          <div className="checkboxGroup">
            <div className="checkRow">
              <input
                type="checkbox"
                id={`buildingRoofInsulationOthers-${activeBuilding}`}
                name={`buildingRoofInsulationOthers-${activeBuilding}`}
                checked={values.buildings[activeBuilding].roofInsulationOthers}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'roofInsulationOthers',
                    e.target.checked
                  )
                }
              />
              <label htmlFor={`buildingRoofInsulationOthers-${activeBuilding}`}>
                By Others (Roof Insulation)
              </label>
            </div>
          </div>
          <ReusableSelect
            id={`buildingWallInsulation-${activeBuilding}`}
            name={`buildingWallInsulation-${activeBuilding}`}
            value={values.buildings[activeBuilding].wallInsulation}
            onChange={(e) =>
              handleNestedChange(
                activeBuilding,
                'wallInsulation',
                e.target.value
              )
            }
            options={wallInsulation}
            label="Wall Insulation:"
          />
          <div className="checkboxGroup">
            <div className="checkRow">
              <input
                type="checkbox"
                id={`buildingWallInsulationOthers-${activeBuilding}`}
                name={`buildingWallInsulationOthers-${activeBuilding}`}
                checked={values.buildings[activeBuilding].wallInsulationOthers}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'wallInsulationOthers',
                    e.target.checked
                  )
                }
              />
              <label htmlFor={`buildingWallInsulationOthers-${activeBuilding}`}>
                By Others (Wall Insulation)
              </label>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BuildingLayout;
