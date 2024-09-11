import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import styles from './page.module.css';
import PageHeader from '@/components/PageHeader';
import { query } from '../../../../lib/db';

export default async function Tracker() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  let quotes = [];
  let error = null;

  try {
    quotes = await query('SELECT id, Company FROM Quotes WHERE Company = ?', [
      session.user.company,
    ]);
  } catch (err) {
    console.error('Error fetching quotes:', err);
    error = `Error fetching quotes: ${err.message}`;
  }

  return (
    <main className={styles.dashMain}>
      <PageHeader session={session} title="Dashboard" isLogOut={true} />

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.quoteTable}>
        <h2>Company Quotes</h2>
        {quotes.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Company</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.ID} className={styles.quoteRow}>
                  <td>
                    <Link
                      href={`/quote/${quote.ID}`}
                      className={styles.quoteLink}
                    >
                      {quote.ID}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/quote/${quote.ID}`}
                      className={styles.quoteLink}
                    >
                      {quote.Company}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No quotes found.</p>
        )}
      </div>
    </main>
  );
}
