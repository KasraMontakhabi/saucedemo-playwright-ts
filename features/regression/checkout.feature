@regression @checkout
Feature: Checkout summary math & order flow
  Validate price math, field validations, and completion flow on SauceDemo.

  Background:
    Given I am on the login page
    And I login with:
      | username | standard_user |
      | password | secret_sauce  |
    And I should be on the inventory page
    And the cart is empty

  Scenario Outline: Overview totals = sum(items) + tax
    When I add product "<p1>" to the cart
    And I note the inventory price for "<p1>"
    And I add product "<p2>" to the cart
    And I note the inventory price for "<p2>"
    And I begin checkout
    And I enter checkout information:
      | firstName | John  |
      | lastName  | Doe   |
      | zip       | 12345 |
    Then the item total should equal the sum of noted prices
    And the grand total should equal item total plus tax

    Examples:
      | p1                       | p2                  |
      | Sauce Labs Fleece Jacket | Sauce Labs Backpack |

  Scenario Outline: Missing checkout info shows specific errors and blocks continue
    When I add product "<product>" to the cart
    And I begin checkout
    And I attempt to continue checkout with:
      | firstName | <first> |
      | lastName  | <last>  |
      | zip       | <zip>   |
    Then I should see a checkout error containing "<message>"

    Examples:
      | product                 | first | last | zip   | message                    |
      | Sauce Labs Backpack     |       | Doe  | 12345 | First Name is required     |
      | Sauce Labs Backpack     | John  |      | 12345 | Last Name is required      |
      | Sauce Labs Backpack     | John  | Doe  |       | Postal Code is required    |

  Scenario Outline: Complete order shows Thank You and Back Home returns to inventory
    When I add product "<product>" to the cart
    And I begin checkout
    And I enter checkout information:
      | firstName | <first> |
      | lastName  | <last>  |
      | zip       | <zip>   |
    Then the payment info should contain "Sauce Card"
    And the shipping info should contain "Free Pony Express Delivery!"
    When I finish checkout
    Then I should see the order completion message
    When I go back home from checkout
    Then I should be on the inventory page

    Examples:
      | product               | first | last | zip   |
      | Sauce Labs Backpack   | John  | Doe  | 12345 |

  Scenario Outline: Removing item before checkout updates overview item total
    When I note the inventory price for "<keep>"
    And I add product "<keep>" to the cart
    And I add product "<remove>" to the cart
    And I go to the cart
    And I remove product "<remove>" from the cart
    And I proceed to checkout info
    And I enter checkout information:
      | firstName | John  |
      | lastName  | Doe   |
      | zip       | 12345 |
    Then the item total should equal the noted price for "<keep>"

    Examples:
      | keep                      | remove               |
      | Sauce Labs Fleece Jacket  | Sauce Labs Backpack  |
