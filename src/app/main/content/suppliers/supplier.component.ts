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
import { FormBuilder, FormGroup , FormControl } from '@angular/forms';
import { FuseUtils } from '../../../core/fuseUtils';
import { MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { Location } from '@angular/common';
import { FuseConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';
import { Contact } from '../models/contact.model';
import { SnotifyService } from 'ng-snotify';
import { SpinnerService } from './../../../spinner/spinner.service';
import { Router } from '@angular/router';
import { GLOBAL } from '../../../shared/globel';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SupplierComponent implements OnInit, OnDestroy {
  supplier = new Supplier();
  supplier_contact = new Contact();
  onSupplierChanged: Subscription;
  pageType: string;
  supplierForm: FormGroup;
  stateJSON;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  base64textString;
  baseURL = GLOBAL.USER_IMAGE_API;

  constructor(
    private supplierService: SupplierService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private location: Location,
    private dialog: MatDialog,
    private snotifyService: SnotifyService,
    private spinnerService: SpinnerService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.onSupplierChanged =
      this.supplierService.onSupplierChanged
        .subscribe(supplier => {
          if (supplier) {
            this.supplier = new Supplier(supplier);
            this.pageType = 'edit';
            this.countrySelected(supplier.country);
            console.log(supplier);
          }
          else {
            this.pageType = 'new';
            this.supplier = new Supplier();
          }
          // this.supplierForm = this.createSupplierForm();
        });

  }

  getStatesOfGermany() {
    this.supplierService.getGermanyJson()
      .subscribe((res: any) => {
        this.stateJSON = res;
        setTimeout(() => {
        }, 500);
      },
        errors => {
          const e = errors.json();
        });
  }

  getStatesOfCanada() {
    this.supplierService.getCanadaJson()
      .subscribe((res: any) => {
        this.stateJSON = res;
        setTimeout(() => {
        }, 500);
      },
        errors => {
          const e = errors.json();
        });
  }

  countrySelected(country) {
    if (country === 'Germany') {
      this.getStatesOfGermany();
    } else {
      this.getStatesOfCanada();
    }
  }

  // createSupplierForm() {
  //   return this.formBuilder.group({
  //     id: [this.supplier.id],
  //     name: [this.supplier.name],
  //     type: [this.supplier.type],
  //     email: [this.supplier.contact.email],
  //     no: [this.supplier.contact.no],
  //     street: [this.supplier.contact.street],
  //     postal_code: [this.supplier.contact.postal_code],
  //     city: [this.supplier.contact.city],
  //     country: [this.supplier.contact.country],
  //     po_box: [this.supplier.contact.po_box],
  //     ph_landline1: [this.supplier.contact.ph_landline1],
  //     ph_landline2: [this.supplier.contact.ph_landline2],
  //     ph_landline3: [this.supplier.contact.ph_landline3],
  //     ph_mobile1: [this.supplier.contact.ph_mobile1],
  //     ph_mobile2: [this.supplier.contact.ph_mobile2],
  //     ph_mobile3: [this.supplier.contact.ph_mobile3],
  //     handle: [this.supplier.handle],
  //   });
  // }

  saveSupplier() {
    const data = this.supplierForm.getRawValue();
    data.handle = FuseUtils.handleize(data.name);
    this.supplierService.saveSupplier(data)
      .then(() => {
        this.supplierService.onSupplierChanged.next(data);
        this.snackBar.open('Supplier saved', 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });
      });
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

  addSupplier(form) {
    // this.supplier.contact = this.supplier_contact;
    // this.supplier.contact = this.supplier_contact;
    console.log(this.supplier);
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning('Please Fill All Fields');
      return;
    }
    // this.product.category_id = this.category_id;
    // this.product.suppliers[0].productVariants
    this.spinnerService.requestInProcess(true);

    this.supplierService.addSupplier(this.supplier).subscribe(
      (res: any) => {
        this.snotifyService.success(res.res.message, 'Success !');
        this.spinnerService.requestInProcess(false);
        this.supplier = new Supplier();
        this.supplier.contact = new Contact();
        this.router.navigate(['/suppliers']);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.error);
        this.snotifyService.error(e, 'Error !');
      }
    );
  }

  handleFileSelect(evt) {
    const files = evt.target.files;
    const file = files[0];
    if (files && file) {
      const reader = new FileReader();
      this.supplier.content_type = '.' + file.type.split('/')[1];
      reader.onload = this._handleReaderLoaded.bind(this);

      reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.supplier.image = this.base64textString;
  }

  deleteSupplier() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        alert('a');
        // const data = this.supplierForm.getRawValue();
        // data.handle = FuseUtils.handleize(data.name);
        this.supplierService.deleteSuppler(this.supplier)
          .then(() => {
            this.supplierService.onSupplierChanged.next(this.supplier);
          });
      }
      this.confirmDialogRef = null;
    });
  }

  ngOnDestroy() {
    this.onSupplierChanged.unsubscribe();
  }
}
