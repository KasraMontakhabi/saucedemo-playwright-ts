import { Given, Then, DataTable } from '@cucumber/cucumber';
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
