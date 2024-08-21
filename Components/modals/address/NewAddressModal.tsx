import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
const NaijaStates = require('naija-state-local-government');
import { ToastContainer, toast } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';
import { notify } from "../../../Utils/displayToastMessage";
import { getAddressDetailsFromGoogleAPI } from "../../../Utils/getAddressDetailsFromGoogle";
import { sendAxiosRequest } from "../../../Utils/sendAxiosRequest";
import ButtonFull from "../../buttons/ButtonFull";
import Cookies from "js-cookie";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface INewAddressModalProps {
    setShow: () => void;
    redirect?: () => void;
}

const NewAddressModal = ({setShow, redirect}: INewAddressModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userAddress, setUserAddress] = useState<any>({
        title: '',
        name: '',
        address: '',
        phone: '',
        state: '',
        city: '',
        country: 'nigeria',
        zip: '',
    });
    const states = NaijaStates.states();
    const [lgas, setLGAs] = useState<string[]>([]);

    let token: string;
    if (typeof window !== "undefined") {
        injectStyle();
        let user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
        token = user?.access_token;
    }

    // AUTOCOMPLETE USER ADDRESS WITH GOOGLE API
    const [predictedAddress, setPredictedAddress] = useState<string[]>([]);

    // SET ADDRESS DETAILS
    const getAddressDetails = async (placeId :string) => {
        let res = await getAddressDetailsFromGoogleAPI(placeId);
        setUserAddress({
            ...userAddress,
            name: res?.formatted_address,
            address: res
        });
    }

    const handleAddressChange = ( e: any ) => {
        setUserAddress({
            ...userAddress,
            [e.target.name]: e.target.value
        })
    }

    const saveUserAddress = async () => {
        setIsLoading(true);
        try {
            const res = await sendAxiosRequest(
                '/api/address/store',
                'post',
                userAddress,
                token,
                ''
            );
            setIsLoading(false);
            toast.success('Address Created');
            setShow();
            if(redirect) redirect();
            
        } catch(error: any) {
            setIsLoading(false);
            notify(error?.message || "Error Try later")
        }
    }

  return (
    <div className="!rounded-md ">
        <ToastContainer />
        <Modal show={true} onHide={setShow} backdrop="static" dialogClassName='lg:modal-90w'>
            <Modal.Body className='md:!min-w-[40vw] w-[90%] lg:!w-[40vw] mx-auto'>
                <div className='flex flex-col min-h-[50vh] justify-center relative'>
                    <IoIosCloseCircleOutline className='text-3xl text-red-600 text-opacity-60 cursor-pointer absolute top-3 right-3' onClick={setShow} />
                    <form className="flex flex-col w-[90%] mx-auto my-10">
                        <h3 className="text-center mb-3 font-bold text-base text-gray-600">Enter New Address</h3>
                        <div className="flex flex-col mb-3">
                            <label className="text-base text-gray-700 mt-1">
                                Title
                                <span className="text-red-500 ml-2">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Eg home, work, school"
                                className="text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-md px-3 py-2 outline-none"
                                name="title"
                                value={userAddress.title || ""}
                                onChange={(e) => handleAddressChange(e)}
                            />
                        </div>

                        <div className="flex flex-col mb-3">
                            <label className="text-base text-gray-700 mt-1">
                                Name
                            </label>
                            <input
                                type="text"
                                placeholder="Eg home, work, school"
                                className="text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-md px-3 py-2 outline-none"
                                name="name"
                                value={userAddress.name || ""}
                                onChange={(e) => handleAddressChange(e)}
                            />
                        </div>

                        <div
                            className="flex flex-col mb-3"
                        >
                            <label
                                className="text-base text-gray-700 mt-1"
                            >
                                Address
                                <span className="text-red-500 ml-2">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="your address"
                                className="text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-md px-3 py-2 outline-none"
                                name="address"
                                value={userAddress?.address}
                                onChange={async (e) => handleAddressChange(e)}
                            />
                        </div>

                        <div
                            className="flex flex-col mb-3"
                        >
                            <label
                                className="text-base text-gray-700 mt-1"
                            >
                                Phone number
                                <span className="text-red-500 ml-2">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="2349012345678"
                                className="text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-md px-3 py-2 outline-none"
                                name="phone"
                                value={userAddress?.phone}
                                onChange={(e) => handleAddressChange(e)}
                            />
                        </div>

                        {
                            predictedAddress?.length > 0 && predictedAddress?.map((address: any, index: any) => (
                                <div
                                    className="flex flex-row items-center justify-between py-3"
                                    key={index}
                                    onClick={() => getAddressDetails(address.place_id)}
                                >
                                    <span
                                        className="text-gray-800 m-0"
                                    >
                                        {address.description}
                                    </span>
                                    <button
                                        className="bg-orange-500 text-white px-2 py-1 rounded-md"
                                    >
                                        Select
                                    </button>
                                </div>
                            ))
                        }

                        <div
                            className="flex flex-col mb-3"
                        >
                            <label
                                className="text-base text-gray-700 mt-1"
                            >
                                State
                                <span className="text-red-500 ml-2">*</span>
                            </label>
                            <select 
                                className="text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-md px-3 py-2 outline-none"
                                value={userAddress.state} 
                                onChange={(e) => {
                                    setUserAddress({...userAddress, state: e.target.value})
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

                        <div
                            className="flex flex-col mb-3"
                        >
                            <label
                                className="text-base text-gray-700 mt-1"
                            >
                                LGA
                                <span className="text-red-500 ml-2">*</span>
                            </label>
                            <select 
                                className="text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-md px-3 py-2 outline-none"
                                value={userAddress.city} 
                                onChange={(e) => setUserAddress({...userAddress, city: e.target.value})}
                            >
                                <option value={''}>Select a local government area</option>
                                {
                                    lgas && lgas?.map((lga: string) => (
                                        <option key={lga} value={lga}>{lga}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div
                            className="flex flex-col mb-3"
                        >
                            <label
                                className="text-base text-gray-700 mt-1"
                            >
                                Country
                                <span className="text-red-500 ml-2">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="your address"
                                className="text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-md px-3 py-2 outline-none"
                                name="name"
                                defaultValue={'Nigeria'}
                            />
                        </div>
                            
                        <div
                            className="flex flex-col mb-3"
                        >
                            <label
                                className="text-base text-gray-700 mt-1"
                            >
                                Zip Code
                            </label>
                            <input
                                type="text"
                                placeholder="enter zip code"
                                className="text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-md px-3 py-2 outline-none"
                                name="zip"
                                value={userAddress.zip}
                                onChange={(e) => handleAddressChange(e)}
                            />
                        </div>
                            
                        <div className="h-12 w-fit mx-auto">
                            <ButtonFull
                                action="Save Address" 
                                onClick={(e: any) => {
                                    e.preventDefault()
                                    saveUserAddress()
                                }} 
                                loading={isLoading}   
                            />
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default NewAddressModal