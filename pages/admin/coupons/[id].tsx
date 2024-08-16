import { useState } from "react"
import AdminSideNavPanel from "../../../Components/admin/layout/AdminSideNav"
import ButtonFull from "../../../Components/buttons/ButtonFull"
import ColumnTextInput from "../../../Components/inputs/ColumnTextInput";
import TextAreaInput from "../../../Components/inputs/TextAreaInput";
import MyDropDownInput from "../../../Components/inputs/MyDropDownInput";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axiosInstance from "../../../Utils/axiosConfig";
import { parse } from "cookie";
import ButtonGhost from "../../../Components/buttons/ButtonGhost";
import { deleteCouponAction, updateCouponAction } from "../../../requests/coupons/coupons.requests";

interface IUpdateCouponProps {
    coupon: any;
}

const update = ({coupon}: IUpdateCouponProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [newCoupon, setNewCoupon] = useState<any>(coupon); 
    
    const handleChange = (e: any) => {
        setNewCoupon((prev: any) => ({
            ...newCoupon,
            [e.target.name]: e.target.value
        }))
    }

    const updateCoupon = async () => {
        setIsLoading(true);
        await updateCouponAction({
            ...newCoupon,
            id: coupon.id
        })
        .then((response) => {
            if(response.status === 201) {
                setIsLoading(false);
                toast.success('Coupon updated successfully');
                router.push('/admin/coupons')
            }
        })
        .catch(error => {
            console.log({error})
            toast.error(error.response?.data?.message ?? 'Error try agin later');
        })
        .finally(() => setIsLoading(false));
    }

    const deleteCoupon = async () => {
        setIsLoading(true);
        await deleteCouponAction(coupon.id)
        .then((response) => {
            if(response.status === 202) {
                setIsLoading(false);
                toast.success('Coupon deleted successfully');
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
        <div className="flex flex-row w-full mx-auto mt-8 relative mb-10">
            <AdminSideNavPanel />
            <div className="flex flex-col w-[80%] absolute right-0 left-[20%]">
                <div className="flex flex-row justify-between items-center py-4 px-4 bg-white border-b border-gray-200">
                    <h2 className="text-lg font-bold">Coupon Details</h2>
                    <div className="flex flex-row gap-4 items-center">
                        <div className="hidden lg:flex w-fit ">
                            <ButtonGhost 
                                action="Delete"
                                loading={isLoading}
                                onClick={deleteCoupon}
                            />
                        </div>
                        <div className="w-fit">
                            <ButtonFull 
                                action="Update Coupon"
                                loading={isLoading}
                                onClick={updateCoupon}
                            />
                        </div>
                    </div>
                </div>

                <div className="flexflex-col gap-4 bg-white py-6 px-4 rounded-md">
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
                        name='min_order_amount_cap'
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

                    <div className="lg:hidden flex w-full">
                        <ButtonGhost 
                            action="Delete"
                            loading={isLoading}
                            onClick={deleteCoupon}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default update

export async function getServerSideProps(context: any) {
    const { id } = context.query;
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;
  
    try {
      const getCoupon = await axiosInstance.get('/api/coupons/show?id=' + id, {
        headers: { Authorization: token }
      });
      const coupon = getCoupon.data?.data;
  
      return {
        props: {
          coupon
        }
      }
    } catch (error: any) {
      console.log({error})
        if(error?.response?.status === 401) {
          return {
            redirect: {
              destination: '/auth/signIn',
              permanent: false
            }
          }
        }
  
        return {
          props: {coupon: {}}
        }
    }
}