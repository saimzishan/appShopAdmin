import { FormGroup } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { SpinnerService } from './../../../../spinner/spinner.service';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserManagementService } from './../users.service';
import {fuseAnimations} from '../../../../core/animations';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { AuthGuard } from '../../../../guard/auth.guard';

export interface PeriodicElement {
    id: number,
    name: string;
  }
  
@Component({
    selector   : 'app-user-managment',
    templateUrl: './user-management.component.html',
    styleUrls  : ['./user-management.component.css'],
    animations: fuseAnimations
})
export class UserManagmentComponent implements AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = ['id', 'name'];  
    users ;
    dataSource ;
    isAddingNewUser = false;
    userForm: FormGroup;
    constructor(private userMService: UserManagementService, private spinnerService: SpinnerService, private snotifyService: SnotifyService) {

    }
   
    ngAfterViewInit () {
        // console.log(AuthGuard.isTokenExpired());
        // this.index();
     }
   
    
    // index() {
    //     this.spinnerService.requestInProcess(true);
    //     this.userMService.index()
    //         .subscribe((res: any) => {      
    //                 this.users = res.res.data;
    //                 this.setDataSuorce(res.res.data);
    //             this.spinnerService.requestInProcess(false);
    //         }, errors => {
    //             this.spinnerService.requestInProcess(false);
    //             let e = errors.error.message;
    //             this.snotifyService.error(e, 'Error !' );
    //             // this.notificationServiceBus.launchNotification(true, e);
    //         });
    // }
    setDataSuorce(obj) {
        this.dataSource = new MatTableDataSource<any>(obj);
        this.dataSource.paginator = this.paginator;
      }
    
    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }

      toggleMe() {
          this.isAddingNewUser = !this.isAddingNewUser;
      }

}

