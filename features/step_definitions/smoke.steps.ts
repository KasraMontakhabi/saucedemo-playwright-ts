import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';


Then('I should see the shopping cart link', async function (this: CustomWorld) {
  await expect(this.page!.getByTestId('shopping-cart-link')).toBeVisible();
});

Then('I should see an auth error containing {string}', async function (this: CustomWorld, text: string) {
  await this.pageObjects.login.waitForErrorVisible();
  await expect(this.pageObjects.login.errorContainer).toContainText(new RegExp(text, 'i'));
});

Then('the error dismiss button should be visible', async function (this: CustomWorld) {
  await expect(this.pageObjects.login.getErrorButton()).toBeVisible();
});

Then('I should be on the cart page', async function (this: CustomWorld) {
  await expect(this.page!).toHaveURL(/.*cart\.html/);
});

Then('the cart should contain {string}', async function (this: CustomWorld, productName: string) {
  const text = await this.pageObjects.cart.getProductInCart(productName);
  expect(text).toContain(productName);
});


Then('checkout overview amounts should be visible', async function (this: CustomWorld) {
  const { checkout } = this.pageObjects;
  await expect(checkout.itemTotalAmount).toBeVisible();
  await expect(checkout.taxAmount).toBeVisible();
  await expect(checkout.totalAmount).toBeVisible();
});


Then('the first 5 product names should be sorted descending', async function (this: CustomWorld) {
  const names = await this.pageObjects.inventory.itemName.allInnerTexts();
  const normalized = names.map(n => n.trim());
  const top5 = normalized.slice(0, 5);
  const sortedDescTop5 = [...normalized]
    .sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }))
    .slice(0, 5);
  expect(top5).toEqual(sortedDescTop5);
});


When('I navigate directly to the inventory page', async function (this: CustomWorld) {
  await this.page!.goto('https://www.saucedemo.com/inventory.html');
});
