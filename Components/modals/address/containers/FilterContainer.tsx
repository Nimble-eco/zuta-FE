import React from 'react';
import { ToastContainer } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MdOutlineClose } from 'react-icons/md';
import ButtonFull from '../../../buttons/ButtonFull';

type FilterComponentProps = {
    show: boolean;
    setShow: () => void;
    children: React.ReactNode[];
    onFilter: () => void;
}

const FilterContainer: React.FC<FilterComponentProps> = ({ show, setShow, children, onFilter }) => {
    return (
        <div className="!rounded-md ">
            <ToastContainer />
            <Modal show={show} onHide={setShow} backdrop="static" dialogClassName='modal-90w'>
                <Modal.Body className='md:!min-w-[40vw] !w-[40vw] flex flex-col min-h-[50vh] relative'>
                    <MdOutlineClose className='text-3xl cursor-pointer absolute top-3 right-3' onClick={setShow} />
                    <form className="flex flex-col w-[90%] md:w-[80%] mx-auto my-10">
                        {
                            children?.map((component, index) => (
                                <div key={index}>
                                    {component}
                                </div>
                            ))
                        }
                        <div className='w-fit mx-auto my-5'>
                            <ButtonFull
                                action='Filter'
                                onClick={onFilter}
                            />
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default FilterContainer;