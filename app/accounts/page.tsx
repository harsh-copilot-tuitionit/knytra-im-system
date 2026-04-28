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

type AccountEditState = {
  dailyLimit: string;
  healthNotes: string;
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
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, AccountEditState>>({});

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const data = await fetchArrayOrThrow<Account>('/api/accounts');
        setAccounts(data);
        const initialEdits = data.reduce<Record<string, AccountEditState>>((acc, account) => {
          acc[account.id] = {
            dailyLimit: String(account.dailyLimit),
            healthNotes: account.healthNotes ?? '',
          };
          return acc;
        }, {});
        setEdits(initialEdits);
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCommand(text);
      window.setTimeout(() => setCopiedCommand(null), 2000);
    } catch {
      window.alert('Unable to copy command. Please copy manually.');
    }
  };

  const updateAccount = async (id: string, payload: Partial<{ status: string; dailyLimit: number; messagesSentToday: number; healthNotes: string }>) => {
    try {
      const response = await fetch(`/api/accounts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || 'Unable to update account');
      }
      const updated = await response.json();
      setAccounts((current) => current.map((account) => (account.id === id ? updated : account)));
      setEdits((current) => ({
        ...current,
        [id]: {
          dailyLimit: String(updated.dailyLimit),
          healthNotes: updated.healthNotes ?? '',
        },
      }));
    } catch (error: any) {
      window.alert(error?.message || 'Account update failed');
    }
  };

  const handleStatusChange = (account: Account, status: string) => {
    updateAccount(account.id, { status });
  };

  const handleResetMessages = (account: Account) => {
    updateAccount(account.id, { messagesSentToday: 0 });
  };

  const handleSaveDailyLimit = (account: Account) => {
    const editState = edits[account.id];
    const dailyLimit = Number(editState?.dailyLimit ?? account.dailyLimit);
    if (Number.isNaN(dailyLimit) || dailyLimit < 0) {
      window.alert('Daily limit must be a number greater than or equal to 0.');
      return;
    }
    updateAccount(account.id, { dailyLimit });
  };

  const handleSaveHealthNotes = (account: Account) => {
    const editState = edits[account.id];
    updateAccount(account.id, { healthNotes: editState?.healthNotes ?? '' });
  };

  const handleEditChange = (accountId: string, field: keyof AccountEditState, value: string) => {
    setEdits((current) => ({
      ...current,
      [accountId]: {
        ...current[accountId],
        [field]: value,
      },
    }));
  };

  return (
    <AppShell activePage="accounts">
      <section className="page-card">
        <h1 className="page-heading">Accounts</h1>
        <p className="page-subtitle">Outbound account health and current messaging capacity.</p>
        <p className="page-help">
          To run multiple accounts, open one terminal per account and run that account&apos;s worker command.
        </p>
      </section>

      <section className="page-card">
        {loading && <p>Loading accounts…</p>}
        {errorMessage && <p style={{ color: '#f87171' }}>{errorMessage}</p>}
        <div className="grid stats-grid">
          {accounts.map((account) => {
            const workerCommand = `python worker/main.py --account-id ${account.id}`;
            const editState = edits[account.id] || {
              dailyLimit: String(account.dailyLimit),
              healthNotes: account.healthNotes ?? '',
            };
            const remaining = account.dailyLimit - account.messagesSentToday;
            return (
              <div key={account.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p className="card-title">{account.label}</p>
                  <span className={statusStyles[account.status] ?? 'badge'}>{account.status}</span>
                </div>
                <p className="card-value">{account.username}</p>
                <p>ID: <code>{account.id}</code></p>
                <p>Daily limit: {account.dailyLimit}</p>
                <p>Messages sent today: {account.messagesSentToday}</p>
                <p>
                  Remaining today: {remaining > 0 ? remaining : 'Limit reached'}
                  {account.status === 'blocked' && (
                    <span style={{ color: '#dc2626', fontWeight: 600, marginLeft: '0.5rem' }}>Do not use</span>
                  )}
                </p>
                <p>Health notes: {account.healthNotes || 'No notes yet.'}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                  <button type="button" className="button button-small" onClick={() => handleStatusChange(account, 'active')}>
                    Activate
                  </button>
                  <button type="button" className="button button-small" onClick={() => handleStatusChange(account, 'warming')}>
                    Mark Warming
                  </button>
                  <button type="button" className="button button-small" onClick={() => handleStatusChange(account, 'paused')}>
                    Pause
                  </button>
                  <button type="button" className="button button-small" onClick={() => handleStatusChange(account, 'blocked')}>
                    Blocked
                  </button>
                  <button type="button" className="button button-small" onClick={() => handleResetMessages(account)}>
                    Reset messages
                  </button>
                </div>

                <div className="worker-command-block" style={{ marginTop: '1rem' }}>
                  <p className="card-label">Daily limit</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <input
                      type="number"
                      min={0}
                      value={editState.dailyLimit}
                      onChange={(event) => handleEditChange(account.id, 'dailyLimit', event.target.value)}
                      className="input"
                      style={{ width: '5rem' }}
                    />
                    <button type="button" className="button button-small" onClick={() => handleSaveDailyLimit(account)}>
                      Save limit
                    </button>
                  </div>
                </div>

                <div className="worker-command-block" style={{ marginTop: '1rem' }}>
                  <p className="card-label">Health notes</p>
                  <textarea
                    value={editState.healthNotes}
                    onChange={(event) => handleEditChange(account.id, 'healthNotes', event.target.value)}
                    className="textarea"
                    rows={3}
                    style={{ width: '100%' }}
                  />
                  <button type="button" className="button button-small" onClick={() => handleSaveHealthNotes(account)} style={{ marginTop: '0.5rem' }}>
                    Save notes
                  </button>
                </div>

                <div className="worker-command-block" style={{ marginTop: '1rem' }}>
                  <p className="card-label">Worker command:</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <code style={{ flex: '1 1 auto', padding: '0.5rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                      {workerCommand}
                    </code>
                    <button
                      type="button"
                      className="button"
                      onClick={() => copyToClipboard(workerCommand)}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Copy
                    </button>
                  </div>
                  {copiedCommand === workerCommand && (
                    <p style={{ color: '#10b981', marginTop: '0.5rem' }}>Worker command copied.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
