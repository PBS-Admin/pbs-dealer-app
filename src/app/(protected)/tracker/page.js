import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import styles from './page.module.css';
import PageHeader from '@/components/PageHeader';
import QuoteTable from '@/components/QuoteTable';
import { getQuotes, getQuote } from '@/util/quoteUtils';

export default async function Tracker() {
  console.log('Entering Tracker component');
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log('No session, redirecting to login');
    redirect('/login');
  }

  let quotes = [];
  let error = null;

  // todo This is for development code and should be commented out before going live
  // quotes = [
  //   {
  //     ID: 36,
  //     Submitted: 0,
  //     Quote: 13256,
  //     Rev: 0,
  //     Customer: 'Testing Cust 1',
  //     ProjectName: 'Testing Proj 1',
  //     DateStarted: '2024-09-13T20:24:00.000Z',
  //   },
  //   {
  //     ID: 37,
  //     Submitted: 0,
  //     Quote: 13257,
  //     Rev: 0,
  //     Customer: 'Testing Cust 2',
  //     ProjectName: 'Testing Proj 2',
  //     DateStarted: '2024-09-14T20:24:00.000Z',
  //   },
  //   {
  //     ID: 15,
  //     Submitted: 1,
  //     Quote: 13258,
  //     Rev: 0,
  //     Customer: 'Testing Cust 3',
  //     ProjectName: 'Testing Proj 3',
  //     DateStarted: '2024-09-15T20:24:00.000Z',
  //   },
  // ];

  // todo This is for production code and should be changed before going live
  try {
    const data = await getQuotes(
      session.user.company,
      session.user.accessToken
    );
    quotes = data.quotes;
  } catch (err) {
    console.error('Error fetching quotes:', err);
    error = err.message;
  }

  const handleCopyQuote = async (quoteId) => {
    'use server';
    try {
      const quoteData = await getQuote(quoteId, session.user.accessToken);

      return quoteData;
    } catch (error) {
      console.error('Error copying quote:', error);
      throw error;
    }
  };

  return (
    <main className={styles.dashMain}>
      <PageHeader session={session} title="Quote Tracker" isLogOut={false} />

      {error && <div className={styles.error}>{error}</div>}

      {error && <div className={styles.error}>{error}</div>}
      <QuoteTable initialQuotes={quotes} onCopyQuote={handleCopyQuote} />
    </main>
  );
}
