import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";
import { IFilterPaymentActionProps, IUpdatePaymentActionProps } from "./payments.types";

export const filterPaymentAction = async (payload: IFilterPaymentActionProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/payment/filter/index', payload, {
        headers: { Authorization: user.access_token }
    })
}

export const searchPaymentAction = async (search: string, vendor_id?: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/payment/search/index', {search}, {
        headers: {
            Authorization: user.access_token,
            team: vendor_id ?? ''
        }
    })
}

export const updatePaymentAction = async (payload: IUpdatePaymentActionProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/payment/update', payload, {
        headers: { Authorization: user.access_token }
    })
}

export const confirmPaymentAction = async (id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/payment/confirm', {id}, {
        headers: { Authorization: user.access_token }
    })
}

export const unconfirmPaymentAction = async (id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/payment/unconfirm', {id}, {
        headers: { Authorization: user.access_token }
    })
}
