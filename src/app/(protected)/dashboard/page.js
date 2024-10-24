import { getServerSession } from 'next-auth/next';
import Link from 'next/link';
import Image from 'next/image';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import styles from './page.module.css';
import newQuote from '../../../../public/images/quoteNew.png';
import openQuote from '../../../../public/images/quoteOpen.png';
import PageHeader from '@/components/PageHeader';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const hasPermission = (requiredLevel) => {
    return session.user.permission >= requiredLevel;
  };

  return (
    <main className={styles.dashMain}>
      <PageHeader session={session} title="Dashboard" isLogOut={true} />
      <nav className={styles.dashCard}>
        <Link href="/quote/0" className={styles.buttonCard}>
          <h3 className={styles.cardTitle}>Create New Quote</h3>
          <div className={styles.cardBody}>
            <div>
              <Image
                alt="New Quote"
                src={newQuote}
                className={styles.dashImage}
              />
            </div>
          </div>
        </Link>
        <Link href="/tracker" className={styles.buttonCard}>
          <h3 className={styles.cardTitle}>Open Quotes</h3>
          <div className={styles.cardBody}>
            <div>
              <Image
                alt="Open Quote"
                src={openQuote}
                className={styles.dashImage}
              />
            </div>
          </div>
        </Link>
        {hasPermission(5) && (
          <>
            <Link href="/register" className="button prim">
              Register
            </Link>
          </>
        )}
      </nav>
    </main>
  );
}
