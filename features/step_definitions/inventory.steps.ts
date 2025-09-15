import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

When('I remove product {string} from the list', async function (this: CustomWorld, name: string) {
  await this.pageObjects.inventory.removeProductFromCart(name);
});

When('I sort products by {string}', async function (this: CustomWorld, option: string) {
  await this.pageObjects.header.sortProducts(option);
});

Then('product names should be sorted ascending', async function (this: CustomWorld) {
  const names = (await this.pageObjects.inventory.itemName.allInnerTexts()).map(n => n.trim());
  const sorted = [...names].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  expect(names).toEqual(sorted);
});

Then('product names should be sorted descending', async function (this: CustomWorld) {
  const names = (await this.pageObjects.inventory.itemName.allInnerTexts()).map(n => n.trim());
  const sorted = [...names].sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }));
  expect(names).toEqual(sorted);
});

Then('product prices should be sorted ascending', async function (this: CustomWorld) {
  const texts = await this.pageObjects.inventory.itemPrice.allInnerTexts();
  const prices = texts.map(t => Number(t.replace('$', '').trim()));
  const sorted = [...prices].sort((a, b) => a - b);
  expect(prices).toEqual(sorted);
});

Then('product prices should be sorted descending', async function (this: CustomWorld) {
  const texts = await this.pageObjects.inventory.itemPrice.allInnerTexts();
  const prices = texts.map(t => Number(t.replace('$', '').trim()));
  const sorted = [...prices].sort((a, b) => b - a);
  expect(prices).toEqual(sorted);
});

Then('product details for {string} should match the list card', async function (this: CustomWorld, productName: string) {
  const listName = await this.pageObjects.inventory.getProductName(productName);
  const listPrice = await this.pageObjects.inventory.getProductPrice(productName);

  await this.pageObjects.inventory.goToProductDetails(productName);
  const detailName = await this.pageObjects.item.getProductName();
  const detailPrice = await this.pageObjects.item.getProductPrice();

  expect(detailName).toBe(listName);
  expect(detailPrice).toBe(listPrice);

  await this.pageObjects.header.backToProducts();
  await expect(this.page!).toHaveURL(/.*inventory\.html/);
});

When('I add the product from the details page', async function (this: CustomWorld) {
  await this.pageObjects.item.addProductToCart();
});

Then('the list button for {string} should read {string}', async function (this: CustomWorld, productName: string, expectedLabel: string) {
  const itemButton = this.page!
    .getByTestId('inventory-item')
    .filter({ hasText: productName })
    .first()
    .getByRole('button');
  await expect(itemButton).toHaveText(new RegExp(expectedLabel, 'i'));
});

When('I reload the page', async function (this: CustomWorld) {
  await this.page!.reload();
});
