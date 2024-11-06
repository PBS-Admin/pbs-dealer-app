import Link from 'next/link';
import { APP_VERSION } from '../../version';
import Image from 'next/image';
import logo from '../../public/images/pbslogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.splashMain}>
      <Link href="/global" className={styles.globalButton}>
        <FontAwesomeIcon icon={faGlobe} />
      </Link>
      <section className={styles.splashCard}>
        <Image alt="PBS Buildings Logo" src={logo} className="image" />
        <h1>Welcome to the Dealer Application</h1>
        <Link href="/login" className="button prim">
          Login
        </Link>
      </section>
      <p className={styles.splashVersion}>version: {APP_VERSION}</p>
    </main>
  );
}
