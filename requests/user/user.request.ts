import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosConfig";
import { IFilterUserIndexPayload, IUpdateUserPayloadProps } from "./user.types";

export const updateUserAction = async (payload: IUpdateUserPayloadProps) => {
    const user = JSON.parse(Cookies.get('user')!);
    const formData = new FormData();
    formData.append('id', payload.id);
    formData.append('name', payload.name!);
    formData.append('email', payload.email!);
    formData.append('phone', payload.phone!);
    formData.append('description', payload.description!);
    formData.append('base64_image', payload.base64_image!);
    formData.append('file_image', payload.file_image!);

    return axiosInstance.post('/api/user/update', formData, {
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

export const followUserAction = async (userId: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/user/follow', {userId}, {
        headers: {Authorization: user.access_token}
    });
}

export const unfollowUserAction = async (userId: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/user/unfollow', {userId}, {
        headers: {Authorization: user.access_token}
    });
}

export const checkUserFollowingStatusAction = async (userId: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.get('/api/user/status/following?userId=' + userId, {
        headers: {Authorization: user.access_token}
    });
}

export const checkUserFollowerStatusAction = async (userId: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.get('/api/user/status/follower?userId=' + userId, {
        headers: {Authorization: user.access_token}
    });
}

export const subscribeToVendorAction = async (vendorId: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/user/vendor/subscribe', {vendorId}, {
        headers: {Authorization: user.access_token}
    });
}

export const unsubscribeFromVendorAction = async (vendorId: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/user/vendor/unsubscribe', {vendorId}, {
        headers: {Authorization: user.access_token}
    });
}

export const checkVendorSubscriptionStatusAction = async (vendorId: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.get('/api/user/vendor/subscription/status?vendorId=' + vendorId, {
        headers: {Authorization: user.access_token}
    });
}

export const joinCommunityAction = async (communityId: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/user/community/join', {communityId}, {
        headers: {Authorization: user.access_token}
    });
}

export const leaveCommunityAction = async (communityId: string) => {
    const user = JSON.parse(Cookies.get('user')!);
    return axiosInstance.post('/api/user/community/leave', {communityId}, {
        headers: {Authorization: user.access_token}
    });
}