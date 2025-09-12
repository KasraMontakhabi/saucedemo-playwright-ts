import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import Header from '../pages/Header';

const data = {
    username: 'standard_user',
    lockedOutUser: 'locked_out_user',
    password: 'secret_sauce',
    testFirstName: 'John',
    testLastName: 'Doe',
    testZipCode: '12345',
    firstProductName: 'Sauce Labs Fleece Jacket',
    secondProductName: 'Sauce Labs Backpack',
    thirdProductName: 'Sauce Labs Onesie',
    sortOption: 'Name (Z to A)',
};

test.describe('@smoke SMOKE: Login', () => {
    test('login succeeds with standard_user', async ({ page }) => {
        const login = new LoginPage(page);
        await login.goTo();
        await login.login(data.username, data.password);

        await expect(page).toHaveURL(/.*inventory\.html/);
        await expect(page.getByTestId('shopping-cart-link')).toBeVisible();
    });

    test('locked_out_user is blocked (error banner)', async ({ page }) => {
        const login = new LoginPage(page);
        await login.goTo();
        await login.login(data.lockedOutUser, data.password);

        await login.waitForErrorVisible();                              
        await expect(login.getErrorButton()).toBeVisible();             
        await expect(login.errorContainer).toContainText('locked out');
    });
});


