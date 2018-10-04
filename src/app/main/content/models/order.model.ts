import { Billing } from "./billing.model";
import { LineItem } from "./line-items.model";
import { User } from "./user.model";

export class Order {
    id: number;
    billing: Billing;
    createDAte;
    lineItems: LineItem[];
    status;
    user: User;
    show = false;

    constructor(order?) {
        order = order || {};
        this.id = order.id || -1;
    }
}