//Master View Component Constructor
function MasterView() {
	var isAndroid = (Ti.Platform.osname === 'android');
	
	//create object instance, parasitic subclass of Observable
	var self = Ti.UI.createView({
		backgroundColor:'white'
	});

	var billAmtTextField = Ti.UI.createTextField({
		id: 'billAmtTextField',
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		keyboardType: Ti.UI.KEYBOARD_DECIMAL_PAD,
		returnKeyType: Ti.UI.RETURNKEY_DONE,
		hintText:'Bill amount',
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		top:40,
		width:'146dp', height: '35dp',
		color:'#000'
	});
	if (isAndroid) {
		billAmtTextField.font = {fontSize: '12dp'};
	}
	self.add(billAmtTextField);
	
	var calcBillButton = Ti.UI.createButton( {
		title: 'Calculate Tip',
		top:100,
		width:'122dp', height: '30dp',
		style: Ti.UI.iPhone.SystemButtonStyle.BORDERED,
		backgroundColor: '#3883B5',
		borderRadius: 15,
		color:'#fff'
	});
	if (isAndroid) {
		calcBillButton.font = {fontSize: '10dp'};
	}
	self.add(calcBillButton);
	
	var tipView = Ti.UI.createView({
		top: 170,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE		
	});
	
	var tipAmtCaption = Ti.UI.createLabel( {
		text: 'Tip Amount:',
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		left: 13, top:0,
		width:111, height: 21,
		color:'#000'
	});	
	tipView.add(tipAmtCaption);
	
	var tipAmtLabel = Ti.UI.createLabel( {
		text: '$0.00',
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		left: 119, top:0,
		width:80, height: 21,
		color:'#000'
	});	
	tipView.add(tipAmtLabel);
	
	var totalAmtCaption = Ti.UI.createLabel( {
		text: 'Total Amount:',
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		left: 0, top:25,
		width:124, height: 21,
		color:'#0a0'
	});	
	tipView.add(totalAmtCaption);
	
	var totalAmtLabel = Ti.UI.createLabel( {
		text: '$0.00',
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		left: 119, top:25,
		width:80, height: 21,
		color:'#0a0'
	});	
	tipView.add(totalAmtLabel);
	self.add(tipView);
	
	var calcBill = function() {
		var tipPct = Ti.App.Properties.getDouble('tipPct', .15);
		var billAmt = parseFloat(billAmtTextField.value);
		var tipAmt = billAmt * tipPct;
		var totalAmt = billAmt + tipAmt;
		tipAmtLabel.text = '$' + tipAmt.toFixed(2);
		totalAmtLabel.text = '$' + totalAmt.toFixed(2);
		billAmtTextField.blur();
	};
	
	self.addEventListener('recalc', function(e) {
		calcBill();
	});
	
	billAmtTextField.addEventListener('return', function(e) {
		calcBill();
	});
	
	calcBillButton.addEventListener('click', function(e) {
		calcBill();
	});
	
	return self;
};

module.exports = MasterView;