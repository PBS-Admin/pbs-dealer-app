import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import { useExport } from '@/hooks/useExport';
import ReusableLoader from '../ReusableLoader';
import ReusableDialog from '../ReusableDialog';
import useValidation from '@/hooks/useValidation';
import useSeismic from '@/hooks/useSeismic';
import { useMbsProcessor } from '@/hooks/useMbsProcessor';
import ReusableToast from '../ReusableToast';

const FinalizeQuote = ({ values, setValues, handleChange }) => {
  const memoizedSetValues = useCallback(setValues, []);

  const { createFolderAndFiles, status, isExporting } = useExport();
  const { handleProcessFiles, mbsStatus, error } = useMbsProcessor();
  const {
    validateFields,
    currentPrompt,
    isDialogOpen,
    handleResponse,
    autoResolveMessage,
  } = useValidation(values, memoizedSetValues);
  const { getSeismicLoad, seismicData, getSmsLoad, smsData } =
    useSeismic(values);

  useEffect(() => {
    getSeismicLoad();
    getSmsLoad();
  }, [getSeismicLoad, getSmsLoad]);

  const toastRef = useRef();

  const fieldsToValidate = [
    {
      field: 'windLoad',
      validate: (value) => value >= 60 && value <= 145,
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

  const autoFillRules = useMemo(
    () => [
      {
        field: 'backPeakOffset',
        condition: (building) => building.shape === 'symmetrical',
        setValue: (building) => building.width / 2,
      },
      {
        field: 'frontEaveHeight',
        condition: (building) => building.shape === 'symmetrical',
        setValue: (building) => building.backEaveHeight,
      },
      {
        field: 'leftBracingType',
        condition: (building) => building.leftFrame !== 'postAndBeam',
        setValue: (building) => 'none',
      },
    ],
    []
  );

  const handleSave = useCallback(async () => {
    const isValid = await validateFields([], autoFillRules);
    if (isValid) {
      console.log('Save successful');
    }
  }, [validateFields, autoFillRules]);

  const handleExport = useCallback(async () => {
    try {
      console.log('Starting export...');
      const isValid = await validateFields(fieldsToValidate, autoFillRules);
      console.log('Validation result:', isValid);

      if (isValid) {
        console.log('Creating folders with values:', values);
        const result = await createFolderAndFiles(values);
        console.log('Creation result:', result);

        if (result.success) {
          for (let i = 0; i < result.folder.length; i++) {
            let path;
            if (result.folder.length > 1) {
              path = `C:\\Jobs\\${result.folder[0]}P\\${result.folder[i]}`;
            } else {
              path = `C:\\Jobs\\${result.folder}`;
            }

            const res = await handleProcessFiles(path);
            if (res) {
              console.log('MBS processed');
            } else {
              console.log('MBS process failed');
            }
          }
          showSuccessExport();
          console.log('Export successful');
        } else {
          showRejectExport();
          console.log('Export failed');
        }
      } else {
        console.log(`Couldn't validate all fields`);
      }
    } catch (error) {
      console.error('Export error: ', error);
      showRejectExport();
    }
  }, [
    validateFields,
    fieldsToValidate,
    autoFillRules,
    createFolderAndFiles,
    values,
  ]);

  const showSuccessExport = () => {
    toastRef.current.show({
      title: 'Success',
      message: 'Your export to MBS has been successful',
      timeout: 3000,
      color: 'success',
    });
  };

  const showRejectExport = () => {
    toastRef.current.show({
      title: 'Error',
      message: 'Your export to MBS has failed, try again',
      timeout: 3000,
      color: 'reject',
    });
  };

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
                // handleSave();
                // showToastExport();
                console.log('Current values:', values);
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
        title={autoResolveMessage ? 'Automatic Updates' : 'Field Validation'}
        message={autoResolveMessage || currentPrompt?.message}
        onConfirm={() => handleResponse(true)}
      />
      <ReusableToast ref={toastRef} />
    </>
  );
};

export default FinalizeQuote;
