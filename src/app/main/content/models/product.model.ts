import { FuseUtils } from "../../../core/fuseUtils";
import { MatChipInputEvent } from "@angular/material";

export class supplier_id {
  id: string;
  price: string;
  ean: string;
  sku: string;
  upc: string;
  weight: string;
  width: string;
  height: string;
  depth: string;
  image: string;
  content_type: string;
  constructor(supplier_id?) {
    supplier_id = supplier_id || {};
    this.id = supplier_id.id || "";
    this.price = supplier_id.price || "";
    this.ean = supplier_id.ean || "";
    this.sku = supplier_id.sku || "";
    this.height = supplier_id.height || "";
    this.depth = supplier_id.depth || "";
    this.image = supplier_id.image || "";
    this.content_type = supplier_id.content_type || "";
  }
}

export class Product {
  id: string;
  name: string;
  handle: string;
  short_description: string;
  long_description: string;
  categories: string[];
  category_id: string;
  tax_id: string;
  brand_id: string;
  supplier_ids: supplier_id;

  constructor(product?) {
    product = product || {};
    this.id = product.id || FuseUtils.generateGUID();
    this.name = product.name || "";
    this.handle = product.handle || FuseUtils.handleize(this.name);
    this.supplier_ids = new supplier_id();
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
