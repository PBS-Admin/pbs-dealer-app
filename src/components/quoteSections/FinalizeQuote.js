import React, {
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useState,
} from 'react';
import { useExport } from '@/hooks/useExport';
import { useSession } from 'next-auth/react';
import ReusableLoader from '../ReusableLoader';
import ReusableDialog from '../ReusableDialog';
import useValidation from '@/hooks/useValidation';
import useSeismic from '@/hooks/useSeismic';
import ReusableToast from '../ReusableToast';
import ReusableSelect from '../Inputs/ReusableSelect';

const FinalizeQuote = ({
  values,
  setValues,
  handleChange,
  handleAssign,
  onSubmitted,
  quoteProgress,
  quoteStatus,
  locked,
  rsms,
  salesPerson,
  projectManager,
  estimator,
  checker,
}) => {
  const { data: session } = useSession();
  const memoizedSetValues = useCallback(setValues, []);
  const { createFolderAndFiles, status, isExporting } = useExport();
  const {
    validateFields,
    currentPrompt,
    isDialogOpen,
    handleResponse,
    autoResolveMessage,
    isValidating,
    resetValidation,
  } = useValidation(values, memoizedSetValues);
  const { getSeismicLoad, seismicData, getSmsLoad, smsData } =
    useSeismic(values);

  useEffect(() => {
    console.log('Finalize Quote rebuilt');
    console.log(projectManager);
  }, []);

  useEffect(() => {
    getSeismicLoad();
    getSmsLoad();
  }, [getSeismicLoad, getSmsLoad]);

  const toastRef = useRef();
  const exportPendingRef = useRef(false);

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

  const hasPermission = (requiredLevel) => {
    return session.user.permission >= requiredLevel;
  };

  const handleSave = useCallback(async () => {
    const isValid = await validateFields([], autoFillRules);
    if (isValid) {
      console.log('Save successful');
    }
  }, [validateFields, autoFillRules]);

  const handleSubmit = useCallback(
    async (e) => {
      try {
        exportPendingRef.current = true;
        const isValid = await validateFields(fieldsToValidate, autoFillRules);

        if (isValidating) {
          return;
        }

        if (!isValid) {
          return;
        }

        exportPendingRef.current = false;
        onSubmitted(e);
      } catch (error) {
        console.error('Export error: ', error);
        showRejectExport();
        exportPendingRef.current = false;
      }
    },
    [validateFields, fieldsToValidate, autoFillRules]
  );

  const handleExport = useCallback(async () => {
    try {
      exportPendingRef.current = true;
      const isValid = await validateFields(fieldsToValidate, autoFillRules);

      if (isValidating) {
        return;
      }

      if (!isValid) {
        return;
      }

      exportPendingRef.current = false;

      const result = await createFolderAndFiles(values);

      if (result.success) {
        await createImportBAT(result.folder);
        showSuccessExport();
      } else {
        showRejectExport();
        console.log('Export failed');
      }
    } catch (error) {
      console.error('Export error: ', error);
      showRejectExport();
      exportPendingRef.current = false;
    }
  }, [
    validateFields,
    fieldsToValidate,
    autoFillRules,
    createFolderAndFiles,
    values,
  ]);

  const handleValidationResponse = useCallback(
    async (response) => {
      handleResponse(response);

      // If this was the last validation and export is pending, trigger export
      if (exportPendingRef.current && !isValidating) {
        handleExport();
      }
    },
    [handleResponse, isValidating, handleExport]
  );

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

  const rsmOptions = useMemo(
    () => Object.entries(rsms).map(([id, name]) => name),
    [rsms]
  );

  const pmOptions = useMemo(
    () => Object.entries(rsms).map(([id, name]) => name),
    [rsms]
  );

  return (
    <>
      <section className="card">
        <header className="cardHeader">
          <h3>Finalize Quote</h3>
        </header>
        <div className="grid4 alignTop">
          <div className="cardButton">
            {!locked && (
              <button type="submit" className="success">
                Save Quote
              </button>
            )}
            {quoteProgress & 0b100 ? (
              <div></div>
            ) : (
              <button
                type="button"
                className="accent"
                onClick={(e) => handleSubmit(e)}
              >
                Submit Quote
              </button>
            )}
            <button
              type="button"
              className="prim"
              onClick={handleExport}
              disabled={isExporting || isValidating}
            >
              {isExporting
                ? status
                : isValidating
                  ? 'Validating...'
                  : 'Export To MBS'}
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
            <button
              type="button"
              className="nuetral"
              onClick={() => {
                console.log(values);
              }}
            >
              Open Contract
            </button>
          </div>
          <div className="divider showWithSidebar span2"></div>
          {!locked && (
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
          )}

          {!locked && (
            <>
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
            </>
          )}
        </div>
      </section>

      {hasPermission(2) && (
        <section className="card">
          <header className="cardHeader">
            <h3>Assignments</h3>
          </header>

          <div className="grid4 alignTop">
            <ReusableSelect
              name={`salesPerson`}
              value={salesPerson}
              onChange={handleAssign}
              options={rsmOptions}
              label="Sales Person:"
              disabled={locked}
            />
            <ReusableSelect
              name={`projectManager`}
              value={projectManager}
              onChange={handleAssign}
              options={pmOptions}
              label="Project Manager:"
              disabled={locked}
            />
            <ReusableSelect
              name={`estimator`}
              value={estimator}
              onChange={handleAssign}
              options={pmOptions}
              label="Estimator:"
              disabled={locked}
            />
            <ReusableSelect
              name={`checker`}
              value={checker}
              onChange={handleAssign}
              options={pmOptions}
              label="Checker:"
              disabled={locked}
            />
          </div>
        </section>
      )}

      <ReusableLoader isOpen={isExporting} title="Loading" message={status} />
      <ReusableDialog
        isOpen={isDialogOpen}
        onClose={() => handleValidationResponse(false)}
        title={autoResolveMessage ? 'Automatic Updates' : 'Field Validation'}
        message={autoResolveMessage || currentPrompt?.message}
        onConfirm={() => handleValidationResponse(true)}
        onlyConfirm={autoResolveMessage ? true : false}
      />
      <ReusableToast ref={toastRef} />
    </>
  );
};

export default FinalizeQuote;
