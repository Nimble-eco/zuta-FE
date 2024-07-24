import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";
import { IFilterBannerPayloadProps, IStoreBannerPayloadProps, IUpdateBannerPayloadProps } from "./banner.types";

export const storeBannerAction = async (payload: IStoreBannerPayloadProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/advert/banners/store', payload, {
        headers: {
            Authorization: user.access_token
        }
    })
}

export const filterBannersAction = async (payload: IFilterBannerPayloadProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/advert/banners/filter/index', payload, {
        headers: { Authorization: user.access_token }
    })
}

export const searchBannersAction = async (search: string, pagination?: number) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/advert/banners/search/index', {search, pagination}, {
        headers: { Authorization: user.access_token }
    })
}

export const updateBannersAction = async (payload: IUpdateBannerPayloadProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/advert/banners/update', payload, {
        headers: { Authorization: user.access_token }
    })
}

export const enableBannerAction = async (id: number) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/advert/banners/enable', {id}, {
        headers: { Authorization: user.access_token }
    })
}

export const disableBannerAction = async (id: number) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/advert/banners/disable', {id}, {
        headers: { Authorization: user.access_token }
    })
}

export const deleteBannerAction = async (id: number) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/advert/banners/delete', {id}, {
        headers: { Authorization: user.access_token }
    })
}