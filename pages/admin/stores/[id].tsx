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
          if(response.status === 202) {
              toast.success('Vendor status updated');
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
            if(response.status === 202) {
                toast.success('Vendor status updated');
            }
        })
        .catch(error => {
            console.log({error});
            toast.error(error?.response?.data?.message || 'Error try again later');
        })
        .finally(() => setIsBlockingVendor(false));
    }

    return (
        <div className="min-h-screen bg-gray-100 overflow-scroll flex flex-row relative mb-10">
            <AdminSideNavPanel />
            <div className="min-h-screen bg-gray-100 flex flex-col gap-6 w-full md:w-[80%] absolute right-0 md:left-[20%] rounded-md px-4">
                <div className='flex flex-col bg-white mt-6 rounded-md'>
                    <div className="flex flex-row justify-between items-center border-b border-gray-200 py-4 px-4">
                        <h2 className="text-xl font-semibold align-center align-baseline my-auto capitalize">{vendor.name}</h2>
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
                        <div className='flex flex-col lg:grid lg:grid-cols-2 lg:gap-4'>
                            <div className="flex flex-row w-full">
                                <div className='w-[60%] mr-[3%] md:mr-none'>
                                    <TextCard label='Name' value={vendor.vendor_name} />
                                </div>
                                <div className='w-[30%] md:w-auto md:mr-none'>
                                    <TextCard label='Email' value={vendor.vendor_email} />
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className='w-[60%] mr-[3%] md:mr-none'>
                                    <TextCard label='Phone Number' value={vendor.vendor_phone} />
                                </div>
                                <div className='w-[30%] md:w-auto md:mr-none'>
                                    <TextCard label='Product(s)' value={vendor?.product?.length} />
                                </div>
                            </div>
                        </div>
        
                        <div className='flex flex-col lg:grid lg:grid-cols-2 lg:gap-4'>
                            <div className="flex flex-row w-full">
                                <div className='w-[60%] mr-[3%] md:mr-none'>
                                    <TextCard label='address' value={vendor.vendor_address} />
                                </div>
                                <div className='w-[30%] md:w-auto md:mr-none'>
                                    <TextCard label='City' value={vendor.vendor_city} />
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className='w-[60%] mr-[3%] md:mr-none'>
                                    <TextCard label='State' value={vendor.vendor_state} />
                                </div>
                                <div className='w-[30%] md:w-auto md:mr-none'>
                                    <TextCard label='Country' value={vendor.vendor_country} />
                                </div>
                            </div>
                        </div>
        
                        <div className='flex flex-col lg:grid lg:grid-cols-2 lg:gap-4'>
                            <div className="flex flex-row w-full">
                                <div className='w-[60%] md:mr-none'>
                                    <TextCard label='Orders' value={vendor.order?.length} />
                                </div>
                                <div className='w-[30%] md:w-auto md:mr-none'>
                                    <TextCard label='Order Trains' value={vendor.openOrder?.length} />
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className='w-[60%] mr-[3%] md:mr-none'>
                                    <TextCard label='Flag(s)' value={vendor.flags} />
                                </div>
                                <div className='w-[60%] mr-[3%] md:mr-none'>
                                    <TextCard label='Management Approved' value={vendor.management_approved ? 'True' : 'False'} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col bg-white mt-6 rounded-md p-4'>
                    <div className="flex flex-row justify-between items-center">
                        <h4 className="text-base text-slate-700 font-semibold">User</h4>
                        <p 
                            onClick={()=>router.push(`/admin/user/${vendor.user_id}`)}
                            className="text-sm text-gray-800 cursor-pointer hover:text-orange-500 font-medium"
                        >
                            View
                        </p>
                    </div>
                    <div className="gird grid-cols-2 lg:grid-cols-4 gap-4">
                        <TextCard label="Name" value={vendor?.user?.name} />
                        <TextCard label="Email" value={vendor?.user?.email} />
                        <TextCard label="Phone Number" value={vendor?.user?.phone} />
                        <TextCard label="Gender" value={vendor?.user?.gender} />
                    </div>
                </div>
        
                <div className="flex flex-col gap-4 bg-white rounded-md">
                    <div className="flex flex-row gap-4 text-gray-600 mt-8 pl-4 items-center">
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
                                headings={['sn', 'Vendor_price_paid', 'quantity', 'order_amount', 'order_sub_amount', 'order_delivery_fee', 'order_service_fee', 'order_payment_method', 'order_paid', 'order_payment_confirmed', 'created_at']}
                                content={vendor?.orders?.map((order: any, index: number) => ({
                                    ...order,
                                    id: order.id,
                                    sn: index + 1,
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
                                content={vendor?.openOrders?.map((order: any, index: number) => ({
                                    ...order,
                                    id: order.id,
                                    sn: index + 1,
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
                                content={vendor?.products?.map((product: any, index: number) => ({
                                    ...product,
                                    id: product.id,
                                    sn: index + 1,
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