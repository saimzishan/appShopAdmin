import { Component, OnInit, ViewEncapsulation, ViewChild, TemplateRef } from '@angular/core';
import { OptionsService } from './options.service';
import { Option, OptionValues } from '../models/option.model';
import { fuseAnimations } from '../../../core/animations';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MatChipInputEvent } from '@angular/material';
import { SnotifyService } from 'ng-snotify';
import { FuseConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';
import { SpinnerService } from '../../../spinner/spinner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OptionComponent implements OnInit {
  @ViewChild('dialogContent')
  dialogContent: TemplateRef<any>;
  @ViewChild('chipList') chipList;

  option: Option;
  pageType: string;
  optionForm: FormGroup;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  sub: Subscription;
  optionID: any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  constructor(
    private optionService: OptionsService,
    private snotifyService: SnotifyService,
    private dialog: MatDialog,
    private spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.option = new Option();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.optionID = params['id'] || '';
      if (Boolean(this.optionID) && parseInt(this.optionID, 10) > 0) {
        this.getOptionById(this.optionID);
        this.pageType = 'edit';
      } else {
        this.pageType = 'new';
        this.option = new Option();
      }
    });
  }

  ngOnDestroy(): void {
    return this.sub && this.sub.unsubscribe();
  }

  getOptionById(id: number) {
    this.spinnerService.requestInProcess(true);
    this.sub = this.optionService.getOptionById(id).subscribe((res: any) => {
      this.option = new Option(res.res.data);
      this.option.options = res.res.data.options;
      this.spinnerService.requestInProcess(false);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  addOption(form: NgForm) {
    if (form.invalid || this.option.options.length <= 0) {
      this.validateForm(form);
      return;
    } else {
      this.createOption();
    }
  }

  createOption() {
    this.spinnerService.requestInProcess(true);
    this.sub = this.optionService.addOption(this.option).subscribe((res: any) => {
      let e = res.res.message;
      this.snotifyService.success(e, 'Success !');
      this.spinnerService.requestInProcess(false);
      this.router.navigate(['/options']);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  editOption(form: NgForm) {
    if (form.invalid || this.option.options.length <= 0) {
      this.validateForm(form);
      return;
    } else {
      this.updateOption();
    }
  }

  updateOption() {
    this.spinnerService.requestInProcess(true);
    let tempOption = new Option(this.option);
    tempOption.options = tempOption.options.filter(ov => ov.id === -1);
    this.sub = this.optionService.editOption(tempOption).subscribe((res: any) => {
      let e = res.res.message;
      this.snotifyService.success(e, 'Success !');
      this.spinnerService.requestInProcess(false);
      this.router.navigate(['/options']);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  delOption() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteOption();
      }
      this.confirmDialogRef = null;
    });
  }

  deleteOption() {
    this.spinnerService.requestInProcess(true);
    this.sub = this.optionService.deleteOption(this.option.id).subscribe((res: any) => {
      let e = res.res.message;
      this.snotifyService.success(e, 'Success !');
      this.spinnerService.requestInProcess(false);
      this.router.navigate(['/options']);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.error.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  deleteOptionValue(optionVal: OptionValues) {
    this.spinnerService.requestInProcess(true);
    this.sub = this.optionService.deleteOptionValue(optionVal.id).subscribe((res: any) => {
      let e = res.res.message;
      this.snotifyService.success(e, 'Success !');
      this.spinnerService.requestInProcess(false);
      this.remove(optionVal);
      // this.router.navigate(['/options']);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.error.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  validateForm(form) {
    this.validateAllFormFields(form.control);
    this.snotifyService.error("Please Fill All Required Fields");
  }

  validateAllFormFields(formGroup: FormGroup) {
    if (this.option.options.length <= 0) {
      this.chipList.errorState = true;
    }
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    let tempOptionVal = new OptionValues();
    tempOptionVal.value = event.value.trim();

    // Add our option
    if ((value || '').trim()) {
      this.option.options.push(tempOptionVal);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    if (this.option.options.length > 0) {
      this.chipList.errorState = false;
    }
  }

  remove(optValue: OptionValues): void {
    const index = this.option.options.indexOf(optValue);

    if (index >= 0) {
      this.option.options.splice(index, 1);
    }

    if (this.option.options.length > 0) {
      this.chipList.errorState = false;
    }

    if (this.option.options.length <= 0) {
      this.chipList.errorState = true;
    }
  }
}
