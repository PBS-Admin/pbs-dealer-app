'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faDoorOpen,
  faRotateLeft,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import { signOut, useSession } from 'next-auth/react';
import { useState, useCallback } from 'react';
import { redirect, useRouter } from 'next/navigation';
import ReusableDialog from './ReusableDialog';

const PageHeader = ({ title, subtitle, complexityInfo, backPage, onBack }) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handleWhy = (e) => {
    e.preventDefault();
    // console.log(complexityInfo.reasons);
    setIsDialogOpen(true);
  };

  const handleResponse = useCallback((response) => {
    if (response) {
      // User confirmed the prompt
      setIsDialogOpen(false);
    } else {
      // User cancelled the prompt
      setIsDialogOpen(false);
    }
  }, []);

  return (
    <header className="pageHeader">
      {backPage == 'logout' ? (
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="backIcon"
        >
          <FontAwesomeIcon icon={faDoorOpen} />
        </button>
      ) : (
        <button onClick={handleBack} className="backIcon">
          <FontAwesomeIcon icon={backIcon} />
        </button>
      )}
      <div className="titleBox">
        <h1>{title}</h1>
        {subtitle && <h4>{subtitle}</h4>}
        {complexityInfo && (
          <div className="complexityBox">
            <small className="complexity">
              Complexity: {complexityInfo.complexity}
            </small>
            {complexityInfo.complexity > 1 && (
              <button onClick={handleWhy} className="complexityButton">
                <FontAwesomeIcon icon={faQuestionCircle} />
              </button>
            )}
          </div>
        )}
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
      <ReusableDialog
        isOpen={isDialogOpen}
        onClose={() => handleResponse(false)}
        title={`Complexity Reasons:`}
        message={complexityInfo}
        onConfirm={() => handleResponse(true)}
        onlyConfirm={true}
        isComplexity={true}
      />
    </header>
  );
};

export default PageHeader;
