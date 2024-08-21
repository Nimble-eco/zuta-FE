import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import { MdOutlineClose } from 'react-icons/md';
import SwiperSlider from "../../sliders/Swiper";
import { formatAmount } from "../../../Utils/formatAmount";
import ButtonFull from "../../buttons/ButtonFull";
import RatingsCard from "../../cards/RatingsCard";
import { useRouter } from "next/router";
import { cancelAnOrderAction, completeAnOrderAction } from "../../../requests/order/order.request";
import { storeProductRatingAction } from "../../../requests/productRating/productRating.request";

interface IShowOrderModalProps {
    order: any;
    setShow: () => void;
}

const ShowOrderModal = ({order, setShow}: IShowOrderModalProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState('');

    const cancelOrder = async () => {
        setIsLoading(true);
        cancelAnOrderAction({id: order.id})
        .then((response) => {
            setIsLoading(false);
            if(response.status === 201) {
                toast.success('Order Cancelled');
            }  
        })
        .catch((error) => {
            console.log({error})
            setIsLoading(false);
            toast.error(error.response?.message ?? 'Error try again later');
        })
    }

    const completeOrder = async () => {
        setIsLoading(true);
        completeAnOrderAction({id: order.id})
        .then((response) => {
            setIsLoading(false);
            if(response.status === 201) {
                toast.success('Order Completed');
                setShow();
                setTimeout(() => router.push('/profile?path=orders'), 3000);
            }  
        })
        .catch((error) => {
            console.log({error})
            setIsLoading(false);
            toast.error(error.response?.message ?? 'Error try again later');
        });

        if(comment !== '' && rating === 0) return toast.error('Please update the rating star');

        if(rating > 0) {
            return storeProductRatingAction({
                product_id: order?.product?.id,
                score: rating,
                comment
            })
            .catch(error => {
                console.log({error});
                toast.error(error.response?.message ?? 'Error try again later');
            })
        }

        setShow();
        setTimeout(() => router.push('/profile?path=orders'), 3000);
    }

  return (
    <div className="!rounded-md ">
        <Modal show={true} onHide={setShow} backdrop="static" dialogClassName='modal-90w'>
            <Modal.Body className='md:!min-w-[40vw] !w-[40vw] relative'>
                <MdOutlineClose className='text-3xl cursor-pointer absolute top-3 right-3' onClick={setShow} />
                <div className='flex flex-col min-h-[50vh]'>
                    <div className="flex flex-col w-[95%] mx-auto px-5 py-4 mt-10 relative">
                        <div className='w-full cursor-pointer max-w-1/3 h-full flex align-middle' onClick={() => router.push(`/product?id=${order?.product?.id}`)}>
                            <SwiperSlider 
                                slides={order?.product?.product_images}
                            />
                        </div>
                        <div className="flex flex-col gap-1 mt-4">
                            <h1 className="text-xl md:text-2xl justify-center mb-0">{order?.product?.product_name}</h1>
                            <p className="text-gray-600 py-2 mb-0">{order?.product?.product_description}</p>
                            <div className="flex flex-row gap-8 w-full">
                                <div 
                                    className='flex flex-row gap-1'
                                >
                                    <p className="text-gray-600 !mb-0">Price:</p>
                                    <span className=''>{formatAmount(order?.product_price_paid)}</span>
                                </div>
                                <div 
                                    className='flex flex-row gap-1'
                                >
                                    <p className="text-gray-600 !mb-0"> Quantity:</p>
                                    <span className=''>{order?.quantity}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-[2px]">
                                <p className="text-lg font-semibold opacity-25 !mb-0">Fees:</p>
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex flex-row gap-1">
                                        <p className="text-gray-600">Delivery Fee:</p>
                                        <p className="text-gray-600">{formatAmount(order?.order_delivery_fee)}</p>
                                    </div>
                                    <div className="flex flex-row gap-1">
                                        <p className="text-gray-600">Service Fee:</p>
                                        <p className="text-gray-600">{order?.order_service_fee}</p>
                                    </div>
                                </div>
                            </div>
                            <div 
                                className='flex flex-row gap-4 text-lg'
                            >
                                <p className="text-gray-600">Total:</p>
                                <span className='font-semibold'>{formatAmount(order?.order_amount)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {
                            order?.status === 'unshipped' && (
                                <div className="w-fit mx-auto flex flex-col gap-1">
                                    <div className="w-[50%[ mx-auto h-12">
                                        <ButtonFull
                                            action="Cancel Order"
                                            onClick={cancelOrder}
                                            loading={isLoading}
                                        />
                                    </div>
                                    <p className="text-xs">Orders can only be cancelled when they have not been shipped</p>
                                </div>
                            )
                        }

                        {
                            order?.status === 'delivered' && (
                                <div className="w-[80%] mx-auto flex flex-col gap-2 mb-6">
                                    <div className="flex flex-row gap-4 align-middle">
                                        <p className="!mb-0">Rate this product:</p>
                                        <div className="my-auto">
                                            <RatingsCard rating={rating} setRatings={setRating}/>
                                        </div>
                                    </div>
                                    <textarea 
                                        name="user-experience"
                                        className="h-48 rounded-[16px] bg-gray-100 outline-none px-4 py-5"
                                        placeholder="Leave a review"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <div className="w-[50%[ mx-auto h-12">
                                        <ButtonFull
                                            action="Rate Product"
                                            onClick={completeOrder}
                                        />
                                    </div>
                                    
                                </div>
                            )
                        } 
                    </div>
                    
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default ShowOrderModal