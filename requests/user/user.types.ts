export interface IUpdateUserPayloadProps {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    description?: string;
    base64_image?: string;
    file_image?: File;
}

export interface IFilterUserIndexPayload {
    name?: string;
    email?: string;
    gender?: string;
    blocked?: number;
    user_verified?: number;
    flag?: number;
    start_date?: string;
    end_date?: string;
    pagination?: number;
}