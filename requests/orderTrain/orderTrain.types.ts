
export interface IJoinOrderTrainProps {
    user_id: string;
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

export interface IUpdateOrderTrainStatusProps {
    id: string;
    status: 'shipped' | 'unshipped' | 'delivered' | 'completed' | 'closed';
}