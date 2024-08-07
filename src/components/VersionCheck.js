'use client';
import { useEffect, useState } from 'react';
import { APP_VERSION } from '../../version';
import styles from './VersionCheck.module.css';

export default function VersionCheck() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    async function checkForUpdates() {
      try {
        const res = await fetch('/api/version');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const { version } = await res.json();
        if (version !== APP_VERSION) {
          setUpdateAvailable(true);
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    }

    checkForUpdates();
    // Check for updates every 5 minutes
    const intervalId = setInterval(checkForUpdates, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!updateAvailable) return null;

  return (
    <div className={styles.updateBanner}>
      A new version is available.
      <button
        onClick={() => window.location.reload()}
        className={styles.updateButton}
      >
        Update now
      </button>
    </div>
  );
}
