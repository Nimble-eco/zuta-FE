import { useRouter } from "next/router";
import AdminSideNavPanel from "../../../../Components/admin/layout/AdminSideNav"
import ButtonFull from "../../../../Components/buttons/ButtonFull"
import TextCard from "../../../../Components/texts/TextCard";
import { useState } from "react";
import { toast } from "react-toastify";
import { cancelAnOrderAction, closeAnOrderAction, deliverAnOrderAction, shipAnOrderAction, unshipAnOrderAction } from "../../../../requests/order/order.request";
import { parse } from "cookie";
import axiosInstance from "../../../../Utils/axiosConfig";

interface IShowOrderPageProps {
    order: any;
}

const ShowOrder = ({order}: IShowOrderPageProps) => {
    const router = useRouter();
    const [status, setStatus] = useState(order?.status);
    const [loading, setLoading] = useState(false);
    console.log({order})
    const updateOrderStatus = async() => {
        setLoading(true);
        if(!status) return toast.error('Select a status');
        
        let res: any;

        switch (status) {
            case 'shipped':
                res = await shipAnOrderAction({id: order.id})
                .catch(error => {
                    setLoading(false);
                    toast.error(error?.response?.data?.message || 'Error try again later');
                });
            break;
            case 'unshipped':
                res = await unshipAnOrderAction({id: order.id})
                .catch(error => {
                    setLoading(false);
                    toast.error(error?.response?.data?.message || 'Error try again later');
                });
            break;
            case 'delivered':
                res = await deliverAnOrderAction({id: order.id})
                .catch(error => {
                    setLoading(false);
                    toast.error(error?.response?.data?.message || 'Error try again later');
                });
            break;
            case 'closed':
                res = await closeAnOrderAction({id: order.id})
                .catch(error => {
                    setLoading(false);
                    toast.error(error?.response?.data?.message || 'Error try again later');
                });
            break;
            case 'cancelled':
                res = await cancelAnOrderAction({id: order.id})
                .catch(error => {
                    setLoading(false);
                    toast.error(error?.response?.data?.message || 'Error try again later');
                });
            break;
            default:
                break;
        }
        
        if(res?.status === 202) {
            toast.success('Status updated');
            setTimeout(()=>window.location.reload(), 3000);
        }
    }
    
  return (
    <div className="min-h-screen bg-gray-100 overflow-scroll flex flex-row relative">
        <AdminSideNavPanel />
        <div className="min-h-screen bg-gray-100 flex flex-col gap-6 w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%] rounded-md">
            <div className='flex flex-col bg-white mt-20 lg:mt-6 rounded-md'>
                <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center border-b border-gray-200 py-4 px-4">
                    <h2 className="text-xl font-semibold align-center align-baseline my-auto capitalize">{order?.id}</h2>
                    <div className="flex flex-row gap-4 items-center">
                        <p className="text-orange-600 font-medium mb-0">Status:</p>
                        <select 
                            className="px-4 py-2 bg-gray-100 rounded-xl"
                            onChange={(e)=>setStatus(e.target?.value)}
                            value={status}
                        >
                            <option value={'shipped'}>Shipped</option>
                            <option value={'unshipped'}>Unshipped</option>
                            <option value={'delivered'}>Delivered</option>
                            <option value={'closed'}>Closed</option>
                            <option value={'cancelled'}>Cancelled</option>
                        </select>
                        <ButtonFull
                            action="Save"
                            loading={loading}
                            onClick={updateOrderStatus}
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-4 mt-4'>
                    <div className="flex flex-col gap-1 border-b-4 border-gray-100">
                        <p className="text-slate-600 font-semibold px-4 text-xl">Order Details</p>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                            <TextCard label="Product Name" value={order?.product_name} />
                            <TextCard label="Price" value={order?.product_price_paid} />
                            <TextCard label="Discount" value={order?.product_discount} />
                            <TextCard label="Quantity" value={order?.quantity} />
                            <TextCard label="Status" value={order?.status} />
                            <TextCard label="Total" value={order?.order_amount} />
                            <TextCard label="Sub amount" value={order?.order_sub_amount} />
                            <TextCard label="Service fee" value={order?.order_service_fee} />
                            <TextCard label="Delivery fee" value={order?.order_delivery_fee} />
                            <TextCard label="Coupons" value={order?.order_coupons} />
                            <TextCard label="Order paid" value={order?.order_paid} />
                            <TextCard label="Order payment_confirmed" value={order?.order_payment_confirmed ? 'True' : 'False'} />
                            <TextCard label="Order payment_method" value={order?.order_payment_method} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 border-b-4 border-gray-100">
                        <p className="text-slate-600 font-semibold px-4 text-xl">Customer Details</p>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                            <TextCard label="Recipient name" value={order?.recipient_name} />
                            <TextCard label="Recipient email" value={order?.recipient_email} />
                            <TextCard label="Recipient phone" value={order?.recipient_phone} />
                            <TextCard label="Recipient Address" value={order?.recipient_address} />
                            <TextCard label="Recipient city" value={order?.recipient_city} />
                            <TextCard label="Recipient state" value={order?.recipient_state} />
                            <TextCard label="Recipient country" value={order?.recipient_country} />
                            <TextCard label="Recipient zip" value={order?.recipient_zip} />
                            <TextCard label="Recipient latitude" value={order?.recipient_location_latitude} />
                            <TextCard label="Recipient longitude" value={order?.recipient_location_longitude} />
                        </div>
                    </div>

                    <div className='flex flex-col bg-white mt-4 rounded-md border-b-4 border-gray-100'>
                        <div className="flex flex-row justify-between items-center px-4">
                            <h4 className="text-xl text-slate-700 font-semibold">User</h4>
                            <p 
                                onClick={()=>router.push(`/admin/users/${order?.user_id}`)}
                                className="text-sm cursor-pointer hover:text-orange-500 font-medium text-orange-600 border border-orange-600 rounded-xl px-4 py-2"
                            >
                                View
                            </p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <TextCard label="Name" value={order?.user?.name} />
                            <TextCard label="Email" value={order?.user?.email} />
                            <TextCard label="Phone Number" value={order?.user?.phone} />
                            <TextCard label="Gender" value={order?.user?.gender} />
                            <TextCard label="Flag" value={order?.user?.flag} />
                            <TextCard label="Points" value={order?.user?.points} />
                        </div>
                    </div>

                    <div className='flex flex-col bg-white mt-4 rounded-md'>
                        <div className="flex flex-row justify-between items-center px-4">
                            <h4 className="text-xl text-slate-700 font-semibold">Vendor</h4>
                            <p 
                                onClick={()=>router.push(`/admin/stores/${order?.vendor_id}`)}
                                className="text-sm cursor-pointer hover:text-orange-500 font-medium text-orange-600 border border-orange-600 rounded-xl px-4 py-2"
                            >
                                View
                            </p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <TextCard label="Name" value={order?.vendor?.vendor_name} />
                            <TextCard label="Email" value={order?.vendor?.vendor_email} />
                            <TextCard label="Phone Number" value={order?.vendor?.vendor_phone} />
                            <TextCard label="Address" value={order?.vendor?.user?.vendor_address} />
                            <TextCard label="City" value={order?.vendor?.user?.vendor_city} />
                            <TextCard label="state" value={order?.vendor?.user?.vendor_state} />
                            <TextCard label="country" value={order?.vendor?.user?.vendor_country} />
                            <TextCard label="flag" value={order?.vendor?.user?.flag} />
                        </div>
                    </div>
                </div>
            </div>    
        </div>
    </div>
  )
}

export default ShowOrder

export async function getServerSideProps(context: any) {
    const { id } = context.query;
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;
  
    try {
        const getOrder = await axiosInstance.get('/api/order/show?id=' + id, {
            headers: {Authorization: token}
        });
        const order = getOrder.data?.data;
  
        return {
            props: { order }
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
            props: {order: {}}
        }
    }
}