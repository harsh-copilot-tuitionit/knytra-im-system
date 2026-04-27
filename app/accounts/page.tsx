'use client';

import { useEffect, useState } from 'react';
import AppShell from '../../components/AppShell';
import { fetchArrayOrThrow } from '../../lib/client-api';

type Account = {
  id: string;
  label: string;
  username: string;
  status: string;
  dailyLimit: number;
  messagesSentToday: number;
  healthNotes?: string;
};

const statusStyles: Record<string, string> = {
  active: 'badge badge-active',
  warming: 'badge badge-warming',
  paused: 'badge badge-paused',
  blocked: 'badge badge-blocked',
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const data = await fetchArrayOrThrow<Account>('/api/accounts');
        setAccounts(data);
      } catch (error: any) {
        setAccounts([]);
        setErrorMessage(
          error?.message ||
            'Accounts unavailable. Check database configuration. Database is not configured for this deployment. Add a production DATABASE_URL in Firebase App Hosting settings.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <AppShell activePage="accounts">
      <section className="page-card">
        <h1 className="page-heading">Accounts</h1>
        <p className="page-subtitle">Outbound account health and current messaging capacity.</p>
      </section>

      <section className="page-card">
        {loading && <p>Loading accounts…</p>}
        {errorMessage && <p style={{ color: '#f87171' }}>{errorMessage}</p>}
        <div className="grid stats-grid">
          {accounts.map((account) => (
            <div key={account.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p className="card-title">{account.label}</p>
                <span className={statusStyles[account.status] ?? 'badge'}>{account.status}</span>
              </div>
              <p className="card-value">{account.username}</p>
              <p>Daily limit: {account.dailyLimit}</p>
              <p>Messages sent today: {account.messagesSentToday}</p>
              <p>Health notes: {account.healthNotes || 'No notes yet.'}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
