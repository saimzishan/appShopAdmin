import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import "rxjs/add/operator/startWith";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/observable/fromEvent";
import { SnotifyService } from "ng-snotify";
import { SpinnerService } from "../../../../spinner/spinner.service";
import { fuseAnimations } from "../../../../core/animations";
import { Role } from "../../models/role.model";
import { FormGroup, FormControl } from "@angular/forms";
import { UserManagementService } from "../users.service";

@Component({
  selector: "app-roles-management",
  templateUrl: "./roles-management.component.html",
  styleUrls: ["./roles-management.component.scss"],
  animations: fuseAnimations
})
export class RolesManagementComponent implements OnInit {
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild("filter")
  filter: ElementRef;
  @ViewChild(MatSort)
  sort: MatSort;
  displayedColumns: string[] = ["role", "permissions"];
  role: Role;
  dataSource;
  permissions = new FormControl();
  constructor(
    private userMService: UserManagementService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService
  ) {
    this.role = new Role();
  }

  ngOnInit() {
    this.getRoleList();
  }

  getRoleList() {
    this.spinnerService.requestInProcess(true);
    this.userMService.getRoles().subscribe(
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

  setDataSource(roles) {
    this.dataSource = new MatTableDataSource<Role>(roles);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
