export interface IUpdatePaymentActionProps {
    id: number;
    user_id?: string;
    creditor_id?: string;
    reference?: string;
    type?: string;
    currency?: string;
    paid?: number;
    payment_confirmed?: number;
    amount?: number;
}

export interface IFilterPaymentActionProps {
    user_id?: string;
    creditor_id?: string;
    reference?: string;
    type?: string;
    currency?: string;
    paid?: number;
    payment_confirmed?: number;
    amount?: number;
    start_date?: string;
    end_date?: string;
    pagination?: number;
}