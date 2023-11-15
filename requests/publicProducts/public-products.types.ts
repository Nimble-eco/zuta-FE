export interface IFilterPublicProductsByRatingPayload {
    rating: number;
    search?: string;
    pagination?: number;
}

export interface IFilterPublicProductsByPricePayload {
    start_price: number;
    end_price?: number;
    search?: string;
    pagination?: number;
}