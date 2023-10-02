import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MdOutlineClose } from 'react-icons/md';

interface IShowOrderModalProps {
    order: any;
    setShow: () => void;
}

const ShowOrderModal = ({order, setShow}: IShowOrderModalProps) => {
  return (
    <div className="!rounded-md ">
        <Modal show={true} onHide={setShow} backdrop="static" dialogClassName='modal-90w'>
            <Modal.Body className='md:!min-w-[40vw] !w-[40vw] relative'>
                <MdOutlineClose className='text-3xl cursor-pointer absolute top-3 right-3' onClick={setShow} />
                <div className='flex flex-col min-h-[50vh]'>
                    <div className="flex flex-col md:flex-row w-[95%] mx-auto px-5 py-4 mt-10 relative">

                    </div>
                    
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default ShowOrderModal