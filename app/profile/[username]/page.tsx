'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { getFirestore } from '../../../lib/firebase';
import { useAuth } from '../../../components/AuthProvider';

interface ProfileData {
  username: string;
  fullName: string;
  status: string;
  stage: string;
  activeStatus: string;
  owner: string;
  ownerId?: string;
  ownerEmail?: string;
  niche: string;
  followers: number;
  engagementRate: number;
  location: string;
  brandFit: number;
  contentQuality: number;
  riskNotes: string;
  priority: string;
  preferredContact: string;
  outreachNotes: string;
  researchNotes: string;
  researchDueAt?: string;
  researchStatus: string;
  researchCompletedAt?: string | null;
  lastMessage: string;
  lastAction: string;
}

const actionButtons = [
  { label: 'Start Research', stage: 'Researching' },
  { label: 'Send Message', stage: 'Outreach Sent' },
  { label: 'Mark Awaiting Reply', stage: 'Awaiting Reply' },
  { label: 'Move to Negotiating', stage: 'Negotiating' },
  { label: 'Onboard', stage: 'Onboarded' },
  { label: 'Reject', stage: 'Rejected' },
  { label: 'Mark Inactive', stage: 'Inactive' },
];

export default function ProfilePage() {
  const params = useParams();
  const { user, loading } = useAuth();
  const username = Array.isArray(params?.username) ? params.username[0] : params?.username ?? '';
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [documentId, setDocumentId] = useState('');
  const [message, setMessage] = useState('Use this profile to track outreach, research, and negotiation status.');

  useEffect(() => {
    if (!username) return;
    const db = getFirestore();
    const influencersQuery = query(collection(db, 'influencers'), where('username', '==', username.toLowerCase()));
    const unsubscribe = onSnapshot(influencersQuery, (snapshot) => {
      if (snapshot.docs.length > 0) {
        const docItem = snapshot.docs[0];
        const data = docItem.data() as Record<string, any>;
        setDocumentId(docItem.id);
        setProfile({
          username: data.username ?? username,
          fullName: data.fullName ?? 'Unknown',
          status: data.status ?? 'In our Database',
          stage: data.stage ?? 'Found',
          activeStatus: data.activeStatus ?? 'Unknown',
          owner: data.ownerName ?? data.owner ?? 'No owner assigned',
          ownerId: data.ownerId ?? '',
          ownerEmail: data.ownerEmail ?? '',
          niche: data.niche ?? 'General',
          followers: data.followers ?? 0,
          engagementRate: data.engagementRate ?? 0,
          location: data.location ?? 'Unknown',
          brandFit: data.brandFit ?? 0,
          contentQuality: data.contentQuality ?? 0,
          riskNotes: data.riskNotes ?? '',
          priority: data.priority ?? 'Medium',
          preferredContact: data.preferredContact ?? 'DM',
          outreachNotes: data.outreachNotes ?? '',
          researchNotes: data.researchNotes ?? '',
          researchDueAt: data.researchDueAt ? new Date(data.researchDueAt.seconds * 1000).toLocaleDateString() : 'Not set',
          researchStatus: data.researchStatus ?? 'Pending',
          researchCompletedAt: data.researchCompletedAt ? new Date(data.researchCompletedAt.seconds * 1000).toLocaleString() : null,
          lastMessage: data.lastMessage ?? '',
          lastAction: data.lastAction ?? '',
        });
      } else {
        setProfile(null);
      }
    });

    return () => unsubscribe();
  }, [username]);

  const isMissing = !profile && !loading;

  const handleAction = async (stage: string) => {
    if (!documentId) return;
    const db = getFirestore();
    const ref = doc(db, 'influencers', documentId);
    await updateDoc(ref, {
      stage,
      lastAction: `${stage} by ${user?.displayName ?? 'Intern'}`,
    });
    setMessage(`Profile updated to ${stage}.`);
  };

  const handleResearchComplete = async () => {
    if (!documentId || !profile) return;
    const db = getFirestore();
    const ref = doc(db, 'influencers', documentId);
    const updates: Record<string, any> = {
      researchStatus: 'Completed',
      researchCompletedAt: serverTimestamp(),
      lastAction: `Research completed by ${user?.displayName ?? 'Intern'}`,
    };

    if (profile.stage === 'Found') {
      updates.stage = 'Researching';
    }

    await updateDoc(ref, updates);
    setMessage('Research marked complete.');
  };

  const checklist = useMemo(() => [
    { label: 'Niche validation', done: Boolean(profile?.niche) },
    { label: 'Audience fit', done: profile?.followers ? profile.followers > 0 : false },
    { label: 'Content quality 1-5', done: profile?.contentQuality != null ? profile.contentQuality >= 3 : false },
  ], [profile]);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 p-10 text-slate-200">Loading profile…</div>;
  }

  if (isMissing) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-800 bg-slate-900/80 p-10 shadow-glow text-center">
          <h1 className="text-3xl font-semibold text-white">Influencer not found</h1>
          <p className="mt-4 text-slate-300">No profile exists for @{username}. Add them to the database to continue tracking.</p>
          <Link href="/add" className="mt-6 inline-flex rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-400">
            Add to database
          </Link>
        </div>
      </main>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-glow">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-white">Influencer Profile: {profile.fullName} (@{profile.username})</h1>
              <p className="mt-3 text-slate-300">Track research, outreach, and status from a single profile screen.</p>
            </div>
            <div className="rounded-3xl bg-slate-950/70 px-5 py-4 text-sm text-slate-200">
              <p>Status: <span className="font-semibold text-white">{profile.status}</span></p>
              <p className="mt-2">Stage: <span className="font-semibold text-white">{profile.stage}</span></p>
              <p className="mt-2">Active status: <span className="font-semibold text-white">{profile.activeStatus}</span></p>
              <p className="mt-2">Research due: <span className="font-semibold text-white">{profile.researchDueAt ?? 'Not set'}</span></p>
              <p className="mt-2">Research status: <span className="font-semibold text-white">{profile.researchStatus}</span></p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-glow">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Assigned To</p>
                  <p className="mt-2 text-xl font-semibold text-white">{profile.owner}</p>
                </div>
                <div className="rounded-3xl bg-slate-900 px-4 py-3 text-sm text-slate-300">
                  <p>@{profile.username}</p>
                  <p className="mt-2">Followers: {profile.followers.toLocaleString()}K</p>
                  <p>Engagement: {profile.engagementRate}%</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-glow">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Research Checklist & Notes</p>
              <div className="mt-4 space-y-3">
                {checklist.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3">
                    <span className={`inline-flex h-3.5 w-3.5 rounded-full ${item.done ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    <span className="text-sm text-slate-300">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Research notes</p>
                <p className="mt-3 text-slate-300 min-h-[100px]">{profile.researchNotes || 'Write custom notes here. Most important details save automatically in Firestore.'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-glow">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Instagram fetch (preview)</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 text-slate-300">Post preview</div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 text-slate-300">Post preview</div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 text-slate-300">Post preview</div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 text-slate-300">Post preview</div>
              </div>
              <div className="mt-6 flex items-center gap-3 text-sm text-slate-400">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-brand-400"></span>
                <span>{profile.location}</span>
              </div>
              <button className="mt-6 rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-400">
                Fetch fresh data
              </button>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-glow">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Outreach Tracking</p>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Latest update</span>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-slate-300">
                  <thead>
                    <tr>
                      <th className="px-3 py-3 text-xs uppercase tracking-[0.2em] text-slate-500">Date</th>
                      <th className="px-3 py-3 text-xs uppercase tracking-[0.2em] text-slate-500">Result</th>
                      <th className="px-3 py-3 text-xs uppercase tracking-[0.2em] text-slate-500">Reply</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-800">
                      <td className="px-3 py-3 text-sm">12/29/24</td>
                      <td className="px-3 py-3 text-sm">Replied</td>
                      <td className="px-3 py-3 text-sm">Awaiting</td>
                    </tr>
                    <tr className="border-t border-slate-800">
                      <td className="px-3 py-3 text-sm">12/05/24</td>
                      <td className="px-3 py-3 text-sm">Result</td>
                      <td className="px-3 py-3 text-sm">Interested</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-glow">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Last message sent</p>
              <p className="mt-4 text-slate-300 min-h-[100px]">{profile.lastMessage || 'No message logged yet. Draft a new outreach update here.'}</p>
              <button className="mt-6 rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 hover:border-brand-400 hover:text-brand-300">
                Draft new message
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-glow">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-slate-300">Welcome, {user?.displayName ?? 'Intern'}! Use this profile to move {profile.fullName} through research, outreach, and negotiation.</p>
            <div className="grid gap-3 sm:grid-cols-4">
              {actionButtons.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleAction(item.stage)}
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={handleResearchComplete}
                className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400"
              >
                Mark Research Complete
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400">{message}</p>
        </section>
      </div>
    </main>
  );
}
