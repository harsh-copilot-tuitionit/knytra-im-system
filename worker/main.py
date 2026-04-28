import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

APP_BASE_URL = os.getenv('APP_BASE_URL', 'http://localhost:3000').rstrip('/')
WORKER_SECRET = os.getenv('WORKER_SECRET')

if not WORKER_SECRET:
    raise SystemExit('Missing WORKER_SECRET environment variable')

HEADERS = {
    'Authorization': f'Bearer {WORKER_SECRET}',
    'Content-Type': 'application/json',
}


def get_next_job():
    url = f'{APP_BASE_URL}/api/worker/jobs/next'
    response = requests.get(url, headers=HEADERS, timeout=30)
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
    return response.json()


def fail_job(job_id: str, message: str):
    url = f'{APP_BASE_URL}/api/worker/jobs/{job_id}/fail'
    response = requests.post(url, headers=HEADERS, json={'errorMessage': message}, timeout=30)
    if response.status_code != 200:
        print(f'Fail endpoint failed: {response.status_code} {response.text}')
    return response.json()


def main() -> None:
    print('Knytra IM worker started')
    print(f'Using app base URL: {APP_BASE_URL}')

    while True:
        print('Worker: checking for queued outreach jobs...')
        job = get_next_job()
        if not job:
            print('Worker: no queued jobs found')
            time.sleep(10)
            continue

        job_id = job.get('id')
        print(f"Worker: found job {job_id}, starting")

        try:
            start_job(job_id)
            print(f'Worker: job {job_id} marked running')
            time.sleep(3)
            complete_job(job_id)
            print(f'Worker: job {job_id} completed')
        except Exception as error:
            print(f'Worker: job {job_id} failed with error: {error}')
            try:
                fail_job(job_id, str(error))
            except Exception as loop_error:
                print(f'Worker: failed to report failure for job {job_id}: {loop_error}')

        time.sleep(10)


if __name__ == '__main__':
    main()
