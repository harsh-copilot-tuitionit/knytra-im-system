'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';
import { getFirestore } from '../../lib/firebase';
import { useAuth } from '../../components/AuthProvider';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const [brandName, setBrandName] = useState('');
  const [tagline, setTagline] = useState('');
  const [teamEmail, setTeamEmail] = useState('');
  const [samples, setSamples] = useState<string[]>([]);
  const [message, setMessage] = useState('Configure your brand settings and team workflow.');

  useEffect(() => {
    const db = getFirestore();
    const settingsRef = doc(db, 'settings/brand');
    getDoc(settingsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setBrandName(data.name ?? 'Knytra Influence Hub');
        setTagline(data.tagline ?? 'Influencer operations made effortless.');
      }
    });

    const sampleQuery = query(collection(db, 'sampleActions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(sampleQuery, (snapshot) => {
      setSamples(snapshot.docs.map((doc) => doc.data().note as string));
    });

    return () => unsubscribe();
  }, []);

  async function saveBrandSettings() {
    const db = getFirestore();
    await setDoc(doc(db, 'settings/brand'), {
      name: brandName,
      tagline,
      updatedAt: serverTimestamp(),
    });
    setMessage('Brand settings saved and synced instantly.');
  }

  async function addTeamAction() {
    if (!teamEmail) return;
    const db = getFirestore();
    await addDoc(collection(db, 'sampleActions'), {
      note: `Invite sent to ${teamEmail}`,
      createdAt: serverTimestamp(),
    });
    setTeamEmail('');
    setMessage('Team action recorded to Firestore.');
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-950 p-10 text-slate-200">Loading admin settings…</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 p-10 text-slate-200">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center shadow-glow">
          <h1 className="text-3xl font-semibold text-white">Sign in required</h1>
          <p className="mt-4 text-slate-300">Please sign in to edit settings and manage the portal.</p>
          <Link href="/auth" className="mt-6 inline-flex rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-400">
            Sign in now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-glow">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Admin settings</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Configure your live workspace</h1>
            </div>
            <Link href="/dashboard" className="rounded-full border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-400 hover:text-brand-300">
              Back to dashboard
            </Link>
          </div>
          <p className="mt-4 text-slate-300">This admin area writes directly to Firestore and reflects changes in real time across the application.</p>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-glow">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-200">Brand name</label>
                <input
                  value={brandName}
                  onChange={(event) => setBrandName(event.target.value)}
                  placeholder="Knytra Influence Hub"
                  className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200">Tagline</label>
                <input
                  value={tagline}
                  onChange={(event) => setTagline(event.target.value)}
                  placeholder="Influencer operations made effortless."
                  className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
                />
              </div>
              <button onClick={saveBrandSettings} className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-400">
                Save brand profile
              </button>
              <p className="text-sm text-slate-400">{message}</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-glow">
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Quick actions</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Team collaboration</h2>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200">Invite team member</label>
                <input
                  value={teamEmail}
                  onChange={(event) => setTeamEmail(event.target.value)}
                  placeholder="marketing@brand.com"
                  className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
                />
              </div>
              <button onClick={addTeamAction} className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-400">
                Record invite
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-glow">
          <h2 className="text-2xl font-semibold text-white">Recent admin actions</h2>
          <div className="mt-6 space-y-4">
            {samples.length === 0 ? (
              <p className="text-slate-400">No actions recorded yet. Team actions and settings updates appear here instantly.</p>
            ) : (
              samples.map((note, index) => (
                <div key={`${note}-${index}`} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 text-slate-200">
                  {note}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
