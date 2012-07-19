/* Runs Tests using WebDriverJS in node */

var webdriver = require('./webdriver.js');
var qxwebdriver = require('./qxwebdriver.js');

var driver = new webdriver.Builder().
    usingServer('http://localhost:4444/wd/hub').
    withCapabilities({
      'browserName': 'chrome',
      'version': '',
      'platform': 'ANY',
      'javascriptEnabled': true
    }).
    build();

driver.get('http://localhost/~dwagner/workspace/qx-webdriver/aut/source/index.html')
.then(function() {
  driver.wait(function() {
    var ready = false;
    var isQxReady = function() {
      try {
        return !!qx.core.Init.getApplication();
      } catch(ex) {
        return false;
      }
    };
    ready = driver.executeScript(isQxReady);
    return ready;
  }, 5000)
  .then(function() {
    driver.findQxWidget(webdriver.By.xpath('//div[@qxclass="qx.ui.form.SelectBox"]'))
    .then(function(selectBox) {
      selectBox.selectItem(webdriver.By.xpath('//div[text() = "Item 2"]'));
    });

  });
});