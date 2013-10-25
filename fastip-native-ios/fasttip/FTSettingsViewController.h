//
//  ftSettingsViewController.h
//  fasttip
//
//  Created by Peter Traeg on 3/11/13.
//  Copyright (c) 2013 Peter Traeg. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FTSettingsViewController : UIViewController
@property (weak, nonatomic) IBOutlet UITextField *tipPercentageTextField;
- (IBAction)didTapDone:(id)sender;

@end
