import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  Inject,
  ViewChild,
  TemplateRef
} from "@angular/core";
import { SliderService } from "./slider.service";
import { fuseAnimations } from "../../../core/animations";
import { Subscription } from "rxjs/Subscription";
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
import { Slider } from "../models/slider.model";
declare var $: any;

@Component({
  selector: "app-slider",
  templateUrl: "./slider.component.html",
  styleUrls: ["./slider.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SliderComponent implements OnInit {
  @ViewChild("dialogContent")
  dialogContent: TemplateRef<any>;
  @ViewChild(DropzoneDirective)
  directiveRef: DropzoneDirective;
  slider: Slider;
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
  sliderID: any;
  hasImage = false;

  constructor(
    private sliderService: SliderService,
    private snotifyService: SnotifyService,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.slider = new Slider();
    this.image = new Image();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.sliderID = params["id"] || "";
      if (Boolean(this.sliderID) && parseInt(this.sliderID, 10) > 0) {
        this.pageType = "edit";
      } else {
        this.slider = new Slider();
        this.hasImage = false;
        this.pageType = "new";
      }
    });
  }

  addSlider(form) {
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
    this.slider.image = this.image;
    this.spinnerService.requestInProcess(true);
    this.sliderService.addSliderImage(this.slider).subscribe((res: any) => {
      let e = res.res.message;
      this.snotifyService.success(e, 'Success !');
      this.spinnerService.requestInProcess(false);
      this.router.navigate(['/sliders']);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.error.message;
      this.snotifyService.error(e, 'Error !');
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
    this.image.base64String = image.dataURL.split(",")[1];
    this.image.content_type = image.type.split("/")[1];
    this.image.content_type = "." + this.image.content_type.split(";")[0];
    this.image.type = "small";
  }

  onUploadError(event: any) { }
  onUploadSuccess(event: any) { }

  imageView(original_image) {
    if (original_image) {
      let spliting = original_image;
      if (
        original_image !== undefined &&
        original_image !== null &&
        original_image !== ""
      ) {
        spliting = spliting.split("/");
        if (spliting[0] === "") {
          return this.baseURL + original_image;
        } else {
          return original_image;
        }
      }
    }
  }
}
