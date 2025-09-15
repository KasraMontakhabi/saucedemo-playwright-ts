import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

type PriceCtx = { noted?: Record<string, number> };

function ensurePriceCtx(world: CustomWorld): PriceCtx {
  (world as any)._priceCtx ??= { noted: {} };
  return (world as any)._priceCtx as PriceCtx;
}


Given('the cart is empty', async function (this: CustomWorld) {
  const { header, cart } = this.pageObjects;
  await header.goToCart();
  const removeButtons = await this.page!.getByRole('button', { name: /remove/i }).all();
  for (const btn of removeButtons) await btn.click();
  if ((this.page!.url()).includes('cart.html')) {
    await this.pageObjects.header.backToProducts();
  }
});


When('I proceed to checkout info', async function (this: CustomWorld) {
  await this.pageObjects.cart.checkout();
});


When('I note the inventory price for {string}', async function (this: CustomWorld, name: string) {
  const price = await this.pageObjects.inventory.getProductPrice(name);
  const ctx = ensurePriceCtx(this);
  ctx.noted![name] = price;
});

Then('the item total should equal the sum of noted prices', async function (this: CustomWorld) {
  const ctx = ensurePriceCtx(this);
  const noted = Object.values(ctx.noted ?? {});
  const expected = noted.reduce((a, b) => a + b, 0);
  const itemTotal = await this.pageObjects.checkout.getItemTotalAmount();
  expect(Math.abs(itemTotal - expected)).toBeLessThan(0.01);
});

Then(
  'the grand total should equal item total plus tax',
  async function (this: CustomWorld) {
    const checkout = this.pageObjects.checkout;
    const itemTotal = await checkout.getItemTotalAmount();
    const tax = await checkout.getTaxAmount();
    const total = await checkout.getTotalAmount();
    expect(Math.abs(total - (itemTotal + tax))).toBeLessThan(0.01);
  }
);

Then(
  'the item total should equal the noted price for {string}',
  async function (this: CustomWorld, name: string) {
    const ctx = ensurePriceCtx(this);
    const expected = ctx.noted?.[name];
    expect(typeof expected).toBe('number');
    const itemTotal = await this.pageObjects.checkout.getItemTotalAmount();
    expect(Math.abs(itemTotal - (expected as number))).toBeLessThan(0.01);
  }
);


When('I begin checkout', async function (this: CustomWorld) {
  await this.pageObjects.header.goToCart();
  await this.pageObjects.cart.checkout();
});

When('I enter checkout information:', async function (this: CustomWorld, table: DataTable) {
  const row = table.rowsHash() as { firstName: string; lastName: string; zip: string };
  await this.pageObjects.checkout.enterCheckoutInformation(row.firstName, row.lastName, row.zip);
});

When('I attempt to continue checkout with:', async function (this: CustomWorld, table: DataTable) {
  const row = table.rowsHash() as { firstName?: string; lastName?: string; zip?: string };
  const { checkout } = this.pageObjects;

  if (row.firstName !== undefined) await checkout.firstNameInput.fill(row.firstName);
  if (row.lastName !== undefined) await checkout.lastNameInput.fill(row.lastName);
  if (row.zip !== undefined) await checkout.postalCodeInput.fill(row.zip);

  await checkout.continue();
});

Then('I should see a checkout error containing {string}', async function (this: CustomWorld, msg: string) {
  await expect(this.pageObjects.checkout.errorBanner).toBeVisible();
  await expect(this.pageObjects.checkout.errorBanner).toContainText(msg);
});

Then('the payment info should contain {string}', async function (this: CustomWorld, text: string) {
  const pay = await this.pageObjects.checkout.getPaymentInfo();
  expect(pay).toMatch(new RegExp(text, 'i'));
});

Then('the shipping info should contain {string}', async function (this: CustomWorld, text: string) {
  const ship = await this.pageObjects.checkout.getShippingInfo();
  expect(ship).toMatch(new RegExp(text, 'i'));
});

When('I finish checkout', async function (this: CustomWorld) {
  await this.pageObjects.checkout.finishCheckout();
});

Then('I should see the order completion message', async function (this: CustomWorld) {
  await expect(this.pageObjects.checkout.completionMessage).toBeVisible();
});

When('I go back home from checkout', async function (this: CustomWorld) {
  await this.pageObjects.checkout.backToHome();
});
