import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { MdOutlineArrowRight, MdOutlineArrowLeft, MdOutlinePlayArrow, MdOutlinePause, MdOutlineClose } from "react-icons/md";
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoIosCloseCircleOutline } from 'react-icons/io';

interface IMyGalleryProps {
    show: boolean;
    setShow: () => void;
    slides: string[];
}

const MyGallery = ({show, setShow, slides}: IMyGalleryProps) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [autoSlide, setAutoSlide] = useState<boolean>(false);

    let slideInterval: any;
    let intervalTime = 5000;

    const goToNext = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }

    const autoScroll = () => {
        slideInterval = setInterval(goToNext, intervalTime);
    }

    useEffect(() => {
        if(autoSlide) {
            autoScroll();
        }
        return () => clearInterval(slideInterval);
    }, [currentIndex, autoSlide]);


  return (
    <div className="!rounded-md z-50">
        <Modal show={show} onHide={setShow} dialogClassName='lg:modal-90w !w-[90vw] max-w-full overflow-auto'>
            <Modal.Body className='lg:min-w-[60vw] lg:w-[60vw]'>
                <div className='flex flex-col h-[60vh] lg:min-h-[70vh] lg:h-[90vh] relative'>
                    <IoIosCloseCircleOutline className='text-3xl text-red-600 cursor-pointer absolute top-3 right-3' onClick={setShow} />
                    <div className='h-[50%] lg:h-[65%] w-full'>
                        <img 
                            src={slides[currentIndex]} 
                            alt='product image'
                            className='w-full h-full !rounded-t-md' 
                        /> 
                    </div>
                    <div className='flex flex-row w-[30%] mx-auto justify-between pt-3'>
                        <MdOutlineArrowLeft 
                            className='text-4xl cursor-pointer'
                            onClick={() => goToPrevious()}
                        />
                        {
                            autoSlide ? 
                                <MdOutlinePause
                                    className='text-4xl cursor-pointer'
                                    onClick={() => setAutoSlide(false)}
                                /> :
                                <MdOutlinePlayArrow 
                                    className='text-4xl cursor-pointer'
                                    onClick={() => setAutoSlide(true)}
                                /> 
                        }
                        <MdOutlineArrowRight
                            className='text-4xl cursor-pointer'
                            onClick={() => goToNext()}
                        />
                    </div>
                    <div className='flex flex-row overflow-x-auto gap-4 my-4 px-4 justify-center'>
                        {
                            slides?.map((slide, index) => (
                                <img 
                                    key={`${slide}${index}`}
                                    src={slide}
                                    alt='product image'
                                    className='cursor-pointer rounded-md w-32 h-32'
                                    onClick={() => setCurrentIndex(index)}
                                />
                            ))
                        }
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default MyGallery