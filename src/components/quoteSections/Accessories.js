import { React, useState, Fragment } from 'react';
import { mandoors, mandoorGlass } from '../../util/dropdownOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ReusableSelect from '../Inputs/ReusableSelect';
import ReusableSlider from '../Inputs/ReusableSlider';
import ReusableInteger from '../Inputs/ReusableInteger';

const Accessories = ({
  values,
  handleChange,
  handleMandoorChange,
  setValues,
}) => {
  const [activeMandoor, setActiveMandoor] = useState(0);

  const addMandoor = () => {
    setValues((prev) => ({
      ...prev,
      mandoors: [
        ...prev.mandoors,
        {
          qty: 1,
          size: '3070',
          glass: 'none',
          leverLockset: true,
          deadBolt: true,
          panic: false,
          closer: false,
          kickPlate: false,
          mullion: false,
        },
      ],
    }));
    setActiveMandoor(values.mandoors.length);
  };

  const removeMandoor = (indexToRemove) => {
    setValues((prev) => ({
      ...prev,
      mandoors: prev.mandoors.filter((_, index) => index !== indexToRemove),
    }));

    // If the removed building was active, set the first building as active
    if (indexToRemove === activeMandoor) {
      setActiveMandoor(0);
    } else if (indexToRemove < activeMandoor) {
      // If a building before the active one is removed, adjust the active index
      setActiveMandoor((prev) => prev - 1);
    }
  };

  return (
    <>
      <section className="card">
        <header className="cardHeader">
          <h3>Accessories</h3>
        </header>
        <div className="grid2 alignTop">
          <div className="grid">
            <h4>Foundation Design</h4>
            <div className="checkboxGroup grid2">
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="monoSlabDesign"
                  name="monoSlabDesign"
                  checked={values.monoSlabDesign}
                  onChange={(e) => handleChange(e, 'monoSlabDesign')}
                />
                <label htmlFor="monoSlabDesign">
                  Include Monolothic Slab Design
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="pierFootingDesign"
                  name="pierFootingDesign"
                  checked={values.pierFootingDesign}
                  onChange={(e) => handleChange(e, 'pierFootingDesign')}
                />
                <label htmlFor="pierFootingDesign">
                  Include Pier Footing Design
                </label>
              </div>
            </div>

            <h4>Weather Tight Warranties</h4>
            <div className="checkboxGroup grid2">
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="standardWarranty"
                  name="standardWarranty"
                  checked={values.standardWarranty}
                  onChange={(e) => handleChange(e, 'standardWarranty')}
                />
                <label htmlFor="standardWarranty">
                  Include Standard Warranty
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="singleSourceWarranty"
                  name="singleSourceWarranty"
                  checked={values.pierFootingDesign}
                  onChange={(e) => handleChange(e, 'singleSourceWarranty')}
                />
                <label htmlFor="singleSourceWarranty">
                  Include Single Source Warranty
                </label>
              </div>
            </div>

            <h4>Shipping</h4>
            <div className="checkboxGroup grid2">
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="willCall"
                  name="willCall"
                  checked={values.willCall}
                  onChange={(e) => handleChange(e, 'willCall')}
                />
                <label htmlFor="willCall">Will Call - Shipping By Others</label>
              </div>
            </div>
          </div>
          <div className="grid">
            <h4>Accessories</h4>
            <ReusableSlider
              type="number"
              name="skylight4x4"
              value={values.skylight4x4}
              allowBlankValue={true}
              negative={false}
              increment={1}
              placeholder="Qty"
              label="4x4 Insulated Skylight with Curb"
              onChange={(e) => handleChange(e, 'skylight4x4')}
              row={true}
            />
            <ReusableSlider
              type="number"
              name="ridgeVent10ft"
              value={values.ridgeVent10ft}
              allowBlankValue={true}
              negative={false}
              increment={1}
              placeholder="Qty"
              label={`12"x10 ft Ridge Vent with Bird Screens and Dampers`}
              onChange={(e) => handleChange(e, 'ridgeVent10ft')}
              row={true}
            />
            <ReusableSlider
              type="number"
              name="canopyKit2x2x6"
              value={values.canopyKit2x2x6}
              allowBlankValue={true}
              negative={false}
              increment={1}
              placeholder="Qty"
              label="2x2x6 Light Weight Canopy Kit"
              onChange={(e) => handleChange(e, 'canopyKit2x2x6')}
              row={true}
            />
            <ReusableSlider
              type="number"
              name="canopyKit2x2x9"
              value={values.canopyKit2x2x9}
              allowBlankValue={true}
              negative={false}
              increment={1}
              placeholder="Qty"
              label="2x2x9 Light Weight Canopy Kit"
              onChange={(e) => handleChange(e, 'canopyKit2x2x9')}
              row={true}
            />
          </div>
        </div>
      </section>

      <section className="card">
        <header className="cardHeader">
          <h3>Man Doors</h3>
        </header>
        {values.mandoors.length > 0 && (
          <div className="onLaptop">
            <div className="tableGrid10">
              <h5>Qty</h5>
              <h5>Door Size</h5>
              <h5>Glass Option</h5>
              <h5 className="span6">Accessories</h5>
              <h5></h5>
            </div>
          </div>
        )}
        {values.mandoors.map((mandoor, mandoorIndex) => (
          <Fragment key={`building-mandoor-${mandoorIndex}`}>
            <div
              className={`tableGrid10 ${mandoorIndex == activeMandoor ? 'activeRow' : ''}`}
            >
              <ReusableSlider
                type="number"
                name={`building-mandoorQty-${mandoorIndex}`}
                value={mandoor.qty}
                allowBlankValue={false}
                negative={false}
                min={1}
                increment={1}
                placeholder="Qty"
                label="Qty:"
                labelClass="offOnLaptop"
                onChange={(e) =>
                  handleMandoorChange(mandoorIndex, 'qty', e.target.value)
                }
                onFocus={() => {
                  if (activeMandoor !== mandoorIndex) {
                    setActiveMandoor(mandoorIndex);
                  }
                }}
              />
              <ReusableSelect
                name={`building-mandoorSize-${mandoorIndex}`}
                label="Door Size:"
                labelClass="offOnLaptop"
                value={mandoor.size}
                onChange={(e) =>
                  handleMandoorChange(mandoorIndex, 'size', e.target.value)
                }
                onFocus={() => {
                  if (activeMandoor !== mandoorIndex) {
                    setActiveMandoor(mandoorIndex);
                  }
                }}
                options={mandoors}
              />
              <ReusableSelect
                name={`building-mandoorGlass-${mandoorIndex}`}
                label="Glass:"
                labelClass="offOnLaptop"
                value={mandoor.glass}
                onChange={(e) =>
                  handleMandoorChange(mandoorIndex, 'glass', e.target.value)
                }
                onFocus={() => {
                  if (activeMandoor !== mandoorIndex) {
                    setActiveMandoor(mandoorIndex);
                  }
                }}
                options={mandoorGlass}
              />
              <div className="spacer offOnLaptop span3"></div>
              <div className="checkRow">
                <input
                  type="checkbox"
                  id={`building-mandoorLever-${mandoorIndex}`}
                  name={`building-mandoorLever-${mandoorIndex}`}
                  checked={mandoor.leverLockset}
                  disabled={true}
                  onChange={(e) =>
                    handleMandoorChange(
                      mandoorIndex,
                      'leverLockset',
                      e.target.value
                    )
                  }
                  onFocus={() => {
                    if (activeMandoor !== mandoorIndex) {
                      setActiveMandoor(mandoorIndex);
                    }
                  }}
                />
                <label htmlFor={`building-mandoorLever-${mandoorIndex}`}>
                  Lever-Lockset
                </label>
              </div>
              <div className="checkRow">
                <input
                  type="checkbox"
                  id={`building-mandoorDeadBolt-${mandoorIndex}`}
                  name={`building-mandoorDeadBolt-${mandoorIndex}`}
                  checked={mandoor.deadBolt && !mandoor.panic}
                  disabled={
                    mandoor.size == '3070' ||
                    mandoor.size == '4070' ||
                    mandoor.size == '6070'
                  }
                  onChange={(e) =>
                    handleMandoorChange(
                      mandoorIndex,
                      'deadBolt',
                      e.target.value
                    )
                  }
                  onFocus={() => {
                    if (activeMandoor !== mandoorIndex) {
                      setActiveMandoor(mandoorIndex);
                    }
                  }}
                />
                <label htmlFor={`building-mandoorDeadBolt-${mandoorIndex}`}>
                  Dead Bolt
                </label>
              </div>
              <div className="checkRow">
                <input
                  type="checkbox"
                  id={`building-mandoorPanic-${mandoorIndex}`}
                  name={`building-mandoorPanic-${mandoorIndex}`}
                  checked={mandoor.panic}
                  disabled={
                    mandoor.size == '3070' ||
                    mandoor.size == '4070' ||
                    mandoor.size == '6070'
                  }
                  onChange={(e) =>
                    handleMandoorChange(mandoorIndex, 'panic', e.target.value)
                  }
                  onFocus={() => {
                    if (activeMandoor !== mandoorIndex) {
                      setActiveMandoor(mandoorIndex);
                    }
                  }}
                />
                <label htmlFor={`building-mandoorPanic-${mandoorIndex}`}>
                  Panic Hardware
                </label>
              </div>
              <div className="checkRow">
                <input
                  type="checkbox"
                  id={`building-mandoorCloser-${mandoorIndex}`}
                  name={`building-mandoorCloser-${mandoorIndex}`}
                  checked={
                    mandoor.closer &&
                    mandoor.size != '3070' &&
                    mandoor.size != '4070' &&
                    mandoor.size != '6070'
                  }
                  disabled={
                    mandoor.size == '3070' ||
                    mandoor.size == '4070' ||
                    mandoor.size == '6070'
                  }
                  onChange={(e) =>
                    handleMandoorChange(mandoorIndex, 'closer', e.target.value)
                  }
                  onFocus={() => {
                    if (activeMandoor !== mandoorIndex) {
                      setActiveMandoor(mandoorIndex);
                    }
                  }}
                />
                <label htmlFor={`building-mandoorCloser-${mandoorIndex}`}>
                  Closers
                </label>
              </div>
              <div className="checkRow">
                <input
                  type="checkbox"
                  id={`building-mandoorKickPlate-${mandoorIndex}`}
                  name={`building-mandoorKickPlate-${mandoorIndex}`}
                  checked={mandoor.kickPlate}
                  disabled={
                    mandoor.size == '3070' ||
                    mandoor.size == '4070' ||
                    mandoor.size == '6070'
                  }
                  onChange={(e) =>
                    handleMandoorChange(
                      mandoorIndex,
                      'kickPlate',
                      e.target.value
                    )
                  }
                  onFocus={() => {
                    if (activeMandoor !== mandoorIndex) {
                      setActiveMandoor(mandoorIndex);
                    }
                  }}
                />
                <label htmlFor={`building-mandoorKickPlate-${mandoorIndex}`}>
                  Kick Plate
                </label>
              </div>
              <div className="checkRow">
                <input
                  type="checkbox"
                  id={`building-mandoorMullion-${mandoorIndex}`}
                  name={`building-mandoorMullion-${mandoorIndex}`}
                  checked={mandoor.mullion && mandoor.size == '6070P'}
                  disabled={mandoor.size != '6070P'}
                  onChange={(e) =>
                    handleMandoorChange(mandoorIndex, 'mullion', e.target.value)
                  }
                  onFocus={() => {
                    if (activeMandoor !== mandoorIndex) {
                      setActiveMandoor(mandoorIndex);
                    }
                  }}
                />
                <label htmlFor={`building-mandoorMullion-${mandoorIndex}`}>
                  Removable Mullion
                </label>
              </div>
              <button
                onClick={() => removeMandoor(mandoorIndex)}
                className="icon red deleteRow span3"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            <div className="divider offOnTablet"></div>
          </Fragment>
        ))}
        <button
          type="button"
          className="button success addRow"
          onClick={() => addMandoor()}
        >
          Add
        </button>
      </section>

      <section className="card">
        <header className="cardHeader">
          <h3>Additional Project Information</h3>
        </header>
        <div className="grid4 alignTop">
          <div className="grid">
            <h4>By Others Notes</h4>
            <div className="checkboxGroup">
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="noteCMUWallByOthers"
                  name="noteCMUWallByOthers"
                  checked={values.noteCMUWallByOthers}
                  onChange={(e) => handleChange(e, 'noteCMUWallByOthers')}
                />
                <label htmlFor="noteCMUWallByOthers">
                  CMU Walls - By Others
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="notePlywoodLinerByOthers"
                  name="notePlywoodLinerByOthers"
                  checked={values.notePlywoodLinerByOthers}
                  onChange={(e) => handleChange(e, 'notePlywoodLinerByOthers')}
                />
                <label htmlFor="notePlywoodLinerByOthers">
                  Plywood Liner - By Others
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="noteMezzanineByOthers"
                  name="noteMezzanineByOthers"
                  checked={values.noteMezzanineByOthers}
                  onChange={(e) => handleChange(e, 'noteMezzanineByOthers')}
                />
                <label htmlFor="noteMezzanineByOthers">
                  Mezzanine - By Others
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="noteFirewallByOthers"
                  name="noteFirewallByOthers"
                  checked={values.noteFirewallByOthers}
                  onChange={(e) => handleChange(e, 'noteFirewallByOthers')}
                />
                <label htmlFor="noteFirewallByOthers">
                  Firewall - By Others
                </label>
              </div>
            </div>

            <h4>Disclaimer Notes</h4>
            <div className="checkboxGroup">
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="noteExtBldgDisclaimer"
                  name="noteExtBldgDisclaimer"
                  checked={values.noteExtBldgDisclaimer}
                  onChange={(e) => handleChange(e, 'noteExtBldgDisclaimer')}
                />
                <label htmlFor="noteExtBldgDisclaimer">
                  Existing Buildings Disclaimer
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="noteRoofPitchDisclaimer"
                  name="noteRoofPitchDisclaimer"
                  checked={values.noteRoofPitchDisclaimer}
                  onChange={(e) => handleChange(e, 'noteRoofPitchDisclaimer')}
                />
                <label htmlFor="noteRoofPitchDisclaimer">
                  PBR Roofing with 1/2:12 Roof Pitch
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="noteSeismicGapDisclaimer"
                  name="noteSeismicGapDisclaimer"
                  checked={values.noteSeismicGapDisclaimer}
                  onChange={(e) => handleChange(e, 'noteSeismicGapDisclaimer')}
                />
                <label htmlFor="noteSeismicGapDisclaimer">
                  Seismic Gap Disclaimer
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="noteWaterPondingDisclaimer"
                  name="noteWaterPondingDisclaimer"
                  checked={values.noteWaterPondingDisclaimer}
                  onChange={(e) =>
                    handleChange(e, 'noteWaterPondingDisclaimer')
                  }
                />
                <label htmlFor="noteWaterPondingDisclaimer">
                  Water Ponding Disclaimer
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="noteBldgSpecsDisclaimer"
                  name="noteBldgSpecsDisclaimer"
                  checked={values.addProjectInfo}
                  onChange={(e) => handleChange(e, 'noteBldgSpecsDisclaimer')}
                />
                <label htmlFor="noteBldgSpecsDisclaimer">
                  Building With Spec's
                </label>
              </div>
            </div>
          </div>

          <div className="grid">
            <h4>Additional Building Items</h4>
            <div className="checkboxGroup">
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemExtBldg"
                  name="addItemExtBldg"
                  checked={values.addItemExtBldg}
                  onChange={(e) => handleChange(e, 'addItemExtBldg')}
                />
                <label htmlFor="addItemExtBldg">
                  Next to an Existing Building
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemPartWalls"
                  name="addItemPartWalls"
                  checked={values.addItemPartWalls}
                  onChange={(e) => handleChange(e, 'addItemPartWalls')}
                />
                <label htmlFor="addItemPartWalls">
                  Has Partition Walls By Others
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemRoofOpenings"
                  name="addItemRoofOpenings"
                  checked={values.addItemRoofOpenings}
                  onChange={(e) => handleChange(e, 'addItemRoofOpenings')}
                />
                <label htmlFor="addItemRoofOpenings">Has Roof Openings</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemStepElev"
                  name="addItemStepElev"
                  checked={values.addItemStepElev}
                  onChange={(e) => handleChange(e, 'addItemStepElev')}
                />
                <label htmlFor="addItemStepElev">Has Step Elevations</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemHorizPanels"
                  name="addItemHorizPanels"
                  checked={values.addItemHorizPanels}
                  onChange={(e) => handleChange(e, 'addItemHorizPanels')}
                />
                <label htmlFor="addItemHorizPanels">
                  Has Horizontal Panels
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemParapetWalls"
                  name="addItemParapetWalls"
                  checked={values.addItemParapetWalls}
                  onChange={(e) => handleChange(e, 'addItemParapetWalls')}
                />
                <label htmlFor="addItemParapetWalls">Has Parapet Walls</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemFaciaWalls"
                  name="addItemFaciaWalls"
                  checked={values.addItemFaciaWalls}
                  onChange={(e) => handleChange(e, 'addItemFaciaWalls')}
                />
                <label htmlFor="addItemFaciaWalls">Has Facia Walls</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemBumpoutWalls"
                  name="addItemBumpoutWalls"
                  checked={values.addItemBumpoutWalls}
                  onChange={(e) => handleChange(e, 'addItemBumpoutWalls')}
                />
                <label htmlFor="addItemBumpoutWalls">Has Bump-out Walls</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemCupolas"
                  name="addItemCupolas"
                  checked={values.addItemCupolas}
                  onChange={(e) => handleChange(e, 'addItemCupolas')}
                />
                <label htmlFor="addItemCupolas">Has Cupolas</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemClearstory"
                  name="addItemClearstory"
                  checked={values.addItemClearstory}
                  onChange={(e) => handleChange(e, 'addItemClearstory')}
                />
                <label htmlFor="addItemClearstory">Has Clearstory</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemHipValley"
                  name="addItemHipValley"
                  checked={values.addItemHipValley}
                  onChange={(e) => handleChange(e, 'addItemHipValley')}
                />
                <label htmlFor="addItemHipValley">
                  Has Hip/Valley Roof Condition
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemGambrelRoof"
                  name="addItemGambrelRoof"
                  checked={values.addItemGambrelRoof}
                  onChange={(e) => handleChange(e, 'addItemGambrelRoof')}
                />
                <label htmlFor="addItemGambrelRoof">
                  Has Gable Roof (Special Shape Roof)
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemTiltUpWalls"
                  name="addItemTiltUpWalls"
                  checked={values.addItemTiltUpWalls}
                  onChange={(e) => handleChange(e, 'addItemTiltUpWalls')}
                />
                <label htmlFor="addItemTiltUpWalls">
                  Has Concrete Tilt Up Walls (All Four Walls)
                </label>
              </div>
            </div>
          </div>

          <div className="grid">
            <h4>Mezzanine Buildings</h4>
            <div className="checkboxGroup">
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="mezzSimple"
                  name="mezzSimple"
                  checked={values.mezzSimple}
                  onChange={(e) => handleChange(e, 'mezzSimple')}
                />
                <label htmlFor="mezzSimple">Has Simple Mezzanine</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="mezzLShape"
                  name="mezzLShape"
                  checked={values.mezzLShape}
                  onChange={(e) => handleChange(e, 'mezzLShape')}
                />
                <label htmlFor="mezzLShape">Has L-Shape Mezzanine</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="mezzNotAligned"
                  name="mezzNotAligned"
                  checked={values.mezzNotAligned}
                  onChange={(e) => handleChange(e, 'mezzNotAligned')}
                />
                <label htmlFor="mezzNotAligned">
                  Has Mezzanine Not Aligned with Frames
                </label>
              </div>
            </div>

            <h4>Crane Buildings</h4>
            <div className="checkboxGroup">
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="craneStepCols"
                  name="craneStepCols"
                  checked={values.craneStepCols}
                  onChange={(e) => handleChange(e, 'craneStepCols')}
                />
                <label htmlFor="craneStepCols">
                  Has Step Columns for Cranes over 20 tons
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="craneJib"
                  name="craneJib"
                  checked={values.craneJib}
                  onChange={(e) => handleChange(e, 'craneJib')}
                />
                <label htmlFor="craneJib">Has Jib Cranes</label>
              </div>
            </div>

            <h4>Hangar Buildings</h4>
            <div className="checkboxGroup">
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="tHangar"
                  name="tHangar"
                  checked={values.tHangar}
                  onChange={(e) => handleChange(e, 'tHangar')}
                />
                <label htmlFor="tHangar">Is a T-Hangar</label>
              </div>
            </div>
          </div>

          <div className="grid">
            <h4>Other</h4>
            <div className="checkboxGroup">
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="otherBldgSpecs"
                  name="otherBldgSpecs"
                  checked={values.otherBldgSpecs}
                  onChange={(e) => handleChange(e, 'otherBldgSpecs')}
                />
                <label htmlFor="otherBldgSpecs">Has Building Spec's</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="otherNonStdSpecs"
                  name="otherNonStdSpecs"
                  checked={values.otherNonStdSpecs}
                  onChange={(e) => handleChange(e, 'otherNonStdSpecs')}
                />
                <label htmlFor="otherNonStdSpecs">
                  Has Non-standard Spec's
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="otherCarrierBms"
                  name="otherCarrierBms"
                  checked={values.otherCarrierBms}
                  onChange={(e) => handleChange(e, 'otherCarrierBms')}
                />
                <label htmlFor="otherCarrierBms">Has Carrier Beams</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="otherPortalCarrier"
                  name="otherPortalCarrier"
                  checked={values.otherPortalCarrier}
                  onChange={(e) => handleChange(e, 'otherPortalCarrier')}
                />
                <label htmlFor="otherPortalCarrier">
                  Has Portal Carrier Beams
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="otherNonStdCarrier"
                  name="otherNonStdCarrier"
                  checked={values.otherNonStdCarrier}
                  onChange={(e) => handleChange(e, 'otherNonStdCarrier')}
                />
                <label htmlFor="otherNonStdCarrier">
                  Has Non-standard Carrier Beams
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="otherBarJoists"
                  name="otherBarJoists"
                  checked={values.otherBarJoists}
                  onChange={(e) => handleChange(e, 'otherBarJoists')}
                />
                <label htmlFor="otherBarJoists">Has Bar Joists</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="otherWeakAxis"
                  name="otherWeakAxis"
                  checked={values.otherWeakAxis}
                  onChange={(e) => handleChange(e, 'otherWeakAxis')}
                />
                <label htmlFor="otherWeakAxis">
                  Has Fixed Base Columns with Weak-axis Bending
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="otherSkewedEndwall"
                  name="otherSkewedEndwall"
                  checked={values.otherSkewedEndwall}
                  onChange={(e) => handleChange(e, 'otherSkewedEndwall')}
                />
                <label htmlFor="otherSkewedEndwall">
                  Has Skewed Wall at the Endwall
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="otherSkewedSidewall"
                  name="otherSkewedSidewall"
                  checked={values.otherSkewedSidewall}
                  onChange={(e) => handleChange(e, 'otherSkewedSidewall')}
                />
                <label htmlFor="otherSkewedSidewall">
                  Has Skewed Wall at the Sidewall
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="otherBulkStorageSeeds"
                  name="otherBulkStorageSeeds"
                  checked={values.otherBulkStorageSeeds}
                  onChange={(e) => handleChange(e, 'otherBulkStorageSeeds')}
                />
                <label htmlFor="otherBulkStorageSeeds">
                  Is Bulk Storage for Seeds
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="otherBulkStorage"
                  name="otherBulkStorage"
                  checked={values.otherBulkStorage}
                  onChange={(e) => handleChange(e)}
                />
                <label htmlFor="otherBulkStorage">
                  Is Bulk Storage for Potatoes/Onions
                </label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="otherLoadsByOthers"
                  name="otherLoadsByOthers"
                  value={values.otherLoadsByOthers}
                  onChange={handleChange}
                />
                <label htmlFor="otherLoadsByOthers">
                  Has Loads By Others ono PBS Building
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Accessories;
