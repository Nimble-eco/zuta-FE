
export interface ICreateOrderProps {
    user_id: string,
    product_id: string;
    quantity: number;
    address_id: number;
    payment_id: string;
    order_sub_amount: number;
    order_service_fee: number;
    order_insurance_fee?: number;
    order_delivery_fee?: number;
    order_paid?: number;
    order_payment_confirmed?: number;
    order_payment_method?: number;
}

export interface IUpdateOrderProps {
    order_id: string,
    product_name?: string;
    quantity?: number;
    address_id?: number;
    payment_id?: string;
    order_sub_amount?: number;
    order_service_fee?: number;
    order_insurance_fee?: number;
    order_delivery_fee?: number;
    order_paid?: boolean;
    order_payment_confirmed?: boolean;
    order_payment_method?: string;
}

export interface ICancelOrderActionProps {
    id: string
}

export interface IFilterOrderActionProps {
    user_id?: string,
    vendor_id?: string,
    product_name?: string;
    product_id?: number;
    quantity?: number;
    address_id?: number;
    payment_id?: string;
    order_sub_amount?: number;
    order_service_fee?: number;
    order_insurance_fee?: number;
    order_delivery_fee?: number;
    order_paid?: string;
    order_payment_confirmed?: number;
    order_payment_method?: number;
    recipient_address?: string;
    status?: string;
    pagination?: number;
}