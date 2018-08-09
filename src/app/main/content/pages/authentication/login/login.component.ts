import { SpinnerService } from './../../../../../spinner/spinner.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '../../../../../core/services/config.service';
import { fuseAnimations } from '../../../../../core/animations';
import { UserModel } from '../../../../../models/user.model';
import { UsersService } from '../../../../../api/users.service';
@Component({
    selector   : 'fuse-login',
    templateUrl: './login.component.html',
    styleUrls  : ['./login.component.scss'],
    animations : fuseAnimations
})
export class FuseLoginComponent implements OnInit
{
    loginForm: FormGroup;
    loginFormErrors: any;
    userModel: UserModel;
    constructor(
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        private userServices: UsersService,
        private spinnerService: SpinnerService
    )
    {
        this.userModel = new UserModel();
        this.fuseConfig.setSettings({
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
        });

        this.loginFormErrors = {
            email   : {},
            password: {}
        };
    }

    ngOnInit()
    {
        this.loginForm = this.formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        this.loginForm.valueChanges.subscribe(() => {
            this.onLoginFormValuesChanged();
        });
    }

    onLoginFormValuesChanged() {
        for ( const field in this.loginFormErrors )
        {
            if ( !this.loginFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.loginFormErrors[field] = {};

            // Get the control
            const control = this.loginForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.loginFormErrors[field] = control.errors;
            }
        }
    }

    getLogin() {
        this.spinnerService.requestInProcess(true);
        this.userServices.getLogin(this.userModel)
            .subscribe((res: any) => {
                if (res.status === 200) {
                    console.log(res);
                }
                this.spinnerService.requestInProcess(false);
            }, errors => {
                this.spinnerService.requestInProcess(false);
                let e = errors;
                console.log(e.error.message);
                // this.notificationServiceBus.launchNotification(true, e);
            });
    }
}
