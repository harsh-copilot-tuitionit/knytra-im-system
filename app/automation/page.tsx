'use client';

import { useEffect, useState } from 'react';
import AppShell from '../../components/AppShell';

type Job = {
  id: string;
  status: string;
  attemptCount: number;
  scheduledAt: string | null;
  createdAt: string;
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const [jobsRes, logsRes] = await Promise.all([fetch('/api/jobs'), fetch('/api/logs')]);
        setJobs(await jobsRes.json());
        setLogs(await logsRes.json());
      } catch (error) {
        setErrorMessage('Unable to load automation data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AppShell activePage="automation">
      <section className="page-card">
        <h1 className="page-heading">Automation</h1>
        <p className="page-subtitle">Queue and worker logs for outreach automation.</p>
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
            <h2 className="card-title">Worker status</h2>
            <p>Worker data is sourced from the automation API endpoints.</p>
            <div className="card" style={{ marginTop: '16px' }}>
              <p className="card-title">Recent logs</p>
              {logs.slice(0, 5).map((log) => (
                <p key={log.id}>• [{log.level}] {log.message}</p>
              ))}
            </div>
          </section>
        </>
      )}
    </AppShell>
  );
}
