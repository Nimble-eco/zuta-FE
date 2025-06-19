import { useRouter } from "next/router"
import AdminSideNavPanel from "../../../../Components/admin/layout/AdminSideNav"
import StatsCard from "../../../../Components/cards/StatsCard"
import FilterAndSearchGroup from "../../../../Components/inputs/FilterAndSearchGroup"
import { useState } from "react"
import MyTable from "../../../../Components/tables/MyTable"
import { toast } from "react-toastify"
import { parse } from "cookie"
import axiosInstance from "../../../../Utils/axiosConfig"
import { filterOrderAction } from "../../../../requests/order/order.request"
import FilterContainer from "../../../../Components/modals/containers/FilterContainer"
import MyDropDownInput from "../../../../Components/inputs/MyDropDownInput"
import TextInput from "../../../../Components/inputs/MyTextInput"
import AdminNavBar from "../../../../Components/admin/layout/AdminNavBar"

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
        quantity: 0,
        order_amount: 0,
        status: '',
        vendor_id: '',
        recipient_city: '',
        recipient_state: '',
        recipient_country: '',
        recipient_zip: '',
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
            await filterOrderAction({pagination: paginator?.current_page - 1})
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
            await filterOrderAction({pagination: paginator?.current_page + 1})
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
                        label="Product ID"
                        name="product_id"
                        value={filterByDetails.product_id}
                        handleChange={handleFilterByDetailsChange}
                    />,

                    <TextInput
                        label="User ID"
                        name="user_id"
                        value={filterByDetails.user_id}
                        handleChange={handleFilterByDetailsChange}
                    />,

                    <TextInput
                        label="vendor ID"
                        name="vendor_id"
                        value={filterByDetails.vendor_id}
                        handleChange={handleFilterByDetailsChange}
                    />,

                    <TextInput
                        label="recipient city"
                        name="recipient_city"
                        value={filterByDetails.recipient_city}
                        handleChange={handleFilterByDetailsChange}
                    />,

                    <TextInput
                        label="recipient state"
                        name="recipient_state"
                        value={filterByDetails.recipient_state}
                        handleChange={handleFilterByDetailsChange}
                    />,

                    <TextInput
                        label="recipient country"
                        name="recipient_country"
                        value={filterByDetails.recipient_country}
                        handleChange={handleFilterByDetailsChange}
                    />,

                    <MyDropDownInput 
                        label="Status"
                        onSelect={handleFilterByDetailsChange}
                        name="status"
                        options={[
                            {title: 'pending', value: 'pending'},
                            {title: 'shipped', value: 'shipped'},
                            {title: 'unshipped', value: 'unshipped'},
                            {title: 'delivered', value: 'delivered'},
                            {title: 'closed', value: 'closed'},
                            {title: 'cancelled', value: 'cancelled'},
                        ]}
                        value={filterByDetails.status}
                    /> 
                ]}
            />
        }
        <div className="flex flex-row w-full mx-auto relative mb-10">
            <AdminSideNavPanel />
            <div className="flex flex-col w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%] !px-2 lg:!px-0">
                <AdminNavBar />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 mt-20 lg:mt-0">
                    <StatsCard
                        title='All Orders'
                        value={orders.data?.meta?.total ?? 0}
                    />
                </div>

                <h2 className="text-2xl font-bold text-slate-700 pt-4 px-4 bg-white mb-0">Standard Orders</h2>
                <div className="flex flex-row text-sm font-semibold !text-gray-400 px-4 bg-white pt-2">
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
                        headings={['product_name', 'quantity', 'price', 'status', 'order_amount', 'order_paid', 'state', 'country']}
                        content={ordersData?.data?.data?.map((order: any) => ({
                            ...order,
                            id: order.id,
                            product_name: order.product_name,
                            quantity: order.quantity,
                            price: order.product_price_paid,
                            status: order.status,
                            state: order.recipient_state,
                            country: order.recipient_country
                        }))} 
                        onRowButtonClick={(order: any) => router.push(`standard/${order.id}`)}
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
        const getAllOrders = await axiosInstance.get('/api/order/index?properties=1', {
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