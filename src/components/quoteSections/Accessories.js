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
          qty: '',
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
      <section className="card start">
        <header className="cardHeader">
          <h3>Accessories</h3>
        </header>
        <div className="grid2">
          <ReusableSlider
            type="number"
            name="skylight4x4"
            value={values.skylight4x4}
            allowBlankValue={true}
            increment={1}
            label="4x4 Insulated Skylight with Curb"
            labelClass="onTheSide"
            onChange={(e) => handleChange(e, 'skylight4x4')}
          />
        </div>
      </section>

      <section className="card start">
        <header className="cardHeader">
          <h3>Man Doors</h3>
        </header>
        {values.mandoors.length > 0 && (
          <div className="onTablet">
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
              <ReusableInteger
                name={`building-mandoorQty-${mandoorIndex}`}
                value={mandoor.qty}
                label="Qty:"
                labelClass="offOnTablet"
                negative={false}
                allowBlankValue={true}
                min={1}
                onChange={(e) =>
                  handleMandoorChange(mandoorIndex, 'qty', e.target.value)
                }
                onFocus={() => {
                  if (activeMandoor !== mandoorIndex) {
                    setActiveMandoor(mandoorIndex);
                  }
                }}
                placeholder="Qty"
              />
              <ReusableSelect
                name={`building-mandoorSize-${mandoorIndex}`}
                label="Door Size:"
                labelClass="offOnTablet"
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
                labelClass="offOnTablet"
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
    </>
  );
};

export default Accessories;
