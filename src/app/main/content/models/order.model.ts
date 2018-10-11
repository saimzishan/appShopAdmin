import { Billing } from "./billing.model";
import { LineItem } from "./line-items.model";
import { User } from "./user.model";

export class Order {
    id: number;
    order_uuid: string
    status: string | number;
    billing: Billing;
    line_items: LineItem[];
    user: User;
    created_at: string;
    updated_at: string;

    constructor(order?) {
        order = order || {};
        this.id = order.id || -1;
        this.order_uuid = order.order_uuid || '';
        this.status = order.status || '';
        this.billing = order.billing || new Billing();
        this.line_items = order.line_items || new Array<LineItem>();
        this.user = order.user || new User();
        this.created_at = order.created_at || '';
        this.updated_at = order.updated_at || '';
    }
}