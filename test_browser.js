/* Asks Selenium to start a WebDriver and open the AUT, which will then run its
   own tests using the WebDriver session. */

var webdriver = require('./webdriver.js');

var server = 'http://localhost:4444/wd/hub';
var driver = new webdriver.Builder().
    usingServer(server).
    withCapabilities({
        'browserName': 'chrome',
        'version': '',
        'platform': 'ANY',
        'javascriptEnabled': true
    }).
    build();

var testUrl = 'http://localhost/~dwagner/workspace/qx-webdriver/aut/source/index.html',
    sessionId;

driver.session_.then(function(sessionData) {
    sessionId = sessionData.id;
    driver.get(testUrl + '?wdurl=' + server + '&wdsid=' + sessionId);
});