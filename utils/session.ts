import { type Page } from '@playwright/test';

/**
 * Reusable helpers only - no test/assertion logic belongs in here.
 * Login steps are intentionally NOT duplicated here; use `pages/LoginPage.ts` for that.
 */

/**
 * Guarantees a logged-out state by clearing cookies and browser storage for the
 * current page's context. Needed for route-guard style tests (e.g. TC-14) that must
 * start from a verifiably unauthenticated session, even though Playwright already
 * gives every test a fresh, isolated browser context by default.
 *
 * Must be called after the page has navigated to the target origin at least once -
 * browsers deny access to localStorage/sessionStorage on the initial `about:blank`
 * document.
 */
export async function clearSession(page: Page): Promise<void> {
  await page.context().clearCookies();
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
}
