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
import { ActivatedRoute } from "@angular/router";
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

  options = {};
  base64textString: string;
  sub: any;

  constructor(
    private brandService: BrandService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private location: Location,
    private snotifyService: SnotifyService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Subscribe to update product on changes
    this.sub = this.route.params.subscribe(params => {
      if (params) {
        if (params.id === "new") {
          this.pageType = "new";
        } else {
          this.pageType = "edit";
        }
      }
    });
    console.log(this.pageType);
  }

  createBrandForm() {
    return this.formBuilder.group({
      id: [this.brand.id],
      name: [this.brand.name],
      notes: [this.brand.notes],
      images: [this.brand.images]
    });
  }

  saveBrand(form) {
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning("Please Fill All Required Fields");
      return;
    }
    if (this.brand.content_type) {
      let preImageName: any;
      if (this.brand.image) {
        preImageName = this.brand.image;
        preImageName = preImageName.small.split("/");
        this.brand.image_name = preImageName[3];
      } else {
        let date = new Date(null);
        date.setSeconds(45); // specify value for SECONDS here
        let timeString = date.toISOString().substr(11, 8);
        this.brand.image_name = timeString + this.brand.content_type;
      }
      this.brand.image = this.base64textString;
    } else {
      delete this.brand.image;
    }
    this.brandService.saveBrand(this.brand).then(() => {
      // Trigger the subscription with new data
      this.brandService.onBrandChanged.next(this.brand);

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
    if (this.base64textString) {
      this.brand.image = this.base64textString;
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
    // this.brand.image = this.base64textString;
  }

  ngOnDestroy() {}
}
