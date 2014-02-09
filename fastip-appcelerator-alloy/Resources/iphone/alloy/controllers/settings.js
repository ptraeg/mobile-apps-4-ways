function Controller() {
    function clickedSave() {
        var tipPct = parseFloat($.tipPctTextField.value);
        if (tipPct > 0) {
            Ti.App.Properties.setDouble("tipPct", tipPct / 100);
            Ti.API.log("info", "Settings saved");
            closeSettings();
        } else Ti.UI.createAlertDialog({
            message: "Enter a tip percentage greater than zero",
            ok: "Try Again",
            title: "Invalid Percentage"
        }).show();
    }
    function closeSettings() {
        Ti.App.fireEvent("recalc");
        var settingsWindow = $.getView();
        Alloy.Globals.navgroup ? Alloy.Globals.navgroup.closeWindow(settingsWindow, {
            animated: true
        }) : settingsWindow.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "settings";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.settings = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Settings",
        backButtonTitle: "",
        id: "settings"
    });
    $.__views.settings && $.addTopLevelView($.__views.settings);
    $.__views.__alloyId7 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        text: "Set tip percentage",
        top: "35",
        id: "__alloyId7"
    });
    $.__views.settings.add($.__views.__alloyId7);
    $.__views.tipPctTextField = Ti.UI.createTextField({
        color: "#000",
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: "#000",
        borderRadius: "10",
        borderWidth: "1",
        id: "tipPctTextField",
        top: "72",
        width: "60",
        height: "35",
        textAlign: "right",
        hintText: "Tip %",
        keyboardType: Ti.UI.KEYBOARD_DECIMAL_PAD,
        returnKeyType: Ti.UI.RETURNKEY_DONE
    });
    $.__views.settings.add($.__views.tipPctTextField);
    $.__views.__alloyId8 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        text: "%",
        top: "72",
        left: "195",
        id: "__alloyId8"
    });
    $.__views.settings.add($.__views.__alloyId8);
    $.__views.saveButton = Ti.UI.createButton({
        width: "130",
        height: Ti.UI.SIZE,
        borderRadius: 15,
        backgroundColor: "#3883B5",
        color: "#fff",
        id: "saveButton",
        title: "Save Settings",
        top: "120"
    });
    $.__views.settings.add($.__views.saveButton);
    clickedSave ? $.__views.saveButton.addEventListener("click", clickedSave) : __defers["$.__views.saveButton!click!clickedSave"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var tipPct = Ti.App.Properties.getDouble("tipPct", .15);
    $.tipPctTextField.value = (100 * tipPct).toFixed(1);
    __defers["$.__views.saveButton!click!clickedSave"] && $.__views.saveButton.addEventListener("click", clickedSave);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;