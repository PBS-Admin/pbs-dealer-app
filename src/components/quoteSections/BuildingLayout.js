import React from 'react';
import ReusableSelect from '../Inputs/ReusableSelect';
import ReusableDouble from '../Inputs/ReusableDouble';
import ReusablePanel from '../Inputs/ReusablePanel';
import FeetInchesInput from '../Inputs/FeetInchesInput';
import RoofPitchInput from '../Inputs/RoofPitchInput';
import BaySpacingInput from '../Inputs/BaySpacingInput';
import BaySelectionInput from '../Inputs/BaySelectionInput';
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
  roofInsulation,
  wallInsulation,
  enclosure,
  thermalFactor,
} from '../../util/dropdownOptions';

const BuildingLayout = ({
  values,
  activeBuilding,
  handleNestedChange,
  handleCalcChange,
}) => {
  return (
    <>
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
            label={
              <>
                Collateral Load: <small>(psf)</small>
              </>
            }
            disabled={false}
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
            disabled={false}
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
            disabled={false}
            placeholder={'psf'}
            decimalPlaces={2}
          />
        </div>
        <h4>Wind Load</h4>
        <div className="grid3">
          <ReusableSelect
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
            label={
              <>
                Roof Load: <small>(psf)</small>
              </>
            }
            disabled={false}
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
            defaultValue="heated"
          />
        </div>
      </section>

      <section className="card start">
        <header>
          <h3>Bay Spacing</h3>
        </header>
        <div className="grid3">
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
                name={`buildingLewInset-${activeBuilding}`}
                label="Inset # of Bays"
                className="span2"
                value={values.buildings[activeBuilding].leftEndwallInset}
                onChange={(name, value) =>
                  handleNestedChange(activeBuilding, 'lewInset', value)
                }
                baySpacing={values.buildings[activeBuilding].roofBaySpacing}
                multiSelect={false}
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
                name={`buildingRewInset-${activeBuilding}`}
                label="Inset # of Bays"
                className="span2"
                value={values.buildings[activeBuilding].rightEndwallInset}
                onChange={(name, value) =>
                  handleNestedChange(activeBuilding, 'rewInset', value)
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
            />
            {values.buildings[activeBuilding].frontBracingType == 'tier' && (
              <>
                <FeetInchesInput
                  name={`buildingfrontBracingHeight-${activeBuilding}`}
                  label="Height of Portal Frame:"
                  value={values.buildings[activeBuilding].frontBracingHeight}
                  onChange={(name, value) =>
                    handleNestedChange(
                      activeBuilding,
                      'frontBracingHeight',
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
            />
            {values.buildings[activeBuilding].backBracingType == 'tier' && (
              <>
                <FeetInchesInput
                  name={`buildingbackBracingHeight-${activeBuilding}`}
                  label="Height of Portal Frame:"
                  value={values.buildings[activeBuilding].backBracingHeight}
                  onChange={(name, value) =>
                    handleNestedChange(
                      activeBuilding,
                      'backBracingHeight',
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
                values.buildings[activeBuilding].leftFrame != 'postAndBeam'
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
              values.buildings[activeBuilding].rightFrame != 'postAndBeam'
            }
          />
        </div>
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
              values.buildings[activeBuilding].frontBracingType == 'torsional'
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
              values.buildings[activeBuilding].backBracingType == 'torsional'
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
              values.buildings[activeBuilding].leftFrame != 'postAndBeam'
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
          <h3>Purlins & Girts</h3>
        </header>
        <div className="grid4 alignTop">
          <div className="grid">
            <ReusableSelect
              name={`buildingfrontGirtType-${activeBuilding}`}
              value={values.buildings[activeBuilding].frontGirtType}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'frontGirtType',
                  e.target.value
                )
              }
              options={girtTypes}
              label="Front Sidewall Girt Type:"
            />
            {values.buildings[activeBuilding].frontGirtType != 'open' && (
              <>
                <ReusableSelect
                  name={`buildingfrontGirtSpacing-${activeBuilding}`}
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
                />
              </>
            )}
          </div>
          <div className="divider offOnPhone"></div>
          <div className="grid">
            <ReusableSelect
              name={`buildingbackGirtType-${activeBuilding}`}
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
            />
            {values.buildings[activeBuilding].backGirtType != 'open' && (
              <>
                <ReusableSelect
                  name={`buildingbackGirtSpacing-${activeBuilding}`}
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
                />
              </>
            )}
          </div>
          <div className="divider showWithSidebar span2"></div>
          <div className="grid">
            <ReusableSelect
              name={`buildingleftGirtType-${activeBuilding}`}
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
            />
            {values.buildings[activeBuilding].leftGirtType != 'open' && (
              <>
                <ReusableSelect
                  name={`buildingleftGirtSpacing-${activeBuilding}`}
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
                />
              </>
            )}
          </div>
          <div className="divider offOnPhone"></div>
          <div className="grid">
            <ReusableSelect
              name={`buildingrightGirtType-${activeBuilding}`}
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
            />
            {values.buildings[activeBuilding].rightGirtType != 'open' && (
              <>
                <ReusableSelect
                  name={`buildingrightGirtSpacing-${activeBuilding}`}
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
                />
              </>
            )}
          </div>
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
          />
        </div>
      </section>

      <section className="card start">
        <header className="cardHeader">
          <h3>Sheeting & Insulation</h3>
        </header>

        <div className="grid2 alignTop">
          <ReusablePanel
            name="Roof"
            valueKey="roof"
            label="Roof"
            bldg={activeBuilding}
            value={values.buildings[activeBuilding]}
            onChange={(e, keyString) =>
              handleNestedChange(activeBuilding, keyString, e.target.value)
            }
          />
          <div className="divider offOnLaptop"></div>
          <ReusablePanel
            name="Wall"
            valueKey="wall"
            label="Wall"
            bldg={activeBuilding}
            value={values.buildings[activeBuilding]}
            onChange={(e, keyString) =>
              handleNestedChange(activeBuilding, keyString, e.target.value)
            }
          />
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
