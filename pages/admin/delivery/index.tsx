import { parse } from "cookie";
import AdminSideNavPanel from "../../../Components/admin/layout/AdminSideNav"
import axiosInstance from "../../../Utils/axiosConfig";
import StatsCard from "../../../Components/cards/StatsCard";
import MyTable from "../../../Components/tables/MyTable";
import { useState } from "react";
import { useRouter } from "next/router";
import { adminDeliveryFilterIndexRequest } from "../../../requests/delivery/delivery.requests";
import { toast } from "react-toastify";
import FilterContainer from "../../../Components/modals/containers/FilterContainer";
import MyDropDownInput from "../../../Components/inputs/MyDropDownInput";
import TextInput from "../../../Components/inputs/MyTextInput";
import FilterAndSearchGroup from "../../../Components/inputs/FilterAndSearchGroup";

interface IAdminDeliveryIndexProps {
    delivery: any;
}

const AdminDeliveryIndex = ({ delivery }: IAdminDeliveryIndexProps) => {
    const router = useRouter();
    const [deliveryData, setDeliveryData] = useState(delivery);
    const [showFilterInput, setShowFilterInput] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const [filterByDetails, setFilterByDetails] = useState({
        recipient_name: '',
        recipient_email: '',
        recipient_city: '',
        recipient_state: '',
        recipient_country: '',
        
        order_paid: undefined,
        order_payment_confirmed: undefined,
     
        payment_id: '',
        status: '',
        start_date: '',
        end_date: '',
        pagination: 1,
    });

    const handleFilterByDetailsChange = (e: any) => {
        setFilterByDetails((prevState) => ({
            ...prevState,
            [e.target.name] : e.target.value
        }))
    }

    const filterDeliveries = async () => {
        setLoading(true);

        await adminDeliveryFilterIndexRequest(filterByDetails)
        .then((response: any) => {
            if(response.status === 200) {
                toast.success('Action successful');
                setDeliveryData(response.data);
            }
            else if(response.status === 204) {
                toast.success('No content');
                setDeliveryData({});
            }
        })
        .catch((error: any) => {
            console.log({error});
            toast.error(error.response?.data?.message || 'Error try again later');
        })
        .finally(() => {
            setLoading(false);
            setShowFilterInput(false);
        })
    }

    const paginateData = async (paginator: any, direction: 'prev' | 'next') => {
        if(direction === 'prev' && paginator?.prev_page_url) {
            setLoading(true);

            await adminDeliveryFilterIndexRequest({...filterByDetails, page: page - 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setDeliveryData(response.data);
                    setPage(response.data?.data?.current_page);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setDeliveryData({});
                }
            })
            .catch((error: any) => {
                console.log({error});
                toast.error(error.response?.data?.message || 'Error try again later');
            })
            .finally(() => {
                setLoading(false);
                setShowFilterInput(false);
            })
        }

        if(direction === 'next' && paginator?.next_page_url) {
            setLoading(true);

            await adminDeliveryFilterIndexRequest({...filterByDetails, page: page + 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setDeliveryData(response.data);
                    setPage(response.data?.data?.current_page);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setDeliveryData({});
                }
            })
            .catch((error: any) => {
                console.log({error});
                toast.error(error.response?.data?.message || 'Error try again later');
            })
            .finally(() => {
                setLoading(false);
                setShowFilterInput(false);
            })
        }
    }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-scroll">
        {
            showFilterInput && <FilterContainer 
                show={showFilterInput}
                setShow={() => setShowFilterInput(!showFilterInput)}
                onFilter={filterDeliveries}
                isLoading={loading}
                children={[
                    <MyDropDownInput 
                        label="Paid"
                        onSelect={handleFilterByDetailsChange}
                        name="order_paid"
                        options={[
                            {title: 'Paid', value: '1'},
                            {title: 'Not paid', value: '0'},
                        ]}
                        value={filterByDetails.order_paid}
                    />,

                    <MyDropDownInput 
                        label="Payment confirmed"
                        onSelect={handleFilterByDetailsChange}
                        name="order_payment_confirmed"
                        options={[
                            {title: 'Confirmed', value: '1'},
                            {title: 'Un confirmed', value: '0'},
                        ]}
                        value={filterByDetails.order_payment_confirmed}
                    />,

                    <MyDropDownInput 
                        label="Status"
                        onSelect={handleFilterByDetailsChange}
                        name="status"
                        options={[
                            {title: 'Pending', value: 'pending'},
                            {title: 'ongoing', value: 'ongoing'},
                            {title: 'completed', value: 'completed'},
                            {title: 'cancelled', value: 'cancelled'},
                            {title: 'delivered', value: 'delivered'},
                            {title: 'shipped', value: 'shipped'},
                            {title: 'unshipped', value: 'unshipped'},
                        ]}
                        value={filterByDetails.status}
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

                    <TextInput
                        label="Payment ID"
                        name="payment_id"
                        value={filterByDetails.payment_id}
                        handleChange={handleFilterByDetailsChange}
                    />,
                ]}
            />
        }

        <div className="flex flex-row w-full mx-auto mt-8 relative mb-10">
            <AdminSideNavPanel />
            <div className="flex flex-col w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%]">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 mt-20 lg:mt-0">
                    <StatsCard
                        title='All Deliveries'
                        value={delivery.data?.total ?? 0}
                    />
                </div>

                <div className='flex flex-col pt-4 px-4 bg-white'>
                    <h2 className="text-xl font-bold text-slate-700 mb-4">Deliveries</h2>

                    <div className="flex flex-row py-3 px-4 relative bg-white justify-between">
                        <FilterAndSearchGroup 
                            search={false}
                            onSearch={()=>{}}
                            onFilterButtonClick={() => setShowFilterInput(!showFilterInput)}
                            isSearching={loading}
                        />
                    </div>

                    <div className="flex flex-col pb-8 bg-white overflow-y-auto">
                        <MyTable
                            headings={['id', 'amount', 'status', 'origin_state', 'origin_country', 'recipient_city', 'recipient_state', 'date']}
                            content={deliveryData?.data?.data?.map((order: any) => ({
                                id: order.id,
                                amount: order.order_amount,
                                status: order.status,
                                origin_state: order.sender_state,
                                origin_country: order.sender_country,
                                recipient_city: order.recipient_city,
                                recipient_state: order.recipient_state,
                                recipient_country: order.recipient_country,
                                date: new Date(order.created_at).toDateString(),
                            }))} 
                            onRowButtonClick={(order: any) => router.push(`delivery/${order.id}`)}
                        />
                        <div className='flex flex-row justify-end text-sm w-[80%] mx-auto'>
                            <button onClick={() => paginateData(deliveryData?.data, 'prev')} className='mr-3 cursor-pointer'>Previous</button>
                            <p className="text-base px-2 my-auto">{deliveryData?.data?.current_page}</p>
                            <button onClick={() => paginateData(deliveryData?.data, 'next')} className='mr-3 cursor-pointer'>Next</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
  )
}

export default AdminDeliveryIndex

export async function getServerSideProps(context: any) {
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;

    try {
        const getAllDelivery = await axiosInstance.get('/api/delivery/index?properties=1', {
            headers: {
                Authorization: token,
                // team: user?.vendor
            }
        });

        const [deliveryResult] = await Promise.allSettled([
            getAllDelivery
        ]);
        console.log({deliveryResult})

        const delivery = deliveryResult.status === 'fulfilled' ? deliveryResult?.value?.data : [];
        
        return {
            props: {
                delivery
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
                delivery: {}
            }
        }
    }
}