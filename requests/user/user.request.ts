import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";
import { IUpdateUserPayloadProps } from "./user.types";

export const updateUserAction = async (payload: IUpdateUserPayloadProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/user/update', payload, {
        headers: {Authorization: user.access_token}
    });
}