import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Knytra IM System',
  description: 'Internal CRM and automation dashboard for influencer sourcing and outreach.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
