import { useRouter } from "next/router"
import AdminSideNavPanel from "../../../Components/admin/layout/AdminSideNav"
import ButtonFull from "../../../Components/buttons/ButtonFull"
import MyTable from "../../../Components/tables/MyTable"
import TextCard from "../../../Components/texts/TextCard"
import { useState } from "react"
import { toast } from "react-toastify"
import { managementApproveProductAction, managementUnApproveProductAction } from "../../../requests/products/products.request"
import axiosInstance from "../../../Utils/axiosConfig"
import { parse } from "cookie"

interface IShowProductPageProps {
    product: any;
}

const showProduct = ({product}: IShowProductPageProps) => {
    const router = useRouter();
    const [orderTab, setOrderTab] = useState('order');
    const [isBlockingProduct, setIsBlockingProduct] = useState(false);

    const unApproveProduct = async() => {
      setIsBlockingProduct(true)
  
      await managementUnApproveProductAction(product.id)
      .then((response) => {
          if(response.status === 202) {
              toast.success('Product status updated');
          }
      })
      .catch(error => {
        console.log({error});
        toast.error(error?.response?.data?.message || 'Error try again later');
      })
      .finally(() => setIsBlockingProduct(false));
    }

    const approveProduct = async() => {
      setIsBlockingProduct(true)
  
        await managementApproveProductAction(product.id)
        .then((response) => {
            if(response.status === 202) {
                toast.success('Product status updated');
            }
        })
        .catch(error => {
            console.log({error});
            toast.error(error?.response?.data?.message || 'Error try again later');
        })
        .finally(() => setIsBlockingProduct(false));
    }

    return (
        <div className="min-h-screen bg-gray-100 overflow-scroll flex flex-row relative mb-10">
            <AdminSideNavPanel />
            <div className="min-h-screen bg-gray-100 flex flex-col gap-6 w-full md:w-[80%] absolute right-0 md:left-[20%] rounded-md px-4">
                <div className='flex flex-col bg-white mt-6 rounded-md'>
                    <div className="flex flex-row justify-between items-center border-b border-gray-200 py-4 px-4">
                        <h2 className="text-xl font-semibold align-center align-baseline my-auto capitalize">{product.name}</h2>
                        <div className="flex flex-row ">
                            <div className="ml-3">
                                {
                                    product?.management_approved ?
                                    <ButtonFull
                                        action="Un-approve"
                                        onClick={unApproveProduct}
                                        loading={isBlockingProduct}
                                    /> :
                                    <ButtonFull
                                        action="Approve"
                                        onClick={approveProduct}
                                        loading={isBlockingProduct}
                                    /> 
                                }
                                
                            </div>
                        </div>
                    </div>
        
                    <div className='flex flex-col'>
                        <div className='flex flex-col lg:grid lg:grid-cols-2 lg:gap-4'>
                            <div className="flex flex-row w-full">
                                <div className='w-[60%] mr-[3%] md:mr-none'>
                                    <TextCard label='Name' value={product.name} />
                                </div>
                                <div className='w-[30%] md:w-auto md:mr-none'>
                                    <TextCard label='Quantity' value={product.quantity} />
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className='w-[60%] mr-[3%] md:mr-none'>
                                    <TextCard label='Price' value={product.product_price} />
                                </div>
                                <div className='w-[30%] md:w-auto md:mr-none'>
                                    <TextCard label='Discount' value={product.product_discount} />
                                </div>
                            </div>
                        </div>
        
                        <div className='flex flex-col lg:grid lg:grid-cols-2 lg:gap-4'>
                            <div className="flex flex-row w-full">
                                <div className='w-[60%] mr-[3%] md:mr-none'>
                                    <TextCard label='Status' value={product.status} />
                                </div>
                                <div className='w-[30%] md:w-auto md:mr-none'>
                                    <TextCard label='Featured' value={product.featured_status} />
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className='w-[60%] mr-[3%] md:mr-none'>
                                    <TextCard label='Category(s}' value={product.product_categories} />
                                </div>
                                <div className='w-[30%] md:w-auto md:mr-none'>
                                    <TextCard label='Tag(s)' value={product.product_tags} />
                                </div>
                            </div>
                        </div>
        
                        <div className='flex flex-col lg:grid lg:grid-cols-2 lg:gap-4'>
                            <div className="flex flex-row w-full">
                                <div className='w-[60%] md:mr-none'>
                                    <TextCard label='Orders' value={product.orders?.length} />
                                </div>
                                <div className='w-[30%] md:w-auto md:mr-none'>
                                    <TextCard label='Order Trains' value={product.openOrders?.length} />
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className='w-[60%] mr-[3%] md:mr-none'>
                                    <TextCard label='Vendor Approved' value={product.vendor_approved ? 'True' : 'False'} />
                                </div>
                                <div className='w-[60%] mr-[3%] md:mr-none'>
                                    <TextCard label='Management Approved' value={product.management_approved ? 'True' : 'False'} />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col lg:grid lg:grid-cols-2 lg:gap-4'>
                            <div className="flex flex-row w-full">
                                <div className='w-[30%] md:w-auto md:mr-none'>
                                    <TextCard label='Flag(s)' value={product.flags} />
                                </div>
                                <div className='w-[30%] md:w-auto md:mr-none'>
                                    <TextCard label='View(s)' value={product.views?.length} />
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className='w-[60%] mr-[3%] md:mr-none'>
                                    <TextCard label='Reviews' value={product.reviews?.length} />
                                </div>
                                <div className='w-[60%] mr-[3%] md:mr-none'></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col bg-white mt-6 rounded-md p-4'>
                    <div className="flex flex-row justify-between items-center">
                        <h4 className="text-base text-slate-700 font-semibold">Vendor</h4>
                        <p 
                            onClick={()=>router.push(`/admin/stores/${product.vendor_id}`)}
                            className="text-sm text-gray-800 cursor-pointer hover:text-orange-500 font-medium"
                        >
                            View
                        </p>
                    </div>
                    <div className="gird grid-cols-2 lg:grid-cols-4 gap-4">
                        <TextCard label="Name" value={product?.vendor?.vendor_name} />
                        <TextCard label="Email" value={product?.vendor?.vendor_email} />
                        <TextCard label="Phone Number" value={product?.vendor?.vendor_phone} />
                        <TextCard label="City" value={product?.vendor?.vendor_city} />
                        <TextCard label="State" value={product?.vendor?.vendor_state} />
                        <TextCard label="Country" value={product?.vendor?.vendor_country} />
                        <TextCard label="Flag(s)" value={product?.vendor?.vendor_flag} />
                    </div>
                </div>

                {
                    product?.featured ? 
                    <div className='flex flex-col bg-white mt-6 rounded-md p-4'>
                        <div className="flex flex-row justify-between items-center">
                            <h4 className="text-base text-slate-700 font-semibold">Showcase</h4>
                            <p 
                                onClick={()=>router.push(`/admin/showcase/${product.id}`)}
                                className="text-sm text-gray-800 cursor-pointer hover:text-orange-500 font-medium"
                            >
                                View
                            </p>
                        </div>
                        <div className="gird grid-cols-2 lg:grid-cols-4 gap-4">
                            <TextCard label="Amount" value={product?.featured?.featured_amount} />
                            <TextCard label="Duration" value={product?.featured?.featured_duration_in_hours} />
                            <TextCard label="Status" value={product?.featured?.status} />
                            <TextCard label="Activation Date" value={product?.featured?.activation_date} />
                            <TextCard label="Deactivation Date" value={product?.featured?.deactivation_date} />
                            <TextCard label="Paid" value={product?.featured?.featured_paid ? 'True' : 'False'} />
                        </div>
                    </div> : 
                    <div className='bg-white py-6 px-4 rounded-md flex flex-row justify-between items-center'>
                        <h4 className="text-base text-slate-700 font-semibold">Showcase</h4>
                        <p 
                            onClick={()=>router.push(`/admin/showcase/create/${product.id}`)}
                            className="text-sm text-gray-800 cursor-pointer hover:text-orange-500 font-medium"
                        >
                            Showcase Product
                        </p>
                    </div>
                }
        
                <div className="flex flex-col gap-4 bg-white rounded-md">
                    <div className="flex flex-row gap-4 text-gray-600 mt-8 pl-4 items-center">
                        <h4 className={`font-medium ${orderTab === 'order' && 'text-orange-700 text-lg font-semibold'} cursor-pointer`} onClick={()=>setOrderTab('order')}>Orders</h4>
                        <h4 className={`font-medium ${orderTab === 'train' && 'text-orange-700 text-lg font-semibold'} cursor-pointer`} onClick={()=>setOrderTab('train')}>Order Train</h4>
                    </div>
        
                    {
                        orderTab === 'order' &&
                        <div className="flex flex-col pb-8 bg-white overflow-y-auto">
                            <MyTable
                                headings={['sn', 'product_price_paid', 'quantity', 'order_amount', 'order_sub_amount', 'order_delivery_fee', 'order_service_fee', 'order_payment_method', 'order_paid', 'order_payment_confirmed', 'created_at']}
                                content={product?.orders?.map((order: any, index: number) => ({
                                    ...order,
                                    id: order.id,
                                    sn: index + 1,
                                    order_payment_confirmed: order.order_payment_confirmed ? 'True' : 'False',
                                    created_at: new Date(order.created_at).toDateString(),
                                }))} 
                                onRowButtonClick={(order: any) => router.push(`orders/${order.id}`)}
                            />
                        </div>
                    }
        
                    {
                        orderTab === 'train' &&
                        <div className="flex flex-col pb-8 bg-white overflow-y-auto">
                            <MyTable
                                headings={['sn', 'open_order_price', 'open_order_discount', 'status', 'created_at']}
                                content={product?.openOrders?.map((order: any, index: number) => ({
                                    ...order,
                                    id: order.id,
                                    sn: index + 1,
                                    created_at: new Date(order.created_at).toDateString()
                                }))} 
                                onRowButtonClick={(order: any) => router.push(`orders/${order.id}`)}
                            />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default showProduct;


export async function getServerSideProps(context: any) {
    const { id } = context.query;
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;
  
    try {
        const getMyProduct = await axiosInstance.get('/api/product/show?id=' + id, {
            headers: {Authorization: token}
        });
        const product = getMyProduct.data?.data;
  
        return {
            props: { product }
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
            props: {product: {}}
        }
    }
}