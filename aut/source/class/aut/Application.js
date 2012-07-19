/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/* ************************************************************************

#asset(aut/*)

************************************************************************ */

/**
 * This is the main application class of your custom application "aut"
 */
qx.Class.define("aut.Application",
{
  extend : qx.application.Standalone,


  statics :
  {
    initWebDriver : function()
    {
      if (typeof window.webdriver !== "object") {
        qx.log.Logger.error("WebDriver not found, make sure webdriver.js is loaded!");
        return null;
      }

      var builder = new webdriver.Builder();
      return builder.usingServer('http://localhost:4444/wd/hub').build();
    },

    runTest : function(driver)
    {
      driver.findQxWidget(webdriver.By.xpath('//div[@qxclass="qx.ui.form.SelectBox"]'))
      .then(function(selectBox) {
        selectBox.selectItem(webdriver.By.xpath('//div[text() = "Item 2"]'));
      });
    }
  },


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * This method contains the initial application code and gets called
     * during startup of the application
     *
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */

      var selBox = new qx.ui.form.SelectBox();
      for (var i=0; i<6; i++) {
        selBox.add(new qx.ui.form.ListItem("Item " + i));
      }
      this.getRoot().add(selBox, {top: 20, left: 20});

      /** In-browser test: webdriver.js and qxwebdriver.js must be loaded and this
       * application must be opened in a WebDriver-controlled browser.
       */
      var driver = aut.Application.initWebDriver();
      if (driver) {
      this.getRoot().add(new qx.ui.basic.Label("Under WebDriver control."), {top: 0, left: 0});

        setTimeout(function() {
          aut.Application.runTest(driver);
        }, 250);
      }

    }
  }
});
