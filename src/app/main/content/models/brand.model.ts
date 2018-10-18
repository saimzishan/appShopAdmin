import { FuseUtils } from "../../../core/fuseUtils";
import { MatChipInputEvent } from "@angular/material";
import { Image } from "./product.model";

export class Brand {
  id: string;
  name: string;
  notes: string;
  image: Image;

  constructor(brand?) {
    brand = brand || {};
    this.id = brand.id || -1;
    this.name = brand.name || "";
    this.notes = brand.notes || "";
    this.image = brand.image || new Image();
  }
}
