// spec: specs/login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { VALID_USER, LOCKED_OUT_USER, INVALID_CREDENTIALS, ERROR_MESSAGES } from '../../data/users';

test.describe('SauceDemo Login - Validation & Error Handling', () => {
  // SauceDemo uses `data-test` attributes instead of Playwright's default `data-testid`.
  test.use({ testIdAttribute: 'data-test' });

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // TC-05: Empty username and password
  test('TC-05 Submitting empty username and password shows username-required error', async ({ page }) => {
    await loginPage.login('', '');

    await expect(loginPage.errorMessage).toHaveText(ERROR_MESSAGES.usernameRequired);
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  // TC-06: Username filled, password empty
  test('TC-06 Submitting valid username with empty password shows password-required error', async ({ page }) => {
    await loginPage.login(VALID_USER.username, '');

    await expect(loginPage.errorMessage).toHaveText(ERROR_MESSAGES.passwordRequired);
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  // TC-07: Valid username, wrong password
  test('TC-07 Valid username with wrong password shows mismatch error', async ({ page }) => {
    const { username, password } = INVALID_CREDENTIALS.wrongPassword;
    await loginPage.login(username, password);

    await expect(loginPage.errorMessage).toHaveText(ERROR_MESSAGES.mismatch);
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  // TC-08: Invalid username, valid password
  test('TC-08 Invalid username with valid password shows the same mismatch error as TC-07', async ({ page }) => {
    const { username, password } = INVALID_CREDENTIALS.unknownUsername;
    await loginPage.login(username, password);

    await expect(loginPage.errorMessage).toHaveText(ERROR_MESSAGES.mismatch);
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  // TC-10: Locked-out user
  test('TC-10 Locked-out user login shows the locked-out error', async ({ page }) => {
    await loginPage.login(LOCKED_OUT_USER.username, LOCKED_OUT_USER.password);

    await expect(loginPage.errorMessage).toHaveText(ERROR_MESSAGES.lockedOut);
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });
});
