'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { logo } from '../../public/images';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const PageHeader = ({ session, title, subtitle, isLogOut }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <header className="pageHeader">
      {isLogOut ? (
        <button onClick={handleLogout}>
          <FontAwesomeIcon icon={faDoorOpen} />
        </button>
      ) : (
        <Link href="/dashboard" className="button">
          <FontAwesomeIcon icon={faHouse} />
        </Link>
      )}
      <div>
        <h1>{title}</h1>
        {subtitle && <h4>{subtitle}</h4>}
      </div>
      <div className="avatarBox">
        <div className="avatar">
          <Image alt="PBS Buildings Logo" src={logo} className="avatar" />
        </div>
        <p>{session.user.fullName}</p>
      </div>
    </header>
  );
};

export default PageHeader;
