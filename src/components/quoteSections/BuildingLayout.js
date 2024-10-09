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
      <section className="card">
        <header>
          <h3>Building Shape</h3>
        </header>
        <h4>Building Size</h4>

        <div className="radioGrid">
          <fieldset className="radio radioGroup">
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
        <div className="divider"></div>
        <div className="cardGrid">
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
            <FeetInchesInput
              name={`buildingEaveHeight-${activeBuilding}`}
              label="Eave Height:"
              value={values.buildings[activeBuilding].eaveHeight}
              onChange={(name, value) =>
                handleNestedChange(activeBuilding, 'eaveHeight', value)
              }
            />
          )}
          {(values.buildings[activeBuilding].shape == 'singleSlope' ||
            values.buildings[activeBuilding].shape == 'leanTo') && (
            <>
              <FeetInchesInput
                name={`buildingLowEaveHeight-${activeBuilding}`}
                label="Low Eave Height:"
                value={values.buildings[activeBuilding].lowEaveHeight}
                onChange={(name, value) =>
                  handleNestedChange(activeBuilding, 'lowEaveHeight', value)
                }
                calc={true}
                onCalc={() => handleCalcChange(activeBuilding, 'lowEaveHeight')}
              />
              <FeetInchesInput
                name={`buildingHighEaveHeight-${activeBuilding}`}
                label="High Eave Height:"
                value={values.buildings[activeBuilding].highEaveHeight}
                onChange={(name, value) =>
                  handleNestedChange(activeBuilding, 'highEaveHeight', value)
                }
                calc={true}
                onCalc={() =>
                  handleCalcChange(activeBuilding, 'highEaveHeight')
                }
              />
            </>
          )}
          {(values.buildings[activeBuilding].shape == 'singleSlope' ||
            values.buildings[activeBuilding].shape == 'leanTo') && (
            <RoofPitchInput
              name={`buildingRoofPitch-${activeBuilding}`}
              label="Roof Pitch:"
              value={values.buildings[activeBuilding].roofPitch}
              onChange={(name, value) =>
                handleNestedChange(activeBuilding, 'roofPitch', value)
              }
              calc={true}
              onCalc={() => handleCalcChange(activeBuilding, 'roofPitch')}
            />
          )}
          {values.buildings[activeBuilding].shape == 'symmetrical' && (
            <RoofPitchInput
              name={`buildingRoofPitch-${activeBuilding}`}
              label="Roof Pitch:"
              value={values.buildings[activeBuilding].roofPitch}
              onChange={(name, value) =>
                handleNestedChange(activeBuilding, 'roofPitch', value)
              }
            />
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
        <div className="cardGrid">
          <BaySpacingInput
            name={`buildingSWBaySpacing-${activeBuilding}`}
            label="Sidewall Bay Spacing:"
            value={values.buildings[activeBuilding].swBaySpacing}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'swBaySpacing', value)
            }
            compareLabel="building length"
            compareValue={values.buildings[activeBuilding].length}
          />
          <BaySpacingInput
            name={`buildingLEWBaySpacing-${activeBuilding}`}
            label="Left Endwall Bay Spacing:"
            value={values.buildings[activeBuilding].lewBaySpacing}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'lewBaySpacing', value)
            }
            compareLabel="building width"
            compareValue={values.buildings[activeBuilding].width}
          />
          <BaySpacingInput
            name={`buildingREWBaySpacing-${activeBuilding}`}
            label="Right Endwall Bay Spacing:"
            value={values.buildings[activeBuilding].rewBaySpacing}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'rewBaySpacing', value)
            }
            compareLabel="building width"
            compareValue={values.buildings[activeBuilding].width}
          />
        </div>
      </section>

      <section className="card start">
        <header className="cardHeader">
          <h3>Design Codes</h3>
        </header>
        <h4>Roof Load</h4>
        <div className="cardGrid">
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
        <div className="cardGrid">
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
        <div className="cardGrid">
          <ReusableDouble
            id={'roofLoad'}
            value={values.buildings[activeBuilding].roofLoad}
            onChange={(e) =>
              handleNestedChange(activeBuilding, 'roofLoad', e.target.value)
            }
            name={'roofLoad'}
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

      <section className="card">
        <header className="cardHeader">
          <h3>Frame Type</h3>
        </header>
        <div className="radioGrid">
          <fieldset className="center radioGroup">
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
          <div className="center">
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
        <div className="divider"></div>

        <h4>Endwall Frames</h4>
        <div className="frameGrid">
          <div className="cardInput">
            <ReusableSelect
              id={`buildinglewFrame-${activeBuilding}`}
              name={`buildinglewFrame-${activeBuilding}`}
              value={values.buildings[activeBuilding].lewFrame}
              onChange={(e) =>
                handleNestedChange(activeBuilding, 'lewFrame', e.target.value)
              }
              options={FrameOptions}
              label="Left Endwall Frame:"
            />
            {values.buildings[activeBuilding].lewFrame == 'insetRF' && (
              <BaySelectionInput
                name={`buildingLewInset-${activeBuilding}`}
                label="Inset # of Bays"
                value={values.buildings[activeBuilding].lewInset}
                onChange={(name, value) =>
                  handleNestedChange(activeBuilding, 'lewInset', value)
                }
                baySpacing={values.buildings[activeBuilding].swBaySpacing}
                multiSelect={false}
              />
            )}
          </div>
          <BaySpacingInput
            name={`buildingLeftEndwallIntColSpacing-${activeBuilding}`}
            label="Interior Column Spacing:"
            value={values.buildings[activeBuilding].lewIntColSpacing}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'lewIntColSpacing', value)
            }
            compareLabel="building width"
            compareValue={values.buildings[activeBuilding].width}
          />
          <div className="tabHide divider"></div>
          <div className="cardInput">
            <ReusableSelect
              id={`buildingrewFrame-${activeBuilding}`}
              name={`buildingrewFrame-${activeBuilding}`}
              value={values.buildings[activeBuilding].rewFrame}
              onChange={(e) =>
                handleNestedChange(activeBuilding, 'rewFrame', e.target.value)
              }
              options={FrameOptions}
              label="Right Endwall Frame:"
            />
            {values.buildings[activeBuilding].rewFrame == 'insetRF' && (
              <BaySelectionInput
                name={`buildingRewInset-${activeBuilding}`}
                label="Inset # of Bays"
                value={values.buildings[activeBuilding].rewInset}
                onChange={(name, value) =>
                  handleNestedChange(activeBuilding, 'rewInset', value)
                }
                baySpacing={values.buildings[activeBuilding].swBaySpacing}
                multiSelect={false}
              />
            )}
          </div>

          <BaySpacingInput
            name={`buildingRightEndwallIntColSpacing-${activeBuilding}`}
            label="Interior Column Spacing:"
            value={values.buildings[activeBuilding].rewIntColSpacing}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'rewIntColSpacing', value)
            }
            compareLabel="building width"
            compareValue={values.buildings[activeBuilding].width}
          />
        </div>
      </section>

      <section className="card">
        <header className="cardHeader">
          <h3>Bracing</h3>
        </header>
        <div className="cardGrid">
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
            <FeetInchesInput
              name={`buildingfswBracingHeight-${activeBuilding}`}
              label="Height of Portal Frame:"
              value={values.buildings[activeBuilding].fswBracingHeight}
              onChange={(name, value) =>
                handleNestedChange(activeBuilding, 'fswBracingHeight', value)
              }
            />
          )}
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
            <FeetInchesInput
              name={`buildingbswBracingHeight-${activeBuilding}`}
              label="Height of Portal Frame:"
              value={values.buildings[activeBuilding].bswBracingHeight}
              onChange={(name, value) =>
                handleNestedChange(activeBuilding, 'bswBracingHeight', value)
              }
            />
          )}
          <ReusableSelect
            id={`buildinglewBracing-${activeBuilding}`}
            name={`buildinglewBracing-${activeBuilding}`}
            value={
              values.buildings[activeBuilding].lewFrame == 'postAndBeam'
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
              values.buildings[activeBuilding].lewFrame != 'postAndBeam'
            }
          />
          <ReusableSelect
            id={`buildingrewBracing-${activeBuilding}`}
            name={`buildingrewBracing-${activeBuilding}`}
            value={
              values.buildings[activeBuilding].rewFrame == 'postAndBeam'
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
              values.buildings[activeBuilding].rewFrame != 'postAndBeam'
            }
          />
        </div>
        <div className="divider"></div>

        <h4>Wall Braced Bays</h4>
        <div className="cardGrid">
          <BaySelectionInput
            name={`buildingfswBracedBays-${activeBuilding}`}
            label="Front Sidewall"
            value={values.buildings[activeBuilding].fswBracedBays}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'fswBracedBays', value)
            }
            baySpacing={values.buildings[activeBuilding].swBaySpacing}
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
            baySpacing={values.buildings[activeBuilding].swBaySpacing}
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
            baySpacing={values.buildings[activeBuilding].lewBaySpacing}
            multiSelect={true}
            disabled={
              values.buildings[activeBuilding].lewFrame != 'postAndBeam'
            }
          />
          <BaySelectionInput
            name={`buildingrewBracedBays-${activeBuilding}`}
            label="Right Endwall"
            value={values.buildings[activeBuilding].rewBracedBays}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'rewBracedBays', value)
            }
            baySpacing={values.buildings[activeBuilding].rewBaySpacing}
            multiSelect={true}
            disabled={
              values.buildings[activeBuilding].rewFrame != 'postAndBeam'
            }
          />
        </div>

        <h4>Roof Bracing</h4>
        <div className="cardGrid">
          <BaySelectionInput
            name={`buildingRoofBracedBays-${activeBuilding}`}
            label="Roof Braced Bays"
            value={values.buildings[activeBuilding].roofBracedBays}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'roofBracedBays', value)
            }
            baySpacing={values.buildings[activeBuilding].swBaySpacing}
            multiSelect={true}
          />
          <div className="cardInput">
            <h5>Break Points to Match</h5>
            <fieldset className="column radioGroup">
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

      <section className="card">
        <header className="cardHeader">
          <h3>Purlins and Girts</h3>
        </header>
        <div className="cardGrid">
          <div className="cardInput">
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
          </div>
          <div className="cardInput">
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
          </div>
          <div className="cardInput">
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
          </div>
          <div className="cardInput">
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
          </div>
        </div>
        <div className="divider"></div>

        <div className="cardGrid">
          {values.buildings[activeBuilding].fswGirtType != 'open' ? (
            <div className="cardInput">
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
            </div>
          ) : (
            <div></div>
          )}
          {values.buildings[activeBuilding].bswGirtType != 'open' ? (
            <div className="cardInput">
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
            </div>
          ) : (
            <div></div>
          )}
          {values.buildings[activeBuilding].lewGirtType != 'open' ? (
            <div className="cardInput">
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
            </div>
          ) : (
            <div></div>
          )}
          {values.buildings[activeBuilding].rewGirtType != 'open' ? (
            <div className="cardInput">
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
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="divider"></div>
        <div className="cardGrid">
          <div className="cardInput">
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
              label="Base Condition:"
            />
          </div>
        </div>
        <div className="divider"></div>

        <h4>Purlins</h4>
        <div className="cardGrid">
          <div className="cardInput">
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
        </div>
      </section>

      <section className="card">
        <header className="cardHeader">
          <h3>Sheeting & Insulation</h3>
        </header>

        <div className="extendGrid">
          <div className="extGrid">
            <div className="cardInput">
              <ReusableSelect
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
            </div>
            <div className="cardInput">
              <ReusableSelect
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
            </div>
            <div className="cardInput">
              <ReusableSelect
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
            </div>
            {selectedRoofPanel && selectedRoofPanel.image && (
              <Image
                alt={`${selectedRoofPanel.label}`}
                src={selectedRoofPanel.image}
                className="panelImage"
              />
            )}
          </div>
          <div className="extGrid">
            <div className="cardInput">
              <ReusableSelect
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
            </div>
            <div className="cardInput">
              <ReusableSelect
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
            </div>
            <div className="cardInput">
              <ReusableSelect
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
            </div>
            {selectedWallPanel && selectedWallPanel.image && (
              <Image
                alt={`${selectedWallPanel.label}`}
                src={selectedWallPanel.image}
                className="panelImage"
              />
            )}
          </div>
        </div>

        <div className="divider"></div>

        <h4>Gutters and Downspouts</h4>
        <div className="cardGrid">
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

        <h4>Building Insulation</h4>
        <div className="cardGrid">
          <div className="cardInput">
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
          </div>
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
          <div className="cardInput">
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
          </div>
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
      </section>
    </>
  );
};

export default BuildingLayout;
