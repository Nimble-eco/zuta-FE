import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MdOutlineClose } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';
import ButtonGhost from "../../buttons/ButtonGhost";
import ButtonFull from "../../buttons/ButtonFull";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import axiosInstance from "../../../Utils/axiosConfig";
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
}

const UpdateAddressModal = ({setShow, address}: IUpdateAddressModalProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [updatedAddress, setUpdatedAddress] = useState(address);
    const states = NaijaStates.states();
    const [lgas, setLGAs] = useState<string[]>([]);

    let token: string;
    if (typeof window !== "undefined") {
        injectStyle();
        let user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
        token = user?.access_token;
    }
    
    const handleAddressChange = ( e: any ) => {
        setUpdatedAddress({
            ...updatedAddress,
            [e.target.name]: e.target.value
        });
    }

    const updateAddress = async (e: any) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            const res = await axiosInstance.post(
                '/api/address/update',
                updatedAddress,
                {headers: {Authorization: token}}
            );

            if(res.status === 200){
                setIsLoading(false);
                toast.success('Address Updated');
                router.push('/profile')
            }
        } catch(error: any) {
            toast.error(error?.message || "Error Try later")
        }
    }

    const setDefaultAddress = async (e: any) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            const res = await axiosInstance.post(
                '/api/address/set/default',
                {id: updatedAddress.id},
                {headers: {Authorization: token}}
            );

            if(res.status === 200){
                setIsLoading(false);
                toast.success('Address Updated');
                router.push('/profile')
            }
        } catch(error: any) {
            toast.error(error?.message || "Error Try later")
        }
    }

  return (
    <div className="!rounded-md ">
        <ToastContainer />
        <Modal show={true} onHide={setShow} backdrop="static" dialogClassName='modal-90w'>
            <Modal.Body className='md:min-w-[40vw] w-[40vw]'>
                <div className='flex flex-col min-h-[50vh] relative'>
                    <MdOutlineClose className='text-3xl cursor-pointer absolute top-3 right-3' onClick={setShow} />
                    <form className="flex flex-col w-[95%] md:w-[80%] mx-auto my-10">
                        <h3 className="text-center mb-3 font-bold text-base text-gray-600">Update Address</h3>
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
                                value={updatedAddress.title || ""}
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
                                value={updatedAddress.name || ""}
                                onChange={(e) => handleAddressChange(e)}
                            />
                        </div>

                        <div className="flex flex-col mb-3">
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
                                value={updatedAddress?.address || ''}
                                onChange={(e) => handleAddressChange(e)}
                            />
                        </div>

                        <div
                            className="flex flex-col mb-3"
                        >
                            <label
                                className="text-base text-gray-700 mt-1"
                            >
                                Phone number
                            </label>
                            <input
                                type="text"
                                placeholder="2349012345678"
                                className="text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-md px-3 py-2 outline-none"
                                name="phone"
                                value={updatedAddress?.phone}
                                onChange={(e) => handleAddressChange(e)}
                            />
                        </div>

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
                                value={updatedAddress.state} 
                                onChange={(e) => {
                                    setUpdatedAddress({...updatedAddress, state: e.target.value})
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
                                value={updatedAddress.city} 
                                onChange={(e) => setUpdatedAddress({...updatedAddress, city: e.target.value})}
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
                                value={updatedAddress.zip}
                                onChange={(e) => handleAddressChange(e)}
                            />
                        </div>
                    
                        <div className="flex flex-col md:flex-row mt-4 gap-3">
                            <div className="w-[45%] whitespace-nowrap">
                                <ButtonGhost 
                                    action="Set default address"
                                    onClick={(e: any) => setDefaultAddress(e)}
                                    loading={isLoading} 
                                />
                            </div>
                            <div className="w-[55%]">
                                <ButtonFull
                                    action="Update Address" 
                                    onClick={(e: any) => updateAddress(e)} 
                                    loading={isLoading}   
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default UpdateAddressModal