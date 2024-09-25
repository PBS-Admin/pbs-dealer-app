import React from 'react';

const ProjectInformation = ({ values, handleChange }) => {
  return (
    <>
      <section className="card start">
        <header className="cardHeader">
          <h3>Customer Information</h3>
        </header>
        <div className="nameGrid">
          <div className="cardInput">
            <label htmlFor="customerName">Customer Name:</label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={values.customerName}
              onChange={handleChange}
              placeholder="Customer Name"
            />
          </div>
          <div className="cardInput">
            <label htmlFor="contactName">Contact Name:</label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={values.contactName}
              onChange={handleChange}
              placeholder="Contact Name"
            />
          </div>
        </div>
        <h4>Address</h4>
        <div className="addressGrid">
          <div className="cardInput span24">
            <label htmlFor="customerStreet">Street Address:</label>
            <input
              type="text"
              id="customerStreet"
              name="customerStreet"
              value={values.customerStreet}
              onChange={handleChange}
              placeholder="Street Address"
            />
          </div>
          <div className="cardInput span12">
            <label htmlFor="customerCity">City:</label>
            <input
              type="text"
              id="customerCity"
              name="customerCity"
              value={values.customerCity}
              onChange={handleChange}
              placeholder="City"
            />
          </div>
          <div className="cardInput">
            <label htmlFor="customerState">State:</label>
            <input
              type="text"
              id="customerState"
              name="customerState"
              value={values.customerState}
              onChange={handleChange}
              placeholder="State"
            />
          </div>
          <div className="cardInput">
            <label htmlFor="customerZip">Zip Code:</label>
            <input
              type="text"
              id="customerZip"
              name="customerZip"
              value={values.customerZip}
              onChange={handleChange}
              placeholder="Zip"
            />
          </div>
          <div className="cardInput span12">
            <label htmlFor="customerPhone">Phone:</label>
            <input
              type="text"
              id="customerPhone"
              name="customerPhone"
              value={values.customerPhone}
              onChange={handleChange}
              placeholder="Phone"
            />
          </div>
          <div className="cardInput span12">
            <label htmlFor="customerFax">Fax:</label>
            <input
              type="text"
              id="customerFax"
              name="customerFax"
              value={values.customerFax}
              onChange={handleChange}
              placeholder="Fax"
            />
          </div>
          <div className="cardInput span12">
            <label htmlFor="customerCell">Cell:</label>
            <input
              type="text"
              id="customerCell"
              name="customerCell"
              value={values.customerCell}
              onChange={handleChange}
              placeholder="Cell"
            />
          </div>
          <div className="cardInput span12">
            <label htmlFor="customerEmail">Email:</label>
            <input
              type="text"
              id="customerEmail"
              name="customerEmail"
              value={values.customerEmail}
              onChange={handleChange}
              placeholder="Email"
            />
          </div>
        </div>
      </section>

      <section className="card start">
        <header className="cardHeader">
          <h3>Project Information</h3>
        </header>
        <div className="nameGrid">
          <div className="cardInput">
            <label htmlFor="projectName">Project Name:</label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={values.projectName}
              onChange={handleChange}
              placeholder="Project Name"
            />
          </div>
          <div className="cardInput">
            <label htmlFor="projectFor">Project For:</label>
            <input
              type="text"
              id="projectFor"
              name="projectFor"
              value={values.projectFor}
              onChange={handleChange}
              placeholder="Project For"
            />
          </div>
        </div>
        <h4>Address</h4>
        <div className="addressGrid">
          <div className="cardInput span24">
            <label htmlFor="projectAddress">Street Address:</label>
            <input
              type="text"
              id="projectAddress"
              name="projectAddress"
              value={values.projectAddress}
              onChange={handleChange}
              placeholder="Address"
            />
          </div>
          <div className="cardInput span12">
            <label htmlFor="projectCity">City:</label>
            <input
              type="text"
              id="projectCity"
              name="projectCity"
              value={values.projectCity}
              onChange={handleChange}
              placeholder="City"
            />
          </div>
          <div className="cardInput">
            <label htmlFor="projectState">State:</label>
            <input
              type="text"
              id="projectState"
              name="projectState"
              value={values.projectState}
              onChange={handleChange}
              placeholder="State"
            />
          </div>
          <div className="cardInput">
            <label htmlFor="projectZip">Zip Code:</label>
            <input
              type="text"
              id="projectZip"
              name="projectZip"
              value={values.projectZip}
              onChange={handleChange}
              placeholder="Zip"
            />
          </div>
          <div className="span24"></div>
          <div className="cardInput span12">
            <label htmlFor="projectCounty">County:</label>
            <input
              type="text"
              id="projectCounty"
              name="projectCounty"
              value={values.projectCounty}
              onChange={handleChange}
              placeholder="County"
            />
          </div>
          <div className="cardInput span12">
            <label htmlFor="buildingUse">Building Use:</label>
            <input
              type="text"
              id="buildingUse"
              name="buildingUse"
              value={values.buildingUse}
              onChange={handleChange}
              placeholder="Building Use"
            />
          </div>
        </div>
      </section>

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
    </>
  );
};

export default ProjectInformation;
