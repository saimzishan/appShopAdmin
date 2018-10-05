export class LineItem {
    id: number;
    title: string;
    details: string;
    line_item_printing_info: LineItemPrintInfo;
    quantity: number;
    price_paid: number;
    status: string;
    order_id: number;
    supplier_id: number;

    constructor(lineItem?) {
        lineItem = lineItem || {};
        this.id = lineItem.id || -1;
        this.title = lineItem.title || '';
        this.details = lineItem.details || '';
        this.line_item_printing_info = lineItem.line_item_printing_info || new LineItemPrintInfo();
        this.quantity = lineItem.quantity || 0;
        this.price_paid = lineItem.price_paid || 0.0;
        this.status = lineItem.status || '';
        this.order_id = lineItem.order_id || -1;
        this.supplier_id = lineItem.supplier_id || -1;
    }
}

export class LineItemPrintInfo {
    id: number;
    top_image: string;
    right_image: string;
    bottom_image: string;
    left_image: string;
    front_image: string;
    back_image: string;
    instructions: string;

    constructor(printInfo?) {
        printInfo = printInfo || {};
        this.id = printInfo.id || -1;
        this.top_image = printInfo.top_image || '';
        this.bottom_image = printInfo.bottom_image || '';
        this.left_image = printInfo.left_image || '';
        this.front_image = printInfo.front_image || '';
        this.back_image = printInfo.back_image || '';
        this.instructions = printInfo.instructions || '';
    }
}