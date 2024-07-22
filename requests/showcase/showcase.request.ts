import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";
import { IFilterProductShowcaseActionProps, IIndexProductShowcaseActionProps, IStoreProductShowcaseProps } from "./showcase.types";

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

export const reactivateProductShowcaseAction = async (featured_id: number, vendorId: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/featured/product/reactivate', {id: featured_id}, {
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

export const resumeProductShowcaseAction = async (featured_id: number, vendorId: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/featured/product/resume', {id: featured_id}, {
        headers: {
            Authorization: user.access_token,
            team: vendorId
        }
    });
}

export const indexProductShowcaseAction = async (payload: IIndexProductShowcaseActionProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.get('/api/featured/product/index', {
        headers: { Authorization: user.access_token },
        params: payload
    });
}

export const filterProductShowcaseAction = async (payload: IFilterProductShowcaseActionProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/featured/product/filter/index', payload, {
        headers: {
            Authorization: user.access_token,
            team: payload.vendor_id ?? ''
        }
    });
}

export const searchFeaturedProductsByVendorAction = async (search: string, vendor_id?: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/featured/product/search/index', {search}, {
        headers: {
            Authorization: user.access_token,
            team: vendor_id ?? ''
        }
    })
}