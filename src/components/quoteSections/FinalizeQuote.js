import React, { useEffect, useCallback } from 'react';
import { useExport } from '@/hooks/useExport';
import ReusableLoader from '../ReusableLoader';
import ReusableDialog from '../ReusableDialog';
import useValidation from '@/hooks/useValidation';
import useSeismic from '@/hooks/useSeismic';

const FinalizeQuote = ({ values, setValues, handleChange }) => {
  const { createFolderAndFiles, status, isExporting } = useExport();
  const { validateFields, currentPrompt, isDialogOpen, handleResponse } =
    useValidation(values, setValues);
  const { getSeismicLoad, seismicData, getSmsLoad, smsData } =
    useSeismic(values);

  useEffect(() => {
    // Pre-fetch seismic data when component mounts
    getSeismicLoad();
    getSmsLoad();
  }, [getSeismicLoad, getSmsLoad]);

  const fieldsToValidate = [
    {
      field: 'windLoad',
      validate: (value) => value >= 90 && value <= 145,
      message:
        'Wind load should be between 60 and 145 mph. Would you like to update it to 100?',
      suggestedValue: 100,
    },
    {
      field: 'seismicSs',
      validate: (value) => value > 0,
      message:
        'Seismic Ss value was never found, would you like to look it up?',
      suggestedValue: () => seismicData?.response?.data?.ss || 0,
    },
    {
      field: 'seismicS1',
      validate: (value) => value > 0,
      message:
        'Seismic S1 value was never found, would you like to look it up?',
      suggestedValue: () => seismicData?.response?.data?.s1 || 0,
    },
    {
      field: 'seismicSms',
      validate: (value) => value > 0,
      message:
        'Seismic Sms value was never found, would you like to look it up?',
      suggestedValue: () => smsData?.Sms || 0,
    },
    {
      field: 'seismicSm1',
      validate: (value) => value > 0,
      message:
        'Seismic Sm1 value was never found, would you like to look it up?',
      suggestedValue: () => smsData?.Sm1 || 0,
    },
    {
      field: 'seismicFa',
      validate: (value) => value > 0,
      message:
        'Seismic Fa value was never found, would you like to calculate it?',
      suggestedValue: () => seismicData?.response?.data?.fa || 0,
    },
    // Add more fields as needed
  ];

  const handleExport = useCallback(async () => {
    const isValid = await validateFields(fieldsToValidate);
    if (isValid) {
      const result = await createFolderAndFiles(values);
      if (result) {
        console.log('Export successful');
      } else {
        console.log('Export failed');
      }
    } else {
      console.log(`Couldn't validate all fields`);
    }
  }, [validateFields, fieldsToValidate, createFolderAndFiles, values]);

  return (
    <>
      <section className="card">
        <header className="cardHeader">
          <h3>Finalize Quote</h3>
        </header>
        <div className="grid4 alignTop">
          <div className="cardButton">
            <button type="submit" className="button success">
              Save Quote
            </button>
            <button
              type="button"
              className="button accent"
              onClick={() => {
                console.log(values);
              }}
            >
              Submit Quote
            </button>
            <button
              type="button"
              className="button prim"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? status : 'Export To MBS'}
            </button>
          </div>
          <div className="divider offOnPhone"></div>
          <div className="cardButton">
            <button
              type="button"
              className="button note"
              onClick={() => {
                console.log(values);
              }}
            >
              Notes for Estimator
            </button>
            <button
              type="button"
              className="button archive"
              onClick={() => {
                console.log(values);
              }}
            >
              Open Contract
            </button>
          </div>
          <div className="divider showWithSidebar span2"></div>
          <div className="cardButton">
            <button
              type="button"
              className="button archive"
              onClick={() => {
                console.log(values);
              }}
            >
              Archive Quote
            </button>
          </div>
          <div className="divider offOnPhone"></div>
          <div className="cardButton">
            <button
              type="button"
              className="button delete"
              onClick={() => {
                console.log(values);
              }}
            >
              Delete Quote
            </button>
          </div>
        </div>
      </section>
      <ReusableLoader isOpen={isExporting} title="Loading" message={status} />
      <ReusableDialog
        isOpen={isDialogOpen}
        onClose={() => handleResponse(false)}
        title="Field Validation"
        message={currentPrompt?.message}
        onConfirm={() => handleResponse(true)}
      />
    </>
  );
};

export default FinalizeQuote;
