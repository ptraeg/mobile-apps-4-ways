function clickedCalculate(e) {
	var tipPct = Ti.App.Properties.getDouble('tipPct', .15);
	var billAmt = parseFloat($.billAmtTextField.value) || 0;
	var tipAmt = billAmt * tipPct;
	var totalAmt = billAmt + tipAmt;
	$.tipAmtLabel.text = '$' + tipAmt.toFixed(2);
	$.totalAmtLabel.text = '$' + totalAmt.toFixed(2);
	$.billAmtTextField.blur();
}

function clickedSettings(e) {
	var settingsController = Alloy.createController('settings');
	var win = settingsController.getView();

	if (Alloy.Globals.navgroup) {
		Alloy.Globals.navgroup.openWindow(win);
	} else if (OS_ANDROID) {
		win.open();
	}
}

Ti.App.addEventListener('recalc', clickedCalculate);
