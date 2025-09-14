import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';

test.describe('@regression REGRESSION: Auth & Validation', () => {
  test('invalid credentials show proper error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goTo();
    await login.login('no_such_user', 'wrong_pass');
    await login.waitForErrorVisible();
    await expect(login.errorContainer).toContainText('Epic sadface');
  });

  test('password input is masked', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goTo();
    expect(await login.password.getAttribute('type')).toBe('password');
  });
});