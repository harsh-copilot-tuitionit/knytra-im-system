import AppShell from '../components/AppShell';
import StatCard from '../components/StatCard';

const stats = [
  { label: 'Leads submitted today', value: '24' },
  { label: 'Leads approved', value: '8' },
  { label: 'Jobs queued', value: '12' },
  { label: 'Messages sent', value: '73' },
  { label: 'Replies received', value: '15' },
  { label: 'Active outreach accounts', value: '5' },
];

export default function HomePage() {
  return (
    <AppShell activePage="dashboard">
      <section className="page-card">
        <h1 className="page-heading">Knytra IM System</h1>
        <p className="page-subtitle">
          Knytra IM System is an internal CRM and automation dashboard for influencer sourcing, lead review, outreach queues, and campaign tracking.
        </p>
      </section>

      <section className="page-card">
        <h2 className="card-title">Overview</h2>
        <div className="grid stats-grid">
          {stats.map((stat) => (
            <StatCard key={stat.label} title={stat.label} value={stat.value} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
