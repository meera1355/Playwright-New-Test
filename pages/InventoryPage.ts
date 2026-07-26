import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object Model for the SauceDemo post-login inventory page
 * (https://www.saucedemo.com/inventory.html), including the burger-menu sidebar.
 */
export class InventoryPage {
  readonly page: Page;

  /** Confirmed via DOM inspection: the burger menu button has an id, no data-test attribute. */
  readonly burgerMenuButton: Locator;
  readonly closeMenuButton: Locator;
  readonly logoutLink: Locator;
  readonly allItemsLink: Locator;
  /** Stable container that is only present once the inventory page has loaded. */
  readonly inventoryList: Locator;
  /** "Products" page heading - used to assert exact page-load text. */
  readonly pageTitle: Locator;
  /** Individual product cards - used to assert the exact expected item count. */
  readonly items: Locator;

  constructor(page: Page) {
    this.page = page;

    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
    this.logoutLink = page.getByTestId('logout-sidebar-link');
    this.allItemsLink = page.getByTestId('inventory-sidebar-link');
    this.inventoryList = page.getByTestId('inventory-list');
    this.pageTitle = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
  }

  /** Number of products currently rendered (standard_user's catalog is a fixed 6 items). */
  static readonly EXPECTED_ITEM_COUNT = 6;

  /** Open the burger-menu sidebar. */
  async openMenu(): Promise<void> {
    await this.burgerMenuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  /** Close the burger-menu sidebar. */
  async closeMenu(): Promise<void> {
    await this.closeMenuButton.click();
  }

  /** Open the burger menu and click Logout, ending the session. */
  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutLink.click();
  }

  /** Navigate back to "All Items" from the sidebar. */
  async goToAllItems(): Promise<void> {
    await this.openMenu();
    await this.allItemsLink.click();
  }

  /** Reload the current page (used to verify session persistence on refresh). */
  async reload(): Promise<void> {
    await this.page.reload();
  }
}
