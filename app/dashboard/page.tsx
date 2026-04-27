import AppShell from '../../components/AppShell';
import StatCard from '../../components/StatCard';

const cards = [
  { label: 'Leads submitted today', value: '24' },
  { label: 'Leads approved', value: '8' },
  { label: 'Jobs queued', value: '12' },
  { label: 'Messages sent', value: '73' },
  { label: 'Replies received', value: '15' },
  { label: 'Active outreach accounts', value: '5' },
];

export default function DashboardPage() {
  return (
    <AppShell activePage="dashboard">
      <section className="page-card">
        <h1 className="page-heading">Dashboard</h1>
        <p className="page-subtitle">Live placeholder metrics for lead volume, outreach queue size, and account activity.</p>
      </section>

      <section className="page-card">
        <div className="grid stats-grid">
          {cards.map((card) => (
            <StatCard key={card.label} title={card.label} value={card.value} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
