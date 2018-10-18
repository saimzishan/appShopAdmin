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
import { Subscription } from "rxjs/Subscription";
import { Brand } from "../models/brand.model";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { DropzoneDirective } from "ngx-dropzone-wrapper";
import {
  FileSystemDirectoryEntry,
  FileSystemFileEntry,
  UploadEvent,
  UploadFile
} from "ngx-file-drop";
import { GLOBAL } from "../../../shared/globel";
import { SnotifyService } from "ng-snotify";
import { FuseConfirmDialogComponent } from "../../../core/components/confirm-dialog/confirm-dialog.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Image } from "../models/product.model";
import { SpinnerService } from "../../../spinner/spinner.service";
import { MatDialogRef, MatDialog } from "@angular/material";
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
  @ViewChild(DropzoneDirective)
  directiveRef: DropzoneDirective;
  brand: Brand;
  onBrandChanged: Subscription;
  pageType: string;
  brandForm: FormGroup;
  files: UploadFile[] = [];
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  baseURL = GLOBAL.USER_IMAGE_API;
  config = GLOBAL.DEFAULT_DROPZONE_CONFIG;

  options = {};
  base64textString: string;
  sub: any;
  lImages: any[] = [];
  image: Image;
  images: Image[];
  brandID: any;
  hasImage = false;

  constructor(
    private brandService: BrandService,
    private snotifyService: SnotifyService,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    public router: Router,
  ) {
    this.brand = new Brand();
    this.images = new Array<Image>();
    this.image = new Image();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.brandID = params['id'] || '';
      if (Boolean(this.brandID) && parseInt(this.brandID, 10) > 0) {
        this.getBrandById(this.brandID);
        this.pageType = 'edit';
      } else {
        this.brand = new Brand();
        this.hasImage = false;
        this.pageType = 'new';
      }
    });
  }

  ngOnDestroy(): void {
    return this.sub && this.sub.unsubscribe();
  }

  getBrandById(id: number) {
    this.spinnerService.requestInProcess(true);
    this.sub = this.brandService.getBrandById(id).subscribe((res: any) => {
      this.brand = new Brand(res.res.data);
      this.hasImage = this.brand.image.id === -1 ? false : true;
      this.spinnerService.requestInProcess(false);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  addBrand(form) {
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning("Please Fill All Required Fields");
      return;
    }
      let a = this.directiveRef.dropzone();
      if (a.files.length === 0) {
        this.snotifyService.warning("Please Upload image", "Warning !");
        return;
      }
      for (const iterator of a.files) {
        this.addPicture(iterator);
      }
    
    this.brand.image = this.image;
    this.spinnerService.requestInProcess(true);
    this.brandService.addBrand(this.brand).subscribe((res) => {
      let e = res.res.message;
      this.snotifyService.success(e, 'Success !');
      this.spinnerService.requestInProcess(false);
      this.router.navigate(['/brands']);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.error.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  editBrand(form) {
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning("Please Fill All Required Fields");
      return;
    }
    if (this.hasImage === false) {
      let a = this.directiveRef.dropzone();
      if (a.files.length === 0) {
        this.snotifyService.warning("Please Upload image", "Warning !");
        return;
      }
      for (const iterator of a.files) {
        this.addPicture(iterator);
      }
      this.brand.image = this.image;
    } else {
      delete this.brand.image;
    }
    this.brandService.updateBrand(this.brand).subscribe((res: any) => {
      let e = res.res.message;
      this.snotifyService.success(e, 'Success !');
      this.spinnerService.requestInProcess(false);
      this.router.navigate(['/brands']);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.error.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  deleteBrand() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeBrand();
      }
      this.confirmDialogRef = null;
    });
  }

  removeBrand() {
    this.spinnerService.requestInProcess(true);
    this.sub = this.brandService.deleteBrand(this.brand.id).subscribe((res: any) => {
      let e = res.res.message;
      this.snotifyService.success(e, 'Success !');
      this.spinnerService.requestInProcess(false);
      this.router.navigate(['/brands']);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.error.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  removeImage(image_id) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerService.requestInProcess(true);
        this.brandService
          .deleteBrandImage(+this.brand.id, image_id).subscribe(
            res => {
              this.spinnerService.requestInProcess(false);
              if (!res.error) {
                this.snotifyService.success("Deleted successfully !", "Success");
                this.brand.image = new Image();
                this.hasImage = false;
              }
            },
            errors => {
              this.spinnerService.requestInProcess(false);
              let e = JSON.stringify(errors.error.message);
              this.snotifyService.error(e, "Fail");
            }
          );
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

  addPicture(image) {
    this.image = new Image();
    this.image.base64String = image.dataURL.split(",")[1];
    this.image.content_type = image.type.split("/")[1];
    this.image.content_type = "." + this.image.content_type.split(";")[0];
    this.image.type = "small";
  }

  onUploadError(event: any) {}
  onUploadSuccess(event: any) {}
}
