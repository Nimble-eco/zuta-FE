import Cookies from "js-cookie";
import { IJoinOrderTrainProps } from "./orderTrain.types";
import axiosInstance from "../../Utils/axiosConfig";

export const joinOrderTrainAction = async (payload: IJoinOrderTrainProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/open-order/join', payload, {
        headers: {
            Authorization: user.access_token
        }
    })   
}