import axios, { AxiosRequestConfig } from "axios";
import router from "next/router";

let host: string = "";
const env = process.env.ENV;
if (env === 'production') {
  host = process.env.HOST!;
} else {
  host = 'http://localhost'
}

export const sendAxiosRequest =async (path: string, method: string, data: any, token?: string, vendorUid?: string) => {
    let response = await axios({
        url: `${host}:3333${path}`,
        method: method as AxiosRequestConfig["method"] | undefined,
        data: data,
        headers: {
            'x-access-token': token || "",
            'vendor_uid': vendorUid || "",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        }
    });
    console.log(response?.data);
    if(response?.data?.status >= 400 && response?.data?.status <= 403) router.push('/signIn');
    return response?.data;
}
