import Link from 'next/link';
import { APP_VERSION } from '../../version';
import Image from 'next/image';
import logo from '../../public/images/pbslogo.png';

export default function Home() {
  return (
    <main>
      <section className="card">
        <Image alt="PBS Buildings Logo" src={logo} className="image" />
        <h1 className="title">Welcome to the PBS Dealer Application</h1>
        <div className="buttonContainer">
          <Link href="/login" className="button">
            Login
          </Link>
        </div>
      </section>
      <p>version: {APP_VERSION}</p>
    </main>
  );
}
