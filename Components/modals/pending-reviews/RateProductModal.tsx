import { Modal } from "react-bootstrap";
import { MdOutlineClose } from "react-icons/md";
import TextAreaInput from "../../inputs/TextAreaInput";
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

const RateProductModal = ({order, orderTrain, setShow}: IRateProductModalProps) => {
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [score, setScore] = useState<number | undefined>(undefined);

    const submit = async () => {
        setLoading(true);

        storeProductRatingAction({
            product_id: order?.product_id ?? orderTrain?.product_id,
            score: score!,
            comment
        })
        .then(() => {
            toast.success('Review submitted');
            setShow();
            setTimeout(()=>window.location.reload(), 3000);
        })
        .catch((error: any) => {
            console.log({error});
            toast.error(error?.response?.data?.message || 'Error! Try again later');
        })
        .finally(()=>setLoading(false));
    }

  return (
    <div className="!rounded-md ">
        <Modal show={true} onHide={setShow} backdrop="static" dialogClassName='md:modal-90w'>
            <Modal.Body className='md:!min-w-[40vw] md:!w-[40vw] relative'>
                <MdOutlineClose className='text-3xl cursor-pointer absolute top-3 right-3' onClick={setShow} />
                <div className="flex flex-col gap-4 justify-center py-6 px-4">
                    <h3 className="text-lg font-semibold text-slate-700 text-center">Rate Product</h3>
                    <div className="flex flex-row gap-4 items-center">
                        <label htmlFor="score" className="font-semibold">Score:</label>
                        <RatingsCard 
                            rating={score!} 
                            setRatings={setScore}
                            hight={8}
                            width={8}
                        />
                    </div>

                    <TextAreaInput
                        label="Comment"
                        name="comment"
                        value={comment}
                        placeHolder="Enter your message here"
                        onInputChange={(e: any)=>setComment(e.target.value)}
                    />

                    <div className="h-10 w-[80%] mx-auto">
                        <ButtonFull
                            action="Submit"
                            loading={loading}
                            onClick={submit}
                        />
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default RateProductModal