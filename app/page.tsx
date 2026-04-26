'use client';

import { useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getFirestore } from '../lib/firebase';
import { useAuth } from '../components/AuthProvider';

interface InfluencerData {
  username: string;
  fullName?: string;
  status?: string;
  stage?: string;
  owner?: string;
  followers?: number;
  engagementRate?: number;
  location?: string;
  preferredContact?: string;
}

export default function HomePage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchState, setSearchState] = useState<'idle' | 'searching' | 'found' | 'missing'>('idle');
  const [result, setResult] = useState<InfluencerData | null>(null);
  const [message, setMessage] = useState('Enter a username to search the database or add a new influencer.');

  const normalizedSearch = searchTerm.trim().replace(/^@/, '').toLowerCase();

  async function handleSearch() {
    if (!normalizedSearch) {
      setSearchState('idle');
      setResult(null);
      setMessage('Please enter a username to search.');
      return;
    }

    setSearchState('searching');
    setMessage('Looking for influencer data...');

    try {
      const db = getFirestore();
      const influencerQuery = query(
        collection(db, 'influencers'),
        where('username', '==', normalizedSearch)
      );
      const snapshot = await getDocs(influencerQuery);

      if (!snapshot.empty) {
        const docData = snapshot.docs[0].data() as InfluencerData;
        setResult({
          username: normalizedSearch,
          fullName: docData.fullName ?? normalizedSearch,
          status: docData.status ?? 'In our Database',
          stage: docData.stage ?? 'Found',
          owner: docData.owner ?? 'No owner assigned',
          followers: docData.followers ?? 0,
          engagementRate: docData.engagementRate ?? 0,
          location: docData.location ?? 'Unknown',
          preferredContact: docData.preferredContact ?? 'DM / Email',
        });
        setSearchState('found');
        setMessage('Influencer found in the database.');
      } else {
        setResult({
          username: normalizedSearch,
          status: 'Not in Database',
          stage: 'Not started',
          owner: 'No owner assigned',
          followers: 18300,
          engagementRate: 4.9,
          location: 'Mumbai',
          preferredContact: 'DM / Email',
        });
        setSearchState('missing');
        setMessage('No profile found. Add the influencer to the database.');
      }
    } catch (error) {
      setSearchState('idle');
      setMessage('Unable to search right now. Please try again later.');
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-between gap-14">
        <section className="space-y-10 rounded-[2rem] border border-slate-800 bg-slate-950/90 p-10 shadow-glow">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Influencer search</p>
            <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-bold leading-tight text-white sm:text-6xl">
              FIND OR ADD AN INFLUENCER
            </h1>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="relative">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
                placeholder="Enter @username here..."
                className="w-full rounded-full border border-slate-800 bg-slate-900/95 px-6 py-4 pr-20 text-lg text-slate-100 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-brand-500 text-white transition hover:bg-brand-400"
                aria-label="Search influencer"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-glow">
            {searchState === 'idle' && (
              <div className="text-center text-slate-400">
                <p className="text-xl font-semibold text-white">Search the database instantly.</p>
                <p className="mt-3">Use the field above to check whether a creator is already being tracked or add them as a new influencer.</p>
              </div>
            )}
            {searchState === 'searching' && <p className="text-center text-slate-300">{message}</p>}
            {searchState === 'found' && result && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-800 text-2xl text-brand-300">@</div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-slate-400">In database</p>
                      <p className="mt-2 text-2xl font-semibold text-white">@{result.username}</p>
                    </div>
                  </div>
                  <div className="mt-8 space-y-4 text-slate-300">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Status (Database)</p>
                      <p className="mt-1 text-lg font-semibold text-white">{result.status}</p>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Stage (Workflow)</p>
                      <p className="mt-1 text-lg font-semibold text-white">{result.stage}</p>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Owner</p>
                      <p className="mt-1 text-lg font-semibold text-white">{result.owner}</p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Link
                      href={`/profile/${result.username}`}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-brand-400 hover:text-brand-300"
                    >
                      Open Profile
                    </Link>
                  </div>
                </div>
                <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-8">
                  <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Search result</p>
                  <p className="mt-2 text-slate-300">{message}</p>
                  <div className="mt-8 grid gap-4">
                    <div className="rounded-3xl bg-slate-900/80 p-5">
                      <p className="text-sm text-slate-400">Instagram sample</p>
                      <p className="mt-3 text-2xl font-semibold text-white">{result.fullName ?? 'Instagram Creator'}</p>
                      <p className="mt-2 text-slate-400">{result.followers?.toLocaleString()} followers · {result.engagementRate}% engagement</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl bg-slate-900/80 p-5">
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Location</p>
                        <p className="mt-2 text-white">{result.location}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-900/80 p-5">
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Contact</p>
                        <p className="mt-2 text-white">{result.preferredContact}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {searchState === 'missing' && result && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-800 text-2xl text-brand-300">+</div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Not in database</p>
                      <p className="mt-2 text-2xl font-semibold text-white">@{result.username}</p>
                    </div>
                  </div>
                  <div className="mt-8 space-y-4 text-slate-300">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Status</p>
                      <p className="mt-1 text-lg font-semibold text-white">{result.status}</p>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Stage</p>
                      <p className="mt-1 text-lg font-semibold text-white">{result.stage}</p>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Owner</p>
                      <p className="mt-1 text-lg font-semibold text-white">{result.owner}</p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Link
                      href={`/add?username=${encodeURIComponent(result.username)}`}
                      className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-400"
                    >
                      Add to Database
                    </Link>
                  </div>
                </div>
                <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-8">
                  <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Placeholder profile</p>
                  <div className="mt-5 grid gap-4">
                    <div className="rounded-3xl bg-slate-900/80 p-5">
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Followers</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{result.followers?.toLocaleString()}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900/80 p-5">
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Engagement</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{result.engagementRate}%</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900/80 p-5">
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Location</p>
                      <p className="mt-2 text-white">{result.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <footer className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 text-slate-300 shadow-glow">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Hey <span className="font-semibold text-white">{user?.displayName ?? user?.email ?? 'Intern'}</span>, use this page to quickly check if an influencer is already being tracked or click Add to Database for new discoveries.
            </p>
            <p className="text-sm text-slate-500">© KNYTRA</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
