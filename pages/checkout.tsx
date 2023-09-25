import axios from "axios";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import Header from "../Components/Header"
import { sendAxiosRequest } from "../Utils/sendAxiosRequest";
import { parse } from "cookie";
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { cartCheckoutAction } from "../requests/cart/cart.requests";
import Cookies from "js-cookie";

interface ICheckoutProps {
    user: any;
    addresses: any[];
}

const checkout: FC<ICheckoutProps> = ({user, addresses}) => {
    let cart: any;
    const router = useRouter();
    const [selectedAddress, setSelectedAddress] = useState<any>({});
    const [subTotal, setSubTotal] = useState<number>(0);

    let userCookie: any = {};

    if(typeof window !== 'undefined'){
        cart = JSON.parse(localStorage.getItem('cart')!);
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
        const res = await cartCheckoutAction({
            user_id: userCookie.id,
            address_id: selectedAddress.id
        })
        console.log({res})
        
        if(res.status === 200 && typeof window !== 'undefined'){
            localStorage.removeItem('cart');
            localStorage.removeItem('total');
        }
    }

    // useEffect(() => {
    //     getDeliveryFee();
    // }, [userAddressDetails]);

    useEffect(() => {
        let isMounted = true;

        if(isMounted) {
            addresses.length > 1 ? 
                addresses.find((address) => {
                    if(address.address_selected) setSelectedAddress(address);
                }) :
            setSelectedAddress(addresses[0])
        }

        return () => {isMounted = false}
    }, [])

    useEffect(() => {
        const products_total: number = cart.products?.reduce((acc: number, item: any) => acc + item.product_price * item.order_count, 0);
        const open_order_total: number = cart.subscriptions?.reduce((acc: number, item: any) => acc + item.open_order_price * item.order_count, 0);
        const bundles_total: number = cart.bundles?.reduce((acc: number, item: any) => acc + item.product_price * item.order_count, 0);
        setSubTotal(products_total + open_order_total + bundles_total);
    }, [])

    console.log({cart, addresses, selectedAddress})


  return (
    <div className="bg-gray-200 min-h-screen flex flex-col relative">
        <Header />
        <div className="flex flex-col bg-white py-4 px-3 h-fit w-[90%] fixed bottom-0 left-[5%] right-[5%] shadow-md z-50 mb-4 lg:hidden">
            <button
                className="bg-orange-500 px-4 py-3 text-white rounded cursor-pointer"
                onClick={() => {}}
            >
                Pay N{(subTotal + deliveryFee)}
            </button>
        </div>

        <div 
            className="w-[95%] flex flex-col lg:flex-row mx-auto mt-12"
        >
            <div className="flex flex-col w-[90%] mx-auto lg:w-[70%] lg:mr-[2%] mb-4 bg-white rounded-md px-4 py-4">
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
                                        N{item.product_price} x
                                    </p>
                                    <input
                                        type="number"
                                        className="w-[20%] py-1 px-2 text-center bg-gray-200 rounded-md"
                                        defaultValue={item.quantity }
                                    />
                                    <p
                                        className="text-gray-800 py-1 px-2"
                                    >
                                        = N {item.product_price * (item.quantity )}
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
                                        N{item.open_order_price} x
                                    </p>
                                    <input
                                        type="number"
                                        className="w-[20%] py-1 px-2 text-center bg-gray-200 rounded-md"
                                        defaultValue={item.order_count }
                                    />
                                    <p
                                        className="text-gray-800 py-1 px-2"
                                    >
                                        = N {item.open_order_price * (item.order_count )}
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="flex flex-col w-[90%] mx-auto lg:w-[25%]">
                <div className="hidden lg:flex flex-col bg-white py-4 px-3 h-fit mb-4 rounded-md">
                    <h3 className="mb-2 text-center">Proceed to payment</h3>
                    <p className="mb-2">Deliver fee: {deliveryFee}</p>
                    <button
                        className="bg-orange-500 px-4 py-3 text-white rounded cursor-pointer"
                        onClick={() => {}}
                    >
                        Pay N{(subTotal + deliveryFee)}
                    </button>
                </div>

                <div className="flex flex-col bg-white pl-2 rounded-md gap-3 py-3">
                    <h4 className="font-semibold my-3">Delivery Address</h4>
                    {
                        addresses && addresses.length > 0 ? addresses?.map((address) => (
                            <div className="flex flex-col gap-1" key={address.id}>
                                <div className="flex flex-row gap-1">
                                    {
                                        selectedAddress.id === address.id ?
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
        if(error?.response?.status === 401) {
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