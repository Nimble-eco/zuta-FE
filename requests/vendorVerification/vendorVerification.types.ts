export interface IStoreVendorVerificationProps {
    full_name: string;
    business_name: string;
    email: string;
    business_email: string;
    phone: string;
    cac_reg_number?: string;
    tax_id?: string;
    country: string;
    state: string;
    pictures?: string[];   
}