import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";
import { IAdminDeliveryCancelPayload, IAdminDeliveryCompletePayload, IAdminDeliveryFilterIndexPayload, IAdminDeliveryIndexPayload, IAdminDeliveryPaymentLinkPayload } from "./delivery.types";

export const adminDeliveryIndexRequest = async (payload: IAdminDeliveryIndexPayload) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/delivery/index?properties=1', payload, {
        headers: {
            Authorization: user.access_token
        }
    })
}

export const adminDeliveryFilterIndexRequest = async (payload: IAdminDeliveryFilterIndexPayload) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/delivery/filter/index?properties=1', payload, {
        headers: {
            Authorization: user.access_token
        }
    })
}

export const adminDeliveryCompleteRequest = async (payload: IAdminDeliveryCompletePayload) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/delivery/complete', payload, {
        headers: {
            Authorization: user.access_token
        }
    })
}

export const adminDeliveryCancelRequest = async (payload: IAdminDeliveryCancelPayload) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/delivery/cancel', payload, {
        headers: {
            Authorization: user.access_token
        }
    })
}

export const adminDeliveryGetPaymentLinkRequest = async (payload: IAdminDeliveryPaymentLinkPayload) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.get('/api/delivery/payment-link', {
        headers: {Authorization: user.access_token},
        params: {order_id: payload.order_id}
    })
}