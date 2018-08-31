import { FuseUtils } from "../../../core/fuseUtils";
import { MatChipInputEvent } from "@angular/material";

export class Option {
  id: string;
  option_name = "";
}
export class Product {
  id: string;
  name: string;
  short_description: string;
  long_description: string;
  category_id: number = 1;
  tax_id: number;
  brand_id: number;
  suppliers: Array<Supplier>;

  constructor(product?) {
    product = product || {};
    this.id = product.id || -1;
    this.name = product.name || "";
    this.suppliers = new Array<Supplier>();
  }
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
  productVariants: Array<ProductVariant>;

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
    this.productVariants = new Array<ProductVariant>();
  }
}
export class ProductVariant {
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
  options: Array<Options>;

  constructor(productVariant?) {
    productVariant = productVariant || {};
    this.price = productVariant.price;
    this.ean = productVariant.ean;
    this.sku = productVariant.sku;
    this.upc = productVariant.upc;
    this.weight = productVariant.weight;
    this.width = productVariant.width;
    this.height = productVariant.height;
    this.depth = productVariant.depth;
    this.options = new Array<Options>();
  }
}

export class Options {
  option_id: number;
  option_set_id: number;
  option_rule_id: number;
  constructor(optionValue?) {
    optionValue = optionValue || {};
    this.option_set_id = optionValue.option_set_id || -1;
    this.option_id = optionValue.option_id || -1;
    this.option_rule_id = optionValue.option_rule_id || -1;
  }
}

export class OptionSet {
  id: number;
  optionValue: OptionValue;
  constructor(optionSet?) {
    optionSet = optionSet || {};
    this.id = optionSet.id;
    this.optionValue = new OptionValue(optionSet.optionValue);
  }
}
export class OptionValue {
  id: number;
  option_set_id: number;
  constructor(optionValue?) {
    optionValue = optionValue || {};
    this.option_set_id = optionValue.option_set_id || -1;
    this.id = optionValue.id || -1;
  }
}

/*

declare module namespace {

    export interface Option {
        option_set_id: number;
        option_id: number;
        option_rule_id: number;
    }

    export interface ProductVariant {
        ean: number;
        sku: number;
        upc: number;
        weight: number;
        width: number;
        height: number;
        depth: number;
        image: string;
        content_type: string;
        options: Option[];
    }

    export interface Supplier {
        id: string;
        price: number;
        ean: number;
        sku: number;
        upc: number;
        weight: number;
        width: number;
        height: number;
        depth: number;
        image: string;
        content_type: string;
        productVariants: ProductVariant[];
    }

    export interface RootObject {
        name: string;
        short_description: string;
        long_description: string;
        brand_id: number;
        category_id: string;
        tax_id: string;
        suppliers: Supplier[];
    }

} */
