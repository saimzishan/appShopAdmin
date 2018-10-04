import { Component, OnDestroy, OnInit } from '@angular/core';
import { fuseAnimations } from '../../../core/animations';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SnotifyService } from 'ng-snotify';
import { FuseConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';
import { SpinnerService } from '../../../spinner/spinner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OrdersService } from './orders.service';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { Order } from '../models/order.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  animations: fuseAnimations
})
export class OrderComponent implements OnInit, OnDestroy {

  order: Order;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  pageType: string;
  sub: any;
  orderID: any;

  constructor(private orderService: OrdersService, private spinnerService: SpinnerService,
    private snotifyService: SnotifyService, private route: ActivatedRoute, public router: Router,
    private dialog: MatDialog) {
    this.order = new Order();
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.orderID = params['id'] || '';
      if (Boolean(this.orderID) && parseInt(this.orderID, 10) > 0) {
        this.getOrderById(this.orderID);
        this.pageType = 'edit';
      } else {
        this.pageType = 'new';
      }
    });
  }

  ngOnDestroy(): void {
    return this.sub && this.sub.unsubscribe();
  }

  getOrderById(id: number) {
    this.spinnerService.requestInProcess(true);
    this.sub = this.orderService.getOrderById(id).subscribe((res: any) => {
      this.order = new Order(res.res.data);
      this.spinnerService.requestInProcess(false);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  addOrder(form: NgForm) {
    if (form.invalid) {
      this.validateForm(form);
      return;
    } else {
      this.createOrder();
    }
  }

  createOrder() {
    this.spinnerService.requestInProcess(true);
    this.sub = this.orderService.addOrder(this.order).subscribe((res: any) => {
      let e = res.res.message;
      this.snotifyService.success(e, 'Success !');
      this.spinnerService.requestInProcess(false);
      this.router.navigate(['/order-management/orders']);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  updateOrder(form: NgForm) {
    if (form.invalid) {
      this.validateForm(form);
      return;
    } else {
      this.editOrder();
    }
  }

  editOrder() {
    this.spinnerService.requestInProcess(true);
    this.sub = this.orderService.updateOrder(this.order).subscribe((res: any) => {
      let e = res.res.message;
      this.snotifyService.success(e, 'Success !');
      this.spinnerService.requestInProcess(false);
      this.router.navigate(['/order-management/orders']);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  delOrder() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteOrder();
      }
      this.confirmDialogRef = null;
    });
  }

  deleteOrder() {
    this.spinnerService.requestInProcess(true);
    this.sub = this.orderService.deleteOrder(this.order.id).subscribe((res: any) => {
      let e = res.res.message;
      this.snotifyService.success(e, 'Success !');
      this.spinnerService.requestInProcess(false);
      this.router.navigate(['/order-management/orders']);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  validateForm(form) {
    this.validateAllFormFields(form.control);
    this.snotifyService.error("Please Fill All Required Fields");
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
