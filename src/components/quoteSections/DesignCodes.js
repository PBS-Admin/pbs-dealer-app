import React from 'react';

const DesignCodes = ({ values, handleChange }) => {
  return (
    <section className="card start">
      <header className="cardHeader">
        <h3>Design Codes</h3>
      </header>
      <div className="cardGrid">
        <div className="cardInput">
          <label htmlFor="buildingCode">Building Code:</label>
          <input
            type="text"
            id="buildingCode"
            name="buildingCode"
            value={values.buildingCode}
            onChange={handleChange}
            placeholder="Building Code"
          />
        </div>
        <div className="cardInput">
          <label htmlFor="riskCategory">Risk Category:</label>
          <input
            type="text"
            id="riskCategory"
            name="riskCategory"
            value={values.riskCategory}
            onChange={handleChange}
            placeholder="Risk Category"
          />
        </div>
        <div className="cardInput">
          <label htmlFor="collateralLoad">Collateral Load:</label>
          <input
            type="text"
            id="collateralLoad"
            name="collateralLoad"
            value={values.collateralLoad}
            onChange={handleChange}
            placeholder="Collateral Load"
          />
        </div>
        <div className="cardInput">
          <label htmlFor="liveLoad">Live Load:</label>
          <input
            type="text"
            id="liveLoad"
            name="liveLoad"
            value={values.liveLoad}
            onChange={handleChange}
            placeholder="Live Load"
          />
        </div>
        <div className="cardInput">
          <label htmlFor="deadLoad">Dead Load:</label>
          <input
            type="text"
            id="deadLoad"
            name="deadLoad"
            value={values.deadLoad}
            onChange={handleChange}
            placeholder="Dead Load"
          />
        </div>
        <div className="cardInput">
          <label htmlFor="windLoad">Wind Load:</label>
          <input
            type="text"
            id="windLoad"
            name="windLoad"
            value={values.windLoad}
            onChange={handleChange}
            placeholder="Wind Load"
          />
        </div>
        <div className="cardInput">
          <label htmlFor="exposure">Exposure:</label>
          <input
            type="text"
            id="exposure"
            name="exposure"
            value={values.exposure}
            onChange={handleChange}
            placeholder="Exposure"
          />
        </div>
        <div className="cardInput">
          <label htmlFor="enclosure">Enclosure:</label>
          <input
            type="text"
            id="enclosure"
            name="enclosure"
            value={values.enclosure}
            onChange={handleChange}
            placeholder="Enclosure"
          />
        </div>
        <div className="cardInput">
          <label htmlFor="groundLoad">Ground Load:</label>
          <input
            type="text"
            id="groundLoad"
            name="groundLoad"
            value={values.groundLoad}
            onChange={handleChange}
            placeholder="Ground Load"
          />
        </div>
        <div className="cardInput">
          <label htmlFor="roofLoad">Roof Load:</label>
          <input
            type="text"
            id="roofLoad"
            name="roofLoad"
            value={values.roofLoad}
            onChange={handleChange}
            placeholder="Roof Load"
          />
        </div>
        <div className="cardInput">
          <label htmlFor="thermalFactor">Thermal Factor:</label>
          <input
            type="text"
            id="thermalFactor"
            name="thermalFactor"
            value={values.thermalFactor}
            onChange={handleChange}
            placeholder="Thermal Factor"
          />
        </div>
        <div className="cardInput">
          <label htmlFor="seismicCategory">Seismic Category:</label>
          <input
            type="text"
            id="seismicCategory"
            name="seismicCategory"
            value={values.seismicCategory}
            onChange={handleChange}
            placeholder="Seismic Category"
          />
        </div>
        <div className="cardInput">
          <label htmlFor="seismicSs">SeismicSs:</label>
          <input
            type="text"
            id="seismicSs"
            name="seismicSs"
            value={values.seismicSs}
            onChange={handleChange}
            placeholder="SeismicSs"
          />
        </div>
        <div className="cardInput">
          <label htmlFor="seismicS1">SeismicS1:</label>
          <input
            type="text"
            id="seismicS1"
            name="seismicS1"
            value={values.seismicS1}
            onChange={handleChange}
            placeholder="SeismicS1"
          />
        </div>
        <div className="cardInput">
          <label htmlFor="seismicSms">SeismicSms:</label>
          <input
            type="text"
            id="seismicSms"
            name="seismicSms"
            value={values.seismicSms}
            onChange={handleChange}
            placeholder="SeismicSms"
          />
        </div>
        <div className="cardInput">
          <label htmlFor="seismicSm1">SeismicSm1:</label>
          <input
            type="text"
            id="seismicSm1"
            name="seismicSm1"
            value={values.seismicSm1}
            onChange={handleChange}
            placeholder="SeismicSm1"
          />
        </div>
      </div>
    </section>
  );
};

export default DesignCodes;
