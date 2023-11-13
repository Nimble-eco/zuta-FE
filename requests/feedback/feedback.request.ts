import Cookies from "js-cookie";
import { IStoreFeedbackPayloadProps } from "./feedback.types";
import axiosInstance from "../../Utils/axiosConfig";

export const storeFeedbackAction = async (payload: IStoreFeedbackPayloadProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/feedback/store', payload, {
        headers: {
            Authorization: user.access_token
        }
    })
}