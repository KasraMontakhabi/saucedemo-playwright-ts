@regression @cart
Feature: Inventory & Cart behaviour
  Ensures cart state, pricing, and navigation behave correctly on SauceDemo.

  Background:
    Given I am on the login page
    And I login with:
      | username | standard_user |
      | password | secret_sauce  |
    And I should be on the inventory page

  Scenario Outline: Cart state persists across product details navigation
    When I add product "<productName>" to the cart
    And I open details for product "<productName>"
    Then I should see a "Remove" button on the product page
    When I go back to products
    Then the cart badge should be "1"

    Examples:
      | productName           |
      | Sauce Labs Onesie     |

  Scenario Outline: Remove from cart view updates count and empties properly
    When I add product "<p2>" to the cart
    And I add product "<p1>" to the cart
    And I go to the cart
    Then the cart should have 2 items
    When I remove product "<p2>" from the cart
    Then the cart should have 1 items
    When I remove product "<p1>" from the cart
    Then the cart should have 0 items
    And the cart badge should be empty

    Examples:
      | p1                       | p2                  |
      | Sauce Labs Fleece Jacket | Sauce Labs Backpack |

  Scenario Outline: Cart item price matches inventory card price
    When I capture the inventory price for "<productName>"
    And I add product "<productName>" to the cart
    And I go to the cart
    Then the price in cart for "<productName>" should equal the captured price

    Examples:
      | productName           |
      | Sauce Labs Backpack   |

  Scenario Outline: Continue Shopping returns to inventory page
    When I add product "<productName>" to the cart
    And I go to the cart
    And I continue shopping
    Then I should be on the inventory page

    Examples:
      | productName           |
      | Sauce Labs Backpack   |

  Scenario Outline: Removing from details page updates badge and button
    When I add product "<productName>" to the cart
    And I open details for product "<productName>"
    Then the cart badge should be "1"
    When I remove the product from the details page
    Then the cart badge should be "0"
    And the PDP button should read "Add to cart"
    And I go back to products
    Then I should be on the inventory page

    Examples:
      | productName        |
      | Sauce Labs Onesie  |
