import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';



When('I add product {string} to the cart', async function (this: CustomWorld, productName: string) {
  await this.pageObjects.inventory.addProductToCart(productName);
});

When('I open details for product {string}', async function (this: CustomWorld, productName: string) {
  await this.pageObjects.inventory.goToProductDetails(productName);
});

Then('I should see a {string} button on the product page', async function (this: CustomWorld, label: string) {
  await expect(this.page!.getByRole('button', { name: new RegExp(label, 'i') })).toBeVisible();
});

When('I go back to products', async function (this: CustomWorld) {
  await this.pageObjects.header.backToProducts();
});

Then('the cart badge should be {string}', async function (this: CustomWorld, expected: string) {
  const actual = await this.pageObjects.header.getShoppingCartItemCount();
  expect(actual).toBe(expected);
});

When('I go to the cart', async function (this: CustomWorld) {
  await this.pageObjects.header.goToCart();
});

Then('the cart should have {int} items', async function (this: CustomWorld, count: number) {
  const actual = await this.pageObjects.cart.getItemsCount();
  expect(actual).toBe(count);
});

When('I remove product {string} from the cart', async function (this: CustomWorld, productName: string) {
  await this.pageObjects.cart.removeProductFromCart(productName);
});

Then('the cart badge should be empty', async function (this: CustomWorld) {
  const badge = await this.pageObjects.header.getShoppingCartItemCount();
  expect(['0', null, ''].includes(badge as any)).toBeTruthy();
});


When('I capture the inventory price for {string}', async function (this: CustomWorld, productName: string) {
  const price = await this.pageObjects.inventory.getProductPrice(productName);
  (this as any)._capturedPrices ??= {};
  (this as any)._capturedPrices[productName] = price;
});

Then('the price in cart for {string} should equal the captured price', async function (this: CustomWorld, productName: string) {
  const saved = (this as any)._capturedPrices?.[productName];
  expect(typeof saved).toBe('number');

  const priceText = await this.pageObjects.cart.getProductPrice(productName);
  const priceInCart = Number(priceText.replace('$', '').trim());
  expect(priceInCart).toBeCloseTo(saved as number, 2);
});


When('I continue shopping', async function (this: CustomWorld) {
  await this.pageObjects.cart.continueShopping();
});

When('I remove the product from the details page', async function (this: CustomWorld) {
  await this.page!.getByRole('button', { name: /remove/i }).click();
});

Then('the PDP button should read {string}', async function (this: CustomWorld, label: string) {
  await expect(this.page!.getByRole('button', { name: new RegExp(label, 'i') })).toBeVisible();
});
