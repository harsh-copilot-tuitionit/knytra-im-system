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
        if page.locator('nav').count() > 0 and page.locator('a[href="/explore/"]').count() > 0:
            return True
    except Exception:
        pass

    if page.locator('input[name="username"]').count() > 0:
        return False
    if page.locator('input[name="password"]').count() > 0:
        return False
    if page.locator('text="Log in"').count() > 0:
        return False

    return 'accounts/login' not in url and 'challenge' not in url


def is_login_page(page: Page) -> bool:
    url = page.url
    if 'accounts/login' in url or 'accounts/password' in url or 'challenge' in url:
        return True

    try:
        if page.locator('input[name="username"]').count() > 0:
            return True
        if page.locator('input[name="password"]').count() > 0:
            return True
        if page.locator('text="Log in"').count() > 0:
            return True
    except Exception:
        pass

    return False


def wait_for_login(page: Page, timeout_seconds: int = 300) -> bool:
    print('Instagram client: checking login state')
    if is_logged_in(page):
        print('Instagram session ready.')
        return True

    print('Instagram client: please log in manually in the opened browser.')
    print(f'Waiting up to {timeout_seconds} seconds for login...')

    start_time = time.time()
    while True:
        elapsed = time.time() - start_time
        if elapsed >= timeout_seconds:
            raise RuntimeError('Instagram login was not completed within 5 minutes')

        time.sleep(3)
        try:
            page.reload(timeout=30000)
            page.wait_for_load_state('networkidle')
            if is_logged_in(page):
                print('Login detected. Session saved.')
                return True
            if is_login_page(page):
                print('Still waiting for manual login...')
            else:
                print('Still waiting for manual login; login form not visible yet')
        except Exception as error:
            print(f'Instagram client: login check error: {error}')
            time.sleep(1)


def open_profile(page: Page, username: str) -> None:
    clean_username = username.lstrip('@').strip().lower()
    profile_url = f'https://www.instagram.com/{clean_username}/'
    print(f'Instagram client: opening influencer profile {profile_url}')
    page.goto(profile_url, timeout=30000)
    page.wait_for_load_state('networkidle')

    try:
        if page.locator('text=Sorry, this page isn\'t available.').count() > 0:
            raise RuntimeError(f'Instagram profile {clean_username} was not found')
    except Exception:
        pass

    try:
        if page.locator('img[alt*="profile picture"]').count() > 0 or page.locator('header').count() > 0:
            print(f'Instagram client: profile page loaded for @{clean_username}')
            return
    except Exception as error:
        print(f'Instagram client: profile page detection error: {error}')

    print(f'Instagram client: profile page opened for @{clean_username} (could not verify exact profile elements)')


def open_message_dialog(page: Page) -> None:
    print('Instagram client: attempting to open message dialog')
    message_button = None

    for selector in ['text="Message"', 'text="Send message"']:
        button = page.locator(selector)
        if button.count() > 0:
            message_button = button.first()
            break

    if not message_button:
        raise RuntimeError('Message button not available')

    message_button.click()
    page.wait_for_load_state('networkidle')
    print('Instagram client: message dialog opened')

    if not (
        page.locator('textarea').count() > 0
        or page.locator('div[contenteditable="true"]').count() > 0
    ):
        raise RuntimeError('DM input not found')


def type_message_draft(page: Page, message: str) -> None:
    print('Instagram client: typing draft message')
    textbox = None
    if page.locator('textarea').count() > 0:
        textbox = page.locator('textarea').first()
    elif page.locator('div[contenteditable="true"]').count() > 0:
        textbox = page.locator('div[contenteditable="true"]').first()

    if not textbox:
        raise RuntimeError('DM input not found')

    try:
        textbox.fill(message)
    except Exception:
        textbox.type(message)

    print('Instagram client: draft message typed')


def close_browser(playwright: Any, context: BrowserContext) -> None:
    try:
        context.close()
    except Exception as error:
        print(f'Instagram client: context close failed: {error}')
    try:
        playwright.stop()
    except Exception as error:
        print(f'Instagram client: playwright stop failed: {error}')
