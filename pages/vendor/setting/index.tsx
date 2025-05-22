import { toast } from 'react-toastify';
import ButtonFull from "../../../Components/buttons/ButtonFull"
import VendorSideNavPanel from "../../../Components/vendor/layout/VendorSideNavPanel"
import { useState } from 'react'
const NaijaStates = require('naija-state-local-government');
import { HiOutlineInformationCircle } from "react-icons/hi"
import ButtonGhost from "../../../Components/buttons/ButtonGhost"
import AddPaymentMethodModal from "../../../Components/modals/settings/AddPaymentMethodModal"
import { AiFillEdit } from "react-icons/ai"
import { convertToBase64 } from "../../../Utils/convertImageToBase64"
import ColumnTextInput from "../../../Components/inputs/ColumnTextInput"
import TextAreaInput from "../../../Components/inputs/TextAreaInput";
import { sendAxiosRequest } from "../../../Utils/sendAxiosRequest";
import { parse } from "cookie";
import axiosInstance from "../../../Utils/axiosConfig";
import { updateMyVendorAction, vendorApproveStoreAction, vendorUnapproveStoreAction } from "../../../requests/vendor/vendor.request";
import { MdDeleteForever } from 'react-icons/md';
import DeleteModal from '../../../Components/modals/DeleteModal';
import { deleteBankDetailsAction } from '../../../requests/wallet/wallet.request';
import { useRouter } from 'next/router';
import { FcMoneyTransfer } from 'react-icons/fc';
import SliderInput from '../../../Components/inputs/SliderInput';

interface ISettingsPageProps {
    userProfile: any;
    vendorProfile: any;
    wallet: any;
}

const index = ({vendorProfile, wallet}: ISettingsPageProps) => {
    const [showAddPaymentMethodModal, setShowAddPaymentMethodModal] = useState<boolean>(false);
    const [vendor, setVendor] = useState(vendorProfile);
    const [isLoading, setIsLoading] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [tab, setTab] = useState('profile');
    const [showDeleteBankDataModal, setShowDeleteBankDataModal] = useState<boolean>(false);
    const [selectedBankID, setSelectedBankID] = useState<string>('');
    const router = useRouter();

    const states = NaijaStates.states();
    const [lgas, setLGAs] = useState<string[]>([]);

    const handleChange = (e: any) => setVendor({...vendor, [e.target.name]: e.target.value});

    const updateVendorProfile = async() => {
        setIsLoading(true);

        await updateMyVendorAction(vendor)
        .then((response) => {
            toast.success('Profile updated')
        })
        .catch(error => {
            console.log({error})
            toast.error(error.response?.data || 'Error Try again later')
        })
        .finally(() => setIsLoading(false))
    }

    const deleteBankDetails = async () => {
        setIsLoading(true);

        await deleteBankDetailsAction(selectedBankID)
        .then(response => {
            toast.success('Bank details deleted successfully')
            setShowDeleteBankDataModal(false)
            setTimeout(()=>window.location.reload(), 2000)
        })
        .catch(error => {
            console.log({error});
            toast.error(error.response?.data?.message || 'Error! Try again later');
        })
        .finally(() => setIsLoading(false));
    }

    const approveStore = async () => {
        setIsApproving(true);

        await vendorApproveStoreAction(vendorProfile.id)
        .then(response => {
            toast.success('Store approved successfully')
            setTimeout(()=>window.location.reload(), 2000)
        })
        .catch(error => {
            console.log({error});
            toast.error(error.response?.data?.message || 'Error! Try again later');
        })
        .finally(() => setIsApproving(false));
    }

    const unapproveStore = async () => {
        setIsApproving(true);

        await vendorUnapproveStoreAction(vendorProfile.id)
        .then(response => {
            toast.success('Store unapproved successfully')
            setTimeout(()=>window.location.reload(), 2000)
        })
        .catch(error => {
            console.log({error});
            toast.error(error.response?.data?.message || 'Error! Try again later');
        })
        .finally(() => setIsApproving(false));
    }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        {
            showAddPaymentMethodModal && <AddPaymentMethodModal
                show={showAddPaymentMethodModal}
                setShow={() => setShowAddPaymentMethodModal(!showAddPaymentMethodModal)}
                redirect={()=>setTimeout(()=>window.location.reload(), 2000)}
            />
        }

        {
            showDeleteBankDataModal && <DeleteModal
                type='Bank Details'
                setShow={() => setShowDeleteBankDataModal(false)}
                loading={isLoading}
                onDelete={deleteBankDetails}
            />
        }

        <VendorSideNavPanel />
        <div className="flex flex-col w-full lg:w-[80%] lg:absolute lg:right-2 lg:left-[20%]">
            <div className='flex flex-col gap-2 px-4 bg-white py-4 mb-2 !mt-20 lg:!mt-0'>
                <h2 className="text-xl font-semibold text-slate-700">Settings</h2>
                <div className="flex flex-row font-semibold text-gray-400">
                    <a 
                        href="#0" 
                        className={`${tab === 'profile' && '!text-orange-500'} hover:!text-orange-500 mr-3`}
                        onClick={() => setTab('profile')}
                    >
                        Profile
                    </a>
                    <a 
                        href="#0" 
                        className={`${tab === 'payment' && '!text-orange-500'} hover:!text-orange-500 mr-3`}
                        onClick={() => setTab('payment')}
                    >
                        Payment
                    </a>
                    {/* <a 
                        href="#0" 
                        className={`hover:!text-orange-500 mr-3 ${tab === 'order' && '!text-orange-500'}`}
                        onClick={() => setTab('order')}
                    >
                        Order
                    </a>
                    <a 
                        href="#0" 
                        className={`hover:!text-orange-500 mr-3 ${tab === 'danger' && '!text-orange-500'}`}
                        onClick={() => setTab('danger')}
                    >
                        Danger
                    </a> */}
                </div>
            </div>

            {/* PROFILE SECTION */}
            {
                tab === 'profile' && 
                <div className="bg-white min-h-screen pt-4 px-4">
                    <div className="flex flex-col gap-4 w-full lg:w-[70%] mb-4">
                        <form className="flex flex-col gap-4">
                            <div className='flex flex-row gap-4 w-full'>
                                <div className='w-[80%]'>
                                    <ColumnTextInput 
                                        label="Vendor Name"
                                        value={vendor?.vendor_name || ""}
                                        name="vendor_name"
                                        placeHolder="Enter vendor name"
                                        onInputChange={handleChange}
                                    />
                                </div>

                                <div className="flex flex-col gap-3 w-[15%]">
                                    <label className="text-base text-gray-700">
                                        Approve
                                    </label>
                                    <SliderInput
                                        name='user_approved'
                                        value={vendor.user_approved}
                                        handleChange={
                                            vendorProfile?.user_approved ?
                                            unapproveStore :
                                            approveStore
                                        }
                                    />
                                    {isApproving && <p className="text-orange-500 text-sm">Updating...</p>}
                                </div>

                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <ColumnTextInput 
                                    label="Phone Number"
                                    value={vendor?.vendor_phone}
                                    name="vendor_phone"
                                    placeHolder="Enter vendor phone"
                                    onInputChange={handleChange}
                                />

                                <ColumnTextInput 
                                    label="Vendor Email"
                                    value={vendor?.vendor_email}
                                    name="vendor_email"
                                    placeHolder="Enter vendor email"
                                    onInputChange={handleChange}
                                />
                            </div>

                            <ColumnTextInput 
                                label="Address"
                                value={vendor?.vendor_address}
                                name="vendor_address"
                                placeHolder="Enter vendor address"
                                onInputChange={handleChange}
                            />

                            <div className='grid grid-cols-3 gap-4'>
                                <div className="flex flex-col mb-3">
                                    <label className="text-base text-gray-700 mt-1">
                                        State
                                    </label>
                                    <select 
                                        className="text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-md px-3 py-2 outline-none"
                                        value={vendor?.vendor_state} 
                                        onChange={(e) => {
                                            setVendor({...vendor, vendor_state: e.target.value})
                                            setLGAs(NaijaStates.lgas(e.target.value).lgas)
                                        }}
                                    >
                                        <option value={''}>Select a state</option>
                                        {
                                            states && states.map((state: string) => (
                                                <option key={state} value={state}>{state}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <ColumnTextInput 
                                    label="Vendor City"
                                    value={vendor?.vendor_city}
                                    name="vendor_city"
                                    placeHolder="Enter vendor city"
                                    onInputChange={handleChange}
                                />

                                <div className="flex flex-col mb-3">
                                    <label className="text-base text-gray-700 mt-1">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="your address"
                                        className="text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-md px-3 py-2 outline-none"
                                        name="name"
                                        defaultValue={'Nigeria'}
                                    />
                                </div>
                            </div>

                            <TextAreaInput
                                label="Description"
                                name="vendor_description"
                                value={vendor?.vendor_description}
                                placeHolder="Enter short description"
                                onInputChange={handleChange}
                            />

                            <div className="w-[80%] lg:w-[30%] mx-auto h-10">
                                <ButtonFull
                                    action="Save"
                                    loading={isLoading}
                                    onClick={updateVendorProfile}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            }

            {/* PAYMENT SECTION */}
            {
                tab === 'payment' &&
                <div className='bg-white relative min-h-[60vh]'>
                    <div className="flex flex-row py-3 px-4 relative bg-white">
                        <div className="w-fit absolute right-4 hidden md:flex">
                            <ButtonFull 
                                action="Add Payment Method"
                                onClick={() => setShowAddPaymentMethodModal(!showAddPaymentMethodModal)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col pb-8 bg-white text-gray-700 px-4">
                        {
                            wallet?.bank_details?.map((bank: any, index: number) => (
                                <div className="flex flex-col w-full lg:w-[40%] border border-gray-100 px-4 py-3 relative mb-4 min-h-[6rem]" key={index}>
                                    <div className="flex flex-row gap-3 items-center">
                                        <span className="font-semibold text-slate-600">{bank.bank_name}</span>
                                        <p className="text-orange-500 text-base mb-0">{bank.account_type}</p>
                                    </div>
                                    <p className="text-gray-800 text-sm mb-0">{bank.account_name}</p>
                                    <p className="text-gray-600 text-sm mb-0">{bank.account_number}</p>

                                    <MdDeleteForever className='absolute bottom-1 right-2 cursor-pointer text-red-400 text-2xl' onClick={() => {
                                        setSelectedBankID(bank.id);
                                        setShowDeleteBankDataModal(true)
                                    }} />
                                </div>
                            ))
                        }

                        {
                            wallet?.bank_details?.length === 0 && (
                                <div className='flex flex-col gap-3 justify-center items-center pt-10'>
                                    <FcMoneyTransfer className='h-20 w-20 transition ease-in-out animate-in duration-500 duration-800 slide-in-from-bottom' />
                                    <p className='text-center font-medium text-xl my-auto'>No bank details</p>
                                </div>
                            )
                        }
                    </div>

                    <div className="flex md:hidden w-[60%] mx-auto mb-8">
                        <ButtonFull
                            action="Add Payment Method"
                            onClick={() => setShowAddPaymentMethodModal(!showAddPaymentMethodModal)} 
                        />
                    </div>
                </div>
            }

            {/* ORDER SECTION */}
            {
                tab === 'order' && 
                <div className="flex flex-col bg-white px-4 py-6 mt-4">
                    <div className="flex flex-row">
                        <div className="flex flex-row">
                            <p className="text-gray-800 mr-1">Enable order accumulator</p>
                            <HiOutlineInformationCircle className="text-lg text-gray-600 cursor-pointer" />
                        </div>
                    </div>
                </div>
            }

            {/* DANGER SECTION */}
            {
                tab === 'danger' &&
                <div className="flex flex-col bg-white px-4 py-6 mt-4">
                    <div className="flex flex-col lg:flex-row gap-4 lg:justify-between">
                        <div className="flex flex-row mr-[5%] align-middle">
                            <p className="mr-1 text-red-500">Delete Vendor Account</p>
                            <HiOutlineInformationCircle className="text-lg text-red-600 cursor-pointer" />
                        </div>
                        <div className="w-fit">
                            <ButtonGhost
                                action="Close Account"
                                onClick={() => {}} 
                            />
                        </div>
                    </div>
                </div>
            }
        </div>
    </div>
  )
}

export default index

export async function getServerSideProps(context: any) {
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;

    try{
       
        const getMyProfile = await sendAxiosRequest(
            '/api/user/me',
            "get",
            {},
            token,
            ''
        );

        const getMyVendorAccount = await axiosInstance.get('/api/vendor/me', {
            headers: {
                Authorization: token
            }
        });

        const getMyWallet = await axiosInstance.get('/api/wallet/me', {
            headers: {
                Authorization: token
            }
        });

        const [myProfile, myVendorAccount, myWallet] = await Promise.allSettled([
            getMyProfile,
            getMyVendorAccount,
            getMyWallet
        ]);

        const userProfile = myProfile.status === 'fulfilled' ? myProfile.value.data : [];
        const myVendor = myVendorAccount.status === 'fulfilled' ? myVendorAccount.value.data : [];
        const wallet = myWallet.status === 'fulfilled' ? myWallet.value.data : [];

        return {
            props: {
                userProfile,
                vendorProfile: myVendor.data,
                wallet: wallet.data
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
                userProfile: {},
                vendorProfile: {},
                wallet: {}
            }
        }
    }
}