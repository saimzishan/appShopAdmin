import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material";
import { DropzoneDirective } from "ngx-dropzone-wrapper";
import { SnotifyService } from "ng-snotify";

import { fuseAnimations } from "../../../../core/animations";
import { GLOBAL } from "../../../../shared/globel";
import { BulkProduct } from "../../models/bulkproduct.model";
import { SpinnerService } from "../../../../spinner/spinner.service";
import { BulkProductService } from "./bulkproduct.service";

declare var $: any;

@Component({
  selector: "app-bulk-product",
  templateUrl: "./bulkproduct.component.html",
  styleUrls: ["./bulkproduct.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BulkProductComponent implements OnInit {
  config = GLOBAL.DEFAULT_DROPZONE_CONFIG_FOR_BULK_PRODUCT;
  @ViewChild(DropzoneDirective)
  directiveRef: DropzoneDirective;

  bulkProduct: BulkProduct;
  constructor(
    private bulkProductService: BulkProductService,
    private snotifyService: SnotifyService,
    private spinnerService: SpinnerService,
    private router: Router
  ) {
    this.bulkProduct = new BulkProduct();
  }

  ngOnInit() {}

  uploadFile() {
    const a = this.directiveRef.dropzone();
    if (a.files.length > 0) {
      for (const iterator of a.files) {
        this.addPicture(iterator);
      }
    } else {
      this.snotifyService.warning("Please Upload File");
      return;
    }
  }

  addPicture(obj) {
    if (obj) {
      let reader: FileReader = new FileReader();
      this.bulkProduct.content_type = "." + obj.type.split("/")[1];
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(obj);
    }
  }

  store() {
    if (this.bulkProduct.delimiter === "1") {
      this.bulkProduct.delimiter = ",";
    }
    this.spinnerService.requestInProcess(true);
    this.bulkProductService.store(this.bulkProduct).subscribe(
      (res: any) => {
        this.snotifyService.success(res.res.message);
        this.spinnerService.requestInProcess(false);
        this.router.navigate(["/products"]);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.message);
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.bulkProduct.base64string = btoa(binaryString);
    this.store();
  }

  onUploadError(event: any) {}
  onUploadSuccess(event: any) {}
}
