import { React, useState, Fragment } from 'react';
import { mandoors, mandoorGlass } from '../../util/dropdownOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ReusableSelect from '../Inputs/ReusableSelect';
import ReusableSlider from '../Inputs/ReusableSlider';
import ReusableToggle from '../Inputs/ReusableToggle';
import ReusableInteger from '../Inputs/ReusableInteger';
import { useBuildingContext } from '@/contexts/BuildingContext';

const Accessories = ({ locked }) => {
  // Local State
  const [activeMandoor, setActiveMandoor] = useState(0);

  // Contexts
  const {
    state,
    handleChange,
    handleMandoorChange,
    addMandoor,
    removeMandoor,
  } = useBuildingContext();

  // Local Functions
  const handleAddMandoor = () => {
    addMandoor();
    setActiveMandoor(state.mandoors.length);
  };

  const handleRemoveMandoor = (indexToRemove) => {
    removeMandoor(indexToRemove);
    if (indexToRemove === activeMandoor) {
      setActiveMandoor(0);
    } else if (indexToRemove < activeMandoor) {
      setActiveMandoor((prev) => prev - 1);
    }
  };

  // JSX
  return (
    <>
      <section className="card">
        <header className="cardHeader">
          <h3>Accessories</h3>
        </header>
        <div className="grid2 alignTop">
          <div className="grid">
            <h4>Foundation Design</h4>
            <div className="toggleGroup grid2 large">
              <ReusableToggle
                id="monoSlabDesign"
                checked={state.monoSlabDesign}
                onChange={(e) => {
                  handleChange(e, 'monoSlabDesign');
                }}
                label="Include Monolothic Slab Design"
                className="prim"
                disabled={locked}
              />
              <ReusableToggle
                id="pierFootingDesign"
                checked={state.pierFootingDesign}
                onChange={(e) => handleChange(e, 'pierFootingDesign')}
                label="Include Pier Footing Design"
                className="prim"
                disabled={locked}
              />
            </div>

            <h4>Weather Tight Warranties</h4>
            <div className="toggleGroup grid2 large">
              <ReusableToggle
                id="standardWarranty"
                checked={state.standardWarranty}
                onChange={(e) => {
                  handleChange(e, 'standardWarranty');
                }}
                label="Include Standard Warranty"
                className="prim"
                disabled={locked}
              />
              <ReusableToggle
                id="singleSourceWarranty"
                checked={state.singleSourceWarranty}
                onChange={(e) => handleChange(e, 'singleSourceWarranty')}
                label="Include Single Source Warranty"
                className="prim"
                disabled={locked}
              />
            </div>

            <h4>Shipping</h4>
            <div className="toggleGroup grid2 large">
              <ReusableToggle
                id="willCall"
                checked={state.willCall}
                onChange={(e) => handleChange(e, 'willCall')}
                label="Will Call - Shipping By Others"
                className="prim"
                disabled={locked}
              />
            </div>
          </div>

          <div className="grid">
            <h4>Accessories</h4>
            <ReusableSlider
              type="number"
              name="skylight4x4"
              value={state.skylight4x4}
              allowBlankValue={true}
              negative={false}
              increment={1}
              placeholder="Qty"
              label="4x4 Insulated Skylight with Curb"
              onChange={handleChange}
              row={true}
              disabled={locked}
            />
            <ReusableSlider
              type="number"
              name="ridgeVent10ft"
              value={state.ridgeVent10ft}
              allowBlankValue={true}
              negative={false}
              increment={1}
              placeholder="Qty"
              label={`12"x10 ft Ridge Vent with Bird Screens and Dampers`}
              onChange={handleChange}
              row={true}
              disabled={locked}
            />
            <ReusableSlider
              type="number"
              name="canopyKit2x2x6"
              value={state.canopyKit2x2x6}
              allowBlankValue={true}
              negative={false}
              increment={1}
              placeholder="Qty"
              label="2x2x6 Light Weight Canopy Kit"
              onChange={handleChange}
              row={true}
              disabled={locked}
            />
            <ReusableSlider
              type="number"
              name="canopyKit2x2x9"
              value={state.canopyKit2x2x9}
              allowBlankValue={true}
              negative={false}
              increment={1}
              placeholder="Qty"
              label="2x2x9 Light Weight Canopy Kit"
              onChange={handleChange}
              row={true}
              disabled={locked}
            />
          </div>
        </div>
      </section>

      <section className="card">
        <header className="cardHeader">
          <h3>Man Doors</h3>
        </header>
        {state.mandoors.length > 0 && (
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
        {state.mandoors.map((mandoor, mandoorIndex) => (
          <Fragment key={`building-mandoor-${mandoorIndex}`}>
            <div
              className={`tableGrid10 ${mandoorIndex == activeMandoor ? 'activeRow' : ''}`}
            >
              <ReusableSlider
                type="number"
                name={`building-mandoorQty-${mandoorIndex}`}
                value={mandoor.qty}
                allowZero={false}
                negative={false}
                min={1}
                increment={1}
                placeholder="Qty"
                label="Qty:"
                labelClass="offOnLaptop"
                onChange={(e) => handleMandoorChange(mandoorIndex, 'qty', e)}
                onFocus={() => {
                  if (activeMandoor !== mandoorIndex) {
                    setActiveMandoor(mandoorIndex);
                  }
                }}
                disabled={locked}
              />
              <ReusableSelect
                name={`building-mandoorSize-${mandoorIndex}`}
                label="Door Size:"
                labelClass="offOnLaptop"
                value={mandoor.size}
                onChange={(e) => handleMandoorChange(mandoorIndex, 'size', e)}
                onFocus={() => {
                  if (activeMandoor !== mandoorIndex) {
                    setActiveMandoor(mandoorIndex);
                  }
                }}
                options={mandoors}
                disabled={locked}
              />
              <ReusableSelect
                name={`building-mandoorGlass-${mandoorIndex}`}
                label="Glass:"
                labelClass="offOnLaptop"
                value={mandoor.glass}
                onChange={(e) => handleMandoorChange(mandoorIndex, 'glass', e)}
                onFocus={() => {
                  if (activeMandoor !== mandoorIndex) {
                    setActiveMandoor(mandoorIndex);
                  }
                }}
                options={mandoorGlass}
                disabled={locked}
              />
              <div className="spacer offOnLaptop span3"></div>
              <div className="checkRow">
                <input
                  type="checkbox"
                  id={`building-mandoorLever-${mandoorIndex}`}
                  name={`building-mandoorLever-${mandoorIndex}`}
                  checked={
                    !mandoor.panic ||
                    mandoor.size == '3070' ||
                    mandoor.size == '4070' ||
                    mandoor.size == '6070'
                  }
                  disabled={locked || true}
                  onChange={(e) =>
                    handleMandoorChange(mandoorIndex, 'leverLockset', e)
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
                  checked={
                    mandoor.deadBolt ||
                    mandoor.size == '3070' ||
                    mandoor.size == '4070' ||
                    mandoor.size == '6070'
                  }
                  disabled={
                    mandoor.size == '3070' ||
                    mandoor.size == '4070' ||
                    mandoor.size == '6070' ||
                    locked
                  }
                  onChange={(e) =>
                    handleMandoorChange(mandoorIndex, 'deadBolt', e)
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
                  checked={
                    mandoor.panic &&
                    mandoor.size != '3070' &&
                    mandoor.size != '4070' &&
                    mandoor.size != '6070'
                  }
                  disabled={
                    mandoor.size == '3070' ||
                    mandoor.size == '4070' ||
                    mandoor.size == '6070' ||
                    locked
                  }
                  onChange={(e) =>
                    handleMandoorChange(mandoorIndex, 'panic', e)
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
                    mandoor.size == '6070' ||
                    locked
                  }
                  onChange={(e) =>
                    handleMandoorChange(mandoorIndex, 'closer', e)
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
                  checked={
                    mandoor.kickPlate &&
                    mandoor.size != '3070' &&
                    mandoor.size != '4070' &&
                    mandoor.size != '6070'
                  }
                  disabled={
                    mandoor.size == '3070' ||
                    mandoor.size == '4070' ||
                    mandoor.size == '6070' ||
                    locked
                  }
                  onChange={(e) =>
                    handleMandoorChange(mandoorIndex, 'kickPlate', e)
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
                  disabled={mandoor.size != '6070P' || locked}
                  onChange={(e) =>
                    handleMandoorChange(mandoorIndex, 'mullion', e)
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
                type="button"
                className="icon reject deleteRow"
                onClick={() => handleRemoveMandoor(mandoorIndex)}
                disabled={locked}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            <div className="divider offOnTablet"></div>
          </Fragment>
        ))}
        {!locked && (
          <button
            type="button"
            className="success addRow"
            onClick={handleAddMandoor}
          >
            Add
          </button>
        )}
      </section>

      <section className="card">
        <header className="cardHeader">
          <h3>Additional Project Information</h3>
        </header>
        <div className="grid3 alignTop">
          <div className="grid">
            <h4>Additional Building Items</h4>
            <div className="checkboxGroup">
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemExtBldg"
                  name="addItemExtBldg"
                  checked={state.addItemExtBldg}
                  onChange={handleChange}
                  disabled={locked}
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
                  checked={state.addItemPartWalls}
                  onChange={handleChange}
                  disabled={locked}
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
                  checked={state.addItemRoofOpenings}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="addItemRoofOpenings">Has Roof Openings</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemStepElev"
                  name="addItemStepElev"
                  checked={state.addItemStepElev}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="addItemStepElev">Has Step Elevations</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemHorizPanels"
                  name="addItemHorizPanels"
                  checked={state.addItemHorizPanels}
                  onChange={handleChange}
                  disabled={locked}
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
                  checked={state.addItemParapetWalls}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="addItemParapetWalls">Has Parapet Walls</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemFaciaWalls"
                  name="addItemFaciaWalls"
                  checked={state.addItemFaciaWalls}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="addItemFaciaWalls">Has Facia Walls</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemBumpoutWalls"
                  name="addItemBumpoutWalls"
                  checked={state.addItemBumpoutWalls}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="addItemBumpoutWalls">Has Bump-out Walls</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemCupolas"
                  name="addItemCupolas"
                  checked={state.addItemCupolas}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="addItemCupolas">Has Cupolas</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemClearstory"
                  name="addItemClearstory"
                  checked={state.addItemClearstory}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="addItemClearstory">Has Clearstory</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="addItemHipValley"
                  name="addItemHipValley"
                  checked={state.addItemHipValley}
                  onChange={handleChange}
                  disabled={locked}
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
                  checked={state.addItemGambrelRoof}
                  onChange={handleChange}
                  disabled={locked}
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
                  checked={state.addItemTiltUpWalls}
                  onChange={handleChange}
                  disabled={locked}
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
                  checked={state.mezzSimple}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="mezzSimple">Has Simple Mezzanine</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="mezzLShape"
                  name="mezzLShape"
                  checked={state.mezzLShape}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="mezzLShape">Has L-Shape Mezzanine</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="mezzNotAligned"
                  name="mezzNotAligned"
                  checked={state.mezzNotAligned}
                  onChange={handleChange}
                  disabled={locked}
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
                  checked={state.craneStepCols}
                  onChange={handleChange}
                  disabled={locked}
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
                  checked={state.craneJib}
                  onChange={handleChange}
                  disabled={locked}
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
                  checked={state.tHangar}
                  onChange={handleChange}
                  disabled={locked}
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
                  checked={state.otherBldgSpecs}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="otherBldgSpecs">Has Building Spec's</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="otherNonStdSpecs"
                  name="otherNonStdSpecs"
                  checked={state.otherNonStdSpecs}
                  onChange={handleChange}
                  disabled={locked}
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
                  checked={state.otherCarrierBms}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="otherCarrierBms">Has Carrier Beams</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="otherPortalCarrier"
                  name="otherPortalCarrier"
                  checked={state.otherPortalCarrier}
                  onChange={handleChange}
                  disabled={locked}
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
                  checked={state.otherNonStdCarrier}
                  onChange={handleChange}
                  disabled={locked}
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
                  checked={state.otherBarJoists}
                  onChange={handleChange}
                  disabled={locked}
                />
                <label htmlFor="otherBarJoists">Has Bar Joists</label>
              </div>
              <div className="checkRow large">
                <input
                  type="checkbox"
                  id="otherWeakAxis"
                  name="otherWeakAxis"
                  checked={state.otherWeakAxis}
                  onChange={handleChange}
                  disabled={locked}
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
                  checked={state.otherSkewedEndwall}
                  onChange={handleChange}
                  disabled={locked}
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
                  checked={state.otherSkewedSidewall}
                  onChange={handleChange}
                  disabled={locked}
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
                  checked={state.otherBulkStorageSeeds}
                  onChange={handleChange}
                  disabled={locked}
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
                  checked={state.otherBulkStorage}
                  onChange={handleChange}
                  disabled={locked}
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
                  checked={state.otherLoadsByOthers}
                  onChange={handleChange}
                  disabled={locked}
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
