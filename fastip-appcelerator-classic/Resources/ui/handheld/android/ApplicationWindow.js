function ApplicationWindow() {
	//declare module dependencies
	var MasterView = require('ui/common/MasterView'),
		SettingsView = require('ui/common/SettingsView');
		

	//create object instance
	var self = Ti.UI.createWindow({
		title : 'FasTip',
		exitOnClose : true,
		navBarHidden : false,
		backgroundColor : '#ffffff',
		activity : {
			onCreateOptionsMenu : function(e) {
				var menu = e.menu;

				var m1 = menu.add({
					title : 'Settings',
					icon: Titanium.Android.R.drawable.ic_menu_preferences,
					showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM
				});
				// m1.setIcon(Titanium.Android.R.drawable.ic_menu_preferences);
				m1.addEventListener('click', function(e) {
					masterView.fireEvent('showSettings',e);
				});
			}
		}
	}); 
		
	//construct UI
	var masterView = new MasterView();
	self.add(masterView);

	//add behavior for master view
	masterView.addEventListener('showSettings', function(e) {
		//create detail view container
		var settingsView = new SettingsView();
		var settingsContainerWindow = Ti.UI.createWindow({
			title:'FasTip Settings',
			navBarHidden:false,
			backgroundColor:'#ffffff'
		});
		settingsContainerWindow.add(settingsView);
		settingsContainerWindow.open();
		settingsView.addEventListener('closeSettings', function(e) {
			settingsContainerWindow.close();
			masterView.fireEvent('recalc');
		});
	});
	
	return self;
};

module.exports = ApplicationWindow;
