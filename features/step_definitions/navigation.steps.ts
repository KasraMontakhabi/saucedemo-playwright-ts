import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

When('I open the menu', async function (this: CustomWorld) {
  await this.pageObjects.header.openMenu();
});

Then('I should see the About link', async function (this: CustomWorld) {
  const about = this.page!.getByRole('link', { name: 'About' });
  await expect(about).toBeVisible();
});

When('I click the About link', async function (this: CustomWorld) {
  const about = this.page!.getByRole('link', { name: 'About' });
  await about.click();
});

Then('I should not be on a saucedemo domain', async function (this: CustomWorld) {
  await expect(this.page!).not.toHaveURL(/saucedemo\.com/);
});
