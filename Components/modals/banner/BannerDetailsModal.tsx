import { Modal } from 'react-bootstrap'
import ButtonGhost from '../../buttons/ButtonGhost';
import ButtonFull from '../../buttons/ButtonFull';
import { useRouter } from 'next/router';

interface IBannerDetailsProps {
    title: string;
    id: number;
    setShow: () => void;
}
const BannerDetailsModal = ({title, id, setShow}: IBannerDetailsProps) => {
    const router = useRouter();
  return (
    <div className="!rounded-md">
        <Modal show={true} onHide={setShow} backdrop="static" dialogClassName='modal-90w'>
            <Modal.Body className='md:!min-w-[40vw] min-h-[30vh] py-5 px-4 flex flex-col gap-2'>
                <h2 className='text-xl text-center capitalize'>{title}</h2>
                <p className='text-center'>Update the details of this resource, continue ?</p>
                <div className='w-[80%] mx-auto flex flex-col-reverse lg:flex-row gap-4 justify-center'>
                    <div className='h-14 lg:w-[40%]'>
                        <ButtonGhost
                            action='Cancel'
                            onClick={setShow}
                        />
                    </div>
                    <div className='h-14 lg:w-[60%]'>
                        <ButtonFull
                            action='Edit'
                            onClick={()=>router.push(`banners/${id}`)}
                        />
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default BannerDetailsModal