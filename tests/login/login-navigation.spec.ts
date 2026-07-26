// spec: specs/login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { VALID_USER, ERROR_MESSAGES } from '../../data/users';
import { clearSession } from '../../utils/session';

test.describe('SauceDemo Login - Navigation & Session Guards', () => {
  // SauceDemo uses `data-test` attributes instead of Playwright's default `data-testid`.
  test.use({ testIdAttribute: 'data-test' });

  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
  });

  // TC-03: Successful logout
  test('TC-03 Successful logout redirects to the login page', async ({ page }) => {
    await loginPage.goto();
    await loginPage.login(VALID_USER.username, VALID_USER.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);

    await inventoryPage.logout();

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.usernameInput).toHaveValue('');
    await expect(loginPage.usernameInput).toHaveAttribute('placeholder', 'Username');
    await expect(loginPage.loginButton).toHaveValue('Login');
  });

  // TC-14: Direct URL access without session (route guard)
  test('TC-14 Direct navigation to inventory page while logged out redirects with a route-guard error', async ({ page }) => {
    await loginPage.goto();
    await clearSession(page);

    await page.goto('https://www.saucedemo.com/inventory.html');

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.errorMessage).toHaveText(ERROR_MESSAGES.routeGuard);
  });

  // TC-20: Browser back navigation after logout
  test('TC-20 Browser back navigation after logout does not expose a cached authenticated view', async ({ page }) => {
    await loginPage.goto();
    await loginPage.login(VALID_USER.username, VALID_USER.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);

    await inventoryPage.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    await page.goBack();

    await expect(page).not.toHaveURL(/\/inventory\.html$/);
    await expect(loginPage.errorMessage).toHaveText(ERROR_MESSAGES.routeGuard);
  });
});
