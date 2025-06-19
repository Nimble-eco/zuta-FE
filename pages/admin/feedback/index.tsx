import { parse } from 'cookie'
import AdminSideNavPanel from '../../../Components/admin/layout/AdminSideNav'
import FilterAndSearchGroup from '../../../Components/inputs/FilterAndSearchGroup'
import MyTable from '../../../Components/tables/MyTable'
import axiosInstance from '../../../Utils/axiosConfig'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { filterFeedbackAction } from '../../../requests/feedback/feedback.request'
import { toast } from 'react-toastify'
import FilterContainer from '../../../Components/modals/containers/FilterContainer'
import MyDropDownInput from '../../../Components/inputs/MyDropDownInput'
import ColumnTextInput from '../../../Components/inputs/ColumnTextInput'
import StatsCard from '../../../Components/cards/StatsCard'
import { feedbackCategories, feedbackTypes } from '../../../Utils/data'
import { filterTruthyProps } from '../../../Utils/helper'
import AdminNavBar from '../../../Components/admin/layout/AdminNavBar'

interface IFeedbackIndexProps {
    feedback: any;
}

const FeedbackIndex = ({feedback}: IFeedbackIndexProps) => {
    const router = useRouter();
    const [feedbackData, setFeedbackData] = useState(feedback);
    const [showFilterInput, setShowFilterInput] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const [filterByDetails, setFilterByDetails] = useState({
        type: '',
        category: '',
        status: '',
        user_id: '',
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
        const payload = filterTruthyProps(filterByDetails);
        await filterFeedbackAction(payload)
        .then((response: any) => {
            if(response.status === 200) {
                toast.success('Action successful');
                setFeedbackData(response.data);
            }
            else if(response.status === 204) {
                toast.success('No content');
                setFeedbackData({});
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
        if(direction === 'prev' && paginator?.previous_page_url) {
            setLoading(true);
            await filterFeedbackAction({pagination: paginator?.current_page - 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setFeedbackData(response.data?.data);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setFeedbackData({});
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
            await filterFeedbackAction({pagination: paginator?.current_page + 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setFeedbackData(response.data?.data);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setFeedbackData({});
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
                    <ColumnTextInput
                        label="Used ID"
                        name="user_id"
                        value={filterByDetails.user_id}
                        onInputChange={handleFilterByDetailsChange}
                    />,
                    <MyDropDownInput 
                        label="Type"
                        onSelect={handleFilterByDetailsChange}
                        name="type"
                        options={feedbackTypes}
                        value={filterByDetails.type}
                    />,
                    <MyDropDownInput
                        label="Category"
                        name="category"
                        value={filterByDetails.category}
                        onSelect={handleFilterByDetailsChange}
                        options={feedbackCategories}
                    />
                ]}
            />
        }

        <div className="flex flex-row w-full mx-auto relative">
            <AdminSideNavPanel />
            <div className="flex flex-col w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%] !px-2 lg:px-0">
                <AdminNavBar />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 mt-14 lg:mt-0">
                    <StatsCard
                        title='All Feedback'
                        value={feedback.data?.meta?.total ?? 0}
                    />
                    
                </div>
                <div className='flex flex-row items-center justify-between bg-white pt-4 px-4'>
                    <h2 className="text-2xl font-bold text-slate-700 mb-4">Feedback</h2>
                    <FilterAndSearchGroup 
                        searchInputPlaceHolder="Search name, category, tags"
                        onSearch={()=>{}}
                        onFilterButtonClick={() => setShowFilterInput(!showFilterInput)}
                        isSearching={loading}
                        search={false}
                    />
                </div>
                <div className="flex flex-col pb-8 bg-white overflow-y-auto">
                    <MyTable
                        headings={['sn', 'type', 'category', 'priority', 'status', 'created_at']}
                        content={feedbackData?.data?.data?.map((obj: any, index: number) => ({
                            ...obj,
                            sn: index + 1,
                            id: obj.id,
                            created_at: new Date(obj.created_at).toLocaleDateString()
                        }))} 
                        onRowButtonClick={(obj: any) => router.push(`feedback/${obj.id}`)}
                    />
                    <div className='flex flex-row justify-end text-sm w-[80%] mx-auto'>
                        <button onClick={() => paginateData(feedbackData?.data?.meta, 'prev')} className='mr-3 cursor-pointer'>Previous</button>
                        <p className="text-base px-2 my-auto">{feedbackData?.data?.meta?.current_page}</p>
                        <button onClick={() => paginateData(feedbackData?.data?.meta, 'next')} className='mr-3 cursor-pointer'>Next</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FeedbackIndex

export async function getServerSideProps(context: any) {
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;

    try {
        const getAllFeedback = await axiosInstance.get('/api/feedback/index?properties=1', {
            headers: { Authorization: token }
        });

        const [feedbackResult] = await Promise.allSettled([
            getAllFeedback
        ]);

        const feedback = feedbackResult.status === 'fulfilled' ? feedbackResult?.value?.data : [];
       
        return {
            props: {
                feedback
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
                feedback: {}
            }
        }
    }
}