import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { fuseAnimations } from "../../../core/animations";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { OrdersService } from "./orders.service";
import { SpinnerService } from "../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";
import { Order } from "../models/order.model";


@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
  animations: fuseAnimations
})
export class OrdersComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("filter") filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: any;
  displayedColumns = ["toggle", "id", "date", "order_id", "customer", "status", "total", "actions"];
  order: Order;
  constructor(
    private ordersService: OrdersService, private spinnerService: SpinnerService,
    private snotifyService: SnotifyService
  ) {
    this.order = new Order();
  }

  ngOnInit() {
    this.getOrderList();
  }

  getOrderList() {
    this.spinnerService.requestInProcess(true);
    this.ordersService.getOrders().subscribe((res: any) => {
      let data = res.res.data;
      this.setDataSource(data);
      this.spinnerService.requestInProcess(false);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.error.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  setDataSource(orders) {
    this.dataSource = new MatTableDataSource<Order>(orders);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
