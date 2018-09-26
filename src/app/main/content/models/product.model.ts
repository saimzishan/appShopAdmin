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
  supplier: Supplier;

  constructor(product?) {
    product = product || {};
    this.id = product.id || -1;
    this.name = product.name || "";
    this.supplier = new Supplier();
  }
}
export class Supplier {
  id: number;
  price: number;
  buying_price: number;
  market_price: number;
  ean: string;
  sku: string;
  upc: string;
  weight: number;
  width: number;
  height: number;
  depth: number;
  images: Image[];
  track_stock: boolean;
  printing_option: boolean;
  stock: number;
  low_level_stock: number;
  content_type: string;

  constructor(supplier?) {
    supplier = supplier || {};
    this.id = supplier.id;
    this.price = supplier.price;
    this.buying_price = supplier.buying_price;
    this.market_price = supplier.market_price;
    this.weight = supplier.weight;
    this.width = supplier.width;
    this.upc = supplier.upc;
    this.ean = supplier.ean;
    this.sku = supplier.sku || "";
    this.height = supplier.height || "";
    this.depth = supplier.depth || "";
    this.images = new Array<Image>();
    this.content_type = supplier.content_type || "";
    this.track_stock = supplier.ttrack_stock || false;
    this.printing_option = supplier.printing_option || false;
  }
}
export class Image {
  content_type: string;
  base64String: string;
  type: string;
  constructor(image?) {
    image = image || {};
    this.content_type = image.content_type || "";
    this.base64String = image.base64String || "";
    this.type = image.type || "";
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
  images: Array<any>;
  content_type: string;
  operation: number;
  changeBy: number;
  amount: number;

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
    this.operation = productVariant.operation || null;
    this.changeBy = productVariant.changeBy || null;
    this.amount = productVariant.amount || null;
    this.options = new Array<Options>();
    this.images = [];
  }
}

export class Options {
  option_id: number;
  option_set_id: number;
  // option_rule_id: number;
  constructor(optionValue?) {
    optionValue = optionValue || {};
    this.option_set_id = optionValue.option_set_id || -1;
    this.option_id = optionValue.option_id || -1;
    // this.option_rule_id = optionValue.option_rule_id || -1;
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
