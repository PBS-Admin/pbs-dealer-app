// app/hooks/useMbsProcessor.js
'use client';

import { useState } from 'react';
import path from 'path';

export function useMbsProcessor() {
  const [mbsStatus, setMbsStatus] = useState('idle');
  const [error, setError] = useState(null);

  async function runMbsProcess(mbsFolder) {
    try {
      const inputFile = `${mbsFolder}\\DESCTRL.IN`;
      const outputFile = `${mbsFolder}\\DESCTRL.INI`;

      const response = await fetch('/api/mbs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputFilePath: inputFile,
          outputFilePath: outputFile,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error('Error running MBS:', error);
      throw error;
    }
  }

  async function handleProcessFiles(mbsFolder) {
    try {
      setMbsStatus('processing');
      setError(null);

      const result = await runMbsProcess(mbsFolder);

      setMbsStatus('completed');
      return result;
    } catch (error) {
      setMbsStatus('error');
      setError(error.message);
      throw error;
    }
  }

  return {
    handleProcessFiles,
    mbsStatus,
    error,
  };
}
