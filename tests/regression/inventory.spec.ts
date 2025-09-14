import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';
import Header from '../../pages/Header';
import InventoryPage from '../../pages/InventoryPage';
import CartPage from '../../pages/CartPage';
import InventoryItemPage from '../../pages/InventoryItemPage';

const data = JSON.parse(JSON.stringify(require('../../data/testData.json')));


test.describe('@regression REGRESSION: Inventory', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goTo();
    await login.login(data.username, data.password);
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('add multiple items, badge updates, remove one from list', async ({ page }) => {
    const header = new Header(page);
    const inventory = new InventoryPage(page);

    await inventory.addProductToCart(data.firstProductName);
    await inventory.addProductToCart(data.secondProductName);
    let badge = await header.getShoppingCartItemCount();
    expect(badge).toBe('2');

    // remove one directly from list
    await inventory.removeProductFromCart(data.firstProductName);

    badge = await header.getShoppingCartItemCount();
    expect(badge).toBe('1');
  });

  test('sorting: Name A→Z, Z→A, Price low→high, high→low', async ({ page }) => {
    const header = new Header(page);
    const inventory = new InventoryPage(page);

    // Name A→Z
    await header.sortProducts('Name (A to Z)');
    let names = (await inventory.itemName.allInnerTexts()).map((n) => n.trim());
    let sortedAsc = [...names].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    expect(names).toEqual(sortedAsc);

    // Name Z→A
    await header.sortProducts('Name (Z to A)');
    names = (await inventory.itemName.allInnerTexts()).map((n) => n.trim());
    let sortedDesc = [...names].sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }));
    expect(names).toEqual(sortedDesc);

    // Price low→high
    await header.sortProducts('Price (low to high)');
    const lowHigh = await inventory.itemPrice.allInnerTexts();
    const lowHighNums = lowHigh.map((t) => Number(t.replace('$', '').trim()));
    const sortedNumsAsc = [...lowHighNums].sort((a, b) => a - b);
    expect(lowHighNums).toEqual(sortedNumsAsc);

    // Price high→low
    await header.sortProducts('Price (high to low)');
    const highLow = await inventory.itemPrice.allInnerTexts();
    const highLowNums = highLow.map((t) => Number(t.replace('$', '').trim()));
    const sortedNumsDesc = [...highLowNums].sort((a, b) => b - a);
    expect(highLowNums).toEqual(sortedNumsDesc);
  });

  test('product details show correct name & price (matches list card)', async ({ page }) => {
    const header = new Header(page);
    const inventory = new InventoryPage(page);
    const inventoryItemPage = new InventoryItemPage(page);

    await header.sortProducts('Name (A to Z)');

    const nameFromList = await inventory.getProductName(data.firstProductName);
    const priceFromList = await inventory.getProductPrice(data.firstProductName);

    // open details
    await inventory.goToProductDetails(data.firstProductName);

    const detailName = await inventoryItemPage.getProductName();
    const detailPrice = await inventoryItemPage.getProductPrice();

    expect(detailName.trim()).toBe(nameFromList.trim());

    expect(detailPrice).toBe(priceFromList);

    // back to products
    await header.backToProducts();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });
});