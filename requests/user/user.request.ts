import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";
import { IFilterUserIndexPayload, IUpdateUserPayloadProps } from "./user.types";

export const updateUserAction = async (payload: IUpdateUserPayloadProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/user/update', payload, {
        headers: {Authorization: user.access_token}
    });
}

export const filterUserIndexAction = async (payload: IFilterUserIndexPayload) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/user/filter/index', payload, {
        headers: {Authorization: user.access_token}
    });
}

export const searchUserIndexAction = async (search: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/user/search/index', {search}, {
        headers: {Authorization: user.access_token}
    });
}

export const blockUserAction = async (id: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/user/block', {id}, {
        headers: {Authorization: user.access_token}
    });
}