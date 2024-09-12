import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import styles from './page.module.css';
import PageHeader from '@/components/PageHeader';
import QuoteTable from '@/components/QuoteTable';

async function getQuotes(company) {
  const url = new URL(
    '/api/auth/open',
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  );
  url.searchParams.append('company', company);

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch quotes: ${res.status} ${res.statusText}`
      );
    }
    return res.json();
  } catch (error) {
    console.error('Error in getQuotes:', error);
    throw error;
  }
}

export default async function Tracker() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  let quotes = [];
  let error = null;

  try {
    const data = await getQuotes(session.user.company);
    quotes = data.quotes;
  } catch (err) {
    console.error('Error fetching quotes:', err);
    error = err.message;
  }

  return (
    <main className={styles.dashMain}>
      <PageHeader session={session} title="Dashboard" isLogOut={true} />

      {error && <div className={styles.error}>{error}</div>}

      {error && <div className={styles.error}>{error}</div>}
      <QuoteTable initialQuotes={quotes} />
    </main>
  );
}
