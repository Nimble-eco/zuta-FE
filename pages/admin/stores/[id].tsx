import { useRouter } from "next/router"
import AdminSideNavPanel from "../../../Components/admin/layout/AdminSideNav"
import ButtonFull from "../../../Components/buttons/ButtonFull"
import MyTable from "../../../Components/tables/MyTable"
import TextCard from "../../../Components/texts/TextCard"
import { useState } from "react"
import { toast } from "react-toastify"
import { managementApproveVendorAction, managementUnApproveVendorAction } from "../../../requests/vendor/vendor.request"
import axiosInstance from "../../../Utils/axiosConfig"
import { parse } from "cookie"
import { toIntNumberFormat } from "../../../Utils/helper"
import AdminNavBar from "../../../Components/admin/layout/AdminNavBar"

interface IShowVendorPageProps {
    vendor: any;
}

const showVendor = ({vendor}: IShowVendorPageProps) => {
    const router = useRouter();
    const [orderTab, setOrderTab] = useState('order');
    const [isBlockingVendor, setIsBlockingVendor] = useState(false);

    const unApproveVendor = async() => {
      setIsBlockingVendor(true)
  
        await managementUnApproveVendorAction(vendor.id)
        .then((response) => {
            if(response.status === 200) {
                toast.success('Vendor status updated');
                setTimeout(()=>window.location.reload(), 3000);
            }
        })
        .catch(error => {
            console.log({error});
            toast.error(error?.response?.data?.message || 'Error try again later');
        })
        .finally(() => setIsBlockingVendor(false));
    }

    const approveVendor = async() => {
      setIsBlockingVendor(true)
  
        await managementApproveVendorAction(vendor.id)
        .then((response) => {
            if(response.status === 200) {
                toast.success('Vendor status updated');
                setTimeout(()=>window.location.reload(), 3000);
            }
        })
        .catch(error => {
            console.log({error});
            toast.error(error?.response?.data?.message || 'Error try again later');
        })
        .finally(() => setIsBlockingVendor(false));
    }

    return (
        <div className="min-h-screen bg-gray-100 overflow-scroll flex flex-row relative">
            <AdminSideNavPanel />
            <div className="min-h-screen bg-gray-100 flex flex-col gap-6 w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%] rounded-md !px-2 lg:!px-0">
                <AdminNavBar />
                <div className='flex flex-col bg-white rounded-md mt-20 lg:mt-6'>
                    <div className="flex flex-row justify-between items-center border-b border-gray-200 py-4 px-4">
                        <h2 className="text-xl font-semibold align-center align-baseline my-auto capitalize">{vendor.vendor_name}</h2>
                        <div className="flex flex-row ">
                            <div className="ml-3">
                                {
                                    vendor?.management_approved ?
                                    <ButtonFull
                                        action="Un-approve"
                                        onClick={unApproveVendor}
                                        loading={isBlockingVendor}
                                    /> :
                                    <ButtonFull
                                        action="Approve"
                                        onClick={approveVendor}
                                        loading={isBlockingVendor}
                                    /> 
                                }
                                
                            </div>
                        </div>
                    </div>
        
                    <div className='flex flex-col'>
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
                            <TextCard label='Name' value={vendor.vendor_name} />
                            <TextCard label='Email' value={vendor.vendor_email} />
                            <TextCard label='Phone Number' value={vendor.vendor_phone} />
                            <TextCard label='Product(s)' value={vendor?.product?.length} />
                            <TextCard label='address' value={vendor.vendor_address} />
                            <TextCard label='City' value={vendor.vendor_city} />
                            <TextCard label='State' value={vendor.vendor_state} />
                            <TextCard label='Country' value={vendor.vendor_country} />
                            <TextCard label='Orders' value={vendor.order?.length} />
                            <TextCard label='Order Trains' value={vendor.openOrder?.length} />
                            <TextCard label='Flag(s)' value={vendor.flags} />
                            <TextCard label='Management Approved' value={vendor.management_approved ? 'True' : 'False'} />
                            <TextCard label='User Approved' value={vendor.user_approved ? 'True' : 'False'} />
                            <TextCard label='Visibility' value={vendor.visibility} />
                        </div>
                    </div>
                </div>

                <div className='flex flex-col bg-white mt-4 rounded-md p-4'>
                    <div className="flex flex-row justify-between items-center px-4">
                        <h4 className="text-xl text-slate-700 font-semibold">User</h4>
                        <p 
                            onClick={()=>router.push(`/admin/user/${vendor.user_id}`)}
                            className="text-sm text-orange-600 cursor-pointer hover:text-orange-500 font-medium px-4 py-1 border-orange-600 border rounded-xl"
                        >
                            View
                        </p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <TextCard label="Name" value={vendor?.user?.name} />
                        <TextCard label="Email" value={vendor?.user?.email} />
                        <TextCard label="Phone Number" value={vendor?.user?.phone} />
                        <TextCard label="Gender" value={vendor?.user?.gender} />
                    </div>
                </div>
        
                <div className="flex flex-col gap-4 bg-white rounded-md">
                    <div className="flex flex-row gap-4 text-gray-600 mt-8 pl-4 !text-base items-center">
                        <h4 className={`font-medium ${orderTab === 'order' && 'text-orange-700 text-lg font-semibold'} cursor-pointer`} onClick={()=>setOrderTab('order')}>Orders</h4>
                        <h4 className={`font-medium ${orderTab === 'train' && 'text-orange-700 text-lg font-semibold'} cursor-pointer`} onClick={()=>setOrderTab('train')}>Order Train</h4>
                        <h4 
                            className={`font-medium ${orderTab === 'products' && 'text-orange-700 text-lg font-semibold'} cursor-pointer`} 
                            onClick={()=>setOrderTab('products')}
                        >
                            Products
                        </h4>
                    </div>
        
                    {
                        orderTab === 'order' &&
                        <div className="flex flex-col pb-8 bg-white overflow-y-auto">
                            <MyTable
                                headings={['sn', 'quantity', 'order_amount', 'order_sub_amount', 'order_delivery_fee', 'order_service_fee', 'order_payment_method', 'order_paid', 'order_payment_confirmed', 'created_at']}
                                content={vendor?.order?.map((order: any, index: number) => ({
                                    ...order,
                                    id: order.id,
                                    sn: index + 1,
                                    order_amount: toIntNumberFormat(order?.order_amount),
                                    order_delivery_fee: toIntNumberFormat(order?.order_delivery_fee),
                                    order_service_fee: toIntNumberFormat(order?.order_service_fee),
                                    order_payment_confirmed: order.order_payment_confirmed ? 'True' : 'False',
                                    created_at: new Date(order.created_at).toDateString(),
                                }))} 
                                onRowButtonClick={(order: any) => router.push(`/admin/orders/${order.id}`)}
                            />
                        </div>
                    }
        
                    {
                        orderTab === 'train' &&
                        <div className="flex flex-col pb-8 bg-white overflow-y-auto">
                            <MyTable
                                headings={['sn', 'open_order_price', 'open_order_discount', 'status', 'created_at']}
                                content={vendor?.openOrder?.map((order: any, index: number) => ({
                                    ...order,
                                    id: order.id,
                                    sn: index + 1,
                                    open_order_price: toIntNumberFormat(order.open_order_price),
                                    open_order_discount: toIntNumberFormat(order.open_order_discount),
                                    created_at: new Date(order.created_at).toDateString()
                                }))} 
                                onRowButtonClick={(order: any) => router.push(`/admin/order-trains/${order.id}`)}
                            />
                        </div>
                    }
        
                    {
                        orderTab === 'products' &&
                        <div className="flex flex-col pb-8 bg-white overflow-y-auto">
                            <MyTable
                                headings={['sn',  'product_name', 'product_price', 'vendor_approved', 'quantity', 'management_approved', 'created_at']}
                                content={vendor?.product?.map((product: any, index: number) => ({
                                    ...product,
                                    id: product.id,
                                    sn: index + 1,
                                    management_approved: product?.management_approved ? 'True' : 'False',
                                    user_approved: product?.user_approved ? 'True' : 'False',
                                    created_at: new Date(product.created_at).toDateString()
                                }))} 
                                onRowButtonClick={(product: any) => router.push(`/admin/products/${product.id}`)}
                            />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default showVendor;

export async function getServerSideProps(context: any) {
    const { id } = context.query;
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;
  
    try {
        const getMyVendor = await axiosInstance.get('/api/vendor/show?id=' + id, {
            headers: {Authorization: token}
        });

        const vendor = getMyVendor.data?.data;
  
        return {
            props: { vendor }
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
            props: {vendor: {}}
        }
    }
}