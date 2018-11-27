import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { fuseAnimations } from '../../../core/animations';

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

  widgets: any;
  widget5: any = {};
  widget6: any = {};
  widget7: any = {};

  constructor(private dashboardService: DashboardService) {
    this.projects = this.dashboardService.projects;
    // this.selectedProject = this.projects[0];
    this.widgets = this.dashboardService.widgets;

    /**
     * Widget 5
     */
    this.widget5 = {
      currentRange: 'TW',
      xAxis: true,
      yAxis: true,
      gradient: false,
      legend: false,
      showXAxisLabel: false,
      xAxisLabel: 'Days',
      showYAxisLabel: false,
      yAxisLabel: 'Isues',
      scheme: {
        domain: ['#42BFF7', '#C6ECFD', '#C7B42C', '#AAAAAA']
      },
      onSelect: (ev) => {
        console.log(ev);
      }
    };

    /**
     * Widget 6
     */
    this.widget6 = {
      currentRange: 'TW',
      legend: false,
      explodeSlices: false,
      labels: true,
      doughnut: true,
      gradient: false,
      scheme: {
        domain: ['#f44336', '#9c27b0', '#03a9f4', '#e91e63']
      },
      onSelect: (ev) => {
        console.log(ev);
      }
    };

    /**
     * Widget 7
     */
    this.widget7 = {
      currentRange: 'T'
    };

  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}

