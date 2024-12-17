'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faDoorOpen,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { signOut, useSession } from 'next-auth/react';
import { useState, useCallback } from 'react';
import { redirect, useRouter } from 'next/navigation';

const PageHeader = ({ title, subtitle, backPage, onBack }) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

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

  const handleBack = (e) => {
    e.preventDefault();
    if (backPage == 'tracker') {
      onBack();
    }
    router.replace(`/${backPage}`);
  };

  let backIcon;

  switch (backPage) {
    case 'tracker':
      backIcon = faRotateLeft;
      break;
    case 'logout':
      backIcon = faDoorOpen;
      break;
    default:
      backIcon = faHouse;
      break;
  }

  return (
    <header className="pageHeader">
      {backPage == 'logout' ? (
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={isLoggingOut ? 'opacity-50' : ''}
        >
          <FontAwesomeIcon icon={faDoorOpen} />
        </button>
      ) : (
        <button onClick={handleBack} className="button">
          <FontAwesomeIcon icon={backIcon} />
        </button>
      )}
      <div>
        <h1>{title}</h1>
        {subtitle && <h4>{subtitle}</h4>}
      </div>
      <div className="avatarBox">
        {session?.user && (
          <>
            <div className="avatar">
              <Image
                src={`/api/auth/logos?filename=${encodeURIComponent('contract-logo.png')}&company=${session.user.company}`}
                alt={'Logo'}
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
