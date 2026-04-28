import os

from dotenv import load_dotenv

load_dotenv()

APP_BASE_URL = os.getenv('APP_BASE_URL', 'http://localhost:3000').rstrip('/')
WORKER_SECRET = os.getenv('WORKER_SECRET')
WORKER_ACCOUNT_ID = os.getenv('WORKER_ACCOUNT_ID')
WORKER_MODE = os.getenv('WORKER_MODE', 'dummy').lower()
INSTAGRAM_HEADLESS = os.getenv('INSTAGRAM_HEADLESS', 'true').lower() != 'false'
WORKER_DRY_RUN = os.getenv('WORKER_DRY_RUN', 'false').lower() == 'true'
