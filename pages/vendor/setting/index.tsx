import { toast } from 'react-toastify';
import VendorSideNavPanel from "../../../Components/vendor/layout/VendorSideNavPanel"
import { useEffect, useState } from 'react'
const NaijaStates = require('naija-state-local-government');
import AddPaymentMethodModal from "../../../Components/modals/settings/AddPaymentMethodModal"
import ColumnTextInput from "../../../Components/inputs/ColumnTextInput"
import TextAreaInput from "../../../Components/inputs/TextAreaInput";
import { sendAxiosRequest } from "../../../Utils/sendAxiosRequest";
import { parse } from "cookie";
import axiosInstance from "../../../Utils/axiosConfig";
import { updateMyVendorAction, vendorApproveStoreAction, vendorUnapproveStoreAction } from "../../../requests/vendor/vendor.request";
import DeleteModal from '../../../Components/modals/DeleteModal';
import { deleteBankDetailsAction } from '../../../requests/wallet/wallet.request';
import SliderInput from '../../../Components/inputs/SliderInput';
import VendorNavBar from '../../../Components/vendor/layout/VendorNavBar';
import { 
    User, 
    CreditCard, 
    Store, 
    MapPin, 
    Trash2, 
    Plus, 
    AlertTriangle,
} from "lucide-react";

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
    
    const states = NaijaStates.states();
    const [lgas, setLGAs] = useState<string[]>([]);

    useEffect(()=>{
        setLGAs(NaijaStates.lgas(vendorProfile?.vendor_state).lgas);
    }, [vendorProfile]);

    const handleChange = (e: any) => setVendor({...vendor, [e.target.name]: e.target.value});

    const updateVendorProfile = async() => {
        setIsLoading(true);

        await updateMyVendorAction(vendor)
        .then(() => {
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
        .then(() => {
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
        .then(() => {
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
        .then(() => {
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
    <div className="min-h-screen bg-gray-50 flex flex-row">
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
        <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
            <VendorNavBar />

            {/* Header & Tabs */}
            <div className="p-6 lg:p-10 max-w-5xl">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
                <p className="text-slate-500 text-sm">Manage your store presence and payment preferences.</p>
            </header>

            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-8">
                {[
                { id: 'profile', label: 'Store Profile', icon: User },
                { id: 'payment', label: 'Payments', icon: CreditCard },
                // { id: 'danger', label: 'Security', icon: AlertTriangle },
                ].map((t) => (
                <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    tab === t.id 
                        ? "bg-white text-orange-600 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    }`}
                >
                    <t.icon size={16} />
                    {t.label}
                </button>
                ))}
            </div>

            {/* PROFILE TAB */}
            {tab === 'profile' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                
                {/* Store Status Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${vendorProfile?.user_approved ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                        <Store size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">Store Visibility</h3>
                        <p className="text-sm text-slate-500">
                        {vendor.user_approved ? "Your store is currently live and accepting orders." : "Your store is offline."}
                        </p>
                    </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                    <SliderInput
                        name='user_approved'
                        value={vendor.user_approved}
                        handleChange={vendorProfile?.user_approved ? unapproveStore : approveStore}
                    />
                    {isApproving && <span className="text-[10px] text-orange-500 animate-pulse font-medium">Processing...</span>}
                    </div>
                </div>

                {/* General Information */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-semibold text-slate-800">General Information</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ColumnTextInput 
                                label="Store Name" 
                                value={vendor?.vendor_name || ""} 
                                name="vendor_name" 
                                onInputChange={handleChange} 
                            />
                                <ColumnTextInput 
                                label="Contact Email" 
                                value={vendor?.vendor_email} 
                                name="vendor_email" 
                                onInputChange={handleChange} 
                            />
                            <ColumnTextInput 
                                label="Phone Number" 
                                value={vendor?.vendor_phone} 
                                name="vendor_phone" 
                                onInputChange={handleChange} 
                            />
                        </div>
                        <TextAreaInput 
                            label="Store Description" 
                            name="vendor_description" 
                            value={vendor?.vendor_description} 
                            onInputChange={handleChange} 
                        />
                    </div>
                </div>

                {/* Location Information */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 text-slate-800 font-semibold">
                        <MapPin size={18} className="text-orange-500" />
                        <h3>Business Location</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <ColumnTextInput label="Street Address" value={vendor?.vendor_address} name="vendor_address" onInputChange={handleChange} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700">State</label>
                                <select 
                                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-3 outline-none focus:ring-2 focus:ring-orange-500/20"
                                    value={vendor?.vendor_state} 
                                    onChange={(e) => {
                                        setVendor({...vendor, vendor_state: e.target.value})
                                        setLGAs(NaijaStates.lgas(e.target.value).lgas)
                                    }}
                                >
                                    <option value="">Select State</option>
                                    {states?.map((s: string) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700">City</label>
                                <select 
                                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-3 outline-none focus:ring-2 focus:ring-orange-500/20"
                                    value={vendor?.vendor_city} 
                                    onChange={(e) => {
                                        setVendor({...vendor, vendor_city: e.target.value})
                                    }}
                                >
                                    <option value="">Select City</option>
                                    {lgas?.map((s: string) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            {/* <ColumnTextInput label="City" value={vendor?.vendor_city} name="vendor_city" onInputChange={handleChange} /> */}
                            <ColumnTextInput label="Country" value="Nigeria" name="country" onInputChange={()=>{}} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        onClick={updateVendorProfile}
                        disabled={isLoading}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-3 rounded-xl font-semibold shadow-lg shadow-orange-200 transition-all disabled:opacity-50"
                    >
                        {isLoading ? "Saving Changes..." : "Save Profile"}
                    </button>
                </div>
                </div>
            )}

            {/* PAYMENT TAB */}
            {tab === 'payment' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-800 text-lg">Saved Bank Accounts</h3>
                        <button 
                            onClick={() => setShowAddPaymentMethodModal(true)}
                            className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg transition-colors"
                        >
                            <Plus size={18} />
                            Add New
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {wallet?.bank_details?.map((bank: any) => (
                        <div key={bank.id} className="group relative bg-white border border-slate-200 p-5 rounded-2xl hover:border-orange-200 hover:shadow-md transition-all">
                            <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{bank.account_type}</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="text-xs font-bold text-orange-600">{bank.bank_name}</span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-800 leading-tight uppercase">{bank.account_name}</h4>
                                <p className="text-slate-500 font-mono tracking-widest">{bank.account_number}</p>
                            </div>
                            <button 
                                onClick={() => { setSelectedBankID(bank.id); setShowDeleteBankDataModal(true); }}
                                className="text-slate-300 hover:text-red-500 transition-colors p-2"
                            >
                                <Trash2 size={20} />
                            </button>
                            </div>
                        </div>
                        ))}
                    </div>

                    {wallet?.bank_details?.length === 0 && (
                        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center text-center">
                            <div className="bg-slate-100 p-4 rounded-full mb-4">
                                <CreditCard size={32} className="text-slate-400" />
                            </div>
                            <h4 className="text-slate-800 font-semibold">No bank details found</h4>
                            <p className="text-slate-500 text-sm mb-6">Add a bank account to receive your payouts.</p>
                            <button 
                                onClick={() => setShowAddPaymentMethodModal(true)}
                                className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium"
                            >
                                Add Payment Method
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* DANGER TAB */}
            {tab === 'danger' && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-center justify-between animate-in fade-in duration-500">
                    <div className="flex items-center gap-4 text-red-700">
                        <div className="bg-red-100 p-3 rounded-xl"><AlertTriangle /></div>
                        <div>
                            <h3 className="font-bold">Close Vendor Account</h3>
                            <p className="text-sm opacity-80">This action is permanent and cannot be undone.</p>
                        </div>
                    </div>
                    <button className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-red-700 transition-colors">
                        Close Account
                    </button>
                </div>
            )}
            </div>
        </main>
    </div>
  )
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