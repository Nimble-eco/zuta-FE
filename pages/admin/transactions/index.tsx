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
import { filterPaymentAction, searchPaymentAction } from '../../../requests/payments/payments.request';
import TextInput from '../../../Components/inputs/MyTextInput';

interface ITransactionsIndexPageProps {
    payments: any
}

const TransactionsIndexPage = ({payments}:ITransactionsIndexPageProps) => {
    const [transactionsData, setTransactionsData] = useState(payments);
    const router = useRouter();
    const [showFilterInput, setShowFilterInput] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const [filterByDetails, setFilterByDetails] = useState({
        user_id: '',
        creditor_id: '',
        reference: '',
        type: '',
        currency: '',
        paid: undefined,
        payment_confirmed: undefined,
        amount: undefined,
        start_date: '',
        end_date: '',
    });
    
    const handleFilterByDetailsChange = (e: any) => {
        setFilterByDetails((prevState) => ({
            ...prevState,
            [e.target.name] : e.target.value
        }))
    }

    const filterPayments = async () => {
        setLoading(true);

        await filterPaymentAction(filterByDetails)
        .then((response: any) => {
            if(response.status === 200) {
                toast.success('Action successful');
                setTransactionsData(response.data?.data);
            }
            else if(response.status === 204) {
                toast.success('No content');
                setTransactionsData({});
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

    const searchPayments = async (value: string) => {
        setLoading(true);

        await searchPaymentAction(value)
        .then((response) => {
            if(response.status === 200) {
                toast.success('Action successful');
                setTransactionsData(response.data?.data);
            }
            else if(response.status === 204) {
                toast.success('No content');
                setTransactionsData({});
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
            await filterPaymentAction({pagination: paginator?.current_page - 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setTransactionsData(response.data?.data);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setTransactionsData({});
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
            await filterPaymentAction({pagination: paginator?.current_page + 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setTransactionsData(response.data?.data);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setTransactionsData({});
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
                onFilter={filterPayments}
                isLoading={loading}
                children={[
                    <TextInput
                        label="User ID"
                        name="user_id"
                        value={filterByDetails.user_id}
                        handleChange={handleFilterByDetailsChange}
                    />,
                    <TextInput
                        label="Creditor ID"
                        name="creditor_id"
                        value={filterByDetails.creditor_id}
                        handleChange={handleFilterByDetailsChange}
                    />,
                    <TextInput
                        label="Reference"
                        name="reference"
                        value={filterByDetails.reference}
                        handleChange={handleFilterByDetailsChange}
                    />,
                    <MyDropDownInput 
                        label="Type"
                        onSelect={handleFilterByDetailsChange}
                        name="type"
                        options={[
                            {title: 'order', value: 'order'},
                            {title: 'order train', value: 'open_order'},
                            {title: 'refund', value: 'refund'},
                            {title: 'recoup', value: 'recoup'},
                            {title: 'affiliate', value: 'affiliate'},
                            {title: 'showcase', value: 'showcase'},
                        ]}
                        value={filterByDetails.type}
                    />,
                    <MyDropDownInput 
                        label="Paid"
                        onSelect={handleFilterByDetailsChange}
                        name="paid"
                        options={[
                            {title: 'true', value: '1'},
                            {title: 'false', value: '0'},
                        ]}
                        value={filterByDetails.paid}
                    />,
                    <MyDropDownInput 
                        label="Payment confirmed"
                        onSelect={handleFilterByDetailsChange}
                        name="payment_confirmed"
                        options={[
                            {title: 'true', value: '1'},
                            {title: 'false', value: '0'},
                        ]}
                        value={filterByDetails.payment_confirmed}
                    />
                ]}
            />
        }

        <div className="flex flex-row w-[90%] mx-auto mt-8 relative mb-10">
            <AdminSideNavPanel />
            <div className="flex flex-col w-[80%] absolute right-0 left-[20%]">
                <h2 className="text-2xl font-bold text-slate-700 mb-4">Transactions</h2>
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <StatsCard
                        title='All Transactions'
                        value={payments.data?.meta?.total ?? 0}
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
                        onSearch={searchPayments}
                        onFilterButtonClick={() => setShowFilterInput(!showFilterInput)}
                        isSearching={loading}
                    />
                </div>
                {/* PRODUCTS TABLE */}
                <div className="flex flex-col pb-8 bg-white overflow-y-auto">
                    <MyTable
                        headings={['id', 'reference', 'user_id', 'creditor_id', 'type', 'amount', 'currency', 'paid', 'payment_confirmed', 'method', 'payment_date']}
                        content={transactionsData?.data?.data?.map((transaction: any) => ({
                            ...transaction,
                            id: transaction.id,
                        }))} 
                        onRowButtonClick={(transaction: any) => router.push(`transactions/${transaction.id}`)}
                    />
                    <div className='flex flex-row justify-end text-sm w-[80%] mx-auto'>
                        <button onClick={() => paginateData(transactionsData?.data?.meta, 'prev')} className='mr-3 cursor-pointer'>Previous</button>
                        <p className="text-base px-2 my-auto">{transactionsData?.data?.meta?.current_page}</p>
                        <button onClick={() => paginateData(transactionsData?.data?.meta, 'next')} className='mr-3 cursor-pointer'>Next</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TransactionsIndexPage

export async function getServerSideProps(context: any) {
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;

    try {
        const getAllPayments = await axiosInstance.get('/api/payment/index?properties=1', {
            headers: { Authorization: token }
        });

        const [paymentsResult] = await Promise.allSettled([
            getAllPayments
        ]);

        const payments = paymentsResult.status === 'fulfilled' ? paymentsResult?.value?.data : [];
        
        return {
            props: {
                payments
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
                payments: {}
            }
        }
    }
}