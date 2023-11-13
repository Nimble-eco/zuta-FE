export interface IStoreProductShowcaseProps {
    product_id: number;
    vendor_id: string;
    featured_discount?: string;
    featured_duration_in_hours: number;
    featured_start_date: string;
    featured_end_date: string;
}

export interface IFilterProductShowcaseActionProps {
    vendor_id: string;
    product_name?: string;
    featured_paid?: boolean;
    featured_payment_confirmed?: boolean;
    status?: string;
    start_date?: string;
    end_date?: string;
    pagination?: number;
}