import axios from "axios";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { toast } from 'react-toastify';
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
import { couponValidateAction } from "../requests/coupons/coupons.requests";
import { Loader2 } from "lucide-react";
import { BiLoader } from "react-icons/bi";

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
    const [validatingCoupon, setValidatingCoupon] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0)

    let userCookie: any = {};

    if(typeof window !== 'undefined'){
        injectStyle();
        cart = JSON.parse(localStorage.getItem('cart')!) ?? [];
        userCookie = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null; 
    }

    const prepareOrders = () => {
        let orders: any[] = [];

        cart?.products?.map((item: any)=>{
            const order = {
                pickup_state: item?.vendor?.vendor_state,
                destination_state: selectedAddress?.state,

                item_category: item?.product_categories?.length ? item?.product_categories[0] : 'other',
                item_quantity: item?.quantity
            };

            orders?.push(order);
        });

        cart?.subscriptions?.map((item: any)=>{
            const order = {
                pickup_state: item?.vendor?.vendor_state,
                destination_state: selectedAddress?.state,

                item_category: item?.product?.product_categories?.length ? item?.product?.product_categories[0] : 'other',
                item_quantity: item?.quantity
            };

            orders?.push(order);
        });

        cart?.bundles?.map((item: any)=>{
            const order = {
                pickup_state: item?.vendor?.vendor_state,
                destination_state: selectedAddress?.state,

                item_category: item?.product?.product_categories?.length ? item?.product?.product_categories[0] : 'other',
                item_quantity: item?.quantity
            };

            orders?.push(order);
        });

        return orders;
    }

    const [deliveryFee, setDeliveryFee] = useState<number>(0);
    const [deliverySummary, setDeliverySummary] = useState<number>(3000);

    const getDeliveryFee = async () => {
        setIsLoading(true);

        const url = `${process.env.NEXT_PUBLIC_NIMBLE_API_BASEURL}/third-party/delivery/estimate-address`;
        const orderData = prepareOrders();

        const response = await axios({
            method: 'post',
            url,
            data: {orders: orderData},
            headers: {
                'Content-Type': 'application/json',
            }
        }).finally(()=>setIsLoading(false));

        if(response.status === 200){
            setDeliveryFee(response.data?.data?.total_sum);
            setDeliverySummary(response.data?.data?.estimates);
        }
    }

    const vailidateCoupon = async () => {
        setValidatingCoupon(true);
        couponValidateAction(couponCode)
        .then(response => {
            console.log({response})
            if(response.status === 200) {
                const coupon = response?.data?.data;
                setTotalAmount(totalAmount - coupon?.amount);
                toast.success('Coupon validated');
            }
        })
        .catch(error =>{
            console.log({error})
            toast.error('Invalid coupon');
        })
        .finally(()=>setValidatingCoupon(false))
    }

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
            localStorage.removeItem("cart");
            setIsLoading(false)
            router.push(res.data.data.pay_stack_checkout_url)
        })
        .catch(error => {
            setIsLoading(false);
            console.log({error})
            toast.error(error?.response?.data?.message || 'Error! Try again later')
        })
    }

    useEffect(() => {
        if(selectedAddress?.id) getDeliveryFee();
    }, [selectedAddress?.id]);

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
        setTotalAmount(deliveryFee + products_total + open_order_total + bundles_total);
    }, [deliveryFee]);

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
        .catch(error => {
            toast.error(error.response?.message || "Error try again later")
        })
    }, []);

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col relative">
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
                {isLoading ? 'Loading...' : `Pay ${formatAmount(totalAmount)}`}
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
                                    className="flex flex-row items-center gap-4" 
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
                                        className="text-gray-800 mb-0"
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
                                    className="flex flex-row items-center gap-4" 
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
                                        className="text-gray-800 mb-0"
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
                <div className="flex flex-col gap-4 bg-white py-4 px-3 h-fit mb-4 rounded-md">
                    <h3 className="lg:text-center text-lg mb-0">Proceed to payment</h3>
                    <div className="p-3 border border-blue-600 rounded-md relative flex flex-row justify-between items-center gap-4">
                        <p>Deliver fee:</p> 
                        <div className="flex flex-row gap-1 items-center">
                            {
                                isLoading && (
                                    <Loader2 className="h-4 w-4 text-orange-600 animate-spin" />
                                )
                            }
                            <p className="font-semibold text-blue-600 !mb-0">{formatAmount(deliveryFee)}</p>
                        </div>
                        <a
                            href="#0"
                            target="_blank"
                            className="absolute bottom-[2px] center-absolute-el text-xs"
                        >
                            Powered by <span className="text-blue-600 italic font-medium">Nimle logistics</span>
                        </a>
                    </div>
                   
                    <div className='flex flex-row gap-2 items-center'>
                        <div className="flex flex-row gap-2 items-center py-2 px-4 border-gray-200 border rounded-md w-full">
                            <RiCoupon2Line className="text-lg text-gray-500" />
                            <input className="bg-transparent border-0 outline-none" placeholder="Enter coupon code here" onChange={(e)=>setCouponCode(e.target.value)}/>
                        </div>
                        <button 
                            className={`border-0 font-semibold w-fit ${couponCode ? 'text-orange-600' : 'text-gray-400'}`} 
                            onClick={vailidateCoupon}
                            disabled={validatingCoupon}
                        >
                            {validatingCoupon ? 'Validatin...' : 'Apply'}
                        </button>
                    </div>

                    <div className="hidden lg:flex flex-row justify-between items-center gap-4 text-lg font-semibold">
                        <p className="!mb-0">
                            Total:
                        </p>
                        <p className="text-orange-500 !mb-0">
                            {formatAmount(totalAmount) ? formatAmount(totalAmount) : 0}
                        </p>
                    </div>

                    <button 
                        onClick={() => checkOut()}
                        disabled={isLoading}
                        className="hidden lg:flex lg:justify-center text-center font-medium text-[#0ba4db] cursor-pointer border-2 border-[#0ba4db] rounded-md py-2"
                    >
                        {isLoading ? 'Loading...' : `Pay with PayStack`}
                    </button>
                </div>

                <div className="flex flex-col bg-white px-2 rounded-md gap-4 py-3">
                    <h4 className="font-semibold my-2 text-sm">Delivery Address</h4>
                    {
                        addresses && addresses.length > 0 ? addresses?.map((address) => (
                            <div className="flex flex-col" key={address.id}>
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
                                    <p className="font-medium capitalize">
                                        {address.title}
                                        {address.name && <span className="text-gray-600 text-sm ml-1">/{address.name}</span>}
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