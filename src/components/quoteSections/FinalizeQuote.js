import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import { useExport } from '@/hooks/useExport';
import { usePDF } from '@/hooks/usePDF';
import ReusableLoader from '../ReusableLoader';
import ReusableDialog from '../ReusableDialog';
import useValidation from '@/hooks/useValidation';
import useSeismic from '@/hooks/useSeismic';
import ReusableToast from '../ReusableToast';
import ReusableSelect from '../Inputs/ReusableSelect';
import { useBuildingContext } from '@/contexts/BuildingContext';
import { useUserContext } from '@/contexts/UserContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';
import ReusableDouble from '../Inputs/ReusableDouble';
import { useUIContext } from '@/contexts/UIContext';

const FinalizeQuote = ({ locked }) => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });
  // Contexts
  const { state, handleChange, complexityInfo, setValues } =
    useBuildingContext();
  const {
    companyData,
    rsms,
    projectManagers,
    estimators,
    isLoading,
    hasPermission,
  } = useUserContext();
  const { openDeleteQuoteDialog } = useUIContext();

  // Hooks
  const memoizedSetValues = useCallback(setValues, []);
  const { createFolderAndFiles, status, isExporting } = useExport();
  const { createContract } = usePDF();
  const {
    validateFields,
    currentPrompt,
    isDialogOpen,
    handleResponse,
    autoResolveMessage,
    isValidating,
  } = useValidation(state, memoizedSetValues);
  const { getSeismicLoad, seismicData, getSmsLoad, smsData } =
    useSeismic(state);

  const isEstimator = session?.user?.estimator === 1;

  // References
  const toastRef = useRef();
  const exportPendingRef = useRef(false);

  // Local Functions
  useEffect(() => {
    getSeismicLoad();
    getSmsLoad();
  }, [getSeismicLoad, getSmsLoad]);

  // Fill out rsm dropdown field
  const rsmOptions = useMemo(
    () => [
      { id: '', label: '-- Select Sales Person --' },
      ...Object.entries(rsms)
        .filter(([_, rsm]) => rsm.company === state.companyId)
        .map(([id, rsm]) => ({
          id: id,
          label: rsm.name,
        })),
    ],
    [rsms]
  );
  // Fill out project manager dropdown field
  const pmOptions = useMemo(
    () => [
      { id: '', label: '-- Select Project Manager --' },
      ...Object.entries(projectManagers)
        .filter(([_, pm]) => pm.company === state.companyId)
        .map(([id, pm]) => ({
          id: id,
          label: pm.name,
        })),
    ],
    [projectManagers]
  );
  // Fill out estimator/checker dropdown field
  const estimatorOptions = useMemo(
    () => [
      { id: '', label: '-- Select Estimator/Checker --' },
      ...Object.entries(estimators).map(([id, est]) => ({
        id: id,
        label: est.name,
      })),
    ],
    [estimators]
  );

  const handleSubmit = useCallback(
    async (e) => {
      try {
        exportPendingRef.current = true;
        const isValid = await validateFields();

        if (isValidating) {
          return;
        }

        if (!isValid) {
          return;
        }

        exportPendingRef.current = false;

        const saveData = {
          currentQuote: state.quoteId || 0,
          user: {
            id: session?.user?.id,
            company: companyData.ID,
          },
          state: {
            ...state,
            quoteProgress: 4,
          },
          salesPerson: state.salesPerson,
          projectManager: state.projectManager,
          estimator: state.estimator,
          checker: state.checker,
          complexity: complexityInfo?.complexity || 1,
        };

        const response = await fetch('/api/auth/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saveData),
        });

        const data = await response.json();

        if (response.ok) {
          // if (data.refresh) {
          //   // Force a refresh of the quotes data
          //   await fetchQuotes();
          // }
          router.replace('/tracker');
        }
      } catch (error) {
        console.error('Export error: ', error);
        showRejectExport();
        exportPendingRef.current = false;
      }
    },
    [validateFields]
  );

  const handleReject = useCallback(async (e) => {
    try {
      const saveData = {
        currentQuote: state.quoteId || 0,
        user: {
          id: session?.user?.id,
          company: companyData.ID,
        },
        state: {
          ...state,
          quoteProgress: 8,
        },
        salesPerson: state.salesPerson,
        projectManager: state.projectManager,
        estimator: state.estimator,
        checker: state.checker,
        complexity: complexityInfo?.complexity || 1,
      };

      const response = await fetch('/api/auth/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData),
      });

      if (response.ok) {
        router.replace('/tracker');
      }
    } catch (error) {
      console.error('Export error: ', error);
      showRejectExport();
      exportPendingRef.current = false;
    }
  }, []);

  const handleToChecking = useCallback(async (e) => {
    try {
      const saveData = {
        currentQuote: state.quoteId || 0,
        user: {
          id: session?.user?.id,
          company: companyData.ID,
        },
        state: {
          ...state,
          quoteProgress: 16,
        },
        salesPerson: state.salesPerson,
        projectManager: state.projectManager,
        estimator: state.estimator,
        checker: state.checker,
        complexity: complexityInfo?.complexity || 1,
      };

      const response = await fetch('/api/auth/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData),
      });

      if (response.ok) {
        router.replace('/tracker');
      }
    } catch (error) {
      console.error('Export error: ', error);
      showRejectExport();
      exportPendingRef.current = false;
    }
  }, []);

  const handleReturn = useCallback(async (e) => {
    try {
      const saveData = {
        currentQuote: state.quoteId || 0,
        user: {
          id: session?.user?.id,
          company: companyData.ID,
        },
        state: {
          ...state,
          quoteProgress: 32,
        },
        salesPerson: state.salesPerson,
        projectManager: state.projectManager,
        estimator: state.estimator,
        checker: state.checker,
        complexity: complexityInfo?.complexity || 1,
      };

      const response = await fetch('/api/auth/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData),
      });

      if (response.ok) {
        router.replace('/tracker');
      }
    } catch (error) {
      console.error('Export error: ', error);
      showRejectExport();
      exportPendingRef.current = false;
    }
  }, []);

  const handleComplete = useCallback(async (e) => {
    try {
      const saveData = {
        currentQuote: state.quoteId || 0,
        user: {
          id: session?.user?.id,
          company: companyData.ID,
        },
        state: {
          ...state,
          quoteProgress: 64,
        },
        salesPerson: state.salesPerson,
        projectManager: state.projectManager,
        estimator: state.estimator,
        checker: state.checker,
        complexity: complexityInfo?.complexity || 1,
      };

      const response = await fetch('/api/auth/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData),
      });

      if (response.ok) {
        router.replace('/tracker');
      }
    } catch (error) {
      console.error('Export error: ', error);
      showRejectExport();
      exportPendingRef.current = false;
    }
  }, []);

  const handleDelete = () => {
    openDeleteQuoteDialog(
      state.quoteId,
      `Quote ${state.quoteNumber}${state.revNumber > 0 ? ` R${state.revNumber}` : ''}`,
      '/tracker'
    );
  };

  const handleExport = useCallback(async () => {
    try {
      exportPendingRef.current = true;
      const isValid = await validateFields();

      if (isValidating) {
        return;
      }

      if (!isValid) {
        return;
      }

      exportPendingRef.current = false;

      const result = await createFolderAndFiles(state);

      if (result.success) {
        await createImportBAT(result.folder);
        showSuccessExport();
      } else {
        console.log(result.error);
        switch (result.error) {
          case 'AbortError':
            toastRef.current.show({
              title: 'Error',
              message: 'Export cancelled',
              timeout: 1000,
              color: 'nuetral',
            });
            break;
          case 'NotFoundError':
            toastRef.current.show({
              title: 'Error',
              message:
                'Could not find correct subfolders, please follow these steps: \n1.) Select C:/MBS folder on first dialog \n2.) Select C:/Jobs or custom Jobs folder on second dialog',
              timeout: 5000,
              color: 'reject',
            });
            break;
          default:
            toastRef.current.show({
              title: 'Error',
              message: 'Export failed',
              timeout: 1000,
              color: 'reject',
            });
            break;
        }

        // showRejectExport();
        console.log('Export failed');
      }
    } catch (error) {
      console.error('Export error: ', error);
      console.log('e:', error.name);
      showRejectExport();
      exportPendingRef.current = false;
    }
  }, [validateFields, isValidating, createFolderAndFiles, state]);

  const handleContract = useCallback(async () => {
    try {
      if (!companyData) {
        showRejectExport();
        return;
      }

      console.log(complexityInfo.complexity);

      const contractData = {
        ...state,
        companyId: companyData.ID,
        companyName: companyData.Name,
        companyAddress: companyData.Address1 || '',
        companyCityStateZip: companyData.Address2 || '',
        terms: companyData.Terms === null ? '' : JSON.parse(companyData.Terms),
        initials: companyData.Initials || '',
        line1: companyData.Line1 || '',
        line2: companyData.Line2 || '',
        line3: companyData.Line3 || '',
        line4: companyData.Line4 || '',
        line5: companyData.Line5 || '',
        line6: companyData.Line6 || '',
        line7: companyData.Line7 || '',
        line8: companyData.Line8 || '',
        complexity: complexityInfo.complexity,
      };

      const pdfBytes = await createContract(contractData);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      window.open(url);
      showSuccessExport();
    } catch (error) {
      console.error('Contract error: ', error);
      showRejectExport();
    }
  }, [state, companyData, createContract]);

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

    if (state.buildings.length > 1) {
      newProjectName = state.quoteNumber + 'P';
    } else {
      newProjectName = state.quoteNumber;
    }

    newProjectHandle = await folder.getDirectoryHandle(newProjectName, {
      create: false,
    });

    const batchHandle = await newProjectHandle.getFileHandle('autoImport.bat', {
      create: true,
    });

    const writable = await batchHandle.createWritable();

    if (state.buildings.length > 1) {
      const newProjectName = state.quoteNumber + 'P';
      const bldgAlpha = ' BCDEFGHI';
      for (let i = 0; i < state.buildings.length; i++) {
        const newFolderName = state.quoteNumber + bldgAlpha[i].trim();
        await writable.write(
          `rename "${newFolderName}\\desctrl.txt" desctrl.ini\n`
        );
        await writable.write(
          `rename "${newFolderName}\\desload.txt" desload.ini\n`
        );
        await writable.write(
          `c:\\mbs\\util\\mbs_ini.exe 1 ${newFolderName}\\desctrl.in ${newFolderName}\\desctrl.ini\n`
        );
      }
    } else {
      await writable.write(`rename desctrl.txt desctrl.ini\n`);
      await writable.write(`rename desload.txt desload.ini\n`);
      await writable.write(
        'c:\\mbs\\util\\mbs_ini.exe 1 desctrl.in desctrl.ini\n'
      );
    }
    await writable.close();
  };

  const handleImport = useCallback(async () => {
    try {
      const jobFolderHandle = await window.showDirectoryPicker({
        id: 'CDriveSelection',
        mode: 'readwrite',
        title: 'Select your jobs folder',
      });

      const mbsJobFolder = await jobFolderHandle.getDirectoryHandle(
        state.quoteNumber,
        {
          create: false,
        }
      );

      const newPDWGFileHandle = await mbsJobFolder.getFileHandle(
        'bldgStats.txt',
        {
          create: false,
        }
      );

      const file = await newPDWGFileHandle.getFile();
      const text = await file.text();

      const lines = text.split('\n');

      const buildingWeight = lines
        .find((line) => line.startsWith('Total_Wt'))
        ?.split(',')[1]
        .trim();

      const finalPrice = lines
        .find((line) => line.startsWith('Price'))
        ?.split(',')[1]
        .trim();

      if (buildingWeight == 0 || finalPrice.includes('@')) {
        toastRef.current.show({
          title: 'Error',
          message: `The bldgStats.txt did not get created properly, \n please remake your Ship.out file and try importing again`,
          timeout: 5000,
          color: 'reject',
        });
      }
      // Set the weight and price in the state
      setValues({
        ...state,
        contractWeight: buildingWeight,
        contractPrice: finalPrice,
      });
    } catch (error) {
      switch (error.name) {
        case 'AbortError':
          toastRef.current.show({
            title: 'Error',
            message: 'Import cancelled',
            timeout: 1000,
            color: 'nuetral',
          });
          break;
        case 'NotFoundError':
          toastRef.current.show({
            title: 'Error',
            message: `Error importing, did not find ${state.quoteNumber} folder inside of that Jobs folder`,
            timeout: 5000,
            color: 'reject',
          });
          console.error('Error parsing file:', error);
          break;
        default:
          toastRef.current.show({
            title: 'Error',
            message:
              'Error importing, Please try rerunning your MBS and selecting the Jobs folder to import',
            timeout: 5000,
            color: 'reject',
          });
          console.error('Error parsing file:', error);
          break;
      }
    }
  }, []);

  if (isLoading) {
    return (
      <ReusableLoader
        isOpen={true}
        title="Loading"
        message="Loading company data..."
      />
    );
  }

  // JSX
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
            {(state.quoteProgress & 9) != 0 && //Rejected or Started Progress
              state.quoteNumber && (
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
            {state.contractPrice > 0 &&
              state.contractWeight > 0 &&
              state.quoteNumber != '' && (
                <>
                  <button
                    type="button"
                    className="nuetral"
                    onClick={handleContract}
                  >
                    Create Contract
                  </button>
                  {/* <button
                    type="button"
                    className="nuetral"
                    onClick={() => {
                      console.log(state);
                    }}
                  >
                    Open Contract
                  </button> */}
                </>
              )}
          </div>
          <div className="divider showWithSidebar span2"></div>
          {!locked && (
            <div className="cardButton">
              {(state.quoteProgress & 4) != 0 && //Submitted Progress
                isEstimator && (
                  <button
                    type="button"
                    className="nuetral"
                    onClick={handleToChecking}
                  >
                    Move to Checking
                  </button>
                )}
              {(state.quoteProgress & 20) != 0 && //Submitted or InChecking Progress
                isEstimator && (
                  <button
                    type="button"
                    className="reject"
                    onClick={handleReject}
                  >
                    Reject Quote
                  </button>
                )}
              {(state.quoteProgress & 20) != 0 && //Submitted or InChecking Progress
                isEstimator && (
                  <button
                    type="button"
                    className="success"
                    onClick={handleReturn}
                  >
                    Return Quote
                  </button>
                )}
            </div>
          )}

          {!locked && (
            <>
              <div className="divider offOnPhone"></div>
              <div className="cardButton">
                <button type="button" className="reject" onClick={handleDelete}>
                  Delete Quote
                </button>
                <button
                  type="button"
                  className="nuetral"
                  onClick={() => {
                    console.log(state);
                  }}
                >
                  Archive Quote
                </button>
                <button
                  type="button"
                  className="success"
                  onClick={handleComplete}
                >
                  Complete Quote
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

          <div className="grid4 alignTop assign">
            <ReusableSelect
              name={`salesPerson`}
              value={state.salesPerson || ''}
              onChange={handleChange}
              options={rsmOptions}
              label="Sales Person:"
              disabled={locked}
            />

            {hasPermission(4) ? (
              <ReusableSelect
                name={`projectManager`}
                value={state.projectManager || ''}
                onChange={handleChange}
                options={pmOptions}
                label="Project Manager:"
                disabled={locked}
              />
            ) : (
              <div></div>
            )}
            {((hasPermission(3) && isEstimator) || hasPermission(4)) && (
              <>
                <ReusableSelect
                  name={`estimator`}
                  value={state.estimator || ''}
                  onChange={handleChange}
                  options={estimatorOptions}
                  label="Estimator:"
                  disabled={locked}
                />
                <ReusableSelect
                  name={`checker`}
                  value={state.checker || ''}
                  onChange={handleChange}
                  options={estimatorOptions}
                  label="Checker:"
                  disabled={locked}
                />
              </>
            )}
          </div>
        </section>
      )}

      <section className="card">
        <header className="cardHeader">
          <h3>Cost / Weight</h3>
        </header>

        <div className="grid4 alignTop assign">
          <ReusableDouble
            id={'contractWeight'}
            value={state.contractWeight || 0}
            onChange={handleChange}
            name={'contractWeight'}
            label={
              <>
                Building Weight: <small>(lbs)</small>
              </>
            }
            icon={locked ? '' : complexityInfo.complexity < 3 ? 'import' : ''}
            iconClass={'prim'}
            iconOnClick={handleImport}
            tooltip="Import price/weight from Jobs folder"
            disabled={locked}
            decimalPlaces={2}
          />
          <ReusableDouble
            id={'contractPrice'}
            value={state.contractPrice || 0}
            onChange={handleChange}
            name={'contractPrice'}
            label={'Contract Price:'}
            disabled={locked}
            decimalPlaces={2}
          />
        </div>
      </section>

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
