import { useState } from "react"
import AdminSideNavPanel from "../../../Components/admin/layout/AdminSideNav"
import ButtonFull from "../../../Components/buttons/ButtonFull"
import ColumnTextInput from "../../../Components/inputs/ColumnTextInput";
import TextAreaInput from "../../../Components/inputs/TextAreaInput";
import MyDropDownInput from "../../../Components/inputs/MyDropDownInput";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { storeCouponAction } from "../../../requests/coupons/coupons.requests";
import { filterTruthyProps } from "../../../Utils/helper";
import { IStoreCouponPayload } from "../../../requests/coupons/coupons.types";
import AdminNavBar from "../../../Components/admin/layout/AdminNavBar";

const create = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [newCoupon, setNewCoupon] = useState<any>({
        title: '',
        amount: '',
        min_order_amount_cap: '',
        descripton: '',
        expiry: '',
        product_id: '',
        vendor_id: '',
        user_id: '',
        issuer_id: '',
        status: undefined
    }); 
    
    const handleChange = (e: any) => {
        setNewCoupon((prev: any) => ({
            ...newCoupon,
            [e.target.name]: e.target.value
        }))
    }

    const createCoupon = async () => {
        setIsLoading(true);
        const payload = filterTruthyProps(newCoupon);
        await storeCouponAction(payload as IStoreCouponPayload)
        .then((response) => {
            if(response.status === 201) {
                setIsLoading(false);
                toast.success('Coupon created successfully');
                router.push('/admin/coupons')
            }
        })
        .catch(error => {
            console.log({error})
            toast.error(error.response?.data?.message ?? 'Error try agin later');
        })
        .finally(() => setIsLoading(false));
    }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-scroll">
        <div className="flex flex-row w-full mx-auto relative">
            <AdminSideNavPanel />
            <div className="flex flex-col w-full !px-4 lg:!px-0 lg:w-[80%] lg:absolute lg:right-0 lg:left-[20%]">
                <AdminNavBar />
                <div className="flex flex-row justify-between items-center relative px-4 py-4 mb-3 bg-white border-b border-gray-200 mt-12 lg:mt-0">
                    <h2 className="text-lg font-bold">Coupon Details</h2>
                    <div className="w-fit">
                        <ButtonFull 
                            action="Create Coupon"
                            loading={isLoading}
                            onClick={createCoupon}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4 bg-white py-6 px-4 rounded-md">
                    <ColumnTextInput 
                        label="Title"
                        name='title'
                        value={newCoupon.title}
                        placeHolder="Enter product name"
                        onInputChange={handleChange}
                    />

                    <ColumnTextInput 
                        type="number"
                        label="Amount"
                        name='amount'
                        value={newCoupon.amount}
                        placeHolder="E.g 5,000"
                        onInputChange={handleChange}
                    />

                    <ColumnTextInput 
                        type="number"
                        label="Minimum Amount(optional)"
                        name='amount'
                        value={newCoupon.min_order_amount_cap}
                        placeHolder="E.g 10,000"
                        onInputChange={handleChange}
                    />

                    <MyDropDownInput 
                        label="Status (optional)"
                        onSelect={handleChange}
                        name="status"
                        options={[
                            {title: 'Active', value: 'active'},
                            {title: 'Inactive', value: 'inactive'},
                            {title: 'Closed', value: 'closed'},
                        ]}
                        value={newCoupon.status}
                    />

                    <ColumnTextInput 
                        type="date"
                        label="Expiry"
                        name='expiry'
                        value={newCoupon.expiry}
                        placeHolder="E.g 10,000"
                        onInputChange={handleChange}
                    />

                    <TextAreaInput
                        label="Description (optional)"
                        value={newCoupon.description}
                        name="description"
                        onInputChange={handleChange}
                        placeHolder="A short description"
                    />

                    <ColumnTextInput 
                        label="User ID (optional)"
                        name='user_id'
                        value={newCoupon.user_id}
                        placeHolder="This is the user who must benefir or use the coupon"
                        onInputChange={handleChange}
                    />

                    <ColumnTextInput 
                        label="Product ID (optional)"
                        name='product_id'
                        value={newCoupon.product_id}
                        placeHolder="Enter Product Id"
                        onInputChange={handleChange}
                    />

                    <ColumnTextInput 
                        label="Vendor ID (optional)"
                        name='vendor_id'
                        value={newCoupon.vendor_id}
                        placeHolder="Enter Vendor Id"
                        onInputChange={handleChange}
                    />

                    <ColumnTextInput 
                        label="Issuer ID (optional)"
                        name='issuer_id'
                        value={newCoupon.issuer_id}
                        placeHolder="This is the user who must gift the coupon to a new user"
                        onInputChange={handleChange}
                    />
                </div>
            </div>
        </div>
    </div>
  )
}

export default create