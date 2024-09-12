import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import styles from './page.module.css';
import PageHeader from '@/components/PageHeader';
import QuoteTable from '@/components/QuoteTable';

async function getQuotes(company, sessionToken) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const url = new URL('/api/auth/open', baseUrl);
  url.searchParams.append('company', company);

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!res.ok) {
    console.error('Fetch failed:', res.status, res.statusText);
    throw new Error(`Failed to fetch quotes: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  console.log('Fetch successful, data:', data);
  return data;
}

export default async function Tracker() {
  console.log('Entering Tracker component');
  const session = await getServerSession(authOptions);
  console.log('Session in Tracker:', session);

  if (!session) {
    console.log('No session, redirecting to login');
    redirect('/login');
  }

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

  return (
    <main className={styles.dashMain}>
      <PageHeader session={session} title="Dashboard" isLogOut={true} />

      {error && <div className={styles.error}>{error}</div>}

      {error && <div className={styles.error}>{error}</div>}
      <QuoteTable initialQuotes={quotes} />
    </main>
  );
}
