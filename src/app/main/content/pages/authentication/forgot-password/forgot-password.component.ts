import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '../../../../../core/services/config.service';
import { fuseAnimations } from '../../../../../core/animations';
import { SpinnerService } from '../../../../../spinner/spinner.service';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import { UsersService } from '../../../../../api/users.service';

@Component({
    selector: 'fuse-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    animations: fuseAnimations
})
export class FuseForgotPasswordComponent implements OnInit {
    forgotPasswordForm: FormGroup;
    forgotPasswordFormErrors: any;
    forgetPass = new ForgetPasswordModel();
    hideFieldAndButton = false;
    success = false;
    error = '';
    errorOccured = false;

    constructor(
        private userServices: UsersService,
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        private spinnerService: SpinnerService,
        private snotifyService: SnotifyService,
        private router: Router
    ) {
        this.fuseConfig.setSettings({
            layout: {
                navigation: 'none',
                toolbar: 'none',
                footer: 'none'
            }
        });

        this.forgotPasswordFormErrors = {
            email: {}
        };
    }

    ngOnInit() {
        this.forgotPasswordForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });

        this.forgotPasswordForm.valueChanges.subscribe(() => {
            this.onForgotPasswordFormValuesChanged();
        });
    }

    onForgotPasswordFormValuesChanged() {
        for (const field in this.forgotPasswordFormErrors) {
            if (!this.forgotPasswordFormErrors.hasOwnProperty(field)) {
                continue;
            }

            // Clear previous errors
            this.forgotPasswordFormErrors[field] = {};

            // Get the control
            const control = this.forgotPasswordForm.get(field);

            if (control && control.dirty && !control.valid) {
                this.forgotPasswordFormErrors[field] = control.errors;
            }
        }
    }

    forgotPassword() {
        this.spinnerService.requestInProcess(true);
        this.userServices.forgotPassword(this.forgetPass).subscribe(
            (res: any) => {
                if (res.res.statusCode === '1') {
                    this.snotifyService.success('Link Sent Succesfully !');
                    this.hideFieldAndButton = true;
                    this.success = true;
                    //   this.router.navigate(["/user-management"]);
                } else {
                this.error = res.res.message;
                this.errorOccured = true;
                }
                this.spinnerService.requestInProcess(false);
            },
            errors => {
                this.spinnerService.requestInProcess(false);
                let e = errors.error.message;
                this.snotifyService.error(e, 'Error !');
                // this.notificationServiceBus.launchNotification(true, e);
            }
        );
    }
}

export class ForgetPasswordModel {
    email = '';
}
