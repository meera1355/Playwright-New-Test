/**
 * Typed test data for the SauceDemo login feature.
 * Source: specs/login-test-plan.md and manual verification against https://www.saucedemo.com/.
 */

export interface Credentials {
  username: string;
  password: string;
}

/** Password shared by every accepted SauceDemo user. */
export const STANDARD_PASSWORD = 'secret_sauce';

/** Primary happy-path user (TC-01, TC-02, TC-21, etc.). */
export const VALID_USER: Credentials = {
  username: 'standard_user',
  password: STANDARD_PASSWORD,
};

/** User whose account is locked server-side (TC-10). */
export const LOCKED_OUT_USER: Credentials = {
  username: 'locked_out_user',
  password: STANDARD_PASSWORD,
};

/**
 * Other accepted usernames (besides standard_user / locked_out_user) that should
 * all successfully authenticate, per the login page's "Accepted usernames" list (TC-04).
 */
export const ALTERNATE_VALID_USERNAMES: readonly string[] = [
  'problem_user',
  'performance_glitch_user',
  'error_user',
  'visual_user',
];

/** Invalid / malicious credential combinations used by the negative and security test cases. */
export const INVALID_CREDENTIALS: Record<string, Credentials> = {
  /** TC-07: valid username, wrong password. */
  wrongPassword: { username: 'standard_user', password: 'wrong_password' },
  /** TC-08: non-existent username, valid password. */
  unknownUsername: { username: 'nonexistent_user', password: STANDARD_PASSWORD },
  /** TC-16: SQL injection attempt in the username field. */
  sqlInjection: { username: "' OR '1'='1", password: 'anything' },
  /** TC-17: XSS attempt in the username field. */
  xssAttempt: { username: '<script>alert(1)</script>', password: STANDARD_PASSWORD },
};

/** Exact error banner copy shown by the SauceDemo login form (data-test="error"). */
export const ERROR_MESSAGES = {
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  mismatch: 'Epic sadface: Username and password do not match any user in this service',
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  routeGuard: "Epic sadface: You can only access '/inventory.html' when you are logged in.",
} as const;
