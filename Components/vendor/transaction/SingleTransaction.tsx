import { HiChat, HiChatAlt, HiOutlineChatAlt2 } from "react-icons/hi";
import RatingsCard from "../../cards/RatingsCard";
import { formatAmount } from "../../../Utils/formatAmount";
import { getDateAndTimeFromISODate } from "../../../Utils/convertIsoDateToDateString";

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
    vendor_name: string;
    vendor_id: string;
    vendor_address_id: string;
    status: string;
    paid: boolean;
    payment_confirmed: boolean;
    payment_method: string;
    recipient_state: string;
    recipient_city: string;
    shipped_date?: string;
  },
  reviews: {
    user: any, 
    comment: string, 
    score: number
  }[];
}

const SingleTransaction = ({transaction, reviews}: ISingleTransactionProps) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col w-full md:w-[80%] absolute right-0 md:left-[21%] rounded-md px-4 text-sm">
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4">
        <div className="flex flex-col py-3 px-4 bg-white w-full mb-4 lg:mb-0 mx-auto pb-6">
          <h4 className="font-semibold text-base text-left pb-2 border-b border-gray-100 mb-4">Order Details</h4>
          <div className="flex flex-row w-full pb-3">
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400">Order date</h5>
              <span className="font-semibold text-base">{getDateAndTimeFromISODate(transaction.created_at)}</span>
            </div>
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400">Order ID</h5>
              <span className="font-semibold text-base">{transaction.id}</span>
            </div>
          </div>
          <div className="flex flex-row w-full pb-3">
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400">Order amount</h5>
              <span className="font-semibold text-base">{transaction.order_sub_amount}</span>
            </div>
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400">Service Fee</h5>
              <span className="font-semibold text-base">{transaction.order_service_fee}</span>
            </div>
          </div>
          <div className="flex flex-row w-full pb-3">
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400">Order Status</h5>
              <span className="font-semibold text-base">{transaction.status}</span>
            </div>
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400">Product Price</h5>
              <span className="font-semibold text-base">{transaction.product_price_paid}</span>
            </div>
          </div>
          <div className="flex flex-row w-full pb-3">
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400">Payment Status</h5>
              <span className="font-semibold text-base">{transaction.paid ? 'Paid': 'False'}</span>
            </div>
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400">Payment Method</h5>
              <span className="font-semibold text-base">{transaction.payment_method}</span>
            </div>
          </div>
        </div>
        <div className="bg-white flex flex-col px-3 py-4 mx-auto w-full mb-4 lg:mb-0">
          <h4 className="font-semibold text-base text-left pb-2 border-b border-gray-100 mb-4">Product Details</h4>
          <div className="flex flex-row w-full pb-3">
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400">Name</h5>
              <span className="font-semibold text-base">{transaction.product_name}</span>
            </div>
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400">Quantity</h5>
              <span className="font-semibold text-base">{transaction.quantity}</span>
            </div>
          </div>
          <div className="flex flex-row w-full pb-3">
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400">Price</h5>
              <span className="font-semibold text-base">{formatAmount(transaction.price)}</span>
            </div>
            <div className="w-[50%] flex flex-col">
              <h5 className="text-gray-400">Discount</h5>
              <span className="font-semibold text-base">{transaction.product_discount}</span>
            </div>
          </div>
          <h4 className="font-semibold text-base text-left pb-2 border-b border-gray-100 mt-8 mb-4">Customer Details</h4>
          <div className="flex flex-col md:flex-row w-full pb-3">
            <div className="w-full mb-3 md:mb-0 md:w-[50%] flex flex-col">
              <h5 className="text-gray-400">Customer City</h5>
              <span className="font-semibold text-base">{transaction.recipient_city}</span>
            </div>
            <div className="w-full md:w-[50%] flex flex-col">
              <h5 className="text-gray-400">State</h5>
              <span className="font-semibold text-base max-w-full">{transaction.recipient_state}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-10 bg-white px-4 py-3">
        <h2 className="text-gray-700 text-base text-center my-4 font-semibold">Reviews</h2>
        { reviews && reviews.map((review) => (
          <div className="flex flex-col pb-3 border-b border-gray-100 mb-3">
            <div className="flex flex-row">
              <h3 className="font-semibold mr-4">{review.user?.name}</h3>
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