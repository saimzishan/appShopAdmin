import { Address } from "./address.model";

export class Billing {
    id: number;
    billing_address: Address;
    delivery_address: Address;
    order_id: number;
    payment_id: number;

    constructor(billing?) {
        billing = billing || {};
        this.id = billing.id || -1;
        this.billing_address = billing.billing_address || new Address();
        this.delivery_address = billing.delivery_address || new Address();
        this.order_id = billing.order_id || -1;
        this.payment_id = billing.payment_id || -1;
    }
}