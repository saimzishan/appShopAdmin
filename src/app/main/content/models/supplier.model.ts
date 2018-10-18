import { Contact } from "./contact.model";
import { Product, Image } from "./product.model";

export class Supplier {
  id: number;
  name: string;
  type: number;
  contact: Contact;
  products: Product[];
  handle: string;
  image: Image;

  constructor(supplier?) {
    supplier = supplier || {};
    this.id = supplier.id || -1;
    this.name = supplier.name || "";
    this.type = supplier.type || "";
    this.contact = supplier.contact || {};
    this.products = supplier.products || [];
    this.handle = supplier.handle || "";
    this.image = supplier.image || new Image();
  }
}
