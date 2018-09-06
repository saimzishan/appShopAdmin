import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  Inject,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { OptionService } from './option.service';
// import { OptionsService } from './option.service';
import { Option, OptionValues } from '../models/option.model';
import { fuseAnimations } from '../../../core/animations';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { Brand } from '../models/brand.model';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FuseUtils } from '../../../core/fuseUtils';
import {
  MatSnackBar,
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material';
import { Location } from '@angular/common';
import {
  FileSystemDirectoryEntry,
  FileSystemFileEntry,
  UploadEvent,
  UploadFile
} from 'ngx-file-drop';
import { GLOBAL } from '../../../shared/globel';
import { SnotifyService } from 'ng-snotify';
import { FuseConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';
import { SpinnerService } from '../../../spinner/spinner.service';
import { Router } from '@angular/router';
// import { $ } from 'protractor';
declare var $: any;

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OptionComponent implements OnInit, OnDestroy {
  @ViewChild('dialogContent')
  dialogContent: TemplateRef<any>;

  option = new Option();
  option_values = new OptionValues();
  onOptionChanged: Subscription;
  pageType: string;
  optionForm: FormGroup;
  files: UploadFile[] = [];
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  baseURL = GLOBAL.USER_IMAGE_API;
  options = {};
  base64textString: string;
  newVal = '';
  optionsCardEnable = false;

  constructor(
    private optionService: OptionService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private location: Location,
    private snotifyService: SnotifyService,
    private dialog: MatDialog,
    private spinnerService: SpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
    // Subscribe to update product on changes
    this.onOptionChanged = this.optionService.onOptionChanged.subscribe(option => {
      if (option) {
        this.option = new Option(option);
        this.pageType = 'edit';
      } else {
        this.pageType = 'new';
        this.option = new Option();
      }

      // this.brandForm = this.createBrandForm();
    });
  }

  addOptionValue() {
    this.option.options.push(this.option_values);
    console.log(this.option.options);
    this.option_values = new OptionValues();
    if (this.option.options.length > 0) {
      this.optionsCardEnable = true;
    } else if (this.option.options.length === 0) {
      this.optionsCardEnable = false;
    }
  }

  addOption(form) {
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning('Please Fill All Fields');
      return;
    }
    // this.option.suppliers.push(this.supplier);
    // this.product.category_id = this.category_id;
    // this.product.suppliers[0].productVariants
    this.spinnerService.requestInProcess(true);

    this.optionService.addOption(this.option).subscribe(
      (res: any) => {
        this.snotifyService.success(res.res.message, 'Success !');
        this.spinnerService.requestInProcess(false);
        this.option = new Option();
        this.option_values = new OptionValues();
        this.router.navigate(['/options']);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.error);
        this.snotifyService.error(e, 'Error !');
      }
    );
  }


  saveOption(form) {
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning('Please Fill All Required Fields');
      return;
    }
    this.optionService.saveOption(this.option).then(() => {
      // Trigger the subscription with new data
      this.optionService.onOptionChanged.next(this.option);

      // Show the success message
    });
  }

  deleteOption() {
    // {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        const data = this.optionForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);
        this.optionService.deleteOptions(data).then(() => {
          this.optionService.onOptionChanged.next(data);
        });
      }
      this.confirmDialogRef = null;
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

  fileOver(event) {
    console.log(event);
  }

  fileLeave(event) {
    console.log(event);
  }

  ngOnDestroy() {
    this.onOptionChanged.unsubscribe();
  }
}
