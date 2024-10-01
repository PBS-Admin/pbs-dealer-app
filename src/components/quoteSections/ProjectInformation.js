import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReusableSelect from '../Inputs/ReusableSelect';
import {
  buildingCodes,
  enclosure,
  exposure,
  riskCategories,
  seismicCategory,
  thermalFactor,
} from '../../util/dropdownOptions';
import ReusableDouble from '../Inputs/ReusableDouble';
import ReusableDialog from '../ReusableDialog';
import useWind from '@/hooks/useWind';
import useGeocoding from '@/hooks/useGeocoding';
import useSnow from '@/hooks/useSnow';
import useSeismic from '@/hooks/useSeismic';
import useAddress from '@/hooks/useAddress';

const ProjectInformation = ({ values, handleChange, setValues }) => {
  const { getWindLoad, currentPrompt, isDialogOpen, handleResponse } = useWind(
    values,
    setValues
  );

  const { getSnowLoad, snowData } = useSnow(values);
  const { getSeismicLoad, seismicData } = useSeismic(values);
  const { locationData, loading, error, fetchGeocodingData } = useGeocoding();
  // const { address, inputRef, setAddress } = useAddress();
  const { addressDetails, isLoaded, resetAddressDetails } = useAddress(
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  );

  const clearAddress = () => {
    setValues((prevValues) => ({
      ...prevValues,
      projectAddress: '',
      projectCity: '',
      projectState: '',
      projectZip: '',
    }));
  };

  const handleAddressChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      handleChange(e);

      if (name === 'projectAddress') {
        resetAddressDetails();
      }
    },
    [handleChange, resetAddressDetails]
  );

  const shouldGeocode = useMemo(() => {
    return [
      'projectAddress',
      'projectCity',
      'projectState',
      'projectZip',
    ].every((field) => values[field].trim() !== '');
  }, [values]);

  useEffect(() => {
    if (addressDetails) {
      setValues((prevValues) => ({
        ...prevValues,
        projectAddress: addressDetails.street,
        projectCity: addressDetails.city,
        projectState: addressDetails.state,
        projectZip: addressDetails.zip,
      }));
    }
  }, [addressDetails, setValues]);

  useEffect(() => {
    if (shouldGeocode) {
      const { projectAddress, projectCity, projectState, projectZip } = values;
      const fullAddress = `${projectAddress}, ${projectCity}, ${projectState} ${projectZip}`;

      const timeoutId = setTimeout(() => {
        fetchGeocodingData(fullAddress);
      }, 1000); // Wait for 1 second after the last change

      return () => clearTimeout(timeoutId);
    }
  }, [shouldGeocode]);

  useEffect(() => {
    if (locationData) {
      setValues((prevValues) => ({
        ...prevValues,
        projectLatitude: locationData.lat,
        projectLongitude: locationData.lng,
        projectCounty: locationData.county,
        projectElevation: locationData.elevation,
      }));
    }
  }, [locationData, setValues]);

  useEffect(() => {
    if (snowData) {
      setValues((prevValues) => ({
        ...prevValues,
        groundLoad: snowData.snowload,
      }));
    }
  }, [snowData, setValues]);

  useEffect(() => {
    if (seismicData) {
      setValues((prevValues) => ({
        ...prevValues,
        seismicSs: seismicData.response.data.ss,
        seismicS1: seismicData.response.data.s1,
        seismicSms: seismicData.response.data.sms,
        seismicSm1: seismicData.response.data.sm1,
        sesimicFa: seismicData.response.data.fa,
        sesimicFv: seismicData.response.data.fv,
        sesimicSds: seismicData.response.data.sds,
        sesimicSd1: seismicData.response.data.sd1,
      }));
    }
  }, [seismicData, setValues]);

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
        {/* <div>
          <label htmlFor="street">Street Address</label>
          <input
            id="street"
            type="text"
            ref={inputRef}
            value={address.street}
            onChange={(e) =>
              setAddress((prev) => ({ ...prev, street: e.target.value }))
            }
          />
        </div>

        <div>
          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            value={address.city}
            onChange={(e) =>
              setAddress((prev) => ({ ...prev, city: e.target.value }))
            }
          />
        </div>

        <div>
          <label htmlFor="state">State</label>
          <input
            id="state"
            type="text"
            value={address.state}
            onChange={(e) =>
              setAddress((prev) => ({ ...prev, state: e.target.value }))
            }
          />
        </div>

        <div>
          <label htmlFor="zipCode">Zip Code</label>
          <input
            id="zipCode"
            type="text"
            value={address.zipCode}
            onChange={(e) =>
              setAddress((prev) => ({ ...prev, zipCode: e.target.value }))
            }
          />
        </div> */}
        <h4>Address</h4>
        <button className="button prim" onClick={clearAddress}>
          Clear
        </button>
        <div className="addressGrid">
          <div className="cardInput span24">
            <label htmlFor="projectAddress">Street Address:</label>
            <input
              type="text"
              id="projectAddress"
              name="projectAddress"
              value={values.projectAddress}
              onChange={handleAddressChange}
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
              onChange={handleAddressChange}
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
              onChange={handleAddressChange}
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
              onChange={handleAddressChange}
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
            <ReusableSelect
              id={`buildingCode`}
              name={`buildingCode`}
              value={values.buildingCode}
              onChange={handleChange}
              options={buildingCodes}
              label="Building Code:"
            />
          </div>
          <div className="cardInput">
            <ReusableSelect
              id={`riskCategory`}
              name={`riskCategory`}
              value={values.riskCategory}
              onChange={handleChange}
              options={riskCategories}
              label="Risk Category:"
            />
          </div>
        </div>
        <h4>Roof Load</h4>
        <div className="cardGrid">
          <div className="cardInput">
            <ReusableDouble
              id={'collateralLoad'}
              value={values.collateralLoad}
              onChange={handleChange}
              name={'collateralLoad'}
              label={'Collateral Load (psf):'}
              disabled={false}
              placeholder={'0'}
            />
          </div>
          <div className="cardInput">
            <ReusableDouble
              id={'liveLoad'}
              value={values.liveLoad}
              onChange={handleChange}
              name={'liveLoad'}
              label={'Live Load (psf):'}
              disabled={false}
              placeholder={'0'}
            />
          </div>
          <div className="cardInput">
            <ReusableDouble
              id={'deadLoad'}
              value={values.deadLoad}
              onChange={handleChange}
              name={'deadLoad'}
              label={'Dead Load (psf):'}
              disabled={false}
              placeholder={'0'}
            />
          </div>
        </div>
        <h4>Wind Load</h4>
        <div className="cardGrid">
          <ReusableDouble
            id={'windLoad'}
            value={values.windLoad}
            onChange={handleChange}
            name={'windLoad'}
            label={'Wind Load (mph):'}
            calc={true}
            onCalc={getWindLoad}
            disabled={false}
            placeholder={'0'}
          />
          <ReusableSelect
            id={`exposure`}
            name={`exposure`}
            value={values.exposure}
            onChange={handleChange}
            options={exposure}
            label="Exposure:"
            defaultValue="c"
          />
          <ReusableSelect
            id={`enclosure`}
            name={`enclosure`}
            value={values.enclosure}
            onChange={handleChange}
            options={enclosure}
            label="Enclosure:"
            defaultValue="closed"
          />
        </div>
        <h4>Snow Load</h4>
        <div className="cardGrid">
          <ReusableDouble
            id={'groundLoad'}
            value={values.groundLoad}
            onChange={handleChange}
            name={'groundLoad'}
            label={'Ground Load (psf):'}
            calc={true}
            onCalc={getSnowLoad}
            disabled={false}
            placeholder={'0'}
          />
          <ReusableDouble
            id={'roofLoad'}
            value={values.roofLoad}
            onChange={handleChange}
            name={'roofLoad'}
            label={'Roof Load (psf):'}
            disabled={false}
            placeholder={'0'}
          />
          <ReusableSelect
            id={`thermalFactor`}
            name={`thermalFactor`}
            value={values.thermalFactor}
            onChange={handleChange}
            options={thermalFactor}
            label="Thermal Factor:"
            defaultValue="heated"
          />
        </div>
        <h4>Seismic Load</h4>
        <div className="cardGrid">
          <ReusableSelect
            id={`seismicCategory`}
            name={`seismicCategory`}
            value={values.seismicCategory}
            onChange={handleChange}
            options={seismicCategory}
            label="Seismic Category:"
            defaultValue="d"
          />
          <ReusableDouble
            id={'seismicSs'}
            value={values.seismicSs}
            onChange={handleChange}
            name={'seismicSs'}
            label={'Ss:'}
            calc={true}
            onCalc={getSeismicLoad}
            disabled={false}
            placeholder={'0'}
            decimalPlaces={3}
          />
          <ReusableDouble
            id={'seismicS1'}
            value={values.seismicS1}
            onChange={handleChange}
            name={'seismicS1'}
            label={'S1:'}
            disabled={false}
            placeholder={'0'}
            decimalPlaces={3}
          />
          <ReusableDouble
            id={'seismicSms'}
            value={values.seismicSms}
            onChange={handleChange}
            name={'seismicSms'}
            label={'Sms:'}
            disabled={false}
            placeholder={'0'}
            decimalPlaces={3}
          />
          <ReusableDouble
            id={'seismicSm1'}
            value={values.seismicSm1}
            onChange={handleChange}
            name={'seismicSm1'}
            label={'Sm1:'}
            disabled={false}
            placeholder={'0'}
            decimalPlaces={3}
          />
        </div>
      </section>
      <ReusableDialog
        isOpen={isDialogOpen}
        onClose={() => handleResponse(false)}
        title="Wind Load Calculation"
        message={currentPrompt?.Prompt}
        onConfirm={() => handleResponse(true)}
      />
    </>
  );
};

export default ProjectInformation;
