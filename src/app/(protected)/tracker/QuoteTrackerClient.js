'use client';

import { useState, useCallback } from 'react';
import { redirect } from 'next/navigation';
import QuoteTable from '@/components/QuoteTable';
import QuoteTableEst from '@/components/QuoteTableEst';
import styles from './page.module.css';
import { useSession } from 'next-auth/react';

export default function QuoteTrackerClient() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  const isEstimator = session?.user?.estimator === 1;

  return <>{isEstimator ? <QuoteTableEst /> : <QuoteTable />}</>;
}
