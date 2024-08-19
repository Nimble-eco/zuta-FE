import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import ButtonFull from '../../buttons/ButtonFull';
import { useRouter } from 'next/router';
import { IoIosCheckmarkCircleOutline, IoIosCloseCircleOutline } from 'react-icons/io'

interface IVerificationSuccessModalProps {
    setShow: () => void;
}

const VerificationSuccessModal = ({setShow}: IVerificationSuccessModalProps) => {
    const router = useRouter();

  return (
    <div className="!rounded-md">
        <Modal show={true} onHide={setShow} backdrop="static" dialogClassName='w-[90%] md:modal-90w mx-auto'>
            <Modal.Body className='md:!min-w-[40vw] md:w-[65vw] lg::!w-[45vw] relative mx-auto'>
                <IoIosCloseCircleOutline className='text-3xl text-red-600 text-opacity-60 cursor-pointer absolute top-3 right-3' onClick={setShow} />
                <div className='flex flex-col min-h-[40vh] justify-center text-center align-middle gap-4 px-4'>
                    <h2 className='text-xl text-green-500 flex flex-row justify-center'>
                        Application Submitted
                        <IoIosCheckmarkCircleOutline className='text-2xl ml-3 text-green-500' />
                    </h2>
                    <p className='text-opacity-25 font-semibold text-sm'>
                        Your account is currently inactive and under review by management. <br /> In the meantime, you can start adding your products to your dashboard.
                    </p>
                    <div className='w-[70%] mx-auto h-13'>
                        <ButtonFull
                            action='Go to dashbard'
                            onClick={() => router.push('/vendor/product')}
                        />
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default VerificationSuccessModal