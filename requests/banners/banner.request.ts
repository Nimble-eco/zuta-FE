import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";
import { IFilterBannerPayloadProps, IStoreBannerPayloadProps, IUpdateBannerPayloadProps } from "./banner.types";

export const storeBannerAction = async (payload: IStoreBannerPayloadProps) => {
    const user = JSON.parse(Cookies.get('user')!);

    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('url', payload.url!);
    formData.append('description', payload.description!);
    formData.append('enabled', payload.enabled!.toString());
    formData.append('position', payload.position!.toString());
    formData.append('image', payload.image);

    return axiosInstance.post('/api/advert/banners/store', formData, {
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

    const formData = new FormData();
    formData.append('id', payload.id.toString());
    formData.append('title', payload.title!);
    formData.append('url', payload.url!);
    formData.append('description', payload.description!);
    formData.append('enabled', payload.enabled!.toString());
    formData.append('position', payload.position!.toString());
    formData.append('image', payload.image!);

    return axiosInstance.post('/api/advert/banners/update', formData, {
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