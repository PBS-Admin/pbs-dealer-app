'use client';
import React, { useState } from 'react';

const CsvWriter = () => {
  const [status, setStatus] = useState('');

  const createCsvContent = () => {
    // Sample CSV content
    return 'Name,Age,Job\nJohn Doe,30,Developer\nJane Smith,28,Designer\n';
  };

  const writeCsvFile = async () => {
    if (!('showSaveFilePicker' in window)) {
      setStatus('Your browser does not support the File System Access API');
      return;
    }

    try {
      // Ask the user to select where to save the file
      const handle = await window.showSaveFilePicker({
        suggestedName: 'jobs.csv',
        types: [
          {
            description: 'CSV File',
            accept: { 'text/csv': ['.csv'] },
          },
        ],
      });

      // Create a writable stream
      const writable = await handle.createWritable();

      // Write the CSV content
      await writable.write(createCsvContent());

      // Close the file and write the contents to disk
      await writable.close();

      setStatus('File successfully saved!');
    } catch (err) {
      console.error('Error writing file:', err);
      setStatus('Error saving file. Please try again.');
    }
  };

  return (
    <div>
      <h1>CSV Writer</h1>
      <button onClick={writeCsvFile}>Save CSV File</button>
      <p>{status}</p>
    </div>
  );
};

export default CsvWriter;
