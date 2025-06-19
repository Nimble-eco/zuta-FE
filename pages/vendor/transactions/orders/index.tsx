import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from 'react-toastify'
import FilterContainer from "../../../../Components/modals/containers/FilterContainer";
import MyNumberInput from "../../../../Components/inputs/MyNumberInput";
import MyDropDownInput from "../../../../Components/inputs/MyDropDownInput";
import VendorSideNavPanel from "../../../../Components/vendor/layout/VendorSideNavPanel";
import FilterAndSearchGroup from "../../../../Components/inputs/FilterAndSearchGroup";
import ButtonGhost from "../../../../Components/buttons/ButtonGhost";
import MyTable from "../../../../Components/tables/MyTable";
import { parse } from "cookie";
import axiosInstance from "../../../../Utils/axiosConfig";
import PaginationBar from "../../../../Components/navigation/PaginationBar";
import ColumnTextInput from "../../../../Components/inputs/ColumnTextInput";
import { filterOrdersByVendorAction, searchOrdersByVendorAction } from "../../../../requests/order/order.request";
import Cookies from "js-cookie";
import { formatAmount } from "../../../../Utils/formatAmount";
import VendorNavBar from "../../../../Components/vendor/layout/VendorNavBar";

interface IOrdersIndexPageProps {
    orders: any;
}

const index = ({orders}: IOrdersIndexPageProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [ordersData, setOrdersData] = useState(orders);
    const [filterByDetails, setFilterByDetails] = useState({
        product_name: '',
        product_price: 0,
        quantity: 0,
        product_id: 0,
        order_id: '',
        order_amount: 0,
        order_sub_amount: 0,
        start_date: '',
        end_date: '',
        status: '',
        order_paid: ''
    });
    let vendorId: string = '';

    if(typeof window !== 'undefined') {
        vendorId = JSON.parse(Cookies.get('user')!).vendor;
    }

    const [showFilterInput, setShowFilterInput] = useState<boolean>(false);

    const handleFilterByDetailsChange = (e: any) => {
        setFilterByDetails((prevState) => ({
            ...prevState,
            [e.target.name] : e.target.value
        }))
    }

    const filterOrderTransactionsPage = async () => {
        setLoading(true);

        await filterOrdersByVendorAction({
            vendor_id: vendorId,
            product_name: filterByDetails.product_name ? filterByDetails.product_name : undefined,
            product_id: filterByDetails.product_id ? filterByDetails.product_id : undefined,
            quantity: filterByDetails.quantity ? filterByDetails?.quantity : undefined,
            order_sub_amount: filterByDetails.order_sub_amount ? filterByDetails?.order_sub_amount : undefined,
            status: filterByDetails.status ? filterByDetails.status : undefined,
            order_paid: filterByDetails.order_paid ? filterByDetails.order_paid : undefined,
        })
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
        })
    }

    const searchOrders = async (value: string) => {
        setLoading(true);

        await searchOrdersByVendorAction(value, vendorId)
        .then((response) => {
            if(response.status === 200) {
                toast.success('Action successful');
                setOrdersData(response.data?.data);
            }
            else if(response.status === 204) {
                toast.success('No content');
                setOrdersData({});
            }
        })
        .catch(error => {
            console.log({error});
            toast.error(error.response?.data?.message || 'Error try again later');
        })
        .finally(() => {
            setLoading(false);
            setShowFilterInput(false);
        })
    }

    const paginateData = async (paginator: any, direction: 'prev' | 'next') => {
        if(direction === 'prev' && paginator?.previous_page_url) {
            setLoading(true);
            await filterOrdersByVendorAction({vendor_id: vendorId, pagination: paginator?.current_page - 1})
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
            await filterOrdersByVendorAction({vendor_id: vendorId, pagination: paginator?.current_page + 1})
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
        {
            showFilterInput && <FilterContainer 
                show={showFilterInput}
                setShow={() => setShowFilterInput(!showFilterInput)}
                onFilter={filterOrderTransactionsPage}
                isLoading={loading}
                children={[
                    <>
                        <ColumnTextInput 
                            label="Product ID"
                            name="product_id"
                            value={filterByDetails?.product_id}
                            placeHolder="Enter a product id here"
                            onInputChange={handleFilterByDetailsChange}
                        />

                        <ColumnTextInput 
                            label="PRODUCT NAME"
                            name="product_name"
                            value={filterByDetails?.product_name}
                            placeHolder="Enter a product name here"
                            onInputChange={handleFilterByDetailsChange}
                        />

                        <MyNumberInput 
                            label="QUANTITY"
                            name="quantity"
                            value={filterByDetails?.quantity}
                            onInputChange={handleFilterByDetailsChange}
                        />

                        <MyNumberInput 
                            label="TOTAL AMOUNT"
                            name="order_sub_amount"
                            value={filterByDetails?.order_sub_amount}
                            onInputChange={handleFilterByDetailsChange}
                        />

                        <MyDropDownInput 
                            label="ORDER STATUS"
                            onSelect={handleFilterByDetailsChange}
                            name="status"
                            options={[
                                {name: 'completed'}, 
                                {name: 'delivered'}, 
                                {name: 'pending'}, 
                                {name: 'cancelled'}, 
                                {name: 'rejected'}]}
                            value={filterByDetails.status}
                        />

                        <MyDropDownInput 
                            label="PAYMENT STATUS"
                            onSelect={handleFilterByDetailsChange}
                            name="order_paid"
                            options={[
                                {name: 'paid'}, 
                                {name: 'not paid'}, 
                                {name: 'unconfirmed'}, 
                                {name: 'dispute'}
                            ]}
                            value={filterByDetails.order_paid}
                        />
                    </>
                ]}
            />
        }
        <div className="flex flex-row w-full mx-auto relative mb-10">
            <VendorSideNavPanel />
            <div className="flex flex-col w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%]">
                <VendorNavBar />
                <div className='flex flex-col gap-2 bg-white pt-4 !px-2 lg:!px-4'>
                    <h2 className="text-2xl font-bold text-slate-700 mb-4">Standard Orders</h2>
                    {/* <div className="flex flex-row text-sm font-semibold !text-gray-400 pb-5 bg-white">
                        <a href="#0" className="hover:!text-orange-500 mr-3">
                            Completed
                        </a>
                        <a href="#0" className="hover:!text-orange-500 mr-3">
                            Pending
                        </a>
                        <a href="#0" className="hover:!text-orange-500 mr-3">
                            Cancelled
                        </a>
                        <a href="#0" className="hover:!text-orange-500 mr-3">
                            Rejected
                        </a>
                    </div> */}
                </div>
                <div className="flex flex-row py-3 px-4 relative bg-white justify-between">
                    <div className="w-[full]">
                        <FilterAndSearchGroup 
                            searchInputPlaceHolder="Search name, price, category"
                            isSearching={loading}
                            onSearch={searchOrders}
                            onFilterButtonClick={() => setShowFilterInput(!showFilterInput)}
                        />
                    </div>
                    <div className="w-fit">
                        <ButtonGhost 
                            action="Download CSV"
                            onClick={() => {}}
                        />
                    </div>
                </div>
                {/* PRODUCTS TABLE */}
                <div className="flex flex-col pb-8 bg-white text-gray-700">
                    <MyTable
                        headings={['product_name', 'quantity', 'order_amount', 'order_paid', 'status']}
                        content={ordersData?.data?.map((order: any) => ({
                            ...order,
                            order_amount: formatAmount(order.order_amount),
                            order_paid: order.order_paid ? 'Paid' : 'not paid'
                        }))} 
                        onRowButtonClick={(order: any) => router.push('orders/show?id='+ order.id)}
                    />
                    <PaginationBar 
                        paginator={ordersData?.meta}
                        paginateData={paginateData}
                    />
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

    if(!user?.vendor) {
        return {
            redirect: {
                destination: '/auth/signIn',
                permanent: false
            }
        }
    }

    try {
        const getMyOrders = await axiosInstance.post('/api/order/filter/index', {vendor_id: user?.vendor}, {
            headers: {
                Authorization: token,
                team: user?.vendor
            }
        });

        const [myOrdersResult] = await Promise.allSettled([
            getMyOrders
        ]);

        const myOrders = myOrdersResult.status === 'fulfilled' ? myOrdersResult?.value?.data : [];
        
        return {
            props: {
                orders: myOrders.data ?? [],
            }
        }
    } catch(error: any) {
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
            props: {
                orders: {},
            }
        }
    }
}