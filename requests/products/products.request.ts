import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";
import { IStoreProductActionProps } from "./products.types";

export const createProductAction = async (payload: IStoreProductActionProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/product/store', payload, {
        headers: {
            Authorization: user.access_token,
            team: payload.vendor_id
        }
    })
}