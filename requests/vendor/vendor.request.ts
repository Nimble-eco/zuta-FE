import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";

export const getMyVendorAction = async () => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.get('/api/vendor/me', {
        headers: {
            Authorization: user.access_token
        }
    });
}