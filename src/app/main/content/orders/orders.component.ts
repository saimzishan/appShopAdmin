import { Component, ElementRef, OnInit, ViewChild, Input } from "@angular/core";
import { fuseAnimations } from "../../../core/animations";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { OrdersService } from "./orders.service";
import { SpinnerService } from "../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";
import { Order } from "../models/order.model";
import { CdkDetailRowDirective } from "./cdk-detail-row.directive";
import { Address } from "../models/address.model";
import { GLOBAL } from "../../../shared/globel";


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
  statusList: any[];
  orders: any[];
  orderStatus = 0;
  clipUI: boolean;
  shipClipUI: boolean;
  constructor(
    private ordersService: OrdersService, private spinnerService: SpinnerService,
    private snotifyService: SnotifyService
  ) {
    this.order = new Order();
    this.statusList = GLOBAL.STATUS;
  }

  ngOnInit() {
    this.getOrderList();
  }

  @Input() singleChildRowDetail: boolean;

  private openedRow: CdkDetailRowDirective
  onToggleChange(cdkDetailRow: CdkDetailRowDirective, order: Order) : void {
    if (this.singleChildRowDetail && this.openedRow && this.openedRow.expended) {
      this.openedRow.toggle();      
    }
    this.orderStatus = GLOBAL.STATUS
                    .find(status => status.name.toLowerCase() === order.status).id;
    this.openedRow = cdkDetailRow.expended ? cdkDetailRow : undefined;
  }

  getOrderList() {
    this.spinnerService.requestInProcess(true);
    this.ordersService.getOrders().subscribe((res: any) => {
      this.orders = res.res.data;
      this.setDataSource(this.orders);
      this.spinnerService.requestInProcess(false);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.error.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  updateOrderStatus(orderId: number, perviousStatus:number, status: number) {
    this.spinnerService.requestInProcess(true);
    this.ordersService.updateOrderStatus(orderId, perviousStatus, status).subscribe((res: any) => {
      let e = res.res.message;
      this.snotifyService.success(e, 'Success !');
      // this.getOrderList();
      let index = this.orders.findIndex(order => order.id === orderId);
      let newStatus = GLOBAL.STATUS.find(item => item.id === status).name;
      this.orders[index].status = newStatus;
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

  getTotalAmount(order: Order) {
    let total = 0;
    order.line_items.forEach(item => {
      total += +item.quantity * +item.price_paid;
    });
    return total.toFixed(2);
  }

  getTotalItems(order: Order) {
    let itemCount = 0;
    order.line_items.forEach(item => {
      itemCount += +item.quantity;
    });
    return itemCount;
  }

  onStatusChange(order: Order) {
    let perviousStatus = GLOBAL.STATUS
                    .find(status => status.name.toLowerCase() === order.status).id;
    this.updateOrderStatus(order.id, perviousStatus,  this.orderStatus);
  }

  copied() {
    this.clipUI = true;
    setTimeout(() => {
      this.clipUI = false;
    }, 500);
  }

  shipCopied() {
    this.shipClipUI = true;
    setTimeout(() => {
      this.shipClipUI = false;
    }, 500);
  }
}
