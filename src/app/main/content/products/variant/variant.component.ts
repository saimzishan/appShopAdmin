import { Option } from "./../../models/product.model";
import { DetectChangesService } from "./../../../../shared/detect-changes.services";
import { Component, OnInit, Input } from "@angular/core";
import { ProductService } from "../product.service";
import { SpinnerService } from "../../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";
import { ProductVariant, Image } from "../../models/product.model";
import { NgForm, FormGroup, FormControl } from "@angular/forms";
import * as _ from "lodash";
import {
  FileSystemDirectoryEntry,
  FileSystemFileEntry,
  UploadEvent,
  UploadFile
} from "ngx-file-drop";

@Component({
  selector: "app-variant-form",
  templateUrl: "./variant.component.html"
})
export class VariantComponent implements OnInit {
  option_set_id = [];
  optionSets: any;
  optionSetWithValue: {};
  @Input()
  product_id;
  @Input()
  supplier_id;
  @Input()
  option_with_value: OptionSet[] = new Array<OptionSet>();
  product_variant: ProductVariant;
  isAddorEditSKU = false;
  productVariant: ProductVariant[] = new Array<ProductVariant>();
  variants: ProductVariant[] = new Array<ProductVariant>();
  changesSubscription;
  option_skus;
  enableOptions = false;
  obj = [];
  supplierId = -1;
  productId = -1;
  files: UploadFile[] = [];
  images: Image[];
  image: Image;

  constructor(
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    private detectChangesService: DetectChangesService
  ) {
    this.images = new Array<Image>();
    this.image = new Image();
    this.product_variant = new ProductVariant();
    this.changesSubscription = this.detectChangesService.notifyObservable$.subscribe(
      res => {
        this.callRelatedFunctions(res);
      }
    );
  }

  ngOnInit() {
    let optionSet: any = localStorage.getItem("optionSet");
    if (optionSet) {
      optionSet = JSON.parse(optionSet);
      this.setOptions(optionSet);
    }

    let current_product: any = localStorage.getItem("current_product");
    if (current_product) {
      current_product = JSON.parse(current_product);
      this.product_variant = current_product.supplier;
      this.supplierId = current_product.supplier.id;
      this.productId = current_product.id;
    }
  }
  callRelatedFunctions(res) {
    if (res.hasOwnProperty("option")) {
      switch (res.option) {
        case "optionsAdded":
          let optionSet: any = localStorage.getItem("optionSet");
          if (optionSet) {
            optionSet = JSON.parse(optionSet);
            this.setOptions(optionSet);
          }
          break;
      }
    }
  }

  setOptions(obj) {
    this.option_with_value = obj;
  }
  getOption(id) {
    const res = this.option_with_value.find(
      option => option.option_set_id === id
    );
    if (res) {
      return res.options;
    }
  }

  addOrEditSku() {
    this.isAddorEditSKU = !this.isAddorEditSKU;
  }

  seletOption(id) {
    this.option_skus = this.getOption(id);
    this.enableOptions = true;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      // this.supplier.upc.
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  addOptionSet(id, p_id) {
    let index: any = this.obj
      .map(function(obj, index) {
        if (obj.option_set_id === p_id) {
          return index;
        }
      })
      .filter(isFinite);

    if (index.length > 0) {
      this.obj.splice(index[0], 1);
    }
    let obj = { option_id: id, option_set_id: p_id };
    this.obj.push(obj);
  }
  mangeOption(form: NgForm) {
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning("Please Fill All Required Fields");
      return;
    }

    if (this.obj.length === 0) {
      this.snotifyService.warning("Please select option", "Warning !");
      return;
    }
    if (this.images.length < 2) {
      this.snotifyService.warning(
        "Please Upload three images (small, medium, large)",
        "Warning"
      );
      return;
    }

    this.variants.push(new ProductVariant(this.product_variant));
    this.variants[this.variants.length - 1].options = this.obj;
    this.variants[this.variants.length - 1].images = this.images;
    this.images = new Array<Image>();
    this.product_variant.sku = "";
    this.obj = [];
  }
  saveProduct() {
    if (this.variants.length === 0) {
      this.snotifyService.warning("Please add option", "Warning !");
      return;
    }

    let objct;
    this.productVariant = this.variants;
    // this.productVariant[0].options = this.obj;
    objct = {
      supplier_id: this.supplierId,
      id: this.productId,
      variants: this.productVariant
    };
    this.spinnerService.requestInProcess(true);
    this.spinnerService.requestInProcess(true);

    this.productService.saveProduct(objct, "ps_variants").subscribe(
      (res: any) => {
        this.snotifyService.success(res.res.message, "Success !");
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.message);
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  dropped(event: UploadEvent, type: string) {
    this.spinnerService.requestInProcess(true);
    this.files = event.files;
    for (const droppedFile of event.files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can access the real file
          this.image.content_type = "." + file.type.split("/")[1];
          this.image.type = type;
          const reader = new FileReader();
          reader.onload = this._handleReaderLoaded.bind(this);

          reader.readAsBinaryString(file);
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
      }
    }
  }

  _handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.image.base64String = btoa(binaryString);
    let index = this.images.findIndex(image => image.type === this.image.type);
    if (index !== -1) {
      this.images[index].base64String = this.image.base64String;
      this.images[index].type = this.image.type;
      this.images[index].content_type = this.image.content_type;
    } else {
      this.images.push(new Image(this.image));
    }
    this.image = new Image();
    this.spinnerService.requestInProcess(false);
  }
}
export class Options {
  name: string;
  operation: number;
  changed_by: number;
  amount: number;
  constructor(option?) {
    option = option || {};
    this.name = option.name;
    this.operation = option.operation;
    this.changed_by = option.changed_by;
    this.amount = option.amount;
  }
}

export class OptionSet {
  id: number;
  supplier_id: number;
  option_set_id: number;
  name: string;
  options: Options[];
  constructor(optionSet?) {
    optionSet = optionSet || {};
    this.id = optionSet.id;
    this.option_set_id = optionSet.option_set_id;
    this.name = optionSet.name;
    this.options = new Array<Options>();
  }
}
