import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../components/AuthProvider';
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
          <VersionCheck />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
