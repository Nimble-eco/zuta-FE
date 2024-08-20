import Cookies from "js-cookie";
import { IFilterFeedbackPayloadProps, IStoreFeedbackPayloadProps, IUpdateFeedbackPayloadProps } from "./feedback.types";
import axiosInstance from "../../Utils/axiosConfig";

export const storeFeedbackAction = async (payload: IStoreFeedbackPayloadProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/feedback/store', payload, {
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