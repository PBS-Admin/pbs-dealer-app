'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import styles from './page.module.css';
import newQuote from '../../../../public/images/quoteNew.png';
import openQuote from '../../../../public/images/quoteOpen.png';
import PageHeader from '@/components/PageHeader';
import CompanySelector from '@/components/CompanySelector';
import { useUserContext } from '@/contexts/UserContext';

export default function DashboardClient({ initialCompanies }) {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  const { hasPermission } = useUserContext();

  if (!session) {
    redirect('/login');
  }

  return (
    <main className={styles.dashMain}>
      <PageHeader title="Dashboard" isLogOut={true} />
      <div className={styles.dashContainer}>
        {hasPermission(5) && <CompanySelector companies={initialCompanies} />}

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
            <Link href="/register" className="button prim">
              Register
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
