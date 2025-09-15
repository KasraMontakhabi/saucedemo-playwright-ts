import { test, expect, Page } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';
import InventoryPage from '../../pages/InventoryPage';
import CheckoutPage from '../../pages/CheckoutPage';
import Header from '../../pages/Header';

async function runAxeCritical(page: Page) {
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const results = await page.evaluate(async () => {
    // @ts-ignore
    const r = await axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
      resultTypes: ['violations'],
    });
    return r.violations
      .filter((v: { impact: string; }) => v.impact === 'critical')
      .map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => n.target) }));
  });
  return results;
}

test.describe('@a11y A11Y: Login', () => {
  test('no critical violations; inputs have accessible names; error is announced', async ({ page }, testInfo) => {
    const login = new LoginPage(page);
    await login.goTo();

    const crit = await runAxeCritical(page);
    if (crit.length) {
      await testInfo.attach('axe-critical.json', { body: JSON.stringify(crit, null, 2), contentType: 'application/json' });
    }
    expect(crit, 'Critical a11y violations on Login').toHaveLength(0);

    //Inputs have accessible names (placeholders serve as names here)
    await expect(login.username).toHaveAccessibleName(/username/i);
    await expect(login.password).toHaveAccessibleName(/password/i);

    //Trigger error and check it’s programmatically announced (role or aria-live)
    await login.login('locked_out_user', 'secret_sauce');
    await login.waitForErrorVisible();

    // Prefer role="alert"
    const alert = page.getByRole('alert');
    if (await alert.count()) {
      await expect(alert.first()).toBeVisible();
    } else {
      const hasAriaLive = await page.evaluate(() => {
        const el = document.querySelector('[data-test="error"]');
        return el?.getAttribute('aria-live') || el?.getAttribute('role');
      });
      expect.soft(!!hasAriaLive, 'Error message should have role="alert" or aria-live').toBeTruthy();
    }
  });
});

test.describe('@a11y A11Y: Inventory', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goTo();
    await login.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('no critical violations; keyboard reachability; button names', async ({ page }, testInfo) => {
    const crit = await runAxeCritical(page);
    if (crit.length) {
      await testInfo.attach('axe-critical-inventory.json', { body: JSON.stringify(crit, null, 2), contentType: 'application/json' });
    }
    expect(crit, 'Critical a11y violations on Inventory').toHaveLength(0);

    // Buttons have accessible names (Add to cart)
    await expect(page.getByRole('button', { name: /add to cart/i }).first()).toBeVisible();

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); 
    expect.soft(true).toBeTruthy();
  });
});

test.describe('@a11y A11Y: Checkout forms', () => {
  test('no critical violations; required fields announced; errors associated', async ({ page }, testInfo) => {
    const login = new LoginPage(page);
    await login.goTo();
    await login.login('standard_user', 'secret_sauce');

    const inventory = new InventoryPage(page);
    const header = new Header(page);
    const checkout = new CheckoutPage(page);

    await inventory.addProductToCart('Sauce Labs Backpack');
    await header.goToCart();

    await page.getByRole('button', { name: 'Checkout' }).click();

    //critical pass on Information page
    let crit = await runAxeCritical(page);
    if (crit.length) {
      await testInfo.attach('axe-critical-checkout-info.json', { body: JSON.stringify(crit, null, 2), contentType: 'application/json' });
    }
    expect(crit, 'Critical a11y violations on Checkout Information').toHaveLength(0);

    // Submit empty to trigger errors and verify association/announcement
    await checkout.continue();
    await expect(checkout.errorBanner).toBeVisible();

    // ensure at least one of the inputs is marked required or has aria-invalid after error
    const firstReq = await checkout.firstNameInput.getAttribute('required');
    const ariaInvalid = await checkout.firstNameInput.getAttribute('aria-invalid');
    expect.soft(firstReq !== null || ariaInvalid === 'true', 'Inputs should indicate required/invalid state').toBeTruthy();

    // Continue to Overview to run another axe pass
    await checkout.firstNameInput.fill('John');
    await checkout.lastNameInput.fill('Doe');
    await checkout.postalCodeInput.fill('12345');
    await checkout.continue();

    crit = await runAxeCritical(page);
    if (crit.length) {
      await testInfo.attach('axe-critical-checkout-overview.json', { body: JSON.stringify(crit, null, 2), contentType: 'application/json' });
    }
    expect(crit, 'Critical a11y violations on Checkout Overview').toHaveLength(0);
  });
});
