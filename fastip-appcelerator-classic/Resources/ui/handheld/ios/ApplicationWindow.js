function ApplicationWindow() {
	//declare module dependencies
	var MasterView = require('ui/common/MasterView'),
		SettingsView = require('ui/common/SettingsView');
		
	//construct UI
	var masterView = MasterView(),
		settingsView = SettingsView();
		
	//create master view container
	var masterContainerWindow = Ti.UI.createWindow({
		title:'FasTip'
	});
	masterContainerWindow.add(masterView);
	
	//create detail view container
	var detailContainerWindow = Ti.UI.createWindow({
		title:'FasTip Settings'
	});
	detailContainerWindow.add(settingsView);
	
	// Settings button in main view
	var settingsButtonBar = Titanium.UI.createButtonBar({
		labels:['Settings'],
		backgroundColor:'#336699'
	});
	masterContainerWindow.setRightNavButton(settingsButtonBar);

	// Done button in settings view
	var settingsDoneButtonBar = Titanium.UI.createButtonBar({
		labels:['Done'],
		backgroundColor:'#336699'
	});
	detailContainerWindow.setRightNavButton(settingsDoneButtonBar);

	//create iOS specific NavGroup UI
	var navGroup = Ti.UI.iOS.createNavigationWindow({
		window:masterContainerWindow
	});

	settingsButtonBar.addEventListener('click', function(e) {
		navGroup.openWindow(detailContainerWindow, {animated:true});
	});
	
	settingsDoneButtonBar.addEventListener('click', function(e) {
		settingsView.fireEvent('saveSettings',e);
	});
	
	settingsView.addEventListener('closeSettings', function(e) {
		navGroup.closeWindow(detailContainerWindow, {animated:true});
		masterView.fireEvent('recalc');
	});
	
	return navGroup;
};

module.exports = ApplicationWindow;
