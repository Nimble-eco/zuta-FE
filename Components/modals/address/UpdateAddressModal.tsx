import { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import ButtonGhost from "../../buttons/ButtonGhost";
import ButtonFull from "../../buttons/ButtonFull";
import Cookies from "js-cookie";
import axiosInstance from "../../../Utils/axiosConfig";
import { MapPin, Phone, User, Tag, X, Globe } from "lucide-react";
const NaijaStates = require('naija-state-local-government');

export interface IAddress {
    id: number;
    title: string;
    name?: string;
    address: string;
    phone: string;
    state: string;
    city: string;
    country: string;
    zip?: string;
}

interface IUpdateAddressModalProps {
    setShow: () => void;
    address: IAddress;
    redirect?: any;
}

const UpdateAddressModal = ({ setShow, address, redirect }: IUpdateAddressModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [updatedAddress, setUpdatedAddress] = useState(address);
    const states = NaijaStates.states();
    const [lgas, setLGAs] = useState<string[]>([]);

    // Sync LGAs on initial load based on existing state
    useEffect(() => {
        if (address?.state) {
            try {
                const results = NaijaStates.lgas(address.state).lgas;
                setLGAs(results);
            } catch (e) {
                setLGAs([]);
            }
        }
    }, [address]);

    const handleAddressChange = (e: any) => {
        setUpdatedAddress({
            ...updatedAddress,
            [e.target.name]: e.target.value
        });
    }

    const getToken = () => {
        const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
        return user?.access_token;
    }

    const updateAddress = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axiosInstance.post('/api/address/update', updatedAddress, {
                headers: { Authorization: getToken() }
            });
            if (res.status === 200) {
                toast.success('Address updated successfully');
                setShow();
                if (redirect) redirect();
            }
        } catch (error: any) {
            toast.error(error?.message || "Update failed");
        } finally {
            setIsLoading(false);
        }
    }

    const setDefaultAddress = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axiosInstance.post('/api/address/set/default', { id: updatedAddress.id }, {
                headers: { Authorization: getToken() }
            });
            if (res.status === 200) {
                toast.success('Default address updated');
                setShow();
                if (redirect) redirect();
            }
        } catch (error: any) {
            toast.error(error?.message || "Error setting default");
        } finally {
            setIsLoading(false);
        }
    }

    const Label = ({ children, required }: { children: any, required?: boolean }) => (
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center">
            {children}
            {required && <span className="text-orange-500 ml-1">*</span>}
        </label>
    );

    return (
        <Modal 
            show={true} 
            onHide={setShow} 
            centered 
            contentClassName="!border-none !rounded-[2.5rem] shadow-2xl"
        >
            <Modal.Body className="p-0">
                <div className="p-8 md:p-10 relative">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                                Edit Location
                            </span>
                            <h2 className="text-2xl font-black text-slate-800">Update Address</h2>
                        </div>
                        <button onClick={setShow} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <Label required>Address Title</Label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-3 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        name="title"
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm"
                                        value={updatedAddress.title}
                                        onChange={handleAddressChange}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <Label>Recipient Name</Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        name="name"
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm"
                                        value={updatedAddress.name}
                                        onChange={handleAddressChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <Label required>Street Address</Label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-3 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    name="address"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm"
                                    value={updatedAddress.address}
                                    onChange={handleAddressChange}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <Label required>Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-3 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    name="phone"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm"
                                    value={updatedAddress.phone}
                                    onChange={handleAddressChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <Label required>State</Label>
                                <select 
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm appearance-none"
                                    value={updatedAddress.state}
                                    onChange={(e) => {
                                        setUpdatedAddress({...updatedAddress, state: e.target.value})
                                        setLGAs(NaijaStates.lgas(e.target.value).lgas)
                                    }}
                                >
                                    <option value="">Select State</option>
                                    {states?.map((s: string) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <Label required>LGA</Label>
                                <select 
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm appearance-none"
                                    value={updatedAddress.city}
                                    onChange={(e) => setUpdatedAddress({...updatedAddress, city: e.target.value})}
                                >
                                    <option value="">Select LGA</option>
                                    {lgas?.map((lga: string) => <option key={lga} value={lga}>{lga}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <Label>Country</Label>
                                <div className="relative opacity-60">
                                    <Globe className="absolute left-4 top-3 text-slate-400" size={16} />
                                    <input disabled className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm" value="Nigeria" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <Label>Zip Code</Label>
                                <input
                                    type="text"
                                    name="zip"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm"
                                    value={updatedAddress.zip}
                                    onChange={handleAddressChange}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col md:flex-row gap-3 pt-6">
                            <div className="flex-1 order-2 md:order-1">
                                <ButtonGhost 
                                    action={'Set as Default'}
                                    onClick={setDefaultAddress}
                                    loading={isLoading} 
                                />
                            </div>
                            <div className="flex-[1.5] order-1 md:order-2">
                                <ButtonFull
                                    action="Update Address" 
                                    onClick={updateAddress} 
                                    loading={isLoading}   
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default UpdateAddressModal;