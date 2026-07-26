import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object Model for the SauceDemo login page (https://www.saucedemo.com/).
 *
 * This is the single, reusable entry point for authenticating in tests -
 * every spec should call through `login()` / `submitWithEnter()` rather than
 * re-implementing fill/click logic against the raw locators.
 */
export class LoginPage {
  readonly page: Page;

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorDismissButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
    this.errorDismissButton = page.getByTestId('error-button');
  }

  /** Navigate to the login page. */
  async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/');
  }

  /** Fill in credentials and submit the form via the Login button. */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Fill in credentials and submit the form by pressing Enter in the password field. */
  async submitWithEnter(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.passwordInput.press('Enter');
  }

  /** Returns the currently displayed error banner text (empty string if none). */
  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  /** Dismiss the error banner via the "x" button. */
  async dismissError(): Promise<void> {
    await this.errorDismissButton.click();
  }
}
