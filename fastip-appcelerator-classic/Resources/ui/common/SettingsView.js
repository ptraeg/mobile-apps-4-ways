function DetailView() {
	var isAndroid = (Ti.Platform.osname === 'android');

	var self = Ti.UI.createView({
		backgroundColor:'white'
	});

	var lbl = Ti.UI.createLabel({
		text:'Set tip percentage',
		top: 35,
		color:'#000'
	});
	self.add(lbl);

	var tipPctTextField = Ti.UI.createTextField({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		keyboardType: Ti.UI.KEYBOARD_DECIMAL_PAD,
		returnKeyType: Ti.UI.RETURNKEY_DONE,
		hintText:'Tip Percentage',
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		top:72,
		width:'60dp', height: '35dp',
		color:'#000'
	});
	if (isAndroid) {
		tipPctTextField.font = {fontSize: '12dp'};
	}
	self.add(tipPctTextField);

	var pctLbl = Ti.UI.createLabel({
		text:'%',
		left: '195dp',
		top: 80,
		color:'#000'
	});
	if (isAndroid) {
		pctLbl.font = {fontSize: '14dp'};
	}
	self.add(pctLbl);

	var saveSettingsButton = Ti.UI.createButton( {
		title: 'Save Settings',
		top:130,
		width:'122dp', height: '30dp',
		backgroundColor: '#3883B5',
		borderRadius: 15,
		color:'#fff'
	});
	if (isAndroid) {
		saveSettingsButton.font = {fontSize: '10dp'};
	}
	self.add(saveSettingsButton);

	saveSettingsButton.addEventListener('click', function(e) {
		self.fireEvent('saveSettings',e);
	});

		
	var tipPct = Ti.App.Properties.getDouble('tipPct', .15);
	tipPctTextField.value = (tipPct * 100).toFixed(1);
	
	tipPctTextField.addEventListener('return', function(e) {
		self.fireEvent('saveSettings',e);
	});

	self.addEventListener('saveSettings', function(e) {
		var tipPct = parseFloat(tipPctTextField.value);
		if (tipPct > 0) {
			Ti.App.Properties.setDouble('tipPct', tipPct / 100);
			Ti.API.log('info', 'Settings saved');
			self.fireEvent('closeSettings',e);
		} else {
			var dialog = Ti.UI.createAlertDialog({
						    message: 'Enter a tip percentage greater than zero',
    						ok: 'Try Again',
    						title: 'Invalid Percentage'
  						}).show();
		}
	});
	
	return self;
};

module.exports = DetailView;
