import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  Inject,
  ViewChild,
  TemplateRef
} from "@angular/core";
import { BrandService } from "./brand.service";
import { fuseAnimations } from "../../../core/animations";
import "rxjs/add/operator/startWith";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/observable/fromEvent";
import { Subscription } from "rxjs/Subscription";
import { Brand } from "../models/brand.model";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { FuseUtils } from "../../../core/fuseUtils";
import {
  MatSnackBar,
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef
} from "@angular/material";
import { Location } from "@angular/common";
import {
  FileSystemDirectoryEntry,
  FileSystemFileEntry,
  UploadEvent,
  UploadFile
} from "ngx-file-drop";
import { GLOBAL } from "../../../shared/globel";
import { SnotifyService } from "ng-snotify";
import { FuseConfirmDialogComponent } from "../../../core/components/confirm-dialog/confirm-dialog.component";
// import { $ } from 'protractor';
declare var $: any;

@Component({
  selector: "app-brand",
  templateUrl: "./brand.component.html",
  styleUrls: ["./brand.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BrandComponent implements OnInit, OnDestroy {
  @ViewChild("dialogContent")
  dialogContent: TemplateRef<any>;

  brand = new Brand();
  onBrandChanged: Subscription;
  pageType: string;
  brandForm: FormGroup;
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
  options = {};
  base64textString: string;

  constructor(
    private brandService: BrandService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private location: Location,
    private snotifyService: SnotifyService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // Subscribe to update product on changes
    this.onBrandChanged = this.brandService.onBrandChanged.subscribe(brand => {
      if (brand) {
        this.brand = new Brand(brand);
        this.pageType = "edit";
      } else {
        this.pageType = "new";
        this.brand = new Brand();
      }

      this.brandForm = this.createBrandForm();
    });
  }

  createBrandForm() {
    return this.formBuilder.group({
      id: [this.brand.id],
      name: [this.brand.name],
      notes: [this.brand.notes],
      images: [this.brand.images]
    });
  }

  saveBrand() {
    const data = this.brandForm.getRawValue();
    data.handle = FuseUtils.handleize(data.name);
    this.brandService.saveBrand(data).then(() => {
      // Trigger the subscription with new data
      this.brandService.onBrandChanged.next(data);

      // Show the success message
    });
  }

  deleteBrand() {
    // {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        const data = this.brandForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);
        this.brandService.deleteBrand(data).then(() => {
          this.brandService.onBrandChanged.next(data);
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
  addBrand(form) {
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning("Please Fill All Required Fields");
      return;
    }
    // const data = this.brandForm.getRawValue();
    // data.handle = FuseUtils.handleize(data.name);
    this.brandService.addBrand(this.brand).then(() => {
      // Trigger the subscription with new data
      this.brandService.onBrandChanged.next(this.brand);
      // Show the success message
      // this.snackBar.open('Brand added', 'OK', {
      //   verticalPosition: 'top',
      //   duration: 2000
    });

    // Change the location with new one
    // this.location.go('/brands');
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

  handleFileSelect(evt) {
    const files = evt.target.files;
    const file = files[0];
    if (files && file) {
      const reader = new FileReader();
      this.brand.content_type = "." + file.type.split("/")[1];
      reader.onload = this._handleReaderLoaded.bind(this);

      reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.brand.image = this.base64textString;
  }

  ngOnDestroy() {
    this.onBrandChanged.unsubscribe();
  }
}
