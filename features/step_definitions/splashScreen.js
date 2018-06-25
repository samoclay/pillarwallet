/* eslint-disable */
const { defineSupportCode } = require('cucumber');

defineSupportCode(function({ Given, When, Then, setDefaultTimeout }) {

  setDefaultTimeout(10 * 1000);

  When('the user opens the pillarwallet', function () {
    // this will already had happened

  });

  Then('the user should see the splash screen', async() => {
    await expect(element(by.id('Get Started Terms and Conditions'))).toBeVisible();
  });



});
