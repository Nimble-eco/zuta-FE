import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from 'react-toastify'
import FilterContainer from "../../../../Components/modals/containers/FilterContainer";
import MyNumberInput from "../../../../Components/inputs/MyNumberInput";
import MyDropDownInput from "../../../../Components/inputs/MyDropDownInput";
import VendorSideNavPanel from "../../../../Components/vendor/layout/VendorSideNavPanel";
import FilterAndSearchGroup from "../../../../Components/inputs/FilterAndSearchGroup";
import MyTable from "../../../../Components/tables/MyTable";
import { parse } from "cookie";
import axiosInstance from "../../../../Utils/axiosConfig";
import PaginationBar from "../../../../Components/navigation/PaginationBar";
import ColumnTextInput from "../../../../Components/inputs/ColumnTextInput";
import Cookies from "js-cookie";
import { formatAmount } from "../../../../Utils/formatAmount";
import { filterOrderTrainByVendorAction, searchOrderTrainByVendorAction } from "../../../../requests/orderTrain/orderTrain.request";
import VendorNavBar from "../../../../Components/vendor/layout/VendorNavBar";
import { Train, Users, Activity, Download } from "lucide-react";

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
        open_order_price: 0,
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

        await filterOrderTrainByVendorAction({
            vendor_id: vendorId,
            product_name: filterByDetails.product_name ? filterByDetails.product_name : undefined,
            product_id: filterByDetails.product_id ? filterByDetails.product_id : undefined,
            quantity: filterByDetails.quantity ? filterByDetails?.quantity : undefined,
            order_sub_amount: filterByDetails.open_order_price ? filterByDetails?.open_order_price : undefined,
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

        await searchOrderTrainByVendorAction(value, vendorId)
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
            await filterOrderTrainByVendorAction({vendor_id: vendorId, pagination: paginator?.current_page - 1})
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
            await filterOrderTrainByVendorAction({vendor_id: vendorId, pagination: paginator?.current_page + 1})
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
        <div className="min-h-screen bg-slate-50 flex flex-row">
          <VendorSideNavPanel />
    
          <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
            <VendorNavBar />
    
            <div className="p-4 lg:p-8 space-y-6">
              {/* Page Header */}
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Train className="text-blue-600" />
                    Order Trains
                  </h1>
                  <p className="text-slate-500 text-sm">Monitor group orders and track subscriber milestones.</p>
                </div>
                <button 
                  onClick={() => {/* CSV Export */}}
                  className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-semibold hover:bg-slate-50 transition-shadow shadow-sm"
                >
                  <Download size={18} />
                  <span>Export Report</span>
                </button>
              </header>
    
              {/* Train Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Activity size={20}/></div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Trains</span>
                  </div>
                  <p className="text-2xl font-black text-slate-800">{ordersData?.meta?.total || 0}</p>
                </div>
                
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Users size={20}/></div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Subscribers</span>
                  </div>
                  <p className="text-2xl font-black text-slate-800">
                    {ordersData?.data?.reduce((acc: any, curr: any) => acc + (curr.subscribers_count || 0), 0)}
                  </p>
                </div>
    
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Train size={20}/></div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Open for Joining</span>
                  </div>
                  <p className="text-2xl font-black text-slate-800">
                    {ordersData?.data?.filter((o:any) => o.status === 'open').length || 0}
                  </p>
                </div>
              </div>
    
                {/* Toolbar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <FilterAndSearchGroup 
                        searchInputPlaceHolder="Search trains by product name..."
                        onSearch={searchOrders}
                        onFilterButtonClick={() => setShowFilterInput(!showFilterInput)}
                        isSearching={loading}
                    />
                </div>
    
              {/* Table Container */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <MyTable
                    isLoading={loading}
                    headings={['product_name', 'price', 'quantity', 'subscribers', 'order_paid', 'status']}
                    content={ordersData?.data?.map((order: any) => ({
                        ...order,
                        price: formatAmount(order.open_order_price),
                        quantity: order.order_count,
                        subscribers: order.subscribers_count,
                        order_paid: order.order_paid ? 'Paid' : 'not paid'
                    }))} 
                    onRowButtonClick={(order: any) => router.push('order-train/show?id='+ order.id)}
                />
                
                <div className="p-3 bg-slate-50/50 border-t border-slate-100">
                    <PaginationBar 
                        paginator={ordersData?.meta}
                        paginateData={paginateData}
                    />
                </div>
              </div>
            </div>
          </main>
    
          {/* Filter Overlay */}
          {
            showFilterInput && <FilterContainer 
                show={showFilterInput}
                setShow={() => setShowFilterInput(!showFilterInput)}
                onFilter={filterOrderTransactionsPage}
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
                            label="PRICE"
                            name="open_order_price"
                            value={filterByDetails?.open_order_price}
                            onInputChange={handleFilterByDetailsChange}
                        />

                        <MyDropDownInput 
                            label="ORDER STATUS"
                            onSelect={handleFilterByDetailsChange}
                            name="status"
                            options={[
                                {name: 'completed'}, 
                                {name: 'open'}, 
                                {name: 'closed'}, 
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
        </div>
    );
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
        const getMyOpenOrders = await axiosInstance.post('/api/open-order/filter/index', {vendor_id: user?.vendor}, {
            headers: {
                Authorization: token,
                team: user?.vendor
            }
        });

        const [myOrdersResult] = await Promise.allSettled([
            getMyOpenOrders
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