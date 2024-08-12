import { useRouter } from "next/router";
import AdminSideNavPanel from "../../../../Components/admin/layout/AdminSideNav"
import ButtonFull from "../../../../Components/buttons/ButtonFull"
import TextCard from "../../../../Components/texts/TextCard";
import { useState } from "react";
import { toast } from "react-toastify";
import MyTable from "../../../../Components/tables/MyTable";
import { parse } from "cookie";
import axiosInstance from "../../../../Utils/axiosConfig";
import OrderTrainSubscriberDataModal from "../../../../Components/modals/order-train/OrderTrainSubscriberDataModal";
import { closeOpenOrderByVendorAction, markOpenOrderAsCancelledAction, markOpenOrderAsCompletedAction, markOpenOrderAsReadyByVendorAction, markOpenOrderAsRejectedAction } from "../../../../requests/orderTrain/orderTrain.request";

interface IShowOrderPageProps {
    order: any;
    subscribers: any[];
}

const ShowOrder = ({order, subscribers}: IShowOrderPageProps) => {
    const router = useRouter();
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedSubscriberOrder, setSelectedSubscriberOrder] = useState<any>({});
    const [showOrderDataModal, setShowOrderDataModal] = useState(false);

    const updateOrderStatus = async() => {
        setLoading(true);
        if(!status) return toast.error('Select a status');
        
        let req: any;

        switch (status) {
            case 'completed':
                req = markOpenOrderAsCompletedAction(order.id);
            break;
            case 'cancelled':
                req = markOpenOrderAsCancelledAction(order.id);
            break;
            case 'rejected':
                req = markOpenOrderAsRejectedAction(order.id);
            break;
            case 'ready':
                req = markOpenOrderAsReadyByVendorAction(order.id, '');
            break;
            case 'closed':
                req = closeOpenOrderByVendorAction(order.id, '');
            break;
            default:
                break;
        }
        
        await req.then((response: any) => {
            if(response.status === 202) {
                toast.success('Status updated');
            }
        })
        .catch((error: any) => {
            console.log({error});
            toast.error(error?.response?.data?.message || 'Error try again later');
        })
        .finally(() => setLoading(false));
    }
    
  return (
    <div className="min-h-screen bg-gray-100 overflow-scroll flex flex-row relative">
        {
            showOrderDataModal && <OrderTrainSubscriberDataModal 
                data={selectedSubscriberOrder}
                setShow={() => setShowOrderDataModal(false)}
            />
        }
        <AdminSideNavPanel />
        <div className="min-h-screen bg-gray-100 flex flex-col gap-6 w-full md:w-[80%] absolute right-0 md:left-[20%] rounded-md">
            <div className='flex flex-col bg-white mt-6 rounded-md'>
                <div className="flex flex-row justify-between items-center border-b border-gray-200 py-4 px-4">
                    <h2 className="text-xl font-semibold align-center align-baseline my-auto capitalize">{order?.id}</h2>
                    <div className="flex flex-row gap-4 items-center">
                        <p className="text-orange-700 font-medium mb-0">Status:</p>
                        <select 
                            className="bg-gray-100 px-4 py-2 rounded-xl"
                            onChange={(e)=>setStatus(e.target?.value)}
                        >
                            <option value={'ready'}>Ready</option>
                            <option value={'closed'}>Closed</option>
                            <option value={'completed'}>Completed</option>
                            <option value={'rejected'}>Rejected</option>
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
                    <div className="flex flex-col gap-1 border-b-4 border-gray-100">
                        <p className="text-slate-600 font-semibold px-4">Order Details</p>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <TextCard label="Product Name" value={order?.product_name} />
                            <TextCard label="Price" value={order?.open_order_price} />
                            <TextCard label="Next Price" value={order?.next_price} />
                            <TextCard label="Discount" value={order?.open_order_discount} />
                            <TextCard label="Next Discount" value={order?.next_discount} />
                            <TextCard label="Stock" value={order?.stock} />
                            <TextCard label="Status" value={order?.status} />
                            <TextCard label="Insurance fee" value={order?.order_insurance_fee} />
                            <TextCard label="Service fee" value={order?.order_service_fee} />
                            <TextCard label="Delivery fee" value={order?.order_delivery_fee} />
                            <TextCard label="Coupons" value={order?.order_coupons} />
                        </div>
                    </div>

                    <div className='flex flex-col bg-white mt-6 rounded-md border-b-4 border-gray-100'>
                        <div className="flex flex-row justify-between items-center px-4">
                            <h4 className="text-base text-slate-700 font-semibold">Vendor</h4>
                            <p 
                                onClick={()=>router.push(`/admin/stores/${order?.vendor_id}`)}
                                className="text-smcursor-pointer hover:text-orange-500 font-medium px-4 py-2 border border-orange-600 text-orange-600 rounded-xl"
                            >
                                View
                            </p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
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

                    <div className="flex flex-col gap-1 bg-white  border-b-4 border-gray-100">
                        <p className="text-slate-600 font-semibold px-4">Customers</p>
                        <div className="mt-4">
                            <MyTable
                                headings={['id', 'customer_name', 'quantity', 'open_order_price_paid', 'order_delivery_fee', 'order_amount', 'order_service_fee', 'status', 'created_at']}
                                content={
                                    subscribers?.map((subscriber: any, index: number) => ({
                                        ...subscriber,
                                        id: subscriber?.id,
                                        customer_name: subscriber?.name,
                                        quantity: subscriber?.quantity,
                                        created_at: subscriber?.created_at
                                    }))
                                }
                                onRowButtonClick={(data: any) => {
                                    setSelectedSubscriberOrder(data);
                                    setShowOrderDataModal(true);
                                }}
                            />
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
        const getOrder = await axiosInstance.get(`/api/open-order/show?id=${id}&properties=1`, {
            headers: { Authorization: token }
        });

        const getOrderSubscribers = await axiosInstance.get(`/api/open-order/subscribers?id=${id}`, {
            headers: { Authorization: token }
        });

        const [orderResult, subscribersResult] = await Promise.allSettled([
            getOrder,
            getOrderSubscribers
        ]);

        const order = orderResult.status === 'fulfilled' ? orderResult?.value?.data : [];
        const subscribers = subscribersResult.status === 'fulfilled' ? subscribersResult?.value?.data : [];
        
        return {
            props: {
                order: order?.data,
                subscribers: subscribers?.data?.subscribers_list
            }
        }

    } catch(error: any) {
        console.log({error})
        if(error?.response?.status === 401 || error?.response?.status === 403) {
            return {
                redirect: {
                  destination: '/auth/signIn',
                  permanent: false
                }
            }
        }

        return {
            props: {
                order: {},
                subscribers: []
            }
        }
    }
}