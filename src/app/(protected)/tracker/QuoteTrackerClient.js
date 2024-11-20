'use client';

import { useState, useCallback } from 'react';
import QuoteTable from '@/components/QuoteTable';
import QuoteTableEst from '@/components/QuoteTableEst';
import styles from './page.module.css';

export default function QuoteTrackerClient({ isEstimator }) {
  const [showEstimatorView, setShowEstimatorView] = useState(true);

  const handleViewChange = useCallback((e) => {
    setShowEstimatorView(e.target.checked);
  }, []);

  const estimatorControls = isEstimator ? (
    <div className={styles.estBox}>
      <input
        type="checkbox"
        id="estimator"
        checked={showEstimatorView}
        onChange={handleViewChange}
        className="mr-2"
      />
      <label htmlFor="estimator">View as Estimator</label>
    </div>
  ) : null;

  return (
    <>
      {estimatorControls}
      {showEstimatorView && isEstimator ? <QuoteTableEst /> : <QuoteTable />}
    </>
  );
}
