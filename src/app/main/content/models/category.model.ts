
export class Category {
  id = -1;
  name = '';
  parent_id: number;
  notes = '';
  children: {
    id: string,
    parent_id: string,
    name: string,
    notes: string
  }[];

  constructor(category?) {
    category = category || {};
    this.id = category.id || -1;
    this.name = category.name || '';
    this.parent_id = category.parentName || '';
  }
}
