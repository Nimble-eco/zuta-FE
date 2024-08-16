export interface IStoreCouponPayload {
    product_id?: string
    vendor_id?: string
    user_id?: string
    issuer_id?: string
    title: string
    description?: string
    currency?: string
    expiry?: string
    status?: string
    amount: number
    min_order_amount_cap?: number
}

export interface IUpdateCouponPayload {
    id: string
    product_id?: string
    vendor_id?: string
    user_id?: string
    issuer_id?: string
    title?: string
    description?: string
    currency?: string
    expiry?: string
    status?: string
    amount?: number
    min_order_amount_cap?: number
}