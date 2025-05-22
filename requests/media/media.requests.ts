import Cookies from "js-cookie";
import { IStoreMediaPayload } from "./media.types";
import axiosInstance from "../../Utils/axiosConfig";

export const storeMediaAction = async (payload: IStoreMediaPayload) => {
    const user = JSON.parse(Cookies.get('user')!);

    const formData = new FormData();
    formData.append('category', payload.category);
    for(let i = 0; i < payload.files.length; i++) {
        formData.append('files[]', payload.files[i]);
    }

    return axiosInstance.post('/api/media/store', formData, {
        headers: { Authorization: user.access_token }
    })
}

export const storeVideosRequest = async (payload: IStoreMediaPayload) => {
    const user = JSON.parse(Cookies.get('user')!);

    const formData = new FormData();
    formData.append('category', payload.category);
    for(let i = 0; i < payload.files.length; i++) {
        formData.append('files[]', payload.files[i]);
    }

    return axiosInstance.post('/api/media/store-video', formData, {
        headers: { Authorization: user.access_token }
    })
}