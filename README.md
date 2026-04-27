# Knytra IM System

Knytra IM System is an internal web app for influencer sourcing, lead review, outreach queue management, and campaign tracking. It replaces the old spreadsheet-driven process with a modern frontend experience for interns and operators.

## Product Purpose

This repository hosts the frontend and backend scaffolding for an internal influencer marketing system. Interns submit leads through a web form, admins review and approve candidates, and a background worker will later process outreach jobs.

## Architecture

- **Next.js app** for the frontend and API routes
- **TypeScript** for type safety
- **React** for UI components
- **Python worker** placeholder for future automation
- **Environment variables** configured through `.env.example`

## Frontend App

The frontend includes:
- Home page with product overview
- Dashboard with placeholder lead and outreach metrics
- Leads page with submission form and lead status table
- Accounts page with outreach account health cards
- Automation page with queue and worker status placeholders

## Python Worker

The `worker/` folder contains a future automation worker scaffold. It prints worker activity in a loop and is intended to be extended into a queued outreach processor.

## Current MVP Scope

- Frontend-first internal app experience
- Basic lead submission form
- Placeholder review and queue UI
- API health endpoint
- Python worker placeholder

## Future Features

- Authentication and role-based access
- Database integration for leads, accounts, and jobs
- Lead review workflow with approve/reject logic
- Outreach job queue and worker scheduling
- Message templates and outreach status tracking
- Account health monitoring and reporting
- Python worker automation integration
