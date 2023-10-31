import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";
import { IStoreProductShowcaseProps } from "./showcase.types";

export const storeProductShowcaseAction = async (payload: IStoreProductShowcaseProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/featured/product/store', payload, {
        headers: {
            Authorization: user.access_token,
            team: payload.vendor_id
        }
    });
}

export const activateProductShowcaseAction = async (featured_id: number, vendorId: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/featured/product/activate', {id: featured_id}, {
        headers: {
            Authorization: user.access_token,
            team: vendorId
        }
    });
}

export const deactivateProductShowcaseAction = async (featured_id: number, vendorId: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/featured/product/deactivate', {id: featured_id}, {
        headers: {
            Authorization: user.access_token,
            team: vendorId
        }
    });
}