import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { SupplierService } from "./supplier.service";
import { fuseAnimations } from "../../../core/animations";
import { Supplier } from "../models/supplier.model";
import { FormGroup, FormControl } from "@angular/forms";
import { MatSnackBar, MatDialog, MatDialogRef } from "@angular/material";
import { FuseConfirmDialogComponent } from "../../../core/components/confirm-dialog/confirm-dialog.component";
import { Contact } from "../models/contact.model";
import { SnotifyService } from "ng-snotify";
import { SpinnerService } from "./../../../spinner/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { GLOBAL } from "../../../shared/globel";
import { DropzoneDirective } from "ngx-dropzone-wrapper";
import { Image } from "../models/product.model";

@Component({
  selector: "app-supplier",
  templateUrl: "./supplier.component.html",
  styleUrls: ["./supplier.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SupplierComponent implements OnInit, OnDestroy {
  config = GLOBAL.DEFAULT_DROPZONE_CONFIG;
  supplier = new Supplier();
  supplier_contact = new Contact();
  supplierForm: FormGroup;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  base64textString;
  baseURL = GLOBAL.USER_IMAGE_API;
  images: Image[];
  lImages: any;
  image: Image;

  @ViewChild(DropzoneDirective)
  directiveRef: DropzoneDirective;
  sub: any;
  supplierID: any;
  hasImage = false;
  pageType: string;
  stateJSON: any;

  constructor(
    private supplierService: SupplierService,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private snotifyService: SnotifyService,
    private spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.images = new Array<Image>();
    this.image = new Image();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.supplierID = params['id'] || '';
      if (Boolean(this.supplierID) && parseInt(this.supplierID, 10) > 0) {
        this.getSupplierById(this.supplierID);
        this.pageType = 'edit';
      } else {
        this.supplier = new Supplier();
        this.hasImage = false;
        this.pageType = 'new';
      }
    });
  }

  getSupplierById(id: number) {
    this.spinnerService.requestInProcess(true);
    this.sub = this.supplierService.getSupplierById(id).subscribe((res: any) => {
      this.supplier = new Supplier(res.res.data);
      this.hasImage = this.supplier.image.id === -1 ? false : true;
      this.spinnerService.requestInProcess(false);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  addSupplier(form) {
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning("Please Fill All Fields");
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
    this.supplier.image = this.image;
    this.supplierService.addSupplier(this.supplier).subscribe(
      (res: any) => {
        this.snotifyService.success(res.res.message, "Success !");
        this.spinnerService.requestInProcess(false);
        this.supplier = new Supplier();
        this.supplier.contact = new Contact();
        this.router.navigate(["/suppliers"]);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error.message;
        e = JSON.stringify(e.error);
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  editSupplier(form) {
    let tempImage: Image;
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning("Please Fill All Fields");
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
      this.supplier.image = this.image;
    } else {
      tempImage = new Image(this.supplier.image);
      delete this.supplier.image;
    }
    this.supplierService.editSupplier(this.supplier).subscribe((res: any) => {
      let e = res.res.message;
      this.snotifyService.success(e, 'Success !');
      this.spinnerService.requestInProcess(false);
      this.router.navigate(['/suppliers']);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.error.message;
      this.snotifyService.error(e, 'Error !');
    });
    this.supplier.image = tempImage;
  }

  deleteSupplier() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeSupplier();
      }
      this.confirmDialogRef = null;
    });
  }

  removeSupplier() {
    this.spinnerService.requestInProcess(true);
    this.sub = this.supplierService.deleteSupplier(this.supplier.id).subscribe((res: any) => {
      let e = res.res.message;
      this.snotifyService.success(e, 'Success !');
      this.spinnerService.requestInProcess(false);
      this.router.navigate(['/suppliers']);
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
        this.supplierService
          .deleteSupplierImage(+this.supplier.id, image_id).subscribe(
            res => {
              this.spinnerService.requestInProcess(false);
              if (!res.error) {
                this.snotifyService.success("Deleted successfully !", "Success");
                this.supplier.image = new Image();
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

  getStatesOfGermany() {
    this.supplierService.getGermanyJson().subscribe(
      (res: any) => {
        this.stateJSON = res;
        setTimeout(() => { }, 500);
      },
      errors => {
        const e = errors.json();
      }
    );
  }

  getStatesOfCanada() {
    this.supplierService.getCanadaJson().subscribe(
      (res: any) => {
        this.stateJSON = res;
        setTimeout(() => { }, 500);
      },
      errors => {
        const e = errors.json();
      }
    );
  }

  countrySelected(country) {
    if (country === "Germany") {
      this.getStatesOfGermany();
    } else {
      this.getStatesOfCanada();
    }
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

  onUploadError(evt) { }
  onUploadSuccess(evt) { }
  onCanceled(event) { }

  imageView(original_image) {
    let spliting = original_image;
    spliting = spliting.split('/');
    if (spliting[0] === '') {
      return this.baseURL + original_image;
    } else {
      return original_image;
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
