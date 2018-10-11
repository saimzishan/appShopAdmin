import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { fuseAnimations } from '../../../../core/animations';
import { SpinnerService } from '../../../../spinner/spinner.service';
import { UserManagementService } from '../users.service';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector   : 'app-role-managment',
    templateUrl: './role-management.component.html',
    styleUrls  : ['./role-management.component.css'],
    animations : fuseAnimations
})
export class RoleManagementComponent implements OnInit, OnDestroy {
    
    role: Role;
    permissions = new FormControl();
    permissionList: Permission[];
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    pageType: string;
    firstSelectedPerName: string;
    sub: any;
    roleID: any;

    constructor(private userMService: UserManagementService, private spinnerService: SpinnerService,
        private snotifyService: SnotifyService, private route: ActivatedRoute, public router: Router,
        private dialog: MatDialog) {
            this.role = new Role();
            this.permissionList = new Array<Permission>();
        }

    ngOnInit(): void {
        this.getPermissionList();
        this.sub = this.route.params.subscribe(params => {
            this.roleID = params['id'] || '';
            if (Boolean(this.roleID) && parseInt(this.roleID, 10) > 0) {
                this.getRoleById(this.roleID);
                this.pageType = 'edit';
            } else {
                this.pageType = 'new';
            }
        });
    }

    ngOnDestroy(): void {
        return  this.sub && this.sub.unsubscribe();
    }

    getRoleById(id: number) {
        this.spinnerService.requestInProcess(true);
        this.sub = this.userMService.getRoleById(id).subscribe((res: any) => {
            this.role = new Role(res.res.data);
            if(this.pageType === 'edit') {
                let selectedPermissions = this.role.permissions;
                this.role.permissions = [];
                selectedPermissions.forEach(item => {
                    this.role.permissions.push(item.id);
                });
                this.onChange({isUserInput: true});
            }
            this.spinnerService.requestInProcess(false);
        }, errors => {
            this.spinnerService.requestInProcess(false);
            let e = errors.message;
            this.snotifyService.error(e, 'Error !');
        });
    }

    addRole(form: NgForm) {
        if (form.invalid) {
            this.validateForm(form);
            return;
        } else {
            this.createRole();
        }
    }

    createRole() {
        this.spinnerService.requestInProcess(true);
        this.sub = this.userMService.addRole(this.role).subscribe((res: any) => {
            let e = res.res.message;
            this.snotifyService.success(e, 'Success !');
            this.spinnerService.requestInProcess(false);
            this.router.navigate(['/user-management/manage-role/roles']);
        }, errors => {
            this.spinnerService.requestInProcess(false);
            let e = errors.message;
            this.snotifyService.error(e, 'Error !');
        });
    }

    updateRole(form: NgForm) {
        if (form.invalid) {
            this.validateForm(form);
            return;
        } else {
            this.editRole();
        }
    }

    editRole() {
        this.spinnerService.requestInProcess(true);
        this.sub = this.userMService.updateRole(this.role).subscribe((res: any) => {
            let e = res.res.message;
            this.snotifyService.success(e, 'Success !');
            this.spinnerService.requestInProcess(false);
            this.router.navigate(['/user-management/manage-role/roles']);
        }, errors => {
            this.spinnerService.requestInProcess(false);
            let e = errors.message;
            this.snotifyService.error(e, 'Error !');
        });
    }

    delRole() {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
          });
          this.confirmDialogRef.componentInstance.confirmMessage =
            "Are you sure you want to delete?";
          this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteRole();
            }
            this.confirmDialogRef = null;
          });
    }

    deleteRole() {
        this.spinnerService.requestInProcess(true);
        this.sub = this.userMService.deleteRole(this.role.id).subscribe((res: any) => {
            let e = res.res.message;
            this.snotifyService.success(e, 'Success !');
            this.spinnerService.requestInProcess(false);
            this.router.navigate(['/user-management/manage-role/roles']);
        }, errors => {
            this.spinnerService.requestInProcess(false);
            let e = errors.message;
            this.snotifyService.error(e, 'Error !');
        });
    }

    validateForm(form) {
        this.validateAllFormFields(form.control);
        this.snotifyService.warning("Please Fill All Required Fields");
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
        if(event.isUserInput) {
            let foundPermission = this.permissionList.find(permission => permission.id === (this.pageType === 'edit'? this.role.permissions[0] : event.source.value));
            if(foundPermission) {
                this.firstSelectedPerName = foundPermission.name;
            }
        }
    }

    getPermissionList() {
        this.spinnerService.requestInProcess(true);
        this.userMService.getPermissions().subscribe((res: any) => {
            this.permissionList = res.res.data;
            this.spinnerService.requestInProcess(false);
        }, errors => {
            this.spinnerService.requestInProcess(false);
            let e = errors.error.message;
            this.snotifyService.error(e, 'Error !');
        });
    }
}
