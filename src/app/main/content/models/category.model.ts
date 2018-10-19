import { Image } from "./product.model";

export class Category {
  id = -1;
  name = "";
  value = "";
  parent_id: number;
  notes = "";
  handle: string;
  image: Image;
  children: Array<Category> = new Array<Category>();

  constructor(category?) {
    category = category || {};
    this.id = category.id || -1;
    this.name = category.name || "";
    this.value = category.name || "";
    this.parent_id = category.parent_id || -1;
    this.handle = category.handle || "";
    this.image = category.image || new Image();
  }
}
