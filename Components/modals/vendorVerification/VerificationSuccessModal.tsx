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
        <Modal show={true} onHide={setShow} backdrop="static" dialogClassName='modal-90w'>
            <Modal.Body className='md:!min-w-[40vw] !w-[40vw] relative'>
                <IoIosCloseCircleOutline className='text-3xl text-red-600 text-opacity-60 cursor-pointer absolute top-3 right-3' onClick={setShow} />
                <div className='flex flex-col min-h-[40vh] justify-center align-middle gap-4 px-4'>
                    <h2 className='text-2xl text-green-500 flex flex-row'>
                        Application Submitted
                        <IoIosCheckmarkCircleOutline className='text-3xl ml-3 text-green-500' />
                    </h2>
                    <p className='text-opacity-25 font-semibold'>Use your owner email as email and business name as the password to login to view your profile while you await verification from management</p>
                    <div className='w-[80%] mx-auto h-14'>
                        <ButtonFull
                            action='Login'
                            onClick={() => router.push('/auth/signIn')}
                        />
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default VerificationSuccessModal