import React from 'react';
import { ToastContainer } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import ButtonFull from '../../buttons/ButtonFull';
import { RiCloseCircleLine } from 'react-icons/ri';

type FilterComponentProps = {
    show: boolean;
    setShow: () => void;
    children: React.ReactNode[];
    onFilter: () => void;
    isLoading?: boolean;
}

const FilterContainer: React.FC<FilterComponentProps> = ({ show, setShow, children, onFilter, isLoading }) => {
    return (
        <div className="!rounded-md overflow-scroll">
            <ToastContainer />
            <Modal show={show} onHide={setShow} backdrop="static" dialogClassName='modal-90w'>
                <Modal.Body className='md:!min-w-[40vw] !w-[40vw] flex flex-col min-h-[40vh] relative overflow-scroll'>
                    <RiCloseCircleLine className='text-3xl text-orange-500 cursor-pointer absolute top-3 right-3' onClick={setShow} />
                    <div className="flex flex-col w-[90%] md:w-[80%] mx-auto my-6 overflow-x-auto !gap-4">
                        <h3 className='text-center text-slate-500 font-medium text-lg'>Filter By</h3>
                        {
                            children?.map((component, index) => (
                                <div key={index}>
                                    {component}
                                </div>
                            ))
                        }
                        <div className='w-full mx-auto mb-3'>
                            <ButtonFull
                                action='Filter'
                                loading={isLoading}
                                onClick={(e: any) => {
                                    e.preventDefault();
                                    onFilter()
                                }}
                            />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default FilterContainer;