import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  Inject,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { TaxService } from './tax.service';
import { fuseAnimations } from '../../../core/animations';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { Tax } from '../models/tax.model';
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
// import { $ } from 'protractor';
declare var $: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TaxComponent implements OnInit, OnDestroy {
  @ViewChild('dialogContent')
  dialogContent: TemplateRef<any>;

  tax = new Tax();
  onTaxChanged: Subscription;
  pageType: string;
  taxForm: FormGroup;
  files: UploadFile[] = [];
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  baseURL = GLOBAL.USER_IMAGE_API;
  // nodes = [
  //   {
  //     id: 1,
  //     name: 'cat 1',
  //     children: [
  //       { id: 2, name: 'cat 1-1' },
  //       { id: 3, name: 'cat 1-2' }
  //     ]
  //   },
  //   {
  //     id: 4,
  //     name: 'cat 2',
  //     children: [
  //       { id: 5, name: 'cat 2-1' },
  //       {
  //         id: 6,
  //         name: 'cat 2-2',
  //         children: [
  //           { id: 7, name: 'cat 2-2-1' }
  //         ]
  //       }
  //     ]
  //   }
  // ];
  taxes = {};
  base64textString: string;

  constructor(
    private taxService: TaxService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private location: Location,
    private snotifyService: SnotifyService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    // Subscribe to update product on changes
    this.onTaxChanged = this.taxService.onTaxChanged.subscribe(tax => {
      if (this.tax) {
        this.tax = new Tax(tax);
        this.pageType = 'edit';
      } else {
        this.pageType = 'new';
        this.tax = new Tax();
      }

      // this.taxForm = this.createBrandForm();
    });
  }

  // createBrandForm() {
  //   return this.formBuilder.group({
  //     id: [this.brand.id],
  //     name: [this.brand.name],
  //     notes: [this.brand.notes],
  //     images: [this.brand.images]
  //   });
  // }

  saveTax(form) {
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning('Please Fill All Required Fields');
      return;
    }
    this.taxService.saveTax(this.tax).then(() => {
      // Trigger the subscription with new data
      this.taxService.onTaxChanged.next(this.tax);

      // Show the success message
    });
  }

  deleteTax() {
    // {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        const data = this.taxForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);
        this.taxService.deleteTax(data).then(() => {
          this.taxService.onTaxChanged.next(data);
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
  addTax(form) {

    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning('Please Fill All Required Fields');
      return;
    }
    this.taxService.addTax(this.tax).then(() => {
      this.taxService.onTaxChanged.next(this.tax);
      // Show the success message
      // this.snackBar.open('Brand added', 'OK', {
      //   verticalPosition: 'top',
      //   duration: 2000
    });

    // Change the location with new one
    // this.location.go('/brands');
  }

  checkLength() {
    if (this.tax.value >='100') {
      $('#length').html('Not Greater than 99.9');
      return false;
    } else {
      $('#length').html('');
      return true;
    }
  }

  dropped(event: UploadEvent) {
    this.files = event.files;
    for (const droppedFile of event.files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          /**
           // You could upload it like this:
           const formData = new FormData()
           formData.append('logo', file, relativePath)

           // Headers
           const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })

           this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
           .subscribe(data => {
            // Sanitized logo returned from backend
          })
           **/
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  fileOver(event) {
    console.log(event);
  }

  fileLeave(event) {
    console.log(event);
  }

  // handleFileSelect(evt) {
  //   const files = evt.target.files;
  //   const file = files[0];
  //   if (files && file) {
  //     const reader = new FileReader();
  //     this.brand.content_type = '.' + file.type.split('/')[1];
  //     reader.onload = this._handleReaderLoaded.bind(this);

  //     reader.readAsBinaryString(file);
  //   }
  // }

  // _handleReaderLoaded(readerEvt) {
  //   const binaryString = readerEvt.target.result;
  //   this.base64textString = btoa(binaryString);
  //   // this.brand.image = this.base64textString;
  // }

  ngOnDestroy() {
    this.onTaxChanged.unsubscribe();
  }
}
