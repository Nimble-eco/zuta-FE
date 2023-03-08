import { useState } from "react"
import { GrShareOption } from "react-icons/gr"
import Header from "../Components/Header"
import VendorOrderModal from "../Components/VendorOrderModal"


const vendorOrders = ({orders}:any) => {
    const [chosenOrder, setchosenOrder] = useState<any>({})
    const [modal, setmodal] = useState<boolean>(false);
    const showOrderModal = (order: any) => {
        setmodal(true);
        setchosenOrder(order);
    }
    const closeModal = () => setmodal(false);
  return (
    <div className="min-h-screen bg-gray-200">
        <Header />

        <div
            className="flex flex-col bg-white w-[80%] mx-auto my-10 min-h-[350px] rounded-md py-5"
        >
            <h2
                className="text-2xl text-orange-500 text-center"
            >
                Orders
            </h2>

            {
                orders?.map((order: any) => ( 
                    <div
                        className="flex flex-row justify-between py-2 px-4 rounded-md shadow-md mt-5 w-[80%] mx-auto"
                    >
                        <div
                            onClick={showOrderModal}
                            className="flex flex-col cursor-pointer"
                        >
                            <span
                                className="text-gray-700 text-lg hover:border-b-2 border-gray-600"
                            >
                                {order.name}
                            </span>
                            <span
                                className="text-gray-500 text-base"
                            >
                                {order.order_count}
                            </span>
                        </div>
                        <div
                            className="flex flex-row pt-2 text-center"
                        >
                            <span
                                className="text-gray-700 text-base"
                            >
                                {order.price}
                            </span>
                            <span className="mx-1">
                                &#124;
                            </span>
                            <span
                                className="text-gray-500 text-base"
                            >
                                {order.discount} %
                            </span>
                        </div>
                        <GrShareOption 
                            className="text-2xl text-gray-600 cursor-pointer text-center"
                        />
                    </div>
                ))
            } 
        </div>
        {
            modal && (
                <VendorOrderModal
                    order={chosenOrder}
                    closeModal={closeModal}
                />
            )
        }
    </div>
  )
}

export default vendorOrders