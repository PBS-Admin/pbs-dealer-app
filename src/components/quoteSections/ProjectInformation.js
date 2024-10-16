import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
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
import ReusableLoader from '../ReusableLoader';
import useWind from '@/hooks/useWind';
import useGeocoding from '@/hooks/useGeocoding';
import useSnow from '@/hooks/useSnow';
import useSeismic from '@/hooks/useSeismic';
import useAddress from '@/hooks/useAddress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser } from '@fortawesome/free-solid-svg-icons';

const ProjectInformation = ({ values, handleChange, setValues }) => {
  const { getWindLoad, currentPrompt, isDialogOpen, handleResponse } = useWind(
    values,
    setValues
  );

  const { getSnowLoad, snowData } = useSnow(values);
  const { getSeismicLoad, seismicData } = useSeismic(values);
  const { locationData, loading, error, fetchGeocodingData } = useGeocoding();

  const projectInputRef = useRef(null);
  const customerInputRef = useRef(null);

  const {
    addressDetails: projectAddressDetails,
    isReady: projectIsReady,
    resetAddressDetails: resetProjectAddressDetails,
  } = useAddress(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, projectInputRef);

  const {
    addressDetails: customerAddressDetails,
    isReady: customerIsReady,
    resetAddressDetails: resetCustomerAddressDetails,
  } = useAddress(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, customerInputRef);

  const clearAddress = useCallback(
    (addressType) => {
      console.log('Clear address clicked');
      const fields =
        addressType === 'project'
          ? ['projectAddress', 'projectCity', 'projectState', 'projectZip']
          : ['customerAddress', 'customerCity', 'customerState', 'customerZip'];

      setValues((prevValues) => {
        const newValues = { ...prevValues };
        fields.forEach((field) => (newValues[field] = ''));
        return newValues;
      });

      if (addressType === 'project') {
        resetProjectAddressDetails();
      } else {
        resetCustomerAddressDetails();
      }
    },
    [setValues, resetProjectAddressDetails, resetCustomerAddressDetails]
  );

  const handleAddressChange = useCallback(
    (e, addressType) => {
      const { name, value } = e.target;
      handleChange(e);

      if (name === 'projectAddress' || name === 'customerAddress') {
        if (value.trim() === '') {
          clearAddress(addressType);
        }
      }
    },
    [handleChange, clearAddress]
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
    if (projectAddressDetails) {
      setValues((prevValues) => ({
        ...prevValues,
        projectAddress: projectAddressDetails.street,
        projectCity: projectAddressDetails.city,
        projectState: projectAddressDetails.state,
        projectZip: projectAddressDetails.zip,
      }));
    }
  }, [projectAddressDetails, setValues]);

  useEffect(() => {
    if (customerAddressDetails) {
      setValues((prevValues) => ({
        ...prevValues,
        customerAddress: customerAddressDetails.street,
        customerCity: customerAddressDetails.city,
        customerState: customerAddressDetails.state,
        customerZip: customerAddressDetails.zip,
      }));
    }
  }, [customerAddressDetails, setValues]);

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
        <div className="grid2">
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
        <div className="grid8">
          <div className="cardInput span4">
            <label htmlFor="customerAddress" className="cardLabel">
              Street Address:
              <button
                type="button"
                onClick={() => clearAddress('customer')}
                className="icon iconClear"
              >
                <FontAwesomeIcon icon={faEraser} />
              </button>
            </label>
            <input
              ref={customerInputRef}
              type="text"
              id="customerAddress"
              name="customerAddress"
              value={values.customerAddress}
              onChange={(e) => handleAddressChange(e, 'customer')}
              placeholder="Street Address"
            />
          </div>
          <div className="cardInput span2">
            <label htmlFor="customerCity">City:</label>
            <input
              type="text"
              id="customerCity"
              name="customerCity"
              value={values.customerCity}
              onChange={(e) => handleAddressChange(e, 'customer')}
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
              onChange={(e) => handleAddressChange(e, 'customer')}
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
              onChange={(e) => handleAddressChange(e, 'customer')}
              placeholder="Zip"
            />
          </div>
          <div className="cardInput span2">
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
          <div className="cardInput span2">
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
          <div className="cardInput span2">
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
          <div className="cardInput span2">
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
        <div className="grid2">
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

        <div className="grid8">
          <div className="cardInput span4">
            <label htmlFor="projectAddress" className="cardLabel">
              Street Address:
              <button
                type="button"
                onClick={() => clearAddress('project')}
                className="icon iconClear"
              >
                <FontAwesomeIcon icon={faEraser} />
              </button>
            </label>
            <input
              ref={projectInputRef}
              type="text"
              id="projectAddress"
              name="projectAddress"
              value={values.projectAddress}
              onChange={(e) => handleAddressChange(e, 'project')}
              placeholder="Address"
            />
          </div>
          <div className="cardInput span2">
            <label htmlFor="projectCity">City:</label>
            <input
              type="text"
              id="projectCity"
              name="projectCity"
              value={values.projectCity}
              onChange={(e) => handleAddressChange(e, 'project')}
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
              onChange={(e) => handleAddressChange(e, 'project')}
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
              onChange={(e) => handleAddressChange(e, 'project')}
              placeholder="Zip"
            />
          </div>
          <div className="span4 onDesktop"></div>
          <div className="cardInput span2">
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
          <div className="cardInput span2">
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
        <div className="grid2">
          <ReusableSelect
            name={`buildingCode`}
            value={values.buildingCode}
            onChange={handleChange}
            options={buildingCodes}
            label="Building Code:"
          />
          <ReusableSelect
            name={`riskCategory`}
            value={values.riskCategory}
            onChange={handleChange}
            options={riskCategories}
            label="Risk Category:"
          />
        </div>
        <h4>Roof Load</h4>
        <div className="grid3">
          <ReusableDouble
            id={'collateralLoad'}
            value={values.collateralLoad}
            onChange={handleChange}
            name={'collateralLoad'}
            label={
              <>
                Collateral Load: <small>(psf)</small>
              </>
            }
            disabled={false}
            placeholder={'psf'}
          />
          <ReusableDouble
            id={'liveLoad'}
            value={values.liveLoad}
            onChange={handleChange}
            name={'liveLoad'}
            label={
              <>
                Live Load: <small>(psf)</small>
              </>
            }
            disabled={false}
            placeholder={'psf'}
          />
          <ReusableDouble
            id={'deadLoad'}
            value={values.deadLoad}
            onChange={handleChange}
            name={'deadLoad'}
            label={
              <>
                Dead Load: <small>(psf)</small>
              </>
            }
            disabled={false}
            placeholder={'psf'}
          />
        </div>
        <h4>Wind Load</h4>
        <div className="grid3">
          <ReusableDouble
            id={'windLoad'}
            value={values.windLoad}
            onChange={handleChange}
            name={'windLoad'}
            label={
              <>
                Wind Load: <small>(mph)</small>
              </>
            }
            icon={'faCalculator'}
            iconColor={'blue'}
            iconOnClick={getWindLoad}
            disabled={false}
            placeholder={'mph'}
          />
          <ReusableSelect
            name={`windExposure`}
            value={values.windExposure}
            onChange={handleChange}
            options={exposure}
            label="Exposure:"
            defaultValue="C"
          />
          <ReusableSelect
            name={`enclosure`}
            value={values.enclosure}
            onChange={handleChange}
            options={enclosure}
            label="Enclosure:"
            defaultValue="closed"
          />
        </div>
        <h4>Snow Load</h4>
        <div className="grid3">
          <ReusableDouble
            id={'groundSnowLoad'}
            value={values.groundSnowLoad}
            onChange={handleChange}
            name={'groundSnowLoad'}
            label={
              <>
                Ground Load: <small>(psf)</small>
              </>
            }
            icon={'faCalculator'}
            iconColor={'blue'}
            iconOnClick={getSnowLoad}
            disabled={false}
            placeholder={'psf'}
          />
          <ReusableDouble
            id={'roofSnowLoad'}
            value={values.roofSnowLoad}
            onChange={handleChange}
            name={'roofSnowLoad'}
            label={
              <>
                Roof Load: <small>(psf)</small>
              </>
            }
            disabled={false}
            placeholder={'psf'}
          />
          <ReusableSelect
            name={`thermalFactor`}
            value={values.thermalFactor}
            onChange={handleChange}
            options={thermalFactor}
            label="Thermal Factor:"
            defaultValue="heated"
          />
        </div>
        <h4>Seismic Load</h4>
        <div className="grid6">
          <ReusableSelect
            name={`seismicCategory`}
            className="span2"
            value={values.seismicCategory}
            onChange={handleChange}
            options={seismicCategory}
            label="Seismic Category:"
            icon={'faCalculator'}
            iconColor={'blue'}
            iconOnClick={getSeismicLoad}
            defaultValue="D"
          />
          <ReusableDouble
            id={'seismicSs'}
            value={values.seismicSs}
            onChange={handleChange}
            name={'seismicSs'}
            label={'Ss:'}
            disabled={false}
            decimalPlaces={3}
          />
          <ReusableDouble
            id={'seismicS1'}
            value={values.seismicS1}
            onChange={handleChange}
            name={'seismicS1'}
            label={
              <>
                S<small>1</small>:
              </>
            }
            disabled={false}
            decimalPlaces={3}
          />
          <ReusableDouble
            id={'seismicSms'}
            value={values.seismicSms}
            onChange={handleChange}
            name={'seismicSms'}
            label={'Sms:'}
            disabled={false}
            decimalPlaces={3}
          />
          <ReusableDouble
            id={'seismicSm1'}
            value={values.seismicSm1}
            onChange={handleChange}
            name={'seismicSm1'}
            label={
              <>
                Sm<small>1</small>:
              </>
            }
            disabled={false}
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
      <ReusableLoader
        isOpen={loading}
        title="Loading"
        message="Determining County..."
      />
    </>
  );
};

export default ProjectInformation;
