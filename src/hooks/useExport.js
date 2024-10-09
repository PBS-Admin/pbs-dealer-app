'use client';

import { baseCondition } from '@/util/dropdownOptions';
import { useState, useCallback } from 'react';

export function useExport() {
  const [status, setStatus] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const countFiles = async (dirHandle) => {
    let count = 0;
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.siz')) {
        count++;
      }
    }
    return count;
  };

  const createFolderAndFiles = useCallback(async (values) => {
    if (typeof window === 'undefined' || !('showDirectoryPicker' in window)) {
      setStatus('File System Access API is not supported in this environment.');
      return false;
    }

    setIsExporting(true);
    setStatus('Starting export...');

    try {
      // Request permission to access the C: drive
      setStatus('Please select your C: drive...');
      const cDriveHandle = await window.showDirectoryPicker({
        id: 'CDriveSelection',
        mode: 'readwrite',
        title: 'Select your folder containing MBS and Jobs folders',
      });

      // Get and set handlers for MBS subfolders and Jobs folder
      let mbsFolderHandle,
        siz2FolderHandle,
        doc2FolderHandle,
        intProjectFolderHandle,
        intDoc2FolderHandle,
        jobsFolderHandle;
      try {
        mbsFolderHandle = await cDriveHandle.getDirectoryHandle('MBS', {
          create: false,
        });
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
        jobsFolderHandle = await cDriveHandle.getDirectoryHandle('Jobs', {
          create: false,
        });
      } catch (error) {
        setStatus('MBS and Jobs subfolder not found on the selected drive.');
        return false;
      }

      let newProjectHandle, rootHandle, newBuildingHandle, shouldCreate;

      // Create a new Project folder in the Jobs folder
      if (values.buildings.length > 1) {
        const newProjectName = values.quoteNumber + 'P' || 'New Project Folder';
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
      values.buildings.map(async (building, index) => {
        const bldgAlpha = ' BCDEFGHI';

        newBuildingHandle ? (shouldCreate = false) : (shouldCreate = true);

        newBuildingHandle = await rootHandle.getDirectoryHandle(
          values.quoteNumber + bldgAlpha[index].trim(),
          {
            create: shouldCreate,
          }
        );
      });

      // // Copy .siz files from MBS/SIZ2 to the new folder
      // await copySizFiles(
      //   setStatus,
      //   countFiles,
      //   siz2FolderHandle,
      //   newProjectHandle,
      //   values,
      //   newBuildingHandle,
      //   rootHandle
      // );

      // if (newProjectHandle) {
      //   setStatus('Copying PDWGCtrl.in file');
      //   for await (const entry of intDoc2FolderHandle.values()) {
      //     if (
      //       entry.kind === 'file' &&
      //       entry.name.toLowerCase() == 'pdwgctrl.in'
      //     ) {
      //       const file = await entry.getFile();

      //       const newPDWGFileHandle = await newProjectHandle.getFileHandle(
      //         entry.name,
      //         { create: true }
      //       );
      //       const newPDWGWritable = await newPDWGFileHandle.createWritable();
      //       await newPDWGWritable.write(file);
      //       await newPDWGWritable.close();
      //     }
      //   }
      // }

      // setStatus('Copying config files');
      // for await (const entry of doc2FolderHandle.values()) {
      //   if (
      //     entry.kind === 'file' &&
      //     (entry.name.toLowerCase() == 'mbs.cfg' ||
      //       entry.name.toLowerCase() == 'mbs.frm' ||
      //       entry.name.toLowerCase() == 'desctrl.in' ||
      //       entry.name.toLowerCase() == 'dwgctrl.in' ||
      //       entry.name.toLowerCase() == 'pdwgctrl.in')
      //   ) {
      //     setStatus(`Copying ${copiedFiles}/${totalFiles} .doc2 files...`);
      //     const file = await entry.getFile();

      //     if (newProjectHandle && entry.name.toLowerCase() == 'pdwgctrl.in') {
      //       const newPDWGFileHandle = await newProjectHandle.getFileHandle(
      //         entry.name,
      //         { create: true }
      //       );
      //       const newPDWGWritable = await newPDWGFileHandle.createWritable();
      //       await newPDWGWritable.write(file);
      //       await newPDWGWritable.close();
      //     }

      //     if (
      //       newProjectHandle &&
      //       (entry.name.toLowerCase() == 'desctrl.in' ||
      //         entry.name.toLowerCase() == 'dwgctrl.in')
      //     ) {
      //       const newCommonHandle = await newProjectHandle.getDirectoryHandle(
      //         'Common',
      //         { create: false }
      //       );
      //       const newCommonFileHandle = await newCommonHandle.getFileHandle(
      //         entry.name,
      //         { create: true }
      //       );
      //       const newCommonWritable =
      //         await newCommonFileHandle.createWritable();
      //       await newCommonWritable.write(file);
      //       await newCommonWritable.close();
      //     }

      //     values.buildings.map(async (building, index) => {
      //       const bldgAlpha = ' BCDEFGHI';

      //       newBuildingHandle ? (shouldCreate = false) : (shouldCreate = true);

      //       newBuildingHandle = await rootHandle.getDirectoryHandle(
      //         values.quoteNumber + bldgAlpha[index].trim(),
      //         {
      //           create: shouldCreate,
      //         }
      //       );
      //       const newFileHandle = await newBuildingHandle.getFileHandle(
      //         entry.name,
      //         {
      //           create: true,
      //         }
      //       );
      //       const newWritable = await newFileHandle.createWritable();
      //       await newWritable.write(file);
      //       await newWritable.close();
      //     });
      //   }
      // }

      // // Create and write to Project.in file in the root folder
      // setStatus('Creating Project.in file...');
      // if (newProjectHandle) {
      //   const projectInHandle = await newProjectHandle.getFileHandle(
      //     'Project.in',
      //     {
      //       create: true,
      //     }
      //   );
      //   await newProjectHandle.removeEntry('Project.in');
      //   const writable = await projectInHandle.createWritable();

      //   await writable.write('[PROJECT]\n');
      //   await writable.write(`Id=${values.quoteNumber + 'P'}\n`);
      //   await writable.write(`#Building=${values.buildings.length}\n`);
      //   await writable.write('Units=\n');
      //   await writable.write('Status=\n');
      //   await writable.write('Title=\n');
      //   await writable.write('Comments=\n');
      //   await writable.write(`NextIdKey=${values.buildings.length + 1}\n`);

      //   const bldgAlpha = ' BCDEFGHI';
      //   for (let index = 0; index < values.buildings.length; index++) {
      //     await writable.write(`[BUILDING:${index + 1}]\n`);
      //     await writable.write(
      //       `Id=${values.quoteNumber + bldgAlpha[index].trim()}\n`
      //     );
      //     await writable.write(`IdKey=${index + 1}\n`);
      //     await writable.write('Active=Y\n');
      //   }

      //   await writable.close();
      // }

      // Create and write to MBS.in file in the new folder
      // setStatus('Creating MBS.in file...');

      // Copy the MBS.in file to multiple locations
      // const bldgAlpha = ' BCDEFGHI';
      // for (let index = 1; index < values.buildings.length; index++) {
      //   newBuildingHandle = await rootHandle.getDirectoryHandle(
      //     values.quoteNumber + bldgAlpha[index].trim(),
      //     {
      //       create: false,
      //     }
      //   );
      //   // // Create Building MBS.in
      //   // const mbsFile = await createMBS(rootHandle, values, index);
      //   // const newMbsInHandle = await newBuildingHandle.getFileHandle('MBS.in', {
      //   //   create: true,
      //   // });
      //   // const writable = await newMbsInHandle.createWritable();
      //   // await writable.write(mbsFile);
      //   // await writable.close();

      //   setStatus(
      //     `Creating Building${bldgAlpha[index].trim()} DesLoad.ini file...`
      //   );
      //   // Create Building DesLoad.ini
      //   const desLoadFile = await createDesLoad(rootHandle, values, index);
      //   const newDesLoadHandle = await newBuildingHandle.getFileHandle(
      //     'DESLOAD.INI',
      //     {
      //       create: true,
      //     }
      //   );
      //   const desLoadwritable = await newDesLoadHandle.createWritable();
      //   await desLoadwritable.write(desLoadFile);
      //   await desLoadwritable.close();

      //   setStatus(
      //     `Creating Building${bldgAlpha[index].trim()} DesCtrl.ini file...`
      //   );
      //   // // Create Building DesCtrl.ini
      //   const desCtrlFile = await createDesCtrl(rootHandle, values, index);
      //   const newDesCtrlHandle = await newBuildingHandle.getFileHandle(
      //     'DESCTRL.INI',
      //     {
      //       create: true,
      //     }
      //   );
      //   const desCtrlwritable = await newDesCtrlHandle.createWritable();
      //   await desCtrlwritable.write(desCtrlFile);
      //   await desCtrlwritable.close();
      // }

      const bldgAlpha = ' BCDEFGHI';
      for (let index = 0; index < values.buildings.length; index++) {
        newBuildingHandle = await rootHandle.getDirectoryHandle(
          values.quoteNumber + bldgAlpha[index].trim(),
          {
            create: false,
          }
        );
        setStatus(
          `Creating Building${bldgAlpha[index].trim()} DesCtrl.ini file...`
        );
        // // Create Building DesCtrl.ini
        // const desCtrlFile = await createDesCtrl(rootHandle, values, index);
        await createDesCtrl(rootHandle, values, index);
        // const newDesCtrlHandle = await newBuildingHandle.getFileHandle(
        //   'DESCTRL.INI',
        //   {
        //     create: true,
        //   }
        // );
        // const desCtrlwritable = await newDesCtrlHandle.createWritable();
        // await desCtrlwritable.write(desCtrlFile);
        // await desCtrlwritable.close();
      }

      // if (newProjectHandle) {
      //   // Create the Root MBS.in file
      //   const newMbsInHandle = await newProjectHandle.getFileHandle('MBS.in', {
      //     create: true,
      //   });
      //   const mbsFile = await createMBS(rootHandle, values);
      //   const writable = await newMbsInHandle.createWritable();
      //   await writable.write(mbsFile);
      //   await writable.close();

      //   // Create the Common MBS.in file
      //   const newCommonHandle = await rootHandle.getDirectoryHandle('Common', {
      //     create: false,
      //   });
      //   const newCommonFileHandle = await newCommonHandle.getFileHandle(
      //     'MBS.in',
      //     {
      //       create: true,
      //     }
      //   );
      //   const commonWritable = await newCommonFileHandle.createWritable();
      //   await commonWritable.write(mbsFile);
      //   await commonWritable.close();
      // }

      setStatus('Export and file copying completed successfully!');
      return true;
    } catch (error) {
      setStatus(`Error during export: ${error.message}`);
      return false;
    } finally {
      setIsExporting(false);
    }
  }, []);

  async function copySizFiles(
    setStatus,
    countFiles,
    siz2FolderHandle,
    newProjectHandle,
    values,
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

        values.buildings.map(async (building, index) => {
          const bldgAlpha = ' BCDEFGHI';

          newBuildingHandle = await rootHandle.getDirectoryHandle(
            values.quoteNumber + bldgAlpha[index].trim(),
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

  async function createMBS(rootHandle, values, index = 0) {
    const newBuildingHandle = await rootHandle.getDirectoryHandle(
      values.quoteNumber,
      {
        create: false,
      }
    );

    const mbsInHandle = await newBuildingHandle.getFileHandle('MBS.in', {
      create: true,
    });
    const writable = await mbsInHandle.createWritable();
    await writable.write(`Pacific Building Systems\n`);
    await writable.write(`2100 N Pacific Hwy\n`);
    await writable.write(`Woodburn, OR 97071\n`);
    await writable.write(
      `${values.customerName ? values.customerName : values.contactName}\n`
    );
    await writable.write(`${values.customerAddress}\n`);
    await writable.write(
      `${values.customerCity}, ${values.customerState} ${values.customerZip}\n`
    );
    await writable.write(`${values.projectName}\n`);
    await writable.write(`${values.projectAddress}\n`);
    await writable.write(
      `${values.projectCity}, ${values.projectState} ${values.projectZip}\n`
    );
    await writable.write(`${values.quoteNumber}\n`);
    await writable.write(`${values.engineerInitials || 'TEE'}\n`); // todo: create var
    await writable.write(`${values.detailerInitials || 'TEE'}\n`); // todo: create var
    await writable.write(`\n`);
    await writable.write(`${values.contactName}\n`);
    await writable.write(`${values.customerPhone}\n`);
    await writable.write(`${values.customerFax}\n`);
    await writable.write(`${values.projectCity}\n`);
    await writable.write(`${values.projectCounty}\n`);
    await writable.write(`${values.projectState}\n`);
    await writable.write(`${values.salespersonInitials || 'TEE'}\n`); // todo: create var
    await writable.write(`${values.quoteNumber}\n`);
    await writable.write(`${values.estimatorInitials || 'TEE'}\n`); // todo: create var
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
    await writable.write(`${values.complexity || 10}\n`); // todo: create var
    await writable.write(`${values.draftCost || ''}\n`); // todo: create var
    await writable.write(`${values.foundCost || ''}\n`); // todo: create var
    await writable.write(`${values.farmBureau || ''}\n`); // todo: create var
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`${values.customerCell}\n`);
    await writable.write(`${values.customerEmail}\n`);
    await writable.write(`\n`);
    await writable.write(`${values.pmInitials || ''}\n`); // todo: create var
    await writable.write(`${values.projectMileage || ''}\n`); // todo: create var
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`\n`);
    await writable.write(`${values.steelFinish == 'GZ' ? 'GZ' : 'ST'}\n`); // todo: create var
    await writable.write(
      `${values.buildings[index].roofBreakPoints == 'left' ? 'N' : 'Y'}\n`
    );
    await writable.write(
      `${values.projectState == 'OR' || values.projectState == 'WA' ? 'Y' : 'N'}\n`
    );
    await writable.write(
      `${values.projectState == 'OR' || values.projectState == 'WA' || values.projectState == 'AK' || values.projectState == 'HI' ? 'N' : 'Y'}\n`
    );
    await writable.write(
      `${values.projectState == 'AK' || values.projectState == 'HI' ? 'Y' : 'N'}\n`
    );
    await writable.write(`${values.willCall ? 'Y' : 'N'}\n`); // todo: create var
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
    await writable.write(`${values.noFlangeBraces ? 'Y' : 'N'}\n`);
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
    await writable.write(`${values.steelFinish}\n`);
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

  async function createDesLoad(rootHandle, values, index = 0) {
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
      values.quoteNumber,
      {
        create: false,
      }
    );

    const windSpeedService = (values.windLoad * 0.65132156).toFixed(4);
    const thermalFactor = values.thermalFactor
      ? values.thermalFactor.toFixed(2)
      : '';
    const snowFactor = values.snowFactor ? values.snowFactor?.toFixed(2) : '';
    const seismicFa = values.seismicFa ? values.seismicFa?.toFixed(3) : '';
    const seismicFv = values.seismicFv ? values.seismicFv?.toFixed(3) : '';
    const seismicSms = values.seismicSms ? values.seismicSms?.toFixed(3) : '';
    const seismicSm1 = values.seismicSm1 ? values.seismicSm1?.toFixed(3) : '';
    const seismicSds = values.seismicSds ? values.seismicSds?.toFixed(3) : '';
    const seismicSd1 = values.seismicSd1 ? values.seismicSd1?.toFixed(3) : '';
    let taMoment = '',
      taBrace = '',
      fiveYear = '',
      twentyFiveYear = '';

    const desLoadHandle = await newBuildingHandle.getFileHandle('DESLOAD.INI', {
      create: true,
    });
    const writable = await desLoadHandle.createWritable();
    await writable.write(`[BUILDING]\n`);
    await writable.write(
      `Occupancy_Category=${riskLabels[values.riskCategory]}\n`
    );
    await writable.write(`[BUILDING_CODE]\n`);
    await writable.write(`Database=${codes[values.buildingCode]}\n`);
    await writable.write(`User=${codes[values.buildingCode]}\n`);
    await writable.write(`CITY=${values.projectCity}\n`);
    await writable.write(`COUNTY=${values.projectCounty}\n`);
    await writable.write(`State=${values.projectState}\n`);
    await writable.write(`Interpolate=FALSE\n`);
    await writable.write(`[WIND]\n`);
    await writable.write(`Serviceability_Year_MRI=10 -year MRI\n`);
    await writable.write(`Wind_Speed_Serviceability=${windSpeedService}\n`);
    await writable.write(`Special_Wind_Region=0\n`);
    await writable.write(`[Climate]\n`);
    await writable.write(`Building_Elevation=${values.projectElevation}\n`);
    await writable.write(`[SNOW]\n`);
    await writable.write(`Thermal_Coefficient=${thermalFactor}\n`);
    await writable.write(`Ground=${values.groundLoad}\n`);
    await writable.write(`Importance=${snowFactor}\n`);
    await writable.write(`Status=F\n`);
    await writable.write(`[SEISMIC]\n`);
    await writable.write(`Status=T\n`);
    await writable.write(`Ss=${values.seismicSs}\n`);
    await writable.write(`S1=${values.seismicS1}\n`);
    await writable.write(`Site_Class=${values.seismicSite}\n`);
    await writable.write(`Fa=${seismicFa}\n`);
    await writable.write(`Fv=${seismicFv}\n`);
    await writable.write(`Sms=${seismicSms}\n`);
    await writable.write(`Sm1=${seismicSm1}\n`);
    await writable.write(`Sds=${seismicSds}\n`);
    await writable.write(`Sd1=${seismicSd1}\n`);
    await writable.write(`Period_Moment=${taMoment}\n`); // todo: get var
    await writable.write(`Period_Brace=${taBrace}\n`); // todo: get var
    await writable.write(`[RAIN]\n`);
    await writable.write(`Intensity=${fiveYear}\n`); // todo: get var
    await writable.write(`Intensity_25=${twentyFiveYear}\n`); // todo: get var
    await writable.write(`[ZIP]\n`);
    await writable.write(`Code=${values.projectZip}\n`);
    await writable.close();
    const desLoadFile = await desLoadHandle.getFile();
    return desLoadFile;
  }

  async function createDesCtrl(rootHandle, values, index = 0) {
    const bldgAlpha = ' BCDEFGHI';
    const walls = {
      1: 'lew',
      2: 'fsw',
      3: 'rew',
      4: 'bsw',
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
        values.exposure +
        '\n' +
        'Country=----' +
        '\n' +
        'Local=IBC  21' +
        '\n' +
        'FileName=IBC.21' +
        '\n' +
        'Closure=' +
        values.enclosure +
        '\n' +
        'Zone=' +
        values.seismicCategory +
        '\n' +
        'Import_Seis=' +
        values.seismicFactor +
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
        values.exposure +
        '\n' +
        'Country=----' +
        '\n' +
        'Local=IBC  18' +
        '\n' +
        'FileName=IBC.18' +
        '\n' +
        'Closure=' +
        values.enclosure +
        '\n' +
        'Zone=' +
        values.seismicCategory +
        '\n' +
        'Import_Seis=' +
        values.seismicFactor +
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
        values.exposure +
        '\n' +
        'Country=----' +
        '\n' +
        'Local=IBC  15' +
        '\n' +
        'FileName=IBC.15' +
        '\n' +
        'Closure=' +
        values.enclosure +
        '\n' +
        'Zone=' +
        values.seismicCategory +
        '\n' +
        'Import_Seis=' +
        values.seismicFactor +
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
        values.exposure +
        '\n' +
        'Country=----' +
        '\n' +
        'Local=OSSC 22' +
        '\n' +
        'FileName=OR_OSSC.22' +
        '\n' +
        'Closure=' +
        values.enclosure +
        '\n' +
        'Zone=' +
        values.seismicCategory +
        '\n' +
        'Import_Seis=' +
        values.seismicFactor +
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
        values.exposure +
        '\n' +
        'Country=----' +
        '\n' +
        'Local=OSSC 19' +
        '\n' +
        'FileName=OR_OSSC.19' +
        '\n' +
        'Closure=' +
        values.enclosure +
        '\n' +
        'Zone=' +
        values.seismicCategory +
        '\n' +
        'Import_Seis=' +
        values.seismicFactor +
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
        values.exposure +
        '\n' +
        'Country=----' +
        '\n' +
        'Local=CBC  22' +
        '\n' +
        'FileName=CA_CBC.22' +
        '\n' +
        'Closure=' +
        values.enclosure +
        '\n' +
        'Zone=' +
        values.seismicCategory +
        '\n' +
        'Import_Seis=' +
        values.seismicFactor +
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
        values.exposure +
        '\n' +
        'Country=----' +
        '\n' +
        'Local=CBC  19' +
        '\n' +
        'FileName=CA_CBC.19' +
        '\n' +
        'Closure=' +
        values.enclosure +
        '\n' +
        'Zone=' +
        values.seismicCategory +
        '\n' +
        'Import_Seis=' +
        values.seismicFactor +
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
      values.quoteNumber + bldgAlpha[index].trim(),
      {
        create: false,
      }
    );

    const desCtrlHandle = await newBuildingHandle.getFileHandle('DESCTRL.INI', {
      create: true,
    });
    const writable = await desCtrlHandle.createWritable();

    // Job Info
    await writable.write(`[JOB_ID]\n`);
    await writable.write(`JOB_ID=${values.quoteNumber}\n`);
    await writable.write(`VERSION=2.0000\n`);
    await writable.write(`\n`);

    // Wall and Base Options
    await writable.write(`[WALL_OPTIONS1]\n`);
    console.log('index', index);
    await writable.write(`${getGirtTypes(values.buildings[index], 'lew')}\n`);
    await writable.write(`\n`);
    await writable.write(`[WALL_OPTIONS2]\n`);
    await writable.write(`${getGirtTypes(values.buildings[index], 'fsw')}\n`);
    await writable.write(`\n`);
    await writable.write(`[WALL_OPTIONS3]\n`);
    await writable.write(`${getGirtTypes(values.buildings[index], 'rew')}\n`);
    await writable.write(`\n`);
    await writable.write(`[WALL_OPTIONS4]\n`);
    await writable.write(`${getGirtTypes(values.buildings[index], 'bsw')}\n`);
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
    await writable.write(`${getGirtTypes(values.buildings[index], 'base')}\n`);
    await writable.write(`\n`);

    for (let i = 1; i <= 4; i++) {
      await writable.write(`[BASE_OPTIONS${i}]\n`);
      await writable.write(
        `${await getGirtTypes(values.buildings[index], 'base')}\n`
      );
      await writable.write(`\n`);
    }

    // Steel Yield
    await writable.write(`[STEEL_YIELD]\n`);
    await writable.write(`Hot=50.0000\n`);
    await writable.write(`Cold=55.0000\n`);
    await writable.write(
      `Wall_Panel=${getPanelYield(values.buildings[index], 'wall')}\n`
    );
    await writable.write(
      `Roof_Panel=${getPanelYield(values.buildings[index], 'roof')}\n`
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
    await writable.write(`Rig_Frm_Seis=${values.seismicDeflection}\n`);
    await writable.write(
      `${values.seismicDeflection < 80 ? 'Wind_Bent_Seis=80.0000' : 'Wind_Bent_Seis=' + values.seismicDeflection}\n`
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
    await writable.write(`${bldgBuildingCode[values.buildingCode]}\n`);
    await writable.write(`\n`);

    // Building Loads
    await writable.write(`[BUILDING_LOADS]\n`);
    await writable.write(`Dead=${values.deadLoad}\n`);
    await writable.write(`Live=${values.liveLoad}\n`);
    await writable.write(`Snow=${values.roofLoad}\n`);
    await writable.write(`Collateral=${values.collateralLoad}\n`);
    await writable.write(`Wind_Speed=${values.windLoad}\n`);
    await writable.write(`Reduce=N\n`);
    await writable.write(`Za=${values.sesimicSms || ''}\n`);
    await writable.write(`\n`);

    // Building Shape
    await writable.write(`[BUILDING_SHAPE]\n`);
    await writable.write(
      `${values.buildings[index] == 'leanTo' || values.buildings[index] == 'leanTo' ? 'Type=LT-' : 'Type=FF-'}\n`
    );
    await writable.write(`Width=${values.buildings[index].width}\n`);
    await writable.write(`Length=${values.buildings[index].length}\n`);
    await writable.write(`HeightL=${values.buildings[index].backEaveHeight}\n`); //todo: correct all eave heights to be singular
    await writable.write(
      `HeightR=${values.buildings[index].frontEaveHeight}\n`
    ); //todo: correct all eave heights to be singular
    await writable.write(`PeakOff=${values.buildings[index].backPeakOffset}\n`);
    await writable.write(`Slope=${values.buildings[index].backRoofPitch}\n`);
    await writable.write(`\n`);

    // Expand Endwall
    await writable.write(`[EXPAND_EW1]\n`);
    await writable.write(
      `${getEndFrameTypeData(values.buildings[index], 'lew')}\n`
    );

    await writable.write(`[EXPAND_EW3]\n`);
    await writable.write(
      `${getEndFrameTypeData(values.buildings[index], 'rew')}\n`
    );

    // Bay Spacing
    await writable.write(`[BAY_SPACING_WALL1]\n`);
    await writable.write(
      `${formatBaySpacing(values.buildings[index].lewBaySpacing)}\n`
    );

    await writable.write(`[BAY_SPACING_WALL2]\n`);
    await writable.write(
      `${formatBaySpacing(values.buildings[index].swBaySpacing)}\n`
    );

    await writable.write(`[BAY_SPACING_WALL3]\n`);
    await writable.write(
      `${formatBaySpacing(values.buildings[index].rewBaySpacing)}\n`
    );

    await writable.write(`[BAY_SPACING_WALL4]\n`);
    await writable.write(
      `${formatBaySpacing(values.buildings[index].swBaySpacing)}\n`
    );

    await writable.write(`[BAY_SPACING_WALL5]\n`);
    await writable.write(
      `${formatBaySpacing(values.buildings[index].swBaySpacing)}\n`
    );

    if (values.buildings[index].lewFrame == 'inset') {
      await writable.write(`[BAY_SPACING_WALL6]\n`);
      await writable.write(
        `${formatBaySpacing(values.buildings[index].width)}\n`
      ); //todo: I think you need to pass in array of inset wall
    }

    if (values.buildings[index].rewFrame == 'inset') {
      await writable.write(`[BAY_SPACING_WALL7]\n`);
      await writable.write(
        `${formatBaySpacing(values.buildings[index].width)}\n`
      ); //todo: I think you need to pass in array of inset wall
    }

    // Framed Openings
    // todo: set up framed openings before writing to DesCtrl.ini
    for (let i = 1; i <= 4; i++) {
      await writable.write(`[FRAMED_OPENINGS_WALL${i}]\n`);
      await writable.write(
        `${getFramedOpenings(values.buildings[index], walls[i], 0)}\n`
      );
    }

    // Endwall Framing
    await writable.write(`[ENDWALL_FRAMING1]\n`);
    await writable.write(`Corner_Col_Type=RW\n`);
    await writable.write(
      `Corner_Col_Rotate1=${getCornerColRotating(values.buildings[index], 'backLeft')}\n`
    );
    await writable.write(
      `Corner_Col_Rotate2=${getCornerColRotating(values.buildings[index], 'frontLeft')}\n`
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
      `Corner_Col_Rotate1=${getCornerColRotating(values.buildings[index], 'frontRight')}\n`
    );
    await writable.write(
      `Corner_Col_Rotate2=${getCornerColRotating(values.buildings[index], 'backRight')}\n`
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
        `Type=${getGirtType(values.buildings[index], walls[i])}\n`
      );
      await writable.write(`Flg_Brace_Use=Y\n`);
      await writable.write(`Flg_Brace_Supply=Y\n`);
      await writable.write(`Offset=0.0000\n`);
      await writable.write(
        `Project=${getGirtProject(values.buildings[index], walls[i])}\n`
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
        `${setGirtSpacing(values.buildings[index], walls[i], values.groundLoad)}\n`
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
      `Set_Depth=${getPurlinDepth(values.buildings[index])}\n`
    );
    await writable.write(`Set_Lap=0.0000\n`);
    await writable.write(`\n`);

    if (
      values.buildings[index].shape != 'leanTo' &&
      values.buildings[index].shape != 'singleSlope'
    ) {
      await writable.write(`[ROOF_PURLINS_SURF3]\n`);
      await writable.write(`Type=ZB\n`);
      await writable.write(`Flg_Brace_Use=Y\n`);
      await writable.write(`Flg_Brace_Supply=Y\n`);
      await writable.write(`Offset=0.0000\n`);
      await writable.write(`Project=0.0000\n`);
      await writable.write(
        `Set_Depth=${getPurlinDepth(values.buildings[index])}\n`
      );
      await writable.write(`Set_Lap=0.0000\n`);
      await writable.write(`\n`);
    }

    // Eave Struts
    await writable.write(`[EAVE_STRUT_WALL2]\n`);
    values.buildings[index].backRoofPitch > 4
      ? await writable.write(`Type=ZO\n`)
      : await writable.write(`Type=EO\n`);
    await writable.write(`\n`);

    await writable.write(`[EAVE_STRUT_WALL4]\n`);
    if (values.buildings[index].shape == 'nonSymmetrical') {
      values.buildings[index].frontRoofPitch > 4
        ? await writable.write(`Type=ZO\n`)
        : await writable.write(`Type=EO\n`);
    } else {
      values.buildings[index].backRoofPitch > 4
        ? await writable.write(`Type=ZO\n`)
        : await writable.write(`Type=EO\n`);
    }
    await writable.write(`\n`);

    // Roof Purlin Space
    await writable.write(`[ROOF_PURLIN_SPACE_SURF2]\n`);
    values.buildings[index].shape == 'singleSlope'
      ? await writable.write(`Peak_Space=0.0000\n`)
      : await writable.write(`Peak_Space=1.0000\n`);
    await writable.write(`Max_Space=5.0000\n`);
    await writable.write(
      `Set_Space=${setPurlinSpacing(values.buildings[index])}\n`
    );
    await writable.write(`${getGableExtension(values.buildings[index])}\n`);

    if (
      values.buildings[index].shape != 'leanTo' &&
      values.buildings[index].shape != 'singleSlope'
    ) {
      await writable.write(`[ROOF_PURLIN_SPACE_SURF3]\n`);
      await writable.write(`Peak_Space=1.0000\n`);
      await writable.write(`Max_Space=5.0000\n`);
      await writable.write(
        `Set_Space=${setPurlinSpacing(values.buildings[index])}\n`
      );
      await writable.write(`${getGableExtension(values.buildings[index])}\n`);
    }

    // Wall Panel
    const wallChars = ' 1234';
    for (let i = 0; i <= 4; i++) {
      await writable.write(`[WALL_PANEL${wallChars[i].trim()}]\n`);
      await writable.write(
        `Type=${getPanelType(values.buildings[index], 'wall')}\n`
      );
      await writable.write(
        `Part=${getPanelPart(values.buildings[index], 'wall')}\n`
      );
      await writable.write(
        `Gage=${getPanelGauge(values.buildings[index], 'wall')}\n`
      );
      await writable.write(
        `Yield=${getPanelYield(values.buildings[index], 'wall')}\n`
      );
      await writable.write(
        `Wall_Color=${getPanelColor(values.buildings[index], 'wall')}\n`
      );
      await writable.write(`Wall_Style=\n`);
      await writable.write(
        `Eave_Color=${getPanelColor(values.buildings[index], 'wall')}\n`
      );
      await writable.write(`Eave_Style=--\n`);
      await writable.write(
        `Corner_Color=${getPanelColor(values.buildings[index], 'wall')}\n`
      );
      await writable.write(`Corner_Style=\n`);
      await writable.write(
        `Jamb_Color=${getPanelColor(values.buildings[index], 'wall')}\n`
      );
      await writable.write(`Jamb_Style=\n`);
      await writable.write(
        `Screw_Type=${getScrewLength(values.buildings[index], 'wall')}\n`
      );
      await writable.write(`Screw_Finish=--\n`);
      await writable.write(
        `${getInsulation(values.buildings[index], 'wall')}\n`
      );
      await writable.write(`\n`);
    }

    // Roof Panel
    await writable.write(`[ROOF_PANEL]\n`);
    await writable.write(
      `Type=${getPanelType(values.buildings[index], 'roof')}\n`
    );
    await writable.write(
      `Part=${getPanelPart(values.buildings[index], 'roof')}\n`
    );
    await writable.write(
      `Gage=${getPanelGauge(values.buildings[index], 'roof')}\n`
    );
    await writable.write(
      `Yield=${getPanelYield(values.buildings[index], 'roof')}\n`
    );
    await writable.write(
      `Roof_Color=${getPanelColor(values.buildings[index], 'roof')}\n`
    );
    await writable.write(`Roof_Style=\n`);
    await writable.write(
      `Gable_Color=${getPanelColor(values.buildings[index], 'roof')}\n`
    );
    await writable.write(`Gable_Style=--\n`);
    await writable.write(
      `Screw_Type=${getScrewLength(values.buildings[index], 'roof')}\n`
    );
    await writable.write(`Screw_Finish=--\n`);
    await writable.write(`${getInsulation(values.buildings[index], 'roof')}\n`);
    await writable.write(
      `${getStandingSeamClips(values.buildings[index], 'roof', '')}\n`
    );
    await writable.write(`\n`);

    // No Frames
    await writable.write(`[NO_FRAMES]\n`);
    await writable.write(`${getRigidFrames(values.buildings[index])}\n`);

    // Wind Framing
    for (let i = 1; i <= 4; i++) {
      await writable.write(`[WIND_FRAMING_WALL${i}]\n`);
      await writable.write(`Panel_Shear=N\n`);
      await writable.write(
        `${getBracing(values.buildings[index], walls[i])}\n`
      );
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
    await writable.write(`${getBracing(values.buildings[index], 'roof')}\n`);
    await writable.write(`\n`);

    await writable.write(`[WIND_FRAMING_INT]\n`);
    await writable.write(`Panel_Shear=N\n`);
    await writable.write(
      `${getBracing(values.buildings[index], 'interior')}\n`
    );
    await writable.write(`Wind_Column=N\n`);
    await writable.write(`Weak_Axis_Bend=N\n`);
    await writable.write(`\n`);

    // Wind Bracing
    for (let i = 1; i <= 4; i++) {
      await writable.write(`[WIND_BRACING_WALL${i}]\n`);
      await writable.write(
        `${getXBracingBays(values.buildings[index], walls[i])}\n`
      );
    }

    // todo: left off here
    await writable.write(`[WIND_BRACING_ROOF]\n`);
    await writable.write(
      `${getXBracingBays(values.buildings[index], 'roof')}\n`
    );

    // Wind Bents
    for (let i = 1; i <= 4; i++) {
      await writable.write(`[WIND_BENT_WALL${i}]\n`);
      if (i == 2 || i == 4) {
        await writable.write(
          `${await getPortalBays(values.buildings[index], walls[i])}\n`
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
      `${await getEaveExtension(values.buildings[index], 'Front')}\n`
    );
    await writable.write(`[EAVE_EXTENSION_WALL4]\n`);
    await writable.write(
      `${await getEaveExtension(values.buildings[index], 'Back')}\n`
    );

    // Gutters
    await writable.write(`[GUTTER_DOWNSPOUTS]\n`);
    await writable.write(`${await getDownspouts(values.buildings[index])}\n`);
    await writable.write(`[GUTTERS]\n`);
    await writable.write(`${await getGutters(values.buildings[index])}\n`);

    // Relites
    await writable.write(`[WALL_LIGHT_PANELS]\n`);
    await writable.write(
      `${await getRelites(values.buildings[index], 'Wall')}\n`
    );
    await writable.write(`[ROOF_LIGHT_PANELS]\n`);
    await writable.write(
      `${await getRelites(values.buildings[index], 'Roof')}\n`
    );

    // Doors
    await writable.write(`[DOORS]\n`);
    await writable.write(`${await getManDoors(values.buildings[index])}\n`);
    await writable.write(`\n`);

    // Accessories
    await writable.write(`[ADDITIONAL_ITEMS]\n`);
    await writable.write(`No_Add=0\n`);
    await writable.write(`\n`);

    await writable.write(`[ACCESSORY_ITEMS]\n`);
    await writable.write(`${await getAccessories(values.buildings[index])}\n`);
    await writable.write(`\n`);

    await writable.write(`${await setLinerPanels(values.buildings[index])}\n`);

    // Properties Walls
    await writable.write(`[NO_PROPERTIES_WALL]\n`);
    await writable.write(`Number=4\n`);
    await writable.write(`\n`);

    for (let i = 1; i <= 4; i++) {
      await writable.write(`[PROPERTIES_WALL${i}]\n`);
      await writable.write(
        `${await getWallLoads(values.buildings[index], walls[i])}\n`
      );
    }

    // Cranes
    await writable.write(`[CRANES]\n`);
    await writable.write(`No_Crane=0\n`);
    await writable.write(`\n`);

    // Est Items
    await writable.write(`[ESTIMATE_ITEMS]\n`);
    await writable.write(
      `${await getCoverAccessories(values.buildings[index])}\n`
    );

    // Canopies
    for (let i = 1; i <= 4; i++) {
      await writable.write(`[CANOPY_WALL${i}]\n`);
      await writable.write(
        `${await setCanopies(values.buildings[index], walls[i])}\n`
      );
    }

    // Additional Loads
    await writable.write(`[ADDITIONAL_LOADS]\n`);
    await writable.write(
      `${await getAdditionalLoads(values.buildings[index])}\n`
    );
    await writable.write(`\n`);

    // Facia
    await writable.write(`[LOAD_FACIA]\n`);
    await writable.write(`Dead=2.5000\n`);
    await writable.write(`Live_SW=${values.roofLoad * 2}\n`);
    await writable.write(`Live_EW=${values.roofLoad * 2}\n`);
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
    await writable.write(`${await getPartitions(values.buildings[index])}\n`);

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
    await writable.write(`${await getWideOpenings(values.buildings[index])}\n`);
    await writable.write(`\n`);

    await writable.write(`[NO_WIDE_EW_OPENING]\n`);
    await writable.write(
      `${await getWideEWOpenings(values.buildings[index])}\n`
    );
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
        `${await setPartialWalls(values.buildings[index], walls[i])}\n`
      );
    }

    // Wainscot Walls
    for (let i = 1; i <= 4; i++) {
      await writable.write(`[WAINSCOT_WALL${i}]\n`);
      await writable.write(
        `${await setWainscot(values.buildings[index], walls[i])}\n`
      );
    }

    // Floor
    await writable.write(`[FLOOR_VERSION]\n`);
    await writable.write(`Version=1.06\n`);
    await writable.write(`\n`);

    // Floor Layout
    await writable.write(`[FLOOR_LAYOUT]\n`);
    await writable.write(`${await getMezzanines(values.buildings[index])}\n`);

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

  function getFramedOpenings(building, wall, index) {
    // console.log(building);
    // console.log(wall);
    // console.log(index);
    return '';
  }

  function getCornerColRotating(building, corner) {
    let returnValue = '-';

    if (
      (corner == 'backLeft' || corner == 'frontLeft') &&
      building.lewFrame == 'postAndBeam'
    ) {
      return returnValue;
    }
    if (
      (corner == 'frontRight' || corner == 'backRight') &&
      building.rewFrame == 'postAndBeam'
    ) {
      return returnValue;
    }

    // todo: Add Portal Frames, X-Bracing, and Overhead Door conditions

    return returnValue;
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
      roofLoad,
      fswPolyQty,
      bswPolyQty,
      lewPolyQty,
      rewPolyQty,
      fswPolySize,
      bswPolySize,
      lewPolySize,
      rewPolySize,
    } = building;

    let girtType = wall == 'lew' || wall == 'rew' ? 'S' : 'P';
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

    if (wall == 'bsw') {
      highestPt = backEaveHeight;
    }
    if (wall == 'fsw') {
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

    if (wall == 'lew' || wall == 'rew') {
      highestPt = highestBldgPt;
    }

    highestPt = Math.floor(highestPt);
    highestBldgPt = Math.floor(highestBldgPt);

    // Keep girts out of the purlin and rafter space
    highestPt -= wall == 'lew' || wall == 'rew' ? 1.5 : 0.8333;
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
      } else if (groundLoad >= 50 || roofLoad >= 35) {
        numGirts++;
        returnValue += `Loc${numGirts}=4.0000\n`;
      }
      numGirts++;
      returnValue += `Loc${numGirts}=7.5000\n`;

      // Add relite girt
      if (wall == 'fsw' && fswPolyQty) {
        numGirts++;
        returnValue += `Loc${numGirts}=${frontEaveHeight - fswPolySize + 0.1667}\n`;
      } else if (wall == 'bsw' && bswPolyQty) {
        numGirts++;
        returnValue += `Loc${numGirts}=${backEaveHeight - bswPolySize + 0.1667}\n`;
      }
    }

    if (interval > 0) {
      let i = interval;

      if (building[girtSpacingKey] == 'fullPly') {
        numGirts++;
        returnValue += `Loc${numGirts}=3.8958\n`;
        i = 7.8958;
      }

      if (fswPolyQty || bswPolyQty || lewPolyQty || rewPolyQty) {
        reliteHt[0] = bswPolyQty ? backEaveHeight - bswPolySize + 0.1667 : 0;
        reliteHt[1] = fswPolyQty ? frontEaveHeight - fswPolySize + 0.1667 : 0;
        if (backEaveHeight < frontEaveHeight) {
          reliteHt[2] = lewPolyQty ? backEaveHeight - lewPolySize + 0.1667 : 0;
          reliteHt[3] = rewPolyQty ? backEaveHeight - rewPolySize + 0.1667 : 0;
        } else {
          reliteHt[2] = lewPolyQty ? frontEaveHeight - lewPolySize + 0.1667 : 0;
          reliteHt[3] = rewPolyQty ? frontEaveHeight - rewPolySize + 0.1667 : 0;
        }
        reliteHt.sort();
      }

      while (i < highestPt) {
        numGirts++;
        returnValue += `Loc${numGirts}=${i.toFixed(4)}\n`;

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
    const { lewExtensionWidth, rewExtensionWidth, soffitPanelType } = building;

    returnValue += `Surf_Extend_Lt=${lewExtensionWidth}\n`;
    returnValue += `Surf_Extend_Rt=${rewExtensionWidth}\n`;

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
      (loc == 'Roof' || loc == 'CanopyRoof') &&
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
    let locTypeKey = `${loc}PanelType`;
    let locGaugeKey = `${loc}PanelGauge`;
    if (loc.includes('partition')) {
      // panel = building.partition
    } else {
      panel = building[locTypeKey];
      gauge = building[locGaugeKey];
    }
    return getPanelData(panel, gauge, loc)[1];
  }

  function getPanelType(building, loc) {
    let panel = '';
    let gauge = '';
    let locTypeKey = `${loc}PanelType`;
    let locGaugeKey = `${loc}PanelGauge`;
    if (loc.includes('partition')) {
      // panel = building.partition[]
    } else {
      panel = building[locTypeKey];
      gauge = building[locGaugeKey];
    }
    return getPanelData(panel, gauge, loc)[0];
  }

  function getPanelGauge(building, loc) {
    let panel = '';
    let gauge = '';
    let locTypeKey = `${loc}PanelType`;
    let locGaugeKey = `${loc}PanelGauge`;
    if (loc.includes('partition')) {
      // panel = building.partition[]
    } else {
      panel = building[locTypeKey];
      gauge = building[locGaugeKey];
    }
    return getPanelData(panel, gauge, loc)[2];
  }

  function getPanelColor(building, loc) {
    let returnValue = '';
    const panelColorKey = `${loc}PanelFinish`;
    if (loc.includes('partition')) {
      // returnValue = '';
    } else {
      returnValue = building[panelColorKey] == 'galvalume' ? 'GV' : 'NC';
    }
    return returnValue;
  }

  function getScrewLength(building, loc) {
    let returnValue = 'M';
    let insKey = `${loc}Insulation`;

    returnValue =
      building[insKey] == 'vrr4' || building[insKey] == 'vrr6'
        ? 'L'
        : returnValue;

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
      swBaySpacing,
      lewBaySpacing,
      rewBaySpacing,
      lewIntColSpacing,
      rewIntColSpacing,
      intColSpacing,
      straightExtColumns,
      lewInset,
      rewInset,
    } = building;

    let numFrames = 0;
    let tribIds = '';
    let numTribs = new Array();
    let numBays = swBaySpacing.length;
    let leftEndFrame = getEndFrameType(building, 'lew');
    let rightEndFrame = getEndFrameType(building, 'rew');

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
    if ((leftEndFrame == 'Y' || leftEndFrame == 'F') && lewIntColSpacing) {
      if (Math.max(...lewIntColSpacing) <= 30) {
        leftShape = 'R';
      }
    }

    // M-Frame <= 30
    if (frameType == 'multiSpan' && intColSpacing) {
      if (Math.max(...intColShape) <= 30) {
        frameShape = 'R';
      }
    }

    // REW M-Frame <= 30'-0"
    if ((rightEndFrame == 'Y' || rightEndFrame == 'F') && rewIntColSpacing) {
      if (Math.max(...rewIntColSpacing) <= 30) {
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
            `${formatIntCols(lewIntColSpacing)}\n`;
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
            `${formatIntCols(lewIntColSpacing)}\n`;
        }
      }
    }

    // Left Inset Frame
    if (leftEndFrame != 'N' && leftEndFrame != 'Y' && leftEndFrame != 'F') {
      if (lewInset > 1) {
        numFrames++;
        numTribs.length = 0;
        tribIds = '';
        for (let i = 1; i < lewInset; i++) {
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
        `Width=${getTribs(building, lewInset + 1)}\n` +
        `Column_Shape=${leftShape}\n` +
        `Connect_Left=P\n` +
        `Connect_Right=P\n` +
        `Rafter_Shape=${leftShape}\n` +
        `Symmetry=${sym}\n` +
        `Id1=${lewInset + 1}\n\n`;

      returnIntValue +=
        `[INT_COLUMN_FRAME${numFrames}]\n` +
        `Type=${intColShape}\n` +
        `Connect_Bot=P\n` +
        `Connect_Top=P\n` +
        `Rotate=Y\n` +
        `Shape=C\n` +
        `Elev=0.0000\n` +
        `${formatIntCols(lewIntColSpacing)}\n`;
    }

    // Interior Frames
    let startInt =
      leftEndFrame != 'N' && leftEndFrame != 'Y' && leftEndFrame != 'F'
        ? lewInset + 2
        : 2;
    let endInt =
      rightEndFrame != 'N' && rightEndFrame != 'Y' && rightEndFrame != 'F'
        ? numBays - rewInset
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
        `Type=${frameType}\n` +
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
        `Width=${getTribs(building, numBays - (rewInset + 1))}\n` +
        `Column_Shape=${rightShape}\n` +
        `Connect_Left=P\n` +
        `Connect_Right=P\n` +
        `Rafter_Shape=${rightShape}\n` +
        `Symmetry=${sym}\n` +
        `Number=1\n` +
        `Id1=${numBays - (rewInset + 1)}\n\n`;

      returnIntValue +=
        `[INT_COLUMN_FRAME${numFrames}]\n` +
        `Type=${intColShape}\n` +
        `Connect_Bot=P\n` +
        `Connect_Top=P\n` +
        `Rotate=Y\n` +
        `Shape=C\n` +
        `Elev=0.0000\n` +
        `${formatIntCols(rewIntColSpacing)}\n`;

      if (rewInset > 1) {
        numFrames++;
        numTribs.length = 0;
        tribIds = '';
        for (let i = 1; i < rewInset; i++) {
          numTribs.push(numBays - rewInset + i + 1);
          tribIds += `Id${i}=${numBays - rewInset + i + 1}\n`;
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
            `${formatIntCols(rewIntColSpacing)}\n`;
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
            `${formatIntCols(rewIntColSpacing)}\n`;
        }
      }
    }

    // Interior Columns
    returnValue = `No_Frames=${numFrames}\n\n` + returnValue + returnIntValue;
    return returnValue;
  }

  function getTribs(building, num) {
    const {
      swBaySpacing,
      lewFrame,
      lewExtensionWidth,
      rewFrame,
      rewExtensionWidth,
    } = building;
    let returnValue = '';
    let leftSide = '';
    let rightSide = '';
    let bays = swBaySpacing;

    if (num == 1) {
      leftSide = getEndFrameOffset(building, 'lew') / 12 + lewExtensionWidth;
      if (bays.length > 1) {
        rightSide = (bays[0] - getEndFrameOffset(building, 'lew') / 12) / 2;
      } else {
        if (rewFrame != 'postAndBeam') {
          rightSide =
            (bays[0] -
              getEndFrameOffset(building, 'lew') / 12 -
              getEndFrameOffset(building, 'rew') / 12) /
            2;
        } else {
          rightSide = (bays[0] - getEndFrameOffset(building, 'lew') / 12) / 2;
        }
      }
    } else if (num == bays.length + 1) {
      rightSide = getEndFrameOffset(building, 'rew') / 12 + rewExtensionWidth;
      if (bays.length > 1) {
        leftSide =
          (bays[bays.length - 1] - getEndFrameOffset(building, 'rew') / 12) / 2;
      } else {
        if (lewFrame != 'postAndBeam') {
          leftSide =
            (bays[0] -
              getEndFrameOffset(building, 'rew') / 12 -
              getEndFrameOffset(building, 'lew') / 12) /
            2;
        } else {
          leftSide = (bays[0] - getEndFrameOffset(building, 'rew') / 12) / 2;
        }
      }
    } else {
      if (num == 2 && bays.length > 1) {
        if (lewFrame != 'postAndBeam') {
          leftSide = (bays[0] - getEndFrameOffset(building, 'lew') / 12) / 2;
        } else {
          leftSide = bays[0] / 2;
        }
      } else {
        leftSide = bays[num - 2] / 2;
      }

      if (num == bays.length && bays.length > 1) {
        if (rewFrame != 'postAndBeam') {
          rightSide =
            (bays[num - 1] - getEndFrameOffset(building, 'rew') / 12) / 2;
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

    for (let i = 0; i < bays.length - 1; i++) {
      returnValue += `Loc${i + 1}=${bays[i]}\n`;
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

    if (loc == 'lew' || loc == 'rew') {
      if (building[braceKey] == 'none') {
        returnValue = `Bracing=N\n` + `Wind_Bent=N`;
      } else if (building[braceKey] == 'xBrace') {
        returnValue = `Bracing=CR\n` + `Wind_Bent=N`;
      } else if (building[braceKey] == 'angle') {
        returnValue = `Bracing=A\n` + `Wind_Bent=N`;
      }
      return returnValue;
    }

    if (loc == 'fsw' || loc == 'bsw' || loc == 'interior') {
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

    if (loc == 'lew' || loc == 'rew') {
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

    if (loc == 'fsw' || loc == 'bsw' || loc == 'interior') {
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

  async function getPortalBays(building, wall) {
    // console.log(building);
    // console.log(wall);
    return '';
  }

  async function getEaveExtension(building, wall) {
    // console.log(building);
    // console.log(wall);
    return '';
  }

  async function getDownspouts(building) {
    // console.log(building);
    return '';
  }

  async function getGutters(building) {
    // console.log(building);
    return '';
  }

  async function getRelites(building, wall) {
    // console.log(building);
    // console.log(wall);
    return '';
  }

  async function getManDoors(building) {
    // console.log(building);
    return '';
  }

  async function getAccessories(building) {
    // console.log(building);
    return '';
  }

  async function setLinerPanels(building) {
    // console.log(building);
    return '';
  }

  async function getWallLoads(building, wall) {
    // console.log(building);
    // console.log(wall);
    return '';
  }

  async function getCoverAccessories(building) {
    // console.log(building);
    return '';
  }

  async function setCanopies(building, wall) {
    // console.log(building);
    // console.log(wall);
    return '';
  }

  async function getAdditionalLoads(building) {
    // console.log(building);
    return '';
  }

  async function getPartitions(building) {
    // console.log(building);
    return '';
  }

  async function getWideOpenings(building) {
    // console.log(building);
    return '';
  }

  async function getWideEWOpenings(building) {
    // console.log(building);
    return '';
  }

  async function setPartialWalls(building, wall) {
    // console.log(building);
    // console.log(wall);
    return '';
  }

  async function setWainscot(building, wall) {
    // console.log(building);
    // console.log(wall);
    return '';
  }

  async function getMezzanines(building) {
    // console.log(building);
    return '';
  }

  return {
    createFolderAndFiles,
    status,
    isExporting,
  };
}
