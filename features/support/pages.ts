import type { Page as PWPage } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';
import Header from '../../pages/Header';
import InventoryPage from '../../pages/InventoryPage';
import CartPage from '../../pages/CartPage';
import CheckoutPage from '../../pages/CheckoutPage';
import InventoryItemPage from '../../pages/InventoryItemPage';

export interface PageObjects {
  login: LoginPage;
  header: Header;
  inventory: InventoryPage;
  cart: CartPage;
  checkout: CheckoutPage;
  item: InventoryItemPage;
}

export function createPages(page: PWPage): PageObjects {
  return {
    login: new LoginPage(page),
    header: new Header(page),
    inventory: new InventoryPage(page),
    cart: new CartPage(page),
    checkout: new CheckoutPage(page),
    item: new InventoryItemPage(page),
  };
}
