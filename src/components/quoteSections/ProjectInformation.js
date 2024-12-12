import React, { useEffect, useCallback, useMemo, useRef } from 'react';
import ReusableSelect from '../Inputs/ReusableSelect';
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
import {
  buildingCodes,
  enclosure,
  exposure,
  riskCategories,
  seismicCategory,
  thermalFactor,
} from '../../util/dropdownOptions';
import { useBuildingContext } from '@/contexts/BuildingContext';

const ProjectInformation = ({ locked }) => {
  // Contexts
  const { state, handleChange, setValues } = useBuildingContext();

  // Hooks
  const { getWindLoad, currentPrompt, isDialogOpen, handleResponse } = useWind(
    state,
    setValues
  );
  const { getSnowLoad, snowData } = useSnow(state);
  const { getSeismicLoad, seismicData, getSmsLoad, smsData } =
    useSeismic(state);
  const { locationData, loading, error, fetchGeocodingData } = useGeocoding();

  // References
  const projectInputRef = useRef(null);
  const customerInputRef = useRef(null);

  // Local Functions
  const windIcon =
    state.buildingCode == 'ossc22' && state.projectLatitude != ''
      ? 'lookup'
      : '';
  const snowIcon =
    state.projectLatitude != '' && state.projectLongitude != '' ? 'lookup' : '';
  const lookupIcon =
    state.projectLatitude != '' &&
    state.projectLongitude != '' &&
    state.buildingCode != '' &&
    state.seismicSite != ''
      ? 'lookup'
      : '';

  const calcIcon =
    state.seismicSs > 0 && state.seismicS1 > 0 ? 'calculator' : '';

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
      const fields =
        addressType === 'project'
          ? [
              'projectAddress',
              'projectCity',
              'projectState',
              'projectZip',
              'projectLatitude',
              'projectLongitude',
            ]
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
    ].every((field) => {
      const fieldValue = state[field];
      return (
        fieldValue && typeof fieldValue === 'string' && fieldValue.trim() !== ''
      );
    });
  }, [state]);

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
      const { projectAddress, projectCity, projectState, projectZip } = state;
      const fullAddress = `${projectAddress}, ${projectCity}, ${projectState} ${projectZip}`;

      const timeoutId = setTimeout(() => {
        fetchGeocodingData(fullAddress);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [shouldGeocode]);

  useEffect(() => {
    if (locationData) {
      setValues({
        ...state,
        projectLatitude: locationData.lat,
        projectLongitude: locationData.lng,
        projectCounty: locationData.county,
        projectElevation: locationData.elevation,
        projectMileage: locationData.mileage,
      });
    }
  }, [locationData, setValues, state]);

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
        seismicFa: seismicData.response.data.fa,
        seismicFv: seismicData.response.data.fv,
        seismicSds: seismicData.response.data.sds,
        seismicSd1: seismicData.response.data.sd1,
      }));
    }
  }, [seismicData, setValues]);

  useEffect(() => {
    if (smsData) {
      setValues((prevValues) => ({
        ...prevValues,
        seismicSms: smsData.Sms,
        seismicSm1: smsData.Sm1,
        seismicFa: smsData.Fa,
        seismicFv: smsData.Fv,
        seismicSds: smsData.Sds,
        seismicSd1: smsData.Sd1,
      }));
    }
  }, [smsData, setValues]);

  // JSX
  return (
    <>
      <section className="card">
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
              value={state.customerName}
              onChange={handleChange}
              placeholder="Customer Name"
              disabled={locked}
            />
          </div>
          <div className="cardInput">
            <label htmlFor="contactName">Contact Name:</label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={state.contactName}
              onChange={handleChange}
              placeholder="Contact Name"
              disabled={locked}
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
                className="icon reject tooltip"
                onClick={() => clearAddress('customer')}
              >
                {!locked && <FontAwesomeIcon icon={faEraser} />}
                <p>Clear Address</p>
              </button>
            </label>
            <input
              ref={customerInputRef}
              type="text"
              id="customerAddress"
              name="customerAddress"
              value={state.customerAddress}
              onChange={(e) => handleAddressChange(e, 'customer')}
              placeholder="Street Address"
              disabled={locked}
            />
          </div>
          <div className="cardInput span2">
            <label htmlFor="customerCity">City:</label>
            <input
              type="text"
              id="customerCity"
              name="customerCity"
              value={state.customerCity}
              onChange={(e) => handleAddressChange(e, 'customer')}
              placeholder="City"
              disabled={locked}
            />
          </div>
          <div className="cardInput">
            <label htmlFor="customerState">State:</label>
            <input
              type="text"
              id="customerState"
              name="customerState"
              value={state.customerState}
              onChange={(e) => handleAddressChange(e, 'customer')}
              placeholder="State"
              disabled={locked}
            />
          </div>
          <div className="cardInput">
            <label htmlFor="customerZip">Zip Code:</label>
            <input
              type="text"
              id="customerZip"
              name="customerZip"
              value={state.customerZip}
              onChange={(e) => handleAddressChange(e, 'customer')}
              placeholder="Zip"
              disabled={locked}
            />
          </div>
          <div className="cardInput span2">
            <label htmlFor="customerPhone">Phone:</label>
            <input
              type="text"
              id="customerPhone"
              name="customerPhone"
              value={state.customerPhone}
              onChange={handleChange}
              placeholder="Phone"
              disabled={locked}
            />
          </div>
          <div className="cardInput span2">
            <label htmlFor="customerFax">Fax:</label>
            <input
              type="text"
              id="customerFax"
              name="customerFax"
              value={state.customerFax}
              onChange={handleChange}
              placeholder="Fax"
              disabled={locked}
            />
          </div>
          <div className="cardInput span2">
            <label htmlFor="customerCell">Cell:</label>
            <input
              type="text"
              id="customerCell"
              name="customerCell"
              value={state.customerCell}
              onChange={handleChange}
              placeholder="Cell"
              disabled={locked}
            />
          </div>
          <div className="cardInput span2">
            <label htmlFor="customerEmail">Email:</label>
            <input
              type="text"
              id="customerEmail"
              name="customerEmail"
              value={state.customerEmail}
              onChange={handleChange}
              placeholder="Email"
              disabled={locked}
            />
          </div>
        </div>
      </section>

      <section className="card">
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
              value={state.projectName}
              onChange={handleChange}
              placeholder="Project Name"
              disabled={locked}
            />
          </div>
          <div className="cardInput">
            <label htmlFor="projectFor">Project For:</label>
            <input
              type="text"
              id="projectFor"
              name="projectFor"
              value={state.projectFor}
              onChange={handleChange}
              placeholder="Project For"
              disabled={locked}
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
                className="icon reject tooltip"
                onClick={() => clearAddress('project')}
              >
                {!locked && <FontAwesomeIcon icon={faEraser} />}
                <p>Clear Address</p>
              </button>
            </label>
            <input
              ref={projectInputRef}
              type="text"
              id="projectAddress"
              name="projectAddress"
              value={state.projectAddress}
              onChange={(e) => handleAddressChange(e, 'project')}
              placeholder="Address"
              disabled={locked}
            />
          </div>
          <div className="cardInput span2">
            <label htmlFor="projectCity">City:</label>
            <input
              type="text"
              id="projectCity"
              name="projectCity"
              value={state.projectCity}
              onChange={(e) => handleAddressChange(e, 'project')}
              placeholder="City"
              disabled={locked}
            />
          </div>
          <div className="cardInput">
            <label htmlFor="projectState">State:</label>
            <input
              type="text"
              id="projectState"
              name="projectState"
              value={state.projectState}
              onChange={(e) => handleAddressChange(e, 'project')}
              placeholder="State"
              disabled={locked}
            />
          </div>
          <div className="cardInput">
            <label htmlFor="projectZip">Zip Code:</label>
            <input
              type="text"
              id="projectZip"
              name="projectZip"
              value={state.projectZip}
              onChange={(e) => handleAddressChange(e, 'project')}
              placeholder="Zip"
              disabled={locked}
            />
          </div>
          <div className="span4 onDesktop"></div>
          <div className="cardInput span2">
            <label htmlFor="projectCounty">County:</label>
            <input
              type="text"
              id="projectCounty"
              name="projectCounty"
              value={state.projectCounty}
              onChange={handleChange}
              placeholder="County"
              disabled={locked}
            />
          </div>
          <div className="cardInput span2">
            <label htmlFor="buildingUse">Building Use:</label>
            <input
              type="text"
              id="buildingUse"
              name="buildingUse"
              value={state.buildingUse}
              onChange={handleChange}
              placeholder="Building Use"
              disabled={locked}
            />
          </div>
        </div>
      </section>

      <section className="card">
        <header className="cardHeader">
          <h3>Design Codes</h3>
        </header>
        <div className="grid2">
          <ReusableSelect
            name={`buildingCode`}
            value={state.buildingCode}
            onChange={handleChange}
            options={buildingCodes}
            label="Building Code:"
            disabled={locked}
          />
          <ReusableSelect
            name={`riskCategory`}
            value={state.riskCategory}
            onChange={handleChange}
            options={riskCategories}
            label="Risk Category:"
            disabled={locked}
          />
        </div>
        <h4>Roof Load</h4>
        <div className="grid3">
          <ReusableDouble
            id={'collateralLoad'}
            value={state.collateralLoad}
            onChange={handleChange}
            name={'collateralLoad'}
            label={
              <>
                Collateral Load: <small>(psf)</small>
              </>
            }
            disabled={locked}
            placeholder={'psf'}
          />
          <ReusableDouble
            id={'liveLoad'}
            value={state.liveLoad}
            onChange={handleChange}
            name={'liveLoad'}
            label={
              <>
                Live Load: <small>(psf)</small>
              </>
            }
            disabled={locked}
            placeholder={'psf'}
          />
          <ReusableDouble
            id={'deadLoad'}
            value={state.deadLoad}
            onChange={handleChange}
            name={'deadLoad'}
            label={
              <>
                Dead Load: <small>(psf)</small>
              </>
            }
            disabled={locked}
            placeholder={'psf'}
          />
        </div>
        <h4>Wind Load</h4>
        <div className="grid3">
          <ReusableDouble
            id={'windLoad'}
            value={state.windLoad}
            onChange={handleChange}
            name={'windLoad'}
            label={
              <>
                Wind Load: <small>(mph)</small>
              </>
            }
            icon={windIcon}
            iconClass={'prim'}
            iconOnClick={getWindLoad}
            tooltip="Lookup Wind Load"
            placeholder={'mph'}
            disabled={locked}
          />
          <ReusableSelect
            name={`windExposure`}
            value={state.windExposure}
            onChange={handleChange}
            options={exposure}
            label="Exposure:"
            defaultValue="C"
            disabled={locked}
          />
          <ReusableSelect
            name={`windEnclosure`}
            value={state.windEnclosure}
            onChange={handleChange}
            options={enclosure}
            label="Enclosure:"
            defaultValue="C"
            disabled={locked}
          />
        </div>
        <h4>Snow Load</h4>
        <div className="grid3">
          <ReusableDouble
            id={'groundSnowLoad'}
            value={state.groundSnowLoad}
            onChange={handleChange}
            name={'groundSnowLoad'}
            label={
              <>
                Ground Load: <small>(psf)</small>
              </>
            }
            icon={snowIcon}
            iconClass={'prim'}
            iconOnClick={getSnowLoad}
            tooltip="Lookup Snow Load"
            placeholder={'psf'}
            disabled={locked}
          />
          <ReusableDouble
            id={'roofSnowLoad'}
            value={state.roofSnowLoad}
            onChange={handleChange}
            name={'roofSnowLoad'}
            label={
              <>
                Roof Load: <small>(psf)</small>
              </>
            }
            placeholder={'psf'}
            disabled={locked}
          />
          <ReusableSelect
            name={`thermalFactor`}
            value={state.thermalFactor}
            onChange={handleChange}
            options={thermalFactor}
            label="Thermal Factor:"
            defaultValue={1}
            icon={'info'}
            iconClass={'info left'}
            tooltip={
              <>
                Greenhouse = 0.85
                <br />
                Heated = 1.0
                <br />
                Unheated with Insulation = 1.1
                <br />
                Unheated w/o Insulation = 1.2
                <br />
                Kept Below Freezing = 1.3
              </>
            }
            disabled={locked}
          />
        </div>
        <h4>Seismic Load</h4>
        <div className="grid6">
          <ReusableSelect
            name={`seismicCategory`}
            className="span2"
            value={state.seismicCategory}
            onChange={handleChange}
            options={seismicCategory}
            label="Seismic Category:"
            icon={lookupIcon}
            iconClass={'prim'}
            iconOnClick={getSeismicLoad}
            tooltip="Lookup Seismic Data"
            defaultValue="D"
            disabled={locked}
          />
          <ReusableDouble
            id={'seismicSs'}
            value={state.seismicSs}
            onChange={handleChange}
            name={'seismicSs'}
            label={'Ss:'}
            decimalPlaces={3}
            disabled={locked}
          />
          <ReusableDouble
            id={'seismicS1'}
            value={state.seismicS1}
            onChange={handleChange}
            name={'seismicS1'}
            label={
              <>
                S<small>1</small>:
              </>
            }
            decimalPlaces={3}
            disabled={locked}
          />
          <ReusableDouble
            id={'seismicSms'}
            value={state.seismicSms}
            onChange={handleChange}
            name={'seismicSms'}
            label={'Sms:'}
            icon={calcIcon}
            iconClass={'prim'}
            iconOnClick={getSmsLoad}
            tooltip="Calculate Sms & Sm1"
            decimalPlaces={3}
            disabled={locked}
          />
          <ReusableDouble
            id={'seismicSm1'}
            value={state.seismicSm1}
            onChange={handleChange}
            name={'seismicSm1'}
            label={
              <>
                Sm<small>1</small>:
              </>
            }
            decimalPlaces={3}
            disabled={locked}
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
