
export class Category
{
  id: number;
  name: string;
  parentName: string;

  constructor(category?)
  {
    category = category || {};
    this.id = category.id || -1;
    this.name = category.name || '';
    this.parentName = category.parentName || '';
  }
}
