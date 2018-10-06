export class Tag {
  id: number;
  name: string;
  selected: boolean;

  constructor(tag?) {
    tag = tag || {};
    this.id = tag.id || -1;
    this.name = tag.name || "";
    this.selected = tag.selected || false;
  }
}
