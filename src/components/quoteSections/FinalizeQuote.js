import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import { useExport } from '@/hooks/useExport';
import { usePDF } from '@/hooks/usePDF';
import ReusableLoader from '../ReusableLoader';
import ReusableDialog from '../ReusableDialog';
import useValidation from '@/hooks/useValidation';
import useSeismic from '@/hooks/useSeismic';
import ReusableToast from '../ReusableToast';

const FinalizeQuote = ({ values, setValues, handleChange }) => {
  const memoizedSetValues = useCallback(setValues, []);

  const { createFolderAndFiles, status, isExporting } = useExport();
  const { createContract } = usePDF();
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
      const isValid = await validateFields(fieldsToValidate, autoFillRules);

      if (isValid) {
        const result = await createFolderAndFiles(values);

        if (result.success) {
          await createImportBAT(result.folder);
          showSuccessExport();
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

  const createImportBAT = async (folder) => {
    if (typeof window === 'undefined' || !('showDirectoryPicker' in window)) {
      console.log(
        'File System Access API is not supported in this environment.'
      );
      const res = { success: false, folder: '' };
      return res;
    }

    let newProjectHandle, newProjectName;

    if (values.buildings.length > 1) {
      newProjectName = values.quoteNumber + 'P';
    } else {
      newProjectName = values.quoteNumber;
    }

    newProjectHandle = await folder.getDirectoryHandle(newProjectName, {
      create: false,
    });

    const batchHandle = await newProjectHandle.getFileHandle('autoImport.bat', {
      create: true,
    });

    const writable = await batchHandle.createWritable();

    if (values.buildings.length > 1) {
      const newProjectName = values.quoteNumber + 'P';
      const bldgAlpha = ' BCDEFGHI';
      for (let i = 0; i < values.buildings.length; i++) {
        const newFolderName = values.quoteNumber + bldgAlpha[i].trim();
        await writable.write(
          `c:\\mbs\\util\\mbs_ini.exe 1 ${newFolderName}\\desctrl.in ${newFolderName}\\desctrl.ini\n`
        );
      }
    } else {
      await writable.write(
        'c:\\mbs\\util\\mbs_ini.exe 1 desctrl.in desctrl.ini\n'
      );
    }
    await writable.close();
  };

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

  const handleContract = useCallback(async () => {
    // try {
    // const isValid = await validateFields(fieldsToValidate, autoFillRules);

    // if (isValid) {
    const pdfBytes = await createContract(values);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    window.open(url);

    // if (pdfBytes.success) {
    //   // tasks here
    //   showSuccessExport();
    // } else {
    //   showRejectExport();
    //   console.log('Export failed');
    // }
    //   } else {
    //     console.log(`Couldn't validate all fields`);
    //   }
    // } catch (error) {
    //   console.error('Contract error: ', error);
    //   showRejectExport();
    // }
  }, [validateFields, fieldsToValidate, autoFillRules, createContract, values]);

  return (
    <>
      <section className="card">
        <header className="cardHeader">
          <h3>Finalize Quote</h3>
        </header>
        <div className="grid4 alignTop">
          <div className="cardButton">
            <button type="submit" className="success">
              Save Quote
            </button>
            <button
              type="button"
              className="accent"
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
              className="prim"
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
              className="sec"
              onClick={() => {
                console.log(values);
              }}
            >
              Notes for Estimator
            </button>
            <button type="button" className="nuetral" onClick={handleContract}>
              Open Contract
            </button>
          </div>
          <div className="divider showWithSidebar span2"></div>
          <div className="cardButton">
            <button
              type="button"
              className="nuetral"
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
              className="reject"
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
