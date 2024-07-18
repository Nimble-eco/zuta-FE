import { useRouter } from "next/router";
import AdminSideNavPanel from "../../../../Components/admin/layout/AdminSideNav"
import ButtonFull from "../../../../Components/buttons/ButtonFull"
import TextCard from "../../../../Components/texts/TextCard";
import { useState } from "react";
import { toast } from "react-toastify";
import { cancelAnOrderAction, closeAnOrderAction, deliverAnOrderAction, shipAnOrderAction, unshipAnOrderAction } from "../../../../requests/order/order.request";

interface IShowOrderPageProps {
    order: any;
}

const ShowOrder = ({order}: IShowOrderPageProps) => {
    const router = useRouter();
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const updateOrderStatus = async() => {
        setLoading(true);
        if(!status) return toast.error('Select a status');
        
        let res: any;

        switch (status) {
            case 'shipped':
                res = await shipAnOrderAction({id: order.id});
            break;
            case 'unshipped':
                res = await unshipAnOrderAction({id: order.id});
            break;
            case 'delivered':
                res = await deliverAnOrderAction({id: order.id});
            break;
            case 'closed':
                res = await closeAnOrderAction({id: order.id});
            break;
            case 'cancelled':
                res = await cancelAnOrderAction({id: order.id});
            break;
            default:
                break;
        }
        
        if(res) {
            await res.then((response: any) => {
                if(response.status === 202) {
                    toast.success('Vendor status updated');
                }
            })
            .catch((error: any) => {
                console.log({error});
                toast.error(error?.response?.data?.message || 'Error try again later');
            })
            .finally(() => setLoading(false));
        }
    }
    
  return (
    <div className="min-h-screen bg-gray-100 overflow-scroll flex flex-row relative mb-10">
        <AdminSideNavPanel />
        <div className="min-h-screen bg-gray-100 flex flex-col gap-6 w-full md:w-[80%] absolute right-0 md:left-[20%] rounded-md px-4">
            <div className='flex flex-col bg-white mt-6 rounded-md'>
                <div className="flex flex-row justify-between items-center border-b border-gray-200 py-4 px-4">
                    <h2 className="text-xl font-semibold align-center align-baseline my-auto capitalize">{order.id}</h2>
                    <div className="flex flex-row gap-4 items-center">
                        <p className="text-slate-700 font-medium">Status:</p>
                        <select 
                            className=""
                            onChange={(e)=>setStatus(e.target?.value)}
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

                <div className='flex flex-col gap-4'>
                    <div className="flex flex-col gap-1">
                        <p className="text-slate-600 font-semibold">Order Details</p>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                            <TextCard label="Order payment_confirmed" value={order?.order_payment_confirmed} />
                            <TextCard label="Order payment_method" value={order?.order_payment_method} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-slate-600 font-semibold">Customer Details</p>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

                    <div className='flex flex-col bg-white mt-6 rounded-md p-4'>
                        <div className="flex flex-row justify-between items-center">
                            <h4 className="text-base text-slate-700 font-semibold">User</h4>
                            <p 
                                onClick={()=>router.push(`/admin/users/${order?.user_id}`)}
                                className="text-sm text-gray-800 cursor-pointer hover:text-orange-500 font-medium"
                            >
                                View
                            </p>
                        </div>
                        <div className="gird grid-cols-2 lg:grid-cols-4 gap-4">
                            <TextCard label="Name" value={order?.user?.name} />
                            <TextCard label="Email" value={order?.user?.email} />
                            <TextCard label="Phone Number" value={order?.user?.phone} />
                            <TextCard label="Gender" value={order?.user?.gender} />
                            <TextCard label="Flag" value={order?.user?.flag} />
                            <TextCard label="Points" value={order?.user?.points} />
                        </div>
                    </div>

                    <div className='flex flex-col bg-white mt-6 rounded-md p-4'>
                        <div className="flex flex-row justify-between items-center">
                            <h4 className="text-base text-slate-700 font-semibold">Vendor</h4>
                            <p 
                                onClick={()=>router.push(`/admin/stores/${order?.vendor_id}`)}
                                className="text-sm text-gray-800 cursor-pointer hover:text-orange-500 font-medium"
                            >
                                View
                            </p>
                        </div>
                        <div className="gird grid-cols-2 lg:grid-cols-4 gap-4">
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