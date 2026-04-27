'use client';

import { useEffect, useMemo, useState } from 'react';
import AppShell from '../../components/AppShell';
import LeadStatusBadge from '../../components/LeadStatusBadge';

type Lead = {
  id: string;
  instagramUsername: string;
  niche: string;
  followerRange: string;
  location: string;
  notes?: string;
  status: string;
  createdAt: string;
};

const leadStatuses = [
  { value: 'approved', label: 'Approve' },
  { value: 'rejected', label: 'Reject' },
  { value: 'queued', label: 'Queue' },
  { value: 'do_not_contact', label: 'Do Not Contact' },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [instagramUsername, setInstagramUsername] = useState('');
  const [niche, setNiche] = useState('');
  const [followerRange, setFollowerRange] = useState('10k-50k');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      setErrorMessage('Unable to load leads.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const submitLead = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!instagramUsername.trim() || !niche.trim() || !location.trim()) {
      setErrorMessage('Instagram username, niche, and location are required.');
      return;
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagramUsername: instagramUsername.trim(),
          niche: niche.trim(),
          followerRange,
          location: location.trim(),
          notes: notes.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to submit lead');
      }

      setSuccessMessage('Lead submitted successfully.');
      setInstagramUsername('');
      setNiche('');
      setFollowerRange('10k-50k');
      setLocation('');
      setNotes('');
      fetchLeads();
    } catch (error: any) {
      setErrorMessage(error.message || 'Lead submission failed.');
    }
  };

  const updateLeadStatus = async (id: string, status: string) => {
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to update lead status');
      }
      setSuccessMessage(`Lead status updated to ${status}.`);
      fetchLeads();
    } catch (error: any) {
      setErrorMessage(error.message || 'Unable to update lead status.');
    }
  };

  const sortedLeads = useMemo(() => leads.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)), [leads]);

  return (
    <AppShell activePage="leads">
      <section className="page-card">
        <h1 className="page-heading">Leads</h1>
        <p className="page-subtitle">Submit new Instagram leads and manage review status from a single interface.</p>
      </section>

      <section className="page-card">
        <form onSubmit={submitLead} className="grid" style={{ gap: '16px' }}>
          <div className="grid" style={{ gap: '12px' }}>
            <label className="card-title">Instagram username</label>
            <input
              value={instagramUsername}
              onChange={(event) => setInstagramUsername(event.target.value)}
              className="input"
              placeholder="@username"
            />
          </div>
          <div className="grid" style={{ gap: '12px' }}>
            <label className="card-title">Niche / Category</label>
            <input
              value={niche}
              onChange={(event) => setNiche(event.target.value)}
              className="input"
              placeholder="Beauty, Food, Fitness"
            />
          </div>
          <div className="grid" style={{ gap: '12px' }}>
            <label className="card-title">Follower range</label>
            <select
              value={followerRange}
              onChange={(event) => setFollowerRange(event.target.value)}
              className="select"
            >
              <option>10k-50k</option>
              <option>50k-100k</option>
              <option>100k-250k</option>
              <option>250k+</option>
            </select>
          </div>
          <div className="grid" style={{ gap: '12px' }}>
            <label className="card-title">Location</label>
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="input"
              placeholder="City or region"
            />
          </div>
          <div className="grid" style={{ gap: '12px' }}>
            <label className="card-title">Notes</label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="textarea"
              rows={4}
              placeholder="Review summary, contact preference, or niche details."
            />
          </div>
          <button type="submit" className="button">Submit lead</button>
          {successMessage && <p style={{ color: '#4ade80' }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: '#f87171' }}>{errorMessage}</p>}
        </form>
      </section>

      <section className="page-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">Lead table</h2>
          {loading && <span style={{ color: '#94a3b8' }}>Loading leads…</span>}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Handle</th>
                <th>Niche</th>
                <th>Range</th>
                <th>Location</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.instagramUsername}</td>
                  <td>{lead.niche}</td>
                  <td>{lead.followerRange}</td>
                  <td>{lead.location}</td>
                  <td><LeadStatusBadge status={lead.status} /></td>
                  <td>{new Date(lead.createdAt).toLocaleString()}</td>
                  <td style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {leadStatuses.map((action) => (
                      <button
                        key={action.value}
                        type="button"
                        className="button secondary"
                        style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                        onClick={() => updateLeadStatus(lead.id, action.value)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
