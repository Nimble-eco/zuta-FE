import { Modal } from "react-bootstrap";
import { MdOutlineClose } from "react-icons/md";
import TextCard from "../../texts/TextCard";
import ButtonFull from "../../buttons/ButtonFull";
import { useState } from "react";
import { updateOrderTrainStatusAction } from "../../../requests/orderTrain/orderTrain.request";
import { statusType } from "../../../requests/orderTrain/orderTrain.types";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface IShowOrderTrainModalProps {
    data: any;
    setShow: () => void;
}

const OrderTrainSubscriberDataModal = ({data, setShow}: IShowOrderTrainModalProps) => {
    const router = useRouter();
    const [status, setStatus] = useState(data?.status);
    const [loading, setLoading] = useState(false);

    const updateOrderStatus = async () => {
        setLoading(true);
        updateOrderTrainStatusAction({
            id: data.open_order_id,
            user_id: data.user_id,
            status: status as statusType
        })
        .then((response) => {
            if(response.status === 200) {
                toast.success('Order status updated');
                setShow();
                setTimeout(() => router.push(`/admin/orders/order-train/${data.open_order_id}`), 1200);
            }  
        })
        .catch((error) => {
            console.log({error})
            toast.error(error.response?.message ?? 'Error try again later');
        })
        .finally(()=>setLoading(false));
    }

  return (
    <Modal show={true} onHide={setShow} backdrop="static" dialogClassName='modal-lg'>
        <Modal.Body className='relative'>
            <MdOutlineClose className='text-3xl cursor-pointer absolute top-2 right-2 bg-gray-200 rounded-full p-2' onClick={setShow} />
            <div className='flex flex-col gap-6 min-h-[50vh]'>
                <div className="flex flex-row justify-between items-center border-b border-gray-200 py-4 px-4 mt-6">
                    <h2 className="text-lg font-semibold capitalize">ID: {data.id}</h2>
                    <div className="flex flex-row gap-4 items-center border border-gray-100 rounded-2xl px-4 py-2">
                        <p className="text-slate-700 font-medium !mb-0">Status:</p>
                        <select 
                            className=""
                            value={status}
                            onChange={(e)=>setStatus(e.target?.value)}
                        >
                            <option value={'queued'}>Queued</option>
                            <option value={'shipped'}>Shipped</option>
                            <option value={'unshipped'}>Unshipped</option>
                            <option value={'delivered'}>Delivered</option>
                            <option value={'completed'}>Completed</option>
                            <option value={'closed'}>Closed</option>
                            <option value={'cancelled'}>Cancelled</option>
                        </select>
                        <ButtonFull
                            action="Update"
                            loading={loading}
                            onClick={updateOrderStatus}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2 bg-gray-100 px-4 py-6 rounded-md">
                    <h2 className="font-semibold uppercase text-2xl">Order Details</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <TextCard label="name" value={data?.customer_name} />
                        <TextCard label="quantity" value={data?.quantity} />
                        <TextCard label="Price paid" value={data?.open_order_price_paid} />
                        <TextCard label="delivery fee" value={data?.order_delivery_fee} />
                        <TextCard label="insurance fee" value={data?.order_insurance_fee} />
                        <TextCard label="service fee" value={data?.order_service_fee} />
                        <TextCard label="total" value={data?.order_amount} />
                        <TextCard label="status" value={data?.status} />
                        <TextCard label="order_coupons" value={data?.order_coupons} />
                        <TextCard label="order_paid" value={data?.order_paid} />
                        <TextCard label="order_payment_confirmed" value={data?.order_payment_confirmed} />
                        <TextCard label="order_payment_method" value={data?.order_payment_method} />
                        <TextCard label="created at" value={data?.created_at} />
                    </div>
                </div>

                <div className="flex flex-col gap-2 bg-gray-100 px-4 py-6 rounded-md">
                    <div className="flex flex-col">
                        <h2 className="font-semibold uppercase text-2xl">Delivery Details</h2>
                        <p className="text-xs text-gray-600">{data?.recipient_address_description}</p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <TextCard label="name" value={data?.customer_name} />
                        <TextCard label="phone" value={data?.recipient_phone} />
                        <TextCard label="email" value={data?.recipient_email} />
                        <TextCard label="address" value={data?.recipient_address} />
                        <TextCard label="city" value={data?.recipient_city} />
                        <TextCard label="state" value={data?.recipient_state} />
                        <TextCard label="country" value={data?.recipient_country} />
                        <TextCard label="zip" value={data?.recipient_zip} />
                        <TextCard label="latitude" value={data?.recipient_location_latitude} />
                        <TextCard label="longitude" value={data?.recipient_location_longitude} />
                    </div>
                </div>
            </div>
        </Modal.Body>
    </Modal>
  )
}

export default OrderTrainSubscriberDataModal