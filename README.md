# Knytra IM System

Knytra IM System is an internal web app for influencer sourcing, lead review, outreach queue management, and campaign tracking. This repo is Phase 1 of replacing spreadsheet-based intern work with a frontend-driven lead management system.

## Product Purpose

The application allows interns to submit Instagram lead records and enables admins to manage those leads through review and queue actions. The app is frontend-first and does not rely on spreadsheets.

## Architecture

- **Next.js app** for the frontend and backend API routes
- **TypeScript** for type safety
- **Prisma + SQLite** for local-first persistence
- **React** client-side app experience
- **Python worker scaffold** for future automation

## Phase 1 Scope

- Persistent lead storage in SQLite via Prisma
- Lead submission form on `/leads`
- Lead table with runtime data fetched from `/api/leads`
- Admin actions: Approve, Reject, Queue, Do Not Contact
- Accounts API with placeholder outreach account data
- Jobs and logs API endpoints for future automation
- API health route at `/api/health`

## Setup

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Run the first migration and create the SQLite database:

```bash
npx prisma migrate dev --name init
```

5. Seed initial data:

```bash
npm run db:seed
```

6. Start the app:

```bash
npm run dev
```

## Database Setup

- SQLite is used for local development with `DATABASE_URL="file:./dev.db"`.
- Prisma schema is located in `prisma/schema.prisma`.
- Seed data creates an admin user, intern user, and five outreach accounts.

## API Routes

- `GET /api/health` — service status
- `GET /api/leads` — fetch all leads
- `POST /api/leads` — create a new lead
- `PATCH /api/leads/[id]` — update lead status
- `GET /api/accounts` — list outreach accounts
- `POST /api/accounts` — create a new outreach account
- `GET /api/jobs` — list outreach jobs
- `GET /api/logs` — list automation logs

## What Is Intentionally Not Included Yet

- Authentication and user login flows
- Instagram automation or Selenium tooling
- Full outreach message delivery logic
- Account provisioning automation
- Spreadsheet imports or exports

## Future Work

Future features will include role-based access, a complete review workflow, outreach job processing, message templates, account health monitoring, and Python automation integration.
