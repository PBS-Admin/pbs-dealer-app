import Image from 'next/image';
import { logo } from '../../../../../public/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

export default function Loading() {
  return (
    <main className="loadingPage">
      <div className="loadingCard">
        <div className="loadingMessage">
          <h3>Populating you Quote</h3>
          <FontAwesomeIcon className="rotate" icon={faCircleNotch} />
        </div>
        <Image alt="PBS Buildings Logo" src={logo} className="loadingImage" />
      </div>
    </main>
  );
}
