import { Before, After, AfterStep, Status } from '@cucumber/cucumber';
import { chromium, firefox, webkit, expect } from '@playwright/test';
import type { CustomWorld } from './world';
import { createPages } from './pages';

// Choose browser via env; default chromium
const browserName = (process.env.BROWSER || 'chromium').toLowerCase();
const baseURL = process.env.BASE_URL || 'https://www.saucedemo.com';

async function launchBrowser(name: string) {
  switch (name) {
    case 'firefox': return await firefox.launch({ headless: true });
    case 'webkit': return await webkit.launch({ headless: true });
    default: return await chromium.launch({ headless: true });
  }
}

Before(async function (this: CustomWorld) {
  this.browser = await launchBrowser(browserName);
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  this.pageObjects = createPages(this.page);
  await this.page.goto(baseURL, { waitUntil: 'domcontentloaded' });
});

// Attach a screenshot on step failure
AfterStep(async function (this: CustomWorld, { result }) {
  if (result && result.status === Status.FAILED && this.page) {
    const shot = await this.page.screenshot();
    this.attach(shot, 'image/png');
  }
});

