import { Address } from "./address.model";

export class Billing {
    id;
    billingaddress: Address;
    delivryAddress: Address;
    orderId;
    paymentId;
}

export class DeliveryAddress extends Address {

}