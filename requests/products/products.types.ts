export interface IStoreProductActionProps {
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