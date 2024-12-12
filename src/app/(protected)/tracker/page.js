// page.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import styles from './page.module.css';
import PageHeader from '@/components/PageHeader';
import TrackerClient from './TrackerClient';
import { headers } from 'next/headers';

async function getInitialQuotes() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.company) {
      return { quotes: [] };
    }

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/open`, {
      headers: {
        cookie: headers().get('cookie') || '', // Pass along the cookies
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch quotes');
    }

    const data = await response.json();
    return { quotes: data.quotes };
  } catch (error) {
    console.error('Error fetching initial quotes:', error);
    return { quotes: [] };
  }
}

export default async function Tracker() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const { quotes } = await getInitialQuotes();

  return (
    <main className={styles.dashMain}>
      <PageHeader title="Quote Tracker" backPage={'dashboard'} />
      <TrackerClient initialQuotes={quotes} />
    </main>
  );
}
