import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
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

@Component({
    selector   : 'app-role-managment',
    templateUrl: './role-management.component.html',
    styleUrls  : ['./role-management.component.css'],
    animations : fuseAnimations
})
export class RoleManagmentComponent implements OnInit {
    
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = ['role', 'permissions', 'operations'];  
    role: Role;
    users;
    dataSource;
    isAddingNewRole = false;
    userForm: FormGroup;
    permissions = new FormControl();
    PermissionList: string[] = ['add-roles', 'view-roles', 'edit-roles', 'delete-roles', 'add-products', 'view-products', 'edit-products', 'delete-products'];
    constructor(private userMService: UserManagementService, private spinnerService: SpinnerService,
        private snotifyService: SnotifyService) {
            this.role = new Role();
        }

    ngOnInit(): void {}

    ngAfterViewInit () {
        // console.log(AuthGuard.isTokenExpired());
        this.index();
    }

    addRole(form: NgForm) {
        if (form.invalid) {
            this.validateForm(form);
            return;
        }
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
    
    index() {
        this.spinnerService.requestInProcess(true);
        this.userMService.index()
            .subscribe((res: any) => {      
                    this.users = res.res.data;
                    this.setDataSuorce(res.res.data);
                this.spinnerService.requestInProcess(false);
            }, errors => {
                this.spinnerService.requestInProcess(false);
                let e = errors.error.message;
                this.snotifyService.error(e, 'Error !' );
                // this.notificationServiceBus.launchNotification(true, e);
            });
    }
    setDataSuorce(obj) {
        this.dataSource = new MatTableDataSource<any>(obj);
        this.dataSource.paginator = this.paginator;
    }
    
    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    toggleMe() {
        this.isAddingNewRole = !this.isAddingNewRole;
    }
}
