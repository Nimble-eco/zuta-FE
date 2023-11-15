import { IFilterPublicProductsByPricePayload, IFilterPublicProductsByRatingPayload } from "./public-products.types";
import axiosInstance from "../../Utils/axiosConfig";

export const filterPublicProductsByPriceAction = async (payload: IFilterPublicProductsByPricePayload) => {
    return axiosInstance.post('/api/public/product/filter/index/price', payload)
}

export const filterPublicProductsByRatingAction = async (payload: IFilterPublicProductsByRatingPayload) => {
    return axiosInstance.post('/api/public/product/filter/index/rating', payload)
}