import argparse
import time
from typing import Any, Optional

import requests

import config
from instagram_client import close_browser, open_instagram, start_browser

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


def run_instagram_job(job_id: str, dry_run: bool):
    print('Worker mode: instagram')
    start_job(job_id)
    print(f'Worker: job {job_id} marked running')

    playwright = None
    browser = None
    page = None

    try:
        playwright, browser, page = start_browser()
        open_instagram(page)
        print(f'Worker: Instagram mode opened browser for job {job_id}')

        if dry_run:
            print('Worker: instagram dry-run mode enabled; marking job completed without sending messages')
            complete_data = complete_job(job_id)
            print(f'Worker: job {job_id} completed with data: {complete_data}')
        else:
            raise RuntimeError('Instagram mode scaffolded; message sending not enabled yet')
    finally:
        if playwright is not None and browser is not None:
            close_browser(playwright, browser)


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

        job_id = job.get('id')
        print(f'Worker: found job {job_id}, starting')

        try:
            if WORKER_MODE == 'dummy':
                run_dummy_job(job_id)
            elif WORKER_MODE == 'instagram':
                run_instagram_job(job_id, dry_run)
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
