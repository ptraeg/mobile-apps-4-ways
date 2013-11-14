package org.traeg.fastip;

import android.os.Bundle;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class SettingsActivity extends Activity {

	double tipPercentage;
	Button saveSettingsButton;
	EditText tipPercentageEditText;

	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_settings);
		
		tipPercentageEditText = (EditText)this.findViewById(R.id.tipPercentageEditText);
		saveSettingsButton = (Button)this.findViewById(R.id.saveSettingsButton);
		
		loadTipPercentage();

		saveSettingsButton.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				saveSettings();
			}
		});

	}

	private void loadTipPercentage() {
		SharedPreferences preferences = this.getSharedPreferences("AppPreferences", MODE_PRIVATE);
		tipPercentageEditText.setText(preferences.getString("tipPercentage", "15.0"));
	}
	
	private Boolean validateSettings() {
		try {
			Double.parseDouble(tipPercentageEditText.getText().toString());
		} catch (NumberFormatException ex) {
			// Show validation alert dialog
			AlertDialog dialog;
	    	AlertDialog.Builder builder = new AlertDialog.Builder(this);
	    	builder.setMessage("A decimal value is required")
	    			.setTitle("Incorrect Number Format")
	    			.setCancelable(false)
	    			.setPositiveButton("Ok", new DialogInterface.OnClickListener() {
	    	           public void onClick(DialogInterface dialog, int id) {
	    	                dialog.dismiss();
	    	           }
	    	       });
	    	dialog = builder.create();
	    	dialog.show();
	    	return false;
		}
		return true;

	}
	
	private void saveSettings() {
		if (validateSettings()) {
			SharedPreferences preferences = this.getSharedPreferences("AppPreferences", MODE_PRIVATE);
			SharedPreferences.Editor prefEditor = preferences.edit();
			prefEditor.putString("tipPercentage", tipPercentageEditText.getText().toString());
			prefEditor.commit();
			this.finish();
		}
	}

}
