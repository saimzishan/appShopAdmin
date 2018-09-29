export class Tax {
    id: number;
    title: string;
    value : string;

    constructor(tax?) {
        tax = tax || {};
        this.id = tax.id || -1;
        this.title = tax.title || '';
        this.value = tax.value || '';
    }
}