'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { logo } from '../../public/images';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

const PageHeader = ({ session, title, subtitle, isLogOut }) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      if (isLoggingOut) return;
      setIsLoggingOut(true);

      // Clear any client-side storage
      localStorage.clear();
      sessionStorage.clear();

      // Sign out with NextAuth
      const data = await signOut({
        redirect: false,
        callbackUrl: '/login',
      });

      // Force a complete page reload to clear any remaining state
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  }, [isLoggingOut]);

  return (
    <header className="pageHeader">
      {isLogOut ? (
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={isLoggingOut ? 'opacity-50' : ''}
        >
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
        {session?.user && (
          <>
            <div className="avatar">
              {/* <Image alt="PBS Buildings Logo" src={logo} className="avatar" /> */}
              <Image
                src={`/api/auth/logos?filename=${encodeURIComponent('contract-logo.png')}&company=${session.user.company}`}
                alt={'PBS-Logo'}
                width={200}
                height={75}
              />
            </div>
            <p>{session.user.fullName}</p>
          </>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
