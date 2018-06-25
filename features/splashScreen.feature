@e2e
Feature: Splash Screen

  Scenario: the user opens the pillarwallet
    When the user opens the pillarwallet
    Then the user should see the splash screen
    And the user should see the 'Get Started' button
    And the user should see the 'Terms and Conditions' link

  Scenario: the user selects Get Started
    When the user opens the pillarwallet
    And the user clicks the 'Get Started' button
    Then the user should see the welcome page
