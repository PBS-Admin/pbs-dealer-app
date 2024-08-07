import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../components/AuthProvider';
import VersionCheck from '../components/VersionCheck';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Your Cloud Application',
  description: 'A modern cloud application with authentication',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <VersionCheck />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
