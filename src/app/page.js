import Link from 'next/link';
import { APP_VERSION } from '../../version';
import Image from 'next/image';
import logo from '../../public/images/pbslogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  return (
    <main>
      <Link href="/global" className="globalButton">
        <FontAwesomeIcon icon={faGlobe} />
      </Link>
      <section className="card">
        <Image alt="PBS Buildings Logo" src={logo} className="image" />
        <h1>Welcome to the PBS Dealer Application</h1>
        <Link href="/login" className="button prim">
          Login
        </Link>
      </section>
      <p>version: {APP_VERSION}</p>
    </main>
  );
}
