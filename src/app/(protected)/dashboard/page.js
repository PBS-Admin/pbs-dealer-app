import { getServerSession } from 'next-auth/next';
import Link from 'next/link';
import Image from 'next/image';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import styles from './page.module.css';
import newQuote from '../../../../public/images/newQuote.png';
import logo from '../../../../public/images/pbslogo.png';
import LogoutButton from '../../../components/LogoutButton';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const hasPermission = (requiredLevel) => {
    return session.user.permission >= requiredLevel;
  };

  return (
    <main>
      <header className="pageHeader">
        <LogoutButton />
        <h1>Dashboard</h1>
        <div className="avatarBox">
          <div className="avatar">
            <Image alt="PBS Buildings Logo" src={logo} />
          </div>
          <p>{session.user.email}</p>
        </div>
      </header>
      <div className="card">
        <nav className="cardBox col">
          <Link href="/quote" className={styles.buttonCard}>
            <h3 className={styles.cardTitle}>Create New Quote</h3>
            <Image
              alt="PBS Buildings Logo"
              src={newQuote}
              className={styles.dashImage}
            />
          </Link>
          <Link href="/quote" className={styles.buttonCard}>
            <h3 className={styles.cardTitle}>Create New Quote</h3>
            <Image
              alt="PBS Buildings Logo"
              src={newQuote}
              className={styles.dashImage}
            />
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
