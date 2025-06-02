export interface IAdminDeliveryIndexPayload {
    status?: string;
}

export interface IAdminDeliveryFilterIndexPayload {
    recipient_email?: string;
    recipient_name?: string;
    recipient_city?: string;
    recipient_state?: string;
    recipient_country?: string;

    order_paid?: number;
    order_payment_confirmed?: number;
    payment_id?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    pagination?: number;
    page?: number;
}

export interface IAdminDeliveryCompletePayload {
    order_id: string;
    payment_id: string;
}

export interface IAdminDeliveryCancelPayload {
    order_id: string
}

export interface IAdminDeliveryPaymentLinkPayload {
    order_id: string
    callback_url?: string
}
