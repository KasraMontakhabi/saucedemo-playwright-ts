import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';
import Header from '../../pages/Header'; // for logout check

test.describe('@regression @auth REGRESSION: Auth & Validation', () => {
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

  test('valid login redirects to inventory', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goTo();
    await login.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('locked_out_user sees locked out error message', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goTo();
    await login.login('locked_out_user', 'secret_sauce');
    await login.waitForErrorVisible();
    await expect(login.errorContainer).toContainText('Sorry, this user has been locked out');
  });

  test('submitting with empty username shows required error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goTo();
    await login.login('', 'secret_sauce');
    await login.waitForErrorVisible();
    await expect(login.errorContainer).toContainText('Username is required');
  });

  test('submitting with empty password shows required error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goTo();
    await login.username.fill('standard_user');
    await login.loginButton.click();
    await login.waitForErrorVisible();
    await expect(login.errorContainer).toContainText('Password is required');
  });

  test('pressing Enter on password submits the form', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goTo();
    await login.username.fill('standard_user');
    await login.password.fill('secret_sauce');
    await login.password.press('Enter');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('error banner can be dismissed with X button', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goTo();
    await login.login('no_such_user', 'wrong_pass');
    await login.waitForErrorVisible();

    // Click the small X inside the error container
    await login.getErrorButton().click();

    await expect(login.errorContainer).toBeHidden();
  });

  test('logout returns user to login page', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goTo();
    await login.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    const header = new Header(page);
    await header.logout();

    // Back on the login page again
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
    await expect(login.loginButton).toBeVisible();
  });

  test('wrong password for valid user shows mismatch error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goTo();
    await login.login('standard_user', 'not_the_password');
    await login.waitForErrorVisible();
    await expect(login.errorContainer).toContainText(
      'Username and password do not match any user in this service'
    );
  });
});
