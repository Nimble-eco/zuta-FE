import { MdOutlineClose } from "react-icons/md"
import { useEffect, useState } from "react";
import Cookies from 'js-cookie'
import { toast, ToastContainer } from 'react-toastify';
import { injectStyle } from "react-toastify/dist/inject-style";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import MySearchInput from "../../inputs/MySearchInput";
import { RiHomeSmileLine } from "react-icons/ri";
import { sendAxiosRequest } from "../../../Utils/sendAxiosRequest";
import ButtonFull from "../../buttons/ButtonFull";
import LoadingState from "../../loaders/Loader";

interface ISelectAddressModalProps {
    selectAddress: (address: any) => void;
    setShow: () => void;
    showNewAddressModal?: () => void;
}

const SelectAddressModal = ({selectAddress, setShow, showNewAddressModal}: ISelectAddressModalProps) => {
    const [selectedAddress, setSelectedAddress] = useState<any>({});
    const [myAddresses, setMyAddresses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    let user: any = {};

    if(typeof window !== 'undefined') {
        injectStyle();
        user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
    }

    useEffect(() => {
        let isMounted = true;

        setIsLoading(true)
        sendAxiosRequest(
            `/api/address/me`,
            "get",
            {},
            user?.access_token,
            ''
        ).then(res => {
            if(isMounted) {
                setMyAddresses(res.data);
                setIsLoading(false)
            }
        }).catch(error => {
            console.log({error})
            isMounted && setIsLoading(false);
            if(error.response?.status === 401) return toast.error('Session expired. You need to login');
            toast.error(error?.response?.message || 'Error! Try again later')
        });

        return () => {
            isMounted = false;
        }
    }, []);

  return (
    <div className="!rounded-md ">
        <ToastContainer />

        <Modal show={true} onHide={setShow} backdrop="static" dialogClassName='modal-90w'>
            <Modal.Body className='md:!min-w-[30vw] !w-[30vw]'>
                <div className='flex flex-col min-h-[50vh] relative'>
                    <MdOutlineClose className='text-3xl cursor-pointer absolute top-3 right-3' onClick={setShow} />
                    <div className="w-[90%] mx-auto pt-16 pb-10 flex flex-col gap-4">
                        <div>
                            <MySearchInput
                                name="address"
                                searchInputPlaceHolder="Search address"
                                value=""
                                onSearch={() => {}}
                            />
                        </div>

                        {
                            isLoading && (
                                <div className="w-full flex align-middle justify-start mt-10">
                                    <LoadingState />
                                </div>
                            )
                        }

                        {
                            myAddresses?.length > 0 ? myAddresses?.map((address) => (
                                <div 
                                    key={address.id}
                                    onClick={() => setSelectedAddress(address)}
                                    className={`flex flex-col gap-0 rounded-[20px] px-4 py-3 bg-gray-400 bg-opacity-20 text-black cursor-pointer ${selectedAddress.id === address.id && 'border-[1px] border-orange-500'}`}
                                >
                                    <div className='flex flex-row gap-2 mb-0'>
                                        <RiHomeSmileLine className="text-xl mr-2" />
                                        <p className="font-semibold">{address.title}</p>
                                    </div>
                                    <p className="text-sm line-clamp-3 pt-0">{address.address}</p>
                                </div>
                            )) : 
                            <p className="text-center font-medium cursor-pointer text-orange-500 mt-4" onClick={showNewAddressModal}>Add Address</p>
                        }

                        <div className="h-12 w-[40%] mx-auto">
                            <ButtonFull
                                action="Continue"
                                onClick={() => selectAddress(selectedAddress)}
                            />
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>  
                    
    </div>
  )
}

export default SelectAddressModal