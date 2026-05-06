export interface IStoreProductRatingActionProps {
    product_id: number;
    score: number;
    comment?: string;
}

export interface IFilterIndexProductRatingActionProps {
    user_id?: number;
    product_id?: number;
    score?: number;
    comment?: string;
}