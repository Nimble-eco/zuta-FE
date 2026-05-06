import { Modal } from "react-bootstrap";
import { MdOutlineClose } from "react-icons/md";
import { HiOutlineChatAlt2, HiOutlineStar } from "react-icons/hi";
import { useState } from "react";
import ButtonFull from "../../buttons/ButtonFull";
import RatingsCard from "../../cards/RatingsCard";
import { storeProductRatingAction } from "../../../requests/productRating/productRating.request";
import { toast } from "react-toastify";

interface IRateProductModalProps {
    order?: any;
    orderTrain?: any;
    setShow: () => void;
}

const RateProductModal = ({ order, orderTrain, setShow }: IRateProductModalProps) => {
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [score, setScore] = useState<number | undefined>(undefined);

    // Dynamic data based on source
    const product = order?.product ?? orderTrain?.product;
    const productName = order?.product_name ?? product?.product_name;

    const submit = async () => {
        if (!score) {
            return toast.error("Please select a star rating");
        }

        setLoading(true);
        storeProductRatingAction({
            product_id: order?.product_id ?? orderTrain?.product_id,
            score: score,
            comment
        })
        .then(() => {
            toast.success('Thank you for your feedback!');
            setShow();
            // Using a softer approach than reload if possible, but keeping your logic
            setTimeout(() => window.location.reload(), 2000);
        })
        .catch((error: any) => {
            toast.error(error?.response?.data?.message || 'Error! Try again later');
        })
        .finally(() => setLoading(false));
    }

    return (
        <Modal 
            show={true} 
            onHide={setShow} 
            centered 
            backdrop="static" 
            dialogClassName='max-w-[450px] mx-auto px-4'
        >
            <Modal.Body className='p-0 overflow-hidden rounded-[2rem] bg-white shadow-xl relative'>
                {/* Close Button */}
                <button 
                    onClick={setShow}
                    className="absolute top-4 right-4 z-50 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <MdOutlineClose className='text-2xl' />
                </button>

                <div className="flex flex-col">
                    {/* Header Section with Product Preview */}
                    <div className="bg-slate-50 p-8 flex flex-col items-center text-center border-b border-slate-100">
                        <h3 className="text-xl font-black text-slate-800 leading-tight">
                            How was your {productName}?
                        </h3>
                        <p className="text-slate-500 text-xs mt-2 font-medium">
                            Your review helps others make better choices!
                        </p>
                    </div>

                    {/* Rating Section */}
                    <div className="p-8 flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-3">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 flex items-center gap-2">
                                <HiOutlineStar className="text-sm" /> Select Rating
                            </label>
                            <RatingsCard 
                                rating={score || 0} 
                                setRatings={setScore}
                                hight={10} 
                                width={10}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 flex items-center gap-2">
                                <HiOutlineChatAlt2 className="text-sm" /> Your Experience
                            </label>
                            <textarea
                                className="w-full h-32 rounded-2xl bg-slate-50 border border-slate-100 outline-none px-4 py-3 text-sm focus:ring-2 focus:ring-orange-100 transition-all"
                                placeholder="What did you like or dislike?"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>

                        <div className="pt-2">
                            <ButtonFull
                                action="Submit Review"
                                loading={loading}
                                onClick={submit}
                            />
                        </div>
                        
                        <p className="text-[10px] text-center text-slate-400 italic">
                            By submitting, you agree to our community guidelines.
                        </p>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default RateProductModal;