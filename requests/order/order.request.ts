import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";
import { ICancelOrderActionProps, ICreateOrderProps, IFilterOrderActionProps, IUpdateOrderProps } from "./order.types";

export const createAnOrderAction = async (payload: ICreateOrderProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/order/store', payload, {
        headers: {
            Authorization: user.access_token
        }
    })
}

export const updateOrderRequest = async (payload: IUpdateOrderProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/order/update', payload, {
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

export const closeAnOrderAction = async (payload: ICancelOrderActionProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/order/close', payload, {
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

export const shipAnOrderAction = async (payload: ICancelOrderActionProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/order/ship', payload, {
        headers: {
            Authorization: user.access_token
        }
    })
}

export const unshipAnOrderAction = async (payload: ICancelOrderActionProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/order/unship', payload, {
        headers: {
            Authorization: user.access_token
        }
    })
}

export const deliverAnOrderAction = async (payload: ICancelOrderActionProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/order/delivered', payload, {
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

export const filterOrdersByVendorAction = async (payload: IFilterOrderActionProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/order/filter/index', payload, {
        headers: {
            Authorization: user.access_token,
            team: payload.vendor_id!
        }
    });
}

export const searchOrdersByVendorAction = async (search: string, vendor_id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/order/search/index', {search}, {
        headers: {
            Authorization: user.access_token,
            team: vendor_id
        }
    })
}

export const closeOrderByVendorAction = async (id: string, vendor_id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/order/close', {id}, {
        headers: {
            Authorization: user.access_token,
            team: vendor_id
        }
    })
}

export const markOrderAsReadyByVendorAction = async (id: string, vendor_id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/order/ready', {id}, {
        headers: {
            Authorization: user.access_token,
            team: vendor_id
        }
    })
}