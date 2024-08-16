import axios from "axios";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import { injectStyle } from "react-toastify/dist/inject-style";
import Header from "../Components/Header"
import { sendAxiosRequest } from "../Utils/sendAxiosRequest";
import { parse } from "cookie";
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { cartCheckoutAction } from "../requests/cart/cart.requests";
import Cookies from "js-cookie";
import { formatAmount } from "../Utils/formatAmount";
import axiosInstance from "../Utils/axiosConfig";
import NewAddressModal from "../Components/modals/address/NewAddressModal";
import { RiCoupon2Line } from "react-icons/ri";

interface ICheckoutProps {
    user: any;
    addresses: any[];
}

const checkout: FC<ICheckoutProps> = ({user, addresses}) => {
    let cart: any;
    const router = useRouter();
    const [selectedAddress, setSelectedAddress] = useState<any>({});
    const [subTotal, setSubTotal] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showAddAddressModal, setShowAddAddressModal] = useState(false);
    const [couponCode, setCouponCode] = useState('');

    let userCookie: any = {};

    if(typeof window !== 'undefined'){
        injectStyle();
        cart = JSON.parse(localStorage.getItem('cart')!) ?? [];
        userCookie = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null; 
    }
    
    const getAllVendorsAddressFromCart = async () => {
        return cart?.products?.map((item: any) => item.vendor.vendor_address);
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

    // SET GET PREDICTED ADDRESS DETAILS
    const [userAddressDetails, setUserAddressDetails] = useState<any>({});

    const checkOut = async () => {
        if(addresses?.length !== 0 && !selectedAddress?.id) {
            toast.error('Select an address');
            return;
        }
        else if(addresses?.length === 0) {
            setShowAddAddressModal(true);
            return;
        }
        setIsLoading(true);

        return cartCheckoutAction({
            user_id: userCookie?.id,
            address_id: selectedAddress.id
        }).then((res) => {
            setIsLoading(false)
            router.push(res.data.data.pay_stack_checkout_url)
        })
        .catch(error => {
            setIsLoading(false);
            console.log({error})
            toast.error(error?.response?.data?.message || 'Error! Try again later')
        })
    }

    // useEffect(() => {
    //     getDeliveryFee();
    // }, [userAddressDetails]);

    useEffect(() => {
        let isMounted = true;

        if(isMounted) {
            
            if(addresses.length > 1) {  
                let defaultAddress = addresses.find((address) => {
                    if(address.address_selected) return address;
                })
                if(defaultAddress) setSelectedAddress(defaultAddress);
                else setSelectedAddress(addresses[0]);
            }
            else setSelectedAddress(addresses[0])
        }

        return () => {isMounted = false}
    }, [])

    useEffect(() => {
        const products_total: number = cart.products?.reduce((acc: number, item: any) => acc + item.product_price * item.quantity, 0);
        const open_order_total: number = cart.subscriptions?.reduce((acc: number, item: any) => acc + item.open_order_price * item.quantity, 0);
        const bundles_total: number = cart.bundles?.reduce((acc: number, item: any) => acc + item.product_price * item.order_count, 0);
        setSubTotal(products_total + open_order_total + bundles_total);
    }, []);

    useEffect(() => {
        axiosInstance.post('/api/cart/update', {
            ...cart,
            user_id: userCookie?.id,
            open_order_products: cart.subscriptions
        }, {
            headers: {
                Authorization: userCookie?.access_token
            }
        })
        // .then((response) => console.log({response}))
        .catch(error => {
            toast.error(error.response?.message || "Error try again later")
        })
    }, []);

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col relative">
        <ToastContainer />
        <Header />

        {
            showAddAddressModal && <NewAddressModal
                setShow={() => setShowAddAddressModal(false)}
                redirect={() => router.push('/checkout')}
            />
        }
        <div className="flex flex-col bg-white py-4 px-3 h-fit w-[90%] fixed bottom-0 left-[5%] right-[5%] shadow-md z-50 mb-4 lg:hidden">
            <button
                className="bg-orange-500 px-4 py-3 text-white rounded cursor-pointer text-lg"
                onClick={checkOut}
            >
                {isLoading ? 'Loading...' : `Pay ${formatAmount((subTotal + deliveryFee))}`}
            </button>
        </div>

        <div 
            className="w-full flex flex-col lg:flex-row mx-auto mt-12"
        >
            <div className="hidden lg:flex flex-col w-[90%] mx-auto lg:w-[67%] lg:mr-[2%] mb-4 bg-white rounded-md px-4 py-4">
                <div className="flex flex-col">
                    <h1
                        className="text-xl text-orange-500 mb-4"
                    >
                        Checkout
                    </h1>
                </div>

                <div className="flex flex-col w-[60%] justify-between">
                    <p className="text-gray-700 text-lg font-medium opacity-40">Products</p>
                    {
                        cart?.products?.map((item: any, i: any) => (
                            <div
                                className="flex flex-col py-3 border-b border-gray-200"
                                key={i}
                            >
                                <span
                                    className="text-black text-base mb-2"
                                >
                                    {item.product_name.toUpperCase()}
                                </span>
                                
                                <div
                                    className="flex flex-row gap-4" 
                                >
                                    <p
                                        className="text-gray-800 m-0"
                                    >
                                        {formatAmount(item.product_price)} x
                                    </p>
                                    <input
                                        type="number"
                                        className="w-[20%] py-1 px-2 text-center bg-gray-200 rounded-md"
                                        disabled={true}
                                        defaultValue={item.quantity}
                                    />
                                    <p
                                        className="text-gray-800 py-1 px-2"
                                    >
                                        = {formatAmount(item.product_price * (item.quantity))}
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div className="flex flex-col w-[60%] justify-between mt-4">
                    <p className="text-gray-700 text-lg font-medium opacity-40">Order Train</p>
                    {
                        cart?.subscriptions?.map((item: any, i: any) => (
                            <div
                                className="flex flex-col py-3 border-b border-gray-200"
                                key={i}
                            >
                                <span
                                    className="text-black text-base mb-2"
                                >
                                    {item.product.product_name.toUpperCase()}
                                </span>
                                
                                <div
                                    className="flex flex-row gap-4" 
                                >
                                    <p
                                        className="text-gray-800 m-0"
                                    >
                                        {formatAmount(item.open_order_price)} x
                                    </p>
                                    <input
                                        type="number"
                                        className="w-[20%] py-1 px-2 text-center bg-gray-200 rounded-md"
                                        defaultValue={item.quantity }
                                        disabled={true}
                                    />
                                    <p
                                        className="text-gray-800 py-1 px-2"
                                    >
                                        = {formatAmount(item.open_order_price * (item.quantity ))}
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="flex flex-col w-[90%] mx-auto lg:w-[30%]">
                <div className="flex flex-col gap-2 bg-white py-4 px-3 h-fit mb-4 rounded-md">
                    <h3 className="lg:text-center text-lg mb-0">Proceed to payment</h3>
                    <p className="lg:text-center mb-0">Deliver fee: {formatAmount(deliveryFee)}</p>
                    <p className="hidden lg:flex lg:text-center text-lg font-semibold text-orange-500 mb-0">
                        Total: {formatAmount((subTotal + deliveryFee)) ? formatAmount((subTotal + deliveryFee)) : 0}
                    </p>
                    <div className='flex flex-row gap-2 items-center'>
                        <div className="flex flex-row gap-2 items-center py-2 px-4 border-gray-200 border rounded-md w-full">
                            <RiCoupon2Line className="text-lg text-gray-500" />
                            <input className="bg-transparent border-0 outline-none" placeholder="Enter coupon code here" onChange={(e)=>setCouponCode(e.target.value)}/>
                        </div>
                        <button className={`border-0 font-semibold w-fit ${couponCode ? 'text-orange-600' : 'text-gray-400'}`}>
                            Apply
                        </button>
                    </div>
                    <button 
                        onClick={() => checkOut()}
                        className="hidden lg:flex text-center font-medium text-[#0ba4db] cursor-pointer border-2 border-[#0ba4db] rounded-md py-2 mt-4"
                    >
                        {isLoading ? 'Loading...' : `Pay with PayStack`}
                    </button>
                </div>

                <div className="flex flex-col bg-white pl-2 rounded-md gap-3 py-3">
                    <h4 className="font-semibold my-2 text-sm">Delivery Address</h4>
                    {
                        addresses && addresses.length > 0 ? addresses?.map((address) => (
                            <div className="flex flex-col gap-1" key={address.id}>
                                <div className="flex flex-row gap-1">
                                    {
                                        selectedAddress?.id === address?.id ?
                                        <MdOutlineRadioButtonChecked 
                                            className="text-base mt-1 cursor-pointer" 
                                        /> : 
                                        <MdOutlineRadioButtonUnchecked
                                            className="text-base mt-1 cursor-pointer"
                                            onClick={() => setSelectedAddress(address)}
                                        />
                                    }
                                    <p className="font-medium">
                                        {address.title}
                                        {address.name && <span className="opacity-30 text-sm">/{address.name}</span>}
                                    </p>
                                </div>
                                <p className="text-sm">{address.address}</p>
                            </div>
                        )) :
                        <p 
                            className="text-orange-400 cursor-pointer"
                            onClick={() => setShowAddAddressModal(!showAddAddressModal)}
                        >
                            Add an Address
                        </p>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default checkout

export async function getServerSideProps(context: any) {
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;

    try{
        const getMyAddresses = await sendAxiosRequest(
          `/api/address/me`,
          "get",
          {},
          token,
          ''
        );

        return {
            props: {
                addresses: getMyAddresses.data
            }
        }
    } catch(error: any) {
        console.log({error})
        if(error?.response?.status === 401 || error?.response?.status == 403) {
            return {
                redirect: {
                  destination: '/auth/signIn',
                  permanent: false
                }
            }
        }
        return {
            props: {
                addresses: [],
            }
        }
    }

}