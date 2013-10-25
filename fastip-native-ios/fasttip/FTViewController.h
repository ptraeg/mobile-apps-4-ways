//
//  ftViewController.h
//  fasttip
//
//  Created by Peter Traeg on 3/11/13.
//  Copyright (c) 2013 Peter Traeg. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FTViewController : UIViewController

@property (weak, nonatomic) IBOutlet UITextField *checkAmountTextField;
@property (weak, nonatomic) IBOutlet UIButton *calculateButton;
@property (weak, nonatomic) IBOutlet UILabel *tipAmountLabel;
@property (weak, nonatomic) IBOutlet UILabel *totalAmountLabel;

- (IBAction)didTapCalculate:(id)sender;

@end
