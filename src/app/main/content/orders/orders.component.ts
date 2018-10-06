import { Component, ElementRef, OnInit, ViewChild, Input } from "@angular/core";
import { fuseAnimations } from "../../../core/animations";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { OrdersService } from "./orders.service";
import { SpinnerService } from "../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";
import { Order } from "../models/order.model";
import { CdkDetailRowDirective } from "./cdk-detail-row.directive";
import { Address } from "../models/address.model";


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
  displayedColumns = ["id", "date", "order_id", "customer", "status", "total"];
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

  @Input() singleChildRowDetail: boolean;

  private openedRow: CdkDetailRowDirective
  onToggleChange(cdkDetailRow: CdkDetailRowDirective) : void {
    if (this.singleChildRowDetail && this.openedRow && this.openedRow.expended) {
      this.openedRow.toggle();      
    }
    this.openedRow = cdkDetailRow.expended ? cdkDetailRow : undefined;
  }

  temp(cdkDetailRow: CdkDetailRowDirective) {
    this.onToggleChange(cdkDetailRow);
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

  getAddress(address: string) {
    return new Address(JSON.parse(address));
  }

  getTotal(order: Order) {
    let total = 0;
    order.line_items.forEach(item => {
      total += +item.quantity * +item.price_paid;
    });
    return Math.round(total);
  }

  getTotalItems(order: Order) {
    let itemCount = 0;
    order.line_items.forEach(item => {
      itemCount += +item.quantity;
    });
    return Math.round(itemCount);
  }
}
