'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { getFirestore } from '../../lib/firebase';

interface InfluencerRow {
  id: string;
  username: string;
  fullName: string;
  status: string;
  stage: string;
  owner: string;
  niche: string;
  followers: number;
  engagementRate: number;
}

const statusOptions = ['All', 'In our Database', 'Not in Database'];
const stageOptions = ['All', 'Found', 'Researching', 'Outreach Sent', 'Awaiting Reply', 'Negotiating', 'Onboarded', 'Rejected', 'Inactive'];
const ownerOptions = ['All', 'Intern Ava', 'Intern Ben', 'Intern Chloe', 'Intern David'];

export default function DatabasePage() {
  const [influencers, setInfluencers] = useState<InfluencerRow[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');
  const [ownerFilter, setOwnerFilter] = useState('All');
  const [niche, setNiche] = useState('');
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const db = getFirestore();
    const influencersQuery = query(collection(db, 'influencers'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(influencersQuery, (snapshot) => {
      setInfluencers(
        snapshot.docs.map((doc) => {
          const data = doc.data() as Record<string, any>;
          return {
            id: doc.id,
            username: data.username ?? 'unknown',
            fullName: data.fullName ?? 'Unknown',
            status: data.status ?? 'In our Database',
            stage: data.stage ?? 'Found',
            owner: data.ownerName ?? data.owner ?? 'Unassigned',
            niche: data.niche ?? 'General',
            followers: data.followers ?? 0,
            engagementRate: data.engagementRate ?? 0,
          };
        })
      );
    });

    return () => unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    return influencers
      .filter((item) => {
        const query = search.trim().toLowerCase();
        if (query && !item.username.toLowerCase().includes(query) && !item.fullName.toLowerCase().includes(query)) {
          return false;
        }
        if (statusFilter !== 'All' && item.status !== statusFilter) {
          return false;
        }
        if (stageFilter !== 'All' && item.stage !== stageFilter) {
          return false;
        }
        if (ownerFilter !== 'All' && item.owner !== ownerFilter) {
          return false;
        }
        if (niche.trim() && !item.niche.toLowerCase().includes(niche.trim().toLowerCase())) {
          return false;
        }
        return true;
      })
      .slice(0, pageSize);
  }, [influencers, search, statusFilter, stageFilter, ownerFilter, niche, pageSize]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-glow">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Database</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Search and filter the influencer roster</h1>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Quick Find</p>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Username or name"
                  className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1.2fr]">
            <div className="rounded-3xl bg-slate-950/70 p-4">
              <p className="text-sm text-slate-400">Status</p>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option} className="bg-slate-950 text-slate-100">
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-3xl bg-slate-950/70 p-4">
              <p className="text-sm text-slate-400">Stage</p>
              <select
                value={stageFilter}
                onChange={(event) => setStageFilter(event.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
              >
                {stageOptions.map((option) => (
                  <option key={option} value={option} className="bg-slate-950 text-slate-100">
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-3xl bg-slate-950/70 p-4">
              <p className="text-sm text-slate-400">Owner</p>
              <select
                value={ownerFilter}
                onChange={(event) => setOwnerFilter(event.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
              >
                {ownerOptions.map((option) => (
                  <option key={option} value={option} className="bg-slate-950 text-slate-100">
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-3xl bg-slate-950/70 p-4">
              <p className="text-sm text-slate-400">Niche</p>
              <input
                value={niche}
                onChange={(event) => setNiche(event.target.value)}
                placeholder="Search niche"
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">Showing {filtered.length} of {influencers.length} influencers</p>
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-300">Show</label>
              <input
                type="number"
                min={5}
                max={50}
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
                className="w-20 rounded-3xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none"
              />
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/70 shadow-glow">
          <div className="grid min-w-full gap-0 divide-y divide-slate-800 text-sm text-slate-200">
            <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_0.9fr_1.1fr] gap-2 bg-slate-900/80 px-6 py-4 font-medium text-slate-300">
              <span>Username</span>
              <span>Status</span>
              <span>Stage</span>
              <span>Owner</span>
              <span>Niche</span>
              <span>Followers</span>
              <span className="text-right">Actions</span>
            </div>
            {filtered.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-slate-400">No influencers match the current filters. Try adjusting search or add a new profile.</div>
            ) : (
              filtered.map((item) => (
                <div key={item.id} className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_0.9fr_1.1fr] gap-2 px-6 py-5 hover:bg-slate-900/60">
                  <div>
                    <p className="font-semibold text-white">@{item.username}</p>
                    <p className="text-xs text-slate-400">{item.fullName}</p>
                  </div>
                  <span className="text-slate-300">Status: {item.status}</span>
                  <span className="text-slate-300">Stage: {item.stage}</span>
                  <span className="text-slate-300">Owner: {item.owner}</span>
                  <span className="text-slate-300">{item.niche}</span>
                  <span className="text-slate-300">{item.followers.toLocaleString()}K</span>
                  <div className="flex justify-end">
                    <Link href={`/profile/${item.username}`} className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-brand-400 hover:text-brand-300">
                      View Profile
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
