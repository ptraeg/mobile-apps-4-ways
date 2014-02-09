
// Restore the tip percentage from storage and display the current value
var tipPct = Ti.App.Properties.getDouble('tipPct', .15);
$.tipPctTextField.value = (tipPct * 100).toFixed(1);

function clickedDone() {
	clickedSave();
}

function clickedSave() {
	var tipPct = parseFloat( $.tipPctTextField.value );
	if (tipPct > 0) {
		// Persist the new percentage value
		Ti.App.Properties.setDouble('tipPct', tipPct / 100);
		Ti.API.log('info', 'Settings saved');
		closeSettings();
	} else {
		var dialog = Ti.UI.createAlertDialog({
					    message: 'Enter a tip percentage greater than zero',
						ok: 'Try Again',
						title: 'Invalid Percentage'
					}).show();
	}
}

function closeSettings() {
	Ti.App.fireEvent("recalc");
	var settingsWindow = $.getView();
	if (Alloy.Globals.navgroup) {
		Alloy.Globals.navgroup.closeWindow(settingsWindow, {animated:true});
	} else {
		settingsWindow.close();
	}
}
