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

In Instagram mode, the worker will open a browser, load Instagram, and open the influencer profile for the queued job.
It will also open the direct message dialog and type a draft message, but it will not send the message.

Use `MESSAGE_TEMPLATE` to customize the draft:

```bash
MESSAGE_TEMPLATE="Hey @{username}, we loved your content and wanted to explore a collaboration with Knytra."
```

### Instagram login session storage

The first time you run Instagram mode for an account, the worker will open a browser and allow you to log in manually.
The session is saved to `worker/sessions/<accountId>/` and reused on future runs.

Example first-time login:

```bash
WORKER_MODE=instagram INSTAGRAM_HEADLESS=false WORKER_SECRET=<worker-secret> APP_BASE_URL=http://localhost:3000 python worker/main.py --account-id <accountId>
```

After logging in manually, the worker will detect the session and keep it ready for future jobs.
It will wait up to 5 minutes for manual login before timing out.

For next runs, the same session folder will be reused so you do not need to log in again.
