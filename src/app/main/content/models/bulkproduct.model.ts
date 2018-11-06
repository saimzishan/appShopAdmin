export class BulkProduct {
  id = -1;
  base64string = "";
  content_type = "";

  constructor(bulk?) {
    bulk = bulk || {};
    this.id = bulk.id || -1;
    this.base64string = bulk.base64string || "";
    this.content_type = bulk.content_type || "";
  }
}