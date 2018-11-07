import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import "rxjs/add/operator/startWith";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/observable/fromEvent";
import { fuseAnimations } from "../../../../core/animations";
import { SpinnerService } from "../../../../spinner/spinner.service";
import { UserManagementService } from "../users.service";
import { FormGroup, FormControl, NgForm } from "@angular/forms";
import { SnotifyService } from "ng-snotify";
import { Role } from "../../models/role.model";
import { FuseConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { User } from "../../models/user.model";
import { GLOBAL } from "../../../../shared/globel";

@Component({
  selector: "app-user-managment",
  templateUrl: "./user-management.component.html",
  styleUrls: ["./user-management.component.css"],
  animations: fuseAnimations
})
export class UserManagementComponent implements OnInit, OnDestroy {
  user: User;
  roles = new FormControl();
  roleList: Role[];
  levels: any[];
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  pageType: string;
  firstSelectedRoleName: string;
  sub: any;
  hide: boolean;
  userID: any;
  confirmPassword: string;
  isMatch: any;
  role = true;
  level = true;

  constructor(
    private userMService: UserManagementService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    private route: ActivatedRoute,
    public router: Router,
    private dialog: MatDialog
  ) {
    this.user = new User();
    this.roleList = new Array<Role>();
    this.levels = GLOBAL.LEVELS;
    this.hide = true;
  }

  ngOnInit(): void {
    this.getRoleList();
    this.sub = this.route.params.subscribe(params => {
      this.userID = params["id"] || "";
      if (Boolean(this.userID) && parseInt(this.userID, 10) > 0) {
        this.getUserById(this.userID);
        this.pageType = "edit";
      } else {
        this.pageType = "new";
      }
    });
  }

  ngOnDestroy(): void {
    return this.sub && this.sub.unsubscribe();
  }

  getUserById(id: number) {
    this.spinnerService.requestInProcess(true);
    this.sub = this.userMService.getUserById(id).subscribe(
      (res: any) => {
        if (res.res.data.roles[0].name === 'Admin') {
          this.role = true;
          this.level = false;
        } else {
          this.role = false;
          this.level = true;
        }
        this.user = new User(res.res.data);
        if (this.pageType === "edit") {
          let selectedRoles = this.user.roles;
          this.user.roles = [];
          selectedRoles.forEach(item => {
            this.user.roles.push(item.id);
          });
          this.user.level = GLOBAL.LEVELS.find(
            level => level.name.toLowerCase() === this.user.level
          ).id;
          setTimeout(() => {
            this.onChange({ isUserInput: true });
          }, 100);
        }
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.message;
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  addUser(form: NgForm) {
    if (form.invalid) {
      this.validateForm(form);
      return;
    } else {
      this.createUser();
    }
  }

  createUser() {
    this.spinnerService.requestInProcess(true);
    this.sub = this.userMService.addUser(this.user).subscribe(
      (res: any) => {
        let e = res.res.message;
        this.snotifyService.success(e, "Success !");
        this.spinnerService.requestInProcess(false);
        this.router.navigate(["/user-management/manage-user/users"]);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error.message;
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  updateUser(form: NgForm) {
    if (form.invalid) {
      this.validateForm(form);
      return;
    } else {
      this.editUser();
    }
  }

  editUser() {
    this.spinnerService.requestInProcess(true);
    this.sub = this.userMService.updateUserRoles(this.user).subscribe(
      (res: any) => {
        let e = res.res.message;
        this.snotifyService.success(e, "Success !");
        this.spinnerService.requestInProcess(false);
        this.router.navigate(["/user-management/manage-user/users"]);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.message;
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  delUser() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser();
      }
      this.confirmDialogRef = null;
    });
  }

  deleteUser() {
    this.spinnerService.requestInProcess(true);
    this.sub = this.userMService.deleteUser(this.user.id).subscribe(
      (res: any) => {
        let e = res.res.message;
        this.snotifyService.success(e, "Success !");
        this.spinnerService.requestInProcess(false);
        this.router.navigate(["/user-management/manage-user/users"]);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.message;
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  validateForm(form) {
    this.validateAllFormFields(form.control);
    this.snotifyService.error("Please Fill All Required Fields");
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  onChange(event) {
    let foundRole;
    if (event.isUserInput) {
      if (this.pageType === "edit" && this.user.roles.length > 0) {
        foundRole = this.roleList.find(role => role.id === this.user.roles[0]);
      } else {
        foundRole = this.roleList.find(role => role.id === event.source.value);
      }
      if (foundRole) {
        this.firstSelectedRoleName = foundRole.name;
      }
    }
  }

  matchPassword() {
    if (this.user.password === this.confirmPassword) {
      this.isMatch = false;
    } else {
      this.isMatch = true;
    }
    return this.isMatch;
  }

  getRoleList() {
    this.spinnerService.requestInProcess(true);
    this.userMService.getRoles().subscribe(
      (res: any) => {
        this.roleList = res.res.data;
        if (this.pageType === 'new') {
          let role = this.roleList.find(role => role.id === 1);
          this.firstSelectedRoleName = role.name;
          this.user.roles = [role.id];
        }
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error.message;
        this.snotifyService.error(e, "Error !");
      }
    );
  }
}
