import { Contact } from "./contact.model";
import { Product } from "./product.model";

export class Supplier {
  id: number;
  name: string;
  type = "";
  contact: Contact;
  products: Product[];
  handle: string;

  constructor(supplier?) {
    supplier = supplier || {};
    this.id = supplier.id || -1;
    this.name = supplier.name || "";
    this.type = supplier.type || "";
    this.contact = supplier.contact || {};
    this.products = supplier.products || [];
    this.handle = supplier.handle || "";
  }
}
