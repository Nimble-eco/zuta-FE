export interface IStoreBannerPayloadProps {
    title: string;
    image: File;
    url?: string;
    description?: string;
    enabled?: boolean;
    position?: number;
}

export interface IFilterBannerPayloadProps {
    title?: string;
    image?: string;
    url?: string;
    description?: string;
    enabled?: number;
    position?: number;
    start_date?: string;
    end_date?: string;
    pagination?: number;
}

export interface IUpdateBannerPayloadProps {
    id: number;
    title?: string;
    image?: File;
    url?: string;
    description?: string;
    enabled?: number;
    position?: number;
}