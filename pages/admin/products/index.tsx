import React, { useState } from 'react'
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
import { filterProductsByVendorAction, searchProductsByVendorAction } from '../../../requests/products/products.request';

interface IProductsIndexPageProps {
    products: any
}

const ProductsIndexPage = ({products}:IProductsIndexPageProps) => {
    const [productsData, setProductsData] = useState(products);
    const router = useRouter();
    const [showFilterInput, setShowFilterInput] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const [filterByDetails, setFilterByDetails] = useState({
        name: '',
        email: '',
        gender: '',
        blocked: undefined,
        user_verified: undefined,
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

    const filterProducts = async () => {
        setLoading(true);

        await filterProductsByVendorAction(filterByDetails)
        .then((response: any) => {
            if(response.status === 200) {
                toast.success('Action successful');
                setProductsData(response.data?.data);
            }
            else if(response.status === 204) {
                toast.success('No content');
                setProductsData({});
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

    const searchProducts = async (value: string) => {
        setLoading(true);

        await searchProductsByVendorAction(value)
        .then((response) => {
            if(response.status === 200) {
                toast.success('Action successful');
                setProductsData(response.data?.data);
            }
            else if(response.status === 204) {
                toast.success('No content');
                setProductsData({});
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
            await filterProductsByVendorAction({pagination: paginator?.current_page - 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setProductsData(response.data?.data);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setProductsData({});
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
            await filterProductsByVendorAction({pagination: paginator?.current_page + 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setProductsData(response.data?.data);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setProductsData({});
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
                onFilter={filterProducts}
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
                            label="Blocked"
                            onSelect={handleFilterByDetailsChange}
                            name="blocked"
                            options={[
                                {title: 'true', value: '1'},
                                {title: 'false', value: '0'},
                            ]}
                            value={filterByDetails.blocked}
                        />

                        <MyDropDownInput 
                            label="Verified"
                            onSelect={handleFilterByDetailsChange}
                            name="user_verified"
                            options={[
                                {title: 'true', value: '1'},
                                {title: 'false', value: '0'},
                            ]}
                            value={filterByDetails.user_verified}
                        />
                    </>
                ]}
            />
        }

        <div className="flex flex-row w-[90%] mx-auto mt-8 relative mb-10">
            <AdminSideNavPanel />
            <div className="flex flex-col w-[80%] absolute right-0 left-[21%]">
                <h2 className="text-2xl font-bold text-slate-700 mb-4">Products</h2>
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <StatsCard
                        title='All Products'
                        value={products.data?.meta?.total ?? 0}
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
                        onSearch={searchProducts}
                        onFilterButtonClick={() => setShowFilterInput(!showFilterInput)}
                        isSearching={loading}
                    />
                </div>
                {/* PRODUCTS TABLE */}
                <div className="flex flex-col pb-8 bg-white overflow-y-auto">
                    <MyTable
                        headings={['id', 'name', 'category', 'orders', 'open_orders', 'management_approved', 'vendor_approved', 'flag']}
                        content={productsData?.data?.data?.map((product: any) => ({
                            id: product.id,
                            name: product.product_name,
                            category: product.product_categories,
                            orders: product.orders?.length,
                            open_orders: product.openOrders?.length,
                            status: product.status,
                            management_approved: product.management_approved ? 'True' : 'False',
                            vendor_approved: product.vendor_approved ? 'True' : 'False',
                            flag: product.flag
                        }))} 
                        onRowButtonClick={(user: any) => router.push(`products/${user.id}`)}
                    />
                    <div className='flex flex-row justify-end text-sm w-[80%] mx-auto'>
                        <button onClick={() => paginateData(productsData?.data?.meta, 'prev')} className='mr-3 cursor-pointer'>Previous</button>
                        <p className="text-base px-2 my-auto">{productsData?.data?.meta?.current_page}</p>
                        <button onClick={() => paginateData(productsData?.data?.meta, 'next')} className='mr-3 cursor-pointer'>Next</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProductsIndexPage


export async function getServerSideProps(context: any) {
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;

    try {
        const getAllProducts = await axiosInstance.get('/api/product/index?properties=1', {
            headers: {
                Authorization: token,
                // team: user?.vendor
            }
        });

        const [productsResult] = await Promise.allSettled([
            getAllProducts
        ]);

        const products = productsResult.status === 'fulfilled' ? productsResult?.value?.data : [];
        console.log({products})
        return {
            props: {
                products
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
                Products: {}
            }
        }
    }
}