import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { SuppliersService } from "./suppliers.service";
import { fuseAnimations } from "../../../core/animations";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
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
  dataSource: any;
  displayedColumns = [
    "name",
    "email",
    "phone",
    "type",
    "address",
    "image"
  ];
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
  }

  getSuppliers() {
    this.spinnerService.requestInProcess(true);
    this.suppliersService.getSuppliers().subscribe(
      (res: any) => {
        this.setDataSuorce(res.res.data.data);
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        const e = errors.error.message;
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  setDataSuorce(suppliers) {
    this.dataSource = new MatTableDataSource<any>(suppliers);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

