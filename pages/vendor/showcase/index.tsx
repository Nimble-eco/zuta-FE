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
        vendorId = JSON.parse(Cookies.get('user')!).vendor;
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
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

        <div className="flex flex-row w-full mx-auto lg:mt-8 relative">
            <VendorSideNavPanel />
            <div className="flex flex-col w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%]">
                <div className="flex flex-col gap-2 pt-4 px-4 rounded-t-md bg-white mt-20 lg:mt-0">
                    <h2 className="text-2xl font-bold text-slate-700 mb-4">Product Showcase</h2>
                    <div className="flex flex-row text-sm font-semibold !text-gray-400">
                        <a href="#0" className="hover:!text-orange-500 mr-3">
                            All
                        </a>
                        <a href="#0" className="hover:!text-orange-500 mr-3">
                            Pending
                        </a>
                        <a href="#0" className="hover:!text-orange-500 mr-3">
                            Ongoing
                        </a>
                        <a href="#0" className="hover:!text-orange-500 mr-3">
                            Closed
                        </a>
                    </div>
                </div>

                <div className="flex py-3 px-4 bg-white">
                    <div className="min-w-[full]">
                        <FilterAndSearchGroup 
                            searchInputPlaceHolder="Search product name, category"
                            onSearch={searchShowcaseProducts}
                            onFilterButtonClick={() => setShowFilterInput(!showFilterInput)}
                            isSearching={loading}
                        />
                    </div>
                </div>

                <div className="flex flex-col pb-8 bg-white text-gray-700 overflow-scroll">
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
                    <PaginationBar 
                        paginator={featuredProducts?.meta}
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