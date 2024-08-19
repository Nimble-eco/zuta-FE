import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';
import ButtonGhost from '../../../buttons/ButtonGhost';
import ButtonFull from '../../../buttons/ButtonFull';

interface IDeleteProductModalProps {
    setShow: () => void;
    onDelete: () => void;
    loading?: boolean;
}

const DeleteProductModal = ({setShow, onDelete, loading}: IDeleteProductModalProps) => {
    if (typeof window !== "undefined") {
        injectStyle();
    }
  return (
    <div className="!rounded-md">
        <ToastContainer />
        <Modal show={true} onHide={setShow} backdrop="static" dialogClassName='modal-90w'>
            <Modal.Body className='md:!min-w-[40vw] min-h-[30vh] py-5 px-4 flex flex-col gap-2'>
                <h2 className='text-xl text-center'>Delete Product</h2>
                <p className='text-center'>You will no longer have access to this resource, continue ?</p>
                <div className='w-[80%] mx-auto flex flex-col-reverse lg:grid lg:grid-cols-2 gap-4 justify-center'>
                    <div className='h-10'>
                        <ButtonGhost
                            action='Cancel'
                            onClick={setShow}
                        />
                    </div>
                    <div className='h-10'>
                        <ButtonFull
                            action='Delete'
                            loading={loading}
                            onClick={onDelete}
                        />
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default DeleteProductModal