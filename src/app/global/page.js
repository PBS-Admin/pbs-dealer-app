import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../public/images/pbslogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default async function Global() {
  return (
    <main>
      <header className="pageHeader">
        <Link href="/" className="backButton pageHeaderLeft">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        <h1>Heading 1</h1>
        <div className="pageHeaderRight">
          <div className="avatarBox">
            <div className="avatar">
              <Image alt="PBS Buildings Logo" src={logo} />
            </div>
            <p>username</p>
          </div>
        </div>
      </header>
      <h2>Heading 2</h2>
      <section className="card">
        <header className="cardHeader">
          <h3>Heading 3</h3>
        </header>
        <div className="cardBox">
          <h4>Heading 4</h4>
          <div className="cardInput">
            <label htmlFor="testInput">Label: </label>
            <input id="testInput" type="text"></input>
          </div>
          <div className="cardInput">
            <label htmlFor="testInput">Label: </label>
            <input id="testInput" type="text"></input>
          </div>
          <div className="cardInput">
            <label htmlFor="testInput">Label: </label>
            <input id="testInput" type="text"></input>
          </div>
          <div className="cardInput">
            <label htmlFor="testInput">Label: </label>
            <input id="testInput" type="text"></input>
          </div>
        </div>
      </section>
      <section className="card">
        <header className="cardHeader">
          <h3>Button Styles</h3>
        </header>
        <div className="cardBox">
          <button className="button prim">Primary</button>
          <button className="button sec">Secondary</button>
          <button className="button accent">Accent</button>
          <button className="button success">Success</button>
          <button className="button reject">Reject</button>
          <button className="button nuetral">Nuetral</button>
        </div>
      </section>
      <div></div>
    </main>
  );
}
