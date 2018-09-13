export class Category {
  id = -1;
  name = "";
  value = "";
  parent_id: number;
  notes = "";
  children: Array<Category> = new Array<Category>();

  constructor(category?) {
    category = category || {};
    this.id = category.id || -1;
    this.name = category.name || "";
    this.value = category.name || "";
    this.parent_id = category.parent_id || -1;
  }
}
