export class Tag {
  id: number;
  name: string;

  constructor(tag?) {
    tag = tag || {};
    this.id = tag.id || -1;
    this.name = tag.name || "";
  }
}
