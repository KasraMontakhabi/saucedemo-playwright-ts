@smoke
Feature: Smoke suite
  Minimal, fast checks for login and core authenticated flows.

  # ---------------------- LOGIN RULE ----------------------
  Rule: Login outcomes

    Scenario: login succeeds with standard_user
      Given I am on the login page
      And I login with:
        | username | standard_user |
        | password | secret_sauce  |
      Then I should be on the inventory page
      And I should see the shopping cart link

    Scenario: locked_out_user is blocked (error banner)
      Given I am on the login page
      And I login with:
        | username | locked_out_user |
        | password | secret_sauce    |
      Then I should see an auth error containing "locked out"
      And the error dismiss button should be visible

  # ------------------ AUTHENTICATED RULE ------------------
  Rule: Authenticated flows

    Background:
      Given I am on the login page
      And I login with:
        | username | standard_user |
        | password | secret_sauce  |
      And I should be on the inventory page

    Scenario Outline: add & remove single item from cart
      When I add product "<product>" to the cart
      Then the cart badge should be "1"
      When I go to the cart
      Then I should be on the cart page
      And the cart should have 1 items
      And the cart should contain "<product>"
      When I remove product "<product>" from the cart
      Then the cart should have 0 items

      Examples:
        | product             |
        | Sauce Labs Backpack |

    Scenario Outline: basic checkout flow (1 item) completes and resets cart
      When I add product "<product>" to the cart
      And I go to the cart
      Then I should be on the cart page
      When I proceed to checkout info
      And I enter checkout information:
        | firstName | John  |
        | lastName  | Doe   |
        | zip       | 12345 |
      Then checkout overview amounts should be visible
      When I finish checkout
      Then I should see the order completion message
      When I go back home from checkout
      Then the cart badge should be "0"

      Examples:
        | product                  |
        | Sauce Labs Fleece Jacket |

    Scenario: sort dropdown changes list order (Name Z→A)
      When I sort products by "Name (Z to A)"
      Then the first 5 product names should be sorted descending

    Scenario: logout ends session
      When I logout from the header menu
      Then I am on the login page
      When I navigate directly to the inventory page
      Then I am on the login page
