import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";
import { IStoreBankDetailsPayload } from "./wallet.types";

export const storeBankDetailsAction = async (payload: IStoreBankDetailsPayload) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/wallet/bank-detail/store', payload, {
        headers: {
            Authorization: user.access_token
        }
    });
}

export const deleteBankDetailsAction = async (id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/wallet/bank-detail/destroy', {id}, {
        headers: {
            Authorization: user.access_token
        }
    });
}