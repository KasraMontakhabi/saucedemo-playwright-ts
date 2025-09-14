import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';
import Header from '../../pages/Header';

const data = JSON.parse(JSON.stringify(require('../../data/testData.json')));


test.describe('@regression REGRESSION: Navigation & About', () => {
  
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goTo();
    await login.login(data.username, data.password);
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('About link navigates away (external)', async ({ page }) => {
    const header = new Header(page);
    await header.openMenu();
    const about = page.getByRole('link', { name: 'About' });
    await expect(about).toBeVisible();
    await about.click();
    // Loose assertion: navigates to a saucelabs domain or at least leaves saucedemo
    await expect(page).not.toHaveURL(/saucedemo\.com/);
  });
});
