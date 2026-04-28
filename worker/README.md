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

### Worker modes

The worker supports two modes:

- `WORKER_MODE=dummy` — the existing dummy worker behavior.
- `WORKER_MODE=instagram` — opens a browser, navigates to Instagram, and prepares for future automation without sending real messages.

### Account-scoped worker

To poll jobs for a specific outreach account:

```bash
WORKER_SECRET=<worker-secret> APP_BASE_URL=http://localhost:3000 python worker/main.py --account-id <accountId>
```

Or use the environment variable:

```bash
WORKER_SECRET=<worker-secret> APP_BASE_URL=http://localhost:3000 WORKER_ACCOUNT_ID=<accountId> python worker/main.py
```

### Instagram mode

Install Python and Playwright dependencies:

```bash
pip install -r worker/requirements.txt
python -m playwright install chromium
```

Run Instagram mode:

```bash
WORKER_MODE=instagram INSTAGRAM_HEADLESS=false WORKER_SECRET=<worker-secret> APP_BASE_URL=http://localhost:3000 python worker/main.py --account-id <accountId>
```

In Instagram mode, the worker will open a browser and navigate to Instagram, but it will not send any direct messages yet.
