import axios from "axios";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import Header from "../Components/Header"
import { sendAxiosRequest } from "../Utils/sendAxiosRequest";

interface ICheckoutProps {
    user: any;
}

const checkout: FC<ICheckoutProps> = ({user}) => {
    let cart: any;
    let total : number = 0;
    let token: string;
    const router = useRouter();
    if(typeof window !== 'undefined'){
        token = localStorage.getItem('token')!;
        cart = JSON.parse(localStorage.getItem('cart')!);
        total = JSON.parse(localStorage.getItem('total')!);
    }

    // GET VENDOR AND CUSTOMER DETAILS IF ANY WITH USEEFFECT
    const getVendorAddress = async (vendorId: string) => {
        const res = await sendAxiosRequest(
            `/api/vendors/profile/${vendorId}`,
            "get",
            {},
            token,
            ''
        );
        return res.vendor.vendor_address?.geometry?.location;
    }
    
    const getAllVendorsAddressFromCart = async () => {
        const vendorIds = cart?.map((item: any) => item.productData.vendor_uid);
        return Promise.all(vendorIds.map(async (vendorId: string) => getVendorAddress(vendorId)));
    }

    const [deliveryFee, setDeliveryFee] = useState<number>(3000);
    const getDeliveryFee = async () => {
        const res = await axios({
            method: 'post',
            url: 'http://localhost:8080/api/delivery-cost',
            data: {
                pickUp: getAllVendorsAddressFromCart(),
                dropoff: userAddressDetails.geometry?.location,
            },
            headers: {
                'Content-Type': 'application/json',

            }
        });
        if(res.status === 200){
            setDeliveryFee(res.data.cost);
        }
    }

    // AUTOCOMPLETE USER ADDRESS WITH GOOGLE API
    const [predictedAddress, setPredictedAddress] = useState<string[]>([]);
    const getAddressPredictions =async (input :string) => {
        let res = await axios.get('api/api-places-autocomplete?input='+input);
        console.log('predictedAddress', res.data);
        setPredictedAddress(res.data.predictions);
    }

    // SET GET PREDICTED ADDRESS DETAILS
    const [userAddressDetails, setUserAddressDetails] = useState<any>({});
    const getAddressDetails = async (placeId :string) => {
        let res = await axios.get('api/api-places-details?placeId='+placeId);
        console.log('predictedAddressDetails', res.data);
        setUserAddressDetails(res.data.result);
    }

    const [isAddressSaved, setIsAddressSaved] = useState(false);
    const checkIfAddressIsSaved = async (address: string) => {
        let add = user?.address.find((item: any) => {
            if(item.formatted_address === address){
                return true;
            }
        });
        if(add){
            setIsAddressSaved(true);
        }
    }

    const customerDetails = {
        address: userAddressDetails.formatted_address,
    }

    const checkOut = async () => {
        const res = await sendAxiosRequest(
            "/api/order/checkout",
            "post",
            {
                cartDetails: cart,
                total_price: (total + deliveryFee),
                customerDetails: customerDetails
            },
            token,
            ''
        );
        
        if(res.status === 200 && typeof window !== 'undefined'){
            localStorage.removeItem('cart');
            localStorage.removeItem('total');
            console.log(res.redirect_url)
            router.push(res.redirect_url);
        }
    }

    useEffect(() => {
        getDeliveryFee();
    }, [userAddressDetails]);


  return (
    <div className="bg-gray-200 min-h-screen">
        <Header />
        <div 
            className="flex flex-col items-center bg-white rounded-md w-[70%] py-10 h-auto mx-auto my-5"
        >
            <div className="flex flex-col justify-between">
                <h1
                    className="text-2xl text-center text-gray-700 mt-10 mb-2 font-mono"
                >
                    Checkout
                </h1>
                <div className=" w-full border-b-4 border-orange-500" />
            </div>

            <div className="flex flex-col w-[60%] justify-between">
                {
                    cart?.map((item: any, i: any) => (
                        <div
                            className="flex flex-col py-3 border-b border-gray-200"
                            key={i}
                        >
                            <span
                                className="text-black text-base pl-4"
                            >
                                {item.product.name.toUpperCase()}
                            </span>
                            
                            <div
                                className="flex flex-row justify-between px-4 items-center" 
                            >
                                <p
                                    className="text-gray-800 m-0"
                                >
                                    N{item.product.price} x
                                </p>
                                <input
                                    type="number"
                                    className="w-[20%] py-1 px-2 text-center bg-gray-200 rounded-md"
                                    defaultValue={item.quantity }
                                />
                                <p
                                    className="text-gray-800 py-1 px-2"
                                >
                                    = N {item.product.price * (item.quantity )}
                                </p>
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className="flex flex-row items-center">
                <p
                    className="text-gray-800 m-0"
                >
                    Total
                </p>
                <p
                    className="text-gray-800 py-1 px-2"
                >
                    = N {total}
                </p>
            </div>

            <div 
                className="flex flex-col items-start w-[60%] mt-3"
            >
                <span
                    className="text-gray-700 justify-start pl-3 pb-2"
                >
                    Deliver to :
                </span>
                <div
                    className="flex flex-row justify-between py-3 bg-gray-200 rounded-md w-full"
                >
                    <input
                        className="w-full py-3 px-2 bg-transparent"
                        type="text"
                        placeholder="Enter destination"
                        value={userAddressDetails.formatted_address || ''}
                        onChange={(e: any) => {
                            getAddressPredictions(e.target.value)
                            .then(() => checkIfAddressIsSaved(e.target.value))
                        }}
                    />
                    {
                        !isAddressSaved && (
                            <button
                                className="w-14 px-2 py-1 mr-2 text-orange-500 hover:border-b border-orange-500"
                            >
                                Save
                            </button>
                        )
                    }
                </div>
                {
                    predictedAddress.length > 0 && predictedAddress.map((item: any, i: any) => (
                        <div
                            className="flex flex-row items-center justify-between border-b border-gray-200 py-3"
                            key={i}
                            onClick={() => getAddressDetails(item.place_id)}
                        >
                            <span
                                className="text-gray-800 m-0"
                            >
                                {item.description}
                            </span>
                            <button
                                className="bg-orange-500 text-white px-2 py-1 rounded-md"
                            >
                                Select
                            </button>
                        </div>
                    ))
                }
                {
                    user?.address.map((item: any, i: any) => (
                        <div
                            className="flex flex-col py-3"
                            key={i}
                            onClick={() => setUserAddressDetails(item)}
                        >
                            <span
                                className="text-black text-lg pl-4"
                            >
                                {item.name.toUpperCase()}
                            </span>
                            <span
                                className="text-gray-700 justify-start pl-3"
                            >
                                {item.formatted_address}
                            </span>
                        </div>
                    ))
                } 
            </div>

            <div 
                className="flex flex-row items-center justify-between w-[40%] text-xl font-semibold border-b border-gray-200 mt-3"
            >
                <span
                    className="text-gray-700 pl-3 pb-2"
                >
                    Delivery fee :
                </span>
                <p
                    className="text-gray-700  pl-3"
                >
                    {deliveryFee}
                </p>
            </div>

            <div
                className="flex flex-row items-center justify-between w-[40%] text-xl font-semibold border-b border-gray-200 mt-10 text-white"
            >
                <button
                    onClick={() => checkOut()}
                    className="w-full py-3 px-2 text-center bg-orange-500 rounded-md hover:bg-orange-800"
                >
                    Pay {(total + deliveryFee)}
                </button>
            </div>
        </div>
    </div>
  )
}

export default checkout
