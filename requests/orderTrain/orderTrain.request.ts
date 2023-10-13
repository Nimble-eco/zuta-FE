import Cookies from "js-cookie";
import { IFilterMyOrderTrainStatusProps, IJoinOrderTrainProps, IUpdateOrderTrainStatusProps } from "./orderTrain.types";
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