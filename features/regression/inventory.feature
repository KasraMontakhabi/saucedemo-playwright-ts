@regression @inventory
Feature: Inventory behaviours
  Validate cart badge changes, sorting, PDP details, and state persistence.

  Background:
    Given I am on the login page
    And I login with:
      | username | standard_user |
      | password | secret_sauce  |
    And I should be on the inventory page

  Scenario Outline: Badge updates when adding then removing from list
    When I add product "<p1>" to the cart
    And I add product "<p2>" to the cart
    Then the cart badge should be "2"
    When I remove product "<p1>" from the list
    Then the cart badge should be "1"

    Examples:
      | p1                       | p2                  |
      | Sauce Labs Fleece Jacket | Sauce Labs Backpack |

  Scenario: Sorting by Name (A to Z)
    When I sort products by "Name (A to Z)"
    Then product names should be sorted ascending

  Scenario: Sorting by Name (Z to A)
    When I sort products by "Name (Z to A)"
    Then product names should be sorted descending

  Scenario: Sorting by Price (low to high)
    When I sort products by "Price (low to high)"
    Then product prices should be sorted ascending

  Scenario: Sorting by Price (high to low)
    When I sort products by "Price (high to low)"
    Then product prices should be sorted descending

  Scenario Outline: PDP details match list card for a product
    When I sort products by "Name (A to Z)"
    Then product details for "<product>" should match the list card

    Examples:
      | product                   |
      | Sauce Labs Fleece Jacket  |

  Scenario Outline: Add from PDP updates badge and list button
    When I open details for product "<product>"
    And I add the product from the details page
    Then the cart badge should be "1"
    When I go back to products
    Then the list button for "<product>" should read "Remove"

    Examples:
      | product               |
      | Sauce Labs Backpack   |

  Scenario Outline: Badge persists across reload and matches cart count
    When I add product "<p1>" to the cart
    And I add product "<p2>" to the cart
    Then the cart badge should be "2"
    When I reload the page
    Then the cart badge should be "2"
    When I go to the cart
    Then the cart should have 2 items

    Examples:
      | p1                       | p2                  |
      | Sauce Labs Fleece Jacket | Sauce Labs Backpack |
