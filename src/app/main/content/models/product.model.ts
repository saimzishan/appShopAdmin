import { FuseUtils } from "../../../core/fuseUtils";
import { MatChipInputEvent } from "@angular/material";

export class Option {
  id: string;
  option_name = "";
}
export class Supplier {
  id: number;
  price: number;
  ean: string;
  sku: string;
  upc: string;
  weight: number;
  width: number;
  height: number;
  depth: number;
  image: string;
  content_type: string;
  constructor(supplier?) {
    supplier = supplier || {};
    this.id = supplier.id || -1;
    this.price = supplier.price || 0;
    this.weight = supplier.weight || 0;
    this.width = supplier.width || 0;
    this.upc = supplier.upc || 0;
    this.ean = supplier.ean || "";
    this.sku = supplier.sku || "";
    this.height = supplier.height || -1;
    this.depth = supplier.depth || -1;
    this.image = supplier.image || "";
    this.content_type = supplier.content_type || "";
  }
}
export class Product {
  id: string;
  name: string;
  handle: string;
  short_description: string;
  long_description: string;
  categories: string[];
  category_id: number = 1;
  tax_id: number;
  brand_id: number;
  suppliers: Array<Supplier>;
  option_set: Option[];

  constructor(product?) {
    product = product || {};
    this.id = product.id || FuseUtils.generateGUID();
    this.name = product.name || "";
    this.handle = product.handle || FuseUtils.handleize(this.name);
    // this.suppliers = new Supplier();
  }

  addCategory(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add category
    if (value) {
      this.categories.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  removeCategory(category) {
    const index = this.categories.indexOf(category);

    if (index >= 0) {
      this.categories.splice(index, 1);
    }
  }

  // addTag(event: MatChipInputEvent): void
  // {
  //     const input = event.input;
  //     const value = event.value;

  //     // Add tag
  //     if ( value )
  //     {
  //         this.tags.push(value);
  //     }

  //     // Reset the input value
  //     if ( input )
  //     {
  //         input.value = '';
  //     }
  // }

  // removeTag(tag)
  // {
  //     const index = this.tags.indexOf(tag);

  //     if ( index >= 0 )
  //     {
  //         this.tags.splice(index, 1);
  //     }
  // }
}
