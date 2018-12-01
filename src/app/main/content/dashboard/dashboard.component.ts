import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { DashboardService } from "./dashboard.service";
import { fuseAnimations } from "../../../core/animations";
import { SpinnerService } from "../../../spinner/spinner.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DashboardComponent implements OnInit, OnDestroy {
  w1 = 2;
  projects: any[];
  selectedProject: any;

  dashboard: any;

  widgets: any;
  widget5: any = {};
  widget6: any = {};
  widget7: any = {};
  startDate: Date;
  endDate: Date;
  from;
  to;
  orderStatuses: OderStatuses;
  constructor(
    private dashboardService: DashboardService,
    private spinnerService: SpinnerService
  ) {
    this.dashboard = [];
    this.orderStatuses = new OderStatuses();
  }

  ngOnInit() {
    this.getStatics();
  }

  getStatics() {
    this.spinnerService.requestInProcess(true);
    this.dashboardService.getDashboardInfo().subscribe(
      (res: any) => {
        this.spinnerService.requestInProcess(false);
        this.dashboard = res.res.data;
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error.message;
      }
    );
  }

  getOrderBetweenDates() {
    const dates = {
      from: this.getFulDate(this.startDate),
      to: this.getFulDate(this.endDate)
    };

    this.spinnerService.requestInProcess(true);
    this.dashboardService.getOrderBetweenDates(dates).subscribe(
      (res: any) => {
        this.spinnerService.requestInProcess(false);
        // this.dashboard = res.res.data;
        this.setOrderStatus(res.res.data);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error.message;
      }
    );
  }

  setOrderStatus(obj) {
    for (const iterator of obj) {
      switch (iterator) {
        case "created":
          this.orderStatuses.created++;
          break;
        case "approved":
          this.orderStatuses.approved++;
          break;
        case "in-progress":
          this.orderStatuses.in_progress++;
          break;
        case "full-fill":
          this.orderStatuses.full_fill++;
          break;
        case "canceled":
          this.orderStatuses.canceled++;
          break;
        default:
          break;
      }
      this.orderStatuses.total++;
    }
  }

  getFulDate(date) {
    let res =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return res;
  }
  ngOnDestroy() {}
}

export class OderStatuses {
  total: number;
  created: number;
  approved: number;
  in_progress: number;
  full_fill: number;
  canceled: number;

  constructor(obj?) {
    obj = obj || {};
    this.total = obj.total || 0;
    this.created = obj.created || 0;
    this.approved = obj.approved || 0;
    this.in_progress = obj.in_progress || 0;
    this.full_fill = obj.full_fill || 0;
    this.canceled = obj.canceled || 0;
  }
}
