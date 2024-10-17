import { React, useState, Fragment } from 'react';
import { mandoors, mandoorGlass } from '../../util/dropdownOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ReusableSelect from '../Inputs/ReusableSelect';

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
          qty: 0,
          size: 'bd3070',
          glass: '',
          hasLever: true,
          hasDeadbolt: true,
          hasPanic: false,
          hasCloser: false,
          hasKickplate: false,
          hasMullion: false,
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
        {values.mandoors.length > 0 && (
          <div className="onTablet">
            <div className="tableGrid6">
              <h5>Wall</h5>
              <h5>
                Start <small>(Left to Right)</small>
              </h5>
              <h5>
                End <small>(Left to Right)</small>
              </h5>
              <h5>Height</h5>
              <h5>Top of Wall</h5>
              <h5></h5>
            </div>
          </div>
        )}
        {values.mandoors.map((mandoor, mandoorIndex) => (
          <Fragment key={`building-mandoor-${mandoorIndex}`}>
            <div className="tableGrid6">
              <div>
                <label htmlFor={`building-mandoorQty-${mandoorIndex}`}>
                  Qty:
                </label>
                <input
                  type="number"
                  id={`building-mandoorQty-${mandoorIndex}`}
                  name={`building-mandoorQty-${mandoorIndex}`}
                  value={mandoor.qty}
                  onChange={(e) =>
                    handleMandoorChange(mandoorIndex, 'qty', e.target.value)
                  }
                  min="0"
                />
              </div>
              <ReusableSelect
                id={`building-mandoorSize-${mandoorIndex}`}
                name={`building-mandoorSize-${mandoorIndex}`}
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
                label="Size"
              />
              <ReusableSelect
                id={`building-mandoorGlass-${mandoorIndex}`}
                name={`building-mandoorGlass-${mandoorIndex}`}
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
                label="Glass"
              />
              <button
                onClick={() => removeMandoor(mandoorIndex)}
                className="icon red"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            <div className="divider offOnTablet"></div>
          </Fragment>
        ))}
        <button
          type="button"
          className="button success w5"
          onClick={() => addMandoor()}
        >
          Add
        </button>
        <div>
          <label htmlFor={`building-testAcc`}>Test:</label>
          <input
            type="number"
            id={`building-testAcc`}
            name={`boltFinish`}
            value={values.boltFinish}
            onChange={handleChange}
            min="0"
          />
        </div>
      </section>
    </>
  );
};

export default Accessories;
