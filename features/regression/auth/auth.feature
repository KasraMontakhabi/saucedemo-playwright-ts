@regression @auth
Feature: Authentication and session flows
  As a shopper on SauceDemo
  I want reliable login/logout and clear validation
  So that I can securely access my account and recover from errors

  Background:
    Given I am on the login page

  @smoke
  Scenario: Valid login redirects to inventory
    When I login with username "standard_user" and password "secret_sauce"
    Then I should be on the inventory page

  Scenario: Invalid credentials show proper error
    When I login with username "no_such_user" and password "wrong_pass"
    Then I should see an error containing "Epic sadface"
    And the page should still be the login page

  Scenario: Locked out user sees specific message
    When I login with username "locked_out_user" and password "secret_sauce"
    Then I should see an error containing "Sorry, this user has been locked out"

  Scenario: Username required validation
    When I submit login with username "" and password "secret_sauce"
    Then I should see an error containing "Username is required"

  Scenario: Password required validation
    When I type username "standard_user" and submit without a password
    Then I should see an error containing "Password is required"

  Scenario: Pressing Enter on password submits the form
    When I fill username "standard_user" and password "secret_sauce" and press Enter
    Then I should be on the inventory page

  Scenario: Error banner can be dismissed
    When I login with username "no_such_user" and password "wrong_pass"
    And I dismiss the error
    Then I should not see the error banner

  Scenario: Logout returns user to login page
    Given I login with username "standard_user" and password "secret_sauce"
    When I logout from the header menu
    Then I should be back on the login page
