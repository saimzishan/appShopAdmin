import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { SupplierService } from './supplier.service';
import { fuseAnimations } from '../../../core/animations';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { Supplier } from '../models/supplier.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseUtils } from '../../../core/fuseUtils';
import { MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { Location } from '@angular/common';
import { FuseConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SupplierComponent implements OnInit, OnDestroy {
  supplier = new Supplier();
  onSupplierChanged: Subscription;
  pageType: string;
  supplierForm: FormGroup;
  stateJSON;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private supplierService: SupplierService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private location: Location,
    private dialog: MatDialog) {
  }

  ngOnInit() {

    // Subscribe to update product on changes
    this.onSupplierChanged =
      this.supplierService.onSupplierChanged
        .subscribe(supplier => {

          if (supplier) {
            this.supplier = new Supplier(supplier);
            this.pageType = 'edit';
          }
          else {
            this.pageType = 'new';
            this.supplier = new Supplier();
          }

          this.supplierForm = this.createSupplierForm();
        });

  }

  getStatesOfGermany() {
    this.supplierService.getGermanyJson()
      .subscribe((res: any) => {
        //
        // this.categories = res.data.Result;
        this.stateJSON = res;
        setTimeout(() => {

        }, 500);
      },
        errors => {
          let e = errors.json();
        });
  }

  getStatesOfCanada() {
    this.supplierService.getCanadaJson()
      .subscribe((res: any) => {
        //
        // this.categories = res.data.Result;
        this.stateJSON = res;
        setTimeout(() => {

        }, 500);
      },
        errors => {
          let e = errors.json();
        });
  }

  countrySelected(country) {
    if (country === 'Germany') {
      this.getStatesOfGermany();
    } else {
      this.getStatesOfCanada();
    }
  }

  createSupplierForm() {
    return this.formBuilder.group({
      id: [this.supplier.id],
      name: [this.supplier.name],
      type: [this.supplier.type],
      email: [this.supplier.contact.email],
      no: [this.supplier.contact.no],
      street: [this.supplier.contact.street],
      postal_code: [this.supplier.contact.postal_code],
      city: [this.supplier.contact.city],
      country: [this.supplier.contact.country],
      po_box: [this.supplier.contact.po_box],
      ph_landline1: [this.supplier.contact.ph_landline1],
      ph_landline2: [this.supplier.contact.ph_landline2],
      ph_landline3: [this.supplier.contact.ph_landline3],
      ph_mobile1: [this.supplier.contact.ph_mobile1],
      ph_mobile2: [this.supplier.contact.ph_mobile2],
      ph_mobile3: [this.supplier.contact.ph_mobile3],
      handle: [this.supplier.handle],
      /*description     : [this.supplier.description],
      categories      : [this.supplier.categories],
      tags            : [this.supplier.tags],
      images          : [this.supplier.images],
      priceTaxExcl    : [this.supplier.priceTaxExcl],
      priceTaxIncl    : [this.supplier.priceTaxIncl],
      taxRate         : [this.supplier.taxRate],
      comparedPrice   : [this.supplier.comparedPrice],
      quantity        : [this.supplier.quantity],
      sku             : [this.supplier.sku],
      width           : [this.supplier.width],
      height          : [this.supplier.height],
      depth           : [this.supplier.depth],
      weight          : [this.supplier.weight],
      extraShippingFee: [this.supplier.extraShippingFee],
      active          : [this.supplier.active]*/
    });
  }

  saveSupplier() {
    const data = this.supplierForm.getRawValue();
    data.handle = FuseUtils.handleize(data.name);
    this.supplierService.saveSupplier(data)
      .then(() => {

        // Trigger the subscription with new data
        this.supplierService.onSupplierChanged.next(data);

        // Show the success message
        this.snackBar.open('Supplier saved', 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });
      });
  }

  addSupplier() {
    const data = this.supplierForm.getRawValue();
    data.handle = FuseUtils.handleize(data.name);
    this.supplierService.addSupplier(data)
      .then(() => {
        // Trigger the subscription with new data
        this.supplierService.onSupplierChanged.next(data);
      });
  }

  deleteBrand() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        const data = this.supplierForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);
        this.supplierService.deleteSuppler(data)
          .then(() => {
            this.supplierService.onSupplierChanged.next(data);
          });
      }
      this.confirmDialogRef = null;
    });

  }

  ngOnDestroy() {
    this.onSupplierChanged.unsubscribe();
  }
}
