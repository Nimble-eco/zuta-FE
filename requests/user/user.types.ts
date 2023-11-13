export interface IUpdateUserPayloadProps {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    description?: string;
    base64_image?: string;
}