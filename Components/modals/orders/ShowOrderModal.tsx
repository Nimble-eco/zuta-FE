import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import { MdOutlineClose } from 'react-icons/md';
import { HiOutlineInformationCircle, HiOutlineShoppingBag, HiOutlineStar } from 'react-icons/hi';
import SwiperSlider from "../../sliders/Swiper";
import { formatAmount } from "../../../Utils/formatAmount";
import ButtonFull from "../../buttons/ButtonFull";
import ButtonGhost from "../../buttons/ButtonGhost";
import RatingsCard from "../../cards/RatingsCard";
import { useRouter } from "next/router";
import { cancelAnOrderAction, completeAnOrderAction } from "../../../requests/order/order.request";
import { storeProductRatingAction } from "../../../requests/productRating/productRating.request";

interface IShowOrderModalProps {
    order: any;
    setShow: () => void;
}

const ShowOrderModal = ({ order, setShow }: IShowOrderModalProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [rating, setRating] = useState<number>(order?.review?.score || 0);
    const [comment, setComment] = useState(order?.review?.comment || '');

    const status = order?.status;

    const cancelOrder = async () => {
        setIsLoading(true);
        cancelAnOrderAction({id: order.id})
        .then((response) => {
            setIsLoading(false);
            if(response.status === 202) {
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
        if (comment.trim() !== '' && rating === 0) {
            return toast.error('Please select a star rating for your review');
        }
    
        setIsLoading(true);
    
        try {
            if (status !== 'completed') {
                await completeAnOrderAction({ id: order.id });
            }
    
            if (rating > 0) {
                await storeProductRatingAction({
                    product_id: order?.product?.id,
                    score: rating,
                    comment: comment.trim()
                });
            }
    
            toast.success('Order completed and review submitted!');
            setShow();
            
            setTimeout(() => router.push('/profile?path=orders'), 2000);
    
        } catch (error: any) {
            console.error("Order Completion Error:", error);
            const errorMessage = error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal 
            show={true} 
            onHide={setShow} 
            centered 
            backdrop="static" 
            dialogClassName='lg:!min-w-[70%]'
        >
            <Modal.Body className='p-0 overflow-hidden rounded-[2rem] bg-white border-none'>
                {/* Close Button */}
                <button 
                    onClick={setShow} 
                    className="absolute top-4 right-4 z-50 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-slate-100 transition-colors"
                >
                    <MdOutlineClose className='text-2xl text-slate-800' />
                </button>

                <div className='flex flex-col lg:flex-row min-h-[500px]'>
                    
                    {/* Left: Visuals Section */}
                    <div className="w-full lg:w-5/12 bg-slate-50 relative p-6 flex flex-col justify-center border-r border-slate-100">
                        <div className="cursor-pointer group" onClick={() => router.push(`/product?id=${order?.product?.id}`)}>
                            <SwiperSlider slides={order?.product?.product_images} />
                        </div>
                        
                        {/* Order Status Badge */}
                        <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${
                            status === 'delivered' ? 'bg-green-500 text-white' : 
                            status === 'shipped' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-white'
                        }`}>
                            {status}
                        </div>
                    </div>

                    {/* Right: Order Details Section */}
                    <div className="w-full lg:w-7/12 p-6 lg:p-10 flex flex-col">
                        
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-orange-500 font-bold text-[10px] tracking-widest uppercase mb-1">
                                <HiOutlineShoppingBag /> Regular Purchase
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 capitalize mb-2 leading-tight">
                                {order?.product?.product_name}
                            </h1>
                            <p className="text-slate-500 text-sm italic">
                                {order?.product?.product_introduction}
                            </p>
                        </div>

                        {/* Financial Summary Card */}
                        <div className="bg-slate-50 rounded-2xl p-5 mb-8 space-y-3 border border-slate-100">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Unit Price</span>
                                <span className="font-bold text-slate-800">{formatAmount(order?.product_price_paid)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Quantity</span>
                                <span className="font-bold text-slate-800">x{order?.quantity}</span>
                            </div>
                            <div className="flex flex-col pt-2 border-t border-slate-200">
                                <div className="flex justify-between text-xs text-slate-400 mb-1">
                                    <span>Delivery Fee</span>
                                    <span>{formatAmount(order?.order_delivery_fee)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Service Fee</span>
                                    <span>{formatAmount(order?.order_service_fee)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-300">
                                <span className="text-slate-900 font-black text-xs uppercase">Total Paid</span>
                                <span className="text-2xl font-black text-slate-900">
                                    {formatAmount(order?.order_amount)}
                                </span>
                            </div>
                        </div>

                        {/* Conditional Action Section */}
                        <div className="mt-auto">
                            {status === 'unshipped' && (
                                <div className="space-y-3">
                                    <ButtonGhost
                                        action="Cancel Order"
                                        onClick={cancelOrder}
                                        loading={isLoading}
                                    />
                                    <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                                        <HiOutlineInformationCircle className="text-xs" />
                                        You can only cancel before your order is prepared for shipping.
                                    </p>
                                </div>
                            )}

                            {status === 'delivered' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="flex items-center gap-2 mb-3">
                                        <HiOutlineStar className="text-orange-500" />
                                        <span className="text-sm font-bold text-slate-700">How's your order?</span>
                                        <div className="ml-auto scale-90 origin-right">
                                            <RatingsCard rating={rating} setRatings={(s: number)=>setRating(s)}/>
                                        </div>
                                    </div>
                                    <textarea 
                                        className="w-full h-32 rounded-2xl bg-slate-50 border border-slate-100 outline-none px-4 py-4 text-sm focus:ring-2 focus:ring-orange-100 transition-all mb-4"
                                        placeholder="Share your experience with this product..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <ButtonFull
                                        action="Submit Review"
                                        onClick={completeOrder}
                                        loading={isLoading}
                                    />
                                </div>
                            )}

                            {status === 'shipped' && (
                                <div className="bg-blue-50 p-4 rounded-2xl text-center">
                                    <p className="text-blue-700 font-bold text-sm mb-1">Your order is on the way!</p>
                                    <p className="text-blue-500 text-xs">Tracking details will be updated as they arrive.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ShowOrderModal;