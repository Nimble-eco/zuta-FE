import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";
import { ICartCheckoutActionProps } from "./cart.types";

export const cartCheckoutAction = async (payload: ICartCheckoutActionProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/cart/checkout', payload, {
        headers: {
            Authorization: user.access_token
        }
    });
}