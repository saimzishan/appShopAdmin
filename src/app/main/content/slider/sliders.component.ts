import { GLOBAL } from "./../../../shared/globel";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs/Observable";
import { fuseAnimations } from "../../../core/animations";
import { MatPaginator, MatSort, MatTableDataSource, MatDialogRef, MatDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import "rxjs/add/operator/startWith";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/observable/fromEvent";
import { FuseUtils } from "../../../core/fuseUtils";
import { SliderService } from "./slider.service";
import { SlidersService } from "./sliders.service";
import { Brand } from "../models/brand.model";
// import { PeriodicElement } from '../user-management-admin/user-management/user-management.component';
import { SelectionModel } from "@angular/cdk/collections";
import { SpinnerService } from "../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";
import { Slider } from "../models/slider.model";
import { FuseConfirmDialogComponent } from "../../../core/components/confirm-dialog/confirm-dialog.component";


@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-sliders",
  templateUrl: "./sliders.component.html",
  styleUrls: ["./sliders.component.scss"],
  animations: fuseAnimations
})
export class SlidersComponent implements OnInit {
  dataSource: any;
  displayedColumns = ["name", "image" , "action"];
  selection = new SelectionModel<Slider>(true, []);
  sliders;
  baseURL = GLOBAL.USER_IMAGE_API;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild("filter")
  filter: ElementRef;
  @ViewChild(MatSort)
  sort: MatSort;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private slidersService: SlidersService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.getAllSliders();
  }

  getAllSliders() {
    this.spinnerService.requestInProcess(true);
    this.slidersService.getSliders().subscribe(
      (res: any) => {
        let sliders = res.res.data;
        this.setDataSuorce(sliders);
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        const e = errors.error.message;
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  setDataSuorce(sliders) {
    this.dataSource = new MatTableDataSource<Slider>(sliders);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteSlider(id) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerService.requestInProcess(true);
        this.slidersService.deleteSlider(id)
          .subscribe(
            res => {
              this.getAllSliders();
              this.spinnerService.requestInProcess(false);
              if (!res.error) {
                this.snotifyService.success(res.res.message);

              } else {
                this.snotifyService.error("Something went wrong!", "Error");
              }
            },
            error => {
              this.spinnerService.requestInProcess(false);
            }
          );
      }
      this.confirmDialogRef = null;
    });
  }

  imageView(original_image) {
    if (original_image) {
      let spliting = original_image;
      if (
        original_image !== undefined &&
        original_image !== null &&
        original_image !== ""
      ) {
        spliting = spliting.split("/");
        if (spliting[0] === "") {
          return this.baseURL + original_image;
        } else {
          return original_image;
        }
      }
    }
  }
}
