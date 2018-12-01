export class BulkProduct {
  id = -1;
  base64string = "";
  content_type = "";
  delimiter = "1";

  constructor(bulk?) {
    bulk = bulk || {};
    this.id = bulk.id || -1;
    this.base64string = bulk.base64string || "";
    this.content_type = bulk.content_type || "";
    this.delimiter = bulk.delimiter || "1";
  }
}
