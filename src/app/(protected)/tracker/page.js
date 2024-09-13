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
  return data;
}

export default async function Tracker() {
  console.log('Entering Tracker component');
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log('No session, redirecting to login');
    redirect('/login');
  }

  let quotes = [];
  let error = null;

  // ! This is for development code and should be commented out before going live
  quotes = [
    {
      ID: 13,
      Submitted: 0,
      Quote: 13256,
      Rev: 0,
      Customer: 'Testing Cust 1',
      ProjectName: 'Testing Proj 1',
      DateStarted: '2024-09-13T20:24:00.000Z',
    },
    {
      ID: 14,
      Submitted: 0,
      Quote: 13257,
      Rev: 0,
      Customer: 'Testing Cust 2',
      ProjectName: 'Testing Proj 2',
      DateStarted: '2024-09-14T20:24:00.000Z',
    },
    {
      ID: 15,
      Submitted: 1,
      Quote: 13258,
      Rev: 0,
      Customer: 'Testing Cust 3',
      ProjectName: 'Testing Proj 3',
      DateStarted: '2024-09-15T20:24:00.000Z',
    },
  ];

  // ! This is for production code and should be changed before going live
  // try {
  //   const data = await getQuotes(
  //     session.user.company,
  //     session.user.accessToken
  //   );
  //   quotes = data.quotes;
  // } catch (err) {
  //   console.error('Error fetching quotes:', err);
  //   error = err.message;
  // }

  return (
    <main className={styles.dashMain}>
      <PageHeader session={session} title="Dashboard" isLogOut={true} />

      {error && <div className={styles.error}>{error}</div>}

      {error && <div className={styles.error}>{error}</div>}
      <QuoteTable initialQuotes={quotes} />
    </main>
  );
}
