'use client';

import { useEffect, useState } from 'react';
import AppShell from '../../components/AppShell';

type Account = {
  id: string;
  label: string;
  username: string;
  status: string;
  dailyLimit: number;
  messagesSentToday: number;
  healthNotes?: string;
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
        const response = await fetch('/api/accounts');
        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        setErrorMessage('Unable to load accounts.');
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
              <p className="card-title">{account.label}</p>
              <p className="card-value">{account.status}</p>
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
