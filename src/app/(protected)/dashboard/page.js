'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import styles from './page.module.css';
import newQuote from '../../../../public/images/quoteNew.png';
import openQuote from '../../../../public/images/quoteOpen.png';
import PageHeader from '@/components/PageHeader';

export default function Dashboard() {
  const { data: session, update: updateSession } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCompany, setCurrentCompany] = useState(session?.user?.company);

  if (!session) {
    redirect('/login');
  }

  useEffect(() => {
    if (!session) {
      console.log('No session, redirecting to login');
      redirect('/login');
      return;
    }

    const fetchCompanies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/auth/companies`);
        if (!response.ok) {
          throw new Error('Failed to fetch quotes');
        }
        const data = await response.json();
        setCompanies(data.companies);
      } catch (err) {
        console.error('Error fetching quotes:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [session]);

  const hasPermission = (requiredLevel) => {
    return session.user.permission >= requiredLevel;
  };

  const handleCompanyChange = async (event) => {
    const newCompany = parseInt(event.target.value);
    setIsLoading(true);
    setError(null);

    try {
      // Get new token with updated company
      const response = await fetch('/api/auth/change-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newCompany }),
      });

      if (!response.ok) {
        throw new Error('Failed to update company');
      }

      await updateSession({
        ...session,
        user: {
          ...session?.user,
          company: newCompany,
        },
      });
      setCurrentCompany(newCompany);
      const companiesResponse = await fetch(`/api/auth/companies`);
      if (!companiesResponse.ok) {
        throw new Error('Failed to fetch quotes');
      }
      const companiesData = await companiesResponse.json();
      setCompanies(companiesData.companies);
    } catch (err) {
      console.error('Error changing company:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.dashMain}>
      <PageHeader session={session} title="Dashboard" isLogOut={true} />
      <div className={styles.dashContainer}>
        {/* Permission for a Super user who can view multiple companies jobs */}
        {session.user.permission >= 3 && (
          <div className={styles.companyList}>
            <select
              className="selectInput"
              id="companyList"
              name="companyList"
              value={currentCompany}
              onChange={handleCompanyChange}
            >
              {companies.map((option) => (
                <option key={option.ID} value={option.ID}>
                  {option.Name}
                </option>
              ))}
            </select>
          </div>
        )}
        {!isLoading && !error && (
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
        )}
      </div>
    </main>
  );
}
