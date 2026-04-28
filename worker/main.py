import argparse
import time
from typing import Any, Optional

import requests

import config
from instagram_client import (
    close_browser,
    is_logged_in,
    open_instagram,
    open_message_dialog,
    open_profile,
    start_browser,
    type_message_draft,
    wait_for_login,
)

APP_BASE_URL = config.APP_BASE_URL
WORKER_SECRET = config.WORKER_SECRET
WORKER_ACCOUNT_ID = config.WORKER_ACCOUNT_ID
WORKER_MODE = config.WORKER_MODE
WORKER_DRY_RUN = config.WORKER_DRY_RUN

if not WORKER_SECRET:
    raise SystemExit('Missing WORKER_SECRET environment variable')

HEADERS = {
    'Authorization': f'Bearer {WORKER_SECRET}',
    'Content-Type': 'application/json',
}


def get_next_job(account_id: Optional[str] = None):
    url = f'{APP_BASE_URL}/api/worker/jobs/next'
    params = {}
    if account_id:
        params['accountId'] = account_id

    response = requests.get(url, headers=HEADERS, params=params, timeout=30)
    if response.status_code != 200:
        print(f'Worker: failed to fetch next job ({response.status_code}): {response.text}')
        return None
    data = response.json()
    if not data:
        return None
    return data


def start_job(job_id: str):
    url = f'{APP_BASE_URL}/api/worker/jobs/{job_id}/start'
    response = requests.post(url, headers=HEADERS, timeout=30)
    if response.status_code != 200:
        raise RuntimeError(f'Start failed: {response.status_code} {response.text}')
    return response.json()


def complete_job(job_id: str):
    url = f'{APP_BASE_URL}/api/worker/jobs/{job_id}/complete'
    response = requests.post(url, headers=HEADERS, timeout=30)
    if response.status_code != 200:
        raise RuntimeError(f'Complete failed: {response.status_code} {response.text}')
    data = response.json()
    print(f'Worker: complete response: {data}')
    return data


def fail_job(job_id: str, message: str):
    url = f'{APP_BASE_URL}/api/worker/jobs/{job_id}/fail'
    response = requests.post(url, headers=HEADERS, json={'errorMessage': message}, timeout=30)
    if response.status_code != 200:
        print(f'Fail endpoint failed: {response.status_code} {response.text}')
    return response.json()


def parse_args():
    parser = argparse.ArgumentParser(description='Knytra IM worker')
    parser.add_argument('--account-id', dest='account_id', default=WORKER_ACCOUNT_ID)
    parser.add_argument('--dry-run', action='store_true', dest='dry_run', default=WORKER_DRY_RUN)
    return parser.parse_args()


def run_dummy_job(job_id: str):
    print('Worker mode: dummy')
    start_job(job_id)
    print(f'Worker: job {job_id} marked running')
    time.sleep(3)
    complete_data = complete_job(job_id)
    print(f'Worker: job {job_id} completed with data: {complete_data}')


def run_instagram_job(job_id: str, account_id: str, instagram_username: Optional[str], dry_run: bool):
    if not account_id:
        raise RuntimeError('Instagram mode requires --account-id or WORKER_ACCOUNT_ID')
    if not instagram_username:
        raise RuntimeError('Instagram mode requires a lead instagramUsername')

    message = config.MESSAGE_TEMPLATE.replace('@{username}', f'@{instagram_username.lstrip("@")}').replace('{username}', instagram_username.lstrip('@'))

    print('Worker mode: instagram')
    print(f'Worker: selected account id {account_id}')
    print(f'Worker: opening influencer profile @{instagram_username.lstrip("@")}')
    start_job(job_id)
    print(f'Worker: job {job_id} marked running')

    playwright = None
    context = None
    page = None

    try:
        playwright, context, page = start_browser(account_id)
        open_instagram(page)
        print(f'Worker: Instagram mode opened browser for job {job_id}')
        if is_logged_in(page):
            print('Instagram session ready.')
        else:
            wait_for_login(page)
            print('Instagram session ready.')

        open_profile(page, instagram_username)
        print(f'Opened Instagram profile @{instagram_username.lstrip("@")}')

        if dry_run:
            print(f'Would send: {message}')
            raise RuntimeError('Dry run mode; draft message not sent')

        open_message_dialog(page)
        print('Opened message dialog')
        type_message_draft(page, message)
        print('Typed draft message')
        raise RuntimeError('Draft message typed; manual send required')
    finally:
        if playwright is not None and context is not None:
            close_browser(playwright, context)


def main(account_id: Optional[str] = None, dry_run: bool = False) -> None:
    print('Knytra IM worker started')
    print(f'Worker mode: {WORKER_MODE}')
    print(f'Using app base URL: {APP_BASE_URL}')
    if account_id:
        print(f'Polling jobs for account: {account_id}')

    while True:
        print('Worker: checking for queued outreach jobs...')
        job = get_next_job(account_id)
        if not job:
            print('Worker: no queued jobs found')
            time.sleep(10)
            continue

        job_id = job.get('jobId') or job.get('id')
        instagram_username = job.get('instagramUsername')
        print(f'Worker: found job {job_id}, starting')

        try:
            if WORKER_MODE == 'dummy':
                run_dummy_job(job_id)
            elif WORKER_MODE == 'instagram':
                if not account_id:
                    raise RuntimeError('Instagram mode requires --account-id or WORKER_ACCOUNT_ID')
                run_instagram_job(job_id, account_id, instagram_username, dry_run)
            else:
                raise RuntimeError(f'Unknown worker mode: {WORKER_MODE}')
        except Exception as error:
            print(f'Worker: job {job_id} failed with error: {error}')
            try:
                fail_job(job_id, str(error))
            except Exception as loop_error:
                print(f'Worker: failed to report failure for job {job_id}: {loop_error}')

        time.sleep(10)


if __name__ == '__main__':
    args = parse_args()
    main(args.account_id, args.dry_run)
