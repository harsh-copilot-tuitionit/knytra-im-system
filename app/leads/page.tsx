import AppShell from '../../components/AppShell';
import LeadStatusBadge from '../../components/LeadStatusBadge';

const leads = [
  { username: '@elysianbeauty', niche: 'Beauty', followers: '82k', location: 'LA', status: 'new' },
  { username: '@urbanchef', niche: 'Food', followers: '48k', location: 'NYC', status: 'approved' },
  { username: '@travelpulse', niche: 'Travel', followers: '150k', location: 'Miami', status: 'queued' },
  { username: '@fitfuel', niche: 'Fitness', followers: '37k', location: 'Austin', status: 'messaged' },
  { username: '@styletribe', niche: 'Fashion', followers: '29k', location: 'Chicago', status: 'interested' },
];

export default function LeadsPage() {
  return (
    <AppShell activePage="leads">
      <section className="page-card">
        <h1 className="page-heading">Leads</h1>
        <p className="page-subtitle">Submit new Instagram leads and monitor status across the review pipeline.</p>
      </section>

      <section className="page-card">
        <form className="grid" style={{ gap: '16px' }}>
          <div className="grid" style={{ gap: '12px' }}>
            <label className="card-title">Instagram username</label>
            <input className="input" placeholder="@username" />
          </div>
          <div className="grid" style={{ gap: '12px' }}>
            <label className="card-title">Niche / Category</label>
            <input className="input" placeholder="Beauty, Food, Fitness" />
          </div>
          <div className="grid" style={{ gap: '12px' }}>
            <label className="card-title">Follower range</label>
            <select className="select">
              <option>10k-50k</option>
              <option>50k-100k</option>
              <option>100k-250k</option>
              <option>250k+</option>
            </select>
          </div>
          <div className="grid" style={{ gap: '12px' }}>
            <label className="card-title">Location</label>
            <input className="input" placeholder="City or region" />
          </div>
          <div className="grid" style={{ gap: '12px' }}>
            <label className="card-title">Notes</label>
            <textarea className="textarea" rows={4} placeholder="Review summary, contact preference, or niche details." />
          </div>
          <button type="button" className="button">Submit lead</button>
        </form>
      </section>

      <section className="page-card">
        <h2 className="card-title">Lead table</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Handle</th>
                <th>Niche</th>
                <th>Followers</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.username}>
                  <td>{lead.username}</td>
                  <td>{lead.niche}</td>
                  <td>{lead.followers}</td>
                  <td>{lead.location}</td>
                  <td><LeadStatusBadge status={lead.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
