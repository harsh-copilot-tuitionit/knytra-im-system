'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { getFirestore } from '../../lib/firebase';
import { useAuth } from '../../components/AuthProvider';
import Link from 'next/link';

interface Influencer {
  id: string;
  username: string;
  fullName: string;
  status: string;
  stage: string;
  audience: string;
  owner: string;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [statusMessage, setStatusMessage] = useState('Your intern dashboard syncs live from Firestore.');

  useEffect(() => {
    const db = getFirestore();
    const influencerQuery = query(collection(db, 'influencers'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(influencerQuery, (snapshot) => {
      setInfluencers(
        snapshot.docs.map((doc) => {
          const data = doc.data() as Record<string, any>;
          return {
            id: doc.id,
            username: data.username ?? 'unknown',
            fullName: data.fullName ?? 'Unknown',
            status: data.status ?? 'In our Database',
            stage: data.stage ?? 'Found',
            audience: `${data.niche ?? 'General'} audience`,
            owner: data.ownerName ?? data.owner ?? 'Unassigned',
          };
        })
      );
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 p-10 text-slate-200">Loading your dashboard…</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 p-10 text-slate-200">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center shadow-glow">
          <h1 className="text-3xl font-semibold text-white">Sign in required</h1>
          <p className="mt-4 text-slate-300">Please sign in to access the dashboard and live influencer data.</p>
          <Link href="/auth" className="mt-6 inline-flex rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-400">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  const counts = useMemo(() => {
    const summary = {
      researchPending: 0,
      repliesPending: 0,
      negotiationsActive: 0,
      onboardedCount: 0,
      rejectedCount: 0,
    };
    influencers.forEach((item) => {
      if (item.stage === 'Researching') summary.researchPending += 1;
      if (item.stage === 'Awaiting Reply') summary.repliesPending += 1;
      if (item.stage === 'Negotiating') summary.negotiationsActive += 1;
      if (item.stage === 'Onboarded') summary.onboardedCount += 1;
      if (item.stage === 'Rejected') summary.rejectedCount += 1;
    });
    return summary;
  }, [influencers]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-glow">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Knytra intern dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Welcome, {user.displayName ?? 'Intern'}.</h1>
              <p className="mt-3 max-w-3xl text-slate-300">Your personalized dashboard gives you real-time visibility across research, outreach, and profile status updates.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/add" className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-400">
                Add new profile
              </Link>
              <Link href="/database" className="rounded-full border border-slate-700 bg-slate-950 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-400 hover:text-brand-300">
                Open database
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-glow">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Research pending</p>
            <p className="mt-4 text-4xl font-semibold text-white">{counts.researchPending}</p>
            <p className="mt-3 text-slate-400">Profiles currently in research stage.</p>
          </div>
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-glow">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Replies pending</p>
            <p className="mt-4 text-4xl font-semibold text-white">{counts.repliesPending}</p>
            <p className="mt-3 text-slate-400">Ongoing outreach that needs your follow-up.</p>
          </div>
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-glow">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Negotiations active</p>
            <p className="mt-4 text-4xl font-semibold text-white">{counts.negotiationsActive}</p>
            <p className="mt-3 text-slate-400">Profiles currently in negotiation.</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-glow">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Onboarded count</p>
            <p className="mt-4 text-4xl font-semibold text-white">{counts.onboardedCount}</p>
            <p className="mt-3 text-slate-400">Influencers moved into approved relationships.</p>
          </div>
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-glow">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Rejected count</p>
            <p className="mt-4 text-4xl font-semibold text-white">{counts.rejectedCount}</p>
            <p className="mt-3 text-slate-400">Profiles marked as no-fit or inactive.</p>
          </div>
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-glow">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Total influencers</p>
            <p className="mt-4 text-4xl font-semibold text-white">{influencers.length}</p>
            <p className="mt-3 text-slate-400">Total profiles currently tracked in your workspace.</p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-glow">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-300">My influencers (details)</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">A few recent updates</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/profile/jane_i" className="rounded-full border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-200 hover:border-brand-400 hover:text-brand-300">
                View profile
              </Link>
              <Link href="/add" className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-400">
                Add to database
              </Link>
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            {influencers.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">@{item.username}</p>
                    <p className="text-sm text-slate-400">{item.fullName} · {item.audience}</p>
                  </div>
                  <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs uppercase tracking-[0.24em] text-brand-200">{item.stage}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-400">
                  <span>{item.status}</span>
                  <span>Owner: {item.owner}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-glow">
          <p className="text-slate-300">Hey {user.displayName ?? 'Intern'}, welcome to your personalized dashboard! A complete, real-time view of your performance across all stages. Keep it going!</p>
        </section>
      </div>
    </main>
  );
}
