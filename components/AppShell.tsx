'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Leads', path: '/leads' },
  { label: 'Accounts', path: '/accounts' },
  { label: 'Automation', path: '/automation' },
];

export default function AppShell({ children, activePage }: { children: ReactNode; activePage: string }) {
  return (
    <div className="container">
      <header className="header">
        <div>
          <p style={{ color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '0.8rem' }}>Knytra IM</p>
          <h1 style={{ margin: '8px 0 0', fontSize: '1.75rem' }}>Internal outreach dashboard</h1>
        </div>

        <nav className="nav-links">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} className={`nav-link ${activePage === item.label.toLowerCase() ? 'active' : ''}`}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="grid" style={{ gap: '24px' }}>
        {children}
      </main>
    </div>
  );
}
