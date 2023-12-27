export interface IUpdateVendorPayload {
    id: string;
    vendor_name?: string;
    vendor_email?: string;
    vendor_phone?: string;
    vendor_address?: string;
    vendor_city?: string;
    vendor_state?: string;
    vendor_country?: string;
    vendor_zip?: string;
    vendor_latitude?: number;
    vendor_longitude?: number;
    vendor_description?: string;
}