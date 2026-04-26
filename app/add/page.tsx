'use client';

import { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, getDocs, onSnapshot, query, serverTimestamp, where } from 'firebase/firestore';
import { getFirestore } from '../../lib/firebase';
import { useAuth } from '../../components/AuthProvider';
import Link from 'next/link';

const stages = ['Researching', 'Outreach Sent', 'Interested', 'Onboarded', 'Rejected'];
const priorities = ['High', 'Medium', 'Low'];
const contacts = ['DM', 'Email', 'Form'];

export default function AddPage() {
  const { user, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [status, setStatus] = useState('Active');
  const [stage, setStage] = useState('Researching');
  const [location, setLocation] = useState('');
  const [niche, setNiche] = useState('');
  const [brandFit, setBrandFit] = useState(4);
  const [contentQuality, setContentQuality] = useState(4);
  const [riskNotes, setRiskNotes] = useState('');
  const [priority, setPriority] = useState('High');
  const [preferredContact, setPreferredContact] = useState('DM');
  const [outreachNotes, setOutreachNotes] = useState('');
  const [message, setMessage] = useState('Complete the profile to add this influencer to the database.');
  const [existing, setExisting] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (username.trim().length < 3) {
      setExisting(null);
      return;
    }

    const db = getFirestore();
    const influencersQuery = query(collection(db, 'influencers'), where('username', '==', username.trim().toLowerCase()));
    getDocs(influencersQuery).then((snapshot) => {
      setExisting(snapshot.empty ? null : 'exists');
    });
  }, [username]);

  const starDisplay = (value: number) => '★'.repeat(value) + '☆'.repeat(5 - value);

  const summary = useMemo(() => {
    if (!username.trim()) {
      return 'Enter a username to preview the influencer record.';
    }
    return `For: @${username.trim()}`;
  }, [username]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username.trim() || !fullName.trim()) {
      setMessage('Please add a username and full name before you submit.');
      return;
    }

    setBusy(true);
    try {
      const db = getFirestore();
      await addDoc(collection(db, 'influencers'), {
        username: username.trim().toLowerCase(),
        fullName: fullName.trim(),
        status,
        stage,
        location: location.trim(),
        niche: niche.trim(),
        brandFit,
        contentQuality,
        riskNotes: riskNotes.trim(),
        priority,
        preferredContact,
        outreachNotes: outreachNotes.trim(),
        owner: user?.displayName ?? user?.email ?? 'Intern',
        followers: 0,
        engagementRate: 0,
        lastMessage: outreachNotes.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setMessage('Influencer successfully added to the database. Redirect to profile to continue updates.');
      setUsername('');
      setFullName('');
      setLocation('');
      setNiche('');
      setRiskNotes('');
      setOutreachNotes('');
    } catch (error) {
      setMessage('Failed to add profile. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-950 p-10 text-slate-200">Loading user profile…</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 p-10 text-slate-200">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center shadow-glow">
          <h1 className="text-3xl font-semibold text-white">Please sign in</h1>
          <p className="mt-4 text-slate-300">You must be signed in to add influencers to the database.</p>
          <Link href="/auth" className="mt-6 inline-flex rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-400">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-10">
      <div className="mx-auto max-w-5xl space-y-10">
        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-glow">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Knytra</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Add to database survey</h1>
          <p className="mt-3 max-w-2xl text-slate-300">Use this form to officially add a new influencer to the live roster and capture their reach, contact preference, and research notes.</p>
          <p className="mt-3 text-slate-400">{summary}</p>
        </section>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-6 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-glow">
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                Username
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="jane_i"
                  className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Full name
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Jane Influencer"
                  className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
                />
              </label>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <label className="space-y-2 text-sm text-slate-300">
                Status
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Stage
                <select
                  value={stage}
                  onChange={(event) => setStage(event.target.value)}
                  className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none"
                >
                  {stages.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Niche
                <input
                  value={niche}
                  onChange={(event) => setNiche(event.target.value)}
                  placeholder="Beauty, Food, Tech"
                  className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
                />
              </label>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                Location
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Los Angeles, CA"
                  className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  Brand fit (1-5)
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={brandFit}
                    onChange={(event) => setBrandFit(Number(event.target.value))}
                    className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  Content quality (1-5)
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={contentQuality}
                    onChange={(event) => setContentQuality(Number(event.target.value))}
                    className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none"
                  />
                </label>
              </div>
            </div>

            <label className="space-y-2 text-sm text-slate-300">
              Risk notes
              <textarea
                value={riskNotes}
                onChange={(event) => setRiskNotes(event.target.value)}
                rows={4}
                placeholder="Any concerns or red flags"
                className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
              />
            </label>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                Priority
                <select
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none"
                >
                  {priorities.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Preferred contact
                <select
                  value={preferredContact}
                  onChange={(event) => setPreferredContact(event.target.value)}
                  className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none"
                >
                  {contacts.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="space-y-2 text-sm text-slate-300">
              Initial outreach notes
              <textarea
                value={outreachNotes}
                onChange={(event) => setOutreachNotes(event.target.value)}
                rows={4}
                placeholder="Message and outreach plan"
                className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
              />
            </label>
          </section>

          <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-glow">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Profile preview</p>
                <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-base text-slate-400">{summary}</p>
                      <p className="mt-2 text-sm text-slate-300">Status: {status}</p>
                    </div>
                    <span className="rounded-full bg-brand-500/15 px-4 py-2 text-xs uppercase tracking-[0.24em] text-brand-200">
                      {stage}
                    </span>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-950 p-4 text-slate-300">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Brand fit</p>
                      <p className="mt-2 text-xl text-white">{starDisplay(brandFit)}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950 p-4 text-slate-300">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Content quality</p>
                      <p className="mt-2 text-xl text-white">{starDisplay(contentQuality)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-900/80 p-6 text-slate-200">
                <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Quick status</p>
                <div className="mt-6 space-y-4 text-sm text-slate-300">
                  <p>Assigned to: <span className="font-semibold text-white">{user?.displayName ?? 'Intern'}</span></p>
                  <p>Preferred contact: <span className="font-semibold text-white">{preferredContact}</span></p>
                  <p>Priority: <span className="font-semibold text-white">{priority}</span></p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-8 w-full rounded-full bg-brand-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Submit to database
            </button>
            <p className="mt-4 text-sm text-slate-400">{message}</p>
          </section>
        </form>
      </div>
    </main>
  );
}
