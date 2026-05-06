import { MdOutlineClose } from "react-icons/md";
import { useEffect, useState, useMemo } from "react";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import MySearchInput from "../../inputs/MySearchInput";
import { RiHomeSmileLine, RiAddLine } from "react-icons/ri";
import { HiCheckCircle } from "react-icons/hi";
import { sendAxiosRequest } from "../../../Utils/sendAxiosRequest";
import ButtonFull from "../../buttons/ButtonFull";
import LoadingState from "../../loaders/Loader";

interface ISelectAddressModalProps {
    selectAddress: (address: any) => void;
    setShow: () => void;
    showNewAddressModal?: () => void;
}

const SelectAddressModal = ({ selectAddress, setShow, showNewAddressModal }: ISelectAddressModalProps) => {
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [myAddresses, setMyAddresses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const user = useMemo(() => {
        const cookie = Cookies.get('user');
        return cookie ? JSON.parse(cookie) : null;
    }, []);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        sendAxiosRequest(
            `/api/address/me`,
            "get",
            {},
            user?.access_token,
            ''
        ).then(res => {
            if (isMounted) {
                setMyAddresses(res.data);
                setIsLoading(false);
                // Auto-select first address if available
                if (res.data?.length > 0) setSelectedAddress(res.data[0]);
            }
        }).catch(error => {
            if (isMounted) setIsLoading(false);
            if (error.response?.status === 401) return toast.error('Session expired. Please login.');
            toast.error('Could not fetch addresses');
        });

        return () => { isMounted = false; };
    }, [user?.access_token]);

    // Filter addresses based on search term
    const filteredAddresses = myAddresses.filter(addr => 
        addr.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        addr.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Modal 
            show={true} 
            onHide={setShow} 
            centered 
            backdrop="static" 
            contentClassName="!border-none !rounded-[2rem] overflow-hidden"
        >
            <Modal.Body className="p-0">
                <div className="flex flex-col max-h-[85vh]">
                    
                    {/* Header Section */}
                    <div className="px-6 pt-8 pb-4 bg-white sticky top-0 z-10">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Delivery Address</h2>
                                <p className="text-sm text-slate-500">Where should we send your order?</p>
                            </div>
                            <button 
                                onClick={setShow}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <MdOutlineClose className="text-2xl text-slate-500" />
                            </button>
                        </div>

                        <MySearchInput
                            name="address-search"
                            searchInputPlaceHolder="Search saved addresses..."
                            value={searchTerm}
                            onSearch={(search: string) => setSearchTerm(search)}
                        />
                    </div>

                    {/* Scrollable Address List */}
                    <div className="px-6 py-2 overflow-y-auto flex-1">
                        {isLoading ? (
                            <div className="py-20 flex justify-center"><LoadingState /></div>
                        ) : (
                            <div className="grid gap-3 mb-6">
                                {filteredAddresses.map((address) => (
                                    <div 
                                        key={address.id}
                                        onClick={() => setSelectedAddress(address)}
                                        className={`group relative flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                                            selectedAddress?.id === address.id 
                                            ? 'border-orange-500 bg-orange-50/30' 
                                            : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                                        }`}
                                    >
                                        <div className={`p-3 rounded-xl transition-colors ${
                                            selectedAddress?.id === address.id ? 'bg-orange-500 text-white' : 'bg-white text-slate-400'
                                        }`}>
                                            <RiHomeSmileLine size={24} />
                                        </div>
                                        
                                        <div className="flex-1 pr-6">
                                            <p className={`font-bold text-base ${selectedAddress?.id === address.id ? 'text-slate-900' : 'text-slate-700'}`}>
                                                {address.title}
                                            </p>
                                            <p className="text-sm text-slate-500 line-clamp-2 mt-1 italic">
                                                {address.address}
                                            </p>
                                        </div>

                                        {selectedAddress?.id === address.id && (
                                            <HiCheckCircle className="absolute top-4 right-4 text-orange-500 text-2xl" />
                                        )}
                                    </div>
                                ))}

                                {/* Add New Address Action */}
                                <button 
                                    onClick={showNewAddressModal}
                                    className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-orange-300 hover:text-orange-500 transition-all group"
                                >
                                    <RiAddLine className="text-xl group-hover:scale-110 transition-transform" />
                                    <span className="font-semibold text-sm">Add New Address</span>
                                </button>
                            </div>
                        )}

                        {filteredAddresses.length === 0 && !isLoading && searchTerm && (
                            <div className="text-center py-10">
                                <p className="text-slate-400">No addresses match "{searchTerm}"</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Action */}
                    <div className="p-6 bg-white border-t border-slate-100 sticky bottom-0 z-10">
                        <ButtonFull
                            action="Use Selected Address"
                            onClick={() => selectedAddress && selectAddress(selectedAddress)}
                            disabled={!selectedAddress || isLoading}
                        />
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default SelectAddressModal;