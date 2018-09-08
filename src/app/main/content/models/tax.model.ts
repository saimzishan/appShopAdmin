export class Tax {
    id: number;
    title = '';
    value = '';

    constructor(tax?) {
        tax = tax || {};
        this.id = tax.id;
        this.title = tax.title || '';
        this.value = tax.value || '';
    }
}