import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { fuseAnimations } from '../../../core/animations';
import { SpinnerService } from '../../../spinner/spinner.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
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

  constructor(
    private dashboardService: DashboardService,
    private spinnerService: SpinnerService
  ) { this.dashboard =  []; }

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

  ngOnDestroy() {
  }

}

