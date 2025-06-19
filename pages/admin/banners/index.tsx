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
import TextInput from '../../../Components/inputs/MyTextInput';
import { filterBannersAction, searchBannersAction } from '../../../requests/banners/banner.request';
import ButtonFull from '../../../Components/buttons/ButtonFull';
import { processImgUrl } from '../../../Utils/helper';
import AdminNavBar from '../../../Components/admin/layout/AdminNavBar';

interface IBannersIndexPageProps {
    banners: any
}

const BannersIndexPage = ({banners}:IBannersIndexPageProps) => {
    const [bannersData, setBannersData] = useState(banners);
    const router = useRouter();
    const [showFilterInput, setShowFilterInput] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    
    const [filterByDetails, setFilterByDetails] = useState({
        title: '',
        enabled: undefined,
        position: undefined,
        start_date: '',
        end_date: '',
    });
    
    const handleFilterByDetailsChange = (e: any) => {
        setFilterByDetails((prevState) => ({
            ...prevState,
            [e.target.name] : e.target.value
        }))
    }

    const filterBanners = async () => {
        setLoading(true);

        await filterBannersAction(filterByDetails)
        .then((response: any) => {
            if(response.status === 200) {
                toast.success('Action successful');
                setBannersData(response.data?.data);
            }
            else if(response.status === 204) {
                toast.success('No content');
                setBannersData({});
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

    const searchBanners = async (value: string) => {
        setLoading(true);

        await searchBannersAction(value)
        .then((response) => {
            if(response.status === 200) {
                toast.success('Action successful');
                setBannersData(response.data?.data);
            }
            else if(response.status === 204) {
                toast.success('No content');
                setBannersData({});
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
            await filterBannersAction({pagination: paginator?.current_page - 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setBannersData(response.data?.data);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setBannersData({});
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
            await filterBannersAction({pagination: paginator?.current_page + 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setBannersData(response.data?.data);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setBannersData({});
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
                onFilter={filterBanners}
                isLoading={loading}
                children={[
                    <TextInput
                        label="Title"
                        name="title"
                        value={filterByDetails.title}
                        handleChange={handleFilterByDetailsChange}
                    />,
                    <MyDropDownInput 
                        label="Enabled"
                        onSelect={handleFilterByDetailsChange}
                        name="enabled"
                        options={[
                            {title: 'true', value: '1'},
                            {title: 'false', value: '0'},
                        ]}
                        value={filterByDetails.enabled}
                    />,
                ]}
            />
        }

        <div className="flex flex-row w-full mx-auto relative">
            <AdminSideNavPanel />
            <div className="flex flex-col w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%] !px-2 lg:px-0">
                <AdminNavBar />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 mt-20 lg:mt-0">
                    <StatsCard
                        title='All Banners'
                        value={banners.data?.meta?.total ?? 0}
                    />
                    
                </div>
                <div className='flex flex-row items-center justify-between bg-white pt-4 px-4'>
                    <h2 className="text-2xl font-bold text-slate-700 mb-4">Banners</h2>
                    <div className='h-14'>
                        <ButtonFull
                            action='Create'
                            onClick={()=>router.push('banners/create')}
                        />
                    </div>
                </div>
                <div className="flex flex-row text-sm font-semibold !text-gray-400 px-4 bg-white">
                    <a href="#0" className="hover:!text-orange-500 mr-3">
                        Enabled
                    </a>
                    <a href="#0" className="hover:!text-orange-500 mr-3">
                        Disabled
                    </a>
                </div>

                <div className="flex flex-row py-3 px-4 relative bg-white justify-between">
                    <FilterAndSearchGroup 
                        searchInputPlaceHolder="Search name, category, tags"
                        onSearch={searchBanners}
                        onFilterButtonClick={() => setShowFilterInput(!showFilterInput)}
                        isSearching={loading}
                    />
                </div>
                {/* PRODUCTS TABLE */}
                <div className="flex flex-col pb-8 bg-white overflow-y-auto">
                    <MyTable
                        headings={['id', 'image', 'title', 'url', 'position', 'enabled', 'created_at']}
                        content={bannersData?.data?.data?.map((banner: any) => ({
                            ...banner,
                            id: banner.id,
                            image: processImgUrl(banner.image),
                            enabled: banner.enabled ? 'True' : 'False',
                            created_at: new Date(banner.created_at).toLocaleDateString()
                        }))} 
                        onRowButtonClick={(banner: any) => router.push(`banners/${banner.id}`)}
                    />
                    <div className='flex flex-row justify-end text-sm w-[80%] mx-auto'>
                        <button onClick={() => paginateData(bannersData?.data?.meta, 'prev')} className='mr-3 cursor-pointer'>Previous</button>
                        <p className="text-base px-2 my-auto">{bannersData?.data?.meta?.current_page}</p>
                        <button onClick={() => paginateData(bannersData?.data?.meta, 'next')} className='mr-3 cursor-pointer'>Next</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BannersIndexPage

export async function getServerSideProps(context: any) {
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;

    try {
        const getAllBanners = await axiosInstance.get('/api/advert/banners/index?properties=1', {
            headers: { Authorization: token }
        });

        const [bannersResult] = await Promise.allSettled([
            getAllBanners
        ]);

        const banners = bannersResult.status === 'fulfilled' ? bannersResult?.value?.data : [];
        
        return {
            props: {
                banners
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
                banners: {}
            }
        }
    }
}