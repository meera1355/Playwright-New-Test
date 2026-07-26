// spec: specs/login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { INVALID_CREDENTIALS, ERROR_MESSAGES } from '../../data/users';

test.describe('SauceDemo Login - Security Hardening', () => {
  // SauceDemo uses `data-test` attributes instead of Playwright's default `data-testid`.
  test.use({ testIdAttribute: 'data-test' });

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // TC-16: SQL injection attempt in username
  test('TC-16 SQL injection attempt in username is rejected with the standard mismatch error', async ({ page }) => {
    const { username, password } = INVALID_CREDENTIALS.sqlInjection;
    await loginPage.login(username, password);

    await expect(loginPage.errorMessage).toHaveText(ERROR_MESSAGES.mismatch);
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  // TC-17: XSS attempt in input fields
  test('TC-17 XSS payload in username is treated as literal text with no script execution', async ({ page }) => {
    let dialogTriggered = false;
    page.once('dialog', async (dialog) => {
      dialogTriggered = true;
      await dialog.dismiss();
    });

    const { username, password } = INVALID_CREDENTIALS.xssAttempt;
    await loginPage.login(username, password);

    await expect(loginPage.errorMessage).toHaveText(ERROR_MESSAGES.mismatch);
    await expect(loginPage.usernameInput).toHaveValue(username);
    expect(dialogTriggered).toBeFalsy();
  });
});
