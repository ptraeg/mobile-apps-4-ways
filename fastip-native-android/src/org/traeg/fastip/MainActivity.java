package org.traeg.fastip;

import android.os.Bundle;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class MainActivity extends Activity {

	TextView tipPctTextView;
	TextView tipAmountTextView;
	TextView totalAmountTextView;
	Button calcTipAmountButton;
	EditText billAmountTextView;
	double tipPercentage;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
	
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		tipPctTextView = (TextView)this.findViewById(R.id.tipPctTextView);
		tipAmountTextView = (TextView)this.findViewById(R.id.tipAmtTextView);
		totalAmountTextView = (TextView)this.findViewById(R.id.totalAmtTextView);
		calcTipAmountButton = (Button)this.findViewById(R.id.calcTipButton);
		billAmountTextView = (EditText)this.findViewById(R.id.billAmtEditText);
		
		calcTipAmountButton.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				calculateTip();
			}
		});
	}

	@Override
	public void onStart() {
    	super.onStart();
		loadTipPercentage();
	}

	@Override
	public void onResume() {
		super.onResume();
		calculateTip();
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.activity_main, menu);
		return true;
	}
	
	// Respond to menu selections
	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
	    // Handle item selection
	    switch (item.getItemId()) {
	        case R.id.menu_settings:
	            this.startSettings();
	            return true;
	        default:
	            return super.onOptionsItemSelected(item);
	    }
	}
	

	private void hideKeyboard() {
		InputMethodManager imm = (InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE);
		imm.hideSoftInputFromWindow(this.getCurrentFocus().getWindowToken(), 0);
	}
	
	private void calculateTip() {
		double billAmount;
		
		try {
			billAmount = Double.parseDouble(billAmountTextView.getText().toString());
			hideKeyboard();
		} catch (NumberFormatException ex) {
			billAmount = 0;
		}
		
		double tipAmount = billAmount * tipPercentage;
		double totalAmount = billAmount + tipAmount;
		
		tipAmountTextView.setText(String.format("$%.2f", tipAmount));
		totalAmountTextView.setText(String.format("$%.2f", totalAmount));		
	}

	private void loadTipPercentage() {
		SharedPreferences preferences = this.getSharedPreferences("AppPreferences", MODE_PRIVATE);
		String tipPctString = preferences.getString("tipPercentage", "15.0");
		tipPctTextView.setText(String.format("%s%%", tipPctString));
		tipPercentage = Double.parseDouble(tipPctString) / 100;
	}
	

	private void startSettings() {
		Intent settingsIntent = new Intent();
		settingsIntent.setClass(this, SettingsActivity.class);
		startActivity(settingsIntent);		
	}

}
