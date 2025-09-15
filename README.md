# SauceDemo Playwright + TypeScript Test Suite

End-to-end UI automation for [SauceDemo](https://www.saucedemo.com/) built with [Playwright Test](https://playwright.dev/docs/test-intro) and [Cucumber](https://cucumber.io/) in TypeScript. The project demonstrates how to mix traditional Playwright spec files with behaviour-driven scenarios, while also layering visual regression and accessibility checks.

## Highlights
- **Coverage for critical flows.** Regression specs exercise authentication, inventory management, cart behaviour, checkout math, navigation, and logout flows, mirroring equivalent Cucumber features tagged with `@auth`, `@inventory`, `@cart`, `@checkout`, `@navigation`, and `@smoke`.
- **Page Object Model.** Reusable page abstractions (login, header, inventory, item detail, cart, checkout) keep tests focused on behaviour instead of selectors.
- **Multi-browser execution.** The default Playwright configuration runs Chromium, Firefox, and WebKit projects in parallel for cross-browser confidence.
- **Visual and accessibility safety nets.** Dedicated suites rely on Playwright's screenshot assertions and `axe-core` to catch UI regressions and WCAG violations.
- **Cucumber integration.** TypeScript step definitions reuse the same Playwright page objects and capture screenshots automatically on step failure.

## Getting started
1. **Install prerequisites**
   - Node.js ≥ 18 (Playwright 1.55 requires an active LTS release).
   - npm (ships with Node) or your preferred package manager.
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Install Playwright browsers and system dependencies**
   ```bash
   npx playwright install --with-deps
   ```

## Running the Playwright spec suites
| Command | Description |
| --- | --- |
| `npm run smoke` | Fast happy-path checks (login, add/remove item, basic checkout, logout). |
| `npm run regression` | Full regression pack spanning auth, inventory, cart, checkout, and navigation specs. |
| `npm run visual` | Captures and compares UI baselines via `expect(page).toHaveScreenshot(...)`. |
| `npm run accessibility` | Executes the axe-powered accessibility smoke tests. |
| `npm run chromium` / `npm run firefox` / `npm run webkit` | Run the suite against a single browser project.

Additional tips:
- Filter any Playwright run with `npx playwright test --grep @tag-name` to execute a tagged subset.
- Update visual baselines after intentional UI changes with `npx playwright test tests/visual --update-snapshots`.
- View the HTML report locally via `npx playwright show-report` after a run.

## Running the Cucumber suites
The Cucumber layer mirrors the Playwright tags and scenarios. Each npm script maps to a `--tags` expression:

| Command | Tags |
| --- | --- |
| `npm run smoke:bdd` | `@smoke` |
| `npm run regression:auth:bdd` | `@auth` |
| `npm run regression:cart:bdd` | `@cart` |
| `npm run regression:checkout:bdd` | `@checkout` |
| `npm run regression:inventory:bdd` | `@inventory` |
| `npm run regression:navigation:bdd` | `@navigation` |

Cucumber hooks (`features/support/hooks.ts`) spin up the requested browser (set `BROWSER=chromium|firefox|webkit`) and honour `BASE_URL` overrides. Screenshots are attached automatically when a step fails, and JSON output is written to `reports/cucumber/report.json` for downstream reporting.

## Page objects & shared utilities
- **`LoginPage`** – navigates to SauceDemo, performs credential entry, and handles error banners.
- **`Header`** – encapsulates cart badge state, sorting, navigation menu actions, and logout/reset flows.
- **`InventoryPage` / `InventoryItemPage`** – interact with product lists, sorting, PDP content, and add/remove buttons.
- **`CartPage`** – verifies line items, quantities, price consistency, and exposes checkout transitions.
- **`CheckoutPage`** – exercises the information form, overview totals, confirmation screen, and error messaging.
- **`features/support/pages.ts`** centralises page object creation for step definitions, while `features/support/world.ts` stores the current Playwright context for each scenario.

Reusing these abstractions keeps both spec files (`tests/**`) and step definitions (`features/step_definitions/**`) concise and intention-revealing.

## Visual & accessibility testing
- Visual snapshots live alongside their specs under `tests/visual`. Baselines are compared per browser project; keep animations disabled for stability.
- Accessibility tests in `tests/a11y` inject `axe-core` and fail on critical WCAG 2.0 A/AA violations. When issues are detected the suite attaches JSON payloads for easier triage.

## Test data management
Static fixtures in `data/testData.json` centralise credentials, canonical product names, and reusable form data. Page objects and specs import the same data to avoid duplicated literals.

## Extending the suite
1. Add or update a page object in `pages/` if new UI regions are introduced.
2. Create Playwright specs under `tests/<suite>/` and tag them appropriately (`test.describe('@regression @feature', ...)`).
3. Mirror critical flows in a Gherkin feature under `features/` and implement step definitions that call the existing page objects.
4. Update or add datasets in `data/testData.json` when new products or credentials are required.
5. Run the affected suites and regenerate reports before opening a pull request.

## Troubleshooting
- **Browser launch errors in Cucumber runs** – ensure `npx playwright install` has been executed and confirm the `BROWSER` environment variable matches an installed engine.
- **Visual diff noise** – re-run with `UPDATE_SNAPSHOTS=1` or adjust the viewport/baseline to match the expected layout.

---
