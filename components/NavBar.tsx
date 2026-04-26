'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from './AuthProvider';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/database', label: 'Database' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/about', label: 'About Us' },
  { href: '/mission', label: 'Our Mission' },
];

export function NavBar() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-200 transition hover:border-brand-400"
            aria-label="Toggle navigation menu"
          >
            <span className="block h-0.5 w-5 bg-current"></span>
            <span className="block h-0.5 w-5 bg-current mt-1"></span>
            <span className="block h-0.5 w-5 bg-current mt-1"></span>
          </button>
          <Link href="/" className="text-lg font-semibold uppercase tracking-[0.2em] text-white">
            Knytra
          </Link>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-slate-300 transition hover:text-brand-300">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:border-brand-400 hover:text-brand-300 md:inline-flex"
          >
            Support
          </Link>
          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              <span className="text-sm text-slate-300">{user.displayName ?? user.email}</span>
              <button
                type="button"
                onClick={signOut}
                className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-brand-400 hover:text-brand-300"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400"
            >
              Sign Up / Log In
            </Link>
          )}
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-800 bg-slate-950/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-900/80" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                type="button"
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
                className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-brand-400 hover:text-brand-300"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/auth"
                className="rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-400"
                onClick={() => setOpen(false)}
              >
                Sign Up / Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
