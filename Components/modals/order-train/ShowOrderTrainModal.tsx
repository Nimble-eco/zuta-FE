import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import { MdOutlineClose } from 'react-icons/md';
import { HiOutlineShare, HiOutlineLink, HiOutlineInformationCircle } from 'react-icons/hi';
import { FaWhatsapp, FaFacebook, FaTwitter } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import SwiperSlider from "../../sliders/Swiper";
import { formatAmount } from "../../../Utils/formatAmount";
import ButtonFull from "../../buttons/ButtonFull";
import ButtonGhost from "../../buttons/ButtonGhost";
import RatingsCard from "../../cards/RatingsCard";
import { useRouter } from "next/router";
import { unsubscribeOrderTrainAction, updateOrderTrainStatusAction } from "../../../requests/orderTrain/orderTrain.request";
import { storeProductRatingAction } from "../../../requests/productRating/productRating.request";
import { Clock } from "lucide-react";

interface IShowOrderTrainModalProps {
    orderTrain: any;
    setShow: () => void;
}

const ShowOrderTrainModal = ({ orderTrain, setShow }: IShowOrderTrainModalProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [rating, setRating] = useState<number>(orderTrain?.review?.score || 0);
    const [comment, setComment] = useState(orderTrain?.review?.comment || '');
    const [copied, setCopied] = useState(false);
    
    const status = orderTrain?.pivot_status ?? orderTrain?.status;
    const shareUrl = `${window.location.origin}/join-train/${orderTrain?.id}`;
   
    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSocialShare = (platform: string) => {
        const text = encodeURIComponent(`Join my Order Train on Zuta to unlock a massive discount on ${orderTrain?.product_name}!`);
        const urls: Record<string, string> = {
            whatsapp: `https://wa.me/?text=${text}%20${shareUrl}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
            twitter: `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,
            tiktok: `https://www.tiktok.com/upload` // TikTok usually requires manual upload/paste
        };

        if (platform === 'tiktok') handleCopyLink();
        window.open(urls[platform], '_blank');
    };

    const cancelOrder = async () => {
        setIsLoading(true);
        unsubscribeOrderTrainAction(orderTrain.id)
        .then((response) => {
            setIsLoading(false);
            if(response.status === 202) {
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
        if (comment.trim() !== '' && rating === 0) {
            return toast.error('Please select a star rating for your review');
        }

        setIsLoading(true);
        
        try {
            if (status !== 'completed') {
                await updateOrderTrainStatusAction({
                    id: orderTrain.id,
                    status: 'completed'
                })
            }

            if(rating > 0) {
                await storeProductRatingAction({
                    product_id: orderTrain?.product?.id,
                    score: rating,
                    comment
                })
                .catch(error => {
                    console.log({error});
                    throw Error(error.response?.data?.message);
                })
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
    }

    return (
        <Modal show={true} onHide={setShow} centered dialogClassName='w-full md:!min-w-[70%]'>
            <Modal.Body className='!p-0 overflow-scroll rounded-[2rem]'>
                <button onClick={setShow} className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm">
                    <MdOutlineClose className='text-2xl text-slate-800' />
                </button>

                <div className="flex flex-col lg:flex-row min-h-[600px]">
                    {/* Left Side: Product Visuals */}
                    <div className="w-full lg:w-1/2 bg-slate-50 relative">
                        <div className="h-[300px] lg:h-[85%] lg:my-auto flex items-center justify-center p-4">
                            <SwiperSlider slides={orderTrain?.product?.product_images} />
                        </div>
                        {/* Status Badge */}
                        <div className={`absolute z-20 top-6 left-6 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                            status === 'shipped' ? 'bg-blue-500 text-white' : 
                            status === 'delivered' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                        }`}>
                            {status}
                        </div>
                    </div>

                    {/* Right Side: Details & Sharing */}
                    <div className="w-full lg:w-1/2 p-6 lg:p-10 flex flex-col bg-white">
                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2 capitalize">
                                {orderTrain?.product_name}
                            </h2>
                            <p className="text-slate-500 text-sm line-clamp-2 italic"
                                dangerouslySetInnerHTML={{__html: orderTrain?.product?.product_description}}
                            />
                        </div>

                        {/* Order Summary Table */}
                        <div className="bg-slate-50 rounded-2xl p-4 mb-6 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Price Per Unit</span>
                                <span className="font-semibold text-slate-800">{formatAmount(orderTrain?.pivot_open_order_price_paid ?? orderTrain?.open_order_price_paid)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Quantity</span>
                                <span className="font-semibold text-slate-800">x{orderTrain?.pivot_quantity ?? orderTrain?.quantity}</span>
                            </div>
                            <div className="flex justify-between text-sm border-t border-slate-200 pt-3">
                                <span className="text-slate-500">Delivery & Service</span>
                                <span className="text-slate-800">
                                    {formatAmount((orderTrain?.pivot_order_delivery_fee ?? orderTrain?.order_delivery_fee) + (orderTrain?.pivot_order_service_fee ?? orderTrain?.order_service_fee))}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-slate-900 font-bold uppercase text-xs">Total Paid</span>
                                <span className="text-xl font-black text-orange-600">
                                    {formatAmount(orderTrain?.pivot_order_amount ?? orderTrain?.order_amount)}
                                </span>
                            </div>
                        </div>

                        {/* Conditionally Render: Share vs Rate */}
                        {status === 'unshipped' ? (
                            <div className="mt-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold uppercase text-[10px] tracking-widest">
                                    <HiOutlineShare className="text-orange-500 text-sm" />
                                    Fill your train faster
                                </div>
                                <div className="grid grid-cols-5 gap-3 mb-6">
                                    <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center gap-1">
                                        <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center text-xl shadow-md transition-transform hover:scale-110"><FaWhatsapp /></div>
                                    </button>
                                    <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center gap-1">
                                        <div className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center text-xl shadow-md transition-transform hover:scale-110"><FaFacebook /></div>
                                    </button>
                                    <button onClick={() => handleSocialShare('twitter')} className="flex flex-col items-center gap-1">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xl shadow-md transition-transform hover:scale-110"><FaTwitter /></div>
                                    </button>
                                    <button onClick={() => handleSocialShare('tiktok')} className="flex flex-col items-center gap-1">
                                        <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center text-lg shadow-md transition-transform hover:scale-110"><SiTiktok /></div>
                                    </button>
                                    <button onClick={handleCopyLink} className="flex flex-col items-center gap-1">
                                        <div className={`w-10 h-10 rounded-xl ${copied ? 'bg-green-500' : 'bg-slate-200'} text-slate-800 flex items-center justify-center text-xl shadow-sm transition-all`}><HiOutlineLink className={copied ? 'text-white' : ''} /></div>
                                    </button>
                                </div>
                                
                                <div className="h-14">
                                    <ButtonGhost 
                                        action="Cancel Order" 
                                        onClick={cancelOrder} 
                                        loading={isLoading} 
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2 text-center flex items-center justify-center gap-1">
                                    <HiOutlineInformationCircle /> Cancellations only available before shipping.
                                </p>
                            </div>
                        ) : status === 'delivered' || status === 'completed' ? (
                            <div className="mt-auto space-y-4">
                                <div className="border-t border-slate-100 pt-4">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Rate your experience</label>
                                    <RatingsCard rating={rating} setRatings={setRating} />
                                </div>
                                <textarea 
                                    className="w-full h-24 bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                    placeholder="Tell us about the product..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <ButtonFull 
                                    action={status === 'delivered' ? "Mark as Received & Rate" : 'Rate Product'} 
                                    onClick={completeOrder} 
                                    loading={isLoading} 
                                />
                            </div>
                        ) : status === 'shipped' ? (
                            <div className="mt-auto text-center py-4 bg-orange-50 rounded-2xl">
                                <p className="text-orange-700 font-bold text-sm">Order Shipped! 🎉</p>
                            </div>
                        ) : (
                            <div className="mt-auto text-center py-4 bg-green-50 rounded-2xl flex flex-row justify-center items-center gap-2">
                                <p className="text-yellow-500 font-bold text-sm !mb-0">Order Pending!</p>
                                <Clock size={28} className="text-yellow-500" />
                            </div>
                        )
                    }
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ShowOrderTrainModal;