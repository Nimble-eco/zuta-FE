import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";

export const searchProductTagsAction = async (search: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/product/tag/search/index', {search}, {
        headers: {
            Authorization: user.access_token
        }
    })
}