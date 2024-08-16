import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";
import { IStoreCouponPayload, IUpdateCouponPayload } from "./coupons.types";

export const storeCouponAction = async (payload: IStoreCouponPayload) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/coupons/store', payload, {
        headers: {
            Authorization: user.access_token
        }
    })
}

export const updateCouponAction = async (payload: IUpdateCouponPayload) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/coupons/update', payload, {
        headers: {
            Authorization: user.access_token
        }
    })
}

export const deleteCouponAction = async (id: number) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/coupons/delete', {id}, {
        headers: {
            Authorization: user.access_token
        }
    })
}