export class Category {
  id = -1;
  name = "";
  value = "";
  parent_id: number;
  notes = "";
  children: Category[];

  constructor(category?) {
    category = category || {};
    this.id = category.id || -1;
    this.name = category.name || "";
    this.value = category.name || "";
    this.parent_id = category.parentName || "";
  }
}
