import React from 'react';
import ReusableSelect from '../Inputs/ReusableSelect';
import ReusableDouble from '../Inputs/ReusableDouble';
import FeetInchesInput from '../Inputs/FeetInchesInput';
import RoofPitchInput from '../Inputs/RoofPitchInput';
import BaySpacingInput from '../Inputs/BaySpacingInput';
import BaySelectionInput from '../Inputs/BaySelectionInput';
import {
  shapes,
  steelFinish,
  frames,
  FrameOptions,
  SidewallBracingType,
  EndwallBracingType,
  breakPoints,
  girtTypes,
  girtSpacing,
  baseCondition,
  purlinSpacing,
  enclosure,
  thermalFactor,
} from '../../util/dropdownOptions';

const BuildingLayout = ({
  values,
  activeBuilding,
  handleNestedChange,
  handleCalcChange,
  locked,
}) => {
  return (
    <>
      {/* Design Codes */}
      <section className="card">
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
            label={
              <>
                Collateral Load: <small>(psf)</small>
              </>
            }
            disabled={locked}
            placeholder={'psf'}
            decimalPlaces={2}
          />
          <ReusableDouble
            id={'liveLoad'}
            value={values.buildings[activeBuilding].liveLoad}
            onChange={(e) =>
              handleNestedChange(activeBuilding, 'liveLoad', e.target.value)
            }
            name={'liveLoad'}
            label={
              <>
                Live Load: <small>(psf)</small>
              </>
            }
            disabled={locked}
            placeholder={'psf'}
            decimalPlaces={2}
          />
          <ReusableDouble
            id={'deadLoad'}
            value={values.buildings[activeBuilding].deadLoad}
            onChange={(e) =>
              handleNestedChange(activeBuilding, 'deadLoad', e.target.value)
            }
            name={'deadLoad'}
            label={
              <>
                Dead Load: <small>(psf)</small>
              </>
            }
            disabled={locked}
            placeholder={'psf'}
            decimalPlaces={2}
          />
        </div>
        <h4>Wind Load</h4>
        <div className="grid3">
          <ReusableSelect
            name={`windEnclosure`}
            value={values.buildings[activeBuilding].windEnclosure}
            onChange={(e) =>
              handleNestedChange(
                activeBuilding,
                'windEnclosure',
                e.target.value
              )
            }
            options={enclosure}
            label="Enclosure:"
            defaultValue="C"
            disabled={locked}
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
            label={
              <>
                Roof Load: <small>(psf)</small>
              </>
            }
            disabled={locked}
            placeholder={'psf'}
            decimalPlaces={2}
          />
          <ReusableSelect
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
            defaultValue={1}
            disabled={locked}
          />
        </div>
      </section>

      {/* Frame Type */}
      <section className="card">
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
                  disabled={locked}
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
              disabled={locked}
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
                disabled={locked}
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
                disabled={locked}
              />
              <label htmlFor={`buildingNoFlangeBraces-${activeBuilding}`}>
                No Flange Braces On Columns
              </label>
            </div>
          </div>
          <ReusableSelect
            name={`buildingSteelFinish-${activeBuilding}`}
            value={values.buildings[activeBuilding].steelFinish}
            onChange={(e) =>
              handleNestedChange(activeBuilding, 'steelFinish', e.target.value)
            }
            options={steelFinish}
            label="Steel Finish:"
            disabled={locked}
          />
        </div>

        <h4>Endwall Frames</h4>
        <div className="grid2 alignTop">
          <div className="grid2">
            <ReusableSelect
              name={`buildingleftFrame-${activeBuilding}`}
              value={values.buildings[activeBuilding].leftFrame}
              onChange={(e) =>
                handleNestedChange(activeBuilding, 'leftFrame', e.target.value)
              }
              options={FrameOptions}
              label="Left Endwall Frame:"
              disabled={locked}
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
                disabled={locked}
              />
            )}
            {values.buildings[activeBuilding].leftFrame == 'insetRF' && (
              <BaySelectionInput
                name={`buildingLewInset-${activeBuilding}`}
                label="Inset # of Bays"
                className="span2"
                value={values.buildings[activeBuilding].leftEndwallInset}
                onChange={(name, value) =>
                  handleNestedChange(activeBuilding, 'lewInset', value)
                }
                baySpacing={values.buildings[activeBuilding].roofBaySpacing}
                multiSelect={false}
                disabled={locked}
              />
            )}
          </div>
          <div className="divider offOnPhone"></div>
          <div className="grid2">
            <ReusableSelect
              name={`buildingrightFrame-${activeBuilding}`}
              value={values.buildings[activeBuilding].rightFrame}
              onChange={(e) =>
                handleNestedChange(activeBuilding, 'rightFrame', e.target.value)
              }
              options={FrameOptions}
              label="Right Endwall Frame:"
              disabled={locked}
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
                disabled={locked}
              />
            )}
            {values.buildings[activeBuilding].rightFrame == 'insetRF' && (
              <BaySelectionInput
                name={`buildingRewInset-${activeBuilding}`}
                label="Inset # of Bays"
                className="span2"
                value={values.buildings[activeBuilding].rightEndwallInset}
                onChange={(name, value) =>
                  handleNestedChange(activeBuilding, 'rewInset', value)
                }
                baySpacing={values.buildings[activeBuilding].roofBaySpacing}
                multiSelect={false}
                disabled={locked}
              />
            )}
          </div>
        </div>
      </section>

      {/* Soldier Columns */}
      {/* <section className="card">
        <header>
          <h3>Soldier Columns</h3>
        </header>
      </section> */}

      {/* Bay Spacing */}
      <section className="card">
        <header>
          <h3>Bay Spacing</h3>
        </header>
        <div
          className={
            values.buildings[activeBuilding].leftFrame == 'insetRF' ||
            values.buildings[activeBuilding].rightFrame == 'insetRF'
              ? 'grid'
              : 'grid3'
          }
        >
          <BaySpacingInput
            name={`buildingRoofBaySpacing-${activeBuilding}`}
            label="Sidewall Bay Spacing:"
            value={values.buildings[activeBuilding].roofBaySpacing}
            onChange={(name, value) => {
              handleNestedChange(activeBuilding, 'roofBaySpacing', value);
              handleNestedChange(activeBuilding, 'frontBaySpacing', value);
              handleNestedChange(activeBuilding, 'backBaySpacing', value);
            }}
            compareLabel="building length"
            compareValue={values.buildings[activeBuilding].length}
            disabled={locked}
          />
          <BaySpacingInput
            className="hidden"
            name={`buildingFrontBaySpacing-${activeBuilding}`}
            label="Front Sidewall Bay Spacing:"
            value={values.buildings[activeBuilding].frontBaySpacing}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'frontBaySpacing', value)
            }
            compareLabel="building length"
            compareValue={values.buildings[activeBuilding].length}
            disabled={locked}
          />
          <BaySpacingInput
            className="hidden"
            name={`buildingBackBaySpacing-${activeBuilding}`}
            label="Back Sidewall Bay Spacing:"
            value={values.buildings[activeBuilding].backBaySpacing}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'backBaySpacing', value)
            }
            compareLabel="building length"
            compareValue={values.buildings[activeBuilding].length}
            disabled={locked}
          />
          <div
            className={
              values.buildings[activeBuilding].leftFrame == 'insetRF' ||
              values.buildings[activeBuilding].rightFrame == 'insetRF'
                ? 'grid4'
                : 'grid2 span2'
            }
          >
            {values.buildings[activeBuilding].leftFrame == 'insetRF' && (
              <BaySpacingInput
                name={`buildingOuterLeftBaySpacing-${activeBuilding}`}
                label="Outer Left Endwall Bay Spacing:"
                value={values.buildings[activeBuilding].outerLeftBaySpacing}
                onChange={(name, value) =>
                  handleNestedChange(
                    activeBuilding,
                    'outerLeftBaySpacing',
                    value
                  )
                }
                compareLabel="building width"
                compareValue={values.buildings[activeBuilding].width}
                disabled={locked}
              />
            )}
            {values.buildings[activeBuilding].leftFrame != 'insetRF' &&
              values.buildings[activeBuilding].rightFrame == 'insetRF' && (
                <div className="onPhone"></div>
              )}
            <BaySpacingInput
              name={`buildingLeftBaySpacing-${activeBuilding}`}
              label="Left Endwall Bay Spacing:"
              value={values.buildings[activeBuilding].leftBaySpacing}
              onChange={(name, value) =>
                handleNestedChange(activeBuilding, 'leftBaySpacing', value)
              }
              compareLabel="building width"
              compareValue={values.buildings[activeBuilding].width}
              disabled={locked}
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
              disabled={locked}
            />
            {values.buildings[activeBuilding].rightFrame == 'insetRF' && (
              <BaySpacingInput
                name={`buildingOuterRightBaySpacing-${activeBuilding}`}
                label="Outer Right Endwall Bay Spacing:"
                value={values.buildings[activeBuilding].outerRightBaySpacing}
                onChange={(name, value) =>
                  handleNestedChange(
                    activeBuilding,
                    'outerRightBaySpacing',
                    value
                  )
                }
                compareLabel="building width"
                compareValue={values.buildings[activeBuilding].width}
                disabled={locked}
              />
            )}
          </div>
        </div>
      </section>

      {/* Bracing */}
      <section className="card">
        <header className="cardHeader">
          <h3>Bracing</h3>
        </header>
        <div className="grid4 alignTop">
          <div className="grid">
            <ReusableSelect
              name={`buildingfrontBracing-${activeBuilding}`}
              value={values.buildings[activeBuilding].frontBracingType}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'frontBracingType',
                  e.target.value
                )
              }
              options={SidewallBracingType}
              label="Front Sidewall Bracing Type:"
              disabled={locked}
            />
            {values.buildings[activeBuilding].frontBracingType == 'tier' && (
              <>
                <FeetInchesInput
                  name={`buildingfrontBracingHeight-${activeBuilding}`}
                  label="Height of Portal Frame:"
                  value={values.buildings[activeBuilding].frontBracingHeight}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'frontBracingHeight',
                      e.target.value
                    )
                  }
                  disabled={locked}
                />
                <div className="divider offOnPhone"></div>
              </>
            )}
          </div>
          <div className="grid">
            <ReusableSelect
              name={`buildingbackBracing-${activeBuilding}`}
              value={values.buildings[activeBuilding].backBracingType}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'backBracingType',
                  e.target.value
                )
              }
              options={SidewallBracingType}
              label="Back Sidewall Bracing Type:"
              disabled={locked}
            />
            {values.buildings[activeBuilding].backBracingType == 'tier' && (
              <>
                <FeetInchesInput
                  name={`buildingbackBracingHeight-${activeBuilding}`}
                  label="Height of Portal Frame:"
                  value={values.buildings[activeBuilding].backBracingHeight}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'backBracingHeight',
                      e.target.value
                    )
                  }
                  disabled={locked}
                />
                <div className="divider offOnPhone"></div>
              </>
            )}
          </div>
          <div className="grid">
            <ReusableSelect
              name={`buildingleftBracing-${activeBuilding}`}
              value={
                values.buildings[activeBuilding].leftFrame == 'postAndBeam'
                  ? values.buildings[activeBuilding].leftBracingType
                  : 'none'
              }
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'leftBracingType',
                  e.target.value
                )
              }
              options={EndwallBracingType}
              label="Left Endwall Bracing Type:"
              disabled={
                values.buildings[activeBuilding].leftFrame != 'postAndBeam' ||
                locked
              }
            />
          </div>
          <ReusableSelect
            name={`buildingrightBracing-${activeBuilding}`}
            value={
              values.buildings[activeBuilding].rightFrame == 'postAndBeam'
                ? values.buildings[activeBuilding].rightBracingType
                : 'none'
            }
            onChange={(e) =>
              handleNestedChange(
                activeBuilding,
                'rightBracingType',
                e.target.value
              )
            }
            options={EndwallBracingType}
            label="Right Endwall Bracing Type:"
            disabled={
              values.buildings[activeBuilding].rightFrame != 'postAndBeam' ||
              locked
            }
          />
        </div>
        {values.buildings[activeBuilding].frameType == 'multiSpan' && (
          <>
            <div className="grid4">
              <ReusableSelect
                name={`buildingInteriorBracing-${activeBuilding}`}
                value={values.buildings[activeBuilding].interiorBracingType}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'interiorBracingType',
                    e.target.value
                  )
                }
                options={SidewallBracingType}
                label="Interior Bracing Type:"
                disabled={locked}
              />
              {values.buildings[activeBuilding].interiorBracingType ==
                'tier' && (
                <>
                  <FeetInchesInput
                    name={`buildingInteriorBracingHeight-${activeBuilding}`}
                    label="Height of Portal Frame:"
                    value={
                      values.buildings[activeBuilding].interiorBracingHeight
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'interiorBracingHeight',
                        e.target.value
                      )
                    }
                    disabled={locked}
                  />
                  <div className="divider offOnPhone"></div>
                </>
              )}
            </div>
          </>
        )}

        <div className="divider"></div>

        <h4>Wall Braced Bays</h4>
        <div className="grid4 alignTop">
          <BaySelectionInput
            name={`buildingfrontBracedBays-${activeBuilding}`}
            label="Front Sidewall"
            value={values.buildings[activeBuilding].frontBracedBays}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'frontBracedBays', value)
            }
            baySpacing={values.buildings[activeBuilding].frontBaySpacing}
            multiSelect={true}
            disabled={
              values.buildings[activeBuilding].frontBracingType ==
                'torsional' || locked
            }
          />
          <BaySelectionInput
            name={`buildingbackBracedBays-${activeBuilding}`}
            label="Back Sidewall"
            value={values.buildings[activeBuilding].backBracedBays}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'backBracedBays', value)
            }
            baySpacing={values.buildings[activeBuilding].backBaySpacing}
            multiSelect={true}
            disabled={
              values.buildings[activeBuilding].backBracingType == 'torsional' ||
              locked
            }
          />
          <BaySelectionInput
            name={`buildingleftBracedBays-${activeBuilding}`}
            label="Left Endwall"
            value={values.buildings[activeBuilding].leftBracedBays}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'leftBracedBays', value)
            }
            baySpacing={values.buildings[activeBuilding].leftBaySpacing}
            multiSelect={true}
            disabled={
              values.buildings[activeBuilding].leftFrame != 'postAndBeam' ||
              locked
            }
          />
          <BaySelectionInput
            name={`buildingrightBracedBays-${activeBuilding}`}
            label="Right Endwall"
            value={values.buildings[activeBuilding].rightBracedBays}
            onChange={(name, value) =>
              handleNestedChange(activeBuilding, 'rightBracedBays', value)
            }
            baySpacing={values.buildings[activeBuilding].rightBaySpacing}
            multiSelect={true}
            disabled={
              values.buildings[activeBuilding].rightFrame != 'postAndBeam' ||
              locked
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
            disabled={locked}
          />
          <div>
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
                    disabled={locked}
                  />
                  <label htmlFor={id}>{label}</label>
                </div>
              ))}
            </fieldset>
          </div>
        </div>
      </section>

      {/* Purlins & Girts */}
      <section className="card">
        <header className="cardHeader">
          <h3>Purlins & Girts</h3>
        </header>
        <div className="grid4 alignTop">
          <div
            className={
              values.buildings[activeBuilding].leftFrame == 'insetRF' ||
              values.buildings[activeBuilding].rightFrame == 'insetRF'
                ? 'span2'
                : 'grid'
            }
          >
            <ReusableSelect
              name={`buildingFrontGirtType-${activeBuilding}`}
              value={values.buildings[activeBuilding].frontGirtType}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'frontGirtType',
                  e.target.value
                )
              }
              icon={!locked && 'copy'}
              iconClass={'prim'}
              // iconOnClick={}
              tooltip="Copy to all Walls"
              options={girtTypes}
              label="Front Sidewall Girt Type:"
              disabled={locked}
            />
            {values.buildings[activeBuilding].frontGirtType != 'open' && (
              <>
                <ReusableSelect
                  name={`buildingFrontGirtSpacing-${activeBuilding}`}
                  value={values.buildings[activeBuilding].frontGirtSpacing}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'frontGirtSpacing',
                      e.target.value
                    )
                  }
                  options={girtSpacing}
                  label="Front Sidewall Girt Spacing:"
                  disabled={locked}
                />
                <ReusableSelect
                  name={`buildingFrontBaseCondition-${activeBuilding}`}
                  value={values.buildings[activeBuilding].frontBaseCondition}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'frontBaseCondition',
                      e.target.value
                    )
                  }
                  options={baseCondition}
                  label="Front Sidewall Base Condition:"
                  disabled={locked}
                />
              </>
            )}
          </div>
          <div className="divider offOnPhone"></div>
          <div
            className={
              values.buildings[activeBuilding].leftFrame == 'insetRF' ||
              values.buildings[activeBuilding].rightFrame == 'insetRF'
                ? 'span2'
                : 'grid'
            }
          >
            <ReusableSelect
              name={`buildingBackGirtType-${activeBuilding}`}
              value={values.buildings[activeBuilding].backGirtType}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'backGirtType',
                  e.target.value
                )
              }
              options={girtTypes}
              label="Back Sidewall Girt Type:"
              disabled={locked}
            />
            {values.buildings[activeBuilding].backGirtType != 'open' && (
              <>
                <ReusableSelect
                  name={`buildingBackGirtSpacing-${activeBuilding}`}
                  value={values.buildings[activeBuilding].backGirtSpacing}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'backGirtSpacing',
                      e.target.value
                    )
                  }
                  options={girtSpacing}
                  label="Back Sidewall Girt Spacing:"
                  disabled={locked}
                />
                <ReusableSelect
                  name={`buildingBackBaseCondition-${activeBuilding}`}
                  value={values.buildings[activeBuilding].backBaseCondition}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'backBaseCondition',
                      e.target.value
                    )
                  }
                  options={baseCondition}
                  label="Back Sidewall Base Condition:"
                  disabled={locked}
                />
              </>
            )}
          </div>
          <div
            className={
              values.buildings[activeBuilding].leftFrame == 'insetRF' ||
              values.buildings[activeBuilding].rightFrame == 'insetRF'
                ? 'divider span4'
                : 'divider showWithSidebar span2'
            }
          ></div>
          {values.buildings[activeBuilding].leftFrame == 'insetRF' && (
            <>
              <div className="grid">
                <ReusableSelect
                  name={`buildingOuterLeftGirtType-${activeBuilding}`}
                  value={values.buildings[activeBuilding].outerLeftGirtType}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'outerLeftGirtType',
                      e.target.value
                    )
                  }
                  options={girtTypes}
                  label="Outer Left Endwall Girt Type:"
                  disabled={locked}
                />
                {values.buildings[activeBuilding].outerLeftGirtType !=
                  'open' && (
                  <>
                    <ReusableSelect
                      name={`buildingOuterLeftGirtSpacing-${activeBuilding}`}
                      value={
                        values.buildings[activeBuilding].outerLeftGirtSpacing
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'outerLeftGirtSpacing',
                          e.target.value
                        )
                      }
                      options={girtSpacing}
                      label="Outer Left Endwall Girt Spacing:"
                      disabled={locked}
                    />
                    <ReusableSelect
                      name={`buildingOuterLeftBaseCondition-${activeBuilding}`}
                      value={
                        values.buildings[activeBuilding].outerLeftBaseCondition
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'outerLeftBaseCondition',
                          e.target.value
                        )
                      }
                      options={baseCondition}
                      label="Outer Left Endwall Base Condition:"
                      disabled={locked}
                    />
                  </>
                )}
              </div>
              <div className="divider offOnPhone"></div>
            </>
          )}
          {values.buildings[activeBuilding].leftFrame != 'insetRF' &&
            values.buildings[activeBuilding].rightFrame == 'insetRF' && (
              <div className="onPhone"></div>
            )}
          <div className="grid">
            <ReusableSelect
              name={`buildingLeftGirtType-${activeBuilding}`}
              value={values.buildings[activeBuilding].leftGirtType}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'leftGirtType',
                  e.target.value
                )
              }
              options={girtTypes}
              label="Left Endwall Girt Type:"
              disabled={locked}
            />
            {values.buildings[activeBuilding].leftGirtType != 'open' && (
              <>
                <ReusableSelect
                  name={`buildingLeftGirtSpacing-${activeBuilding}`}
                  value={values.buildings[activeBuilding].leftGirtSpacing}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'leftGirtSpacing',
                      e.target.value
                    )
                  }
                  options={girtSpacing}
                  label="Left Endwall Girt Spacing:"
                  disabled={locked}
                />
                <ReusableSelect
                  name={`buildingLeftBaseCondition-${activeBuilding}`}
                  value={values.buildings[activeBuilding].leftBaseCondition}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'leftBaseCondition',
                      e.target.value
                    )
                  }
                  options={baseCondition}
                  label="Left Endwall Base Condition:"
                  disabled={locked}
                />
              </>
            )}
          </div>
          {values.buildings[activeBuilding].leftFrame == 'insetRF' ||
          values.buildings[activeBuilding].rightFrame == 'insetRF' ? (
            <div className="divider showWithSidebar span2"></div>
          ) : (
            <div className="divider offOnPhone"></div>
          )}
          <div className="grid">
            <ReusableSelect
              name={`buildingRightGirtType-${activeBuilding}`}
              value={values.buildings[activeBuilding].rightGirtType}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'rightGirtType',
                  e.target.value
                )
              }
              options={girtTypes}
              label="Right Endwall Girt Type:"
              disabled={locked}
            />
            {values.buildings[activeBuilding].rightGirtType != 'open' && (
              <>
                <ReusableSelect
                  name={`buildingRightGirtSpacing-${activeBuilding}`}
                  value={values.buildings[activeBuilding].rightGirtSpacing}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'rightGirtSpacing',
                      e.target.value
                    )
                  }
                  options={girtSpacing}
                  label="Right Endwall Girt Spacing:"
                  disabled={locked}
                />
                <ReusableSelect
                  name={`buildingRightBaseCondition-${activeBuilding}`}
                  value={values.buildings[activeBuilding].rightBaseCondition}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'rightBaseCondition',
                      e.target.value
                    )
                  }
                  options={baseCondition}
                  label="Right Endwall Base Condition:"
                  disabled={locked}
                />
              </>
            )}
          </div>
          {values.buildings[activeBuilding].rightFrame == 'insetRF' && (
            <>
              <div className="divider offOnPhone"></div>
              <div className="grid">
                <ReusableSelect
                  name={`buildingOuterRightGirtType-${activeBuilding}`}
                  value={values.buildings[activeBuilding].outerRightGirtType}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'outerRightGirtType',
                      e.target.value
                    )
                  }
                  options={girtTypes}
                  label="Outer Right Endwall Girt Type:"
                  disabled={locked}
                />
                {values.buildings[activeBuilding].outerRightGirtType !=
                  'open' && (
                  <>
                    <ReusableSelect
                      name={`buildingOuterRightGirtSpacing-${activeBuilding}`}
                      value={
                        values.buildings[activeBuilding].outerRightGirtSpacing
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'outerRightGirtSpacing',
                          e.target.value
                        )
                      }
                      options={girtSpacing}
                      label="Outer Right Endwall Girt Spacing:"
                      disabled={locked}
                    />
                    <ReusableSelect
                      name={`buildingOuterRightBaseCondition-${activeBuilding}`}
                      value={
                        values.buildings[activeBuilding].outerRightBaseCondition
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          activeBuilding,
                          'outerRightBaseCondition',
                          e.target.value
                        )
                      }
                      options={baseCondition}
                      label="Outer Right Endwall Base Condition:"
                      disabled={locked}
                    />
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <div className="divider"></div>

        <h4>Purlins</h4>
        <div className="grid4">
          <ReusableSelect
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
            disabled={locked}
          />
        </div>
      </section>
    </>
  );
};

export default BuildingLayout;
