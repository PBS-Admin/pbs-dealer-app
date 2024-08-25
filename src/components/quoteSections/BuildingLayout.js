import React from 'react';
import Image from 'next/image';
import ReusableSelect from '../../components/ReusableSelect';
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
} from '../../util/dropdownOptions';

const BuildingLayout = ({ values, activeBuilding, handleNestedChange }) => {
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
            <div className="cardInput">
              <label htmlFor={`buildingPeakOffset-${activeBuilding}`}>
                Back Peak Offset:
              </label>
              <input
                type="text"
                id={`buildingPeakOffset-${activeBuilding}`}
                name={`buildingPeakOffset-${activeBuilding}`}
                value={values.buildings[activeBuilding].backPeakOffset}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'backPeakOffset',
                    e.target.value
                  )
                }
                placeholder="Feet"
              />
            </div>
          )}
        </div>
        <div className="divider"></div>
        <div className="cardGrid">
          <div className="cardInput">
            <label htmlFor={`buildingWidth-${activeBuilding}`}>Width:</label>
            <input
              type="text"
              id={`buildingWidth-${activeBuilding}`}
              name={`buildingWidth-${activeBuilding}`}
              value={values.buildings[activeBuilding].width}
              onChange={(e) =>
                handleNestedChange(activeBuilding, 'width', e.target.value)
              }
              placeholder="Feet"
            />
          </div>
          <div className="cardInput">
            <label htmlFor={`buildingLength-${activeBuilding}`}>Length:</label>
            <input
              type="text"
              id={`buildingLength-${activeBuilding}`}
              name={`buildingLength-${activeBuilding}`}
              value={values.buildings[activeBuilding].length}
              onChange={(e) =>
                handleNestedChange(activeBuilding, 'length', e.target.value)
              }
              placeholder="Feet"
            />
          </div>
          {values.buildings[activeBuilding].shape == 'symmetrical' && (
            <div className="cardInput">
              <label htmlFor={`buildingEaveHeight-${activeBuilding}`}>
                Eave Height:
              </label>
              <input
                type="text"
                id={`buildingEaveHeight-${activeBuilding}`}
                name={`buildingEaveHeight-${activeBuilding}`}
                value={values.buildings[activeBuilding].eaveHeight}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'eaveHeight',
                    e.target.value
                  )
                }
                placeholder="Feet"
              />
            </div>
          )}
          {(values.buildings[activeBuilding].shape == 'singleSlope' ||
            values.buildings[activeBuilding].shape == 'leanTo') && (
            <>
              <div className="cardInput">
                <label htmlFor={`buildingLowEaveHeight-${activeBuilding}`}>
                  Low Eave Height:
                </label>
                <input
                  type="text"
                  id={`buildingLowEaveHeight-${activeBuilding}`}
                  name={`buildingLowEaveHeight-${activeBuilding}`}
                  value={values.buildings[activeBuilding].lowEaveHeight}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'lowEaveHeight',
                      e.target.value
                    )
                  }
                  placeholder="Feet"
                />
              </div>
              <div className="cardInput">
                <label htmlFor={`buildingHighEaveHeight-${activeBuilding}`}>
                  Low Eave Height:
                </label>
                <input
                  type="text"
                  id={`buildingHighEaveHeight-${activeBuilding}`}
                  name={`buildingHighEaveHeight-${activeBuilding}`}
                  value={values.buildings[activeBuilding].highEaveHeight}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'highEaveHeight',
                      e.target.value
                    )
                  }
                  placeholder="Feet"
                />
              </div>
            </>
          )}
          {values.buildings[activeBuilding].shape != 'nonSymmetrical' && (
            <div className="cardInput">
              <label htmlFor={`buildingRoofPitch-${activeBuilding}`}>
                Roof Pitch:
              </label>
              <input
                type="text"
                id={`buildingRoofPitch-${activeBuilding}`}
                name={`buildingRoofPitch-${activeBuilding}`}
                value={values.buildings[activeBuilding].roofPitch}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'roofPitch',
                    e.target.value
                  )
                }
                placeholder="x:12"
              />
            </div>
          )}
          {values.buildings[activeBuilding].shape == 'nonSymmetrical' && (
            <>
              <div className="cardInput">
                <label htmlFor={`buildingBackEaveHeight-${activeBuilding}`}>
                  Back Eave Height:
                </label>
                <input
                  type="text"
                  id={`buildingBackEaveHeight-${activeBuilding}`}
                  name={`buildingBackEaveHeight-${activeBuilding}`}
                  value={values.buildings[activeBuilding].backEaveHeight}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'backEaveHeight',
                      e.target.value
                    )
                  }
                  placeholder="Feet"
                />
              </div>
              <div className="cardInput">
                <label htmlFor={`buildingFrontEaveHeight-${activeBuilding}`}>
                  Front Eave Height:
                </label>
                <input
                  type="text"
                  id={`buildingFrontEaveHeight-${activeBuilding}`}
                  name={`buildingFrontEaveHeight-${activeBuilding}`}
                  value={values.buildings[activeBuilding].frontEaveHeight}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'frontEaveHeight',
                      e.target.value
                    )
                  }
                  placeholder="Feet"
                />
              </div>
              <div className="cardInput">
                <label htmlFor={`buildingBackRoofPitch-${activeBuilding}`}>
                  Back Roof Pitch:
                </label>
                <input
                  type="text"
                  id={`buildingBackRoofPitch-${activeBuilding}`}
                  name={`buildingBackRoofPitch-${activeBuilding}`}
                  value={values.buildings[activeBuilding].backRoofPitch}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'backRoofPitch',
                      e.target.value
                    )
                  }
                  placeholder="Feet"
                />
              </div>
              <div className="cardInput">
                <label htmlFor={`buildingFrontRoofPitch-${activeBuilding}`}>
                  Front Roof Pitch:
                </label>
                <input
                  type="text"
                  id={`buildingFrontRoofPitch-${activeBuilding}`}
                  name={`buildingFrontRoofPitch-${activeBuilding}`}
                  value={values.buildings[activeBuilding].frontRoofPitch}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'frontRoofPitch',
                      e.target.value
                    )
                  }
                  placeholder="Feet"
                />
              </div>
            </>
          )}
        </div>
        <h4>Bay Spacing</h4>
        <div className="cardGrid">
          <div className="cardInput">
            <label htmlFor={`buildingSWBaySpacing-${activeBuilding}`}>
              Sidewall Bay Spacing:
            </label>
            <input
              type="text"
              id={`buildingSWBaySpacing-${activeBuilding}`}
              name={`buildingSWBaySpacing-${activeBuilding}`}
              value={values.buildings[activeBuilding].swBaySpacing}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'swBaySpacing',
                  e.target.value
                )
              }
              placeholder="Separate Bays with Spaces"
            />
          </div>
          <div className="cardInput">
            <label htmlFor={`buildingLEWBaySpacing-${activeBuilding}`}>
              Left Endwall Bay Spacing:
            </label>
            <input
              type="text"
              id={`buildingLEWBaySpacing-${activeBuilding}`}
              name={`buildingLEWBaySpacing-${activeBuilding}`}
              value={values.buildings[activeBuilding].lewBaySpacing}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'lewBaySpacing',
                  e.target.value
                )
              }
              placeholder="Separate Bays with Spaces"
            />
          </div>
          <div className="cardInput">
            <label htmlFor={`buildingREWBaySpacing-${activeBuilding}`}>
              Right Endwall Bay Spacing:
            </label>
            <input
              type="text"
              id={`buildingREWBaySpacing-${activeBuilding}`}
              name={`buildingREWBaySpacing-${activeBuilding}`}
              value={values.buildings[activeBuilding].rewBaySpacing}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'rewBaySpacing',
                  e.target.value
                )
              }
              placeholder="Separate Bays with Spaces"
            />
          </div>
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
            <div className="cardInput">
              <label htmlFor={`buildingIntColSpacing-${activeBuilding}`}>
                Int Column Spacing:
              </label>
              <input
                type="text"
                id={`buildingIntColSpacing-${activeBuilding}`}
                name={`buildingIntColSpacing-${activeBuilding}`}
                value={values.buildings[activeBuilding].intColSpacing}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'intColSpacing',
                    e.target.value
                  )
                }
                placeholder="Feet"
              />
            </div>
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
              <>
                <label htmlFor={`buildingLeftEnwallInset-${activeBuilding}`}>
                  Inset # of Bays
                </label>
                <input
                  type="text"
                  id={`buildingLeftEnwallInset-${activeBuilding}`}
                  name={`buildingLeftEnwallInset-${activeBuilding}`}
                  value={values.buildings[activeBuilding].leftEnwallInset}
                  onChange={(e) =>
                    handleNestedChange(
                      activeBuilding,
                      'leftEnwallInset',
                      e.target.value
                    )
                  }
                  placeholder=""
                />
              </>
            )}
          </div>

          <div className="cardInput">
            <label
              htmlFor={`buildingLeftEnwallIntColSpacing-${activeBuilding}`}
            >
              Interior Column Spacing
            </label>
            <input
              type="text"
              id={`buildingLeftEnwallIntColSpacing-${activeBuilding}`}
              name={`buildingLeftEnwallIntColSpacing-${activeBuilding}`}
              value={values.buildings[activeBuilding].lewIntColSpacing}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'lewIntColSpacing',
                  e.target.value
                )
              }
              placeholder="Separate Bays with Comma"
            />
          </div>
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
              <>
                <div className="cardInput">
                  <label htmlFor={`buildingRightEnwallInset-${activeBuilding}`}>
                    Inset # of Bays
                  </label>
                  <input
                    type="text"
                    id={`buildingRightEnwallInset-${activeBuilding}`}
                    name={`buildingRightEnwallInset-${activeBuilding}`}
                    value={values.buildings[activeBuilding].rightEnwallInset}
                    onChange={(e) =>
                      handleNestedChange(
                        activeBuilding,
                        'rightEnwallInset',
                        e.target.value
                      )
                    }
                    placeholder=""
                  />
                </div>
                <div></div>
              </>
            )}
          </div>

          <div className="cardInput">
            <label
              htmlFor={`buildingRightEnwallIntColSpacing-${activeBuilding}`}
            >
              Interior Column Spacing
            </label>
            <input
              type="text"
              id={`buildingRightEnwallIntColSpacing-${activeBuilding}`}
              name={`buildingRightEnwallIntColSpacing-${activeBuilding}`}
              value={values.buildings[activeBuilding].rewIntColSpacing}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'rewIntColSpacing',
                  e.target.value
                )
              }
              placeholder="Separate Bays with Comma"
            />
          </div>
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
            <div className="cardInput">
              <label htmlFor={`buildingbswBracing-${activeBuilding}`}>
                Height of Portal Frame:
              </label>
              <input
                type="text"
                id={`buildingbswBracing-${activeBuilding}`}
                name={`buildingbswBracing-${activeBuilding}`}
                value={values.buildings[activeBuilding].fswBracingHeight}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'fswBracingHeight',
                    e.target.value
                  )
                }
                placeholder="Feet"
              />
            </div>
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
            <div className="cardInput">
              <label htmlFor={`buildingbswBracingHeight-${activeBuilding}`}>
                Height of Portal Frame:
              </label>
              <input
                type="text"
                id={`buildingbswBracingHeight-${activeBuilding}`}
                name={`buildingbswBracingHeight-${activeBuilding}`}
                value={values.buildings[activeBuilding].bswBracingHeight}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'bswBracingHeight',
                    e.target.value
                  )
                }
                placeholder="Feet"
              />
            </div>
          )}
          {values.buildings[activeBuilding].lewFrame == 'postAndBeam' && (
            <ReusableSelect
              id={`buildinglewBracing-${activeBuilding}`}
              name={`buildinglewBracing-${activeBuilding}`}
              value={values.buildings[activeBuilding].lewBracingType}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'lewBracingType',
                  e.target.value
                )
              }
              options={EndwallBracingType}
              label="Left Endwall Bracing Type:"
            />
          )}
          {values.buildings[activeBuilding].rewFrame == 'postAndBeam' && (
            <ReusableSelect
              id={`buildingrewBracing-${activeBuilding}`}
              name={`buildingrewBracing-${activeBuilding}`}
              value={values.buildings[activeBuilding].rewBracingType}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'rewBracingType',
                  e.target.value
                )
              }
              options={EndwallBracingType}
              label="Right Endwall Bracing Type:"
            />
          )}
        </div>
        <div className="divider"></div>

        <h4>Wall Braced Bays</h4>
        <div className="cardGrid">
          {values.buildings[activeBuilding].fswBracingType != 'torsional' && (
            <div className="cardInput">
              <label htmlFor={`buildingfswBracedBays-${activeBuilding}`}>
                Front Sidewall:
              </label>
              <input
                type="text"
                id={`buildingfswBracedBays-${activeBuilding}`}
                name={`buildingfswBracedBays-${activeBuilding}`}
                value={values.buildings[activeBuilding].fswBracedBays}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'fswBracedBays',
                    e.target.value
                  )
                }
                placeholder="Separate Bays with Space"
              />
            </div>
          )}
          {values.buildings[activeBuilding].bswBracingType != 'torsional' && (
            <div className="cardInput">
              <label htmlFor={`buildingbswBracedBays-${activeBuilding}`}>
                Back Sidewall:
              </label>
              <input
                type="text"
                id={`buildingbswBracedBays-${activeBuilding}`}
                name={`buildingbswBracedBays-${activeBuilding}`}
                value={values.buildings[activeBuilding].bswBracedBays}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'bswBracedBays',
                    e.target.value
                  )
                }
                placeholder="Separate Bays with Space"
              />
            </div>
          )}
          {values.buildings[activeBuilding].lewFrame == 'postAndBeam' && (
            <div className="cardInput">
              <label htmlFor={`buildinglewBracedBays-${activeBuilding}`}>
                Back Sidewall:
              </label>
              <input
                type="text"
                id={`buildinglewBracedBays-${activeBuilding}`}
                name={`buildinglewBracedBays-${activeBuilding}`}
                value={values.buildings[activeBuilding].lewBracedBays}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'lewBracedBays',
                    e.target.value
                  )
                }
                placeholder="Separate Bays with Space"
              />
            </div>
          )}
          {values.buildings[activeBuilding].rewFrame == 'postAndBeam' && (
            <div className="cardInput">
              <label htmlFor={`buildingrewBracedBays-${activeBuilding}`}>
                Right Endwall:
              </label>
              <input
                type="text"
                id={`buildingrewBracedBays-${activeBuilding}`}
                name={`buildingrewBracedBays-${activeBuilding}`}
                value={values.buildings[activeBuilding].rewBracedBays}
                onChange={(e) =>
                  handleNestedChange(
                    activeBuilding,
                    'rewBracedBays',
                    e.target.value
                  )
                }
                placeholder="Separate Bays with Space"
              />
            </div>
          )}
        </div>

        <h4>Roof Bracing</h4>
        <div className="cardGrid">
          <div className="cardInput">
            <label htmlFor={`buildingRoofBracedBays-${activeBuilding}`}>
              Roof Braced Bays:
            </label>
            <input
              type="text"
              id={`buildingRoofBracedBays-${activeBuilding}`}
              name={`buildingRoofBracedBays-${activeBuilding}`}
              value={values.buildings[activeBuilding].roofBracedBays}
              onChange={(e) =>
                handleNestedChange(
                  activeBuilding,
                  'roofBracedBays',
                  e.target.value
                )
              }
              placeholder="Separate Bays with Space"
            />
          </div>
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
