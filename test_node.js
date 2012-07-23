/* Runs Tests using WebDriverJS in node */

var webdriver = require('./webdriver.js');
var qxwebdriver = require('./qxwebdriver.js');

var driver = new qxwebdriver.Builder().
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
  driver.waitForQxApplication(3000)
  .then(function() {
    driver.findWidget(webdriver.By.xpath('//div[@qxclass="qx.ui.form.SelectBox"]'))
    .then(function(selectBox) {
      selectBox.selectItem(webdriver.By.xpath('//div[text() = "Item 2"]'));
    });

  });
});