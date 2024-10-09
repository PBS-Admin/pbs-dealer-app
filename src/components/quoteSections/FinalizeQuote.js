import React from 'react';
import { useExport } from '@/hooks/useExport';
import ReusableLoader from '../ReusableLoader';

const FinalizeQuote = ({ values, handleChange }) => {
  const { createFolderAndFiles, status, isExporting } = useExport();

  const handleExport = async () => {
    console.log(values);
    const result = await createFolderAndFiles(values);
    if (result) {
      console.log('Export successful');
    } else {
      console.log('Export failed');
    }
  };

  return (
    <>
      <section className="card start">
        <header className="cardHeader">
          <h3>Finalize Quote</h3>
        </header>
        <div className="cardGrid">
          <div className="cardInput">
            <button type="submit" className="button success">
              Save Quote
            </button>
            <button
              type="button"
              className="button accent"
              onClick={() => {
                alert('This is not built yet');
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
        </div>
      </section>
      <ReusableLoader isOpen={isExporting} title="Loading" message={status} />
    </>
  );
};

export default FinalizeQuote;
