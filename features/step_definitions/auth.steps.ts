import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';


Given('I am on the login page', async function (this: CustomWorld) {
  await this.pageObjects.login.goTo();
});


When(
    
  'I login with username {string} and password {string}',
  async function (this: CustomWorld, username: string, password: string) {
    await this.pageObjects.login.login(username, password);
  }
);

When(
  'I submit login with username {string} and password {string}',
  async function (this: CustomWorld, username: string, password: string) {
    await this.pageObjects.login.login(username, password);
  }
);

When(
  'I type username {string} and submit without a password',
  async function (this: CustomWorld, username: string) {
    await this.pageObjects.login.username.fill(username);
    await this.pageObjects.login.loginButton.click();
  }
);

When(
  'I fill username {string} and password {string} and press Enter',
  async function (this: CustomWorld, username: string, password: string) {
    await this.pageObjects.login.username.fill(username);
    await this.pageObjects.login.password.fill(password);
    await this.pageObjects.login.password.press('Enter');
  }
);

When('I dismiss the error', async function (this: CustomWorld) {
  await this.pageObjects.login.getErrorButton().click();
});

When('I logout from the header menu', async function (this: CustomWorld) {
  await this.pageObjects.header.logout();
});


Then('I should be on the inventory page', async function (this: CustomWorld) {
  await expect(this.page!).toHaveURL(/inventory\.html/);
});

Then('I should see an error containing {string}', async function (this: CustomWorld, text: string) {
  await this.pageObjects.login.waitForErrorVisible();
  await expect(this.pageObjects.login.errorContainer).toContainText(text);
});

Then('the page should still be the login page', async function (this: CustomWorld) {
  await expect(this.page!).toHaveURL(/saucedemo\.com\/?$/);
});

Then('I should not see the error banner', async function (this: CustomWorld) {
  await expect(this.pageObjects.login.errorContainer).toBeHidden();
});

Then('I should be back on the login page', async function (this: CustomWorld) {
  await expect(this.page!).toHaveURL(/saucedemo\.com\/?$/);
  await expect(this.pageObjects.login.loginButton).toBeVisible();
});
