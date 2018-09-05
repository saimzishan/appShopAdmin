import { AuthGuard } from "./../../../../../guard/auth.guard";
import { SpinnerService } from "./../../../../../spinner/spinner.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FuseConfigService } from "../../../../../core/services/config.service";
import { fuseAnimations } from "../../../../../core/animations";
import { UserModel } from "../../../../../models/user.model";
import { UsersService } from "../../../../../api/users.service";
import { SnotifyService } from "ng-snotify";
import { Router } from "@angular/router";

@Component({
  selector: "fuse-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  animations: fuseAnimations
})
export class FuseLoginComponent implements OnInit {
  loginForm: FormGroup;
  loginFormErrors: any;
  userModel: UserModel;
  constructor(
    private fuseConfig: FuseConfigService,
    private formBuilder: FormBuilder,
    private userServices: UsersService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    private router: Router
  ) {
    this.userModel = new UserModel();
    this.fuseConfig.setSettings({
      layout: {
        navigation: "none",
        toolbar: "none",
        footer: "none"
      }
    });

    this.loginFormErrors = {
      email: {},
      password: {}
    };
  }

  ngOnInit() {
    // this.snotifyService.success('Wao', ' !');
    let rememberMe = localStorage.getItem("rememberMe");
    if (rememberMe) {
      if (rememberMe === "true" && AuthGuard.isLoggedIn()) {
        this.router.navigate(["/user-management"]);
      }
    }
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      rememberMe: ["", ""]
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.onLoginFormValuesChanged();
    });
  }

  onLoginFormValuesChanged() {
    for (const field in this.loginFormErrors) {
      if (!this.loginFormErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      this.loginFormErrors[field] = {};

      // Get the control
      const control = this.loginForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.loginFormErrors[field] = control.errors;
      }
    }
  }

  getLogin() {
    this.spinnerService.requestInProcess(true);
    this.userServices.getLogin(this.userModel).subscribe(
      (res: any) => {
        if (res.status === 200) {
          localStorage.setItem("currentUser", JSON.stringify(res.res));
          localStorage.setItem(
            "rememberMe",
            this.userModel.rememberMe.toString()
          );
          this.snotifyService.success("Login sucessfully", "Success !");
          this.router.navigate(["/user-management"]);
        }
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error.message;
        this.snotifyService.error(e, "Error !");
        // this.notificationServiceBus.launchNotification(true, e);
      }
    );
  }
}
