//
//  ftSettingsViewController.m
//  fasttip
//
//  Created by Peter Traeg on 3/11/13.
//  Copyright (c) 2013 Peter Traeg. All rights reserved.
//

#import "FTSettingsViewController.h"

@interface FTSettingsViewController ()

@end

@implementation FTSettingsViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
    
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    float tipPercentage = [defaults floatForKey:@"tipPercentage"];
    
    if (tipPercentage <= 0) {
        tipPercentage = 15.0;
    }
    
    self.tipPercentageTextField.text = [NSString stringWithFormat:@"%0.2f", tipPercentage];

}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)didTapDone:(id)sender {
    
    float tipPercentage;
    tipPercentage = [self.tipPercentageTextField.text floatValue];
    
    if (tipPercentage > 0) {

        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        [defaults setFloat:tipPercentage forKey:@"tipPercentage"];
        [defaults synchronize];
        
        [[self navigationController] popViewControllerAnimated:YES];

    } else {
        
        [[[UIAlertView alloc] initWithTitle:@"Invalid input"
                                    message:@"Percentage must be a decimal value"
                                   delegate:nil
                          cancelButtonTitle:@"ok"
                          otherButtonTitles:nil] show];
        
    }
    
}
@end
