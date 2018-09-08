import { FuseUtils } from '../../../core/fuseUtils';
import { MatChipInputEvent } from '@angular/material';

export class Tag {
  id: string;
  name: string;
  notes: string;

  constructor(tag?) {
    tag = tag || {};
    this.id = tag.id || FuseUtils.generateGUID();
    this.name = tag.name || '';
    this.notes = tag.notes || '';
  }
}