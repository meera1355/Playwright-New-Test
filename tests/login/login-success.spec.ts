// spec: specs/login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { VALID_USER, ALTERNATE_VALID_USERNAMES, STANDARD_PASSWORD } from '../../data/users';

test.describe('SauceDemo Login - Successful Authentication', () => {
  // SauceDemo uses `data-test` attributes instead of Playwright's default `data-testid`.
  test.use({ testIdAttribute: 'data-test' });

  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  // TC-01: Successful login (standard_user)
  test('TC-01 Successful login with standard_user redirects to inventory page', async ({ page }) => {
    await loginPage.login(VALID_USER.username, VALID_USER.password);

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(inventoryPage.pageTitle).toHaveText('Products');
    await expect(inventoryPage.items).toHaveCount(InventoryPage.EXPECTED_ITEM_COUNT);
    await expect(loginPage.errorMessage).toHaveCount(0);
  });

  // TC-02: Successful login via Enter key
  test('TC-02 Successful login via Enter key redirects to inventory page', async ({ page }) => {
    await loginPage.submitWithEnter(VALID_USER.username, VALID_USER.password);

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(inventoryPage.pageTitle).toHaveText('Products');
    await expect(inventoryPage.items).toHaveCount(InventoryPage.EXPECTED_ITEM_COUNT);
  });

  // TC-04: Login with alternate valid users
  for (const username of ALTERNATE_VALID_USERNAMES) {
    test(`TC-04 Login with alternate valid user "${username}" reaches inventory page`, async ({ page }) => {
      await loginPage.login(username, STANDARD_PASSWORD);

      await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
      await expect(inventoryPage.pageTitle).toHaveText('Products');
      await expect(inventoryPage.items).toHaveCount(InventoryPage.EXPECTED_ITEM_COUNT);
    });
  }

  // TC-21: Session persistence on page refresh
  test('TC-21 Session persists after refreshing the inventory page', async ({ page }) => {
    await loginPage.login(VALID_USER.username, VALID_USER.password);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    await inventoryPage.reload();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(inventoryPage.pageTitle).toHaveText('Products');
    await expect(inventoryPage.items).toHaveCount(InventoryPage.EXPECTED_ITEM_COUNT);
  });
});
