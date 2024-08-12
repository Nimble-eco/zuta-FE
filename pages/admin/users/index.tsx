import { parse } from 'cookie';
import { ToastContainer, toast } from 'react-toastify'
import { injectStyle } from "react-toastify/dist/inject-style";
import axiosInstance from '../../../Utils/axiosConfig';
import FilterAndSearchGroup from '../../../Components/inputs/FilterAndSearchGroup';
import ButtonFull from '../../../Components/buttons/ButtonFull';
import MyTable from '../../../Components/tables/MyTable';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { filterUserIndexAction, searchUserIndexAction } from '../../../requests/user/user.request';
import FilterContainer from '../../../Components/modals/containers/FilterContainer';
import MyDropDownInput from '../../../Components/inputs/MyDropDownInput';
import StatsCard from '../../../Components/cards/StatsCard';
import AdminSideNavPanel from '../../../Components/admin/layout/AdminSideNav';
import { calculateRatio } from '../../../Utils/helper';

interface IUsersIndexPageProps {
    users: any;
}

const index = ({users}: IUsersIndexPageProps) => {
    const [usersData, setUsersData] = useState(users);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [usersWithOrders, setUsersWithOrders] = useState(0);
    const [usersWithOpenOrders, setUsersWithOpenOrders] = useState(0);
    const [showFilterInput, setShowFilterInput] = useState<boolean>(false);
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

    const filterUsers = async () => {
        setLoading(true);

        await filterUserIndexAction(filterByDetails)
        .then((response: any) => {
            if(response.status === 200) {
                toast.success('Action successful');
                setUsersData(response.data?.data);
            }
            else if(response.status === 204) {
                toast.success('No content');
                setUsersData({});
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

    const searchUsers = async (value: string) => {
        setLoading(true);

        await searchUserIndexAction(value)
        .then((response) => {
            if(response.status === 200) {
                toast.success('Action successful');
                setUsersData(response.data?.data);
            }
            else if(response.status === 204) {
                toast.success('No content');
                setUsersData({});
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
            await filterUserIndexAction({pagination: paginator?.current_page - 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setUsersData(response.data?.data);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setUsersData({});
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
            await filterUserIndexAction({pagination: paginator?.current_page + 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setUsersData(response.data?.data);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setUsersData({});
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
        let userOrderCount = 0;
        let userOpenOrderCount = 0;
        let isMounted = true;

        usersData?.data?.data?.map((user: any) => {
            if(user?.orders?.length > 0) userOrderCount++;
            if(user?.openOrderSubscriptions?.length > 0) userOpenOrderCount++;
        });

        if(isMounted) {
            setUsersWithOrders(userOrderCount);
            setUsersWithOpenOrders(userOpenOrderCount);
        }

        return () => {
            isMounted = false;
        }
    }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-scroll">
        {
            showFilterInput && <FilterContainer 
                show={showFilterInput}
                setShow={() => setShowFilterInput(!showFilterInput)}
                onFilter={filterUsers}
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
                <h2 className="text-2xl font-bold text-slate-700 mb-4">Users</h2>
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <StatsCard
                        title='All Users'
                        value={users.data?.meta?.total}
                    />
                    <StatsCard
                        title='Users with Orders'
                        value={usersWithOrders}
                        footer={calculateRatio(usersWithOrders, users.data?.meta?.total)}
                    />
                    <StatsCard
                        title='Users with Open Orders'
                        value={usersWithOpenOrders}
                        footer={calculateRatio(usersWithOpenOrders, users.data?.meta?.total)}
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
                        searchInputPlaceHolder="Search name, email, phone number"
                        onSearch={searchUsers}
                        onFilterButtonClick={() => setShowFilterInput(!showFilterInput)}
                        isSearching={loading}
                    />
                </div>
                {/* PRODUCTS TABLE */}
                <div className="flex flex-col pb-8 bg-white overflow-y-auto">
                    <MyTable
                        headings={['full_name', 'email', 'phone', 'orders', 'open_orders', 'verified', 'blocked', 'flag']}
                        content={usersData?.data?.data?.map((user: any) => ({
                            id: user.id,
                            full_name: user.name,
                            email: user.email,
                            phone: user.phone,
                            orders: user.orders?.length,
                            open_orders: user.openOrderSubscriptions?.length,
                            verified: user.user_verified ? 'True' : 'False',
                            blocked: user.blocked ? 'True' : 'False',
                            flag: user.flag
                        }))} 
                        onRowButtonClick={(user: any) => router.push(`users/${user.id}`)}
                    />
                    <div className='flex flex-row justify-end text-sm w-[80%] mx-auto'>
                        <button onClick={() => paginateData(usersData?.data?.meta, 'prev')} className='mr-3 cursor-pointer'>Previous</button>
                        <p className="text-base px-2 my-auto">{usersData?.data?.meta?.current_page}</p>
                        <button onClick={() => paginateData(usersData?.data?.meta, 'next')} className='mr-3 cursor-pointer'>Next</button>
                    </div>
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

    if(!token) {
        return {
            redirect: {
              destination: '/auth/signIn',
              permanent: false
            }
        }
    }

    try {
        const getAllUsers = await axiosInstance.get('/api/user/index?properties=1', {
            headers: {
                Authorization: token,
                // team: user?.vendor
            }
        });

        const [usersResult] = await Promise.allSettled([
            getAllUsers
        ]);

        const users = usersResult.status === 'fulfilled' ? usersResult?.value?.data : [];

        return {
            props: {
                users
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
                users: {}
            }
        }
    }
}