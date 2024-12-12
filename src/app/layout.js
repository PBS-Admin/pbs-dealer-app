import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../contexts/AuthProvider';
import { UserProvider } from '../contexts/UserContext';
import { UIProvider } from '../contexts/UIContext';
import VersionCheck from '../components/VersionCheck';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PBS Dealer App',
  description: 'A modern quoting system for metal buildings',
  manifest: '/manifest.json',
  icons: {
    apple: '/ios/192.png',
    android: '/android/android-launchericon-192-192.png',
  },
};

export const viewport = {
  themeColor: '#000000',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <UserProvider>
            <UIProvider>
              <VersionCheck />
              {children}
            </UIProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
