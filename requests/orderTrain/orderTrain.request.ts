import Cookies from "js-cookie";
import { IJoinOrderTrainProps, IUpdateOrderTrainStatusProps } from "./orderTrain.types";
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