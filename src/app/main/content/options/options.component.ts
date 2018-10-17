import { GLOBAL } from "./../../../shared/globel";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { fuseAnimations } from "../../../core/animations";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { OptionsService } from "./options.service";
import { Option, OptionValues } from "../models/option.model";
import { SelectionModel } from "@angular/cdk/collections";
import { SpinnerService } from "../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";

@Component({
  selector: "app-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"],
  animations: fuseAnimations
})
export class OptionsComponent implements OnInit {
  dataSource: any;
  displayedColumns = ["id", "option_set", "option_values"];
  selection = new SelectionModel<Option>(true, []);
  options;
  baseURL = GLOBAL.USER_IMAGE_API;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild("filter")
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
  }

  getOptions() {
    this.spinnerService.requestInProcess(true);
    this.optionsService.getOptions().subscribe(
      (res: any) => {
        this.options = res.res.data;
        this.setDataSuorce(res.res.data);
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error.message;
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  setDataSuorce(options) {
    this.dataSource = new MatTableDataSource<Option>(options);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
