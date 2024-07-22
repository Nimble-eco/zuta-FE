import Cookies from "js-cookie";
import { IFilterMyOrderTrainStatusProps, IFilterOrderTrainActionProps, IJoinOrderTrainProps, IUpdateOrderTrainStatusProps } from "./orderTrain.types";
import axiosInstance from "../../Utils/axiosConfig";

export const joinOrderTrainAction = async (payload: IJoinOrderTrainProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/open-order/join', payload, {
        headers: {
            Authorization: user.access_token
        }
    })   
}

export const unsubscribeOrderTrainAction = async (id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/open-order/unsubscribe', {id}, {
        headers: {
            Authorization: user.access_token
        }
    })   
}

export const updateOrderTrainStatusAction = async (payload: IUpdateOrderTrainStatusProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/open-order/update/status', payload, {
        headers: {
            Authorization: user.access_token
        }
    });
}

export const filterMyOrderTrainStatusAction = async (payload: IFilterMyOrderTrainStatusProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/open-order/filter/me', payload, {
        headers: {
            Authorization: user.access_token
        }
    });
}

export const getMyOrderTrainAction = async () => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.get('/api/open-order/me', {
        headers: {
            Authorization: user.access_token
        }
    });
}

export const filterOrderTrainByVendorAction = async (payload: IFilterOrderTrainActionProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/open-order/filter/index', payload, {
        headers: {
            Authorization: user.access_token,
            team: payload.vendor_id!
        }
    });
}

export const searchOrderTrainByVendorAction = async (search: string, vendor_id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/open-order/search/index', {search}, {
        headers: {
            Authorization: user.access_token,
            team: vendor_id
        }
    })
}

export const closeOpenOrderByVendorAction = async (id: string, vendor_id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/open-order/close', {id}, {
        headers: {
            Authorization: user.access_token,
            team: vendor_id
        }
    })
}

export const markOpenOrderAsReadyByVendorAction = async (id: string, vendor_id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/open-order/ready', {id}, {
        headers: {
            Authorization: user.access_token,
            team: vendor_id
        }
    })
}

export const markOpenOrderAsCompletedAction = async (id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/open-order/complete', {id}, {
        headers: { Authorization: user.access_token }
    })
}

export const markOpenOrderAsCancelledAction = async (id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/open-order/cancel', {id}, {
        headers: { Authorization: user.access_token }
    })
}

export const markOpenOrderAsRejectedAction = async (id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/open-order/reject', {id}, {
        headers: { Authorization: user.access_token }
    })
}