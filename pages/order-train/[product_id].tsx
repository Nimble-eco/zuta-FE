import { useState, useMemo } from "react";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { usePaystackPayment } from 'react-paystack';
import Head from "next/head";
import { useRouter } from "next/router";
import { 
    RiCoupon2Line, 
    RiTruckLine, 
    RiUserSharedLine, 
    RiInformationLine 
} from "react-icons/ri";
import { 
    Star, 
    MessageCircle, 
    LoaderCircle, 
    MessageCirclePlus
} from "lucide-react";

// Components & Utils
import Header from "../../Components/Header";
import MyGallery from "../../Components/sliders/MyGallery";
import SwiperSlider from "../../Components/sliders/Swiper";
import HorizontalSlider from "../../Components/lists/HorizontalSlider";
import SelectAddressModal from "../../Components/modals/address/SelectAddressModal";
import NewAddressModal from "../../Components/modals/address/NewAddressModal";
import { calculateNextDiscount, calculateNextDiscountPercent } from "../../Utils/calculateDiscount";
import { formatAmount } from "../../Utils/formatAmount";
import { processImgUrl } from "../../Utils/helper";
import axiosInstance from "../../Utils/axiosConfig";
import generateRandomKey from "../../Utils/generateRandowmKey";
import { sendAxiosRequest } from "../../Utils/sendAxiosRequest";
import { couponValidateAction } from "../../requests/coupons/coupons.requests";

/* ─── UI Helpers from Product Page ─────────────────────────────────────── */

const StarRow = ({ rating, height = 4, width = 4 }: { rating: number; height?: number; width?: number }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                className={`w-${width} h-${height} ${star <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
            />
        ))}
    </div>
);

const RatingBar = ({ label, pct }: { label: string; pct: number }) => (
    <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 w-12 shrink-0">{label}</span>
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs text-slate-400 w-8 text-right shrink-0">{Math.round(pct)}%</span>
    </div>
);

/* ─── Main Page ────────────────────────────────────────────────────────── */

const CreateOpenOrder = ({ product, similar_products }: any) => {
    const router = useRouter();
    const [showImageGallery, setShowImageGallery] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedAddress, setSelectedAddress] = useState<any>({});
    const [showSelectAddressModal, setShowSelectAddressModal] = useState(false);
    const [showCreateAddressModal, setShowCreateAddressModal] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState(1000);
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [validatingCoupon, setValidatingCoupon] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentReviewPage, setCurrentReviewPage] = useState(0);
    
    // Review Calculations
    const itemsPerPage = 6;
    const totalReviews = product?.reviews?.length || 0;
    const averageScore = totalReviews > 0 
        ? (product?.reviews.reduce((acc: number, r: any) => acc + r.score, 0) / totalReviews).toFixed(1) 
        : '0';
    
    const reviewPages = [];
    for (let i = 0; i < (product?.reviews?.length || 0); i += itemsPerPage) {
        reviewPages.push(product?.reviews.slice(i, i + itemsPerPage));
    }

    const pctForScore = (s: number) => {
        const count = product?.reviews?.filter((r: any) => r.score === s).length || 0;
        return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    };

    // Payment Setup
    const pay_stack_key = process.env.NEXT_PUBLIC_PAY_STACK_KEY!;
    const [paymentReference] = useState(generateRandomKey(8));
    
    let user: any = {};
    if (typeof window !== 'undefined') {
        user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
    }
    // Calculate the actual Next Price drop
    const nextDiscountPercent = calculateNextDiscountPercent(4, product?.product_discount);
    const nextDiscountPrice = product?.product_price - calculateNextDiscount(4, product?.product_discount, product?.product_price);
    // const nextDiscountPrice = product?.product_price * (1 - (nextDiscountPercent / 100));

    // Memoized total to ensure consistency across payment configs
    const totalAmount = useMemo(() => {
        return (quantity * product?.product_price) + deliveryFee - couponDiscount;
    }, [quantity, product?.product_price, deliveryFee, couponDiscount]);

    for (let i = 0; i < product?.reviews?.length; i += itemsPerPage) {
        reviewPages.push(product?.reviews?.slice(i, i + itemsPerPage));
    }

    const selectAddressAndGetDeliveryCharge = async (address: any) => {
        // TODO: CALL NIMBLE ENDPOINT AND GET DELIVERY FEE
        setDeliveryFee(1000);

        setSelectedAddress(address);
        setShowSelectAddressModal(false);
    }

    const config = {
        reference: paymentReference,
        email: user?.email,
        amount: (totalAmount * 100),
        publicKey: pay_stack_key,
    };
    
    const initializePayment = usePaystackPayment(config);
    
    const handlePaymentSuccess = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post('/api/open-order/store', {
                product_id: product?.id,
                quantity,
                address_id: selectedAddress.id,
                order_delivery_fee: deliveryFee,
                reference: paymentReference
            }, { headers: { Authorization: user.access_token } });
            
            if(response?.status === 201) {
                toast.success('Train started successfully!');
                sessionStorage.setItem('new_order_train', JSON.stringify(response?.data?.data));
                router.push(`/order-train/success`);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Error starting train');
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
                setCouponDiscount(coupon?.amount);
                toast.success('Coupon validated');
            }
        })
        .catch(error =>{
            console.log({error})
            toast.error('Invalid coupon');
        })
        .finally(()=>setValidatingCoupon(false))
    }

  return (
    <div className='w-full bg-slate-50 min-h-screen pb-20 overflow-scroll'>
        <Head>
            <title>Start Order Train | {product?.product_name}</title>
        </Head>

        <Header search={false} />

        <MyGallery 
            show={showImageGallery} 
            setShow={() => setShowImageGallery(false)} 
            slides={product?.product_images || []} 
        />

        {/* Modals */}
        {showSelectAddressModal && (
            <SelectAddressModal
                setShow={() => setShowSelectAddressModal(false)}
                selectAddress={(addr: any) => selectAddressAndGetDeliveryCharge(addr)}
                showNewAddressModal={() => {
                    setShowSelectAddressModal(false);
                    setShowCreateAddressModal(true);
                }}
            />
        )}

        {
            showCreateAddressModal && <NewAddressModal
                setShow={() => setShowCreateAddressModal(false)}
            />
        }

        <main className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-8">
          
                {/* Left: Visuals & Details */}
                <div className="w-full lg:w-3/5 space-y-6">
                    <div 
                        className="bg-white rounded-3xl overflow-hidden shadow-sm cursor-zoom-in h-[300px] md:h-[450px]"
                        onClick={() => setShowImageGallery(true)}
                    >
                        <SwiperSlider 
                            slides={product?.product_images} 
                            slidesToShow={1} 
                        />
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                            <StarRow rating={Number(averageScore)} />
                            <span className="text-sm font-bold text-slate-700">{averageScore}</span>
                            <span className="text-sm text-slate-400">({totalReviews} reviews)</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 capitalize">{product?.product_name}</h1>
                        <p 
                            dangerouslySetInnerHTML={{__html: product?.product_description}}
                        />
                    </div>

                    {/* Testimonials (Video Social Proof) */}
                    {product?.product_testimonials?.length > 0 && (
                    <section className="bg-slate-900 rounded-2xl p-6 text-white">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-orange-400" />
                        Real Reviews from the Community
                        </h2>
                        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                        {product?.product_testimonials.map((video: string, i: number) => (
                            <div key={i} className="shrink-0 rounded-xl overflow-hidden bg-black">
                            <video 
                                src={processImgUrl(video)} 
                                className="h-48 w-64 object-cover" 
                                controls 
                            />
                            </div>
                        ))}
                        </div>
                    </section>
                    )}
                </div>

                {/* Right: Train Controls & Pricing */}
                <div className="w-full lg:w-2/5 space-y-4">
                    <div className="bg-white sticky top-24 p-6 rounded-2xl shadow-md border-t-4 border-orange-500">
                        <div className="flex items-center gap-2 text-orange-600 bg-orange-50 w-fit px-3 py-1 rounded-full mb-4">
                            <RiUserSharedLine className="animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-wider">Order Train Mode</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase">Current Price</p>
                                    <p className="text-3xl font-black text-slate-900">{formatAmount(product?.product_price)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-green-600 font-bold">Next Milestone Price</p>
                                    {/* Showing the actual currency value instead of just % */}
                                    <p className="text-lg font-bold text-green-600">{formatAmount(nextDiscountPrice)}</p>
                                    <p className="text-[10px] text-slate-400 uppercase">Save {nextDiscountPercent}% more</p>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                                <RiInformationLine className="text-blue-500 shrink-0 mt-1" />
                                <p className="text-xs text-blue-800 leading-snug">
                                    Open this train and share. Once the train hits the next milestone, 
                                    you'll be paying <strong>{formatAmount(nextDiscountPrice)}</strong>.
                                </p>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Coupon Input Section */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Have a coupon?</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <RiCoupon2Line className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input 
                                            type="text"
                                            placeholder="Enter code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                                        />
                                    </div>
                                    <button 
                                        onClick={vailidateCoupon}
                                        disabled={validatingCoupon || !couponCode}
                                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold disabled:bg-slate-200 transition-colors"
                                    >
                                        {validatingCoupon ? <LoaderCircle className="w-4 h-4 animate-spin" /> : 'Apply'}
                                    </button>
                                </div>
                            </div>

                            {/* Quantity & Address */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-slate-700">Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                                        className="w-20 p-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700">Delivery Address</label>
                                    {selectedAddress?.address ? (
                                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                                            <div className="truncate pr-4">
                                                <p className="text-xs font-bold text-slate-800">{selectedAddress.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{selectedAddress.address}</p>
                                            </div>
                                            <button onClick={() => setShowSelectAddressModal(true)} className="text-xs text-orange-600 font-bold">Change</button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setShowSelectAddressModal(true)}
                                            className="w-full p-3 border-2 border-dashed border-orange-600 rounded-xl text-orange-600 text-sm hover:border-orange-300 hover:text-orange-500 transition-all flex items-center justify-center gap-2"
                                        >
                                            <RiTruckLine /> Select Delivery Address
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Total Section */}
                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span className="font-medium">{formatAmount(quantity * product?.product_price)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Delivery Fee</span>
                                    <span className="font-medium">{formatAmount(deliveryFee)}</span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Coupon Discount</span>
                                        <span>-{formatAmount(couponDiscount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-2">
                                    <span className="font-bold text-slate-900">Total to Pay</span>
                                    <span className="text-2xl font-black text-orange-600">{formatAmount(totalAmount)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => !selectedAddress?.address ? setShowSelectAddressModal(true) : initializePayment(handlePaymentSuccess, () => {})}
                                disabled={isLoading}
                                className="w-full h-14 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-3"
                            >
                                {isLoading ? <LoaderCircle className="animate-spin" /> : (
                                    <>
                                        <RiUserSharedLine />
                                        {selectedAddress?.address ? `Pay ${formatAmount(totalAmount)}` : 'Start Order Train'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Items */}
            {similar_products?.length > 0 && (
            <div className='mt-16'>
                <HorizontalSlider list={similar_products} list_name='People also viewed' />
            </div>
            )}

            {/* Reviews Section */}
            <section className="mt-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                Customer Experience
            </h2>

            {reviewPages.length > 0 ? (
                <div className="flex flex-col lg:flex-row gap-12">
                {/* Summary */}
                <div className="lg:w-80 shrink-0 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center lg:text-left">
                    <p className="text-5xl font-black text-slate-900 mb-2">{averageScore}</p>
                    <div className="flex justify-center lg:justify-start mb-2"><StarRow rating={Number(averageScore)} /></div>
                    <p className="text-sm text-slate-400">Based on {totalReviews} verified purchases</p>
                    </div>
                    <div className="space-y-3 px-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <RatingBar key={star} label={`${star} star`} pct={pctForScore(star)} />
                    ))}
                    </div>
                </div>

                {/* Feed */}
                <div className="flex-1 space-y-4">
                    {reviewPages[currentReviewPage]?.map((review: any, i: number) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                        <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                            {review.user?.name?.[0] || 'U'}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{review.user?.name || review.name}</p>
                            <StarRow rating={review.score} height={3} width={3} />
                        </div>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">{review.comment || review.message}</p>
                    </div>
                    ))}

                    {/* Pagination */}
                    {reviewPages.length > 1 && (
                    <div className="flex justify-end items-center gap-4 pt-4">
                        <button 
                        disabled={currentReviewPage === 0}
                        onClick={() => setCurrentReviewPage(p => p - 1)}
                        className="p-2 text-sm font-bold text-slate-500 disabled:opacity-20"
                        >
                        Previous
                        </button>
                        <span className="text-xs font-mono bg-slate-100 px-3 py-1 rounded-full">{currentReviewPage + 1} / {reviewPages.length}</span>
                        <button 
                        disabled={currentReviewPage === reviewPages.length - 1}
                        onClick={() => setCurrentReviewPage(p => p + 1)}
                        className="p-2 text-sm font-bold text-slate-500 disabled:opacity-20"
                        >
                        Next
                        </button>
                    </div>
                    )}
                </div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl py-20 flex flex-col items-center border border-slate-100">
                <MessageCirclePlus className="text-5xl text-slate-200 mb-4" />
                <p className="text-slate-400 font-medium text-lg">No reviews yet. Be the trendsetter!</p>
                </div>
            )}
            </section>
        </main>
    </div>
  );
};

export default CreateOpenOrder;

export async function getServerSideProps(context: any) {
    try{
        const { product_id } = context.query
        console.log({product_id})

        const getProduct = await sendAxiosRequest(
            `/api/public/product/show?id=${product_id}`,
            "get",
            {},
            "",
            ""
        );
       
        return {
            props: {
                product: getProduct?.data.product,
                similar_products: getProduct?.data.similar_products
            }
        }
    }
    catch(err: any) {
        console.log({err})
        return {
            props: {
                product: {},
                similar_products: []
            }
        }
    }
}
