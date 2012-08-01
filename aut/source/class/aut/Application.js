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

      var builder = new qxwebdriver.Builder();
      return builder.usingServer('http://localhost:4444/wd/hub').build();
    },

    runTest : function(driver)
    {
      driver.findWidget(webdriver.By.xpath('//div[@qxclass="qx.ui.form.SelectBox"]'))
      .then(function(selectBox) {
        //selectBox.selectItem(webdriver.By.xpath('//div[text() = "Item 2"]'));
        console.log(selectBox.getProperty("appearance"));
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

      var cont = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 5));
      this.getRoot().add(cont, {edge: 5});

      var tf = new qx.ui.form.TextField();
      tf.setLiveUpdate(true);
      cont.add(tf, {row: 0, column: 0});
      var tfLabel = new qx.ui.basic.Label();
      cont.add(tfLabel, {row: 0, column: 1});
      tf.bind("value", tfLabel, "value");

      var pf = new qx.ui.form.PasswordField();
      pf.setLiveUpdate(true);
      cont.add(pf, {row: 0, column: 2});
      var pfLabel = new qx.ui.basic.Label();
      cont.add(pfLabel, {row: 0, column: 3});
      pf.bind("value", pfLabel, "value");

      var ta = new qx.ui.form.TextArea();
      cont.add(ta, {row: 0, column: 4});
      var taLabel = new qx.ui.basic.Label();
      cont.add(taLabel, {row: 0, column: 5});
      ta.bind("value", taLabel, "value");

      var cBox = new qx.ui.form.ComboBox();
      cBox.setAllowGrowY(false);
      for (var i=0; i<6; i++) {
        cBox.add(new qx.ui.form.ListItem("Item " + i));
      }
      cont.add(cBox, {row: 0, column: 6});
      var cbLabel = new qx.ui.basic.Label();
      cont.add(cbLabel, {row: 0, column: 7});
      cBox.bind("value", cbLabel, "value");

      var selBox = new qx.ui.form.SelectBox();
      selBox.setAllowGrowY(false);
      for (var i=0; i<6; i++) {
        selBox.add(new qx.ui.form.ListItem("Item " + i));
      }
      cont.add(selBox, {row: 0, column: 8});
      var sbLabel = new qx.ui.basic.Label();
      cont.add(sbLabel, {row: 0, column: 9});
      selBox.bind("selection", sbLabel, "value", {
        converter : function(selection) {
          return selection[0].getLabel();
        }
      });


      /** In-browser test: webdriver.js and qxwebdriver.js must be loaded and this
       * application must be opened in a WebDriver-controlled browser.
       */
      return;
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
