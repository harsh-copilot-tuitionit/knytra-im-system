# Knytra IM Worker

This folder contains the Python worker scaffold for future outreach automation.

## Purpose

The worker will later poll queued leads and process outreach jobs in the background.

## Current behavior

- Polls the app for the oldest queued outreach job every 10 seconds
- Marks the job as running
- Waits 3 seconds and then marks the job as completed
- Updates the linked lead to `messaged`
- Increments the assigned account's `messagesSentToday`
- Creates automation logs for start/completion events

## Running

```bash
WORKER_SECRET=<worker-secret> APP_BASE_URL=http://localhost:3000 python worker/main.py
```

### Account-scoped worker

To poll jobs for a specific outreach account:

```bash
WORKER_SECRET=<worker-secret> APP_BASE_URL=http://localhost:3000 python worker/main.py --account-id <accountId>
```

Or use the environment variable:

```bash
WORKER_SECRET=<worker-secret> APP_BASE_URL=http://localhost:3000 WORKER_ACCOUNT_ID=<accountId> python worker/main.py
```
