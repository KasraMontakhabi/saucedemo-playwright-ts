@regression @navigation
Feature: Navigation menu and About link
  Verify that About link in the menu leaves saucedemo.

  Background:
    Given I am on the login page
    And I login with:
      | username | standard_user |
      | password | secret_sauce  |
    And I should be on the inventory page

  Scenario: About link navigates away from saucedemo
    When I open the menu
    Then I should see the About link
    When I click the About link
    Then I should not be on a saucedemo domain
