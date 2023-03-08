import { FC, useState } from "react"
import { MdOutlineClose } from "react-icons/md"
import { numberFormat } from "../Utils/numberFormat";
import { sendAxiosRequest } from "../Utils/sendAxiosRequest"
import Loader from "./Loader";

interface IVendorOrderProps {
    order: any
    closeModal: () => void;
}

const VendorOrderModal: FC<IVendorOrderProps> = ({order, closeModal}) => {
    let token: string;
    if(typeof window !== undefined){
        token = localStorage.getItem("token")!;
    }
    const [loading, setloading] = useState<boolean>(false)
    const acceptOrder = async (e: any, orderId: string) => {
        e.preventDefault();
        setloading(true);
        const res = await sendAxiosRequest(
            `/api/vendor/orders/${orderId}`,
            'post',
            {},
            token,
            ''
            
        );
        setloading(false);
        if(res.staus === 200) closeModal();
    }

  return (
    <div
        className="flex flex-col bg-gray-100 pt-5 pb-10 rounded-md w-[80%] lg:w-[70%]  z-50 absolute top-24 left-[15%] "
    >
        <MdOutlineClose 
            onClick={closeModal}
            className="text-red-600 text-2xl relative top-1 w-full  mb-8 hover:text-red-800 cursor-pointer"
        />
        <h2
            className="text-2xl text-orange-500 font-mono text-center"
        >
            {order.name}
        </h2>
        
        <div
            className="flex flex-col py-2 px-4 "
        >
            <div
                className="flex flex-row justify-center mb-5"
            >
                <p 
                    className="text-xl text-gray-700"
                >
                    {order.order_count} x
                    <span
                        className="text-green-500 font-semibold"
                    >
                        {numberFormat(order.order_count * order.price)} 
                    </span> 
                </p>
            </div>

            {
                order?.customers_orders_details.map((data: any) => (
                    <div
                        className="flex flex-row border-b border-gray-500 justify-between w-[80%] mx-auto px-4"
                    >
                        <div
                            className="flex flex-col justify-start"
                        >
                            <span
                                className="text-lg "
                            >
                                {data.order_uid}
                            </span>
                            <span
                                className="text-gray-500 text-base"
                            >
                                {data.customer_address}
                            </span>
                        </div>
                        <div
                            className="flex flex-row"
                        >
                            <span
                                className="text-green-500"
                            >
                                {data.total_price}
                            </span>
                            <span className="mx-1">
                                &#124;
                            </span>
                            <span>
                                {data.quantity}
                            </span>
                        </div>
                        <span>
                            {data.date}
                        </span>
                    </div>
                ))
            } 
            <button
                className="bg-orange-500 w-[30%] mt-10 rounded-full py-1 px-5 mx-auto hover:bg-orange-700 text-white"
                onClick={(e) => acceptOrder(e, "12344323rdeet")}
            >
                Accept & Close order
            </button>
        </div>
        {
            loading && <Loader />
        }
    </div>
  )
}

export default VendorOrderModal