import React from 'react';
import ReusableSelect from '../ReusableSelect'; // Assuming this component exists

const PolycarbReliteRow = ({
  wallName,
  shortName,
  activeBuilding,
  values,
  handleNestedChange,
  polycarbWallSize,
  polycarbColor,
  dimensionToUse,
  isDesktop,
}) => {
  const getDimension = () => {
    return values.buildings[activeBuilding][dimensionToUse];
  };

  return (
    <>
      <div className="cardInput">
        <p>{wallName}</p>
      </div>
      <div className="cardInput">
        <ReusableSelect
          id={`building-${activeBuilding}-${shortName}PolySize`}
          name={`building-${activeBuilding}-${shortName}PolySize`}
          value={values.buildings[activeBuilding][`${shortName}PolySize`]}
          onChange={(e) =>
            handleNestedChange(
              activeBuilding,
              `${shortName}PolySize`,
              e.target.value
            )
          }
          options={polycarbWallSize}
          label="Size"
          labelHide="hidden"
        />
      </div>
      <div className="cardInput">
        <ReusableSelect
          id={`building-${activeBuilding}-${shortName}PolyColor`}
          name={`building-${activeBuilding}-${shortName}PolyColor`}
          value={values.buildings[activeBuilding][`${shortName}PolyColor`]}
          onChange={(e) =>
            handleNestedChange(
              activeBuilding,
              `${shortName}PolyColor`,
              e.target.value
            )
          }
          options={polycarbColor}
          label="Color"
          labelHide="hidden"
        />
      </div>
      <div className="cardInput">
        <label
          className="hidden"
          htmlFor={`building-${activeBuilding}-${shortName}PolyQty`}
        >
          Qty
        </label>
        <input
          type="text"
          id={`building-${activeBuilding}-${shortName}PolyQty`}
          name={`building-${activeBuilding}-${shortName}PolyQty`}
          value={values.buildings[activeBuilding][`${shortName}PolyQty`]}
          onChange={(e) =>
            handleNestedChange(
              activeBuilding,
              `${shortName}PolyQty`,
              e.target.value
            )
          }
          placeholder="Feet"
        />
      </div>
      {!isDesktop && <div></div>}
      <div className="cardInput">
        <p className="small">
          Continuous Panels:{' '}
          <strong>
            {Math.ceil(
              getDimension() /
                values.buildings[activeBuilding][`${shortName}PolySize`]
            )}
          </strong>
        </p>
      </div>
      <div className="cardInput">
        <p className="small">
          Every Other Panel:{' '}
          <strong>
            {Math.ceil(
              getDimension() /
                values.buildings[activeBuilding][`${shortName}PolySize`] /
                2
            )}
          </strong>
        </p>
      </div>
      <div className="cardInput">
        <p className="small">
          Every Third Panel:{' '}
          <strong>
            {Math.ceil(
              getDimension() /
                values.buildings[activeBuilding][`${shortName}PolySize`] /
                3
            )}
          </strong>
        </p>
      </div>
    </>
  );
};

export default PolycarbReliteRow;
