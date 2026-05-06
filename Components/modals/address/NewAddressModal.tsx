import { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
const NaijaStates = require('naija-state-local-government');
import { ToastContainer, toast } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';
import { notify } from "../../../Utils/displayToastMessage";
import { sendAxiosRequest } from "../../../Utils/sendAxiosRequest";
import ButtonFull from "../../buttons/ButtonFull";
import Cookies from "js-cookie";
import { MapPin, Phone, User, Tag, X, Globe } from "lucide-react";

interface INewAddressModalProps {
    setShow: () => void;
    redirect?: () => void;
}

const NewAddressModal = ({ setShow, redirect }: INewAddressModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userAddress, setUserAddress] = useState<any>({
        title: '',
        name: '',
        address: '',
        phone: '',
        state: '',
        city: '',
        country: 'Nigeria',
        zip: '',
    });

    const states = NaijaStates.states();
    const [lgas, setLGAs] = useState<string[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined") injectStyle();
    }, []);

    const handleAddressChange = (e: any) => {
        setUserAddress({
            ...userAddress,
            [e.target.name]: e.target.value
        });
    };

    const saveUserAddress = async () => {
        const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
        const token = user?.access_token;

        if (!userAddress.title || !userAddress.address || !userAddress.state || !userAddress.city) {
            return toast.error("Please fill in all required fields");
        }

        setIsLoading(true);
        try {
            await sendAxiosRequest('/api/address/store', 'post', userAddress, token, '');
            setIsLoading(false);
            toast.success('Address saved successfully');
            setShow();
            if (redirect) redirect();
        } catch (error: any) {
            setIsLoading(false);
            notify(error?.message || "Error saving address");
        }
    };

    const Label = ({ children, required }: { children: any, required?: boolean }) => (
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center">
            {children}
            {required && <span className="text-orange-500 ml-1">*</span>}
        </label>
    );

    return (
        <Modal 
            show={true} 
            onHide={setShow} 
            centered 
            backdrop="static"
            contentClassName="!border-none !rounded-[2rem] shadow-2xl"
        >
            <ToastContainer />
            <Modal.Body className="p-0 overflow-hidden">
                <div className="relative p-8 lg:p-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add New Address</h2>
                            <p className="text-slate-500 text-sm font-medium">Where should we deliver your Zuta orders?</p>
                        </div>
                        <button 
                            onClick={setShow}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); saveUserAddress(); }}>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Address Title */}
                            <div className="flex flex-col">
                                <Label required>Address Label</Label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="e.g. Home, Office"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-slate-700"
                                        value={userAddress.title}
                                        onChange={handleAddressChange}
                                    />
                                </div>
                            </div>

                            {/* Receiver Name */}
                            <div className="flex flex-col">
                                <Label>Receiver Name</Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Who is receiving?"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-slate-700"
                                        value={userAddress.name}
                                        onChange={handleAddressChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="flex flex-col">
                            <Label required>Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="0901 234 5678"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-slate-700"
                                    value={userAddress.phone}
                                    onChange={handleAddressChange}
                                />
                            </div>
                        </div>

                        {/* Street Address */}
                        <div className="flex flex-col">
                            <Label required>Street Address</Label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="House number and street name"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-slate-700"
                                    value={userAddress.address}
                                    onChange={handleAddressChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* State Selection */}
                            <div className="flex flex-col">
                                <Label required>State</Label>
                                <select 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-slate-700 appearance-none"
                                    onChange={(e) => {
                                        setUserAddress({...userAddress, state: e.target.value.toLowerCase()})
                                        setLGAs(NaijaStates.lgas(e.target.value).lgas)
                                    }}
                                >
                                    <option value="">Select State</option>
                                    {states && states.map((s: string) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            {/* LGA Selection */}
                            <div className="flex flex-col">
                                <Label required>LGA / City</Label>
                                <select 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-slate-700 appearance-none disabled:opacity-50"
                                    disabled={!userAddress.state}
                                    onChange={(e) => setUserAddress({...userAddress, city: e.target.value})}
                                >
                                    <option value="">Select LGA</option>
                                    {lgas?.map((lga: string) => (
                                        <option key={lga} value={lga}>{lga}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Country (Disabled for clarity) */}
                            <div className="flex flex-col">
                                <Label>Country</Label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-3.5 text-slate-300" size={18} />
                                    <input
                                        disabled
                                        className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-400 cursor-not-allowed"
                                        value="Nigeria"
                                    />
                                </div>
                            </div>

                            {/* Zip Code */}
                            <div className="flex flex-col">
                                <Label>Zip Code</Label>
                                <input
                                    type="text"
                                    name="zip"
                                    placeholder="Optional"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-slate-700"
                                    value={userAddress.zip}
                                    onChange={handleAddressChange}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <ButtonFull
                                action="Save Shipping Address" 
                                onClick={(e: any) => {
                                    e.preventDefault();
                                    saveUserAddress();
                                }} 
                                loading={isLoading}   
                            />
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default NewAddressModal;