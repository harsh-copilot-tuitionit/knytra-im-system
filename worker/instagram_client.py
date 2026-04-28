import os
import time
from typing import Any, Tuple

from config import INSTAGRAM_HEADLESS, INSTAGRAM_SESSION_DIR

try:
    from playwright.sync_api import BrowserContext, Page, Playwright, sync_playwright
except ImportError as error:
    raise ImportError(
        'Playwright is required for Instagram mode. Install it with `pip install playwright` and run `python -m playwright install chromium`.'
    ) from error


def _ensure_session_dir(account_id: str) -> str:
    session_dir = os.path.join(INSTAGRAM_SESSION_DIR, account_id)
    os.makedirs(session_dir, exist_ok=True)
    return session_dir


def start_browser(account_id: str) -> Tuple[Playwright, BrowserContext, Page]:
    playwright = sync_playwright().start()
    session_dir = _ensure_session_dir(account_id)
    print(f'Instagram client: using session directory {session_dir}')
    context = playwright.chromium.launch_persistent_context(
        user_data_dir=session_dir,
        headless=INSTAGRAM_HEADLESS,
        viewport={'width': 1280, 'height': 800},
    )
    page = context.pages[0] if context.pages else context.new_page()
    return playwright, context, page


def open_instagram(page: Page) -> None:
    print('Instagram client: navigating to instagram.com')
    page.goto('https://www.instagram.com', timeout=30000)
    page.wait_for_load_state('networkidle')
    print('Instagram client: Instagram page loaded')


def is_logged_in(page: Page) -> bool:
    url = page.url
    if 'accounts/login' in url or 'accounts/password' in url or 'challenge' in url:
        return False

    try:
        if page.locator('[aria-label="Home"]').count() > 0:
            return True
        if page.locator('a[href="/accounts/activity/"]').count() > 0:
            return True
        if page.locator('img[alt*="profile picture"]').count() > 0:
            return True
    except Exception:
        pass

    return 'login' not in url


def wait_for_login(page: Page) -> None:
    print('Instagram client: checking login state')
    if is_logged_in(page):
        print('Instagram client: already logged in')
        return

    print('Instagram client: please log in manually in the opened browser.')
    while True:
        time.sleep(5)
        try:
            page.reload(timeout=30000)
            page.wait_for_load_state('networkidle')
            if is_logged_in(page):
                print('Instagram client: login detected')
                return
        except Exception as error:
            print(f'Instagram client: login check error: {error}')
            time.sleep(2)


def close_browser(playwright: Any, context: BrowserContext) -> None:
    try:
        context.close()
    except Exception as error:
        print(f'Instagram client: context close failed: {error}')
    try:
        playwright.stop()
    except Exception as error:
        print(f'Instagram client: playwright stop failed: {error}')
