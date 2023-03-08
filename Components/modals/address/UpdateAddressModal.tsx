import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MdOutlineClose } from 'react-icons/md';
import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';
import { notify } from "../../../Utils/displayToastMessage";
import { getGoogleAddressPredictions } from "../../../Utils/getPredictedAddress";
import { sendAxiosRequest } from "../../../Utils/sendAxiosRequest";
import ButtonGhost from "../../buttons/ButtonGhost";
import ButtonFull from "../../buttons/ButtonFull";


interface IUpdateAddressModalProps {
    show: boolean;
    setShow: () => void;
    address: any;
    index: number;
    getAddressDetails: (placeID: string, index: number) => void;
    handleChange: (index: number, e: any) => void;
    updateAddress: () => void;
}

const UpdateAddressModal = ({show, setShow, address, index, getAddressDetails, handleChange, updateAddress}: IUpdateAddressModalProps) => {
    const [isLoading, setIsLoading] = useState(false);

    let token: string;
    if (typeof window !== "undefined") {
        injectStyle();
        token = localStorage.getItem('token')!;
    }

    // AUTOCOMPLETE USER ADDRESS WITH GOOGLE API
    const [predictedAddress, setPredictedAddress] = useState<string[]>([]);

    const getAddressPredictions =async (input :string) => {
        const predictedAddresses = await getGoogleAddressPredictions(input);
        console.log('predicted address =', predictedAddresses);
        setPredictedAddress(predictedAddresses);
    }

  return (
    <div className="!rounded-md ">
        <ToastContainer />
        <Modal show={show} onHide={setShow} backdrop="static" dialogClassName='modal-90w'>
            <Modal.Body className='md:min-w-[40vw] w-[40vw]'>
                <div className='flex flex-col min-h-[50vh] relative'>
                    <MdOutlineClose className='text-3xl cursor-pointer absolute top-3 right-3' onClick={setShow} />
                    <form className="flex flex-col w-[90%] md:w-[60%] mx-auto my-10">
                        <h3 className="text-center mb-3 font-bold text-base text-gray-600">Update Address</h3>
                        <div className="flex flex-col mb-3">
                            <label className="text-base text-gray-700 mt-1">
                                Title
                            </label>
                            <input
                                type="text"
                                placeholder="Eg home, work, school"
                                className="text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-md px-3 py-2"
                                name="title"
                                value={address.title || ""}
                                onChange={(e) => handleChange(index, e)}
                            />
                        </div>

                        <div className="flex flex-col mb-3">
                            <label
                                className="text-base text-gray-700 mt-1"
                            >
                                Address
                            </label>
                            <input
                                type="text"
                                placeholder="your address"
                                className="text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-md px-3 py-2"
                                name="name"
                                value={address?.name || ''}
                                onChange={async (e) => getAddressPredictions(e.target.value)}
                            />
                        </div>

                        {
                            predictedAddress.length > 0 && predictedAddress.map((address: any, index: any) => (
                                <div
                                    className="flex flex-row items-center justify-between border-b border-gray-200 py-3"
                                    key={index}
                                    onClick={() => getAddressDetails(address.place_id, index)}
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
                        <div className="flex flex-col gap-y-3">
                            <ButtonGhost 
                                action="Set default address"
                                onClick={() => {}}
                                loading={isLoading} 
                            />
                            <ButtonFull
                                action="Update Address" 
                                onClick={updateAddress} 
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

export default UpdateAddressModal