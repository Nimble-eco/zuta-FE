import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import { injectStyle } from "react-toastify/dist/inject-style";
import { MdOutlineClose } from 'react-icons/md';
import SwiperSlider from "../../sliders/Swiper";
import { formatAmount } from "../../../Utils/formatAmount";
import ButtonFull from "../../buttons/ButtonFull";
import RatingsCard from "../../cards/RatingsCard";
import { useRouter } from "next/router";
import { unsubscribeOrderTrainAction, updateOrderTrainStatusAction } from "../../../requests/orderTrain/orderTrain.request";
import { storeProductRatingAction } from "../../../requests/productRating/productRating.request";
import ButtonGhost from "../../buttons/ButtonGhost";

interface IShowOrderTrainModalProps {
    orderTrain: any;
    setShow: () => void;
}

const ShowOrderTrainModal = ({orderTrain, setShow}: IShowOrderTrainModalProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState('');

    if(typeof window !== 'undefined') injectStyle();

    const cancelOrder = async () => {
        setIsLoading(true);
        unsubscribeOrderTrainAction(orderTrain.id)
        .then((response) => {
            setIsLoading(false);
            if(response.status === 201) {
                toast.success('Order Cancelled');
            }  
        })
        .catch((error) => {
            console.log({error})
            setIsLoading(false);
            toast.error(error.response?.data?.message ?? 'Error try again later');
        })
        .finally(() => {
            setShow();
            setTimeout(() => router.push('/profile?path=orders'), 3000);
        })
    }

    
    const completeOrder = async () => {
        setIsLoading(true);
        updateOrderTrainStatusAction({
            id: orderTrain.id,
            status: 'delivered'
        })
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
                product_id: orderTrain?.product?.id,
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
    <div className="!rounded-md">
        <ToastContainer />
        <Modal show={true} onHide={setShow} backdrop="static" dialogClassName='modal-lg'>
            <Modal.Body className='relative'>
                <MdOutlineClose className='text-3xl cursor-pointer absolute top-3 right-3' onClick={setShow} />
                <div className='flex flex-col min-h-[50vh]'>
                    <h2 className="text-2xl font-semibold my-4 w-fit ml-[3%] uppercase">Order Train</h2>
                    <div className="flex flex-col lg:flex-row gap-6 w-[95%] mx-auto py-2 relative">
                        <div className='w-full lg:w-[50%] cursor-pointer h-full flex align-middle' onClick={() => router.push(`/product?id=${orderTrain?.product?.id}`)}>
                            <SwiperSlider 
                                slides={orderTrain?.product?.product_images}
                            />
                        </div>
                        <div className="w-full lg:w-[50%] flex flex-col gap-1 !mt-4 lg:!mt-0">
                            <h1 className="text-xl md:text-2xl justify-center mb-0">{orderTrain?.product_name}</h1>
                            <p className="text-gray-600 py-2 mb-0">{orderTrain?.product?.product_description}</p>
                            <div className="flex flex-row gap-8 w-full">
                                <div 
                                    className='flex flex-row gap-1'
                                >
                                    <p className="text-gray-600 !mb-0">Price:</p>
                                    <span className=''>{formatAmount(orderTrain?.pivot_open_order_price_paid ?? orderTrain?.open_order_price_paid)}</span>
                                </div>
                                <div 
                                    className='flex flex-row gap-1'
                                >
                                    <p className="text-gray-600 !mb-0"> Quantity:</p>
                                    <span className=''>{orderTrain?.pivot_quantity ?? orderTrain?.quantity}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-[2px]">
                                <p className="text-lg font-semibold opacity-25 !mb-0">Fees:</p>
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex flex-row gap-1">
                                        <p className="text-gray-600">Delivery Fee:</p>
                                        <p className="text-gray-600">{formatAmount(orderTrain?.pivot_order_delivery_fee ?? orderTrain?.order_delivery_fee)}</p>
                                    </div>
                                    <div className="flex flex-row gap-1">
                                        <p className="text-gray-600">Service Fee:</p>
                                        <p className="text-gray-600">{formatAmount(orderTrain?.pivot_order_service_fee ?? orderTrain?.order_service_fee)}</p>
                                    </div>
                                </div>
                            </div>
                            <div 
                                className='flex flex-row gap-4 text-lg'
                            >
                                <p className="text-gray-600">Total:</p>
                                <span className='font-semibold'>{formatAmount(orderTrain?.pivot_order_amount ?? orderTrain?.order_amount)}</span>
                            </div>
                            {
                                (orderTrain?.pivot_status ?? orderTrain?.status) === 'unshipped' && (
                                    <div className="w-fit flex flex-col gap-1">
                                        <div className="w-[50%] h-12">
                                            <ButtonGhost
                                                action="Cancel Order"
                                                onClick={cancelOrder}
                                                loading={isLoading}
                                            />
                                        </div>
                                        <p className="text-xs">Orders can only be cancelled when they have not been shipped</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    <div className="flex flex-row gap-4">
                        <div className="flex flex-col gap-4 w-full lg:w-[50%] p-4">

                            {
                                (orderTrain?.pivot_status ?? orderTrain?.status) === 'shipped' && (
                                    <div className="w-[90%] mx-auto flex flex-col gap-2 mb-6">
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
                                        <div className="w-[50%] mx-auto lg:!mx-0 h-12">
                                            <ButtonFull
                                                action="Rate Product"
                                                onClick={completeOrder}
                                            />
                                        </div>
                                        
                                    </div>
                                )
                            } 
                        </div>

                        <div className="flex flex-col gap-4 w-full lg:w-[50%] p-4"></div>
                    </div>
                    
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default ShowOrderTrainModal