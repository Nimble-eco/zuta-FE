import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";
import { ICreateOrderProps } from "./order.types";

export const createAnOrderAction = async (payload: ICreateOrderProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/order/store', payload, {
        headers: {
            Authorization: user.access_token
        }
    })
}