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

  console.log('sess:', session);

  let quotes = [];
  let error = null;

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
