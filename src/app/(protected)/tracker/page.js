// page.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import styles from './page.module.css';
import PageHeader from '@/components/PageHeader';
import QuoteTrackerClient from './QuoteTrackerClient';

export default async function Tracker() {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log('No session, redirecting to login');
    redirect('/login');
  }

  return (
    <main className={styles.dashMain}>
      <PageHeader title="Quote Tracker" isLogOut={false} />
      <QuoteTrackerClient />
    </main>
  );
}
