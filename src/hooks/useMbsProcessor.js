// app/hooks/useMbsProcessor.js
'use client';

import { useState } from 'react';

export function useMbsProcessor() {
  const [mbsStatus, setMbsStatus] = useState('idle');
  const [error, setError] = useState(null);

  async function runMbsProcess(mbsFolder) {
    try {
      const inputFile = `${mbsFolder}\\DESCTRL.IN`;
      const outputFile = `${mbsFolder}\\DESCTRL.INI`;

      console.log('Sending request with paths:', {
        input: inputFile,
        output: outputFile,
      });

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

      if (!response.ok) {
        throw new Error(
          `API Error: ${result.error}\nDetails: ${JSON.stringify(result.details || {})}`
        );
      }

      if (!result.success) {
        throw new Error(result.error || 'Unknown error occurred');
      }

      console.log('MBS process result:', result);
      return result;
    } catch (error) {
      console.error('Error running MBS:', error);
      throw new Error(`Failed to run MBS: ${error.message}`);
    }
  }

  async function handleProcessFiles(mbsFolder) {
    try {
      console.log('Processing files for folder:', mbsFolder);
      setMbsStatus('processing');
      setError(null);

      const result = await runMbsProcess(mbsFolder);

      setMbsStatus('completed');
      return result;
    } catch (error) {
      console.error('Process files error:', error);
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
