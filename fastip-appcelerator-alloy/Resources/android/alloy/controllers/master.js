function Controller() {
    function __alloyId10() {
        $.__views.master.removeEventListener("open", __alloyId10);
        if ($.__views.master.activity) $.__views.master.activity.onCreateOptionsMenu = function(e) {
            var __alloyId9 = {
                title: "Settings",
                icon: Ti.Android.R.drawable.ic_menu_preferences,
                showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM,
                id: "__alloyId8"
            };
            $.__views.__alloyId8 = e.menu.add(_.pick(__alloyId9, Alloy.Android.menuItemCreateArgs));
            $.__views.__alloyId8.applyProperties(_.omit(__alloyId9, Alloy.Android.menuItemCreateArgs));
            clickedSettings ? $.__views.__alloyId8.addEventListener("click", clickedSettings) : __defers["$.__views.__alloyId8!click!clickedSettings"] = true;
        }; else {
            Ti.API.warn("You attempted to attach an Android Menu to a lightweight Window");
            Ti.API.warn("or other UI component which does not have an Android activity.");
            Ti.API.warn("Android Menus can only be opened on TabGroups and heavyweight Windows.");
        }
    }
    function clickedSettings(e) {
        $.trigger("showDetail", e);
    }
    function clickedCalculate() {
        var tipPct = Ti.App.Properties.getDouble("tipPct", .15);
        var billAmt = parseFloat($.billAmtTextField.value);
        var tipAmt = billAmt * tipPct;
        var totalAmt = billAmt + tipAmt;
        $.tipAmtLabel.text = "$" + tipAmt.toFixed(2);
        $.totalAmtLabel.text = "$" + totalAmt.toFixed(2);
        $.billAmtTextField.blur();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "master";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.master = Ti.UI.createWindow({
        backgroundColor: "#fff",
        navBarHidden: false,
        title: "Alloy FasTip",
        id: "master"
    });
    $.__views.master && $.addTopLevelView($.__views.master);
    $.__views.master.addEventListener("open", __alloyId10);
    $.__views.billAmtTextField = Ti.UI.createTextField({
        color: "#000",
        id: "billAmtTextField",
        top: "40",
        width: "146",
        height: "35",
        textAlign: "right",
        hintText: "Bill amount",
        keyboardType: Ti.UI.KEYBOARD_DECIMAL_PAD,
        returnKeyType: Ti.UI.RETURNKEY_DONE
    });
    $.__views.master.add($.__views.billAmtTextField);
    $.__views.calcTipButton = Ti.UI.createButton({
        width: "122",
        height: Ti.UI.SIZE,
        borderRadius: 15,
        backgroundColor: "#3883B5",
        color: "#fff",
        id: "calcTipButton",
        title: "Calculate Tip",
        top: "100"
    });
    $.__views.master.add($.__views.calcTipButton);
    clickedCalculate ? $.__views.calcTipButton.addEventListener("click", clickedCalculate) : __defers["$.__views.calcTipButton!click!clickedCalculate"] = true;
    $.__views.__alloyId12 = Ti.UI.createView({
        top: "170",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        id: "__alloyId12"
    });
    $.__views.master.add($.__views.__alloyId12);
    $.__views.__alloyId13 = Ti.UI.createLabel({
        width: "124",
        height: Ti.UI.SIZE,
        color: "#000",
        text: "Tip Amount:",
        left: "13",
        top: "0",
        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
        id: "__alloyId13"
    });
    $.__views.__alloyId12.add($.__views.__alloyId13);
    $.__views.tipAmtLabel = Ti.UI.createLabel({
        width: "80",
        height: Ti.UI.SIZE,
        color: "#000",
        text: "$0.00",
        id: "tipAmtLabel",
        left: "130",
        top: "0",
        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT
    });
    $.__views.__alloyId12.add($.__views.tipAmtLabel);
    $.__views.__alloyId14 = Ti.UI.createLabel({
        width: "124",
        height: Ti.UI.SIZE,
        color: "#0a0",
        text: "Total Amount:",
        left: "13",
        top: "30",
        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
        id: "__alloyId14"
    });
    $.__views.__alloyId12.add($.__views.__alloyId14);
    $.__views.totalAmtLabel = Ti.UI.createLabel({
        width: "80",
        height: Ti.UI.SIZE,
        color: "#0a0",
        text: "$0.00",
        id: "totalAmtLabel",
        left: "130",
        top: "30",
        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT
    });
    $.__views.__alloyId12.add($.__views.totalAmtLabel);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    $.on("recalc", function() {
        clickedCalculate();
    });
    __defers["$.__views.__alloyId8!click!clickedSettings"] && $.__views.__alloyId8.addEventListener("click", clickedSettings);
    __defers["$.__views.settingsButton!click!clickedSettings"] && $.__views.settingsButton.addEventListener("click", clickedSettings);
    __defers["$.__views.calcTipButton!click!clickedCalculate"] && $.__views.calcTipButton.addEventListener("click", clickedCalculate);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;