import { useRouter } from "next/router"
import AdminSideNavPanel from "../../../../Components/admin/layout/AdminSideNav"
import StatsCard from "../../../../Components/cards/StatsCard"
import FilterAndSearchGroup from "../../../../Components/inputs/FilterAndSearchGroup"
import { useState } from "react"
import MyTable from "../../../../Components/tables/MyTable"
import { toast } from "react-toastify"
import { parse } from "cookie"
import axiosInstance from "../../../../Utils/axiosConfig"
import FilterContainer from "../../../../Components/modals/containers/FilterContainer"
import MyDropDownInput from "../../../../Components/inputs/MyDropDownInput"
import TextInput from "../../../../Components/inputs/MyTextInput"
import { filterOrderTrainByVendorAction } from "../../../../requests/orderTrain/orderTrain.request"
import { formatAmount } from "../../../../Utils/formatAmount"

interface IStandardOrdersIndexPageProps {
    orders: any
}

const index = ({orders}: IStandardOrdersIndexPageProps) => {
    const [ordersData, setOrdersData] = useState(orders);
    const router = useRouter();
    const [showFilterInput, setShowFilterInput] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const [filterByDetails, setFilterByDetails] = useState({
        user_id: '',
        product_name: '',
        product_id: '',
        status: '',
        vendor_id: '',
        start_date: '',
        end_date: '',
    });
    
    const handleFilterByDetailsChange = (e: any) => {
        setFilterByDetails((prevState) => ({
            ...prevState,
            [e.target.name] : e.target.value
        }))
    }

    
    const paginateData = async (paginator: any, direction: 'prev' | 'next') => {
        if(direction === 'prev' && paginator?.previous_page_url) {
            setLoading(true);
            await filterOrderTrainByVendorAction({pagination: paginator?.current_page - 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setOrdersData(response.data?.data);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setOrdersData({});
                }
            })
            .catch((error: any) => {
                console.log({error});
                toast.error(error.response?.data?.message || 'Error try again later');
            })
            .finally(() => {
                setLoading(false);
                setShowFilterInput(false);
            });
        }

        if(direction === 'next' && paginator?.next_page_url) {
            setLoading(true);
            await filterOrderTrainByVendorAction({pagination: paginator?.current_page + 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setOrdersData(response.data?.data);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setOrdersData({});
                }
            })
            .catch((error: any) => {
                console.log({error});
                toast.error(error.response?.data?.message || 'Error try again later');
            })
            .finally(() => {
                setLoading(false);
                setShowFilterInput(false);
            });
        }
    }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-scroll">
        {
            showFilterInput && <FilterContainer 
                show={showFilterInput}
                setShow={() => setShowFilterInput(!showFilterInput)}
                onFilter={()=>{}}
                isLoading={loading}
                children={[
                    <TextInput
                        label="Product name"
                        name="product_name"
                        value={filterByDetails.product_name}
                        handleChange={handleFilterByDetailsChange}
                    />,

                    <TextInput
                        label="Product id"
                        name="product_id"
                        value={filterByDetails.product_id}
                        handleChange={handleFilterByDetailsChange}
                    />,

                    <TextInput
                        label="User id"
                        name="user_id"
                        value={filterByDetails.user_id}
                        handleChange={handleFilterByDetailsChange}
                    />,

                    <TextInput
                        label="vendor id"
                        name="vendor_id"
                        value={filterByDetails.vendor_id}
                        handleChange={handleFilterByDetailsChange}
                    />,

                    <MyDropDownInput 
                        label="Status"
                        onSelect={handleFilterByDetailsChange}
                        name="status"
                        options={[
                            {title: 'open', value: 'open'},
                            {title: 'closed', value: 'closed'},
                            {title: 'cancelled', value: 'cancelled'},
                            {title: 'rejected', value: 'rejected'},
                            {title: 'completed', value: 'completed'},
                        ]}
                        value={filterByDetails.status}
                    /> 
                ]}
            />
        }
        <div className="flex flex-row w-full mx-auto mt-8 relative mb-10">
            <AdminSideNavPanel />
            <div className="flex flex-col w-[80%] absolute right-0 left-[21%]">
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <StatsCard
                        title='All Orders'
                        value={orders.data?.meta?.total ?? 0}
                    />
                </div>

                <h2 className="text-2xl font-bold text-slate-700 pt-4 px-4 bg-white mb-0">Order Train</h2>
                <div className="flex flex-row text-sm font-semibold !text-gray-400 px-4 pt-2 bg-white">
                    <a href="#0" className="hover:!text-orange-500 mr-3">
                        Active
                    </a>
                    <a href="#0" className="hover:!text-orange-500 mr-3">
                        Pending
                    </a>
                    <a href="#0" className="hover:!text-orange-500 mr-3">
                        Inactive
                    </a>
                    <a href="#0" className="hover:!text-orange-500 mr-3">
                        Featured
                    </a>
                </div>

                
                <div className="flex flex-row py-3 px-4 relative bg-white justify-between">
                    <FilterAndSearchGroup 
                        searchInputPlaceHolder="Search product name, recipient address, city, state or payment method"
                        onSearch={()=>{}}
                        onFilterButtonClick={() => setShowFilterInput(!showFilterInput)}
                        isSearching={loading}
                    />
                </div>

                {/* OORDERS TABLE */}
                <div className="flex flex-col pb-8 bg-white overflow-y-auto">
                    <MyTable
                        headings={['product_name', 'quantity', 'price', 'next_price', 'next_discount', 'status', 'stock',]}
                        content={ordersData?.data?.data?.map((order: any) => ({
                            ...order,
                            product_name: order.product_name,
                            quantity: order.orderCount,
                            price: formatAmount(order.open_order_price),
                            next_price: formatAmount(order.next_price),
                            next_discount: formatAmount(order.next_discount),
                            status: order.status,
                        }))} 
                        onRowButtonClick={(order: any) => router.push(`order-train/${order.id}`)}
                    />
                    <div className='flex flex-row justify-end text-sm w-[80%] mx-auto'>
                        <button onClick={() => paginateData(ordersData?.data?.meta, 'prev')} className='mr-3 cursor-pointer'>Previous</button>
                        <p className="text-base px-2 my-auto">{ordersData?.data?.meta?.current_page}</p>
                        <button onClick={() => paginateData(ordersData?.data?.meta, 'next')} className='mr-3 cursor-pointer'>Next</button>
                    </div>
                </div>

            </div>
        </div>

    </div>
  )
}

export default index

export async function getServerSideProps(context: any) {
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;

    try {
        const getAllOrders = await axiosInstance.get('/api/open-order/index?properties=1', {
            headers: {
                Authorization: token,
                // team: user?.vendor
            }
        });

        const [ordersResult] = await Promise.allSettled([
            getAllOrders
        ]);

        const orders = ordersResult.status === 'fulfilled' ? ordersResult?.value?.data : [];
        console.log({orders})
        return {
            props: {
                orders
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
                orders: {}
            }
        }
    }
}