import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";
import { IFilterVendorsPayload, IUpdateVendorPayload } from "./vendor.types";

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


export const filterVendorsAction = async (payload: IFilterVendorsPayload) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/vendor/filter/index', payload, {
        headers: {Authorization: user.access_token}
    })
}

export const searchVendorsAction = async (search: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/vendor/search/index', {search}, {
        headers: {Authorization: user.access_token}
    })
}

export const managementUnApproveVendorAction = async (id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/vendor/management/unapprove', {id}, {
        headers: {Authorization: user.access_token}
    });
}

export const managementApproveVendorAction = async (id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/vendor/management/approve', {id}, {
        headers: {Authorization: user.access_token}
    });
}