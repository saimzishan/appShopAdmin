import { GLOBAL } from './../../../shared/globel';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { fuseAnimations } from '../../../core/animations';
import { MatPaginator, MatSort, MatTableDataSource ,  } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { FuseUtils } from '../../../core/fuseUtils';
import { OptionService } from './option.service';
import { OptionsService } from './options.service';
import { Option , OptionValues } from '../models/option.model';
// import { PeriodicElement } from '../user-management-admin/user-management/user-management.component';
import { SelectionModel } from '@angular/cdk/collections';
import { SpinnerService } from '../../../spinner/spinner.service';
import { SnotifyService } from 'ng-snotify';


@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
  animations: fuseAnimations
})
export class OptionsComponent implements OnInit {
  dataSource: any;
  displayedColumns = ['id', 'option_set', 'option_values'];
  selection = new SelectionModel<Option>(true, []);
  options;
  option_values;
  baseURL = GLOBAL.USER_IMAGE_API;
  newVal;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild('filter')
  filter: ElementRef;
  @ViewChild(MatSort)
  sort: MatSort;

  constructor(
    private optionsService: OptionsService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit() {
    this.getOptions();
    // this.dataSource = new FilesDataSource(this.optionsService, this.paginator, this.sort);
    // Observable.fromEvent(this.filter.nativeElement, 'keyup')
    //     .debounceTime(150)
    //     .distinctUntilChanged()
    //     .subscribe(() => {
    //         if (!this.dataSource) {
    //             return;
    //         }
    //         this.dataSource.filter = this.filter.nativeElement.value;
    //     });
  }

  getOptions() {
    this.spinnerService.requestInProcess(true);
    this.optionsService.getOptions().subscribe(
      (res: any) => {
        this.options = res.res.data;
        this.option_values = res.res.data;
        this.setDataSuorce(res.res.data);
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

  setDataSuorce(obj) {
    this.dataSource = new MatTableDataSource<any>(obj);
    this.dataSource.paginator = this.paginator;
  }

  OptionValuesinDisplayRow(val) {
    this.newVal = [];
    val.forEach(element => {
      this.newVal.push(element.option_value);
    });
    this.newVal = this.newVal.toString();
  }

  // isAllSelected() {
  //     const numSelected = this.selection.selected.length;
  //     const numRows = this.dataSource.data.length;
  //     return numSelected === numRows;
  //   }

  //   /** Selects all rows if they are not all selected; otherwise clear selection. */
  //   masterToggle() {
  //     this.isAllSelected() ?
  //         this.selection.clear() :
  //         this.dataSource.data.forEach(row => this.selection.select(row));
  //   }
}

// export class FilesDataSource extends DataSource<any> {
//   _filterChange = new BehaviorSubject('');
//   _filteredDataChange = new BehaviorSubject('');

//   get filteredData(): any {
//     return this._filteredDataChange.value;
//   }

//   set filteredData(value: any) {
//     this._filteredDataChange.next(value);
//   }

//   get filter(): string {
//     return this._filterChange.value;
//   }

//   set filter(filter: string) {
//     this._filterChange.next(filter);
//   }

//   constructor(
//     private optionsService: OptionsService,
//     private _paginator: MatPaginator,
//     private _sort: MatSort
//   ) {
//     super();
//     this.filteredData = this.optionsService.options;
//   }

//   /** Connect function called by the table to retrieve one stream containing the data to render. */
//   connect(): Observable<any[]> {
//     const displayDataChanges = [
//       this.optionsService.onOptionsChanged,
//       this._paginator.page,
//       this._filterChange,
//       this._sort.sortChange
//     ];

//     return Observable.merge(...displayDataChanges).map(() => {
//       // console.log(this.optionsService.options);
//       let data = this.optionsService.options.slice();

//       data = this.filterData(data);

//       this.filteredData = [...data];

//       data = this.sortData(data);

//       // Grab the page's slice of data.
//       const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
//       return data.splice(startIndex, this._paginator.pageSize);
//     });
//   }

//   filterData(data) {
//     if (!this.filter) {
//       return data;
//     }
//     return FuseUtils.filterArrayByString(data, this.filter);
//   }

//   sortData(data): any[] {
//     if (!this._sort.active || this._sort.direction === '') {
//       return data;
//     }

//     return data.sort((a, b) => {
//       let propertyA: number | string = '';
//       let propertyB: number | string = '';

//       switch (this._sort.active) {
//         case 'id':
//           [propertyA, propertyB] = [a.id, b.id];
//           break;
//         case 'name':
//           [propertyA, propertyB] = [a.name, b.name];
//           break;
//         case 'notes':
//           [propertyA, propertyB] = [a.notes, b.notes];
//           break;
//       }

//       const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
//       const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

//       return (
//         (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
//       );
//     });
//   }

//   disconnect() {}
// }
