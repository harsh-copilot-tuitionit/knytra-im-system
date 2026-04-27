import AppShell from '../../components/AppShell';

const accounts = [
  { name: 'Knytra Outreach 1', status: 'active', limit: '500 / day', sent: '120', notes: 'Healthy sending rate' },
  { name: 'Knytra Outreach 2', status: 'warming', limit: '300 / day', sent: '65', notes: 'Warming up after pause' },
  { name: 'Knytra Outreach 3', status: 'paused', limit: '0 / day', sent: '0', notes: 'Paused for review' },
  { name: 'Knytra Outreach 4', status: 'blocked', limit: '0 / day', sent: '0', notes: 'Blocked by Instagram' },
  { name: 'Knytra Outreach 5', status: 'active', limit: '450 / day', sent: '210', notes: 'Stable performance' },
];

export default function AccountsPage() {
  return (
    <AppShell activePage="accounts">
      <section className="page-card">
        <h1 className="page-heading">Accounts</h1>
        <p className="page-subtitle">Placeholder outreach accounts and health status for the Knytra automation stack.</p>
      </section>

      <section className="grid stats-grid">
        {accounts.map((account) => (
          <div key={account.name} className="card">
            <p className="card-title">{account.name}</p>
            <p className="card-value">{account.status}</p>
            <p>Daily limit: {account.limit}</p>
            <p>Messages sent today: {account.sent}</p>
            <p>Health notes: {account.notes}</p>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
