
if (OS_IOS) {
	Alloy.Globals.navgroup = $.index;
}

if (OS_ANDROID) {
	$.calculator.getView().open();
} else {
	$.index.open();
}
