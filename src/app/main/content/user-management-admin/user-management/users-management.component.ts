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
import { FormControl } from "@angular/forms";
import { UserManagementService } from "../users.service";
import { User } from "../../models/user.model";

@Component({
  selector: "app-users-management",
  templateUrl: "./users-management.component.html",
  styleUrls: ["./users-management.component.scss"],
  animations: fuseAnimations
})
export class UsersManagementComponent implements OnInit {
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild("filter")
  filter: ElementRef;
  @ViewChild(MatSort)
  sort: MatSort;
  displayedColumns: string[] = ["id", "name", "email", "level", "roles"];
  user: User;
  dataSource;
  roles = new FormControl();
  constructor(
    private userMService: UserManagementService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService
  ) {
    this.user = new User();
  }

  ngOnInit() {
    this.getUserList();
  }

  getUserList() {
    this.spinnerService.requestInProcess(true);
    this.userMService.getUsers().subscribe(
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

  setDataSource(users) {
    this.dataSource = new MatTableDataSource<User>(users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
