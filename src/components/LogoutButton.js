'use client';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <>
      <div className="pageHeaderLeft">
        <button onClick={handleLogout} className="iconPrim">
          <FontAwesomeIcon icon={faDoorOpen} />
        </button>
      </div>
    </>
  );
}
