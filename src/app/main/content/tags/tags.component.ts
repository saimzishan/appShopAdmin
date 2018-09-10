import { GLOBAL } from "./../../../shared/globel";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
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
import { TagService } from "./tag.service";
import { TagsService } from "./tags.service";
import { Brand } from "../models/brand.model";
// import { PeriodicElement } from '../user-management-admin/user-management/user-management.component';
import { SelectionModel } from "@angular/cdk/collections";
import { SpinnerService } from "../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";

@Component({
  selector: "app-tags",
  templateUrl: "./tags.component.html",
  styleUrls: ["./tags.component.scss"],
  animations: fuseAnimations
})
export class TagsComponent implements OnInit {
  dataSource: any;
  displayedColumns = ["id", "name", "notes"];
  selection = new SelectionModel<Brand>(true, []);
  tags;
  baseURL = GLOBAL.USER_IMAGE_API;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild("filter")
  filter: ElementRef;
  @ViewChild(MatSort)
  sort: MatSort;

  constructor(
    private tagsService: TagsService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit() {
    this.getTags();
    // this.dataSource = new FilesDataSource(this.brandsService, this.paginator, this.sort);
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

  getTags() {
    this.spinnerService.requestInProcess(true);
    this.tagsService.getBrands().subscribe(
      (res: any) => {
        this.tags = res.res.data;
        this.setDataSuorce(res.res.data);
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

  setDataSuorce(obj) {
    this.dataSource = new MatTableDataSource<any>(obj);
    this.dataSource.paginator = this.paginator;
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
