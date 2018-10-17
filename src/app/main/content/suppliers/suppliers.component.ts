import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { SuppliersService } from "./suppliers.service";
import { DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs/Observable";
import { fuseAnimations } from "../../../core/animations";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import "rxjs/add/operator/startWith";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/observable/fromEvent";
import { FuseUtils } from "../../../core/fuseUtils";
import { SpinnerService } from "../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";
import { GLOBAL } from "../../../shared/globel";

@Component({
  selector: "app-suppliers",
  templateUrl: "./suppliers.component.html",
  styleUrls: ["./suppliers.component.scss"],
  animations: fuseAnimations
})
export class SuppliersComponent implements OnInit {
  supplier;
  supplier_contact;
  dataSource: any;
  displayedColumns = [
    "name",
    "email",
    "phone",
    "type",
    "image",
    "address"
  ];
  suppliers;
  baseURL = GLOBAL.USER_IMAGE_API;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild("filter")
  filter: ElementRef;
  @ViewChild(MatSort)
  sort: MatSort;

  constructor(
    private suppliersService: SuppliersService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit() {
    this.getSuppliers();
    // this.dataSource = new FilesDataSource(this.suppliersService, this.paginator, this.sort);
    // Observable.fromEvent(this.filter.nativeElement, 'keyup')
    //   .debounceTime(150)
    //   .distinctUntilChanged()
    //   .subscribe(() => {
    //     if ( !this.dataSource )
    //     {
    //       return;
    //     }
    //     this.dataSource.filter = this.filter.nativeElement.value;
    //   });
  }

  getSuppliers() {
    this.spinnerService.requestInProcess(true);
    this.suppliersService.getSuppliers().subscribe(
      (res: any) => {
        this.supplier = res.res.data.data;
        this.supplier_contact = res.res.data.data.contact;
        this.setDataSuorce(res.res.data.data);
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        const e = errors.error.message;
        this.snotifyService.error(e, "Error !");
        // this.notificationServiceBus.launchNotification(true, e);
      }
    );
  }

  setDataSuorce(obj) {
    this.dataSource = new MatTableDataSource<any>(obj);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

