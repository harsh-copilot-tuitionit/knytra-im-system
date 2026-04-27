export type LeadStatus =
  | 'new'
  | 'approved'
  | 'rejected'
  | 'queued'
  | 'messaged'
  | 'replied'
  | 'interested'
  | 'converted'
  | 'failed'
  | 'do_not_contact';

export interface Lead {
  username: string;
  niche: string;
  followers: string;
  location: string;
  status: LeadStatus;
  notes: string;
}

export interface Account {
  name: string;
  status: 'active' | 'warming' | 'paused' | 'blocked';
  limit: string;
  sent: string;
  notes: string;
}

export interface AutomationStats {
  queued: number;
  running: number;
  completed: number;
  failed: number;
}
