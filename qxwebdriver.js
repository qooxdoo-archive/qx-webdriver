(function() {

  var webdriver;
  if (typeof require !== "undefined") {
    // running in node.js
    webdriver = require('./webdriver.js');
  }
  else if (window.webdriver) {
    // running in a browser
    webdriver = window.webdriver;
  }

  var qxwebdriver = {};
  qxwebdriver.util = {
    addInterfaceMethods : function(iFaces, element) {
      iFaces.forEach(function(iFace, i) {
        if (qxwebdriver.interactions[iFace]) {
          var interactions = qxwebdriver.interactions[iFace];
          for (var method in interactions) {
            //console.log("adding method", method, "interface", iFace);
            element[method] = interactions[method].bind(element);
          }
        }
      });
    },

    getInterfacesByElement : function() {
      var widget = qx.ui.core.Widget.getWidgetByElement(arguments[0]);
      var clazz = widget.constructor;
      var iFaces = [];
      qx.Class.getInterfaces(clazz).forEach(function(item, i) {
        iFaces.push(/\[Interface (.*?)\]/.exec(item.toString())[1]);
      });
      return iFaces;
    },

    getInterfaces : function() {
      var clazz = arguments[0].constructor;
      var iFaces = [];
      qx.Class.getInterfaces(clazz).forEach(function(item, i) {
        iFaces.push(/\[Interface (.*?)\]/.exec(item.toString())[1]);
      });
      return iFaces;
    },

    getClassHierarchy : function()
    {
      var widget = qx.ui.core.Widget.getWidgetByElement(arguments[0]);
      var hierarchy = [];
      var clazz = widget.constructor;
      while (clazz && clazz.classname) {
        hierarchy.push(clazz.classname);
        clazz = clazz.superclass;
      }
      return hierarchy;
    }
  };

  qxwebdriver.interactions = {
    "qx.ui.core.ISingleSelection" : {
      getSelectables : function()
      {
        var widget = qx.core.ObjectRegistry.fromHashCode(this.qxHash);
        var selectables = widget.getSelectables();

        return selectables;
      }
    },

    "qx.ui.form.SelectBox" : {
      selectItem : function(itemLocator)
      {
        this.click();
        var menu = null;
        this.driver_.wait(function() {
          try {
            //TODO: Make sure we've got the right popup
            menu = this.findElement(webdriver.By.xpath('//div[@qxclass="qx.ui.popup.Popup"]'));
            return menu !== null;
          }
          catch(ex) {
            return false;
          }
        }.bind(this), 500)
        .then(function() {
          var item = null;
          menu.findElement(itemLocator).then(function(element) {
            element.click();
          }, function(e) {
            e.message = "Couldn't find menu child of SelectBox! " + e.message;
            throw e;
          });
        });
      }
    }
  };

  qxwebdriver.WebDriver = {
    findWidget : function(locator)
    {
      var driver = this;
      var app = webdriver.promise.Application.getInstance();
      return app.schedule("findQxWidget", function() {
        var element = driver.findElement(locator);
        return driver.addQxBehavior(element);
      });
    },

    addQxBehavior : function(element)
    {
      var driver = this;
      return driver.executeScript(qxwebdriver.util.getInterfacesByElement, element)
      .then(function(iFaces) {
        driver.executeScript(qxwebdriver.util.getClassHierarchy, element)
        .then(function(hierarchy) {
            iFaces = hierarchy.concat(iFaces);
            qxwebdriver.util.addInterfaceMethods(iFaces, element);
        });

        // Store the widget's qx object registry id
        return driver.executeScript("return qx.ui.core.Widget.getWidgetByElement(arguments[0]).toHashCode()", element)
        .then(function(hash) {
          element.qxHash = hash;
          return element;
        });
      });
    }
  };

  /**
   * Creates new WebDriver clients with qooxdoo-specific enhancements.
   * See the webdriver.Builder documentation for details.
   */
  qxwebdriver.Builder = function() {
    this.__builder = new webdriver.Builder();
  };

  qxwebdriver.Builder.prototype.usingServer = function(url) {
    this.__builder.serverUrl_ = url;
    return this;
  };

  qxwebdriver.Builder.prototype.usingSession = function(id) {
    this.__builder.sessionId_ = id;
    return this;
  };

  qxwebdriver.Builder.prototype.withCapabilities = function(capabilities) {
    this.__builder.capabilities_ = capabilities;
    return this;
  };

  /**
   * Builds a new webdriver.WebDriver instance using this builder's
   * current configuration and adds qooxdoo-specific methods.
   * @return {webdriver.WebDriver} A new WebDriver client.
   */
  qxwebdriver.Builder.prototype.build = function() {
    var driver = this.__builder.build();
    for (var methodName in qxwebdriver.WebDriver) {
      driver[methodName] = qxwebdriver.WebDriver[methodName].bind(driver);
    }
    return driver;
  };

  // expose global object for in-browser testing
  if (typeof require == "undefined") {
    window.qxwebdriver = qxwebdriver;
  }
  else {
    exports.Builder = qxwebdriver.Builder;
  }
})();