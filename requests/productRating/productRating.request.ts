import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";
import { IFilterIndexProductRatingActionProps, IStoreProductRatingActionProps } from "./productRating.types";

export const storeProductRatingAction = async (payload: IStoreProductRatingActionProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/review/product/store', payload, {
        headers: {
            Authorization: user.access_token
        }
    })
}

export const filterIndexProductRatingAction = async (payload: IFilterIndexProductRatingActionProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/review/filter/index', payload, {
        headers: {
            Authorization: user.access_token
        }
    })
}