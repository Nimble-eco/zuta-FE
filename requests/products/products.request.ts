import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";
import { IFilterProductActionProps, IStoreProductActionProps, IUpdateProductActionProps } from "./products.types";

export const createProductAction = async (payload: IStoreProductActionProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/product/store', payload, {
        headers: {
            Authorization: user.access_token,
            team: payload.vendor_id
        }
    })
}

export const updateProductAction = async (payload: IUpdateProductActionProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/product/update', payload, {
        headers: {
            Authorization: user.access_token,
            team: payload.vendor_id
        }
    })
}

export const filterProductsByVendorAction = async (payload: IFilterProductActionProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/product/filter/index', payload, {
        headers: {
            Authorization: user.access_token,
            team: payload.vendor_id!
        }
    })
}

export const searchProductsByVendorAction = async (search: string, vendor_id?: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/product/search/index', {search}, {
        headers: {
            Authorization: user.access_token,
            team: vendor_id ?? ''
        }
    })
}

export const updateProductVendorApprovedAction = async (id: number, vendor_id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/product/vendor/approve', {id}, {
        headers: {
            Authorization: user.access_token,
            team: vendor_id
        }
    })
}

export const updateProductVendorUnApprovedAction = async (id: number, vendor_id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/product/vendor/unapprove', {id}, {
        headers: {
            Authorization: user.access_token,
            team: vendor_id
        }
    })
}

export const deleteProductByVendorAction = async (id: number, vendor_id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/product/delete', {id}, {
        headers: {
            Authorization: user.access_token,
            team: vendor_id
        }
    });
}

export const managementUnApproveProductAction = async (id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/product/management/unapprove', {id}, {
        headers: {Authorization: user.access_token}
    });
}

export const managementApproveProductAction = async (id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/product/management/approve', {id}, {
        headers: {Authorization: user.access_token}
    });
}