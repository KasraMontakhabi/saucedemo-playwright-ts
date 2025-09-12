import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';
import Header from '../../pages/Header';
import InventoryPage from '../../pages/InventoryPage';
import CartPage from '../../pages/CartPage';

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
});