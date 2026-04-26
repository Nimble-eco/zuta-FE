import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from 'react-toastify'
import FilterContainer from "../../../Components/modals/containers/FilterContainer";
import VendorSideNavPanel from "../../../Components/vendor/layout/VendorSideNavPanel";
import FilterAndSearchGroup from "../../../Components/inputs/FilterAndSearchGroup";
import MyTable from "../../../Components/tables/MyTable";
import { getDateAndTimeFromISODate } from "../../../Utils/convertIsoDateToDateString";
import PaginationBar from "../../../Components/navigation/PaginationBar";
import { parse } from "cookie";
import axiosInstance from "../../../Utils/axiosConfig";
import { filterProductShowcaseAction, searchFeaturedProductsByVendorAction } from "../../../requests/showcase/showcase.request";
import MyDropDownInput from "../../../Components/inputs/MyDropDownInput";
import VendorNavBar from "../../../Components/vendor/layout/VendorNavBar";
import { Sparkles, Calendar, ShieldCheck, Clock, Search, ArrowUpRight } from "lucide-react";
import { formatAmount } from "../../../Utils/formatAmount";

interface IProductShowcaseIndexPageProps {
    featured_products: any
}

const index = ({featured_products}: IProductShowcaseIndexPageProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [featuredProducts, setFeaturedProducts] = useState(featured_products);
    let vendorId: string = '';
    const [filterByDetails, setFilterByDetails] = useState({
        featured_paid: false,
        status: '',
    })
    
    if(typeof window !== 'undefined') {
        const cookie = Cookies.get('user');
        vendorId = cookie ? JSON.parse(cookie).vendor : null;
    }

    const [showFilterInput, setShowFilterInput] = useState<boolean>(false);

    const handleFilterByDetailsChange = (e: any) => {
        setFilterByDetails((prevState) => ({
            ...prevState,
            [e.target.name] : e.target.value
        }))
    }

    const filterShowcase = async () => {
        setLoading(true);

        await filterProductShowcaseAction({
            ...filterByDetails,
            vendor_id: vendorId
        })
        .then((response: any) => {
            if(response.status === 200) {
                toast.success('Action successful');
                setFeaturedProducts(response.data?.data);
            }
            else if(response.status === 204) {
                toast.success('No content');
                setFeaturedProducts({});
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

    const searchShowcaseProducts = async (value: string) => {
        setLoading(true);

        await searchFeaturedProductsByVendorAction(value, vendorId)
        .then((response) => {
            if(response.status === 200) {
                toast.success('Action successful');
                setFeaturedProducts(response.data?.data);
            }
            else if(response.status === 204) {
                toast.success('No content');
                setFeaturedProducts({});
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
            await filterProductShowcaseAction({vendor_id: vendorId, pagination: paginator?.current_page - 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setFeaturedProducts(response.data?.data);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setFeaturedProducts({});
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
            await filterProductShowcaseAction({vendor_id: vendorId, pagination: paginator?.current_page + 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setFeaturedProducts(response.data?.data);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setFeaturedProducts({});
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
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Sparkles className="text-amber-500" size={24} />
                            Product Showcase
                        </h1>
                        <p className="text-slate-500 text-sm">Manage your premium featured listings and track visibility periods.</p>
                    </div>
                    <button 
                        onClick={() => router.push('/vendor/showcase/create')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 text-sm"
                    >
                        <span>Feature New Product</span>
                        <ArrowUpRight size={18} />
                    </button>
                </header>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="bg-amber-50 p-3 rounded-xl text-amber-600"><Sparkles size={22}/></div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Featured</p>
                            <p className="text-xl font-black text-slate-800">
                                {featuredProducts?.data?.filter((p:any) => p.status === 'active').length || 0}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><ShieldCheck size={22}/></div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Invested</p>
                            <p className="text-xl font-black text-slate-800">
                                {formatAmount(featuredProducts?.data?.reduce((acc:any, curr:any) => acc + Number(curr.featured_amount), 0))}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="bg-slate-50 p-3 rounded-xl text-slate-600"><Calendar size={22}/></div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Upcoming Expiry</p>
                            <p className="text-xl font-black text-slate-800">
                                {featuredProducts?.data?.filter((p:any) => p.status === 'active').length || 0} Listings
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <FilterAndSearchGroup 
                        searchInputPlaceHolder="Search featured products..."
                        onSearch={searchShowcaseProducts}
                        onFilterButtonClick={() => setShowFilterInput(!showFilterInput)}
                        isSearching={loading}
                    />
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-scroll">
                    <MyTable
                        headings={['product_name', 'featured_amount', 'paid', 'featured_payment_confirmed', 'status', 'start_date', 'end_date']}
                        content={featuredProducts?.data?.map((featuredProduct: any) => ({
                            ...featuredProduct,
                            paid: featuredProduct.featured_paid ? 'Paid' : 'Not Paid',
                            featured_payment_confirmed: featuredProduct.featured_payment_confirmed ? 'Confirmed' : 'Unconfirmed',
                            start_date: getDateAndTimeFromISODate(featuredProduct.featured_start_date),
                            end_date: getDateAndTimeFromISODate(featuredProduct.featured_end_date),
                        }))} 
                        onRowButtonClick={(order: any) => router.push('showcase/show?id='+ order.id)}
                    />
            
                    <div className="p-3 bg-slate-50/50 border-t border-slate-100">
                        <PaginationBar 
                            paginator={featuredProducts?.meta}
                            paginateData={paginateData}
                        />
                    </div>
                </div>
            </div>
        </main>

        {
            showFilterInput && <FilterContainer 
                show={showFilterInput}
                setShow={() => setShowFilterInput(!showFilterInput)}
                onFilter={filterShowcase}
                isLoading={loading}
                children={[
                    <>
                        <MyDropDownInput
                            label="Featured Paid"
                            name="featured_paid"
                            value={filterByDetails.featured_paid}
                            options={[
                                {title: 'True', value: true},
                                {title: 'False', value: false},
                            ]}
                            onSelect={handleFilterByDetailsChange}
                        />

                        <MyDropDownInput
                            label="Status"
                            name="status"
                            value={filterByDetails.status}
                            options={[
                                {title: 'Active', value: 'active'},
                                {title: 'Inactive', value: 'inactive'},
                                {title: 'Completed', value: 'completed'},
                            ]}
                            onSelect={handleFilterByDetailsChange}
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
        const getMyFeaturedProducts = await axiosInstance.get('/api/featured/product/me', {
            headers: {
                Authorization: token,
                team: user?.vendor
            }
        });

        const [myFeaturedProductsResult] = await Promise.allSettled([
            getMyFeaturedProducts
        ]);

        const myFeaturedProducts = myFeaturedProductsResult.status === 'fulfilled' ? myFeaturedProductsResult?.value?.data : [];
        
        return {
            props: {
                featured_products: myFeaturedProducts.data ?? {},
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
                featured_products: {},
            }
        }
    }
}