import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../Utils/axiosConfig';
import { parse } from 'cookie';
import FilterContainer from '../../../Components/modals/containers/FilterContainer';
import MyDropDownInput from '../../../Components/inputs/MyDropDownInput';
import AdminSideNavPanel from '../../../Components/admin/layout/AdminSideNav';
import StatsCard from '../../../Components/cards/StatsCard';
import FilterAndSearchGroup from '../../../Components/inputs/FilterAndSearchGroup';
import MyTable from '../../../Components/tables/MyTable';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { filterVendorsAction, searchVendorsAction } from '../../../requests/vendor/vendor.request';
import { calculateRatio } from '../../../Utils/helper';
import AdminNavBar from '../../../Components/admin/layout/AdminNavBar';

interface IStoresIndexPageProps {
    stores: any
}

const StoresIndexPage = ({stores}:IStoresIndexPageProps) => {
    const [storesData, setStoresData] = useState(stores);
    const router = useRouter();
    const [showFilterInput, setShowFilterInput] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [storesWithProducts, setStoresWithProducts] = useState(0);
    const [storesWithOrders, setStoresWithOrders] = useState(0);
    const [storesWithOpenOrders, setStoresWithOpenOrders] = useState(0);

    const [filterByDetails, setFilterByDetails] = useState({
        gender: '',
        blocked: undefined,
        vendor_approved: undefined,
        flag: undefined,
        start_date: '',
        end_date: '',
    });
    
    const handleFilterByDetailsChange = (e: any) => {
        setFilterByDetails((prevState) => ({
            ...prevState,
            [e.target.name] : e.target.value
        }))
    }

    const filterStores = async () => {
        setLoading(true);

        await filterVendorsAction(filterByDetails)
        .then((response: any) => {
            if(response.status === 200) {
                toast.success('Action successful');
                setStoresData(response.data?.data);
            }
            else if(response.status === 204) {
                toast.success('No content');
                setStoresData({});
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

    const searchStores = async (value: string) => {
        setLoading(true);

        await searchVendorsAction(value)
        .then((response) => {
            if(response.status === 200) {
                toast.success('Action successful');
                setStoresData(response.data?.data);
            }
            else if(response.status === 204) {
                toast.success('No content');
                setStoresData({});
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
            await filterVendorsAction({pagination: paginator?.current_page - 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setStoresData(response.data?.data);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setStoresData({});
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
            await filterVendorsAction({pagination: paginator?.current_page + 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setStoresData(response.data?.data);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setStoresData({});
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

    useEffect(()=>{
        let storeOrderCount = 0;
        let storeOpenOrderCount = 0;
        let storeProductCount = 0;
        let isMounted = true;

        storesData?.data?.data?.map((store: any) => {
            if(store?.product?.length > 0) storeProductCount++;
            if(store?.order?.length > 0) storeOrderCount++;
            if(store?.openOrder?.length > 0) storeOpenOrderCount++;
        });

        if(isMounted) {
            setStoresWithOrders(storeOrderCount);
            setStoresWithOpenOrders(storeOpenOrderCount);
            setStoresWithProducts(storeProductCount);
        }

        return () => {
            isMounted = false;
        }
    }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-scroll">
        {
            showFilterInput && <FilterContainer 
                show={showFilterInput}
                setShow={() => setShowFilterInput(!showFilterInput)}
                onFilter={filterStores}
                isLoading={loading}
                children={[
                    <>  
                        <MyDropDownInput 
                            label="Gender"
                            onSelect={handleFilterByDetailsChange}
                            name="gender"
                            options={[
                                {title: 'male', value: 'male'},
                                {title: 'female', value: 'female'},
                                {title: 'other', value: 'other'},
                            ]}
                            value={filterByDetails.gender}
                        />

                        <MyDropDownInput 
                            label="Vendor Approved"
                            onSelect={handleFilterByDetailsChange}
                            name="vendor_approved"
                            options={[
                                {title: 'true', value: '1'},
                                {title: 'false', value: '0'},
                            ]}
                            value={filterByDetails.vendor_approved}
                        />

                        <MyDropDownInput 
                            label="Management Approved"
                            onSelect={handleFilterByDetailsChange}
                            name="blocked"
                            options={[
                                {title: 'true', value: '1'},
                                {title: 'false', value: '0'},
                            ]}
                            value={filterByDetails.blocked}
                        />
                    </>
                ]}
            />
        }

        <div className="flex flex-row w-full mx-auto relative">
            <AdminSideNavPanel />
            <div className="flex flex-col w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%] !px-2 lg:!px-0">
                <AdminNavBar />
                <h2 className="text-2xl font-bold text-slate-700 mb-4">Stores</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    <StatsCard
                        title='All Stores'
                        value={stores.data?.meta?.total ?? 0}
                    />
                    <StatsCard
                        title='Stores with order(s)'
                        value={storesWithOrders}
                        footer={calculateRatio(storesWithOrders, stores.data?.meta?.total)}
                    />
                    <StatsCard
                        title='Stores with order train(s)'
                        value={storesWithOpenOrders}
                        footer={calculateRatio(storesWithOpenOrders, stores.data?.meta?.total)}
                    />
                    <StatsCard
                        title='Stores with Product(s)'
                        value={storesWithProducts}
                        footer={calculateRatio(storesWithProducts, stores.data?.meta?.total)}
                    />
                </div>
                <div className="flex flex-row text-sm font-semibold !text-gray-400 px-4 pt-5 bg-white">
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
                        searchInputPlaceHolder="Search name, category, tags"
                        onSearch={searchStores}
                        onFilterButtonClick={() => setShowFilterInput(!showFilterInput)}
                        isSearching={loading}
                    />
                </div>
                {/* StoreS TABLE */}
                <div className="flex flex-col pb-8 bg-white overflow-y-auto">
                    <MyTable
                        headings={['name', 'email', 'state', 'country', 'orders', 'open_orders', 'management_approved', 'user_approved', 'flag']}
                        content={storesData?.data?.data?.map((vendor: any) => ({
                            id: vendor.id,
                            name: vendor.vendor_name,
                            email: vendor.vendor_email,
                            state: vendor.vendor_state,
                            country: vendor.vendor_country,
                            orders: vendor.order?.length,
                            open_orders: vendor.openOrder?.length,
                            management_approved: vendor.management_approved ? 'True' : 'False',
                            user_approved: vendor.user_approved ? 'True' : 'False',
                            flag: vendor.flag
                        }))} 
                        onRowButtonClick={(user: any) => router.push(`stores/${user.id}`)}
                    />
                    <div className='flex flex-row justify-end text-sm w-[80%] mx-auto'>
                        <button onClick={() => paginateData(storesData?.data?.meta, 'prev')} className='mr-3 cursor-pointer'>Previous</button>
                        <p className="text-base px-2 my-auto">{storesData?.data?.meta?.current_page}</p>
                        <button onClick={() => paginateData(storesData?.data?.meta, 'next')} className='mr-3 cursor-pointer'>Next</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default StoresIndexPage


export async function getServerSideProps(context: any) {
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;

    try {
        const getAllStores = await axiosInstance.get('/api/vendor/index?properties=1', {
            headers: { Authorization: token }
        });

        const [storesResult] = await Promise.allSettled([
            getAllStores
        ]);

        const stores = storesResult.status === 'fulfilled' ? storesResult?.value?.data : [];
        console.log({stores})
        return {
            props: {
                stores
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
                stores: {}
            }
        }
    }
}