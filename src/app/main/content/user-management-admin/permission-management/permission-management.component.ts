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
import { Permission } from '../../models/permission.model';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector   : 'app-permission-managment',
    templateUrl: './permission-management.component.html',
    styleUrls  : ['./permission-management.component.css'],
    animations : fuseAnimations
})
export class PermissionManagementComponent implements OnInit, OnDestroy {
    
    permission: Permission;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    pageType: string;
    sub: any;
    permissionID: any;

    constructor(private userMService: UserManagementService, private spinnerService: SpinnerService,
        private snotifyService: SnotifyService, private route: ActivatedRoute, public router: Router,
        private dialog: MatDialog) {
            this.permission = new Permission();
        }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.permissionID = params['id'] || '';
            if (Boolean(this.permissionID) && parseInt(this.permissionID, 10) > 0) {
                this.getPermissionById(this.permissionID);
                this.pageType = 'edit';
            } else {
                this.pageType = 'new';
            }
        });
    }

    ngOnDestroy(): void {
        return  this.sub && this.sub.unsubscribe();
    }

    getPermissionById(id: number) {
        this.spinnerService.requestInProcess(true);
        this.sub = this.userMService.getPermissionById(id).subscribe((res: any) => {
            this.permission = new Permission(res.res.data);
            this.spinnerService.requestInProcess(false);
        }, errors => {
            this.spinnerService.requestInProcess(false);
            let e = errors.message;
            this.snotifyService.error(e, 'Error !');
        });
    }

    addPermission(form: NgForm) {
        if (form.invalid) {
            this.validateForm(form);
            return;
        } else {
            this.createPermission();
        }
    }

    createPermission() {
        this.spinnerService.requestInProcess(true);
        this.sub = this.userMService.addPermission(this.permission).subscribe((res: any) => {
            let e = res.res.message;
            this.snotifyService.success(e, 'Success !');
            this.spinnerService.requestInProcess(false);
            this.router.navigate(['/user-management/manage-permission/permissions']);
        }, errors => {
            this.spinnerService.requestInProcess(false);
            let e = errors.message;
            this.snotifyService.error(e, 'Error !');
        });
    }

    updatePermission(form: NgForm) {
        if (form.invalid) {
            this.validateForm(form);
            return;
        } else {
            this.editPermission();
        }
    }

    editPermission() {
        this.spinnerService.requestInProcess(true);
        this.sub = this.userMService.updatePermission(this.permission).subscribe((res: any) => {
            let e = res.res.message;
            this.snotifyService.success(e, 'Success !');
            this.spinnerService.requestInProcess(false);
            this.router.navigate(['/user-management/manage-permission/permissions']);
        }, errors => {
            this.spinnerService.requestInProcess(false);
            let e = errors.message;
            this.snotifyService.error(e, 'Error !');
        });
    }

    delPermission() {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
          });
          this.confirmDialogRef.componentInstance.confirmMessage =
            "Are you sure you want to delete?";
          this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deletePermission();
            }
            this.confirmDialogRef = null;
          });
    }

    deletePermission() {
        this.spinnerService.requestInProcess(true);
        this.sub = this.userMService.deletePermission(this.permission.id).subscribe((res: any) => {
            let e = res.res.message;
            this.snotifyService.success(e, 'Success !');
            this.spinnerService.requestInProcess(false);
            this.router.navigate(['/user-management/manage-permission/permissions']);
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
}
