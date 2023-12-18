import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';
import { notify } from "../../../Utils/displayToastMessage";
import { sendAxiosRequest } from "../../../Utils/sendAxiosRequest";
import ButtonFull from "../../buttons/ButtonFull";
import Cookies from "js-cookie";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface IDeleteAddressModalProps {
    setShow: () => void;
    redirect?: () => void;
    id: number;
}

const DeleteAddressModal = ({setShow, id, redirect}: IDeleteAddressModalProps) => {
    const [isLoading, setIsLoading] = useState(false);

    let token: string;
    if (typeof window !== "undefined") {
        injectStyle();
        let user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
        token = user?.access_token;
    }

    const deleteUserAddress = async () => {
        setIsLoading(true);
        try {
            const res = await sendAxiosRequest(
                '/api/address/delete',
                'post',
                {id},
                token,
                ''
            );
            setIsLoading(false);
            toast.success('Address Deleted');
            setShow();
            if(redirect) redirect();
            
        } catch(error: any) {
            notify(error?.message || "Error Try later")
        }
    }

  return (
    <div className="!rounded-md ">
        <ToastContainer />
        <Modal show={true} onHide={setShow} backdrop="static" dialogClassName='modal-90w'>
            <Modal.Body className='md:!min-w-[40vw] !w-[40vw]'>
                <div className='flex flex-col py-auto relative'>
                    <IoIosCloseCircleOutline className='text-3xl text-red-600 text-opacity-60 cursor-pointer absolute top-3 right-3' onClick={setShow} />
                    <form className="flex flex-col w-[90%] md:w-[60%] mx-auto my-10">
                        <h3 className="text-center mb-3 font-bold text-base text-gray-600">Delete Address</h3>
                        <p className="text-center">You will no longer have access to this address, continue ?</p>
                            
                        <ButtonFull
                            action="Delete Address" 
                            onClick={(e: any) => {
                                e.preventDefault()
                                deleteUserAddress()
                            }} 
                            loading={isLoading}   
                        />
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default DeleteAddressModal