var webdriver = require('./webdriver.js');
var assert = require('assert');

var driver = new webdriver.Builder().
    usingServer('http://localhost:4444/wd/hub').
    withCapabilities({
      'browserName': 'firefox',
      'version': '',
      'platform': 'ANY',
      'javascriptEnabled': true
    }).
    build();


/*
var driver = new webdriver.Builder().build();
driver.get('http://www.google.com');

var searchBox = driver.findElement(webdriver.By.name('q'));
searchBox.sendKeys('webdriver');

var submitButton = driver.findElement(webdriver.By.name('btnG'));
submitButton.click();

driver.getTitle().then(function(title) {
  if (title !== 'webdriver - Google-Suche') {
    console.log("Unexpected title:", title);
  }
});
*/

driver.get('http://www.google.com').then(function() {
  driver.findElement(webdriver.By.name('q')).sendKeys('webdriver');
  driver.findElement(webdriver.By.name('btnG')).click();

  var newTitle;
  driver.wait(function() {
    driver.getTitle()
    .then(function(title) {
      newTitle = title;
    });
    return (newTitle && newTitle != "Google");
  }, 3000)
  .then(function () {
    require('assert').equal('webdriver - Google-Suche', newTitle);
  });

});
