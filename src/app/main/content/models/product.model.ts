export class Product {
  id: number;
  name: string;
  short_description: string;
  long_description: string;
  category_id: number;
  active: boolean;
  tax_id: number;
  brand_id: number;
  supplier: Supplier;
  tags: number[];
  product_images: Image[];
  category: Category;
  constructor(product?) {
    product = product || {};
    this.id = product.id || -1;
    this.name = product.name || "";
    this.short_description = product.short_description || "";
    this.long_description = product.long_description || "";
    this.category_id = product.category_id || -1;
    this.active = product.active || false;
    this.tax_id = product.tax_id || -1;
    this.brand_id = product.brand_id || null;
    this.supplier = product.supplier || new Supplier();
    this.tags = product.tags || [];
    this.product_images = product.product_images || new Array<Image>();
    this.category = product.category || new Category();
  }
}
export class Category {
  id: number;
  name: string;
  constructor(cateegory?) {
    cateegory = cateegory || {};
    this.id = cateegory.id || -1;
    this.name = cateegory.name || "";
  }
}
export class Supplier {
  id: number;
  name: string;
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
  bulk_prices: BluckPrice[];
  track_stock: boolean;
  printing_option: boolean;
  sides: any;
  stock: number;
  low_level_stock: number;
  class: Array<any>;
  product_supplier_attributes: ProductSupplierAttribute[];
  product_variants: ProductVariant;
  code: string | number;

  constructor(supplier?) {
    supplier = supplier || {};
    this.id = supplier.id;
    this.name = supplier.name;
    this.price = supplier.price;
    this.buying_price = supplier.buying_price;
    this.market_price = supplier.market_price;
    this.weight = supplier.weight;
    this.width = supplier.width;
    this.upc = supplier.upc;
    this.ean = supplier.upc;
    this.sku = supplier.sku || "";
    this.height = supplier.height || "";
    this.depth = supplier.depth || "";
    this.images = new Array<Image>();
    this.bulk_prices = new Array<BluckPrice>();
    this.track_stock = supplier.ttrack_stock || false;
    this.printing_option = supplier.printing_option || false;
    this.sides = supplier.sides || []
    this.low_level_stock = supplier.low_level_stock || 0;
    this.stock = supplier.stock || 0;
    this.class = supplier.class || new Array();
    this.product_supplier_attributes = new Array<ProductSupplierAttribute>();
    this.product_variants = supplier.product_variants || new ProductVariant();
    this.code = supplier.code || '';
  }
}
export class BluckPrice {
  id: number;
  from: number;
  to: number;
  discount: number;
  changed_by: number | string;
  constructor(bluckPrice?) {
    bluckPrice = bluckPrice || {};
    this.from = bluckPrice.from;
    this.to = bluckPrice.to;
    this.discount = bluckPrice.discount;
    this.changed_by = bluckPrice.changed_by || 1;
  }
}
export class Image {
  content_type: string;
  base64String: string;
  type: string;
  id: number;
  constructor(image?) {
    image = image || {};
    this.content_type = image.content_type || "";
    this.base64String = image.base64String || "";
    this.type = image.type || "";
    this.id = image.id || -1;
  }
}

export class Variant {
  id: number;
  price: number;
  ean: string;
  sku: string;
  upc: string;
  weight: number;
  width: number;
  height: number;
  depth: number;
  images: Array<Image>;
  content_type: string;
  operation: number | string;
  changed_by: number | string;
  amount: number;
  track_stock: boolean;
  stock: number;
  low_level_stock: number;
  product_variant_attributes: Array<ProductVariantAttributes>;
  constructor(variant?) {
    variant = variant || {};
    this.id = variant.id;
    this.price = variant.price;
    this.ean = variant.ean;
    this.sku = variant.sku;
    this.upc = variant.upc;
    this.weight = variant.weight;
    this.width = variant.width;
    this.height = variant.height;
    this.depth = variant.depth;
    this.low_level_stock = variant.low_level_stock || 0;
    this.stock = variant.stock || 0;
    this.operation = variant.operation || null;
    this.changed_by = variant.changed_by || null;
    this.amount = variant.amount || null;
    this.track_stock = variant.ttrack_stock || false;
    this.product_variant_attributes =
      variant.product_variant_attributes ||
      new Array<ProductVariantAttributes>();
    this.images = variant.images || new Array<Image>();
  }
}
export class ProductVariant {
  supplier_id: number;
  variants: Variant[];
  constructor(productVariant?) {
    productVariant = productVariant || {};
    this.supplier_id = productVariant.supplier_id || -1;
    this.variants = productVariant.variants || new Array<Variant>();
  }
}
export class ProductVariantAttributes {
  option_id: number;
  option_set_id: number;
  constructor(optionValue?) {
    optionValue = optionValue || {};
    this.option_set_id = optionValue.option_set_id || -1;
    this.option_id = optionValue.option_id || -1;
  }
}
export class ProductSupplierAttribute {
  id: number;
  amount: number;
  operation: number;
  changed_by: number;
  option_id: number;
  option_set_id: number;
  constructor(productSupplierAttribute?) {
    productSupplierAttribute = productSupplierAttribute || {};
    this.id = productSupplierAttribute.id || -1;
    this.amount = productSupplierAttribute.amount || 0;
    this.operation = productSupplierAttribute.operation || 1;
    this.changed_by = productSupplierAttribute.changed_by || 1;
    this.option_id = productSupplierAttribute.option_id || -1;
    this.option_set_id = productSupplierAttribute.option_set_id || -1;
  }
}
