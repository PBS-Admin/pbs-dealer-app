'use client';

import { useState, useCallback } from 'react';

export function useExport() {
  const [status, setStatus] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const createFolderAndFiles = useCallback(async (values) => {
    if (typeof window === 'undefined' || !('showDirectoryPicker' in window)) {
      setStatus('File System Access API is not supported in this environment.');
      return false;
    }

    setIsExporting(true);
    setStatus('Starting export...');

    try {
      // Request permission to access a directory
      const dirHandle = await window.showDirectoryPicker();

      // Create a new folder
      const newFolderHandle = await dirHandle.getDirectoryHandle(
        values.folderName == '' ||
          values.folderName == null ||
          values.folderName == undefined
          ? 'New Quote Folder'
          : values.folderName,
        {
          create: true,
        }
      );

      // Create and write to a file in the new folder
      const fileHandle = await newFolderHandle.getFileHandle('MBS.in', {
        create: true,
      });
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(values));
      await writable.close();

      setStatus('Export completed successfully!');
      return true;
    } catch (error) {
      setStatus(`Error during export: ${error.message}`);
      return false;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    createFolderAndFiles,
    status,
    isExporting,
  };
}
