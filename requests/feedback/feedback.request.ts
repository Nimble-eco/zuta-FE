import Cookies from "js-cookie";
import { IFilterFeedbackPayloadProps, IStoreFeedbackPayloadProps, IUpdateFeedbackPayloadProps } from "./feedback.types";
import axiosInstance from "../../Utils/axiosConfig";

export const storeFeedbackAction = async (payload: IStoreFeedbackPayloadProps) => {
    const user = JSON.parse(Cookies.get('user')!);

    const formData = new FormData();
    formData.append('comment', payload.comment);
    formData.append('category', payload.category);
    formData.append('type', payload.type);
    formData.append('user_id', payload.user_id!);
    formData.append('email', payload.email!);
    formData.append('image', payload.image!);

    return axiosInstance.post('/api/feedback/store', formData, {
        headers: {
            Authorization: user.access_token
        }
    })
}

export const updateFeedbackAction = async (payload: IUpdateFeedbackPayloadProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/feedback/update', payload, {
        headers: {
            Authorization: user.access_token
        }
    })
}

export const filterFeedbackAction = async (payload: IFilterFeedbackPayloadProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/feedback/filter/index', payload, {
        headers: {
            Authorization: user.access_token
        }
    })
}