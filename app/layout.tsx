import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Providers } from './providers';
import { NavBar } from '../components/NavBar';

export const metadata: Metadata = {
  title: 'Knytra Influence Hub',
  description: 'Next-gen influencer management with real-time Firebase collaboration.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
