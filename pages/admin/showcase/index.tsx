import { useState } from "react";
import AdminSideNavPanel from "../../../Components/admin/layout/AdminSideNav";
import StatsCard from "../../../Components/cards/StatsCard";
import FilterAndSearchGroup from "../../../Components/inputs/FilterAndSearchGroup";
import { useRouter } from "next/router";
import MyTable from "../../../Components/tables/MyTable";
import { parse } from "cookie";
import axiosInstance from "../../../Utils/axiosConfig";
import { toast } from "react-toastify";
import { filterProductShowcaseAction, searchFeaturedProductsByVendorAction } from "../../../requests/showcase/showcase.request";
import FilterContainer from "../../../Components/modals/containers/FilterContainer";
import TextInput from "../../../Components/inputs/MyTextInput";
import MyDropDownInput from "../../../Components/inputs/MyDropDownInput";
import ButtonFull from "../../../Components/buttons/ButtonFull";

interface IShowcaseIndexPageProps {
    items: any;
}

const ShowcaseIndexPage = ({items}: IShowcaseIndexPageProps) => {
    const [featuredItemsData, setFeaturedItemsData] = useState(items);
    const router = useRouter();
    const [showFilterInput, setShowFilterInput] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    
    const [filterByDetails, setFilterByDetails] = useState({
        vendor_id: '',
        product_name: '',
        featured_paid: undefined,
        featured_payment_confirmed: undefined,
        featured_duration_in_hours: undefined,
        status: '',
        start_date: '',
        end_date: '',
    });
    
    const handleFilterByDetailsChange = (e: any) => {
        setFilterByDetails((prevState) => ({
            ...prevState,
            [e.target.name] : e.target.value
        }))
    }

    const filterFeaturedItems = async () => {
        setLoading(true);

        await filterProductShowcaseAction(filterByDetails)
        .then((response: any) => {
            if(response.status === 200) {
                toast.success('Action successful');
                setFeaturedItemsData(response.data?.data);
            }
            else if(response.status === 204) {
                toast.success('No content');
                setFeaturedItemsData({});
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

    const searchFeaturedItems = async (value: string) => {
        setLoading(true);

        await searchFeaturedProductsByVendorAction(value)
        .then((response) => {
            if(response.status === 200) {
                toast.success('Action successful');
                setFeaturedItemsData(response.data?.data);
            }
            else if(response.status === 204) {
                toast.success('No content');
                setFeaturedItemsData({});
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
            await filterProductShowcaseAction({pagination: paginator?.current_page - 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setFeaturedItemsData(response.data?.data);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setFeaturedItemsData({});
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
            await filterProductShowcaseAction({pagination: paginator?.current_page + 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setFeaturedItemsData(response.data?.data);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setFeaturedItemsData({});
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
                onFilter={filterFeaturedItems}
                isLoading={loading}
                children={[
                    <TextInput
                        label="Vendor ID"
                        name="vendor_id"
                        value={filterByDetails.vendor_id}
                        handleChange={handleFilterByDetailsChange}
                    />,
                    <TextInput
                        label="Product Name"
                        name="product_name"
                        value={filterByDetails.product_name}
                        handleChange={handleFilterByDetailsChange}
                    />,
                    <TextInput
                        label="Duration"
                        name="featured_duration_in_hours"
                        type="number"
                        value={filterByDetails.featured_duration_in_hours ?? ''}
                        handleChange={handleFilterByDetailsChange}
                    />,
                    <MyDropDownInput 
                        label="Paid"
                        onSelect={handleFilterByDetailsChange}
                        name="paid"
                        options={[
                            {title: 'true', value: '1'},
                            {title: 'false', value: '0'},
                        ]}
                        value={filterByDetails.featured_paid}
                    />,
                    <MyDropDownInput 
                        label="Status"
                        onSelect={handleFilterByDetailsChange}
                        name="status"
                        options={[
                            {title: 'active', value: 'active'},
                            {title: 'inactive', value: 'inactive'},
                            {title: 'completed', value: 'completed'},
                        ]}
                        value={filterByDetails.status}
                    />,
                ]}
            />
        }

        <div className="flex flex-row w-full mx-auto mt-8 relative mb-10">
            <AdminSideNavPanel />
            <div className="flex flex-col w-[80%] absolute right-0 left-[20%]">
                <div className="flex flex-row gap-6 justify-between lg:w-[95%] items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-700">Showcase</h2>
                    <div className="w-20">
                        <ButtonFull
                            action="Create"
                            onClick={()=>router.push('showcase/create')}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <StatsCard
                        title='All Featured Items'
                        value={items.data?.meta?.total ?? 0}
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
                        onSearch={searchFeaturedItems}
                        onFilterButtonClick={() => setShowFilterInput(!showFilterInput)}
                        isSearching={loading}
                    />
                </div>
                {/* FEATURED ITEMS TABLE */}
                <div className="flex flex-col pb-8 bg-white overflow-y-auto">
                    <MyTable
                        headings={['product_name', 'featured_amount', 'duration', 'position', 'product_categories', 'status', 'activation_date', 'deactivation_date', 'featured_paid', 'featured_payment_confirmed',]}
                        content={featuredItemsData?.data?.data?.map((item: any) => ({
                            ...item,
                            duration: item.featured_duration_in_hours
                        }))} 
                        onRowButtonClick={(item: any) => router.push(`showcase/${item.id}`)}
                    />
                    <div className='flex flex-row justify-end text-sm w-[80%] mx-auto'>
                        <button onClick={() => paginateData(featuredItemsData?.data?.meta, 'prev')} className='mr-3 cursor-pointer'>Previous</button>
                        <p className="text-base px-2 my-auto">{featuredItemsData?.data?.meta?.current_page}</p>
                        <button onClick={() => paginateData(featuredItemsData?.data?.meta, 'next')} className='mr-3 cursor-pointer'>Next</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ShowcaseIndexPage

export async function getServerSideProps(context: any) {
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;

    try {
        const getAllFeatured = await axiosInstance.get('/api/featured/product/index?properties=1', {
            headers: { Authorization: token }
        });

        const [featuredResult] = await Promise.allSettled([
            getAllFeatured
        ]);

        const featured = featuredResult.status === 'fulfilled' ? featuredResult?.value?.data : [];
        
        return {
            props: {
                items: featured
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
                items: {}
            }
        }
    }
}