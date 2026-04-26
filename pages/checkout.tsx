import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import Header from "../Components/Header";
import { parse } from "cookie";
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked, MdAddLocationAlt } from "react-icons/md";
import { cartCheckoutAction } from "../requests/cart/cart.requests";
import Cookies from "js-cookie";
import { formatAmount } from "../Utils/formatAmount";
import axiosInstance from "../Utils/axiosConfig";
import NewAddressModal from "../Components/modals/address/NewAddressModal";
import { RiCoupon2Line, RiTruckLine, RiSecurePaymentLine } from "react-icons/ri";
import { couponValidateAction } from "../requests/coupons/coupons.requests";
import { Loader2, ShoppingBag, TrainFront } from "lucide-react";
import axios from "axios";
import { sendAxiosRequest } from "../Utils/sendAxiosRequest";

interface ICheckoutProps {
    user: any;
    addresses: any[];
}

const Checkout: FC<ICheckoutProps> = ({ user, addresses }) => {
    const router = useRouter();
    const [cart, setCart] = useState<any>({ products: [], subscriptions: [], bundles: [] });
    const [selectedAddress, setSelectedAddress] = useState<any>({});
    const [subTotal, setSubTotal] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showAddAddressModal, setShowAddAddressModal] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [validatingCoupon, setValidatingCoupon] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [deliverySummary, setDeliverySummary] = useState<any>({});

    let userCookie: any = {};

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '{"products":[], "subscriptions":[], "bundles":[]}');
        setCart(savedCart);
        
        if (addresses.length > 0) {
            const def = addresses.find(a => a.address_selected) || addresses[0];
            setSelectedAddress(def);
        }

        if(typeof window !== 'undefined'){
            userCookie = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null; 
        }
    }, []);

    const prepareOrders = () => {
        const items = [...(cart.products || []), ...(cart.subscriptions || []), ...(cart.bundles || [])];
        return items.map((item: any) => ({
            pickup_state: item?.vendor?.vendor_state,
            destination_state: selectedAddress?.state,
            item_category: item?.product_categories?.[0] || item?.product?.product_categories?.[0] || 'other',
            item_quantity: item?.quantity || item?.order_count
        }));
    };

    const getDeliveryFee = async () => {
        if (!selectedAddress?.state) return;
        setIsLoading(true);
        try {
            const url = `${process.env.NEXT_PUBLIC_NIMBLE_API_BASEURL}/third-party/delivery/estimate-address`;
            const response = await axios.post(url, { orders: prepareOrders() });
            if (response.status === 200) {
                setDeliveryFee(response.data?.data?.total_sum);
                setDeliverySummary(response.data?.data?.estimates);
            }
        } catch (e) {
            toast.error("Could not calculate delivery fee");
        } finally {
            setIsLoading(false);
        }
    };

    const vailidateCoupon = async () => {
        setValidatingCoupon(true);
        couponValidateAction(couponCode)
        .then(response => {
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
        .finally(()=>setValidatingCoupon(false));
    }

    useEffect(() => {
        if (selectedAddress?.id && cart.products?.length + cart.subscriptions?.length > 0) {
            getDeliveryFee();
        }
    }, [selectedAddress?.id, cart]);

    useEffect(() => {
        const pTotal = cart.products?.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0) || 0;
        const sTotal = cart.subscriptions?.reduce((acc: number, item: any) => acc + item.open_order_price * item.quantity, 0) || 0;
        const bTotal = cart.bundles?.reduce((acc: number, item: any) => acc + item.product_price * item.order_count, 0) || 0;
        
        const sub = pTotal + sTotal + bTotal;
        setSubTotal(sub);
        setTotalAmount(sub + deliveryFee);
    }, [deliveryFee, cart]);

    const handleCheckout = async () => {
        if (!selectedAddress?.id) return toast.error('Please select a delivery address');
        setIsLoading(true);
        try {
            const userCookie = JSON.parse(Cookies.get('user') || '{}');
            const res = await cartCheckoutAction({ user_id: userCookie?.id, address_id: selectedAddress.id });
            localStorage.removeItem("cart");
            router.push(res.data.data.pay_stack_checkout_url);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Checkout failed');
        } finally {
            setIsLoading(false);
        }
    };

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
        <div className="bg-gray-50 min-h-screen pb-24 lg:pb-12">
            <Header />
            
            {showAddAddressModal && (
                <NewAddressModal setShow={() => setShowAddAddressModal(false)} redirect={() => router.reload()} />
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Details */}
                    <div className="flex-1 space-y-6">
                        
                        {/* Section: Delivery Address */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <RiTruckLine className="text-orange-500" /> Delivery Address
                                </h2>
                                <button 
                                    onClick={() => setShowAddAddressModal(true)}
                                    className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
                                >
                                    <MdAddLocationAlt /> Add New
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses.map((addr) => (
                                    <div 
                                        key={addr.id}
                                        onClick={() => setSelectedAddress(addr)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                            selectedAddress?.id === addr?.id 
                                            ? 'border-orange-500 bg-orange-50/30' 
                                            : 'border-gray-100 hover:border-gray-200'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{addr.title}</span>
                                            {selectedAddress?.id === addr?.id ? <MdOutlineRadioButtonChecked className="text-orange-500" /> : <MdOutlineRadioButtonUnchecked className="text-gray-300" />}
                                        </div>
                                        <p className="font-semibold text-gray-800">{addr.name || user?.name}</p>
                                        <p className="text-sm text-gray-500 leading-relaxed">{addr.address}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Section: Cart Items */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <ShoppingBag className="text-orange-500" size={20} /> Order Summary
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {cart.products?.map((item: any, i: number) => (
                                    <div key={i} className="p-6 flex items-center gap-4">
                                        <div className="h-16 w-16 bg-gray-100 rounded-md flex-shrink-0" />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 text-sm uppercase">{item.product_name}</h4>
                                            <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-gray-900">{formatAmount(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                                {cart.subscriptions?.map((item: any, i: number) => (
                                    <div key={i} className="p-6 flex items-center gap-4 bg-orange-50/20">
                                        <div className="h-16 w-16 bg-orange-100 rounded-md flex items-center justify-center text-orange-600">
                                            <TrainFront size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium text-gray-900 text-sm uppercase">{item.product?.product_name}</h4>
                                                <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold">TRAIN</span>
                                            </div>
                                            <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-gray-900">{formatAmount(item.open_order_price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Payment Summary (Sticky) */}
                    <div className="lg:w-[380px]">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Details</h3>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatAmount(subTotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600">
                                    <span className="flex items-center gap-1">Delivery Fee <RiTruckLine className="text-xs" /></span>
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-orange-500" /> : <span>{formatAmount(deliveryFee)}</span>}
                                </div>
                                
                                {/* Coupon Input */}
                                <div className="flex gap-2 py-2">
                                    <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                                        <RiCoupon2Line className="text-gray-400" />
                                        <input 
                                            className="bg-transparent text-sm w-full outline-none" 
                                            placeholder="Coupon Code" 
                                            onChange={(e) => setCouponCode(e.target.value)}
                                        />
                                    </div>
                                    <button 
                                        disabled={!couponCode || validatingCoupon}
                                        onClick={vailidateCoupon}
                                        className="text-sm font-bold text-orange-600 disabled:opacity-30"
                                    >
                                        {validatingCoupon ? '...' : 'Apply'}
                                    </button>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-black text-orange-600">{formatAmount(totalAmount)}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleCheckout}
                                disabled={isLoading}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <><RiSecurePaymentLine size={20} /> Pay Now</>}
                            </button>

                            <div className="mt-6 flex flex-col items-center gap-2">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Secure Delivery By</p>
                                <div className="flex items-center gap-2 grayscale opacity-60">
                                    <span className="text-blue-600 font-bold italic text-sm">Nimble Logistics</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Sticky Button */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50">
                <button 
                    onClick={handleCheckout}
                    className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl flex justify-between px-6 items-center"
                >
                    <span>{isLoading ? 'Processing...' : 'Complete Order'}</span>
                    <span className="text-lg">{formatAmount(totalAmount)}</span>
                </button>
            </div>
        </div>
    );
};

export default Checkout;

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