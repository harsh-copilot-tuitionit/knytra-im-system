import os

from dotenv import load_dotenv

load_dotenv()

APP_BASE_URL = os.getenv('APP_BASE_URL', 'http://localhost:3000').rstrip('/')
WORKER_SECRET = os.getenv('WORKER_SECRET')
WORKER_ACCOUNT_ID = os.getenv('WORKER_ACCOUNT_ID')
WORKER_MODE = os.getenv('WORKER_MODE', 'dummy').lower()
INSTAGRAM_HEADLESS = os.getenv('INSTAGRAM_HEADLESS', 'true').lower() != 'false'
INSTAGRAM_SESSION_DIR = os.path.abspath(os.getenv('INSTAGRAM_SESSION_DIR', 'worker/sessions'))
MESSAGE_TEMPLATE = os.getenv(
    'MESSAGE_TEMPLATE',
    'Hey @{username}, we loved your content and wanted to explore a collaboration with Knytra.',
)
WORKER_DRY_RUN = os.getenv('WORKER_DRY_RUN', 'false').lower() == 'true'
