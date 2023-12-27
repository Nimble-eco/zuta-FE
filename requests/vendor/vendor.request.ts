import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";
import { IUpdateVendorPayload } from "./vendor.types";

export const getMyVendorAction = async () => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.get('/api/vendor/me', {
        headers: {
            Authorization: user.access_token
        }
    });
}

export const updateMyVendorAction = async (payload: IUpdateVendorPayload) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/vendor/update', payload, {
        headers: {
            Authorization: user.access_token,
            team: payload.id
        }
    });
}