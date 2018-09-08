import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  Inject,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { TagService } from './tag.service';
import { fuseAnimations } from '../../../core/animations';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { Tag } from '../models/tag.model';
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
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TagComponent implements OnInit, OnDestroy {
  @ViewChild('dialogContent')
  dialogContent: TemplateRef<any>;

  tag = new Tag();
  onTagChanged: Subscription;
  pageType: string;
  tagForm: FormGroup;
  files: UploadFile[] = [];
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  baseURL = GLOBAL.USER_IMAGE_API;
  options = {};
  base64textString: string;

  constructor(
    private tagService: TagService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private location: Location,
    private snotifyService: SnotifyService,
    private dialog: MatDialog,
    private spinnerService: SpinnerService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to update product on changes
    this.onTagChanged = this.tagService.onTagChanged.subscribe(tag => {
      if (tag) {
        this.tag = new Tag(tag);
        this.pageType = 'edit';
      } else {
        this.pageType = 'new';
        this.tag = new Tag();
      }

      // this.brandForm = this.createBrandForm();
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

  saveTag(form) {
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning('Please Fill All Required Fields');
      return;
    }
    this.tagService.saveTag(this.tag).then(() => {
      // Trigger the subscription with new data
      this.tagService.onTagChanged.next(this.tag);

      // Show the success message
    });
  }

  deleteTag() {
    // {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        const data = this.tagForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);
        this.tagService.deleteTag(data).then(() => {
          this.tagService.onTagChanged.next(data);
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

  addTag(form) {
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning('Please Fill All Fields');
      return;
    }
    this.spinnerService.requestInProcess(true);

    this.tagService.addTag(this.tag).subscribe(
      (res: any) => {
        this.snotifyService.success(res.res.message, 'Success !');
        this.spinnerService.requestInProcess(false);
        this.tag = new Tag();
        this.router.navigate(['/tags']);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.error);
        this.snotifyService.error(e, 'Error !');
      }
    );
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
    this.onTagChanged.unsubscribe();
  }
}
