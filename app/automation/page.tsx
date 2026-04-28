'use client';

import { useEffect, useState, useCallback } from 'react';
import AppShell from '../../components/AppShell';
import { fetchArrayOrThrow } from '../../lib/client-api';

type Job = {
  id: string;
  status: string;
  attemptCount: number;
  scheduledAt: string | null;
  errorMessage?: string | null;
  createdAt: string;
  leadInstagramUsername: string;
  accountLabel: string;
  accountUsername: string;
};

type Log = {
  id: string;
  level: string;
  message: string;
  createdAt: string;
};

export default function AutomationPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const [jobsData, logsData] = await Promise.all([
        fetchArrayOrThrow<Job>('/api/jobs'),
        fetchArrayOrThrow<Log>('/api/logs'),
      ]);
      setJobs(jobsData);
      setLogs(logsData);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error: any) {
      setJobs([]);
      setLogs([]);
      setErrorMessage(
        error?.message ||
          'Automation data unavailable. Check database configuration. Database is not configured for this deployment. Add a production DATABASE_URL in Firebase App Hosting settings.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = window.setInterval(fetchData, 5000);
    return () => window.clearInterval(interval);
  }, [fetchData]);

  return (
    <AppShell activePage="automation">
      <section className="page-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1 className="page-heading">Automation</h1>
            <p className="page-subtitle">Queue and worker logs for outreach automation.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="button" className="button" onClick={fetchData}>
              Refresh
            </button>
            <div>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#6b7280' }}>Last updated</p>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>{lastUpdated || 'Never'}</p>
            </div>
          </div>
        </div>
      </section>

      {errorMessage && <p style={{ color: '#f87171' }}>{errorMessage}</p>}
      {loading ? (
        <p>Loading automation data…</p>
      ) : (
        <>
          <section className="page-card">
            <div className="grid stats-grid">
              <div className="card">
                <p className="card-title">Queued jobs</p>
                <p className="card-value">{jobs.filter((job) => job.status === 'queued').length}</p>
              </div>
              <div className="card">
                <p className="card-title">Running jobs</p>
                <p className="card-value">{jobs.filter((job) => job.status === 'running').length}</p>
              </div>
              <div className="card">
                <p className="card-title">Completed jobs</p>
                <p className="card-value">{jobs.filter((job) => job.status === 'completed').length}</p>
              </div>
              <div className="card">
                <p className="card-title">Failed jobs</p>
                <p className="card-value">{jobs.filter((job) => job.status === 'failed').length}</p>
              </div>
            </div>
          </section>

          <section className="page-card">
            <h2 className="card-title">Queued and processed jobs</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Influencer</th>
                    <th>Account</th>
                    <th>Account user</th>
                    <th>Status</th>
                    <th>Scheduled</th>
                    <th>Attempts</th>
                    <th>Error</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td>{job.id}</td>
                      <td>{job.leadInstagramUsername}</td>
                      <td>{job.accountLabel}</td>
                      <td>{job.accountUsername}</td>
                      <td>{job.status}</td>
                      <td>{job.scheduledAt ? new Date(job.scheduledAt).toLocaleString() : 'n/a'}</td>
                      <td>{job.attemptCount}</td>
                      <td>{job.errorMessage || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="page-card">
            <h2 className="card-title">Recent logs</h2>
            {logs.length === 0 ? (
              <p>No automation logs yet.</p>
            ) : (
              logs.slice(0, 10).map((log) => (
                <p key={log.id}>• [{log.level}] {log.message}</p>
              ))
            )}
          </section>
        </>
      )}
    </AppShell>
  );
}
