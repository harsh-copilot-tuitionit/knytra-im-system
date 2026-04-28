from typing import Any, Dict, Tuple

from config import INSTAGRAM_HEADLESS

try:
    from playwright.sync_api import Browser, Page, Playwright, sync_playwright
except ImportError as error:
    raise ImportError(
        'Playwright is required for Instagram mode. Install it with `pip install playwright` and run `python -m playwright install chromium`.'
    ) from error


def start_browser() -> Tuple[Any, Browser, Page]:
    playwright = sync_playwright().start()
    browser = playwright.chromium.launch(headless=INSTAGRAM_HEADLESS)
    context = browser.new_context()
    page = context.new_page()
    return playwright, browser, page


def open_instagram(page: Page) -> None:
    print('Instagram client: navigating to instagram.com')
    page.goto('https://www.instagram.com', timeout=30000)
    page.wait_for_load_state('networkidle')
    print('Instagram client: Instagram page loaded')


def close_browser(playwright: Any, browser: Browser) -> None:
    try:
        browser.close()
    except Exception as error:
        print(f'Instagram client: browser close failed: {error}')
    try:
        playwright.stop()
    except Exception as error:
        print(f'Instagram client: playwright stop failed: {error}')
