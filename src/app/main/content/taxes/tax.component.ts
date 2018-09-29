import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TaxesService } from './taxes.service';
import { fuseAnimations } from '../../../core/animations';
import { Tax } from '../models/tax.model';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SnotifyService } from 'ng-snotify';
import { FuseConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';
import { SpinnerService } from '../../../spinner/spinner.service';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TaxComponent implements OnInit, OnDestroy {

  tax: Tax;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  pageType: string;
  sub: any;
  taxID: any;

  constructor(private taxService: TaxesService, private spinnerService: SpinnerService,
    private snotifyService: SnotifyService, private route: ActivatedRoute, public router: Router,
    private dialog: MatDialog) {
    this.tax = new Tax();
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.taxID = params['id'] || '';
      if (Boolean(this.taxID) && parseInt(this.taxID, 10) > 0) {
        this.getTaxById(this.taxID);
        this.pageType = 'edit';
      } else {
        this.pageType = 'new';
      }
    });
  }

  ngOnDestroy(): void {
    return this.sub && this.sub.unsubscribe();
  }

  getTaxById(id: number) {
    this.spinnerService.requestInProcess(true);
    this.sub = this.taxService.getTaxById(id).subscribe((res: any) => {
      this.tax = new Tax(res.res.data);
      this.spinnerService.requestInProcess(false);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  addTax(form: NgForm) {
    if (form.invalid) {
      this.validateForm(form);
      return;
    } else {
      this.createTax();
    }
  }

  createTax() {
    this.spinnerService.requestInProcess(true);
    this.sub = this.taxService.addTax(this.tax).subscribe((res: any) => {
      let e = res.res.message;
      this.snotifyService.success(e, 'Success !');
      this.spinnerService.requestInProcess(false);
      this.router.navigate(['/tax-management/taxes']);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  updateTax(form: NgForm) {
    if (form.invalid) {
      this.validateForm(form);
      return;
    } else {
      this.editTax();
    }
  }

  editTax() {
    this.spinnerService.requestInProcess(true);
    this.sub = this.taxService.updateTax(this.tax).subscribe((res: any) => {
      let e = res.res.message;
      this.snotifyService.success(e, 'Success !');
      this.spinnerService.requestInProcess(false);
      this.router.navigate(['/tax-management/taxes']);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  delTax() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTax();
      }
      this.confirmDialogRef = null;
    });
  }

  deleteTax() {
    this.spinnerService.requestInProcess(true);
    this.sub = this.taxService.deleteTax(this.tax.id).subscribe((res: any) => {
      let e = res.res.message;
      this.snotifyService.success(e, 'Success !');
      this.spinnerService.requestInProcess(false);
      this.router.navigate(['/tax-management/taxes']);
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

  checkLength() {
    if (this.tax.value >= '100') {
      $('#length').html('Tax value can\'t be greater than 99.9');
      return false;
    } else {
      $('#length').html('');
      return true;
    }
  }
}
