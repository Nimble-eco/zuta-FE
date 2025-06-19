import { ArrowRightIcon, User2Icon } from 'lucide-react';
import { Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsShop } from 'react-icons/bs';
import { useRouter } from 'next/router';

interface ILoginSelectWorkspaceModalProps {
    show: boolean;
    setShow: any;
}

const LoginSelectWorkSpaceModal = ({
    show,
    setShow
}: ILoginSelectWorkspaceModalProps) => {
    const router = useRouter();

  return (
    <Modal  
        show={show} 
        onHide={setShow}  
        dialogClassName='modal-90w'
    >
        <Modal.Body className='md:!min-w-[40vw] min-h-[30vh] py-5 px-4 flex flex-col gap-4'>
            <h2 className='text-2xl text-center text-orange-600 font-semibold'>Select Profile</h2>

            <div 
                className='flex flex-row items-center justify-between py-4 px-4  bg-slate-100 rounded-2xl cursor-pointer !border border-orange-500'
                onClick={()=>router.push('/')}
            >
                <div className='flex flex-row items-center gap-4'>
                    <User2Icon className='text-slate-800 h-8 w-8' />
                    <p className='text-xl font-semibold text-slate-800 mb-0'>User</p>
                </div>
                <ArrowRightIcon className='text-slate-800 h-5 w-8' />
            </div>

            <div 
                className='flex flex-row items-center justify-between py-4 px-4  bg-slate-100 rounded-2xl cursor-pointer !border border-orange-500'
                onClick={()=>router.push('/vendor')}
            >
                <div className='flex flex-row items-center gap-4'>
                    <BsShop className='text-slate-800 h-8 w-8' />
                    <p className='text-xl font-semibold text-slate-800 mb-0'>Vendor</p>
                </div>
                <ArrowRightIcon className='text-slate-800 h-5 w-8' />
            </div>
        </Modal.Body>
    </Modal>
  )
}

export default LoginSelectWorkSpaceModal