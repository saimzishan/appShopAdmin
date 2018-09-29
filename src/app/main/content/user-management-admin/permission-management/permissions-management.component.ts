import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { SnotifyService } from 'ng-snotify';
import { SpinnerService } from '../../../../spinner/spinner.service';
import { fuseAnimations } from '../../../../core/animations';
import { FormGroup, FormControl } from '@angular/forms';
import { UserManagementService } from '../users.service';
import { Permission } from '../../models/permission.model';

@Component({
    selector: 'app-permissions-management',
    templateUrl: './permissions-management.component.html',
    styleUrls: ['./permissions-management.component.css'],
    animations: fuseAnimations
})
export class PermissionsManagementComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = ['id', 'name'];
    permission: Permission;
    dataSource;
    constructor(private userMService: UserManagementService, private spinnerService: SpinnerService,
        private snotifyService: SnotifyService) {
        this.permission = new Permission();
    }

    ngOnInit() {
        this.getPermissionList();
    }

    getPermissionList() {
        this.spinnerService.requestInProcess(true);
        this.userMService.getPermissions().subscribe((res: any) => {
            let data = res.res.data;
            this.setDataSource(data);
            this.spinnerService.requestInProcess(false);
        }, errors => {
            this.spinnerService.requestInProcess(false);
            let e = errors.error.message;
            this.snotifyService.error(e, 'Error !');
        });
    }

    setDataSource(permissions) {
        this.dataSource = new MatTableDataSource<Permission>(permissions);
        this.dataSource.paginator = this.paginator;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}