import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import { notify } from "../../../Utils/displayToastMessage";
import { sendAxiosRequest } from "../../../Utils/sendAxiosRequest";
import ButtonGhost from "../../buttons/ButtonGhost";
import Cookies from "js-cookie";
import { AlertTriangle, X } from "lucide-react";
import Button from "../../buttons";

interface IDeleteAddressModalProps {
    setShow: () => void;
    redirect?: () => void;
    id: number;
}

const DeleteAddressModal = ({ setShow, id, redirect }: IDeleteAddressModalProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const deleteUserAddress = async () => {
        const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
        const token = user?.access_token;

        setIsLoading(true);
        try {
            await sendAxiosRequest(
                '/api/address/delete',
                'post',
                { id },
                token,
                ''
            );
            setIsLoading(false);
            toast.success('Address removed successfully');
            setShow();
            if (redirect) redirect();
        } catch (error: any) {
            setIsLoading(false);
            notify(error?.message || "Could not delete address. Please try again.");
        }
    };

    return (
        <Modal 
            show={true} 
            onHide={setShow} 
            centered 
            backdrop="static"
            contentClassName="!border-none !rounded-[2.5rem] shadow-2xl"
        >
            <Modal.Body className="p-0">
                <div className="relative p-8 md:p-10">
                    {/* Close Button */}
                    <button 
                        onClick={setShow}
                        className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex flex-col items-center text-center">
                        {/* Danger Icon Container */}
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle size={32} className="text-red-600" />
                            </div>
                        </div>

                        {/* Text Content */}
                        <h3 className="text-2xl font-black text-slate-800 mb-2">
                            Remove Address?
                        </h3>
                        <p className="text-slate-500 font-medium leading-relaxed mb-8 max-w-[280px]">
                            Are you sure you want to delete this address? This action cannot be undone.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col w-full gap-3">
                            <div className="w-full h-12">
                                <Button 
                                    className="bg-red-700 h-14 w-full text-white rounded-full"
                                    onClick={(e: any) => {
                                        e.preventDefault();
                                        deleteUserAddress();
                                    }} 
                                    loading={isLoading}
                                >
                                    Yes, Delete Address
                                </Button>
                            </div>
                            <div className="w-full h-14">
                                <ButtonGhost
                                    action="No, Keep it" 
                                    onClick={setShow}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default DeleteAddressModal;