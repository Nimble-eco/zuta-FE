import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";
import { ICancelOrderActionProps, ICreateOrderProps, IFilterOrderActionProps } from "./order.types";

export const createAnOrderAction = async (payload: ICreateOrderProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/order/store', payload, {
        headers: {
            Authorization: user.access_token
        }
    })
}

export const cancelAnOrderAction = async (payload: ICancelOrderActionProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/order/cancel', payload, {
        headers: {
            Authorization: user.access_token
        }
    })
}

export const completeAnOrderAction = async (payload: ICancelOrderActionProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/order/complete', payload, {
        headers: {
            Authorization: user.access_token
        }
    })
}

export const filterOrderAction = async (payload: IFilterOrderActionProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/order/filter/index', payload, {
        headers: {
            Authorization: user.access_token
        }
    })
}