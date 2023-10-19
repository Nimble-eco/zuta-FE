import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";

export const searchProductCategoriesAction = async (search: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/product/category/search/index', {search}, {
        headers: {
            Authorization: user.access_token
        }
    })
}