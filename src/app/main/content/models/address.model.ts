export class Address {
    no: string;
    street: string;
    city: string;
    postol_code: string;
    state: string;
    country: string;

    constructor(address?) {
        address = address || {};
        this.no = address.no || '';
        this.street = address.street || '';
        this.city = address.city || '';
        this.postol_code = address.postol_code || '';
        this.state = address.state || '';
        this.country = address.country || '';
    }
}