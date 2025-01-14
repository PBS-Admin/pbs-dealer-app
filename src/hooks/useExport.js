'use client';

import { useBuildingContext } from '@/contexts/BuildingContext';
import { useState, useCallback } from 'react';

export function useExport() {
  const [status, setStatus] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const bldgAlpha = ' BCDEFGHI';
  let folderPaths = [];
  const { state, complexityInfo } = useBuildingContext();

  // ! Eng/Draft rates and minimums
  let engRate = 80;
  let detRate = 20;
  let engMin = 0;
  let detMin = 20;

  const countFiles = async (dirHandle) => {
    let count = 0;
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.siz')) {
        count++;
      }
    }
    return count;
  };

  const createFolderAndFiles = useCallback(async () => {
    if (typeof window === 'undefined' || !('showDirectoryPicker' in window)) {
      setStatus('File System Access API is not supported in this environment.');
      const res = { success: false, folder: '' };
      return res;
    }

    setIsExporting(true);
    setStatus('Starting export...');

    try {
      const bldgAlpha = ' BCDEFGHI';
      // Request permission to access the MBS Folder
      setStatus('Please select your MBS Folder...');
      const mbsFolderHandle = await window.showDirectoryPicker({
        id: 'CDriveSelection',
        mode: 'readwrite',
        title: 'Select your folder containing MBS and Jobs folders',
      });

      // Request permission to access the C: drive
      setStatus('Please select your Jobs Folder...');
      const jobsFolderHandle = await window.showDirectoryPicker({
        id: 'DocSelection',
        mode: 'readwrite',
        title: 'Select your folder containing Jobs folders',
      });

      // Get and set handlers for MBS subfolders and Jobs folder
      // let mbsFolderHandle,
      let siz2FolderHandle,
        doc2FolderHandle,
        intProjectFolderHandle,
        intDoc2FolderHandle;
      try {
        siz2FolderHandle = await mbsFolderHandle.getDirectoryHandle('SIZ2', {
          create: false,
        });
        doc2FolderHandle = await mbsFolderHandle.getDirectoryHandle('DOC2', {
          create: false,
        });
        intProjectFolderHandle = await mbsFolderHandle.getDirectoryHandle(
          'Project',
          {
            create: false,
          }
        );
        intDoc2FolderHandle = await intProjectFolderHandle.getDirectoryHandle(
          'Doc2',
          {
            create: false,
          }
        );
      } catch (error) {
        setStatus('MBS and Jobs subfolder not found on the selected drive.');
        const res = { success: false, folder: '', error: error.name };
        return res;
      }

      let newProjectHandle, rootHandle, newBuildingHandle, shouldCreate;

      // Create a new Project folder in the Jobs folder
      if (state.buildings.length > 1) {
        const newProjectName = state.quoteNumber + 'P' || 'New Project Folder';
        newProjectHandle = await jobsFolderHandle.getDirectoryHandle(
          newProjectName,
          { create: true }
        );
      }

      newProjectHandle
        ? (rootHandle = newProjectHandle)
        : (rootHandle = jobsFolderHandle);

      // Create Folder Structure
      setStatus('Creating Folders...');
      state.buildings.map(async (building, index) => {
        newBuildingHandle ? (shouldCreate = false) : (shouldCreate = true);

        newBuildingHandle = await rootHandle.getDirectoryHandle(
          state.quoteNumber + bldgAlpha[index].trim(),
          {
            create: shouldCreate,
          }
        );
        if (
          !folderPaths.includes(state.quoteNumber + bldgAlpha[index].trim())
        ) {
          folderPaths.push(state.quoteNumber + bldgAlpha[index].trim());
        }
      });

      // Copy .siz files from MBS/SIZ2 to the new folder
      await copySizFiles(
        setStatus,
        countFiles,
        siz2FolderHandle,
        newProjectHandle,
        newBuildingHandle,
        rootHandle
      );

      if (newProjectHandle) {
        setStatus('Copying PDWGCtrl.in file');
        for await (const entry of intDoc2FolderHandle.values()) {
          if (
            entry.kind === 'file' &&
            entry.name.toLowerCase() == 'pdwgctrl.in'
          ) {
            const file = await entry.getFile();

            const newPDWGFileHandle = await newProjectHandle.getFileHandle(
              entry.name,
              { create: true }
            );
            const newPDWGWritable = await newPDWGFileHandle.createWritable();
            await newPDWGWritable.write(file);
            await newPDWGWritable.close();
          }
        }
      }

      let copiedFiles = 0;
      let totalFiles = 0;
      for await (const entry of doc2FolderHandle.values()) {
        totalFiles++;
      }

      for await (const entry of doc2FolderHandle.values()) {
        copiedFiles++;
        if (
          entry.kind === 'file' &&
          (entry.name.toLowerCase() == 'mbs.cfg' ||
            entry.name.toLowerCase() == 'mbs.frm' ||
            entry.name.toLowerCase() == 'desctrl.in' ||
            entry.name.toLowerCase() == 'dwgctrl.in' ||
            entry.name.toLowerCase() == 'pdwgctrl.in')
        ) {
          setStatus(`Copying ${copiedFiles}/${totalFiles} .doc2 files...`);
          const file = await entry.getFile();

          if (newProjectHandle && entry.name.toLowerCase() == 'pdwgctrl.in') {
            const newPDWGFileHandle = await newProjectHandle.getFileHandle(
              entry.name,
              { create: true }
            );
            const newPDWGWritable = await newPDWGFileHandle.createWritable();
            await newPDWGWritable.write(file);
            await newPDWGWritable.close();
          }

          if (
            newProjectHandle &&
            (entry.name.toLowerCase() == 'desctrl.in' ||
              entry.name.toLowerCase() == 'dwgctrl.in')
          ) {
            const newCommonHandle = await newProjectHandle.getDirectoryHandle(
              'Common',
              { create: false }
            );
            const newCommonFileHandle = await newCommonHandle.getFileHandle(
              entry.name,
              { create: true }
            );
            const newCommonWritable =
              await newCommonFileHandle.createWritable();
            await newCommonWritable.write(file);
            await newCommonWritable.close();
          }

          state.buildings.map(async (building, index) => {
            newBuildingHandle ? (shouldCreate = false) : (shouldCreate = true);

            newBuildingHandle = await rootHandle.getDirectoryHandle(
              state.quoteNumber + bldgAlpha[index].trim(),
              {
                create: shouldCreate,
              }
            );
            const newFileHandle = await newBuildingHandle.getFileHandle(
              entry.name,
              {
                create: true,
              }
            );
            const newWritable = await newFileHandle.createWritable();
            await newWritable.write(file);
            await newWritable.close();
          });
        }
      }

      // Create and write to Project.in file in the root folder
      setStatus('Creating Project.in file...');
      if (newProjectHandle) {
        const projectInHandle = await newProjectHandle.getFileHandle(
          'Project.in',
          {
            create: true,
          }
        );
        await newProjectHandle.removeEntry('Project.in');
        const writable = await projectInHandle.createWritable();

        await writable.write('[PROJECT]\n');
        await writable.write(`Id=${state.quoteNumber + 'P'}\n`);
        await writable.write(`#Building=${state.buildings.length}\n`);
        await writable.write('Units=\n');
        await writable.write('Status=\n');
        await writable.write('Title=\n');
        await writable.write('Comments=\n');
        await writable.write(`NextIdKey=${state.buildings.length + 1}\n`);

        for (let index = 0; index < state.buildings.length; index++) {
          await writable.write(`[BUILDING:${index + 1}]\n`);
          await writable.write(
            `Id=${state.quoteNumber + bldgAlpha[index].trim()}\n`
          );
          await writable.write(`IdKey=${index + 1}\n`);
          await writable.write('Active=Y\n');
        }

        await writable.close();
      }

      // Create and write to MBS.in file in the new folder
      setStatus('Creating MBS.in file...');

      for (let index = 0; index < state.buildings.length; index++) {
        newBuildingHandle = await rootHandle.getDirectoryHandle(
          state.quoteNumber + bldgAlpha[index].trim(),
          {
            create: false,
          }
        );
        setStatus(
          `Creating Building${bldgAlpha[index].trim()} DesCtrl.ini file...`
        );

        // Loop through buildings and create these files
        await createDesCtrl(rootHandle, index);

        await createDesLoad(rootHandle, index);

        await createMBS(rootHandle, index);

        await createBldCtrl(rootHandle, index);
      }

      if (newProjectHandle) {
        // Create the Root MBS.in file
        const newMbsInHandle = await newProjectHandle.getFileHandle('MBS.in', {
          create: true,
        });
        const mbsFile = await createMBS(rootHandle);
        const writable = await newMbsInHandle.createWritable();
        await writable.write(mbsFile);
        await writable.close();

        // Create the Common MBS.in file
        const newCommonHandle = await rootHandle.getDirectoryHandle('Common', {
          create: false,
        });
        const newCommonFileHandle = await newCommonHandle.getFileHandle(
          'MBS.in',
          {
            create: true,
          }
        );
        const commonWritable = await newCommonFileHandle.createWritable();
        await commonWritable.write(mbsFile);
        await commonWritable.close();
      }

      setStatus('Export and file copying completed successfully!');
      const res = { success: true, folder: jobsFolderHandle };
      return res;
    } catch (error) {
      setStatus(`Error during export: ${error.message}`);
      const res = { success: false, folder: '', error: error.name };
      return res;
    } finally {
      setIsExporting(false);
    }
  }, []);

  async function copySizFiles(
    setStatus,
    countFiles,
    siz2FolderHandle,
    newProjectHandle,
    newBuildingHandle,
    rootHandle
  ) {
    setStatus('Copying .siz files...');
    const totalFiles = await countFiles(siz2FolderHandle);

    let copiedFiles = 0;
    for await (const entry of siz2FolderHandle.values()) {
      if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.siz')) {
        setStatus(`Copying ${copiedFiles}/${totalFiles} .siz files...`);
        const file = await entry.getFile();

        if (newProjectHandle) {
          const newCommonHandle = await newProjectHandle.getDirectoryHandle(
            'Common',
            { create: true }
          );
          const newCommonFileHandle = await newCommonHandle.getFileHandle(
            entry.name,
            { create: true }
          );
          const newCommonWritable = await newCommonFileHandle.createWritable();
          await newCommonWritable.write(file);
          await newCommonWritable.close();
        }

        state.buildings.map(async (building, index) => {
          newBuildingHandle = await rootHandle.getDirectoryHandle(
            state.quoteNumber + bldgAlpha[index].trim(),
            {
              create: false,
            }
          );
          const newFileHandle = await newBuildingHandle.getFileHandle(
            entry.name,
            {
              create: true,
            }
          );
          const newWritable = await newFileHandle.createWritable();
          await newWritable.write(file);
          await newWritable.close();
        });
        copiedFiles++;
      }
    }
  }

  async function createMBS(rootHandle, index = 0) {
    const newBuildingHandle = await rootHandle.getDirectoryHandle(
      state.quoteNumber + bldgAlpha[index].trim(),
      {
        create: false,
      }
    );

    const mbsInHandle = await newBuildingHandle.getFileHandle('MBS.in', {
      create: true,
    });

    const { length, roofBreakPoints, steelFinish } = state.buildings[index];
    const { complexity, detailingHours, engineeringHours } = complexityInfo;

    let draftCost, foundCost, farmBureau, engHours, detHours;

    // Compare hours against the minimum
    engHours = engineeringHours < engMin ? engMin : engineeringHours;
    detHours = detailingHours < detMin ? detMin : detailingHours;
    draftCost = engHours * engRate + detHours * detRate;
    foundCost =
      state.monoSlabDesign || state.pierFootingDesign
        ? complexity < 3
          ? '1500'
          : '2000'
        : '';

    const writable = await mbsInHandle.createWritable();
    await writable.write(`Pacific Building Systems\n`);
    await writable.write(`2100 N Pacific Hwy\n`);
    await writable.write(`Woodburn, OR 97071\n`);
    await writable.write(
      `${state.customerName ? state.customerName : state.contactName}\n`
    );
    await writable.write(`${state.customerAddress}\n`);
    await writable.write(
      `${state.customerCity}, ${state.customerState} ${state.customerZip}\n`
    );
    await writable.write(`${state.projectName}\n`);
    await writable.write(`${state.projectAddress}\n`);
    await writable.write(
      `${state.projectCity}, ${state.projectState} ${state.projectZip}\n`
    );
    await writable.write(`${state.quoteNumber}\n`);
    await writable.write(`${state.engineerInitials || 'TEE'}\n`); // todo: create var
    await writable.write(`${state.detailerInitials || 'TEE'}\n`); // todo: create var
    await writable.write(`\n`);
    await writable.write(`${state.contactName}\n`);
    await writable.write(`${state.customerPhone}\n`);
    await writable.write(`${state.customerFax}\n`);
    await writable.write(`${state.projectCity}\n`);
    await writable.write(`${state.projectCounty}\n`);
    await writable.write(`${state.projectState}\n`);
    await writable.write(`${state.salespersonInitials || 'TEE'}\n`); // todo: create var
    await writable.write(`${state.quoteNumber}\n`);
    await writable.write(`${state.estimatorInitials || 'TEE'}\n`); // todo: create var
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`${complexity || 1}\n`); // todo: create var
    await writable.write(`${draftCost || 50}\n`);
    await writable.write(`${foundCost || ''}\n`);
    await writable.write(`${state.farmBureau || 'N'}\n`); // todo: create var
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`${state.customerCell}\n`);
    await writable.write(`${state.customerEmail}\n`);
    await writable.write(`\n`);
    await writable.write(`${state.pmInitials || ''}\n`); // todo: create var
    await writable.write(`${state.projectMileage || ''}\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`${steelFinish == 'GZ' ? 'GZ' : 'ST'}\n`); // todo: create var
    await writable.write(`${roofBreakPoints == 'left' ? 'N' : 'Y'}\n`);
    await writable.write(
      `${state.projectState == 'OR' || state.projectState == 'WA' ? 'Y' : 'N'}\n`
    );
    await writable.write(
      `${state.projectState == 'OR' || state.projectState == 'WA' || state.projectState == 'AK' || state.projectState == 'HI' ? 'N' : 'Y'}\n`
    );
    await writable.write(
      `${state.projectState == 'AK' || state.projectState == 'HI' ? 'Y' : 'N'}\n`
    );
    await writable.write(`${state.willCall ? 'Y' : 'N'}\n`); // todo: create var
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`4\n`);
    await writable.write(`14\n`);
    await writable.write(`12\n`);
    await writable.write(`4\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`N\n`);
    await writable.write(`\n`);
    await writable.write(`${state.noFlangeBraces ? 'Y' : 'N'}\n`);
    await writable.write(`N\n`);
    await writable.write(`N\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`Y\n`);
    await writable.write(`N\n`);
    await writable.write(`N\n`);
    await writable.write(`N\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`N\n`);
    await writable.write(`N\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`${steelFinish}\n`);
    await writable.write(`2\n`);
    await writable.write(`4\n`);
    await writable.write(`11\n`);
    await writable.write(`4\n`);
    await writable.write(`4\n`);
    await writable.write(`4\n`);
    await writable.write(`4\n`);
    await writable.write(`2\n`);
    await writable.write(`4\n`);
    await writable.write(`9\n`);
    await writable.write(`4\n`);
    await writable.write(`4\n`);
    await writable.write(`24\n`);
    await writable.write(`4\n`);
    await writable.write(`6\n`);
    await writable.write(`2\n`);
    await writable.write(`12\n`);
    await writable.close();

    const mbsFile = await mbsInHandle.getFile();
    return mbsFile;
  }

  async function createBldCtrl(rootHandle, index = 0) {
    const newBuildingHandle = await rootHandle.getDirectoryHandle(
      state.quoteNumber + bldgAlpha[index].trim(),
      {
        create: false,
      }
    );

    const bldCtrlHandle = await newBuildingHandle.getFileHandle('BldCtrl.log', {
      create: true,
    });

    const writable = await bldCtrlHandle.createWritable();
    await writable.write(
      `*==============================================================================\n`
    );
    await writable.write(`* BldCtrl.Log  :  Auto Generated\n`);
    await writable.write(
      `*==============================================================================\n`
    );
    await writable.write(`*\n`);
    await writable.write(`*(1) DESCTRL SELECTED FILE:\n`);
    await writable.write(`*\n`);
    await writable.write(
      `* Date         ID       File              Description\n`
    );
    await writable.write(
      `''            'IN'     'Desctrl.IN'      'Default Building'\n`
    );
    await writable.write(`\n`);
    await writable.write(`(2) DWGCTRL SELECTED FILE:*\n`);
    await writable.write(
      `* Date         ID       File              Description\n`
    );
    await writable.write(
      `''            'IN'     'DwgCtrl.IN'      'Preliminary (Estimating) 11x17'\n`
    );
    await writable.write(`\n`);
    await writable.write(`*(3) JOBINFO SELECTED FILE:\n`);
    await writable.write(
      `* Date         ID       File              Description\n`
    );
    await writable.write(`''            '--'     ''                ''\n`);
    await writable.write(`\n`);
    await writable.write(`*\n`);
    await writable.write(`*(4) DATABASE SELECTED FILES:\n`);
    await writable.write(`*\n`);
    await writable.write(
      `* Date         ID       File              Description\n`
    );
    await writable.write(`\n`);
    await writable.close();

    const logFile = await bldCtrlHandle.getFile();
    return logFile;
  }

  async function createDesLoad(rootHandle, index = 0) {
    const response = await fetch('/api/rain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        zipCode: state.projectZip,
      }),
    });

    const rainData = await response.json();
    const fiveYear = rainData.data.fiveYear;
    const twentyFiveYear = rainData.data.twentyFiveYear;

    const riskLabels = {
      I: 'I - Low',
      II: 'II - Normal',
      III: 'III - High',
      IV: 'IV - Post',
    };

    const codes = {
      ibc21: 'IBC_21',
      ibc18: 'IBC_18',
      ibc15: 'IBC_15',
      ibc12: 'IBC_12',
      ossc22: 'IBC_21',
      ossc19: 'IBC_18',
      cbc22: 'IBC_21',
      cbc19: 'IBC_18',
    };

    const newBuildingHandle = await rootHandle.getDirectoryHandle(
      state.quoteNumber + bldgAlpha[index].trim(),
      {
        create: false,
      }
    );

    const windSpeedService = (state.windLoad * 0.65132156).toFixed(4);

    const thermalFactor = state.thermalFactor
      ? formatNumericValue(state.thermalFactor)
      : '';

    const snowFactor = state.snowFactor
      ? formatNumericValue(state.snowFactor)
      : '';
    const seismicFa = state.seismicFa
      ? formatNumericValue(state.seismicFa, 3)
      : '';
    const seismicFv = state.seismicFv
      ? formatNumericValue(state.seismicFv, 3)
      : '';
    const seismicSms = state.seismicSms
      ? formatNumericValue(state.seismicSms, 3)
      : '';
    const seismicSm1 = state.seismicSm1
      ? formatNumericValue(state.seismicSm1, 3)
      : '';
    const seismicSds = state.seismicSds
      ? formatNumericValue(state.seismicSds, 3)
      : '';
    const seismicSd1 = state.seismicSd1
      ? formatNumericValue(state.seismicSd1, 3)
      : '';

    let averagePeak = getAverageHeight(state.buildings[index]);
    let taMoment = (0.028 * Math.pow(averagePeak, 0.8)).toFixed(4);
    let taBrace = (0.02 * Math.pow(averagePeak, 0.75)).toFixed(4);

    const desLoadHandle = await newBuildingHandle.getFileHandle('desload.txt', {
      create: true,
    });
    const writable = await desLoadHandle.createWritable();
    await writable.write(`[BUILDING]\n`);
    await writable.write(
      `Occupancy_Category=${riskLabels[state.riskCategory]}\n`
    );
    await writable.write(`[BUILDING_CODE]\n`);
    await writable.write(`Database=${codes[state.buildingCode]}\n`);
    await writable.write(`User=${codes[state.buildingCode]}\n`);
    await writable.write(`CITY=${state.projectCity}\n`);
    await writable.write(`COUNTY=${state.projectCounty}\n`);
    await writable.write(`State=${state.projectState}\n`);
    await writable.write(`Interpolate=FALSE\n`);
    await writable.write(`[WIND]\n`);
    await writable.write(`Serviceability_Year_MRI=10 -year MRI\n`);
    await writable.write(`Wind_Speed_Serviceability=${windSpeedService}\n`);
    await writable.write(`Special_Wind_Region=0\n`);
    await writable.write(`[Climate]\n`);
    await writable.write(`Building_Elevation=${state.projectElevation}\n`);
    await writable.write(`[SNOW]\n`);
    await writable.write(`Thermal_Coefficient=${thermalFactor}\n`);
    await writable.write(
      `Ground=${formatNumericValue(state.groundSnowLoad, 1)}\n`
    );
    await writable.write(`Importance=${formatNumericValue(snowFactor, 4)}\n`);
    await writable.write(`Status=F\n`);
    await writable.write(`[SEISMIC]\n`);
    await writable.write(`Status=T\n`);
    await writable.write(`Ss=${state.seismicSs}\n`);
    await writable.write(`S1=${state.seismicS1}\n`);
    await writable.write(`Site_Class=${state.seismicSite}\n`);
    await writable.write(`Fa=${seismicFa}\n`);
    await writable.write(`Fv=${seismicFv}\n`);
    await writable.write(`Sms=${seismicSms}\n`);
    await writable.write(`Sm1=${seismicSm1}\n`);
    await writable.write(`Sds=${seismicSds}\n`);
    await writable.write(`Sd1=${seismicSd1}\n`);
    await writable.write(`Period_Moment=${taMoment}\n`);
    await writable.write(`Period_Brace=${taBrace}\n`);
    await writable.write(`[RAIN]\n`);
    await writable.write(`Intensity=${fiveYear}\n`);
    await writable.write(`Intensity_25=${twentyFiveYear}\n`);
    await writable.write(`[ZIP]\n`);
    await writable.write(`Code=${state.projectZip}\n`);
    await writable.close();
    const desLoadFile = await desLoadHandle.getFile();
    return desLoadFile;
  }

  async function createDesCtrl(rootHandle, index = 0) {
    const walls = {
      1: 'left',
      2: 'front',
      3: 'right',
      4: 'back',
    };

    const codes = {
      ibc21: 'IBC_21',
      ibc18: 'IBC_18',
      ibc15: 'IBC_15',
      ibc12: 'IBC_12',
      ossc22: 'IBC_21',
      ossc19: 'IBC_18',
      cbc22: 'IBC_21',
      cbc19: 'IBC_18',
    };

    const bldgBuildingCode = {
      ibc21:
        'Code=IBC' +
        '\n' +
        'Design_Type=WS' +
        '\n' +
        'Year=21' +
        '\n' +
        'Hot_Version=AISC16' +
        '\n' +
        'Cold_Version=NAUS16' +
        '\n' +
        'Exposure=' +
        state.exposure +
        '\n' +
        'Country=----' +
        '\n' +
        'Local=IBC  21' +
        '\n' +
        'FileName=IBC.21' +
        '\n' +
        'Closure=' +
        state.windEnclosure +
        '\n' +
        'Zone=' +
        state.seismicCategory +
        '\n' +
        'Import_Seis=' +
        state.seismicFactor +
        '\n' +
        'Import_Wind=1.0000' +
        '\n' +
        'Col_Wind_LEW=Y' +
        '\n' +
        'Col_Wind_REW=Y' +
        '\n' +
        'Col_Wind_FSW=Y' +
        '\n' +
        'Col_Wind_BSW=Y',
      ibc18:
        'Code=IBC' +
        '\n' +
        'Design_Type=WS' +
        '\n' +
        'Year=18' +
        '\n' +
        'Hot_Version=AISC16' +
        '\n' +
        'Cold_Version=NAUS16' +
        '\n' +
        'Exposure=' +
        state.exposure +
        '\n' +
        'Country=----' +
        '\n' +
        'Local=IBC  18' +
        '\n' +
        'FileName=IBC.18' +
        '\n' +
        'Closure=' +
        state.windEnclosure +
        '\n' +
        'Zone=' +
        state.seismicCategory +
        '\n' +
        'Import_Seis=' +
        state.seismicFactor +
        '\n' +
        'Import_Wind=1.0000' +
        '\n' +
        'Col_Wind_LEW=Y' +
        '\n' +
        'Col_Wind_REW=Y' +
        '\n' +
        'Col_Wind_FSW=Y' +
        '\n' +
        'Col_Wind_BSW=Y',
      ibc15:
        'Code=IBC' +
        '\n' +
        'Design_Type=WS' +
        '\n' +
        'Year=15' +
        '\n' +
        'Hot_Version=AISC10' +
        '\n' +
        'Cold_Version=NAUS12' +
        '\n' +
        'Exposure=' +
        state.exposure +
        '\n' +
        'Country=----' +
        '\n' +
        'Local=IBC  15' +
        '\n' +
        'FileName=IBC.15' +
        '\n' +
        'Closure=' +
        state.windEnclosure +
        '\n' +
        'Zone=' +
        state.seismicCategory +
        '\n' +
        'Import_Seis=' +
        state.seismicFactor +
        '\n' +
        'Import_Wind=1.0000' +
        '\n' +
        'Col_Wind_LEW=Y' +
        '\n' +
        'Col_Wind_REW=Y' +
        '\n' +
        'Col_Wind_FSW=Y' +
        '\n' +
        'Col_Wind_BSW=Y',
      ossc22:
        'Code=IBC' +
        '\n' +
        'Design_Type=WS' +
        '\n' +
        'Year=21' +
        '\n' +
        'Hot_Version=AISC16' +
        '\n' +
        'Cold_Version=NAUS16' +
        '\n' +
        'Exposure=' +
        state.exposure +
        '\n' +
        'Country=----' +
        '\n' +
        'Local=OSSC 22' +
        '\n' +
        'FileName=OR_OSSC.22' +
        '\n' +
        'Closure=' +
        state.windEnclosure +
        '\n' +
        'Zone=' +
        state.seismicCategory +
        '\n' +
        'Import_Seis=' +
        state.seismicFactor +
        '\n' +
        'Import_Wind=1.0000' +
        '\n' +
        'Col_Wind_LEW=Y' +
        '\n' +
        'Col_Wind_REW=Y' +
        '\n' +
        'Col_Wind_FSW=Y' +
        '\n' +
        'Col_Wind_BSW=Y',
      ossc19:
        'Code=IBC' +
        '\n' +
        'Design_Type=WS' +
        '\n' +
        'Year=18' +
        '\n' +
        'Hot_Version=AISC16' +
        '\n' +
        'Cold_Version=NAUS16' +
        '\n' +
        'Exposure=' +
        state.exposure +
        '\n' +
        'Country=----' +
        '\n' +
        'Local=OSSC 19' +
        '\n' +
        'FileName=OR_OSSC.19' +
        '\n' +
        'Closure=' +
        state.windEnclosure +
        '\n' +
        'Zone=' +
        state.seismicCategory +
        '\n' +
        'Import_Seis=' +
        state.seismicFactor +
        '\n' +
        'Import_Wind=1.0000' +
        '\n' +
        'Col_Wind_LEW=Y' +
        '\n' +
        'Col_Wind_REW=Y' +
        '\n' +
        'Col_Wind_FSW=Y' +
        '\n' +
        'Col_Wind_BSW=Y',
      cbc22:
        'Code=IBC' +
        '\n' +
        'Design_Type=WS' +
        '\n' +
        'Year=21' +
        '\n' +
        'Hot_Version=AISC16' +
        '\n' +
        'Cold_Version=NAUS16' +
        '\n' +
        'Exposure=' +
        state.exposure +
        '\n' +
        'Country=----' +
        '\n' +
        'Local=CBC  22' +
        '\n' +
        'FileName=CA_CBC.22' +
        '\n' +
        'Closure=' +
        state.windEnclosure +
        '\n' +
        'Zone=' +
        state.seismicCategory +
        '\n' +
        'Import_Seis=' +
        state.seismicFactor +
        '\n' +
        'Import_Wind=1.0000' +
        '\n' +
        'Col_Wind_LEW=Y' +
        '\n' +
        'Col_Wind_REW=Y' +
        '\n' +
        'Col_Wind_FSW=Y' +
        '\n' +
        'Col_Wind_BSW=Y',
      cbc19:
        'Code=IBC' +
        '\n' +
        'Design_Type=WS' +
        '\n' +
        'Year=18' +
        '\n' +
        'Hot_Version=AISC16' +
        '\n' +
        'Cold_Version=NAUS16' +
        '\n' +
        'Exposure=' +
        state.exposure +
        '\n' +
        'Country=----' +
        '\n' +
        'Local=CBC  19' +
        '\n' +
        'FileName=CA_CBC.19' +
        '\n' +
        'Closure=' +
        state.windEnclosure +
        '\n' +
        'Zone=' +
        state.seismicCategory +
        '\n' +
        'Import_Seis=' +
        state.seismicFactor +
        '\n' +
        'Import_Wind=1.0000' +
        '\n' +
        'Col_Wind_LEW=Y' +
        '\n' +
        'Col_Wind_REW=Y' +
        '\n' +
        'Col_Wind_FSW=Y' +
        '\n' +
        'Col_Wind_BSW=Y',
    };

    const newBuildingHandle = await rootHandle.getDirectoryHandle(
      state.quoteNumber + bldgAlpha[index].trim(),
      {
        create: false,
      }
    );

    const desCtrlHandle = await newBuildingHandle.getFileHandle('desctrl.txt', {
      create: true,
    });
    const writable = await desCtrlHandle.createWritable();

    // Job Info
    await writable.write(`[JOB_ID]\n`);
    await writable.write(`JOB_ID=${state.quoteNumber}\n`);
    await writable.write(`VERSION=2.0000\n`);
    await writable.write(`\n`);

    // Wall and Base Options
    await writable.write(`[WALL_OPTIONS1]\n`);
    await writable.write(`${getGirtTypes(state.buildings[index], 'left')}\n`);
    await writable.write(`\n`);
    await writable.write(`[WALL_OPTIONS2]\n`);
    await writable.write(`${getGirtTypes(state.buildings[index], 'front')}\n`);
    await writable.write(`\n`);
    await writable.write(`[WALL_OPTIONS3]\n`);
    await writable.write(`${getGirtTypes(state.buildings[index], 'right')}\n`);
    await writable.write(`\n`);
    await writable.write(`[WALL_OPTIONS4]\n`);
    await writable.write(`${getGirtTypes(state.buildings[index], 'back')}\n`);
    await writable.write(`\n`);

    await writable.write(`[ROOF_OPTIONS]\n`);
    await writable.write(
      'Detail=YY' +
        '\n' +
        'Purlin=YY' +
        '\n' +
        'Panel=YY' +
        '\n' +
        'Brace=YY' +
        '\n' +
        'Angle=YY\n'
    );
    await writable.write(`\n`);

    await writable.write(`[BASE_OPTIONS]\n`);
    await writable.write(`${getGirtTypes(state.buildings[index], 'base')}\n`);
    await writable.write(`\n`);

    for (let i = 1; i <= 4; i++) {
      await writable.write(`[BASE_OPTIONS${i}]\n`);
      await writable.write(`${getGirtTypes(state.buildings[index], 'base')}\n`);
      await writable.write(`\n`);
    }

    // Steel Yield
    await writable.write(`[STEEL_YIELD]\n`);
    await writable.write(`Hot=50.0000\n`);
    await writable.write(`Cold=55.0000\n`);
    await writable.write(
      `Wall_Panel=${getPanelYield(state.buildings[index], 'wall')}\n`
    );
    await writable.write(
      `Roof_Panel=${getPanelYield(state.buildings[index], 'roof')}\n`
    );
    await writable.write(`Flange=50.0000\n`);
    await writable.write(`Web=50.0000\n`);
    await writable.write(`Ratio=1.0300\n`);
    await writable.write(`\n`);

    // Deflection Limits
    await writable.write(`[DEFLECTION_LIMITS]\n`);
    await writable.write(`EW_Col=120.0000\n`);
    await writable.write(`EW_Raf_Live=180.0000\n`);
    await writable.write(`EW_Raf_Wind=120.0000\n`);
    await writable.write(`Wall_Girt=90.0000\n`);
    await writable.write(`Purlin_Live=150.0000\n`);
    await writable.write(`Purlin_Wind=100.0000\n`);
    await writable.write(`Wall_Panel=90.0000\n`);
    await writable.write(`Roof_Panel_Live=150.0000\n`);
    await writable.write(`Roof_Panel_Wind=90.0000\n`);
    await writable.write(`Rig_Frm_Horz=60.0000\n`);
    await writable.write(`Rig_Frm_Vert=180.0000\n`);
    await writable.write(`Wind_Bent=80.0000\n`);
    await writable.write(`Rig_Frm_Crane=100.0000\n`);
    await writable.write(`Rig_Frm_Seis=${state.seismicDeflection}\n`);
    await writable.write(
      `${state.seismicDeflection < 80 ? 'Wind_Bent_Seis=80.0000' : 'Wind_Bent_Seis=' + state.seismicDeflection}\n`
    );
    await writable.write(`Purlin_Vert_Total=150.0000\n`);
    await writable.write(`EW_Raf_Vert_Total=180.0000\n`);
    await writable.write(`Rig_Frm_Vert_Total=180.0000\n`);
    await writable.write(`\n`);
    await writable.write(`[DEFLECTION_LIMIT]\n`);
    await writable.write(`Purlin_Vert_Total=150.0000\n`);
    await writable.write(`EW_Raf_Vert_Total=180.0000\n`);
    await writable.write(`Rig_Frm_Vert_Total=180.0000\n`);
    await writable.write(`Rig_Frm_Wind=120.0000\n`);
    await writable.write(`Rig_Frm_Floor=140.0000\n`);
    await writable.write(`\n`);

    // Building Code
    await writable.write(`[BUILDING_CODE]\n`);
    await writable.write(`${bldgBuildingCode[state.buildingCode]}\n`);
    await writable.write(`\n`);

    // Building Loads
    await writable.write(`[BUILDING_LOADS]\n`);
    await writable.write(
      `Dead=${state.deadLoad ? formatNumericValue(state.deadLoad) : '0.00'}\n`
    );
    await writable.write(
      `Live=${state.liveLoad ? formatNumericValue(state.liveLoad) : '0.00'}\n`
    );
    await writable.write(
      `Snow=${state.roofSnowLoad ? formatNumericValue(state.roofSnowLoad) : '0.00'}\n`
    );
    await writable.write(
      `Collateral=${state.collateralLoad ? formatNumericValue(state.collateralLoad) : '0.00'}\n`
    );
    await writable.write(`Wind_Speed=${state.windLoad}\n`);
    await writable.write(`Reduce=N\n`);
    await writable.write(`Za=${state.seismicSms || ''}\n`);
    await writable.write(`\n`);

    // Building Shape
    await writable.write(`[BUILDING_SHAPE]\n`);
    await writable.write(
      `${state.buildings[index] == 'leanTo' || state.buildings[index] == 'leanTo' ? 'Type=LT-' : 'Type=FF-'}\n`
    );
    await writable.write(`Width=${state.buildings[index].width}\n`);
    await writable.write(`Length=${state.buildings[index].length}\n`);
    await writable.write(`HeightL=${state.buildings[index].backEaveHeight}\n`);
    await writable.write(`HeightR=${state.buildings[index].frontEaveHeight}\n`);
    await writable.write(
      `PeakOff=${state.buildings[index].shape == 'leanTo' || state.buildings[index].shape == 'singleSlope' ? '0' : state.buildings[index].backPeakOffset}\n`
    );
    await writable.write(
      `Slope=${formatNumericValue(state.buildings[index].backRoofPitch, 4)}\n`
    );
    await writable.write(`\n`);

    // Expand Endwall
    await writable.write(`[EXPAND_EW1]\n`);
    await writable.write(
      `${getEndFrameTypeData(state.buildings[index], 'left')}\n`
    );

    await writable.write(`[EXPAND_EW3]\n`);
    await writable.write(
      `${getEndFrameTypeData(state.buildings[index], 'right')}\n`
    );

    // Bay Spacing
    await writable.write(`[BAY_SPACING_WALL1]\n`);
    await writable.write(
      `${formatBaySpacing(state.buildings[index].leftBaySpacing)}\n`
    );

    await writable.write(`[BAY_SPACING_WALL2]\n`);
    await writable.write(
      `${formatBaySpacing(state.buildings[index].roofBaySpacing)}\n`
    );

    await writable.write(`[BAY_SPACING_WALL3]\n`);
    await writable.write(
      `${formatBaySpacing(state.buildings[index].rightBaySpacing)}\n`
    );

    await writable.write(`[BAY_SPACING_WALL4]\n`);
    await writable.write(
      `${formatBaySpacing(state.buildings[index].roofBaySpacing)}\n`
    );

    await writable.write(`[BAY_SPACING_WALL5]\n`);
    await writable.write(
      `${formatBaySpacing(state.buildings[index].roofBaySpacing)}\n`
    );

    if (state.buildings[index].leftFrame == 'inset') {
      await writable.write(`[BAY_SPACING_WALL6]\n`);
      await writable.write(
        `${formatBaySpacing(state.buildings[index].width)}\n`
      ); //todo: I think you need to pass in array of inset wall
    }

    if (state.buildings[index].rightFrame == 'inset') {
      await writable.write(`[BAY_SPACING_WALL7]\n`);
      await writable.write(
        `${formatBaySpacing(state.buildings[index].width)}\n`
      ); //todo: I think you need to pass in array of inset wall
    }

    // Framed Openings
    // todo: set up framed openings before writing to DesCtrl.ini
    for (let i = 1; i <= 4; i++) {
      await writable.write(`[FRAMED_OPENINGS_WALL${i}]\n`);
      await writable.write(
        `${getFramedOpenings(state.buildings[index], walls[i], 0)}\n`
      );
    }

    // Endwall Framing
    await writable.write(`[ENDWALL_FRAMING1]\n`);
    await writable.write(`Corner_Col_Type=RW\n`);
    await writable.write(
      `Corner_Col_Rotate1=${getCornerColRotating(state.buildings[index], 'backLeft')}\n`
    );
    await writable.write(
      `Corner_Col_Rotate2=${getCornerColRotating(state.buildings[index], 'frontLeft')}\n`
    );

    await writable.write(`Corner_Col_Depth=0.0000\n`);
    await writable.write(`Int_Col_Type=RW\n`);
    await writable.write(`Int_Col_Depth=0.0000\n`);
    await writable.write(`Rafter_Type=RW\n`);
    await writable.write(`Rafter_Depth=0.0000\n`);
    await writable.write(`Splice_Type=F\n`);
    await writable.write(`Int_Splice_Type=-\n`);
    await writable.write(`\n`);

    await writable.write(`[ENDWALL_FRAMING3]\n`);
    await writable.write(`Corner_Col_Type=RW\n`);
    await writable.write(
      `Corner_Col_Rotate1=${getCornerColRotating(state.buildings[index], 'frontRight')}\n`
    );
    await writable.write(
      `Corner_Col_Rotate2=${getCornerColRotating(state.buildings[index], 'backRight')}\n`
    );
    await writable.write(`Corner_Col_Depth=0.0000\n`);
    await writable.write(`Int_Col_Type=RW\n`);
    await writable.write(`Int_Col_Depth=0.0000\n`);
    await writable.write(`Rafter_Type=RW\n`);
    await writable.write(`Rafter_Depth=0.0000\n`);
    await writable.write(`Splice_Type=F\n`);
    await writable.write(`Int_Splice_Type=-\n`);
    await writable.write(`\n`);

    // Base Elevation
    await writable.write(`[BASE_ELEVATION]\n`);
    await writable.write(`Left_EW=0.0000\n`);
    await writable.write(`Right_EW=0.0000\n`);
    await writable.write(`Front_SW=0.0000\n`);
    await writable.write(`Back_SW=0.0000\n`);
    await writable.write(`\n`);

    // Wall Girts
    for (let i = 1; i <= 4; i++) {
      await writable.write(`[WALL_GIRTS_WALL${i}]\n`);
      await writable.write(
        `Type=${getGirtType(state.buildings[index], walls[i])}\n`
      );
      await writable.write(`Flg_Brace_Use=Y\n`);
      await writable.write(`Flg_Brace_Supply=Y\n`);
      await writable.write(`Offset=0.0000\n`);
      await writable.write(
        `Project=${getGirtProject(state.buildings[index], walls[i])}\n`
      );
      await writable.write(`Set_Depth=8.0000\n`);
      await writable.write(`Set_Lap=0.0000\n`);
      await writable.write(`\n`);
    }

    // Wall Girt Loc
    for (let i = 1; i <= 4; i++) {
      await writable.write(`[WALL_GIRT_LOC_WALL${i}]\n`);
      await writable.write(`Low=0.0000\n`);
      await writable.write(
        `${setGirtSpacing(state.buildings[index], walls[i], state.groundLoad)}\n`
      );
    }

    // Roof Purlins
    await writable.write(`[ROOF_PURLINS_SURF2]\n`);
    await writable.write(`Type=ZB\n`);
    await writable.write(`Flg_Brace_Use=Y\n`);
    await writable.write(`Flg_Brace_Supply=Y\n`);
    await writable.write(`Offset=0.0000\n`);
    await writable.write(`Project=0.0000\n`);
    await writable.write(
      `Set_Depth=${getPurlinDepth(state.buildings[index])}\n`
    );
    await writable.write(`Set_Lap=0.0000\n`);
    await writable.write(`\n`);

    if (
      state.buildings[index].shape != 'leanTo' &&
      state.buildings[index].shape != 'singleSlope'
    ) {
      await writable.write(`[ROOF_PURLINS_SURF3]\n`);
      await writable.write(`Type=ZB\n`);
      await writable.write(`Flg_Brace_Use=Y\n`);
      await writable.write(`Flg_Brace_Supply=Y\n`);
      await writable.write(`Offset=0.0000\n`);
      await writable.write(`Project=0.0000\n`);
      await writable.write(
        `Set_Depth=${getPurlinDepth(state.buildings[index])}\n`
      );
      await writable.write(`Set_Lap=0.0000\n`);
      await writable.write(`\n`);
    }

    // Eave Struts
    await writable.write(`[EAVE_STRUT_WALL2]\n`);
    state.buildings[index].backRoofPitch > 4
      ? await writable.write(`Type=ZO\n`)
      : await writable.write(`Type=EO\n`);
    await writable.write(`\n`);

    await writable.write(`[EAVE_STRUT_WALL4]\n`);
    if (state.buildings[index].shape == 'nonSymmetrical') {
      state.buildings[index].frontRoofPitch > 4
        ? await writable.write(`Type=ZO\n`)
        : await writable.write(`Type=EO\n`);
    } else {
      state.buildings[index].backRoofPitch > 4
        ? await writable.write(`Type=ZO\n`)
        : await writable.write(`Type=EO\n`);
    }
    await writable.write(`\n`);

    // Roof Purlin Space
    await writable.write(`[ROOF_PURLIN_SPACE_SURF2]\n`);
    state.buildings[index].shape == 'singleSlope'
      ? await writable.write(`Peak_Space=0.0000\n`)
      : await writable.write(`Peak_Space=1.0000\n`);
    await writable.write(`Max_Space=5.0000\n`);
    await writable.write(
      `Set_Space=${setPurlinSpacing(state.buildings[index])}\n`
    );
    await writable.write(`${getGableExtension(state.buildings[index])}\n`);

    if (
      state.buildings[index].shape != 'leanTo' &&
      state.buildings[index].shape != 'singleSlope'
    ) {
      await writable.write(`[ROOF_PURLIN_SPACE_SURF3]\n`);
      await writable.write(`Peak_Space=1.0000\n`);
      await writable.write(`Max_Space=5.0000\n`);
      await writable.write(
        `Set_Space=${setPurlinSpacing(state.buildings[index])}\n`
      );
      await writable.write(`${getGableExtension(state.buildings[index])}\n`);
    }

    // Wall Panel
    const wallChars = ' 1234';
    for (let i = 0; i <= 4; i++) {
      await writable.write(`[WALL_PANEL${wallChars[i].trim()}]\n`);
      await writable.write(
        `Type=${getPanelType(state.buildings[index], 'wall')}\n`
      );
      await writable.write(
        `Part=${getPanelPart(state.buildings[index], 'wall')}\n`
      );
      await writable.write(
        `Gage=${getPanelGauge(state.buildings[index], 'wall')}\n`
      );
      await writable.write(
        `Yield=${getPanelYield(state.buildings[index], 'wall')}\n`
      );
      await writable.write(
        `Wall_Color=${getPanelColor(state.buildings[index], 'wall')}\n`
      );
      await writable.write(`Wall_Style=\n`);
      await writable.write(
        `Eave_Color=${getPanelColor(state.buildings[index], 'wall')}\n`
      );
      await writable.write(`Eave_Style=--\n`);
      await writable.write(
        `Corner_Color=${getPanelColor(state.buildings[index], 'wall')}\n`
      );
      await writable.write(`Corner_Style=\n`);
      await writable.write(
        `Jamb_Color=${getPanelColor(state.buildings[index], 'wall')}\n`
      );
      await writable.write(`Jamb_Style=\n`);
      await writable.write(
        `Screw_Type=${getScrewLength(state.buildings[index], 'wall')}\n`
      );
      await writable.write(`Screw_Finish=--\n`);
      await writable.write(
        `${getInsulation(state.buildings[index], 'wall')}\n`
      );
      await writable.write(`\n`);
    }

    // Roof Panel
    await writable.write(`[ROOF_PANEL]\n`);
    await writable.write(
      `Type=${getPanelType(state.buildings[index], 'roof')}\n`
    );
    await writable.write(
      `Part=${getPanelPart(state.buildings[index], 'roof')}\n`
    );
    await writable.write(
      `Gage=${getPanelGauge(state.buildings[index], 'roof')}\n`
    );
    await writable.write(
      `Yield=${getPanelYield(state.buildings[index], 'roof')}\n`
    );
    await writable.write(
      `Roof_Color=${getPanelColor(state.buildings[index], 'roof')}\n`
    );
    await writable.write(`Roof_Style=\n`);
    await writable.write(
      `Gable_Color=${getPanelColor(state.buildings[index], 'roof')}\n`
    );
    await writable.write(`Gable_Style=--\n`);
    await writable.write(
      `Screw_Type=${getScrewLength(state.buildings[index], 'roof')}\n`
    );
    await writable.write(`Screw_Finish=--\n`);
    await writable.write(`${getInsulation(state.buildings[index], 'roof')}\n`);
    await writable.write(
      `${getStandingSeamClips(state.buildings[index], 'roof', '')}\n`
    );
    await writable.write(`\n`);

    // No Frames
    await writable.write(`[NO_FRAMES]\n`);
    await writable.write(`${getRigidFrames(state.buildings[index])}\n`);

    // Wind Framing
    for (let i = 1; i <= 4; i++) {
      await writable.write(`[WIND_FRAMING_WALL${i}]\n`);
      await writable.write(`Panel_Shear=N\n`);
      await writable.write(`${getBracing(state.buildings[index], walls[i])}\n`);
      await writable.write(`Wind_Column=N\n`);
      await writable.write(`Weak_Axis_Bend=N\n`);
      if (i == 1 || i == 3) {
        await writable.write(`Brace_Option=--\n`);
        await writable.write(`Height=0.0000\n`);
      }
      await writable.write(`\n`);
    }

    await writable.write(`[WIND_FRAMING_ROOF]\n`);
    await writable.write(`Panel_Shear=N\n`);
    await writable.write(`${getBracing(state.buildings[index], 'roof')}\n`);
    await writable.write(`\n`);

    await writable.write(`[WIND_FRAMING_INT]\n`);
    await writable.write(`${getBracing(state.buildings[index], 'interior')}\n`);
    await writable.write(`Wind_Column=N\n`);
    await writable.write(`Weak_Axis_Bend=N\n`);
    await writable.write(`\n`);

    // Wind Bracing
    for (let i = 1; i <= 4; i++) {
      await writable.write(`[WIND_BRACING_WALL${i}]\n`);
      await writable.write(
        `${getXBracingBays(state.buildings[index], walls[i])}\n`
      );
    }

    await writable.write(`[WIND_BRACING_ROOF]\n`);
    await writable.write(
      `${getXBracingBays(state.buildings[index], 'roof')}\n`
    );

    // Wind Bents
    for (let i = 1; i <= 4; i++) {
      await writable.write(`[WIND_BENT_WALL${i}]\n`);
      if (i == 2 || i == 4) {
        await writable.write(
          `${getPortalBays(state.buildings[index], walls[i])}\n`
        );
      } else {
        await writable.write(`No_Bays=0\n`);
        await writable.write(`\n`);
      }
    }

    for (let i = 1; i <= 4; i++) {
      await writable.write(`[WIND_COLUMN_WALL${i}]\n`);
      await writable.write(`No_Bays=0\n`);
      await writable.write(`\n`);
    }

    // Eave Extensions
    await writable.write(`[EAVE_EXTENSION_WALL2]\n`);
    await writable.write(
      `${await getEaveExtension(state.buildings[index], 'front', state.projectZip)}\n`
    );
    await writable.write(`[EAVE_EXTENSION_WALL4]\n`);
    await writable.write(
      `${await getEaveExtension(state.buildings[index], 'back', state.projectZip)}\n`
    );

    // Gutters
    await writable.write(`[GUTTER_DOWNSPOUTS]\n`);
    await writable.write(
      `${await getDownspouts(state.buildings[index], state.projectZip)}\n`
    );
    await writable.write(`[GUTTERS]\n`);
    await writable.write(
      `${await getGutters(state.buildings[index], state.projectZip)}\n`
    );
    // Relites
    await writable.write(`[WALL_LIGHT_PANELS]\n`);
    await writable.write(`${getRelites(state.buildings[index], 'Wall')}\n`);
    await writable.write(`[ROOF_LIGHT_PANELS]\n`);
    await writable.write(`${getRelites(state.buildings[index], 'Roof')}\n`);

    // Doors
    await writable.write(`[DOORS]\n`);
    await writable.write(`${getMandoors()}\n`);
    await writable.write(`\n`);
    // Accessories
    await writable.write(`[ADDITIONAL_ITEMS]\n`);
    await writable.write(`No_Add=0\n`);
    await writable.write(`\n`);

    await writable.write(`[ACCESSORY_ITEMS]\n`);
    await writable.write(`${getAccessories(state.buildings[index])}\n`);
    await writable.write(`\n`);

    await writable.write(`${setLinerPanels(state.buildings[index])}\n`);

    // Properties Walls
    await writable.write(`[NO_PROPERTIES_WALL]\n`);
    await writable.write(`Number=4\n`);
    await writable.write(`\n`);

    for (let i = 1; i <= 4; i++) {
      await writable.write(`[PROPERTIES_WALL${i}]\n`);
      await writable.write(
        `${getWallLoads(state.buildings[index], walls[i])}\n`
      );
    }

    // Cranes
    await writable.write(`[CRANES]\n`);
    await writable.write(`No_Crane=0\n`);
    await writable.write(`\n`);

    // Est Items
    await writable.write(`[ESTIMATE_ITEMS]\n`);
    await writable.write(`${getCoverAccessories()}\n`);
    // Canopies
    for (let i = 1; i <= 4; i++) {
      await writable.write(`[CANOPY_WALL${i}]\n`);
      await writable.write(
        `${setCanopies(state.buildings[index], walls[i])}\n`
      );
    }

    // Additional Loads
    await writable.write(`[ADDITIONAL_LOADS]\n`);
    await writable.write(`${getAdditionalLoads(index)}\n`);
    await writable.write(`\n`);

    // Facia
    await writable.write(`[LOAD_FACIA]\n`);
    await writable.write(`Dead=2.5000\n`);
    await writable.write(`Live_SW=${state.roofSnowLoad * 2}\n`);
    await writable.write(`Live_EW=${state.roofSnowLoad * 2}\n`);
    await writable.write(`\n`);

    await writable.write(`[DEFLECT_FACIA]\n`);
    await writable.write(`Attach_Live=90.0000\n`);
    await writable.write(`Attach_Wind=60.0000\n`);
    await writable.write(`Attach_Total=90.0000\n`);
    await writable.write(`Purlin_Live=75.0000\n`);
    await writable.write(`Purlin_Wind=50.0000\n`);
    await writable.write(`Purlin_Total=75.0000\n`);
    await writable.write(`Facia_Arm=90.0000\n`);
    await writable.write(`Facia_Panel=90.0000\n`);
    await writable.write(`Facia_Girt=90.0000\n`);
    await writable.write(`\n`);

    await writable.write(`[FACIA_EXTENSION]\n`);
    await writable.write(`No_Facia=0\n`);
    await writable.write(`\n`);

    // Partitions
    await writable.write(`[PARTITION_DEFLECT]\n`);
    await writable.write(`Wind_Speed=5.0000\n`);
    await writable.write(`Col=120.0000\n`);
    await writable.write(`Girt=120.0000\n`);
    await writable.write(`Panel=120.0000\n`);
    await writable.write(`\n`);

    await writable.write(`[NO_PARTITION_WALL]\n`);
    await writable.write(`${getPartitions(state.buildings[index])}\n`);

    await writable.write(`[NO_PARTITION_INTERSECT]\n`);
    await writable.write(`No_Partition_Intersect=0\n`);
    await writable.write(`\n`);

    // Soldier Columns
    await writable.write(`[SOLDIER_BAY_SPACING_WALL2]\n`);
    await writable.write(`No_Sets=0\n`);
    await writable.write(`\n`);

    await writable.write(`[SOLDIER_BAY_SPACING_WALL4]\n`);
    await writable.write(`No_Sets=0\n`);
    await writable.write(`\n`);

    await writable.write(`[SOLDIER_FRAMING_WALL2]\n`);
    await writable.write(`Col_Type=--\n`);
    await writable.write(`Col_Depth=0.0000\n`);
    await writable.write(`Col_Option=-\n`);
    await writable.write(`Raf_Type=--\n`);
    await writable.write(`Raf_Depth=0.0000\n`);
    await writable.write(`Raf_Option=-\n`);
    await writable.write(`Brace_Type=N\n`);
    await writable.write(`Brace_Loc=0.0000\n`);
    await writable.write(`\n`);

    await writable.write(`[SOLDIER_FRAMING_WALL4]\n`);
    await writable.write(`Col_Type=--\n`);
    await writable.write(`Col_Depth=0.0000\n`);
    await writable.write(`Col_Option=-\n`);
    await writable.write(`Raf_Type=--\n`);
    await writable.write(`Raf_Depth=0.0000\n`);
    await writable.write(`Raf_Option=-\n`);
    await writable.write(`Brace_Type=N\n`);
    await writable.write(`Brace_Loc=0.0000\n`);
    await writable.write(`\n`);

    // Crane Systems
    await writable.write(`[NO_CRANE_SYSTEM]\n`);
    await writable.write(`No_Crane_Sys=0\n`);
    await writable.write(`\n`);

    await writable.write(`[NO_SYSTEM_CRANE]\n`);
    await writable.write(`No_Sys_Crane=0\n`);
    await writable.write(`\n`);

    // Wide Openings
    await writable.write(`[NO_WIDE_OPENING]\n`);
    await writable.write(`${getWideOpenings(state.buildings[index])}\n`);
    await writable.write(`\n`);

    await writable.write(`[NO_WIDE_EW_OPENING]\n`);
    await writable.write(`${getWideEWOpenings(state.buildings[index])}\n`);
    await writable.write(`\n`);

    // User Purlins
    await writable.write(`[USER_PURLINS_SURF2]\n`);
    await writable.write(`No_Sets=0\n`);
    await writable.write(`\n`);
    await writable.write(`[USER_PURLINS_SURF3]\n`);
    await writable.write(`No_Sets=0\n`);
    await writable.write(`\n`);

    // Jack Beams
    await writable.write(`[JACK_BEAMS]\n`);
    await writable.write(`No_Jack_Beams=0\n`);
    await writable.write(`\n`);

    // Partial Walls
    for (let i = 1; i <= 4; i++) {
      await writable.write(`[PARTIAL_WALLS_WALL${i}]\n`);
      await writable.write(
        `${setPartialWalls(state.buildings[index], walls[i])}\n`
      );
    }

    // Wainscot Walls
    for (let i = 1; i <= 4; i++) {
      await writable.write(`[WAINSCOT_WALL${i}]\n`);
      await writable.write(
        `${setWainscot(state.buildings[index], walls[i])}\n`
      );
    }
    // Floor
    await writable.write(`[FLOOR_VERSION]\n`);
    await writable.write(`Version=1.06\n`);
    await writable.write(`\n`);

    // Floor Layout
    await writable.write(`[FLOOR_LAYOUT]\n`);
    await writable.write(`${getMezzanines(state.buildings[index])}\n`);
    // Close and Save File
    await writable.close();
    const desCtrlFile = await desCtrlHandle.getFile();
    return desCtrlFile;
  }

  // ! Building translation functions
  function getGirtTypes(building, wall) {
    let returnValue = '';
    if (wall == 'base') {
      // todo: add all base conditions
      switch (building.leftBaseCondition) {
        case 'angle':
          returnValue =
            'Angle=Y' +
            '\n' +
            'Channel=N' +
            '\n' +
            'Seal=N' +
            '\n' +
            'Color=' +
            getPanelColor(building, 'wall') +
            '\n' +
            'Style=' +
            '\n' +
            'Angle_Seal=N';
          break;
        case 'cee':
          returnValue =
            'Angle=N' +
            '\n' +
            'Channel=Y' +
            '\n' +
            'Seal=N' +
            '\n' +
            'Color=' +
            getPanelColor(building, 'wall') +
            '\n' +
            'Style=' +
            '\n' +
            'Angle_Seal=N';
          break;
        default:
          returnValue =
            'Angle=N' +
            '\n' +
            'Channel=N' +
            '\n' +
            'Seal=N' +
            '\n' +
            'Color=' +
            getPanelColor(building, 'wall') +
            '\n' +
            'Style=' +
            '\n' +
            'Angle_Seal=N';
          break;
      }
    } else {
      const girtTypeKey = `${wall}GirtType`;
      returnValue =
        building[girtTypeKey] == 'open'
          ? 'Detail=YY' +
            '\n' +
            'Girt=NN' +
            '\n' +
            'Panel=NN' +
            '\n' +
            'Brace=YY' +
            '\n' +
            'Trim=Y'
          : 'Detail=YY' +
            '\n' +
            'Girt=YY' +
            '\n' +
            'Panel=YY' +
            '\n' +
            'Brace=YY' +
            '\n' +
            'Trim=Y';
    }
    return returnValue;
  }

  // todo: handle partition walls and roofs when passed
  function getPanelYield(building, wall) {
    let returnValue = '';
    const panelTypeKey = `${wall}PanelType`;
    const panelGaugeKey = `${wall}PanelGauge`;

    returnValue = building[panelGaugeKey] < 26 ? '50.0000' : '80.0000';
    if (
      building[panelTypeKey] == 'kingSeam' ||
      building[panelTypeKey] == 'kingRib' ||
      building[panelTypeKey] == 'sr2' ||
      building[panelTypeKey] == 'hr3' ||
      building[panelTypeKey] == 'dm40' ||
      building[panelTypeKey] == 'insulated' ||
      building[panelTypeKey] == 'insulatedOthers'
    ) {
      returnValue = '50.0000';
    }
    return returnValue;
  }

  function getEndFrameTypeData(building, wall) {
    let returnValue = '';
    const frameKey = `${wall}Frame`;
    const insetKey = `${wall}Inset`;
    const intColKey = `${wall}IntColSpacing`;
    switch (building[frameKey]) {
      case 'postAndBeam':
        returnValue = 'Use=N\n' + 'Option=-\n';
        break;
      case 'insetRF':
        if (building[insetKey] > 1) {
          returnValue = 'Use=I' + building[insetKey] + '\n';
        } else {
          returnValue = 'Use=I\n';
        }
        returnValue += building[intColKey] ? 'Option=E\n' : 'Option=-\n';
        break;
      default:
        returnValue = building[intColKey]
          ? 'Use=YY\n' + 'Option=E\n'
          : 'Use=Y\n' + 'Option=-\n';
        break;
    }
    returnValue += 'Offset=' + getEndFrameOffset(building, wall) + '\n';
    return returnValue;
  }

  function getEndFrameType(building, loc) {
    let returnValue = '';
    let frameKey = `${loc}Frame`;
    let insetKey = `${loc}Inset`;

    switch (building[frameKey]) {
      case 'postAndBeam':
        returnValue = 'N';
        break;
      case 'fullLoadedRF':
      case 'expandableRF':
        returnValue = 'F';
        break;
      case 'insetRF':
        returnValue = building[insetKey];
        break;
      default:
        returnValue = 'Y';
        break;
    }

    return returnValue;
  }

  function getEndFrameOffset(building, wall) {
    let returnValue = '';
    const girtTypeKey = `${wall}GirtType`;
    returnValue = building[girtTypeKey] == 'bipass' ? '12.0000' : '4.0000';
    return returnValue;
  }

  function formatBaySpacing(spacing) {
    let returnValue = '';
    const sets = [];
    const setCounts = [];
    let currentVal = spacing[0];
    let count = 1;

    for (let i = 1; i <= spacing.length; i++) {
      if (i < spacing.length && spacing[i] === currentVal) {
        count++;
      } else {
        sets.push(currentVal);
        setCounts.push(count);
        if (i < spacing.length) {
          currentVal = spacing[i];
          count = 1;
        }
      }
    }

    returnValue += `No_Sets=${sets.length}\n`;
    for (let i = 0; i < sets.length; i++) {
      returnValue += `Width${i + 1}=${sets[i]}\n`;
      returnValue += `Number${i + 1}=${setCounts[i]}\n`;
    }

    return returnValue;
  }

  function getOpenType(openType) {
    var returnVal = '';
    returnVal = openType == 'overhead' ? '41' : returnVal;
    returnVal = openType == 'PBSdoor' ? '11' : returnVal;
    returnVal = openType == 'PBSprehung' ? '10' : returnVal;
    returnVal = openType == 'canister' ? '81' : returnVal;
    returnVal = openType == 'sliding' ? '135' : returnVal;
    returnVal = openType == 'bipass' ? '125' : returnVal;
    returnVal = openType == 'biparting' ? '125' : returnVal;
    returnVal = openType == 'window' ? '33' : returnVal;
    returnVal = openType == 'entry' ? '11' : returnVal;
    returnVal = openType == 'recessed' ? '41' : returnVal;
    returnVal = openType == 'commercialwindow' ? '33' : returnVal;
    returnVal = openType == 'commercialentry' ? '11' : returnVal;
    returnVal = openType == 'louver' ? '73' : returnVal;
    returnVal = openType == 'openbay' ? '04' : returnVal;

    return returnVal;
  }

  function getOpenPanel(openType) {
    var returnVal = '';
    returnVal = openType == 'overhead' ? 'Y' : returnVal;
    returnVal = openType == 'PBSdoor' ? 'F' : returnVal;
    returnVal = openType == 'PBSprehung' ? 'F' : returnVal;
    returnVal = openType == 'canister' ? 'Y' : returnVal;
    returnVal = openType == 'sliding' ? 'N' : returnVal;
    returnVal = openType == 'bipass' ? 'N' : returnVal;
    returnVal = openType == 'biparting' ? 'N' : returnVal;
    returnVal = openType == 'window' ? 'F' : returnVal;
    returnVal = openType == 'entry' ? 'F' : returnVal;
    returnVal = openType == 'recessed' ? 'Y' : returnVal;
    returnVal = openType == 'commercialwindow' ? 'Y' : returnVal;
    returnVal = openType == 'commercialentry' ? 'Y' : returnVal;
    returnVal = openType == 'louver' ? 'F' : returnVal;
    returnVal = openType == 'openbay' ? 'Y' : returnVal;

    return returnVal;
  }

  function getWallHtForJamb(building, loc, partIndex, bay, offset, width) {
    let jambHt = 0;
    let spacingKey = `${loc}BaySpacing`;
    const { roofBaySpacing, partialWalls, partitions } = building;
    let bays = [];

    if (loc == 'partition') {
      bays = partitions[partIndex].baySpacing;
    } else {
      bays =
        loc == 'front' || loc == 'back' ? roofBaySpacing : building[spacingKey];
      bays = loc == 'back' ? Array.from(bays).reverse() : bays;
    }

    for (let i = 0; i < partialWalls.length; i++) {
      if (
        partialWalls[i].wall == loc ||
        partialWalls[i].wall == loc + partIndex
      ) {
        if (bay == 1) {
          if (
            offset >= partialWalls[i].start &&
            offset + width <= partialWalls[i].end
          ) {
            jambHt =
              partialWalls[i].height * 12 > jambHt
                ? partialWalls[i].height * 12
                : jambHt;
          }
        } else {
          if (
            bays[bay - 2] + offset >= partialWalls[i].start &&
            bays[bay - 2] + offset + width <= partialWalls[i].end
          ) {
            jambHt =
              partialWalls[i].height * 12 > jambHt
                ? partialWalls[i].height * 12
                : jambHt;
          }
        }
      }
    }
    jambHt = jambHt >= 12 ? 0 : jambHt;

    return jambHt;
  }

  function getFramedOpenings(building, loc, partIndex) {
    let returnValue = '';
    let eaveKey = `${loc}EaveHeight`;
    const { openings } = building;
    let itemNum = 0;

    // todo: add additional if statements
    if (loc == 'partition') {
      loc = `partition${partIndex}`;
    }

    openings[loc].forEach((opening, index) => {
      itemNum = index + 1;
      const { bay, openType, width, height, sill, offset } = opening;
      returnValue += `Bay_Id${itemNum}=${bay}\n`;
      returnValue += `Width${itemNum}=${width}\n`;
      returnValue += `Height${itemNum}=${height + sill}\n`;
      returnValue += `Offset${itemNum}=${offset}\n`;
      if (
        openType == 'overhead' &&
        (loc == 'front' || loc == 'back') &&
        building[eaveKey] - height <= 3
      ) {
        returnValue += `Type${itemNum}=42\n`;
      } else {
        returnValue += `Type${itemNum}=${getOpenType(openType)}\n`;
      }
      returnValue += `Sill${itemNum}=${sill}\n`;
      returnValue += `Panel${itemNum}=${getOpenPanel(openType)}\n`;

      returnValue += `Elev${itemNum}=${getWallHtForJamb(building, loc, partIndex, bay, offset, width)}\n`;
    });

    if (loc == 'front' || loc == 'back') {
      // This is for Hangar doors when we add them
    }

    return `Number=${itemNum}\n` + returnValue;
  }

  function getCornerColRotating(building, corner) {
    let returnValue = '-';
    const {
      leftBaySpacing,
      rightBaySpacing,
      roofBaySpacing,
      frontBracingType,
      backBracingType,
      leftBracingType,
      rightBracingType,
      frontBracedBays,
      backBracedBays,
      leftBracedBays,
      rightBracedBays,
      roofBracedBays,
    } = building;

    if (
      (corner == 'backLeft' || corner == 'frontLeft') &&
      building.leftFrame != 'postAndBeam'
    ) {
      return returnValue;
    }
    if (
      (corner == 'frontRight' || corner == 'backRight') &&
      building.rightFrame != 'postAndBeam'
    ) {
      return returnValue;
    }

    let baysBracedLeft = leftBracingType != 'none' ? leftBracedBays : [0];
    let baysBracedFront =
      frontBracingType != 'torsional' ? frontBracedBays : [0];
    let baysBracedRight = rightBracingType != 'none' ? rightBracedBays : [0];
    let baysBracedBack = backBracingType != 'torsional' ? backBracedBays : [0];

    // Portal Frames
    if (
      corner == 'backLeft' &&
      baysBracedBack[baysBracedBack.length - 1] == roofBaySpacing.length &&
      (backBracingType == 'portal' || backBracingType == 'tier')
    ) {
      return returnValue;
    }
    if (
      corner == 'frontLeft' &&
      baysBracedFront[0] == 1 &&
      (frontBracingType == 'portal' || frontBracingType == 'tier')
    ) {
      return returnValue;
    }
    if (
      corner == 'frontRight' &&
      baysBracedFront[baysBracedFront.length - 1] == roofBaySpacing.length &&
      (frontBracingType == 'portal' || frontBracingType == 'tier')
    ) {
      return returnValue;
    }
    if (
      corner == 'backRight' &&
      baysBracedBack[0] == 1 &&
      (backBracingType == 'portal' || backBracingType == 'tier')
    ) {
      return returnValue;
    }

    // X-Bracing
    if (
      corner == 'backLeft' &&
      baysBracedLeft[0] == 1 &&
      baysBracedBack[baysBracedBack.length - 1] != roofBaySpacing.length
    ) {
      returnValue = 'N';
    }
    if (
      corner == 'frontLeft' &&
      baysBracedFront[0] != 1 &&
      baysBracedLeft[baysBracedLeft.length - 1] == leftBaySpacing.length
    ) {
      returnValue = 'N';
    }
    if (
      corner == 'frontRight' &&
      baysBracedRight[0] == 1 &&
      baysBracedFront[baysBracedFront.length - 1] != roofBaySpacing.length
    ) {
      returnValue = 'N';
    }

    if (
      corner == 'backRight' &&
      baysBracedBack[0] != 1 &&
      baysBracedRight[baysBracedRight.length - 1] == rightBaySpacing.length
    ) {
      returnValue = 'N';
    }

    if (overheadDoorInCornerBay(building, corner)) {
      returnValue = 'N';
    }

    return returnValue;
  }

  function overheadDoorInCornerBay(building, corner) {
    const { roofBaySpacing, openings } = building;
    let wall =
      corner == 'frontLeft' || corner == 'frontRight' ? 'front' : 'back';

    const wallOpenings = openings[wall];

    if (!wallOpenings && wallOpenings.length === 0) return false;

    return wallOpenings.some((opening) => {
      const conditions =
        opening.openType === 'overhead' &&
        opening.offset < opening.height + opening.sill;

      if (corner == 'frontRight' || corner == 'backLeft') {
        return conditions && opening.bay == roofBaySpacing.length;
      }

      return conditions && opening.bay == 1;
    });
  }

  function getGirtType(building, wall) {
    let returnValue = '';
    let girtWallKey = `${wall}GirtType`;
    returnValue = building[girtWallKey] == 'bipass' ? 'ZB' : 'ZF';
    return returnValue;
  }

  function getGirtProject(building, wall) {
    let returnValue = '';
    let girtWallKey = `${wall}GirtType`;
    returnValue = building[girtWallKey] == 'projected' ? '1.0000' : '0.0000';
    return returnValue;
  }

  function setGirtSpacing(building, wall, groundLoad) {
    let returnValue = '';
    let girtSpacingKey = `${wall}GirtSpacing`;
    const {
      width,
      shape,
      backPeakOffset,
      backEaveHeight,
      frontEaveHeight,
      backRoofPitch,
      frontRoofPitch,
      leftBaseCondition, // todo: add all base conditions
      roofSnowLoad,
      frontPolyQty,
      backPolyQty,
      leftPolyQty,
      rightPolyQty,
      frontPolySize,
      backPolySize,
      leftPolySize,
      rightPolySize,
    } = building;

    let girtType = wall == 'left' || wall == 'right' ? 'S' : 'P';
    girtType =
      building[girtSpacingKey] == 'twoFoot' ||
      building[girtSpacingKey] == 'fourFoot' ||
      building[girtSpacingKey] == 'fullPly'
        ? 'Y'
        : girtType;

    let numGirts = 0;
    let interval = 0;
    let highestPt = 0;
    let highestBldgPt = 0;
    let reliteHt = [0, 0, 0, 0];

    if (wall == 'back') {
      highestPt = backEaveHeight;
    }
    if (wall == 'front') {
      shape == 'symmetrical'
        ? (highestPt = backEaveHeight)
        : (highestPt = frontEaveHeight);
    }

    if (shape == 'symmetrical') {
      highestBldgPt = ((width / 2) * backRoofPitch) / 12 + backEaveHeight;
    } else if (shape == 'nonSymmetrical') {
      highestBldgPt = (backPeakOffset * backRoofPitch) / 12 + backEaveHeight;
    } else {
      highestBldgPt = frontEaveHeight;
    }

    if (wall == 'left' || wall == 'right') {
      highestPt = highestBldgPt;
    }

    highestPt = Math.floor(highestPt);
    highestBldgPt = Math.floor(highestBldgPt);

    // Keep girts out of the purlin and rafter space
    highestPt -= wall == 'left' || wall == 'right' ? 1.5 : 0.8333;
    highestBldgPt -= 1.5;

    // todo: add all base conditions
    if (leftBaseCondition == 'six') {
      numGirts++;
      returnValue += `Loc${numGirts}=0.5\n`;
    }

    if (building[girtSpacingKey] == 'twoFoot') {
      interval = 2;
    } else if (building[girtSpacingKey] == 'fourFoot') {
      interval = 4;
    } else if (building[girtSpacingKey] == 'fullPly') {
      interval = 4;
    } else {
      if (building[girtSpacingKey] == 'eightPly') {
        numGirts++;
        returnValue += `Loc${numGirts}=3.8958\n`;
      } else if (groundLoad >= 50 || roofSnowLoad >= 35) {
        numGirts++;
        returnValue += `Loc${numGirts}=4.0000\n`;
      }
      numGirts++;
      returnValue += `Loc${numGirts}=7.5000\n`;

      // Add relite girt
      if (wall == 'front' && frontPolyQty) {
        numGirts++;
        returnValue += `Loc${numGirts}=${frontEaveHeight - frontPolySize + 0.1667}\n`;
      } else if (wall == 'back' && backPolyQty) {
        numGirts++;
        returnValue += `Loc${numGirts}=${backEaveHeight - backPolySize + 0.1667}\n`;
      }
    }

    if (interval > 0) {
      let i = interval;

      if (building[girtSpacingKey] == 'fullPly') {
        numGirts++;
        returnValue += `Loc${numGirts}=3.8958\n`;
        i = 7.8958;
      }

      if (frontPolyQty || backPolyQty || leftPolyQty || rightPolyQty) {
        reliteHt[0] = backPolyQty ? backEaveHeight - backPolySize + 0.1667 : 0;
        reliteHt[1] = frontPolyQty
          ? frontEaveHeight - frontPolySize + 0.1667
          : 0;
        if (backEaveHeight < frontEaveHeight) {
          reliteHt[2] = leftPolyQty
            ? backEaveHeight - leftPolySize + 0.1667
            : 0;
          reliteHt[3] = rightPolyQty
            ? backEaveHeight - rightPolySize + 0.1667
            : 0;
        } else {
          reliteHt[2] = leftPolyQty
            ? frontEaveHeight - leftPolySize + 0.1667
            : 0;
          reliteHt[3] = rightPolyQty
            ? frontEaveHeight - rightPolySize + 0.1667
            : 0;
        }
        reliteHt.sort();
      }

      while (i < highestPt) {
        numGirts++;
        returnValue += `Loc${numGirts}=${formatNumericValue(i, 4)}\n`;

        // Add relite girt
        if (i < reliteHt[0] && i + interval > reliteHt[0]) {
          i = reliteHt[0];
        } else if (i < reliteHt[1] && i + interval > reliteHt[1]) {
          i = reliteHt[1];
        } else if (i < reliteHt[2] && i + interval > reliteHt[2]) {
          i = reliteHt[2];
        } else if (i < reliteHt[3] && i + interval > reliteHt[3]) {
          i = reliteHt[3];
        } else {
          i += interval;
        }
      }
    }

    return `Set_Loc=${girtType}\n` + `No_Rows=${numGirts}\n` + returnValue;
  }

  function getPurlinDepth(building) {
    const { roofPanelType, roofInsulation } = building;
    let returnValue = '0.0000';
    let ss =
      roofPanelType == 'ssq' ||
      roofPanelType == 'ms200' ||
      roofPanelType == 'doubleLok' ||
      roofPanelType == 'ultraDek';

    if (roofInsulation == 'banded38') {
      returnValue = ss ? '0.0000' : '10.0000';
    } else if (roofInsulation == 'banded40') {
      returnValue = '10.0000';
    } else if (roofInsulation == 'banded49') {
      returnValue = ss ? '10.0000' : '12.0000';
    }

    return returnValue;
  }

  function setPurlinSpacing(building) {
    let returnValue = '0.0000';
    const { purlinSpacing } = building;
    switch (purlinSpacing) {
      case 'fourFoot':
        returnValue = '4.0000';
        break;
      case 'threeFoot':
        returnValue = '3.0000';
        break;
      case 'twoFoot':
        returnValue = '2.0000';
        break;
      default:
        break;
    }
    return returnValue;
  }

  function getGableExtension(building) {
    let returnValue = '';
    const { leftExtensionWidth, rightExtensionWidth, soffitPanelType } =
      building;

    returnValue += `Surf_Extend_Lt=${leftExtensionWidth}\n`;
    returnValue += `Surf_Extend_Rt=${rightExtensionWidth}\n`;

    if (soffitPanelType == 'none') {
      returnValue += `Soffit_Part=--------\n`;
      returnValue += `Soffit_Type=--\n`;
      returnValue += `Soffit_Color=--\n`;
      returnValue += `Soffit_Style=--\n`;
    } else {
      returnValue += `Soffit_Part=${getPanelPart(building, 'soffit')}\n`;
      returnValue += `Soffit_Type=${getPanelType(building, 'soffit')}\n`;
      returnValue += `Soffit_Color=${getPanelColor(building, 'soffit')}\n`;
      returnValue += `Soffit_Style=--\n`;
    }

    return returnValue;
  }

  function getPanelData(panel, gauge, loc) {
    let panelType = '';
    let panelPart = '';
    let panelGage = gauge;

    if (panel == 'pbr') {
      panelType = 'PBR';
      panelPart = panelGage + ' PBR';
    } else if (panel == 'pbrRev') {
      panelType = 'RPBR';
      panelPart = panelGage + ' R-PBR';
    } else if (panel == 'pbrDrip') {
      panelType = 'PBRD';
      panelPart = panelGage + ' PBRD';
    } else if (panel == 'hr34') {
      panelType = 'HR34';
      panelPart = panelGage + ' HR34';
    } else if (panel == 'ssq') {
      panelType = 'SSQ';
      panelPart = 'SSQ275';
    } else if (panel == 'ms200') {
      panelType = 'MS20';
      panelPart = 'MS-200';
    } else if (panel == 'doubleLok') {
      panelType = 'DLOK';
      panelPart = panelGage + ' DLOK';
    } else if (panel == 'ultraDek') {
      panelType = 'UDEK';
      panelPart = panelGage + ' UDEK';
    } else if (panel == 'battenLok') {
      panelType = 'BLOK';
      panelPart = panelGage + ' BLOK';
    } else if (panel == 'superLok') {
      panelType = 'SLOK';
      panelPart = panelGage + ' SLOK';
    } else if (panel == 'tuff') {
      panelType = 'TRIB';
      panelPart = panelGage + ' TRIB';
    } else if (panel == 'flat') {
      panelType = 'FLAT';
      panelGage = '26';
      panelPart = panelGage + ' FLAT';
    } else if (panel == 'corrugated') {
      panelType = 'CORR';
      panelPart = panelGage + ' CORR';
    } else if (panel == 'open' || panel == 'others') {
      panelType = 'PBR';
      panelPart = '26 PBR';
      panelGage = '26';
    }

    if (
      (loc == 'roof' || loc == 'canopyRoof') &&
      (panel == 'kingSeam' ||
        panel == 'dm40' ||
        panel == 'insulated' ||
        panel == 'insulatedOthers' ||
        panel == 'others')
    ) {
      panelType = 'DLOK';
      panelPart = '24 DLOK';
      panelGage = '24';
    } else if (
      loc == 'Wall' &&
      (panel == 'kingRib' ||
        panel == 'kingSeam' ||
        panel == 'sr2' ||
        panel == 'dm40' ||
        panel == 'insulated' ||
        panel == 'insulatedOthers')
    ) {
      panelType = 'PBR';
      panelPart = '24 PBR';
      panelGage = '24';
    }

    return [panelType, panelPart, panelGage];
  }

  function getPanelPart(building, loc) {
    let panel = '';
    let gauge = '';
    if (loc.includes('canopy')) {
      loc = loc.replace('canopy', '').toLowerCase();
    }

    if (loc == 'liner') {
      if (building.wall == 'roof') {
        loc = 'roofLiner';
      } else {
        loc = 'wallLiner';
      }
    }

    let locTypeKey = `${loc}PanelType`;
    let locGaugeKey = `${loc}PanelGauge`;

    if (loc.includes('partition')) {
      let locId = loc.split('-')[1];
      let locSide = loc.split('-')[2].toLowerCase();
      let partTypeKey = `${locSide}PanelType`;
      let partGaugeKey = `${locSide}PanelGauge`;
      panel = building.partitions[locId][partTypeKey];
      gauge = building.partitions[locId][partGaugeKey];
    } else {
      panel = building[locTypeKey];
      gauge = building[locGaugeKey];
    }
    return getPanelData(panel, gauge, loc)[1];
  }

  function getPanelType(building, loc) {
    let panel = '';
    let gauge = '';
    if (loc == 'liner') {
      if (building.wall == 'roof') {
        loc = 'roofLiner';
      } else {
        loc = 'wallLiner';
      }
    }

    let locTypeKey = `${loc}PanelType`;
    let locGaugeKey = `${loc}PanelGauge`;
    if (loc.includes('partition')) {
      let locId = loc.split('-')[1];
      let locSide = loc.split('-')[2].toLowerCase();
      let partTypeKey = `${locSide}PanelType`;
      let partGaugeKey = `${locSide}PanelGauge`;
      panel = building.partitions[locId][partTypeKey];
      gauge = building.partitions[locId][partGaugeKey];
    } else {
      panel = building[locTypeKey];
      gauge = building[locGaugeKey];
    }
    return getPanelData(panel, gauge, loc)[0];
  }

  function getPanelGauge(building, loc) {
    let panel = '';
    let gauge = '';
    if (loc == 'liner') {
      if (building.wall == 'roof') {
        loc = 'roofLiner';
      } else {
        loc = 'wallLiner';
      }
    }

    let locTypeKey = `${loc}PanelType`;
    let locGaugeKey = `${loc}PanelGauge`;
    if (loc.includes('partition')) {
      let locId = loc.split('-')[1];
      let locSide = loc.split('-')[2].toLowerCase();
      let partTypeKey = `${locSide}PanelType`;
      let partGaugeKey = `${locSide}PanelGauge`;
      panel = building.partitions[locId][partTypeKey];
      gauge = building.partitions[locId][partGaugeKey];
    } else {
      panel = building[locTypeKey];
      gauge = building[locGaugeKey];
    }
    return getPanelData(panel, gauge, loc)[2];
  }

  function getPanelColor(building, loc) {
    let returnValue = '';
    if (loc == 'liner') {
      if (building.wall == 'roof') {
        loc = 'roofLiner';
      } else {
        loc = 'wallLiner';
      }
    }

    const panelColorKey = `${loc}PanelFinish`;
    if (loc.includes('partition')) {
      let locId = loc.split('-')[1];
      let locSide = loc.split('-')[2].toLowerCase();
      let partFinishKey = `${locSide}PanelFinish`;
      returnValue =
        building.partitions[locId][partFinishKey] == 'galvalume' ? 'GV' : 'NC'; //todo: look at whether partition finish is galvalume or GV
    } else {
      returnValue = building[panelColorKey] == 'galvalume' ? 'GV' : 'NC';
    }
    return returnValue;
  }

  function getScrewLength(building, loc) {
    let returnValue = 'M';
    let insKey = `${loc}Insulation`;

    if (loc.includes('partition')) {
      let locId = loc.split('-')[1];
      returnValue =
        building.partitions[locId].insulation == 'vrr4' ||
        building.partitions[locId].insulation == 'vrr4'
          ? 'L'
          : returnValue;
    } else {
      returnValue =
        building[insKey] == 'vrr4' || building[insKey] == 'vrr6'
          ? 'L'
          : returnValue;
    }

    returnValue =
      loc == 'roof' && building[insKey].includes('banded') ? 'L' : returnValue;

    return returnValue;
  }

  function getInsulation(building, loc) {
    let returnValue =
      'Insul_Use=N' +
      '\n' +
      'Insul_Type=--' +
      '\n' +
      'Insul_Thick=0.0000' +
      '\n' +
      'Insul_Wire=N';
    let insKey = `${loc}Insulation`;
    let insOthersKey = `${loc}InsulationOthers`;

    if (!building[insOthersKey] && building[insKey] != 'none') {
      switch (building[insKey]) {
        case 'vrr2':
          returnValue =
            'Insul_Use=Y' +
            '\n' +
            'Insul_Type=PS' +
            '\n' +
            'Insul_Thick=2.0000' +
            '\n' +
            'Insul_Wire=N';
          break;
        case 'vrr3':
          returnValue =
            'Insul_Use=Y' +
            '\n' +
            'Insul_Type=PS' +
            '\n' +
            'Insul_Thick=3.0000' +
            '\n' +
            'Insul_Wire=N';
          break;
        case 'vrr4':
          returnValue =
            'Insul_Use=Y' +
            '\n' +
            'Insul_Type=PS' +
            '\n' +
            'Insul_Thick=4.0000' +
            '\n' +
            'Insul_Wire=N';
          break;
        case 'vrr6':
          returnValue =
            'Insul_Use=Y' +
            '\n' +
            'Insul_Type=PS' +
            '\n' +
            'Insul_Thick=6.0000' +
            '\n' +
            'Insul_Wire=N';
          break;
        case 'banded30':
          returnValue =
            'Insul_Use=Y' +
            '\n' +
            'Insul_Type=RB' +
            '\n' +
            'Insul_Thick=10.0000' +
            '\n' +
            'Insul_Wire=N';
          break;
        case 'banded32':
          returnValue =
            'Insul_Use=Y' +
            '\n' +
            'Insul_Type=RB' +
            '\n' +
            'Insul_Thick=10.6000' +
            '\n' +
            'Insul_Wire=N';
          break;
        case 'banded36':
          returnValue =
            'Insul_Use=Y' +
            '\n' +
            'Insul_Type=RB' +
            '\n' +
            'Insul_Thick=11.7000' +
            '\n' +
            'Insul_Wire=N';
          break;
        case 'banded38':
          returnValue =
            'Insul_Use=Y' +
            '\n' +
            'Insul_Type=RB' +
            '\n' +
            'Insul_Thick=12.5000' +
            '\n' +
            'Insul_Wire=N';
          break;
        case 'banded40':
          returnValue =
            'Insul_Use=Y' +
            '\n' +
            'Insul_Type=RB' +
            '\n' +
            'Insul_Thick=12.4000' +
            '\n' +
            'Insul_Wire=N';
          break;
        case 'banded49':
          returnValue =
            'Insul_Use=Y' +
            '\n' +
            'Insul_Type=RB' +
            '\n' +
            'Insul_Thick=15.3000' +
            '\n' +
            'Insul_Wire=N';
          break;
      }

      if (
        (loc == 'wall' || loc == 'partition') &&
        building[insKey] == 'banded25'
      ) {
        returnValue =
          'Insul_Use=Y' +
          '\n' +
          'Insul_Type=WB' +
          '\n' +
          'Insul_Thick=8.0000' +
          '\n' +
          'Insul_Wire=N';
      } else if (
        (loc == 'wall' || loc == 'partition') &&
        building[insKey] == 'banded30'
      ) {
        returnValue =
          'Insul_Use=Y' +
          '\n' +
          'Insul_Type=WB' +
          '\n' +
          'Insul_Thick=9.0000' +
          '\n' +
          'Insul_Wire=N';
      }
    }

    if (loc == 'hangar') {
      if (building[insOthersKey] || building[insKey] == 'none') {
        returnValue =
          'Insul_Type=--' +
          '\n' +
          'Insul_Thick=0.0000' +
          '\n' +
          'Insul_Wire=N' +
          '\n';
      } else if (building[insKey] == 'vrr2') {
        returnValue =
          'Insul_Type=PS' +
          '\n' +
          'Insul_Thick=2.0000' +
          '\n' +
          'Insul_Wire=N' +
          '\n';
      } else if (building[insKey] == 'vrr3') {
        returnValue =
          'Insul_Type=PS' +
          '\n' +
          'Insul_Thick=3.0000' +
          '\n' +
          'Insul_Wire=N' +
          '\n';
      } else if (building[insKey] == 'vrr4') {
        returnValue =
          'Insul_Type=PS' +
          '\n' +
          'Insul_Thick=4.0000' +
          '\n' +
          'Insul_Wire=N' +
          '\n';
      }
    }

    return returnValue;
  }

  function getStandingSeamClips(building, loc, index) {
    let returnValue = '';
    let locPanelKey = `${loc}PanelType`;
    let insKey = `${loc}Insulation`;
    const insThin = ['none', 'vrr2', 'vrr3', 'vrr4'];

    switch (building[locPanelKey]) {
      case 'ssq':
      case 'ms200':
        returnValue = insThin.includes(building[insKey])
          ? `Stand_Seam_Use${index}=Y\n` +
            `Stand_Seam_Type${index}=LO\n` +
            `Stand_Seam_Clip${index}=2.5000\n` +
            `Stand_Seam_Seam_Type${index}=---------------\n` +
            `Stand_Seam_Seam_Clamp${index}=N`
          : `Stand_Seam_Use${index}=Y\n` +
            `Stand_Seam_Type${index}=HI\n` +
            `Stand_Seam_Clip${index}=3.0000\n` +
            `Stand_Seam_Seam_Type${index}=---------------\n` +
            `Stand_Seam_Seam_Clamp${index}=N`;
        break;
      case 'doubleLok':
      case 'kingSeam':
      case 'sr2':
      case 'insulated':
      case 'insulatedOthers':
      case 'ultraDek':
        returnValue = insThin.includes(building[insKey])
          ? `Stand_Seam_Use${index}=Y\n` +
            `Stand_Seam_Type${index}=2L\n` +
            `Stand_Seam_Clip${index}=3.3800\n` +
            `Stand_Seam_Seam_Type${index}=---------------\n` +
            `Stand_Seam_Seam_Clamp${index}=N`
          : `Stand_Seam_Use${index}=Y\n` +
            `Stand_Seam_Type${index}=2H\n` +
            `Stand_Seam_Clip${index}=4.3800\n` +
            `Stand_Seam_Seam_Type${index}=---------------\n` +
            `Stand_Seam_Seam_Clamp${index}=N`;
        break;
      case 'battenLok':
      case 'superLok':
        returnValue = insThin.includes(building[insKey])
          ? `Stand_Seam_Use${index}=Y\n` +
            `Stand_Seam_Type${index}=3M\n` +
            `Stand_Seam_Clip${index}=2.380\n` +
            `Stand_Seam_Seam_Type${index}=---------------\n` +
            `Stand_Seam_Seam_Clamp${index}=N`
          : `Stand_Seam_Use${index}=Y\n` +
            `Stand_Seam_Type${index}=4M\n` +
            `Stand_Seam_Clip${index}=3.0000\n` +
            `Stand_Seam_Seam_Type${index}=---------------\n` +
            `Stand_Seam_Seam_Clamp${index}=N`;
        break;
      default:
        returnValue =
          `Stand_Seam_Use${index}=N\n` +
          `Stand_Seam_Type${index}=--\n` +
          `Stand_Seam_Clip${index}=0.0000\n` +
          `Stand_Seam_Seam_Type${index}=---------------\n` +
          `Stand_Seam_Seam_Clamp${index}=N`;
        break;
    }

    return returnValue;
  }

  function getRigidFrames(building) {
    let returnValue = '';
    let returnIntValue = '';
    const {
      shape,
      width,
      frameType,
      roofBaySpacing,
      leftBaySpacing,
      rightBaySpacing,
      leftIntColSpacing,
      rightIntColSpacing,
      intColSpacing,
      straightExtColumns,
      leftEndwallInset,
      rightEndwallInset,
    } = building;

    let numFrames = 0;
    let tribIds = '';
    let numTribs = new Array();
    let numBays = roofBaySpacing.length;
    let leftEndFrame = getEndFrameType(building, 'left');
    let rightEndFrame = getEndFrameType(building, 'right');

    const frameTypeChar = shape == 'leanTo' ? 'BC-' : 'RF-';
    const sym = shape == 'symmetrical' ? 'Y' : 'N';
    let leftShape = 'T';
    let frameShape = 'T';
    let rightShape = 'T';
    let intColShape = 'R';

    // Straight Columns
    if (straightExtColumns) {
      leftShape = 'C';
      frameShape = 'C';
      rightShape = 'C';
    }

    // Building < 40'-0"
    if (width <= 40) {
      leftShape = 'R';
      frameShape = 'R';
      rightShape = 'R';
      intColShape = 'R';
    }

    // LEW M-Frame <= 30'-0"
    if ((leftEndFrame == 'Y' || leftEndFrame == 'F') && leftIntColSpacing) {
      if (Math.max(...leftIntColSpacing) <= 30) {
        leftShape = 'R';
      }
    }

    // M-Frame <= 30
    if (frameType == 'multiSpan' && intColSpacing) {
      if (Math.max(...intColSpacing) <= 30) {
        frameShape = 'R';
      }
    }

    // REW M-Frame <= 30'-0"
    if ((rightEndFrame == 'Y' || rightEndFrame == 'F') && rightIntColSpacing) {
      if (Math.max(...rightIntColSpacing) <= 30) {
        rightShape = 'R';
      }
    }

    // Left Frame
    if (leftEndFrame != 'N') {
      numFrames++;
      if (leftEndFrame != 'Y' && leftEndFrame != 'F') {
        returnValue +=
          `[RIGID_FRAME${numFrames}]\n` +
          `Type=${frameTypeChar}\n` +
          `Width=${getTribs(building, 1)}\n` +
          `Column_Shape=${frameShape}\n` +
          `Connect_Left=P\n` +
          `Connect_Right=P\n` +
          `Rafter_Shape=${frameShape}\n` +
          `Symmetry=${sym}\n` +
          `Number=1\n` +
          `Id1=1\n\n`;

        returnIntValue +=
          `[INT_COLUMN_FRAME${numFrames}]\n` +
          `Type=${intColShape}\n` +
          `Connect_Bot=P\n` +
          `Connect_Top=P\n` +
          `Rotate=Y\n` +
          `Shape=C\n` +
          `Elev=0.0000\n` +
          `Number=0\n\n`;
      } else {
        if (leftEndFrame == 'F') {
          numTribs.length = 0;
          for (let i = 0; i <= numBays; i++) {
            numTribs.push(i + 1);
          }
          returnValue +=
            `[RIGID_FRAME${numFrames}]\n` +
            `Type=${frameTypeChar}\n` +
            `Width=${getMaxTrib(building, numTribs)}\n` +
            `Column_Shape=${leftShape}\n` +
            `Connect_Left=P\n` +
            `Connect_Right=P\n` +
            `Rafter_Shape=${leftShape}\n` +
            `Symmetry=${sym}\n` +
            `Number=1\n` +
            `Id1=1\n\n`;

          returnIntValue +=
            `[INT_COLUMN_FRAME${numFrames}]\n` +
            `Type=${intColShape}\n` +
            `Connect_Bot=P\n` +
            `Connect_Top=P\n` +
            `Rotate=Y\n` +
            `Shape=C\n` +
            `Elev=0.0000\n` +
            `${formatIntCols(leftIntColSpacing)}\n`;
        } else {
          returnValue +=
            `[RIGID_FRAME${numFrames}]\n` +
            `Type=${frameTypeChar}\n` +
            `Width=${getTribs(building, 1)}\n` +
            `Column_Shape=${leftShape}\n` +
            `Connect_Left=P\n` +
            `Connect_Right=P\n` +
            `Rafter_Shape=${leftShape}\n` +
            `Symmetry=${sym}\n` +
            `Number=1\n` +
            `Id1=1\n\n`;

          returnIntValue +=
            `[INT_COLUMN_FRAME${numFrames}]\n` +
            `Type=${intColShape}\n` +
            `Connect_Bot=P\n` +
            `Connect_Top=P\n` +
            `Rotate=Y\n` +
            `Shape=C\n` +
            `Elev=0.0000\n` +
            `${formatIntCols(leftIntColSpacing)}\n`;
        }
      }
    }

    // Left Inset Frame
    if (leftEndFrame != 'N' && leftEndFrame != 'Y' && leftEndFrame != 'F') {
      if (leftEndwallInset > 1) {
        numFrames++;
        numTribs.length = 0;
        tribIds = '';
        for (let i = 1; i < leftEndwallInset; i++) {
          numTribs.push(i + 1);
          tribIds += `Id${i}=${i + 1}\n`;
        }
        returnValue +=
          `[RIGID_FRAME${numFrames}]\n` +
          `Type=${frameTypeChar}\n` +
          `Width=${getMaxTrib(building, numTribs)}\n` +
          `Column_Shape=${frameShape}\n` +
          `Connect_Left=P\n` +
          `Connect_Right=P\n` +
          `Rafter_Shape=${frameShape}\n` +
          `Symmetry=${sym}\n` +
          `Number=${numTribs.length}\n` +
          `${tribIds}\n`;

        returnIntValue +=
          `[INT_COLUMN_FRAME${numFrames}]\n` +
          `Type=${intColShape}\n` +
          `Connect_Bot=P\n` +
          `Connect_Top=P\n` +
          `Rotate=Y\n` +
          `Shape=C\n` +
          `Elev=0.0000\n` +
          `Number=0\n\n`;
      }
      numFrames++;
      returnValue +=
        `[RIGID_FRAME${numFrames}]\n` +
        `Type=${frameTypeChar}\n` +
        `Width=${getTribs(building, leftEndwallInset + 1)}\n` +
        `Column_Shape=${leftShape}\n` +
        `Connect_Left=P\n` +
        `Connect_Right=P\n` +
        `Rafter_Shape=${leftShape}\n` +
        `Symmetry=${sym}\n` +
        `Id1=${leftEndwallInset + 1}\n\n`;

      returnIntValue +=
        `[INT_COLUMN_FRAME${numFrames}]\n` +
        `Type=${intColShape}\n` +
        `Connect_Bot=P\n` +
        `Connect_Top=P\n` +
        `Rotate=Y\n` +
        `Shape=C\n` +
        `Elev=0.0000\n` +
        `${formatIntCols(leftIntColSpacing)}\n`;
    }

    // Interior Frames
    let startInt =
      leftEndFrame != 'N' && leftEndFrame != 'Y' && leftEndFrame != 'F'
        ? leftEndwallInset + 2
        : 2;
    let endInt =
      rightEndFrame != 'N' && rightEndFrame != 'Y' && rightEndFrame != 'F'
        ? numBays - rightEndwallInset
        : numBays;

    if (startInt <= endInt) {
      numFrames++;
      numTribs.length = 0;
      tribIds = '';
      for (let i = 0; i <= endInt - startInt; i++) {
        numTribs.push(startInt + i);
        tribIds += `Id${i + 1}=${startInt + i}\n`;
      }

      returnValue +=
        `[RIGID_FRAME${numFrames}]\n` +
        `Type=${frameTypeChar}\n` +
        `Width=${getMaxTrib(building, numTribs)}\n` +
        `Column_Shape=${frameShape}\n` +
        `Connect_Left=P\n` +
        `Connect_Right=P\n` +
        `Rafter_Shape=${frameShape}\n` +
        `Symmetry=${sym}\n` +
        `Number=${numTribs.length}\n` +
        `${tribIds}\n`;

      if (frameType == 'multiSpan') {
        returnIntValue +=
          `[INT_COLUMN_FRAME${numFrames}]\n` +
          `Type=${intColShape}\n` +
          `Connect_Bot=P\n` +
          `Connect_Top=P\n` +
          `Rotate=N\n` +
          `Shape=C\n` +
          `Elev=0.0000\n` +
          `${formatIntCols(intColSpacing)}\n`;
      } else {
        returnIntValue +=
          `[INT_COLUMN_FRAME${numFrames}]\n` +
          `Type=${intColShape}\n` +
          `Connect_Bot=P\n` +
          `Connect_Top=P\n` +
          `Rotate=N\n` +
          `Shape=C\n` +
          `Elev=0.0000\n` +
          `Number=0\n\n`;
      }
    }

    // Right Inset Frame
    if (rightEndFrame != 'N' && rightEndFrame != 'Y' && rightEndFrame != 'F') {
      numFrames++;
      returnValue +=
        `[RIGID_FRAME${numFrames}]\n` +
        `Type=${frameTypeChar}\n` +
        `Width=${getTribs(building, numBays - (rightEndwallInset + 1))}\n` +
        `Column_Shape=${rightShape}\n` +
        `Connect_Left=P\n` +
        `Connect_Right=P\n` +
        `Rafter_Shape=${rightShape}\n` +
        `Symmetry=${sym}\n` +
        `Number=1\n` +
        `Id1=${numBays - (rightEndwallInset + 1)}\n\n`;

      returnIntValue +=
        `[INT_COLUMN_FRAME${numFrames}]\n` +
        `Type=${intColShape}\n` +
        `Connect_Bot=P\n` +
        `Connect_Top=P\n` +
        `Rotate=Y\n` +
        `Shape=C\n` +
        `Elev=0.0000\n` +
        `${formatIntCols(rightIntColSpacing)}\n`;

      if (rightEndwallInset > 1) {
        numFrames++;
        numTribs.length = 0;
        tribIds = '';
        for (let i = 1; i < rightEndwallInset; i++) {
          numTribs.push(numBays - rightEndwallInset + i + 1);
          tribIds += `Id${i}=${numBays - rightEndwallInset + i + 1}\n`;
        }
        returnValue +=
          `[RIGID_FRAME${numFrames}]\n` +
          `Type=${frameTypeChar}\n` +
          `Width=${getMaxTrib(building, numTribs)}\n` +
          `Column_Shape=${frameShape}\n` +
          `Connect_Left=P\n` +
          `Connect_Right=P\n` +
          `Rafter_Shape=${frameShape}\n` +
          `Symmetry=${sym}\n` +
          `Number=${numTribs.length}\n` +
          `${tribIds}\n`;

        returnIntValue +=
          `[INT_COLUMN_FRAME${numFrames}]\n` +
          `Type=${intColShape}\n` +
          `Connect_Bot=P\n` +
          `Connect_Top=P\n` +
          `Rotate=Y\n` +
          `Shape=C\n` +
          `Elev=0.0000\n` +
          `Number=0\n`;
      }
    }

    // Right Frame
    if (rightEndFrame != 'N') {
      numFrames++;
      if (rightEndFrame != 'Y' && rightEndFrame != 'F') {
        returnValue +=
          `[RIGID_FRAME${numFrames}]\n` +
          `Type=${frameTypeChar}\n` +
          `Width=${getTribs(building, numBays + 1)}\n` +
          `Column_Shape=${frameShape}\n` +
          `Connect_Left=P\n` +
          `Connect_Right=P\n` +
          `Rafter_Shape=${frameShape}\n` +
          `Symmetry=${sym}\n` +
          `Number=1\n` +
          `Id1=${numBays + 1}\n\n`;

        returnIntValue +=
          `[INT_COLUMN_FRAME${numFrames}]\n` +
          `Type=${intColShape}\n` +
          `Connect_Bot=P\n` +
          `Connect_Top=P\n` +
          `Rotate=Y\n` +
          `Shape=C\n` +
          `Elev=0.0000\n` +
          `Number=0\n`;
      } else {
        if (rightEndFrame == 'F') {
          numTribs.length = 0;
          for (let i = 0; i <= numBays; i++) {
            numTribs.push(i + 1);
          }

          returnValue +=
            `[RIGID_FRAME${numFrames}]\n` +
            `Type=${frameTypeChar}\n` +
            `Width=${getMaxTrib(building, numTribs)}\n` +
            `Column_Shape=${rightShape}\n` +
            `Connect_Left=P\n` +
            `Connect_Right=P\n` +
            `Rafter_Shape=${rightShape}\n` +
            `Symmetry=${sym}\n` +
            `Number=1\n` +
            `Id1=${numBays + 1}\n\n`;

          returnIntValue +=
            `[INT_COLUMN_FRAME${numFrames}]\n` +
            `Type=${intColShape}\n` +
            `Connect_Bot=B\n` +
            `Connect_Top=P\n` +
            `Rotate=Y\n` +
            `Shape=C\n` +
            `Elev=0.0000\n` +
            `${formatIntCols(rightIntColSpacing)}\n`;
        } else {
          returnValue +=
            `[RIGID_FRAME${numFrames}]\n` +
            `Type=${frameTypeChar}\n` +
            `Width=${getTribs(building, numBays + 1)}\n` +
            `Column_Shape=${rightShape}\n` +
            `Connect_Left=P\n` +
            `Connect_Right=P\n` +
            `Rafter_Shape=${rightShape}\n` +
            `Symmetry=${sym}\n` +
            `Number=1\n` +
            `Id1=${numBays + 1}\n\n`;

          returnIntValue +=
            `[INT_COLUMN_FRAME${numFrames}]\n` +
            `Type=${intColShape}\n` +
            `Connect_Bot=P\n` +
            `Connect_Top=P\n` +
            `Rotate=Y\n` +
            `Shape=C\n` +
            `Elev=0.0000\n` +
            `${formatIntCols(rightIntColSpacing)}\n`;
        }
      }
    }

    // Interior Columns
    returnValue = `No_Frames=${numFrames}\n\n` + returnValue + returnIntValue;
    return returnValue;
  }

  function getTribs(building, num) {
    const {
      roofBaySpacing,
      leftFrame,
      leftExtensionWidth,
      rightFrame,
      rightExtensionWidth,
    } = building;
    let returnValue = '';
    let leftSide = '';
    let rightSide = '';
    let bays = roofBaySpacing;

    if (num == 1) {
      leftSide = getEndFrameOffset(building, 'left') / 12 + leftExtensionWidth;
      if (bays.length > 1) {
        rightSide = (bays[0] - getEndFrameOffset(building, 'left') / 12) / 2;
      } else {
        if (rightFrame != 'postAndBeam') {
          rightSide =
            (bays[0] -
              getEndFrameOffset(building, 'left') / 12 -
              getEndFrameOffset(building, 'right') / 12) /
            2;
        } else {
          rightSide = (bays[0] - getEndFrameOffset(building, 'left') / 12) / 2;
        }
      }
    } else if (num == bays.length + 1) {
      rightSide =
        getEndFrameOffset(building, 'right') / 12 + rightExtensionWidth;
      if (bays.length > 1) {
        leftSide =
          (bays[bays.length - 1] - getEndFrameOffset(building, 'right') / 12) /
          2;
      } else {
        if (leftFrame != 'postAndBeam') {
          leftSide =
            (bays[0] -
              getEndFrameOffset(building, 'right') / 12 -
              getEndFrameOffset(building, 'left') / 12) /
            2;
        } else {
          leftSide = (bays[0] - getEndFrameOffset(building, 'right') / 12) / 2;
        }
      }
    } else {
      if (num == 2 && bays.length > 1) {
        if (leftFrame != 'postAndBeam') {
          leftSide = (bays[0] - getEndFrameOffset(building, 'left') / 12) / 2;
        } else {
          leftSide = bays[0] / 2;
        }
      } else {
        leftSide = bays[num - 2] / 2;
      }

      if (num == bays.length && bays.length > 1) {
        if (rightFrame != 'postAndBeam') {
          rightSide =
            (bays[num - 1] - getEndFrameOffset(building, 'right') / 12) / 2;
        } else {
          rightSide = bays[num - 1] / 2;
        }
      } else {
        rightSide = bays[num - 1] / 2;
      }
    }

    returnValue = parseFloat(leftSide) + parseFloat(rightSide);

    if (num == 2 && bays.length == 2) {
      returnValue = returnValue * 1.25;
    }

    return returnValue;
  }

  function getMaxTrib(building, frameNums) {
    let max = 0;

    for (let i = 0; i < frameNums.length; i++) {
      if (getTribs(building, frameNums[i]) > max) {
        max = getTribs(building, frameNums[i]);
      }
    }

    return max;
  }

  function formatIntCols(bays) {
    let returnValue = '';

    if (bays.length == -1) {
      return 'Number=0\n';
    }

    if (bays.length == 0) {
      returnValue = `Number=${bays.length}\n`;
    } else {
      returnValue = `Number=${bays.length - 1}\n`;
    }

    let loc = 0;
    for (let i = 0; i < bays.length - 1; i++) {
      loc += bays[i];
      returnValue += `Loc${i + 1}=${loc}\n`;
    }

    return returnValue;
  }

  function getBracing(building, loc) {
    let returnValue = 'Bracing=R';
    let braceKey = `${loc}BracingType`;
    let tierKey = `${loc}BracingHeight`;

    if (loc == 'roof') {
      return returnValue;
    }

    if (loc == 'left' || loc == 'right') {
      if (building[braceKey] == 'none') {
        returnValue = `Bracing=N\n` + `Wind_Bent=N`;
      } else if (building[braceKey] == 'xBrace') {
        returnValue = `Bracing=CR\n` + `Wind_Bent=N`;
      } else if (building[braceKey] == 'angle') {
        returnValue = `Bracing=A\n` + `Wind_Bent=N`;
      }
      return returnValue;
    }

    // if (loc == 'front' || loc == 'back' || loc == 'interior') {
    if (loc == 'front' || loc == 'back' || loc == 'interior') {
      if (building[braceKey] == 'xBrace') {
        returnValue =
          `Bracing=R\n` +
          `Wind_Bent=N\n` +
          `Brace_Option=--\n` +
          `Height=0.0000`;
      } else if (building[braceKey] == 'angle') {
        returnValue =
          `Bracing=A\n` +
          `Wind_Bent=N\n` +
          `Brace_Option=--\n` +
          `Height=0.0000`;
      } else if (building[braceKey] == 'portal') {
        returnValue =
          `Bracing=N\n` +
          `Wind_Bent=R\n` +
          `Brace_Option=--\n` +
          `Height=0.0000`;
      } else if (building[braceKey] == 'torsional') {
        returnValue =
          `Bracing=TF\n` +
          `Wind_Bent=N\n` +
          `Brace_Option=--\n` +
          `Height=0.0000`;
      } else if (building[braceKey] == 'tier') {
        returnValue =
          `Bracing=R\n` +
          `Wind_Bent=R\n` +
          `Brace_Option=XB\n` +
          `Height=${building[tierKey]}`;
      } else if (building[braceKey] == 'none') {
        returnValue =
          `Bracing=N\n` +
          `Wind_Bent=N\n` +
          `Brace_Option=--\n` +
          `Height=0.0000`;
      }
      return returnValue;
    }

    return '';
  }

  function getXBracingBays(building, loc) {
    let returnValue = '';
    let braceTypeKey = `${loc}BracingType`;
    let bracedKey = `${loc}BracedBays`;
    let bays = building[bracedKey];

    if (loc == 'roof') {
      returnValue = `No_Bays=${bays.length}\n`;
      for (let i = 0; i < bays.length; i++) {
        returnValue += `Bay${i + 1}=${bays[i]}\n`;
      }
      return returnValue;
    }

    if (loc == 'left' || loc == 'right') {
      if (building[braceTypeKey] != 'none') {
        returnValue = `No_Bays=${bays.length}\n`;
        for (let i = 0; i < bays.length; i++) {
          returnValue += `Bay${i + 1}=${bays[i]}\n`;
        }
      } else {
        returnValue = `No_Bays=0\n`;
      }
      return returnValue;
    }

    // todo: interior has not variable in state object
    // if (loc == 'front' || loc == 'back' || loc == 'interior') {
    if (loc == 'front' || loc == 'back') {
      if (
        building[braceTypeKey] != 'none' &&
        building[braceTypeKey] != 'torsional' &&
        building[braceTypeKey] != 'portal'
      ) {
        returnValue = `No_Bays=${bays.length}\n`;
        for (let i = 0; i < bays.length; i++) {
          returnValue += `Bay${i + 1}=${bays[i]}\n`;
        }
      } else {
        returnValue = `No_Bays=0\n`;
      }
      return returnValue;
    }
    return '';
  }

  function getPortalBays(building, loc) {
    let returnValue = '';
    let braceTypeKey = `${loc}BracingType`;
    let bracedKey = `${loc}BracedBays`;
    let bays = building[bracedKey];

    if (
      building[braceTypeKey] == 'portal' ||
      building[braceTypeKey] == 'tier'
    ) {
      returnValue = `No_Bays=${bays.length}\n`;
      for (let i = 0; i < bays.length; i++) {
        returnValue += `Bay${i + 1}=${bays[i]}\n`;
      }
    } else {
      returnValue = 'No_Bays=0\n';
    }
    return returnValue;
  }

  async function getEaveExtension(building, loc, zip) {
    let returnValue = '';
    const {
      shape,
      deadLoad,
      liveLoad,
      roofSnowLoad,
      backRoofPitch,
      frontRoofPitch,
      roofBaySpacing,
      leftExtensionWidth,
      rightExtensionWidth,
      frontExtensionColumns,
      backExtensionColumns,
      soffitPanelType,
      includeGutters,
    } = building;
    let extKey = `${loc}ExtensionWidth`;
    let extWidth = building[extKey];

    if (extWidth == 0) {
      return 'No_Extend=0\n';
    }

    let extData = getExtData(building, loc);

    const numOfExt = extData[0];
    let numBays = roofBaySpacing.length;
    const extStarts = extData[1].split(',');
    const extEnds = extData[2].split(',');
    const hasMultExt = extData[4] > 0 ? true : false;
    let extSlope = building.backRoofPitch;
    const frontPitch = building.frontRoofPitch;

    extSlope =
      loc == 'front' && (shape == 'singleSlope' || shape == 'leanTo')
        ? extSlope * -1
        : extSlope;
    extSlope =
      loc == 'front' && shape == 'nonSymmetrical' ? frontRoofPitch : extSlope;

    let leftDir = loc == 'front' ? leftExtensionWidth : rightExtensionWidth;
    let rightDir = loc == 'front' ? rightExtensionWidth : leftExtensionWidth;
    let numDownspouts = await calcNoDownspouts(building, loc, zip);
    let extCols = loc == 'front' ? frontExtensionColumns : backExtensionColumns;

    returnValue += `No_Extend=${numOfExt}\n`;
    for (let i = 0; i < numOfExt; i++) {
      returnValue += `Bay_Start${i + 1}=${extStarts[i]}\n`;
      returnValue += `Bay_End${i + 1}=${extEnds[i]}\n`;
      returnValue += `Bay_Width${i + 1}=${extWidth}\n`;
      returnValue += `Slope${i + 1}=${formatNumericValue(extSlope, 4)}\n`;

      if (i == 0 && extStarts[0] == 1) {
        returnValue += `Extend_Start${i + 1}=${leftDir}\n`;
      } else {
        if (extCols) {
          returnValue += `Extend_Start${i + 1}=0.3333\n`;
        } else {
          returnValue += `Extend_Start${i + 1}=0.0000\n`;
        }
      }
      if (i == numOfExt - 1 && extEnds[i] == numBays) {
        returnValue += `Extend_End${i + 1}=${rightDir}\n`;
      } else {
        if (extCols) {
          returnValue += `Extend_End${i + 1}=0.3333\n`;
        } else {
          returnValue += `Extend_End${i + 1}=0.0000\n`;
        }
      }

      if (extCols) {
        returnValue += `Purlin_Type${i + 1}=ZBEO\n`;
        returnValue += `Member_Type${i + 1}=R\n`;
        returnValue += `Purlin_Peak_Space${i + 1}=0.0000\n`;
        returnValue += `Purlin_Set_Space${i + 1}=0.0000\n`;
        returnValue += `Member_Shape${i + 1}=C\n`;
      } else if (extWidth > 6) {
        returnValue += `Purlin_Type${i + 1}=ZBEO\n`;
        returnValue += `Member_Type${i + 1}=S\n`;
        returnValue += `Purlin_Peak_Space${i + 1}=0.0000\n`;
        returnValue += `Purlin_Set_Space${i + 1}=0.0000\n`;
        returnValue += `Member_Shape${i + 1}=T\n`;
      } else if (extWidth > 4) {
        returnValue += `Purlin_Type${i + 1}=ZBEO\n`;
        returnValue += `Member_Type${i + 1}=S\n`;
        returnValue += `Purlin_Peak_Space${i + 1}=0.0000\n`;
        returnValue += `Purlin_Set_Space${i + 1}=0.0000\n`;
        returnValue += `Member_Shape${i + 1}=C\n`;
      } else {
        returnValue += `Purlin_Type${i + 1}=ZFCF\n`;
        returnValue += `Member_Type${i + 1}=R\n`;
        returnValue += `Purlin_Peak_Space${i + 1}=0.0000\n`;
        returnValue += `Purlin_Set_Space${i + 1}=0.0000\n`;
        returnValue += `Member_Shape${i + 1}=C\n`;
      }

      if (soffitPanelType == 'none') {
        returnValue += `Soffit_Part${i + 1}=--------\n`;
        returnValue += `Soffit_Type${i + 1}=--\n`;
        returnValue += `Soffit_Color${i + 1}=--\n`;
        returnValue += `Soffit_Style${i + 1}=--\n`;
      } else {
        returnValue += `Soffit_Part${i + 1}=${getPanelPart(building, 'soffit')}\n`;
        returnValue += `Soffit_Type${i + 1}=${getPanelType(building, 'soffit')}\n`;
        returnValue += `Soffit_Color${i + 1}=${getPanelColor(building, 'soffit')}\n`;
        returnValue += `Soffit_Style${i + 1}=--\n`;
      }

      returnValue += `End_Option_Left${i + 1}=\n`;
      returnValue += `End_Option_Right${i + 1}=\n`;

      if (includeGutters) {
        returnValue += `Gutter_Use${i + 1}=Y\n`;
        if (loc == 'front') {
          returnValue += `Gutter_Location_Id${i + 1}=1\n`;
        } else {
          returnValue += `Gutter_Location_Id${i + 1}=2\n`;
        }

        returnValue += `Gutter_Location_Use${i + 1}=EXTEND\n`;
        returnValue += `Gutter_Color${i + 1}=NC\n`;
        returnValue += `Gutter_Style${i + 1}=--\n`;
        returnValue += `Downspout_Color${i + 1}=NC\n`;
        returnValue += `Downspout_Style${i + 1}=--\n`;
        if (hasMultExt) {
          returnValue += `No_Downspout${i + 1}=0\n`;
        } else {
          returnValue += `No_Downspout${i + 1}=${numDownspouts}\n`;
          for (let j = 0; j < numDownspouts; j++) {
            returnValue += `Downspout${i + 1}_Loc${j}=0.0000\n`;
          }
        }
      } else {
        returnValue += `Gutter_Use${i + 1}=N\n`;
        if (loc == 'front') {
          returnValue += `Gutter_Location_Id${i + 1}=1\n`;
        } else {
          returnValue += `Gutter_Location_Id${i + 1}=2\n`;
        }

        returnValue += `Gutter_Location_Use${i + 1}=EXTEND\n`;
        returnValue += `Gutter_Color${i + 1}=--\n`;
        returnValue += `Gutter_Style${i + 1}=--\n`;
        returnValue += `Downspout_Color${i + 1}=--\n`;
        returnValue += `Downspout_Style${i + 1}=--\n`;
        returnValue += `No_Downspout${i + 1}=0\n`;
      }

      // New Extension Loads
      returnValue += `Dead${i + 1}=${formatNumericValue(deadLoad)}\n`;
      returnValue += `Collateral${i + 1}=0.0000\n`;
      returnValue += `Live${i + 1}=${formatNumericValue(liveLoad)}\n`;
      returnValue += `Snow${i + 1}=${roofSnowLoad * 2}\n`;

      // New Extension with Columns
      if (extCols) {
        returnValue += `Extension_Option${i + 1}=F\n`;
        returnValue += `Support_Type${i + 1}=R\n`;
        returnValue += `Support_Shape${i + 1}=-\n`;
        returnValue += `Support_Offset${i + 1}=0.0000\n`;
        returnValue += `Support_Elevation${i + 1}=0.0000\n`;
        returnValue += `Support_Splice${i + 1}=S\n`;
        returnValue += `Concrete_Elevation${i + 1}=0.0000\n`;
        if (extStarts[i] == 1) {
          returnValue += `Concrete_Extend_Left${i + 1}=0.0000\n`;
        } else {
          returnValue += `Concrete_Extend_Left${i + 1}=4.0000\n`;
        }

        if (extEnds[i] == numBays) {
          returnValue += `Concrete_Extend_Right${i + 1}=0.0000\n`;
        } else {
          returnValue += `Concrete_Extend_Right${i + 1}=4.0000\n`;
        }
        returnValue += `Concrete_Extend_Front${i + 1}=0.0000\n`;
        returnValue += `Support_Depth${i + 1}=8.0000\n`;
      } else {
        returnValue += `Extension_Option${i + 1}=-\n`;
      }
    }

    return returnValue;
  }

  const formatNumericValue = (value, decimals = 2) => {
    if (value == null) {
      return Number(0).toFixed(decimals);
    }

    const numberValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numberValue)) {
      return typeof value === 'string' ? value : Number(0).toFixed(decimals);
    }

    return numberValue.toFixed(decimals);
  };

  function getExtData(building, loc) {
    let spacingKey = `roofBaySpacing`;
    let bayKey = `${loc}ExtensionBays`;
    let numBays = building[spacingKey].length;
    let bays = building[bayKey];

    let qty = 0;
    let starts = '';
    let ends = '';
    let ons = 0;
    let offs = 0;
    let current = false;
    let i = 0;

    for (i; i < numBays; i++) {
      if (bays.includes(i + 1) != current) {
        current = bays.includes(i + 1);
        if (current) {
          qty += 1;
          starts += i + 1 + ',';
          ons += 1;
        } else {
          ends += i + ',';
          offs += 1;
        }
      }
      if (i == 0 && current == false) {
        offs += 1;
      }
    }
    if (current) {
      ends += i + ',';
    }

    starts = starts.slice(0, -1);
    ends = ends.slice(0, -1);
    return [qty, starts, ends, ons, offs];
  }

  async function calcNoDownspouts(building, loc, zip) {
    let returnValue = '';
    const {
      shape,
      width,
      length,
      backPeakOffset,
      leftExtensionWidth,
      rightExtensionWidth,
      frontExtensionWidth,
      backExtensionWidth,
    } = building;

    const response = await fetch('/api/rain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        zipCode: zip,
      }),
    });

    const rainData = await response.json();
    const fiveYear = rainData.data.fiveYear;
    const twentyFiveYear = rainData.data.twentyFiveYear;

    const rain = fiveYear == 0 ? 6 : fiveYear;
    let roofWidth = 0;
    let roofLength = leftExtensionWidth + length + rightExtensionWidth;

    if (loc == 'back') {
      if (shape == 'symmetrical') {
        roofWidth = backExtensionWidth + width / 2;
      } else if (shape == 'nonSymmetrical') {
        roofWidth = backExtensionWidth + backPeakOffset;
      } else {
        roofWidth = backExtensionWidth + width + frontExtensionWidth;
      }
    } else {
      if (shape == 'symmetrical') {
        roofWidth = width / 2 + frontExtensionWidth;
      } else if (shape == 'nonSymmetrical') {
        roofWidth = width - backPeakOffset + frontExtensionWidth;
      } else {
        roofWidth = 0;
      }
    }

    const gutterWidth = 5.6667;
    const gutterDepth = 6;
    const downspoutArea = 11.25;

    if (rain == 0 || roofWidth == 0 || roofLength == 0) {
      return 0;
    }

    let gutterCapacity = Math.pow(
      (Math.pow(gutterWidth / 12, 3 / 7) *
        Math.pow(gutterDepth / 12, 4 / 7) *
        Math.pow(43200 / (rain * roofWidth), 5 / 14)) /
        0.481,
      28 / 13
    );

    let downspoutCapacity = (1200 * downspoutArea) / (rain * roofWidth);

    returnValue =
      gutterCapacity < downspoutCapacity
        ? Math.ceil(roofLength / gutterCapacity) + 1
        : Math.ceil(roofLength / downspoutCapacity) + 1;

    return returnValue;
  }

  async function getDownspouts(building, zip) {
    let returnValue = '';
    const {
      shape,
      length,
      leftExtensionWidth,
      rightExtensionWidth,
      frontExtensionWidth,
      backExtensionWidth,
      includeGutters,
    } = building;

    let numBackDownspouts = await calcNoDownspouts(building, 'back', zip);
    let numFrontDownspouts = await calcNoDownspouts(building, 'front', zip);
    let roofLength =
      parseFloat(leftExtensionWidth) +
      parseFloat(length) +
      parseFloat(rightExtensionWidth);
    let extBackData = getExtData(building, 'back');
    let extFrontData = getExtData(building, 'front');

    let hasMultExtBack = extBackData[4] > 0 ? true : false;
    let hasMultExtFront = extFrontData[4] > 0 ? true : false;
    numBackDownspouts = hasMultExtBack
      ? numBackDownspouts + extBackData[3] + extBackData[4] - 1
      : numBackDownspouts;
    numFrontDownspouts = hasMultExtFront
      ? numFrontDownspouts + extFrontData[3] + extFrontData[4] - 1
      : numFrontDownspouts;

    if (includeGutters) {
      if (
        (shape == 'symmetrical' || shape == 'nonSymmetrical') &&
        (frontExtensionWidth == 0 || hasMultExtFront)
      ) {
        returnValue += `Length_Front=${formatNumericValue(roofLength, 4)}\n`;
        returnValue += `Gutter_Location_Id_Front=2\n`;
        returnValue += `Gutter_Location_Use_Front=WALL\n`;
        returnValue += `Gutter_Color_Front=NC\n`;
        returnValue += `Gutter_Style_Front=--\n`;
        returnValue += `Gutter_Type_Front=E\n`;
        returnValue += `Downspout_Color_Front=NC\n`;
        returnValue += `Downspout_Style_Front=--\n`;
        returnValue += `No_Downspout_Front=${numFrontDownspouts}\n`;
        for (let j = 0; j < numFrontDownspouts; j++) {
          returnValue += `Downspout_Front_Loc${j}=0.0000\n`;
        }
      } else {
        returnValue += `Length_Front=0.0000\n`;
        returnValue += `Gutter_Location_Id_Front=2\n`;
        returnValue += `Gutter_Location_Use_Front=WALL\n`;
        returnValue += `Gutter_Color_Front=NC\n`;
        returnValue += `Gutter_Style_Front=--\n`;
        returnValue += `Gutter_Type_Front=N\n`;
        returnValue += `Downspout_Color_Front=NC\n`;
        returnValue += `Downspout_Style_Front=--\n`;
        returnValue += `No_Downspout_Front=0\n`;
      }
      if (backExtensionWidth == 0 || hasMultExtBack) {
        returnValue += `Length_Back=${formatNumericValue(roofLength, 4)}\n`;
        returnValue += `Gutter_Location_Id_Back=4\n`;
        returnValue += `Gutter_Location_Use_Back=WALL\n`;
        returnValue += `Gutter_Color_Back=NC\n`;
        returnValue += `Gutter_Style_Back=--\n`;
        returnValue += `Gutter_Type_Back=E\n`;
        returnValue += `Downspout_Color_Back=NC\n`;
        returnValue += `Downspout_Style_Back=--\n`;
        returnValue += `No_Downspout_Back=${numBackDownspouts}\n`;
        for (let j = 0; j < numBackDownspouts; j++) {
          returnValue += `Downspout_Back_Loc${j}=0.0000\n`;
        }
      } else {
        returnValue += `Length_Back=0.0000\n`;
        returnValue += `Gutter_Location_Id_Back=4\n`;
        returnValue += `Gutter_Location_Use_Back=WALL\n`;
        returnValue += `Gutter_Color_Back=NC\n`;
        returnValue += `Gutter_Style_Back=--\n`;
        returnValue += `Gutter_Type_Back=N\n`;
        returnValue += `Downspout_Color_Back=NC\n`;
        returnValue += `Downspout_Style_Back=--\n`;
        returnValue += `No_Downspout_Back=0\n`;
      }
    } else {
      returnValue += `Length_Front=0.0000\n`;
      returnValue += `Gutter_Location_Id_Front=2\n`;
      returnValue += `Gutter_Location_Use_Front=WALL\n`;
      returnValue += `Gutter_Color_Front=NC\n`;
      returnValue += `Gutter_Style_Front=--\n`;
      returnValue += `Gutter_Type_Front=N\n`;
      returnValue += `Downspout_Color_Front=NC\n`;
      returnValue += `Downspout_Style_Front=--\n`;
      returnValue += `No_Downspout_Front=0\n`;
      returnValue += `Length_Back=0.0000\n`;
      returnValue += `Gutter_Location_Id_Back=4\n`;
      returnValue += `Gutter_Location_Use_Back=WALL\n`;
      returnValue += `Gutter_Color_Back=NC\n`;
      returnValue += `Gutter_Style_Back=--\n`;
      returnValue += `Gutter_Type_Back=N\n`;
      returnValue += `Downspout_Color_Back=NC\n`;
      returnValue += `Downspout_Style_Back=--\n`;
      returnValue += `No_Downspout_Back=0\n`;
    }

    return returnValue;
  }

  async function getGutters(building, zip) {
    let returnValue = '';
    const {
      shape,
      length,
      leftExtensionWidth,
      rightExtensionWidth,
      includeGutters,
    } = building;
    let numBackDownspouts = await calcNoDownspouts(building, 'back', zip);
    let numFrontDownspouts = await calcNoDownspouts(building, 'front', zip);
    let roofLength = leftExtensionWidth + length + rightExtensionWidth;

    if (includeGutters) {
      if (shape == 'singleSlope' || shape == 'leanTo') {
        returnValue += `Length_Front=0.0000\n`;
      } else {
        returnValue += `Length_Front=${formatNumericValue(roofLength, 4)}\n`;
      }
      returnValue += `Length_Back=${formatNumericValue(roofLength, 4)}\n`;
      returnValue += `No_Downspout_Front=${numFrontDownspouts}\n`;
      returnValue += `No_Downspout_Back=${numBackDownspouts}\n`;
      returnValue += `Gutter_Color=NC\n`;
      returnValue += `Gutter_Style=--\n`;
      returnValue += `Gutter_Type=E\n`;
      returnValue += `Downspout_Color=NC\n`;
      returnValue += `Downspout_Style=--\n`;
    } else {
      returnValue += `Length_Front=0.0000\n`;
      returnValue += `Length_Back=0.0000\n`;
      returnValue += `No_Downspout_Front=0\n`;
      returnValue += `No_Downspout_Back=0\n`;
      returnValue += `Gutter_Color=--\n`;
      returnValue += `Gutter_Style=--\n`;
      returnValue += `Gutter_Type=N\n`;
      returnValue += `Downspout_Color=--\n`;
      returnValue += `Downspout_Style=--\n`;
    }

    return returnValue;
  }

  function getRelites(building, loc) {
    let returnValue = '';
    const { shape, width, length, backPeakOffset } = building;
    let itemNum = 0;
    let surf =
      loc == 'wall'
        ? ['left', 'front', 'right', 'back']
        : ['backRoof', 'frontRoof'];
    let surfLength = 0;
    let surfOffset = loc == 'wall' ? 1 : 2;
    let surfName = loc == 'wall' ? 'wall' : 'surf';
    let panelType = loc == 'wall' ? 'W' : 'R';
    let panelOffset = 0;
    let insKey = `${loc}Insulation`;

    for (let i = 0; i < surf.length; i++) {
      let reliteQtyKey = `${surf[i]}PolyQty`;
      let reliteSizeKey = `${surf[i]}PolySize`;
      let reliteColorKey = `${surf[i]}PolyColor`;

      if (building[reliteQtyKey] != '' && building[reliteQtyKey] != null) {
        itemNum++;
        surfLength = surf[i] == 'left' || surf[i] == 'right' ? width : length;
        returnValue += `${surfName}_Id${itemNum}=${i + surfOffset}\n`;
        returnValue += `Number${itemNum}=${building[reliteQtyKey]}\n`;
        if (
          continuousRelites(building, surf[i]) == false &&
          building[insKey] != 'none'
        ) {
          returnValue += `Type${itemNum}=${panelType}I\n`;
        } else {
          returnValue += `Type${itemNum}=${panelType}\n`;
        }
        if (building[reliteColorKey] == 'white') {
          returnValue += `Color${itemNum}=WH\n`;
        } else {
          returnValue += `Color${itemNum}=CL\n`;
        }
        returnValue += `Style${itemNum}=\n`;
        returnValue += `Length${itemNum}=${building[reliteSizeKey]}\n`;
        if (loc == 'roof') {
          if (surf[i] == 'backRoof') {
            if (shape == 'symmetrical') {
              panelOffset = Math.round(width / 4 - 5);
            } else if (shape == 'nonSymmetrical') {
              panelOffset = Math.round(backPeakOffset / 2 - 5);
            } else {
              panelOffset = Math.round(width / 2 - 5);
            }
          } else {
            if (shape == 'symmetrical') {
              panelOffset = Math.round(width / 4 - 5);
            } else if (shape == 'nonSymmetrical') {
              panelOffset = Math.round((width - backPeakOffset) / 2 - 5);
            } else {
              panelOffset = Math.round(width / 2 - 5);
            }
          }
        }
        returnValue += `Offset${itemNum}=${panelOffset}\n`;
        if (loc == 'left' || loc == 'right') {
          returnValue += `Panel${itemNum}=N\n`;
        } else {
          returnValue += `Panel${itemNum}=Y\n`;
        }
        returnValue += `Option${itemNum}=-\n`;

        if (building[reliteQtyKey] == Math.ceil(surfLength / 3)) {
          returnValue += `NLocate${itemNum}=1\n`;
          returnValue += `Locate${itemNum}_1=1.5\n`;
        } else if (
          building[reliteQtyKey] == parseInt(parseInt(surfLength / 3) / 2)
        ) {
          returnValue += `NLocate${itemNum}=${building[reliteQtyKey]}\n`;
          for (let j = 1; j <= building[reliteQtyKey]; j++) {
            returnValue += `Locate${itemNum}_${j}=${j * 6 - 1.5}\n`;
          }
        } else if (
          building[reliteQtyKey] == parseInt(parseInt(surfLength / 3) / 3)
        ) {
          returnValue += `NLocate${itemNum}=${building[reliteQtyKey]}\n`;
          if (surfLength % 9 < 2) {
            for (let j = 1; j <= building[reliteQtyKey]; j++) {
              returnValue += `Locate${itemNum}_${j}=${j * 9 - 1.5}\n`;
            }
          } else {
            for (let j = 1; j <= building[reliteQtyKey]; j++) {
              returnValue += `Locate${itemNum}_${j}=${j * 9 - 4.5}\n`;
            }
          }
        } else {
          returnValue += `NLocate${itemNum}=0\n`;
        }
      }
    }

    return `No_Panels=${itemNum}\n${returnValue}`;
  }

  function continuousRelites(building, loc) {
    const { width, length } = building;
    let surfLength = loc == 'left' || loc == 'right' ? width : length;

    let reliteQtyKey = `${loc}PolyQty`;
    let returnValue =
      building[reliteQtyKey] > parseInt(parseInt(surfLength / 3) / 2)
        ? true
        : false;

    return returnValue;
  }

  function getMandoors() {
    const { mandoors } = state;
    let itemTotal = mandoors.length;
    let returnValue = `No_Doors=${itemTotal}\n`;
    let glass = '';

    if (state > 0) {
      return returnValue;
    }

    for (let i = 0; i < itemTotal; i++) {
      if (mandoors[i].glass == 'half') {
        glass = 'G';
      } else if (mandoors[i].glass == 'narrow') {
        glass = 'N';
      } else {
        if (
          mandoors[i].size == '3070' ||
          mandoors[i].size == '4070' ||
          mandoors[i].size == '6070'
        ) {
          glass = 'M';
        } else {
          glass = '';
        }
      }
      returnValue += `Size${i + 1}=${mandoors[i].size}${glass}\n`;
      returnValue += `WallId${i + 1}=0\n`;
      returnValue += `Number${i + 1}=${mandoors[i].qty}\n`;
      returnValue += `Color${i + 1}=WH\n`;
      returnValue += `Style${i + 1}=--\n`;
      returnValue += `Weather_Strip${i + 1}=N\n`;
      if (mandoors[i].panic) {
        returnValue += `Panic${i + 1}=HW\n`;
      } else {
        returnValue += `Panic${i + 1}=N\n`;
      }
      if (mandoors[i].mullion) {
        returnValue += `Mullion${i + 1}=LL\n`;
      } else {
        returnValue += `Mullion${i + 1}=N\n`;
      }
      returnValue += `Type${i + 1}=DR\n`;
      if (mandoors[i].deadBolt) {
        returnValue += `Lock_Type${i + 1}=DB\n`;
      } else {
        returnValue += `Lock_Type${i + 1}=N\n`;
      }
      if (mandoors[i].kickPlate) {
        returnValue += `Access_Type${i + 1}=KP\n`;
      } else {
        returnValue += `Access_Type${i + 1}=N\n`;
      }
      if (mandoors[i].closer) {
        returnValue += `Closer_Type${i + 1}=CY\n`;
      } else {
        returnValue += `Closer_Type${i + 1}=N\n`;
      }
    }

    return returnValue;
  }

  // todo: Pick Accessories to add and copy from exportMBS.js in Sales
  function getAccessories(building) {
    let returnValue = '';
    let itemNum = 0;

    return 'No_Acc=' + itemNum + '\n' + returnValue;
  }

  function setLinerPanels(building) {
    let returnValue = '';
    const { width, length, wallLinerPanels, roofLinerPanels } = building;

    let linerPanels = wallLinerPanels.concat(roofLinerPanels);
    let itemTotal = linerPanels.length;
    let itemNum = 0;
    let liners = { left: '', front: '', right: '', back: '', roof: '' };
    let wallId = { left: 1, front: 2, right: 3, back: 4, roof: 0 };
    let useId = { left: 'W', front: 'W', right: 'W', back: 'W', roof: 'R' };
    let liner = '';
    let wallNum = ['left', 'front', 'right', 'back'];

    if (hasBandedLiner(building, 'wall')) {
      for (let i = 0; i < 4; i++) {
        liners[wallNum[i]] += `Use=Y\n`;
        liners[wallNum[i]] += `Loc_Start=0.0000\n`;
        if (i % 2 == 0) {
          liners[wallNum[i]] += `Loc_End=${width}\n`;
        } else {
          liners[wallNum[i]] += `Loc_End=${length}\n`;
        }
        liners[wallNum[i]] += `Height=0.0000\n`;
        liners[wallNum[i]] += `Part=B-LINER\n`;
        liners[wallNum[i]] += `Type=BLS\n`;
        liners[wallNum[i]] += `Gage=29.0000\n`;
        liners[wallNum[i]] += `Yield=80.0000\n`;
        liners[wallNum[i]] += `Color=--\n`;
        liners[wallNum[i]] += `Style=--\n`;
        liners[wallNum[i]] += `Trim=Y\n`;
        liners[wallNum[i]] += `Trim_Color=--\n`;
        liners[wallNum[i]] += `Trim_Style=--\n`;

        itemNum++;
        liner += `Use${itemNum}=W\n`;
        liner += `Loc_Id${itemNum}=${wallId[wallNum[i]]}\n`;
        liner += `Loc_Start${itemNum}=0.0000\n`;
        if (i % 2 == 0) {
          liner += `Loc_End${itemNum}=${width}\n`;
        } else {
          liner += `Loc_End${itemNum}=${length}\n`;
        }
        liner += `Height${itemNum}=0.0000\n`;
        liner += `Part${itemNum}=B-LINER\n`;
        liner += `Type${itemNum}=BLS\n`;
        liner += `Gage${itemNum}=29.0000\n`;
        liner += `Yield${itemNum}=80.0000\n`;
        liner += `Color${itemNum}=--\n`;
        liner += `Style${itemNum}=--\n`;
        liner += `Trim${itemNum}=Y\n`;
        liner += `Trim_Color${itemNum}=--\n`;
        liner += `Trim_Style${itemNum}=--\n`;
      }
    }

    if (hasBandedLiner(building, 'roof')) {
      liners['roof'] += `Use=Y\n`;
      liners['roof'] += `Loc_Start=0.0000\n`;
      liners['roof'] += `Loc_End=${length}\n`;
      liners['roof'] += `Height=0.0000\n`;
      liners['roof'] += `Part=B-LINER\n`;
      liners['roof'] += `Type=BLS\n`;
      liners['roof'] += `Gage=29.0000\n`;
      liners['roof'] += `Yield=80.0000\n`;
      liners['roof'] += `Color=--\n`;
      liners['roof'] += `Style=--\n`;
      liners['roof'] += `Trim=Y\n`;
      liners['roof'] += `Trim_Color=--\n`;
      liners['roof'] += `Trim_Style=--\n`;

      itemNum++;
      liner += `Use${itemNum}=R\n`;
      liner += `Loc_Id${itemNum}=0\n`;
      liner += `Loc_Start${itemNum}=0.0000\n`;
      liner += `Loc_End${itemNum}=${length}\n`;
      liner += `Height${itemNum}=0.0000\n`;
      liner += `Part${itemNum}=B-LINER\n`;
      liner += `Type${itemNum}=BLS\n`;
      liner += `Gage${itemNum}=29.0000\n`;
      liner += `Yield${itemNum}=80.0000\n`;
      liner += `Color${itemNum}=--\n`;
      liner += `Style${itemNum}=--\n`;
      liner += `Trim${itemNum}=Y\n`;
      liner += `Trim_Color${itemNum}=--\n`;
      liner += `Trim_Style${itemNum}=--\n`;
    }

    for (let i = 0; i < itemTotal; i++) {
      itemNum++;

      liner += `Use${itemNum}=${useId[linerPanels[i].wall]}\n`;
      liner += `Loc_Id${itemNum}=${wallId[linerPanels[i].wall]}\n`;
      liner += `Loc_Start${itemNum}=${linerPanels[i].start || 0}\n`;
      liner += `Loc_End${itemNum}=${linerPanels[i].end || 0}\n`;
      liner += `Height${itemNum}=${linerPanels[i].height}\n`;
      liner += `Part${itemNum}=${getPanelPart(linerPanels[i], 'liner')}\n`;
      liner += `Type${itemNum}=${getPanelType(linerPanels[i], 'liner')}\n`;
      liner += `Gage${itemNum}=${getPanelGauge(linerPanels[i], 'liner')}\n`;
      liner += `Yield${itemNum}=${getPanelYield(linerPanels[i], 'liner')}\n`;
      liner += `Color${itemNum}=${getPanelColor(linerPanels[i], 'liner')}\n`;
      liner += `Style${itemNum}=--\n`;
      liner += `Trim${itemNum}=Y\n`;
      liner += `Trim_Color${itemNum}=${getPanelColor(linerPanels[i], 'liner')}\n`;
      liner += `Trim_Style${itemNum}=--\n`;

      if (linerPanels[i].wall != '') {
        liners[linerPanels[i].wall] += `Use=Y\n`;
        liners[linerPanels[i].wall] +=
          `Loc_Start=${linerPanels[i].start || 0}\n`;
        liners[linerPanels[i].wall] += `Loc_End=${linerPanels[i].end || 0}\n`;
        liners[linerPanels[i].wall] += `Height=${linerPanels[i].height}\n`;
        liners[linerPanels[i].wall] +=
          `Part=${getPanelPart(linerPanels[i], 'liner')}\n`;
        liners[linerPanels[i].wall] +=
          `Type=${getPanelType(linerPanels[i], 'liner')}\n`;
        liners[linerPanels[i].wall] +=
          `Gage=${getPanelGauge(linerPanels[i], 'liner')}\n`;
        liners[linerPanels[i].wall] +=
          `Yield=${getPanelYield(linerPanels[i], 'liner')}\n`;
        liners[linerPanels[i].wall] +=
          `Color=${getPanelColor(linerPanels[i], 'liner')}\n`;
        liners[linerPanels[i].wall] += `Style=--\n`;
        liners[linerPanels[i].wall] += `Trim=Y\n`;
        liners[linerPanels[i].wall] +=
          `Trim_Color=${getPanelColor(linerPanels[i], 'liner')}\n`;
        liners[linerPanels[i].wall] += `Trim_Style=--\n`;
      }
    }

    returnValue +=
      liners['left'] == ''
        ? `[LINER_PANELS_WALL1]\n` + `Use=N\n\n`
        : `[LINER_PANELS_WALL1]\n` + `${liners['left']}\n`;
    returnValue +=
      liners['front'] == ''
        ? `[LINER_PANELS_WALL2]\n` + `Use=N\n\n`
        : `[LINER_PANELS_WALL2]\n` + `${liners['front']}\n`;
    returnValue +=
      liners['right'] == ''
        ? `[LINER_PANELS_WALL3]\n` + `Use=N\n\n`
        : `[LINER_PANELS_WALL3]\n` + `${liners['right']}\n`;
    returnValue +=
      liners['back'] == ''
        ? `[LINER_PANELS_WALL4]\n` + `Use=N\n\n`
        : `[LINER_PANELS_WALL4]\n` + `${liners['back']}\n`;
    returnValue +=
      liners['roof'] == ''
        ? `[LINER_PANELS_ROOF]\n` + `Use=N\n\n`
        : `[LINER_PANELS_ROOF]\n` + `${liners['roof']}\n`;

    returnValue += `[LINER_PANELS]\n`;
    returnValue += `No_Liners=${itemNum}\n` + liner;

    return returnValue;
  }

  function hasBandedLiner(building, loc) {
    let roofValue, wallValue;
    const { wallInsulation, roofInsulation } = building;
    const insOptions = [
      'banded25',
      'banded30',
      'banded32',
      'banded36',
      'banded38',
      'banded40',
      'banded49',
    ];

    if (loc == 'roof') {
      roofValue = insOptions.includes(roofInsulation) ? true : false;
    }
    if (loc == 'wall') {
      wallValue = insOptions.includes(wallInsulation) ? true : false;
    }
    return roofValue || wallValue;
  }

  function getWallLoads(building, loc) {
    const { shape, frontEaveHeight, backEaveHeight, partialWalls } = building;
    let itemTotal = partialWalls.length;
    let returnValue = '';
    let wallHeight = 0;
    let wallWeight = 0;
    let deadLoad = 0;
    let girtLoad = 'N';
    let averageHeight = getAverageHeight(building);

    if (loc == 'back') {
      averageHeight = backEaveHeight;
    } else if (loc == 'front') {
      if (shape == 'symmetrical') {
        averageHeight = backEaveHeight;
      } else {
        averageHeight = frontEaveHeight;
      }
    }

    for (let i = 0; i < itemTotal; i++) {
      if (partialWalls[i].wall == loc) {
        wallHeight =
          partialWalls[i].height > wallHeight &&
          partialWalls[i].topOfWall != 'ba' &&
          partialWalls[i].topOfWall != 'bc'
            ? partialWalls[i].height
            : wallHeight;
      }
    }

    let wallType = 'CMU';
    let wallThick = 8;

    if (wallHeight > 0) {
      if (wallType == 'CMU') {
        wallWeight = (120 * wallThick) / 12;
      } else if (wallType == 'Light Concrete') {
        wallWeight = (150 * wallThick) / 12;
      } else if (wallType == 'Heavy Concrete') {
        wallWeight = (180 * wallThick) / 12;
      }
      deadLoad = Math.ceil(
        (wallWeight * Math.pow(wallHeight, 2)) / Math.pow(averageHeight, 2)
      );
      girtLoad = 'Y';
    }

    //Weight of Stack or Sliding Hangar door
    let hangarDoorDeadLoad = 0;
    // todo: correct hangar count when Hangar Openings are added
    itemTotal = 0;

    returnValue += `Option=-\n`;
    returnValue += `Notch=0.0000\n`;
    returnValue += `Grout=0.0000\n`;
    returnValue += `Dead=${deadLoad}\n`;
    returnValue += `Force=Y\n`;
    returnValue += `Girt=${girtLoad}\n`;
    return returnValue;
  }

  function getAverageHeight(building) {
    const { shape, width, backEaveHeight, frontEaveHeight, backRoofPitch } =
      building;

    let backEave = backEaveHeight;
    let frontEave = shape == 'symmetrical' ? backEaveHeight : frontEaveHeight;

    let peakOffset =
      (-12 * backEave + width * backRoofPitch + 12 * frontEave) /
      (2 * backRoofPitch);
    return (
      ((((peakOffset / 2) * backRoofPitch) / 12 + backEave) * peakOffset) /
        width +
      ((((peakOffset * backRoofPitch) / 12 + backEave - frontEave) / 2 +
        frontEave) *
        (width - peakOffset)) /
        width
    );
  }

  function getCoverAccessories() {
    let returnValue = '';
    const { mandoors, buildings } = state;
    let itemNum = 0;

    let mandoor3070 = 0;
    let mandoor4070 = 0;
    let mandoor6070 = 0;
    let mandoor3070P = 0;
    let mandoor4070P = 0;
    let mandoor6070P = 0;

    // Add Man Doors
    let itemTotal = mandoors.length;
    for (let i = 0; i < itemTotal; i++) {
      if (mandoors[i].size == '3070') {
        mandoor3070 += parseInt(mandoors[i].qty);
      } else if (mandoors[i].size == '4070') {
        mandoor4070 += parseInt(mandoors[i].qty);
      } else if (mandoors[i].size == '6070') {
        mandoor6070 += parseInt(mandoors[i].qty);
      } else if (mandoors[i].size == '3070P') {
        mandoor3070P += parseInt(mandoors[i].qty);
      } else if (mandoors[i].size == '4070P') {
        mandoor4070P += parseInt(mandoors[i].qty);
      } else if (mandoors[i].size == '6070P') {
        mandoor6070P += parseInt(mandoors[i].qty);
      }
    }

    if (mandoor3070 > 0) {
      itemNum++;
      returnValue += `Id${itemNum}=@001\n`;
      returnValue += `Number${itemNum}=${mandoor3070}\n`;
      returnValue += `Length${itemNum}=0.0000\n`;
      returnValue += `Width${itemNum}=0.0000\n`;
    }
    if (mandoor4070 > 0) {
      itemNum++;
      returnValue += `Id${itemNum}=@002\n`;
      returnValue += `Number${itemNum}=${mandoor4070}\n`;
      returnValue += `Length${itemNum}=0.0000\n`;
      returnValue += `Width${itemNum}=0.0000\n`;
    }
    if (mandoor6070 > 0) {
      itemNum++;
      returnValue += `Id${itemNum}=@003\n`;
      returnValue += `Number${itemNum}=${mandoor6070}\n`;
      returnValue += `Length${itemNum}=0.0000\n`;
      returnValue += `Width${itemNum}=0.0000\n`;
    }
    if (mandoor3070P > 0) {
      itemNum++;
      returnValue += `Id${itemNum}=@004\n`;
      returnValue += `Number${itemNum}=${mandoor3070P}\n`;
      returnValue += `Length${itemNum}=0.0000\n`;
      returnValue += `Width${itemNum}=0.0000\n`;
    }
    if (mandoor4070P > 0) {
      itemNum++;
      returnValue += `Id${itemNum}=@005\n`;
      returnValue += `Number${itemNum}=${mandoor4070P}\n`;
      returnValue += `Length${itemNum}=0.0000\n`;
      returnValue += `Width${itemNum}=0.0000\n`;
    }
    if (mandoor6070P > 0) {
      itemNum++;
      returnValue += `Id${itemNum}=@006\n`;
      returnValue += `Number${itemNum}=${mandoor6070P}\n`;
      returnValue += `Length${itemNum}=0.0000\n`;
      returnValue += `Width${itemNum}=0.0000\n`;
    }

    // Add Relites
    let relite3 = 0;
    let relite4 = 0;
    let relite5 = 0;
    let relite10 = 0;

    for (let i = 0; i < buildings.length; i++) {
      relite3 +=
        buildings[i].frontPolySize == '3'
          ? parseInt(buildings[i].frontPolyQty)
          : relite3;
      relite3 +=
        buildings[i].backPolySize == '3'
          ? parseInt(buildings[i].backPolyQty)
          : relite3;
      relite3 +=
        buildings[i].leftPolySize == '3'
          ? parseInt(buildings[i].leftPolyQty)
          : relite3;
      relite3 +=
        buildings[i].rightPolySize == '3'
          ? parseInt(buildings[i].rightPolyQty)
          : relite3;

      relite4 +=
        buildings[i].frontPolySize == '4'
          ? parseInt(buildings[i].frontPolyQty)
          : relite4;
      relite4 +=
        buildings[i].backPolySize == '4'
          ? parseInt(buildings[i].backPolyQty)
          : relite4;
      relite4 +=
        buildings[i].leftPolySize == '4'
          ? parseInt(buildings[i].leftPolyQty)
          : relite4;
      relite4 +=
        buildings[i].rightPolySize == '4'
          ? parseInt(buildings[i].rightPolyQty)
          : relite4;

      relite5 +=
        buildings[i].frontPolySize == '5'
          ? parseInt(buildings[i].frontPolyQty)
          : relite5;
      relite5 +=
        buildings[i].backPolySize == '5'
          ? parseInt(buildings[i].backPolyQty)
          : relite5;
      relite5 +=
        buildings[i].leftPolySize == '5'
          ? parseInt(buildings[i].leftPolyQty)
          : relite5;
      relite5 +=
        buildings[i].rightPolySize == '5'
          ? parseInt(buildings[i].rightPolyQty)
          : relite5;

      relite10 +=
        buildings[i].backRoofPolySize == '12'
          ? parseInt(buildings[i].backRoofPolyQty)
          : relite10;
      relite10 +=
        buildings[i].frontRoofPolySize == '12'
          ? parseInt(buildings[i].frontRoofPolyQty)
          : relite10;
    }

    if (relite3 > 0) {
      itemNum++;
      returnValue += `Id${itemNum}=@007\n`;
      returnValue += `Number${itemNum}=${relite3}\n`;
      returnValue += `Length${itemNum}=0.0000\n`;
      returnValue += `Width${itemNum}=0.0000\n`;
    }
    if (relite4 > 0) {
      itemNum++;
      returnValue += `Id${itemNum}=@008\n`;
      returnValue += `Number${itemNum}=${relite4}\n`;
      returnValue += `Length${itemNum}=0.0000\n`;
      returnValue += `Width${itemNum}=0.0000\n`;
    }
    if (relite5 > 0) {
      itemNum++;
      returnValue += `Id${itemNum}=@009\n`;
      returnValue += `Number${itemNum}=${relite5}\n`;
      returnValue += `Length${itemNum}=0.0000\n`;
      returnValue += `Width${itemNum}=0.0000\n`;
    }
    if (relite10 > 0) {
      itemNum++;
      returnValue += `Id${itemNum}=@010\n`;
      returnValue += `Number${itemNum}=${relite10}\n`;
      returnValue += `Length${itemNum}=0.0000\n`;
      returnValue += `Width${itemNum}=0.0000\n`;
    }

    // todo: add other accessories sections when added to UI
    // Add Ridge Vents
    // Add Skylights
    // Add Canopy 2x6
    // Add Canopy 2X9

    return `No_Est=${itemNum}\n` + returnValue;
  }

  function setCanopies(building, loc) {
    let returnValue = ``;
    const { liveLoad, deadLoad, roofSnowLoad, soffitPanelType, canopies } =
      building;
    let itemTotal = canopies.length;
    let itemNum = 0;

    let wallLoc = loc == 'front' || loc == 'back' ? 'roof' : loc;
    let spacingKey = `${loc}BaySpacing`;
    let numBays = building[spacingKey];
    let gutterId = getCanopyGutterId(building, loc);

    for (let i = 0; i < itemTotal; i++) {
      if (canopies[i].wall == loc) {
        itemNum++;
        gutterId++;
        returnValue += `Bay_Start${itemNum}=${canopies[i].startBay}\n`;
        returnValue += `Bay_End${itemNum}=${canopies[i].endBay}\n`;
        returnValue += `Bay_Width${itemNum}=${canopies[i].width}\n`;
        returnValue += `Height${itemNum}=${canopies[i].elevation}\n`;
        returnValue += `Slope${itemNum}=${canopies[i].slope}\n`;

        if (canopies[i].addColumns) {
          if (canopies[i].startBay == 1) {
            returnValue += `Extend_Start${itemNum}=0.0000\n`;
          } else {
            returnValue += `Extend_Start${itemNum}=0.3333\n`;
          }
          if (canopies[i].endBay == numBays) {
            returnValue += `Extend_End${itemNum}=0.0000\n`;
          } else {
            returnValue += `Extend_End${itemNum}=0.3333\n`;
          }
        } else {
          returnValue += `Extend_Start${itemNum}=0.0000\n`;
          returnValue += `Extend_End${itemNum}=0.0000\n`;
        }
        if (canopies[i].slope > 4) {
          returnValue += `Purlin_Type${itemNum}=ZBZO\n`;
        } else {
          returnValue += `Purlin_Type${itemNum}=ZBEO\n`;
        }
        returnValue += `Purlin_Peak_Space${itemNum}=1.0000\n`;
        returnValue += `Purlin_Set_Space${itemNum}=0.0000\n`;
        if (canopies[i].addColumns) {
          returnValue += `Member_Type${itemNum}=R\n`;
          returnValue += `Member_Shape${itemNum}=C\n`;
        } else if (canopies[i].width > 4) {
          returnValue += `Member_Type${itemNum}=S\n`;
          returnValue += `Member_Shape${itemNum}=T\n`;
        } else {
          returnValue += `Member_Type${itemNum}=S\n`;
          returnValue += `Member_Shape${itemNum}=C\n`;
        }

        // todo: canopySoffit and canopyRoof need to be defined in state
        // Soffit
        if (soffitPanelType == 'none') {
          returnValue += `Soffit_Part${itemNum}=--------\n`;
          returnValue += `Soffit_Type${itemNum}=--\n`;
          returnValue += `Soffit_Color${itemNum}=--\n`;
          returnValue += `Soffit_Stype${itemNum}=--\n`;
        } else {
          returnValue += `Soffit_Part${itemNum}=${getPanelPart(building, 'canopySoffit')}\n`;
          returnValue += `Soffit_Type${itemNum}=${getPanelType(building, 'canopySoffit')}\n`;
          returnValue += `Soffit_Color${itemNum}=${getPanelColor(building, 'canopySoffit')}\n`;
          returnValue += `Soffit_Style${itemNum}=--\n`;
        }

        // Roofing
        returnValue += `Roof_Part${itemNum}=${getPanelPart(building, 'canopyRoof')}\n`;
        returnValue += `Roof_Type${itemNum}=${getPanelType(building, 'canopyRoof')}\n`;
        returnValue += `Roof_Color${itemNum}=${getPanelColor(building, 'canopyRoof')}\n`;
        returnValue += `Roof_Style${itemNum}=--\n`;

        returnValue += `End_Option_Left${itemNum}=\n`;
        returnValue += `End_Option_Right${itemNum}=\n`;
        returnValue += `Screw_Type${itemNum}=M\n`;
        returnValue += `Screw_Finish${itemNum}=--\n`;
        returnValue += `${getStandingSeamClips(building, 'canopyRoof', itemNum)}\n`;

        // Gutters
        if (building.includeGutters) {
          returnValue += `Gutter_Use${itemNum}=Y\n`;
          returnValue += `Gutter_Location_Id${itemNum}=${gutterId}\n`;
          returnValue += `Gutter_Location_Use${itemNum}=EXTEND\n`;
          returnValue += `Gutter_Color${itemNum}=NC\n`;
          returnValue += `Gutter_Style${itemNum}=--\n`;
          returnValue += `Downspout_Color${itemNum}=NC\n`;
          returnValue += `Downspout_Style${itemNum}=--\n`;
          returnValue += `No_Downspout${itemNum}=2\n`;
          returnValue += `Downspout${itemNum}_Loc1=0.0000\n`;
          returnValue += `Downspout${itemNum}_Loc2=0.0000\n`;
        } else {
          returnValue += `Gutter_Use${itemNum}=N\n`;
          returnValue += `Gutter_Location_Id${itemNum}=${gutterId}\n`;
          returnValue += `Gutter_Location_Use${itemNum}=EXTEND\n`;
          returnValue += `Gutter_Color${itemNum}=--\n`;
          returnValue += `Gutter_Style${itemNum}=--\n`;
          returnValue += `Downspout_Color${itemNum}=--\n`;
          returnValue += `Downspout_Style${itemNum}=--\n`;
          returnValue += `No_Downspout${itemNum}=0\n`;
        }

        // New Extension Loads
        returnValue += `Dead${itemNum}=${deadLoad}\n`;
        returnValue += `Collateral${itemNum}=0.0000\n`;
        returnValue += `Live${itemNum}=${liveLoad}\n`;
        returnValue += `Snow${itemNum}=${roofSnowLoad * 2}\n`;

        // New Extension with Columns
        if (canopies[i].addColumns) {
          returnValue += `Extension_Option${itemNum}=F\n`;
          returnValue += `Support_Type${itemNum}=R\n`;
          returnValue += `Support_Shape${itemNum}=-\n`;
          returnValue += `Support_Offset${itemNum}=0.0000\n`;
          returnValue += `Support_Elevation${itemNum}=0.0000\n`;
          returnValue += `Support_Splice${itemNum}=S\n`;
          returnValue += `Concrete_Elevation${itemNum}=0.0000\n`;
          if (canopies[i].startBay == 1) {
            returnValue += `Concrete_Extend_Left${itemNum}=0.0000\n`;
          } else {
            returnValue += `Concrete_Extend_Left${itemNum}=4.0000\n`;
          }
          if (canopies[i].endBay == numBays) {
            returnValue += `Concrete_Extend_Right${itemNum}=0.0000\n`;
          } else {
            returnValue += `Concrete_Extend_Right${itemNum}=4.0000\n`;
          }
          returnValue += `Concrete_Extend_Front${itemNum}=0.0000\n`;
          returnValue += `Support_Depth${itemNum}=8.0000\n`;
        } else {
          returnValue += `Extension_Option${itemNum}=-\n`;
        }
      }
    }

    return `No_Extend=${itemNum}\n` + returnValue;
  }

  function getCanopyGutterId(building, loc) {
    const { canopies } = building;
    let currentId = 0;
    currentId += getExtData(building, 'front')[0];
    currentId += getExtData(building, 'back')[0];

    if (loc == 'left') {
      return currentId;
    }

    let itemTotal = canopies.length;
    for (let i = 0; i < itemTotal; i++) {
      if (
        canopies[i].wall == 'left' ||
        (canopies[i].wall == 'front' && (loc == 'right' || loc == 'back')) ||
        (canopies[i].wall == 'right' && loc == 'back')
      ) {
        currentId++;
      }
    }
    return currentId;
  }

  function getAdditionalLoads(bIndex) {
    let returnValue = '';
    const {
      shape,
      width,
      length,
      leftExtensionWidth,
      rightExtensionWidth,
      roofSnowLoad,
      leftGirtType,
      rightGirtType,
      frontGirtType,
      backGirtType,
      frontEaveHeight,
      backEaveHeight,
    } = state.buildings[bIndex];
    let itemNum = 0;

    if (
      bIndex > 0 &&
      shape == 'leanTo' &&
      backGirtType == 'open' &&
      leftGirtType == 'open' &&
      rightGirtType == 'open'
    ) {
      //Add Snow Load to Open Lean-to with the same height as Main Building and if lean-to is connected to a sidewall
      //Could be connected to other buildings besides Main Building
      if (
        frontEaveHeight == state.buildings[0].backEaveHeight ||
        frontEaveHeight == state.builidngs[0].frontEaveHeight
      ) {
        itemNum++;
        returnValue += `Frame_Type${itemNum}=BUILD\n`;
        returnValue += `Surf/Col${itemNum}=2\n`;
        returnValue += `Basic_Type${itemNum}=SNOW\n`;
        returnValue += `Description${itemNum}=\n`;
        returnValue += `Load_Type${itemNum}=D\n`;
        returnValue += `Force_X${itemNum}=-${roofSnowLoad}\n`;
        returnValue += `Force_Y${itemNum}=-${roofSnowLoad}\n`;
        returnValue += `Moment${itemNum}=0.0000\n`;

        if (width > 5) {
          returnValue += `DX${itemNum}=${width - 5}\n`;
        } else {
          returnValue += `DX${itemNum}=0.0000\n`;
        }
        returnValue += `DY${itemNum}=${width}\n`;
        returnValue += `Orient${itemNum}=T\n`;
        returnValue += `Start${itemNum}=0.0000\n`;
        returnValue += `End${itemNum}=${length + leftExtensionWidth + rightExtensionWidth}\n`;
      }
    }
    return `No_Load_Add=${itemNum}\n` + returnValue;
  }

  function getPartitions(building) {
    let returnValue = '';
    const { roofBaySpacing, partitions } = building;
    let itemTotal = partitions.length;
    let itemNum = 0;
    let partBays,
      offsetBays = [],
      bays;

    returnValue += `No_Partition_Wall=${itemTotal}\n`;

    for (let i = 0; i < itemTotal; i++) {
      itemNum++;
      partBays = partitions[i].baySpacing;

      offsetBays = [];
      offsetBays.push(partitions[i].offset);
      bays = roofBaySpacing;
      returnValue += `\n[PARTITION_LOCATION${itemNum}]\n`;
      returnValue += `Orient=${partitions[i].orientation == 't' ? 'T' : 'L'}\n`;
      returnValue += `Direct=CR\n`;
      returnValue += `Offset1=${partitions[i].start || 0}\n`;
      returnValue += `Adj_Wall_Id1=0\n`;
      returnValue += `Tie_In_Option1=3\n`;
      returnValue += `Offset2=${partitions[i].end || 0}\n`;
      returnValue += `Adj_Wall_Id2=0\n`;
      returnValue += `Tie_In_Option2=3\n`;
      returnValue += `Number=${offsetBays.length}\n`;
      for (let j = 0; j < offsetBays.length; j++) {
        returnValue += `Loc${j + 1}=${offsetBays[j]}\n`;
      }

      returnValue += `\n[PARTITION_BAY_SPACING_WALL${itemNum}]\n`;
      returnValue += `${formatBaySpacing(partitions[i].baySpacing)}`;

      returnValue += `\n[PARTITION_FRAMED_OPENINGS_WALL${itemNum}]\n`;
      returnValue += `${getFramedOpenings(building, 'partition', i + 1)}`;

      returnValue += `\n[PARTITION_FRAMING_WALL${itemNum}]\n`;

      if (partitions[i].orientation == 't' && bays.includes(offsetBays[0])) {
        returnValue += `Col_Depth=0.0000\n`;
        returnValue += `Start_Col_Type=R\n`;
        returnValue += `Int_Col_Type=R\n`;
        returnValue += `End_Col_Type=R\n`;
        returnValue += `Col_Elev=0.0000\n`;
        returnValue += `Rafter_Depth=0.0000\n`;
        returnValue += `Rafter_Type=-\n`;
        returnValue += `Rafter_Rotate=D\n`;
        returnValue += `Rafter_Option=3\n`;
      } else {
        returnValue += `Col_Depth=0.0000\n`;
        returnValue += `Start_Col_Type=C\n`;
        returnValue += `Int_Col_Type=R\n`;
        returnValue += `End_Col_Type=C\n`;
        returnValue += `Col_Elev=0.0000\n`;
        returnValue += `Rafter_Depth=0.0000\n`;
        returnValue += `Rafter_Type=C\n`;
        returnValue += `Rafter_Rotate=D\n`;
        returnValue += `Rafter_Option=2\n`;
      }

      returnValue += `\n[PARTITION_PARTIAL_WALLS_WALL${itemNum}]\n`;
      returnValue += `${setPartitionPartialWalls(building, 'partition', i + 1, partBays)}`;

      returnValue += `\n[PARTITION_GIRTS_WALL${itemNum}]\n`;
      returnValue += `Type=ZF\n`;
      returnValue += `Flg_Brace_Use=Y\n`;
      returnValue += `Flg_Brace_Supply=Y\n`;
      returnValue += `Set_Depth=8.0000\n`;
      returnValue += `Type_Top=CF\n`;

      returnValue += `\n[PARTITION_GIRT_LOC_WALL${itemNum}]\n`;
      returnValue += `Set_Loc=I\n`;
      returnValue += `No_Rows=1\n`;
      returnValue += `Loc1=4.0000\n`;

      returnValue += `\n[PARTITION_PANEL_LEFT_WALL${itemNum}]\n`;
      returnValue += `${setPartitionSheeting(building, `partition-${i}-Left`, partitions[i].height)}`;

      returnValue += `\n[PARTITION_PANEL_RIGHT_WALL${itemNum}]\n`;
      returnValue += `${setPartitionSheeting(building, `partition-${i}-Right`, partitions[i].height)}`;

      returnValue += `\n[PARTITION_INSULATION_WALL${itemNum}]\n`;
      if (partitions[i].insulation == 'none') {
        returnValue += `Use=N\n`;
        returnValue += `Type=N\n`;
        returnValue += `Thick=0.0000\n`;
        returnValue += `Wire=N\n`;
      } else {
        returnValue += `Use=Y\n`;
        if (partitions[i].insulation == 'vrr2') {
          returnValue += `Type=PS\n`;
          returnValue += `Thick=2.0000\n`;
        } else if (partitions[i].insulation == 'vrr3') {
          returnValue += `Type=PS\n`;
          returnValue += `Thick=3.0000\n`;
        } else if (partitions[i].insulation == 'vrr4') {
          returnValue += `Type=PS\n`;
          returnValue += `Thick=4.0000\n`;
        } else if (partitions[i].insulation == 'vrr6') {
          returnValue += `Type=PS\n`;
          returnValue += `Thick=6.0000\n`;
        } else if (partitions[i].insulation == 'banded25') {
          returnValue += `Type=WB\n`;
          returnValue += `Thick=8.0000\n`;
        } else if (partitions[i].insulation == 'banded30') {
          returnValue += `Type=WB\n`;
          returnValue += `Thick=9.0000\n`;
        }
        returnValue += `Wire=N\n`;
      }

      returnValue += `\n[PARTITION_BASE_OPTIONS_WALL${itemNum}]\n`;
      returnValue += `Angle=N\n`;
      returnValue += `Channel=Y\n`;
      returnValue += `Seal=N\n`;
      returnValue += `Angle_Seal=N\n`;
    }
    return returnValue;
  }

  function setPartitionPartialWalls(building, loc, partNum, bays) {
    let returnValue = '';
    const { partialWalls } = building;
    let itemTotal = partialWalls.length;
    let itemNum = 0;
    let bayInfo;

    for (let i = 0; i < itemTotal; i++) {
      //todo: original had index included in wall var
      if (loc == 'partition' && partialWalls[i].wall == 'partition') {
        itemNum++;
        bayInfo = getPartitionStartEnd(
          bays,
          partialWalls[i].start,
          partialWalls[i].end
        );
        returnValue += `Base_Type${itemNum}=${partialWalls[i].topOfWall}\n`;
        if (
          partialWalls[i].topOfWall == 'ba' ||
          partialWalls[i].topOfWall == 'bc'
        ) {
          returnValue += `Load${itemNum}=N\n`;
          returnValue += `Load_Col${itemNum}=Y\n`;
        } else {
          returnValue += `Load${itemNum}=Y\n`;
          returnValue += `Load_Col${itemNum}=Y\n`;
        }
        returnValue += `Bay_Start${itemNum}=${bayInfo[0]}\n`;
        returnValue += `Bay_End${itemNum}=${bayInfo[1]}\n`;
        returnValue += `Height${itemNum}=${partialWalls[i].height}\n`;
        returnValue += `Option${itemNum}=-\n`;
      }
    }
    return `No_Sets=${itemNum}\n` + returnValue;
  }

  function getPartitionStartEnd(bays, start, end) {
    let startBay = 0;
    let endBay = 0;
    let startOffset = 0;
    let endOffset = 0;

    for (let i = 0; i < bays.length; i++) {
      if (i == 0) {
        if (start < bays[i]) {
          startBay = 1;
          startOffset = start;
        }
        if (end <= bays[i]) {
          endBay = 1;
          endOffset = bays[i] - end;
        }
      } else {
        if (start < bays[i] && start >= bays[i - 1]) {
          startBay = i + 1;
          startOffset = start - bays[i - 1];
        }
        if (end <= bays[i] && end > bays[(i = 1)]) {
          endBay = i + 1;
          endOffset = bays[i] - end;
        }
      }
    }
    return [startBay, endBay, startOffset, endOffset];
  }

  function setPartitionSheeting(building, loc, height) {
    let returnValue = '';
    const { partitions } = building;
    let locSide = loc.split('-')[2];
    let locI = loc.split('-')[1];
    let partTypeKey = `${locSide}PanelType`;
    let partGaugeKey = `${locSide}PanelGauge`;

    if (partitions[locI][partTypeKey] != 'none') {
      returnValue += `Height=${height}\n`;
      returnValue += `Top=T\n`;
      returnValue += `Part=${getPanelPart(building, `partition-${locI}-${locSide}`)}\n`;
      returnValue += `Type=${getPanelType(building, `partition-${locI}-${locSide}`)}\n`;
      returnValue += `Gage=${getPanelGauge(building, `partition-${locI}-${locSide}`)}\n`;
      returnValue += `Yield=${getPanelYield(building, `partition-${locI}-${locSide}`)}\n`;
      returnValue += `Panel_Color=${getPanelColor(building, `partition-${locI}-${locSide}`)}\n`;
      returnValue += `Panel_Style=\n`;
      returnValue += `Screw_Type=${getScrewLength(building, `partition-${locI}-${locSide}`)}\n`;
      returnValue += `Screw_Finish=\n`;
      returnValue += `Corner_Color=${getPanelColor(building, `partition-${locI}-${locSide}`)}\n`;
      returnValue += `Corner_Style=\n`;
      returnValue += `Jamb_Color=${getPanelColor(building, `partition-${locI}-${locSide}`)}\n`;
      returnValue += `Jamb_Style=\n`;
      returnValue += `Top_Color=${getPanelColor(building, `partition-${locI}-${locSide}`)}\n`;
      returnValue += `Top_Style=\n`;
      returnValue += `Base_Color=${getPanelColor(building, `partition-${locI}-${locSide}`)}\n`;
      returnValue += `Base_Style=\n`;
    } else {
      returnValue += `Height=0.0000\n`;
      returnValue += `Top=\n`;
      returnValue += `Part=--------\n`;
      returnValue += `Type=N\n`;
      returnValue += `Gage=0.0000\n`;
      returnValue += `Yield=0.0000\n`;
      returnValue += `Panel_Color=\n`;
      returnValue += `Panel_Style=\n`;
      returnValue += `Screw_Type=\n`;
      returnValue += `Screw_Finish=\n`;
      returnValue += `Corner_Color=\n`;
      returnValue += `Corner_Style=\n`;
      returnValue += `Jamb_Color=\n`;
      returnValue += `Jamb_Style=\n`;
      returnValue += `Top_Color=\n`;
      returnValue += `Top_Style=\n`;
      returnValue += `Base_Color=\n`;
      returnValue += `Base_Style=\n`;
    }

    return returnValue;
  }

  // todo: finish implementation
  function getWideOpenings(building) {
    let returnValue = '';
    let itemNum = 0;

    return `No_Sets=${itemNum}\n` + returnValue;
  }

  // todo: finish implementation
  function getWideEWOpenings(building) {
    let returnValue = '';
    let itemNum = 0;

    return `No_Sets=${itemNum}\n` + returnValue;
  }

  function setPartialWalls(building, loc) {
    let returnValue = '';
    const { partialWalls, wallSkirts } = building;
    let partialTotal = partialWalls.length;
    let skirtTotal = wallSkirts.length;
    let itemNum = 0;
    let bayInfo;

    for (let i = 0; i < partialTotal; i++) {
      if (partialWalls[i].wall == loc.toLowerCase()) {
        itemNum++;
        bayInfo = getWallStartEnd(
          building,
          loc,
          partialWalls[i].start || 0,
          partialWalls[i].end || 0
        );
        returnValue += `Bay_Start${itemNum}=${bayInfo[0]}\n`;
        returnValue += `Bay_End${itemNum}=${bayInfo[1]}\n`;
        returnValue += `Offset_Start${itemNum}=${bayInfo[2]}\n`;
        returnValue += `Offset_End${itemNum}=${bayInfo[3]}\n`;
        returnValue += `Height_Bottom${itemNum}=0.0000\n`;
        returnValue += `Height_Top${itemNum}=${partialWalls[i].height}\n`;
        returnValue += `Height${itemNum}=${partialWalls[i].height}\n`;
        returnValue += `Top_Type${itemNum}=-\n`;
        returnValue += `Top_Option${itemNum}=3\n`;
        returnValue += `Top_Base_Type${itemNum}=${partialWalls[i].topOfWall}\n`;
        if (bayInfo[2] == 0 && bayInfo[3] == 0) {
          returnValue += `Jamb_Type${itemNum}=-\n`;
        } else {
          returnValue += `Jamb_Type${itemNum}=C\n`;
        }
        returnValue += `Jamb_Option${itemNum}=-\n`;
        returnValue += `Use_Panel_Notch${itemNum}=N\n`;
        returnValue += `Cut_Liner_Panel${itemNum}=Y\n`;
        if (
          partialWalls[i].topOfWall == 'ba' ||
          partialWalls[i].topOfWall == 'bc'
        ) {
          returnValue += `Load_Girt${itemNum}=N\n`;
          returnValue += `Load_Col${itemNum}=Y\n`;
          returnValue += `Load_Defl_Girt${itemNum}=90.0000\n`;
        } else {
          returnValue += `Load_Girt${itemNum}=Y\n`;
          returnValue += `Load_Col${itemNum}=Y\n`;
          returnValue += `Load_Defl_Girt${itemNum}=240.0000\n`;
        }
      }
    }

    for (let i = 0; i < skirtTotal; i++) {
      if (
        wallSkirts[i].wall == loc.toLowerCase() &&
        wallSkirts[i].cutColumns == false
      ) {
        itemNum++;
        returnValue += `Bay_Start${itemNum}=${wallSkirts[i].startBay}\n`;
        returnValue += `Bay_End${itemNum}=${wallSkirts[i].endBay}\n`;
        returnValue += `Offset_Start${itemNum}=0.0000\n`;
        returnValue += `Offset_End${itemNum}=0.0000\n`;
        returnValue += `Height_Bottom${itemNum}=0.0000\n`;
        returnValue += `Height_Top${itemNum}=${wallSkirts[i].height}\n`;
        returnValue += `Height${itemNum}=${wallSkirts[i].height}\n`;
        returnValue += `Top_Type${itemNum}=-\n`;
        returnValue += `Top_Option${itemNum}=3\n`;
        returnValue += `Top_Base_Type${itemNum}=C\n`;
        returnValue += `Jamb_Type${itemNum}=-\n`;
        returnValue += `Jamb_Option${itemNum}=-\n`;
        returnValue += `Use_Panel_Notch${itemNum}=N\n`;
        returnValue += `Cut_Liner_Panel${itemNum}=Y\n`;
        returnValue += `Load_Girt${itemNum}=N\n`;
        returnValue += `Load_Col${itemNum}=Y\n`;
        returnValue += `Load_Defl_Girt${itemNum}=90.0000\n`;
      }
    }

    return `No_Sets=${itemNum}\n` + returnValue;
  }

  function getWallStartEnd(building, loc, start, end) {
    let startBay = 0;
    let endBay = 0;
    let startOffset = 0;
    let endOffset = 0;

    let wallLoc = loc == 'front' || loc == 'back' ? 'roof' : loc;
    let wallKey = `${loc}BaySpacing`;
    let bays = building[wallKey];
    bays = loc == 'back' ? Array.from(bays).reverse() : bays;

    let totalWidth = 0;
    let prevWidth = 0;
    for (let i = 0; i < bays.length; i++) {
      totalWidth += bays[i];
      if (i == 0) {
        if (start < bays[i]) {
          startBay = 1;
          startOffset = start;
        }
        if (end <= bays[i]) {
          endBay = 1;
          endOffset = bays[i] - end;
        }
      } else {
        prevWidth += bays[i - 1];
        if (start < bays[i] && start >= bays[i - 1]) {
          startBay = i + 1;
          startOffset = start - bays[i - 1];
        }
        if (end <= totalWidth && end > prevWidth) {
          endBay = i + 1;
          endOffset = totalWidth - end;
        }
      }
    }

    return [startBay, endBay, startOffset, endOffset];
  }

  function setWainscot(building, loc) {
    let returnValue = '';
    const { wainscots } = building;
    let itemTotal = wainscots.length;
    let itemNum = 0;
    let bayInfo;
    let baseKey = `${loc}BaseCondition`;

    for (let i = 0; i < itemTotal; i++) {
      if (wainscots[i].wall == loc.toLowerCase()) {
        itemNum++;
        bayInfo = getWallStartEnd(
          building,
          loc,
          wainscots[i].start || 0,
          wainscots[i].end || 0
        );
        returnValue += `Bay_Start${itemNum}=${bayInfo[0]}\n`;
        returnValue += `Bay_End${itemNum}=${bayInfo[1]}\n`;
        returnValue += `Offset_Start${itemNum}=${bayInfo[2]}\n`;
        returnValue += `Offset_End${itemNum}=${bayInfo[3]}\n`;
        returnValue += `Height_Bottom${itemNum}=0.0000\n`;
        returnValue += `Height_Top${itemNum}=${wainscots[i].height}\n`;
        returnValue += `Bottom_Member_Type${itemNum}=-\n`;
        returnValue += `Bottom_Member_Option${itemNum}=3\n`;
        if (building[baseKey] == 'angle') {
          returnValue += `Bottom_Base_Type${itemNum}=A\n`;
        } else if (building[baseKey] == 'cee') {
          returnValue += `Bottom_Base_Type${itemNum}=B\n`;
        } else {
          returnValue += `Bottom_Base_Type${itemNum}=-\n`;
        }
        returnValue += `Bottom_Seal${itemNum}=-\n`;
        returnValue += `Top_Type${itemNum}=Z\n`;
        returnValue += `Top_Option${itemNum}=1\n`;
        returnValue += `Top_Base_Type${itemNum}=-\n`;
        returnValue += `Top_Seal${itemNum}=-\n`;
        if (bayInfo[2] == 0 && bayInfo[3] == 0) {
          returnValue += `Jamb_Type${itemNum}=-\n`;
        } else {
          returnValue += `Jamb_Type${itemNum}=C\n`;
        }
        returnValue += `Jamb_Option${itemNum}=-\n`;
        returnValue += `Load_Defl_Girt${itemNum}=90.0000\n`;
        returnValue += `Load_Defl_Panel${itemNum}=90.0000\n`;
        if (wainscots[i].panelType == 'none') {
          returnValue += `Part${itemNum}=--------\n`;
          returnValue += `Panel_Type${itemNum}=--\n`;
          returnValue += `Gage${itemNum}=0.0000\n`;
          returnValue += `Yield${itemNum}=0.0000\n`;
          returnValue += `Panel_Color${itemNum}=--\n`;
          returnValue += `Panel_Style${itemNum}=--\n`;
          returnValue += `Panel_Option${itemNum}=B\n`;
          returnValue += `Base_Color${itemNum}=--\n`;
          returnValue += `Base_Style${itemNum}=--\n`;
          returnValue += `Left_Color${itemNum}=--\n`;
          returnValue += `Left_Style${itemNum}=--\n`;
          returnValue += `Right_Color${itemNum}=--\n`;
          returnValue += `Right_Style${itemNum}=--\n`;
          returnValue += `Jamb_Color${itemNum}=--\n`;
          returnValue += `Jamb_Style${itemNum}=--\n`;
          returnValue += `Top_Color${itemNum}=--\n`;
          returnValue += `Top_Style${itemNum}=--\n`;
          returnValue += `Screw_Type${itemNum}=--\n`;
          returnValue += `Screw_Finish${itemNum}=--\n`;
        } else {
          returnValue += `Part${itemNum}=${getPanelPart(building, 'wainscot')}\n`;
          returnValue += `Panel_Type${itemNum}=${getPanelType(building, 'wainscot')}\n`;
          returnValue += `Gage${itemNum}=${getPanelGauge(building, 'wainscot')}\n`;
          returnValue += `Yield${itemNum}=${getPanelYield(building, 'wainscot')}\n`;
          returnValue += `Panel_Color${itemNum}=${getPanelColor(building, 'wainscot')}\n`;
          returnValue += `Panel_Style${itemNum}=--\n`;
          returnValue += `Panel_Option${itemNum}=${wainscots[i].panelOption}\n`;
          returnValue += `Base_Color${itemNum}=${getPanelColor(building, 'wainscot')}\n`;
          returnValue += `Base_Style${itemNum}=--\n`;
          returnValue += `Left_Color${itemNum}=${getPanelColor(building, 'wainscot')}\n`;
          returnValue += `Left_Style${itemNum}=--\n`;
          returnValue += `Right_Color${itemNum}=${getPanelColor(building, 'wainscot')}\n`;
          returnValue += `Right_Style${itemNum}=--\n`;
          returnValue += `Jamb_Color${itemNum}=${getPanelColor(building, 'wainscot')}\n`;
          returnValue += `Jamb_Style${itemNum}=--\n`;
          returnValue += `Top_Color${itemNum}=${getPanelColor(building, 'wainscot')}\n`;
          returnValue += `Top_Style${itemNum}=--\n`;
          returnValue += `Screw_Type${itemNum}=${getScrewLength(building, 'wall')}\n`;
          returnValue += `Screw_Finish${itemNum}=--\n`;
        }
      }
    }

    return `No_Sets=${itemNum}\n` + returnValue;
  }

  function getMezzanines(building) {
    let returnValue = '';
    let itemNum = 0;
    return `No_Floors=${itemNum}\n` + returnValue;
  }

  return {
    createFolderAndFiles,
    status,
    isExporting,
  };
}
