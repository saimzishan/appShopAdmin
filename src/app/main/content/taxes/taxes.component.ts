import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { fuseAnimations } from "../../../core/animations";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import "rxjs/add/operator/startWith";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/observable/fromEvent";
import { TaxesService } from "./taxes.service";
import { SpinnerService } from "../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";
import { Tax } from "../models/tax.model";

@Component({
  selector: "app-taxes",
  templateUrl: "./taxes.component.html",
  styleUrls: ["./taxes.component.scss"],
  animations: fuseAnimations
})
export class TaxesComponent implements OnInit {
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild("filter")
  filter: ElementRef;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource: any;
  displayedColumns = ["title", "value"];
  tax: Tax;
  constructor(
    private taxesService: TaxesService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService
  ) {
    this.tax = new Tax();
  }

  ngOnInit() {
    this.getTaxList();
  }

  getTaxList() {
    this.spinnerService.requestInProcess(true);
    this.taxesService.getTaxs().subscribe(
      (res: any) => {
        let data = res.res.data;
        this.setDataSource(data);
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error.message;
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  setDataSource(taxs) {
    this.dataSource = new MatTableDataSource<Tax>(taxs);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
