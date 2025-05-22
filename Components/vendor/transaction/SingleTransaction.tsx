import { toast } from 'react-toastify'
import { HiOutlineChatAlt2 } from "react-icons/hi";
import RatingsCard from "../../cards/RatingsCard";
import { formatAmount } from "../../../Utils/formatAmount";
import { getDateAndTimeFromISODate } from "../../../Utils/convertIsoDateToDateString";
import { capitalizeFirstLetter } from "../../../Utils/capitalizeFirstLettersOfString";
import ButtonGhost from "../../buttons/ButtonGhost";
import ButtonFull from "../../buttons/ButtonFull";
import { useState } from "react";
import { closeOrderByVendorAction, markOrderAsReadyByVendorAction } from "../../../requests/order/order.request";
import { useRouter } from 'next/router';

interface ISingleTransactionProps {
  transaction: {
    price: number;
    total_price: number;
    product_id: string;
    product_name: string;
    product_discount: number;
    id: string;
    quantity: number;
    product_price_paid: number;
    order_sub_amount: number;
    order_service_fee: number;
    created_at: string;
    createdAt?: string;
    vendor_name: string;
    vendor_id: string;
    vendor_address_id: string;
    status: string;
    paid: boolean;
    payment_confirmed: boolean;
    order_payment_method: string;
    recipient_state: string;
    recipient_city: string;
    shipped_date?: string;
    product: any
  },
  reviews: {
    user: any, 
    comment: string, 
    score: number
  }[];
}

const SingleTransaction = ({transaction, reviews}: ISingleTransactionProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const closeOrderByVendor = async () => {
    setIsLoading(true)

    await closeOrderByVendorAction(transaction.id, transaction.vendor_id)
    .then((response) => {
      if(response.status === 202) {
        toast.success('Order status updated');
        router.push(`/vendor/transactions/orders/show?id=${transaction.id}`);
      }
    })
    .catch(error => {
      console.log({error});
      toast.error(error?.response?.data?.message || 'Error try again later');
    })
    .finally(() => setIsLoading(false));
  }

  const readyOrderByVendor = async () => {
    setIsLoading(true)

    await markOrderAsReadyByVendorAction(transaction.id, transaction.vendor_id)
    .then((response) => {
      if(response.status === 202) {
        toast.success('Order status updated');
        router.push(`/vendor/transactions/orders/show?id=${transaction.id}`);
      }
    })
    .catch(error => {
      console.log({error});
      toast.error(error?.response?.data?.message || 'Error try again later');
    })
    .finally(() => setIsLoading(false));
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%] rounded-md px-4 text-sm">
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 mt-20 lg:mt-0">
        <div className="flex flex-col px-4 bg-white rounded-md w-full mb-4 lg:mb-0 mx-auto pb-6">
          <div className="flex flex-row justify-between py-2 border-b border-gray-100 mb-4">
            <h4 className="font-semibold text-base text-left my-auto">Order Details</h4>
            <div className="flex flex-row gap-2">
              {
                transaction.status === 'unshipped' &&
                <div className="h-10">
                  <ButtonGhost
                    action="Cancel Order"
                    loading={isLoading}
                    onClick={closeOrderByVendor}
                  />
                </div>
              }

              {
                transaction.status === 'unshipped' &&
                <div className="h-10">
                  <ButtonFull
                    action="Ready for delivery"
                    loading={isLoading}
                    onClick={readyOrderByVendor}
                  />
                </div>
              }
            </div>
          </div>
          <div className="flex flex-row w-full pb-3">
            <div className="w-[50%] flex flex-col">
              <h5 className="!text-base text-gray-400">Order date</h5>
              <span className="font-semibold text-base">{getDateAndTimeFromISODate(transaction.created_at ?? transaction.createdAt)}</span>
            </div>
            <div className="w-[50%] flex flex-col">
              <h5 className="!text-base text-gray-400">Order ID</h5>
              <span className="font-semibold text-base">{transaction.id}</span>
            </div>
          </div>
          <div className="flex flex-row w-full pb-3">
            <div className="w-[50%] flex flex-col">
              <h5 className="!text-base text-gray-400">Order amount</h5>
              <span className="font-semibold text-base">{formatAmount(transaction.order_sub_amount)}</span>
            </div>
            <div className="w-[50%] flex flex-col">
              <h5 className="!text-base text-gray-400">Service Fee</h5>
              <span className="font-semibold text-base">{formatAmount(transaction.order_service_fee)}</span>
            </div>
          </div>
          <div className="flex flex-row w-full pb-3">
            <div className="w-[50%] flex flex-col">
              <h5 className="!text-base text-gray-400">Order Status</h5>
              <span className="font-semibold text-base">{transaction.status}</span>
            </div>
            <div className="w-[50%] flex flex-col">
              <h5 className="!text-base text-gray-400">Product Price</h5>
              <span className="font-semibold text-base">{formatAmount(transaction.product_price_paid)}</span>
            </div>
          </div>
          <div className="flex flex-row w-full pb-3">
            <div className="w-[50%] flex flex-col">
              <h5 className="!text-base text-gray-400">Payment Status</h5>
              <span className="font-semibold text-base">{transaction.paid ? 'Paid': 'False'}</span>
            </div>
            <div className="w-[50%] flex flex-col">
              <h5 className="!text-base text-gray-400">Payment Method</h5>
              <span className="font-semibold text-base">{transaction.order_payment_method}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-md flex flex-col px-3 py-4 mx-auto w-full mb-4 lg:mb-0">
          <h4 className="font-semibold text-base text-left pb-2 border-b border-gray-100 mb-4">Product Details</h4>
          <div className="flex flex-row w-full pb-3">
            <div className="w-[50%] flex flex-col">
              <h5 className="!text-base text-gray-400">Name</h5>
              <span className="font-semibold text-base">{capitalizeFirstLetter(transaction.product_name)}</span>
            </div>
            <div className="w-[50%] flex flex-col">
              <h5 className="!text-base text-gray-400">Quantity</h5>
              <span className="font-semibold text-base">{transaction.quantity}</span>
            </div>
          </div>
          <div className="flex flex-row w-full pb-3">
            <div className="w-[50%] flex flex-col">
              <h5 className="!text-base text-gray-400">Price</h5>
              <span className="font-semibold text-base">{formatAmount(transaction.product?.product_price)}</span>
            </div>
            <div className="w-[50%] flex flex-col">
              <h5 className="!text-base text-gray-400">Discount</h5>
              <span className="font-semibold text-base">{transaction.product?.product_discount}</span>
            </div>
          </div>
          <h4 className="font-semibold text-base text-left pb-2 border-b border-gray-100 mt-8 mb-4">Customer Details</h4>
          <div className="flex flex-col md:flex-row w-full pb-3">
            <div className="w-full mb-3 md:mb-0 md:w-[50%] flex flex-col">
              <h5 className="!text-base text-gray-400">Customer City</h5>
              <span className="font-semibold text-base">{transaction.recipient_city}</span>
            </div>
            <div className="w-full md:w-[50%] flex flex-col">
              <h5 className="!text-base text-gray-400">State</h5>
              <span className="font-semibold text-base max-w-full">{transaction.recipient_state}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-10 bg-white rounded-md px-4 py-3">
        <h2 className="text-gray-700 text-base text-center font-semibold">Reviews</h2>
        { reviews && reviews?.map((review) => (
          <div className="flex flex-col pb-3 border-b border-gray-300">
            <div className="flex flex-row">
              <h3 className="font-semibold mr-4 capitalize">{review.user?.name}</h3>
              <RatingsCard rating={review.score} />
            </div>
            {review.comment && <p className="text-gay-500 text-sm">{review.comment}</p>}
          </div>
        ))}

        {
          !reviews || reviews.length === 0 && (
            <div className="flex flex-col justify-center text-center items-center mt-10">
              <HiOutlineChatAlt2 className="text-3xl text-orange-500 text-center" />
              <p className="font-semibold mt-4 text-slate-700">No Reviews Yet</p>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default SingleTransaction