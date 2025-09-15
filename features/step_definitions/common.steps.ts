import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('I am on the login page', async function (this: CustomWorld) {
  await this.pageObjects.login.goTo();
});

Given('I login with:', async function (this: CustomWorld, table: DataTable) {
  const creds = table.rowsHash() as { username: string; password: string };
  await this.pageObjects.login.login(creds.username, creds.password);
});

Then('I should be on the inventory page', async function (this: CustomWorld) {
  await expect(this.page!).toHaveURL(/.*inventory\.html/);
});

When('I go to the cart', async function (this: CustomWorld) {
  await this.pageObjects.header.goToCart();
});

When('I go back to products', async function (this: CustomWorld) {
  await this.pageObjects.header.backToProducts();
});

Then('the cart badge should be {string}', async function (this: CustomWorld, expected: string) {
  const actual = await this.pageObjects.header.getShoppingCartItemCount();
  expect(actual).toBe(expected);
});

Then('the cart should have {int} items', async function (this: CustomWorld, count: number) {
  const actual = await this.pageObjects.cart.getItemsCount();
  expect(actual).toBe(count);
});

When('I add product {string} to the cart', async function (this: CustomWorld, productName: string) {
  await this.pageObjects.inventory.addProductToCart(productName);
});

When('I open details for product {string}', async function (this: CustomWorld, name: string) {
  await this.pageObjects.inventory.goToProductDetails(name);
});

When('I remove product {string} from the cart', async function (this: CustomWorld, name: string) {
  await this.pageObjects.cart.removeProductFromCart(name);
});