import Cookies from "js-cookie";
import { IStoreVendorVerificationProps } from "./vendorVerification.types";
import axiosInstance from "../../Utils/axiosConfig";

export const storeVendorVerificationAction = async (payload: IStoreVendorVerificationProps) => {
    return axiosInstance.post('/api/verification/vendor/store', payload);
}