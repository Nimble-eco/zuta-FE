import { useRouter } from "next/router"
import AdminSideNavPanel from "../../../Components/admin/layout/AdminSideNav"
import ButtonFull from "../../../Components/buttons/ButtonFull"
import TextCard from "../../../Components/texts/TextCard"
import { useState } from "react"
import { toast } from "react-toastify"
import axiosInstance from "../../../Utils/axiosConfig"
import { parse } from "cookie"
import { confirmPaymentAction, unconfirmPaymentAction } from "../../../requests/payments/payments.request"

interface IShowTransactionPageProps {
    payment: any;
}

const showTransaction = ({payment}: IShowTransactionPageProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const confirmPayment = async() => {
        setIsLoading(true)
  
        await confirmPaymentAction(payment.id)
        .then((response) => {
            if(response.status === 202) {
              toast.success('Payment status confirmed');
            }
        })
        .catch(error => {
            console.log({error});
            toast.error(error?.response?.data?.message || 'Error try again later');
        })
        .finally(() => setIsLoading(false));
    }

    const unconfirmPayment = async() => {
        setIsLoading(true)
  
        await unconfirmPaymentAction(payment.id)
        .then((response) => {
            if(response.status === 202) {
              toast.success('Payment status unconfirmed');
            }
        })
        .catch(error => {
            console.log({error});
            toast.error(error?.response?.data?.message || 'Error try again later');
        })
        .finally(() => setIsLoading(false));
    }

    return (
        <div className="min-h-screen bg-gray-100 overflow-scroll flex flex-row relative">
            <AdminSideNavPanel />
            <div className="min-h-screen bg-gray-100 flex flex-col gap-6 w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%] rounded-md px-4">
                <div className='flex flex-col bg-white rounded-md mt-20 lg:mt-6'>
                    <div className="flex flex-row justify-between items-center border-b border-gray-200 py-4 px-4">
                        <h2 className="text-xl font-semibold align-center align-baseline my-auto capitalize">{payment.id}</h2>
                        <div className="flex flex-row ">
                            <div className="ml-3">
                                {
                                    payment?.payment_confirmed ?
                                    <ButtonFull
                                        action="Unconfirm Payment"
                                        onClick={unconfirmPayment}
                                        loading={isLoading}
                                    /> :
                                    <ButtonFull
                                        action="Confirm Payment"
                                        onClick={confirmPayment}
                                        loading={isLoading}
                                    /> 
                                }
                                
                            </div>
                        </div>
                    </div>
        
                    <div className='flex flex-col'>
                        <div className='flex flex-col gap-6'>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-md bg-gray-100">
                                <TextCard label='reference' value={payment.name} />
                                <TextCard label='amount' value={payment.amount} />
                                <TextCard label='type' value={payment.type} />
                                <TextCard label='currency' value={payment.currency} />
                                <TextCard label='paid' value={payment.paid} />
                                <TextCard label='Payment confirmed' value={payment.payment_confirmed} />
                                <TextCard label='Payment Date' value={new Date(payment.payment_date).toLocaleDateString()} />
                                <TextCard label='Created On' value={new Date(payment.created_at).toLocaleDateString()} />
                            </div>
                            
                            <div className="flex flex-col gap-2 p-4 rounded-md bg-gray-100">
                                <div className="flex flex-row justify-between items-center">
                                    <h4 className="text-base text-slate-500 font-semibold">User Details</h4>
                                    <p 
                                        onClick={()=>router.push(`/admin/users/${payment?.user_id}`)}
                                        className="text-sm text-gray-800 cursor-pointer hover:text-orange-500 font-medium"
                                    >
                                        View
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <TextCard label='name' value={payment?.user?.name} />
                                    <TextCard label='email' value={payment?.user?.email} />
                                    <TextCard label='phone' value={payment?.user?.phone} />
                                    <TextCard label='gender' value={payment?.user?.gender} />
                                    <TextCard label='flag' value={payment?.user?.flag} />
                                    <TextCard label='Joined On' value={new Date(payment?.user?.created_at).toLocaleDateString()} />
                                </div>
                            </div>
                               
                            {
                                payment?.order?.id && (
                                    <div className="flex flex-col gap-2 p-4 rounded-md bg-gray-100">
                                        <div className="flex flex-row justify-between items-center">
                                            <h4 className="text-base text-slate-500 font-semibold">Order Details</h4>
                                            <p 
                                                onClick={()=>router.push(`/admin/orders/standard/${payment?.order_id}`)}
                                                className="text-sm text-gray-800 cursor-pointer hover:text-orange-500 font-medium"
                                            >
                                                View
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            <TextCard label='Product name' value={payment?.order?.product_name} />
                                            <TextCard label='Product ID' value={payment?.order?.product_id} />
                                            <TextCard label='Price' value={payment?.order?.product_price_paid} />
                                            <TextCard label='total' value={payment?.order?.order_amount} />
                                            <TextCard label='sub amount' value={payment?.order?.order_sub_amount} />
                                            <TextCard label='Discount' value={payment?.order?.product_discount} />
                                            <TextCard label='quantity' value={payment?.order?.product_quantity} />
                                            <TextCard label='status' value={payment?.order?.status} />
                                            <TextCard label='Delivery city' value={payment?.order?.recipient_city} />
                                            <TextCard label='Delivery state' value={payment?.order?.recipient_state} />
                                            <TextCard label='Created On' value={new Date(payment?.order?.created_at).toLocaleDateString()} />
                                        </div>
                                    </div>
                                )
                            }

                            {
                                payment?.openOrder?.id && (
                                    <div className="flex flex-col gap-2 p-4 rounded-md bg-gray-100">
                                        <div className="flex flex-row justify-between items-center">
                                            <h4 className="text-base text-slate-500 font-semibold">Open Order Details</h4>
                                            <p 
                                                onClick={()=>router.push(`/admin/orders/order-train/${payment?.open_order_id}`)}
                                                className="text-sm text-gray-800 cursor-pointer hover:text-orange-500 font-medium"
                                            >
                                                View
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            <TextCard label='Product name' value={payment?.openOrder?.product_name} />
                                            <TextCard label='Product ID' value={payment?.openOrder?.product_id} />
                                            <TextCard label='Price' value={payment?.openOrder?.open_order_price} />
                                            <TextCard label='discount' value={payment?.openOrder?.open_order_discount} />
                                            <TextCard label='stock' value={payment?.openOrder?.stock} />
                                            <TextCard label='status' value={payment?.openOrder?.status} />
                                            <TextCard label='Created On' value={new Date(payment?.openOrder?.created_at).toLocaleDateString()} />
                                        </div>
                                    </div>
                                )
                            }

                            {
                                payment?.featured_id && (
                                    <div className="flex flex-col gap-2 p-4 rounded-md bg-gray-100">
                                        <div className="flex flex-row justify-between items-center">
                                            <h4 className="text-base text-slate-500 font-semibold">Showcase Details</h4>
                                            <p 
                                                onClick={()=>router.push(`/admin/showcase/${payment?.featured_id}`)}
                                                className="text-sm text-gray-800 cursor-pointer hover:text-orange-500 font-medium"
                                            >
                                                View
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            <TextCard label='category' value={payment?.featured?.product_categories} />
                                            <TextCard label='amount' value={payment?.featured?.featured_amount} />
                                            <TextCard label='duration' value={payment?.featured?.featured_duration_in_hours} />
                                            <TextCard label='discount' value={payment?.featured?.featured_discount} />
                                            <TextCard label='start date' value={payment?.featured?.featured_start_date} />
                                            <TextCard label='end date' value={payment?.featured?.featured_end_date} />
                                            <TextCard label='activation date' value={payment?.featured?.activation_date} />
                                            <TextCard label='deactivation date' value={payment?.featured?.deactivation_date} />
                                            <TextCard label='position' value={payment?.featured?.position} />
                                            <TextCard label='paid' value={payment?.openOrder?.featured_paid} />
                                            <TextCard label='status' value={payment?.openOrder?.status} />
                                            <TextCard label='Created On' value={new Date(payment?.openOrder?.created_at).toLocaleDateString()} />
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default showTransaction;


export async function getServerSideProps(context: any) {
    const { id } = context.query;
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;
  
    try {
        const getPayment = await axiosInstance.get('/api/payment/show?id=' + id, {
            headers: {Authorization: token}
        });
        const payment = getPayment.data?.data;
  
        return {
            props: { payment }
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
            props: {payment: {}}
        }
    }
}