import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Component , OnInit, ViewEncapsulation , ViewChild} from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material";
import { DropzoneDirective } from "ngx-dropzone-wrapper";

import { fuseAnimations } from "../../../../core/animations";
import { GLOBAL } from "../../../../shared/globel";


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

  constructor() {}

  ngOnInit() {}

  onUploadError(event: any) { }
  onUploadSuccess(event: any) { }
}
