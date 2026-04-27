import AppShell from '../../components/AppShell';

const jobs = [
  { label: 'Queued jobs', value: '12' },
  { label: 'Running jobs', value: '3' },
  { label: 'Completed jobs', value: '68' },
  { label: 'Failed jobs', value: '4' },
];

export default function AutomationPage() {
  return (
    <AppShell activePage="automation">
      <section className="page-card">
        <h1 className="page-heading">Automation</h1>
        <p className="page-subtitle">Placeholder queue and worker logs for background outreach processing.</p>
      </section>

      <section className="page-card">
        <div className="grid stats-grid">
          {jobs.map((job) => (
            <div key={job.label} className="card">
              <p className="card-title">{job.label}</p>
              <p className="card-value">{job.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-card">
        <h2 className="card-title">Worker status</h2>
        <p>Worker is currently online and polling for jobs.</p>
        <div className="card" style={{ marginTop: '16px' }}>
          <p className="card-title">Latest logs</p>
          <p>• Knytra IM worker started</p>
          <p>• Checking for queued outreach jobs...</p>
          <p>• No blocked accounts detected</p>
        </div>
      </section>
    </AppShell>
  );
}
