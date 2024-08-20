'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { logo } from '../../public/images';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const PageHeader = ({ session, title, isLogOut }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <header className="pageHeader">
      {isLogOut ? (
        <button onClick={handleLogout} className="iconPrim">
          <FontAwesomeIcon icon={faDoorOpen} />
        </button>
      ) : (
        <Link href="/dashboard" className="iconPrim backBox">
          <FontAwesomeIcon icon={faHouse} />
        </Link>
      )}
      <h1>{title}</h1>
      <div className="avatarBox">
        <div className="avatar">
          <Image alt="PBS Buildings Logo" src={logo} className="avatar" />
        </div>
        <p>{session.user.email}</p>
      </div>
    </header>
  );
};

export default PageHeader;
