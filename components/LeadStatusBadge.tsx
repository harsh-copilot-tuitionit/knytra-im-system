'use client';

const statusMap: Record<string, string> = {
  new: 'status-new',
  approved: 'status-approved',
  rejected: 'status-rejected',
  queued: 'status-queued',
  messaged: 'status-messaged',
  replied: 'status-replied',
  interested: 'status-interested',
  converted: 'status-converted',
  failed: 'status-failed',
  do_not_contact: 'status-do_not_contact',
};

export default function LeadStatusBadge({ status }: { status: string }) {
  const badgeClass = statusMap[status] ?? 'status-do_not_contact';
  return <span className={`status-badge ${badgeClass}`}>{status.replace('_', ' ')}</span>;
}
