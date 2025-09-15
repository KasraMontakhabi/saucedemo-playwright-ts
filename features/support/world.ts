import { setWorldConstructor, World } from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from '@playwright/test';
import { PageObjects } from './pages';

export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  pageObjects!: PageObjects;
}

setWorldConstructor(CustomWorld);
