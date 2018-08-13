import { FuseUtils } from '../../../core/fuseUtils';
import { MatChipInputEvent } from '@angular/material';

export class Brand {
    id: string;
    name: string;
    notes: string;
    images: {
        id: string,
        url: string,
    }[];

    constructor(brand?) {
        brand = brand || {};
        this.id = brand.id || FuseUtils.generateGUID();
        this.name = brand.name || '';
        this.notes = brand.notes || '';
        this.images = brand.images || [];
    }
}
