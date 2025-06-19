import { toast } from 'react-toastify'
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { useState } from "react";
import { useRouter } from 'next/router';
import RatingsCard from '../../../cards/RatingsCard';
import { capitalizeFirstLetter } from '../../../../Utils/capitalizeFirstLettersOfString';
import { formatAmount } from '../../../../Utils/formatAmount';
import { getDateAndTimeFromISODate } from '../../../../Utils/convertIsoDateToDateString';
import ButtonFull from '../../../buttons/ButtonFull';
import ButtonGhost from '../../../buttons/ButtonGhost';
import { closeOpenOrderByVendorAction, markOpenOrderAsReadyByVendorAction } from '../../../../requests/orderTrain/orderTrain.request';
import VendorNavBar from '../../layout/VendorNavBar';

interface ISingleTransactionProps {
  transaction: {
    price: number;
    total_price: number;
    product_id: string;
    product_name: string;
    product_discount: number;
    id: string;
    quantity: number;
    orderCount: number;
    open_order_price: number;
    next_price: number;
    created_at: string;
    createdAt?: string;
    vendor_name: string;
    vendor_id: string;
    vendor_address_id: string;
    status: string;
    paid: boolean;
    payment_confirmed: boolean;
    subscribersCount: string;
    recipient_state: string;
    recipient_city: string;
    shipped_date?: string;
    product: any;
    subscribersList: any[];
  },
  reviews: {
    user: any, 
    comment: string, 
    score: number
  }[];
}

const SingleOpenOrderTransaction = ({transaction, reviews}: ISingleTransactionProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const closeOrderByVendor = async () => {
    setIsLoading(true)

    await closeOpenOrderByVendorAction(transaction.id, transaction.vendor_id)
    .then((response) => {
      if(response.status === 202) {
        toast.success('Order status updated');
        router.push(`/vendor/transactions/order-train/show?id=${transaction.id}`);
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

    await markOpenOrderAsReadyByVendorAction(transaction.id, transaction.vendor_id)
    .then((response) => {
      if(response.status === 202) {
        toast.success('Order status updated');
        router.push(`/vendor/transactions/order-train/show?id=${transaction.id}`);
      }
    })
    .catch(error => {
      console.log({error});
      toast.error(error?.response?.data?.message || 'Error try again later');
    })
    .finally(() => setIsLoading(false));
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%] rounded-md !px-2 lg:!px-4 text-sm">
      <VendorNavBar />
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 !text-base">
        <div className="flex flex-col px-4 bg-white rounded-md w-full mb-4 lg:mb-0 mx-auto pb-6">
          <div className="flex flex-row justify-between py-2 border-b border-gray-100 mb-4 items-center">
            <h4 className="font-semibold !text-base text-left my-auto">Order Details</h4>
            <div className="flex flex-row gap-2">
              {
                transaction.status === 'open' &&
                <div className="h-10">
                  <ButtonGhost
                    action="Cancel Order"
                    loading={isLoading}
                    onClick={closeOrderByVendor}
                  />
                </div>
              }

              {
                transaction.status === 'open' &&
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
              <h5 className="text-gray-400">Order date</h5>
              <span className="font-semibold text-base">{getDateAndTimeFromISODate(transaction.created_at ?? transaction.createdAt)}</span>
            </div>
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400 !text-base">Order ID</h5>
              <span className="font-semibold text-base">{transaction.id}</span>
            </div>
          </div>
          <div className="flex flex-row w-full pb-3">
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400 !text-base">Product Order Price</h5>
              <span className="font-semibold text-base">{formatAmount(transaction.open_order_price)}</span>
            </div>
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400 !text-base">Next Price</h5>
              <span className="font-semibold text-base">{formatAmount(transaction.next_price)}</span>
            </div>
          </div>
          <div className="flex flex-row w-full pb-3">
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400 !text-base">Order Status</h5>
              <span className="font-semibold text-base">{transaction.status}</span>
            </div>
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400 !text-base">Order Count</h5>
              <span className="font-semibold text-base">{transaction.orderCount}</span>
            </div>
          </div>
          <div className="flex flex-row w-full pb-3">
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400 !text-base">Payment Status</h5>
              <span className="font-semibold text-base">{transaction.paid ? 'Paid': 'False'}</span>
            </div>
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400">Subscribers</h5>
              <span className="font-semibold text-base">{transaction.subscribersCount}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-md flex flex-col px-3 py-4 mx-auto w-full mb-4 lg:mb-0">
          <h4 className="font-semibold !text-base text-left pb-2 border-b border-gray-100 mb-4">Product Details</h4>
          <div className="flex flex-row w-full pb-3">
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400 !text-base">Name</h5>
              <span className="font-semibold text-base">{capitalizeFirstLetter(transaction.product_name)}</span>
            </div>
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray- !text-base">Quantity</h5>
              <span className="font-semibold text-base">{transaction.product?.quantity}</span>
            </div>
          </div>
          <div className="flex flex-row w-full pb-3">
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400 !text-base">Price</h5>
              <span className="font-semibold text-base">{formatAmount(transaction.product?.product_price)}</span>
            </div>
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400 !text-base">Discount</h5>
              <span className="font-semibold text-base">{transaction.product?.product_discount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-3 md:grid md:grid-cols-2'>

        <div className="flex flex-col mt-10 bg-white rounded-md px-4 py-3">
          <h2 className="text-gray-700 !text-base my-4 font-bold">Subscribers</h2>
          { transaction && transaction.subscribersList?.map((subscriber, index) => (
            <div className="flex flex-col pb-3 border-b border-gray-100 mb-3" key={index}>
              <div className="flex flex-row">
                <h3 className="mr-4 capitalize">{capitalizeFirstLetter(subscriber.name)}</h3>
                <p className="">
                  <span className='opacity-40 mr-1 font-semibold'>Qty: </span>
                  {subscriber.quantity}
                </p>
              </div>
              {subscriber.created_at && <p className="text-gay-500 text-opacity-20">{new Date(subscriber.created_at).toLocaleDateString()}</p>}
            </div>
          ))}
        </div>

        <div className="flex flex-col mt-10 bg-white rounded-md px-4 py-3">
          <h2 className="text-gray-700 !text-base my-4 font-semibold">Reviews</h2>
          { reviews && reviews?.map((review, index) => (
            <div className="flex flex-col pb-3 border-b border-gray-100 mb-3" key={index}>
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
    </div>
  )
}

export default SingleOpenOrderTransaction