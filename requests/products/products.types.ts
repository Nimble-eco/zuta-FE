export interface IStoreProductActionProps {
    vendor_id: string;
    product_name: string;
    product_description: string;
    product_price: number;
    product_discount?: number;
    quantity: number;
    product_categories: string[];
    product_tags?: string[];
    base64_images?: string[];
    images?: File[];
}

export interface IUpdateProductActionProps {
    id: number;
    vendor_id: string;
    product_name: string;
    product_description: string;
    product_price: number;
    product_discount?: number;
    quantity: number;
    status?: string;
    product_categories: string[];
    product_tags?: string[];
    base64_images?: string[];
    images?: File[];
}

export interface IFilterProductActionProps {
    vendor_id?: string;
    product_name?: string;
    product_description?: string;
    product_price?: number;
    product_discount?: number;
    quantity?: number;
    flag?: number;
    status?: string;
    product_categories?: string[];
    product_tags?: string[];
    featured_status?: string;
    vendor_approved?: number;
    management_approved?: number;
    visibility?: string;
    pagination?: number;
}