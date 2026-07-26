# Test Plan — SauceDemo Login Feature

## Context
Based on manual exploration of `https://www.saucedemo.com/` (login form, success path, error paths, route guard, and logout/navigation flows), this document consolidates the findings into a structured test plan. It is the reference spec for writing automated Playwright tests against the login feature, covering happy paths, negative/error paths, and edge cases.

Selectors referenced below (all confirmed via DOM inspection during exploration):
- Username: `[data-test="username"]`
- Password: `[data-test="password"]`
- Login button: `[data-test="login-button"]`
- Error banner text: `[data-test="error"]`
- Error dismiss button: `[data-test="error-button"]`
- Logout link: `[data-test="logout-sidebar-link"]`
- Burger menu button: `#react-burger-menu-btn`

## Priority Criteria
- **High** — high risk (security, access control, or blocks core user flow if broken) **and** high frequency (occurs on nearly every real-world session).
- **Medium** — important for coverage/robustness but not critical to the core login flow; failure would not block most users.
- **Low** — low impact if broken (cosmetic, redundant coverage, or rare/contrived input).

## Test Plan Table

| ID | Scenario | Steps | Expected Result | Priority |
|----|----------|-------|------------------|----------|
| TC-01 | Successful login (standard_user) | 1. Navigate to `/`. 2. Enter `standard_user` in Username. 3. Enter `secret_sauce` in Password. 4. Click Login button. | Redirected to `/inventory.html`; product grid visible; no error shown. | High |
| TC-02 | Successful login via Enter key | 1. Navigate to `/`. 2. Fill valid username + password. 3. Press `Enter` in password field (no button click). | Form submits; redirected to `/inventory.html`, same as button click. | Medium |
| TC-03 | Successful logout | 1. Log in as `standard_user`. 2. Open burger menu (`#react-burger-menu-btn`). 3. Click Logout (`[data-test="logout-sidebar-link"]`). | Redirected to `/`; login form is shown; session cleared. | High |
| TC-04 | Login with alternate valid users | 1. Repeat TC-01 substituting username with each of: `problem_user`, `performance_glitch_user`, `error_user`, `visual_user`. | Each logs in successfully and reaches `/inventory.html` (UI defects in these users are out of scope for the login feature itself). | Medium |
| TC-05 | Empty username and password | 1. Navigate to `/`. 2. Leave both fields empty. 3. Click Login. | Error shown: "Epic sadface: Username is required". Stays on `/`. | High |
| TC-06 | Username filled, password empty | 1. Enter valid username. 2. Leave password empty. 3. Click Login. | Error: "Epic sadface: Password is required". | High |
| TC-07 | Valid username, wrong password | 1. Enter `standard_user`. 2. Enter incorrect password. 3. Click Login. | Error: "Epic sadface: Username and password do not match any user in this service". | High |
| TC-08 | Invalid username, valid password | 1. Enter a non-existent username. 2. Enter `secret_sauce`. 3. Click Login. | Same mismatch error as TC-07. | Medium |
| TC-09 | Invalid username and password | 1. Enter random username. 2. Enter random password. 3. Click Login. | Same mismatch error as TC-07. | Low |
| TC-10 | Locked-out user | 1. Enter `locked_out_user`. 2. Enter `secret_sauce`. 3. Click Login. | Error: "Epic sadface: Sorry, this user has been locked out." Stays on `/`. | High |
| TC-11 | Error banner dismiss | 1. Trigger any login error (e.g. TC-05). 2. Click the `×` dismiss button (`[data-test="error-button"]`). | Error banner disappears; input fields' error styling clears; form ready for retry. | Low |
| TC-12 | Case-sensitive username | 1. Enter `STANDARD_USER` (uppercase). 2. Enter `secret_sauce`. 3. Click Login. | Login fails with mismatch error — username is case-sensitive. | Low |
| TC-13 | Case-sensitive password | 1. Enter `standard_user`. 2. Enter `SECRET_SAUCE` (uppercase). 3. Click Login. | Login fails with mismatch error — password is case-sensitive. | Low |
| TC-14 | Direct URL access without session (route guard) | 1. Ensure logged out (clear cookies/storage). 2. Navigate directly to `/inventory.html`. | Redirected to `/`; error: "Epic sadface: You can only access '/inventory.html' when you are logged in." | High |
| TC-15 | Leading/trailing whitespace in credentials | 1. Enter `" standard_user "` (with spaces) and correct password. 2. Click Login. | Login fails (mismatch error) unless app trims input — verify actual behavior; document result. | Low |
| TC-16 | SQL injection attempt in username | 1. Enter `' OR '1'='1` as username, any password. 2. Click Login. | Login fails with standard mismatch error; no error/exception exposing backend behavior. | Medium |
| TC-17 | XSS attempt in input fields | 1. Enter `<script>alert(1)</script>` in username field. 2. Click Login. | Input is treated as literal text; mismatch error shown; no script execution. | Medium |
| TC-18 | Extremely long input string | 1. Enter a 5,000+ character string in username and/or password. 2. Click Login. | Field accepts or truncates input gracefully; app does not crash; standard mismatch error shown. | Low |
| TC-19 | Multiple rapid failed login attempts | 1. Submit incorrect credentials 5–10 times in quick succession. | No client-side rate limiting/lockout is expected on this demo app — confirm each attempt returns the standard mismatch error without app instability. | Low |
| TC-20 | Browser back navigation after logout | 1. Log in. 2. Log out. 3. Click browser Back button. | Either redirected/blocked from `/inventory.html` (re-shows login or route-guard error) — verify no cached authenticated view is exposed. | Medium |
| TC-21 | Session persistence on page refresh | 1. Log in as `standard_user`. 2. Refresh `/inventory.html`. | User remains logged in; inventory page still renders (no forced logout). | High |
| TC-22 | Special-characters-only input | 1. Enter `!@#$%^&*()` in both fields. 2. Click Login. | Standard mismatch error; no crash or unhandled exception. | Low |

## Verification
- Implement as Playwright test specs (e.g. `tests/login.spec.ts`) using the `data-test` selectors listed above via `page.getByTestId(...)`.
- Run with `npx playwright test tests/login.spec.ts` and confirm all High/Medium priority cases pass before adding Low-priority/security-hardening cases.
- For TC-14/TC-20/TC-21 (session-related), use `browser_storage_state` / cookie clearing between test runs to ensure a clean, unauthenticated starting state.
