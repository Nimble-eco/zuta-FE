import { useState } from "react";
import Cookies from 'js-cookie'
import { toast, ToastContainer } from 'react-toastify';
import { injectStyle } from "react-toastify/dist/inject-style";
import { usePaystackPayment } from 'react-paystack';
import Head from "next/head";
import Header from "../../Components/Header";
import MyGallery from "../../Components/sliders/MyGallery";
import SwiperSlider from "../../Components/sliders/Swiper";
import { calculateNextDiscount } from "../../Utils/calculateDiscount";
import HorizontalSlider from "../../Components/lists/HorizontalSlider";
import { sendAxiosRequest } from "../../Utils/sendAxiosRequest";
import axiosInstance from "../../Utils/axiosConfig";
import SelectAddressModal from "../../Components/modals/address/SelectAddressModal";
import ButtonGhost from "../../Components/buttons/ButtonGhost";
import { useRouter } from "next/router";
import { formatAmount } from "../../Utils/formatAmount";
import NewAddressModal from "../../Components/modals/address/NewAddressModal";
import { RiCoupon2Line } from "react-icons/ri";
import { couponValidateAction } from "../../requests/coupons/coupons.requests";
import { BiLoaderCircle } from "react-icons/bi";
import { BsChat } from "react-icons/bs";
import generateRandomKey from "../../Utils/generateRandowmKey";

interface ICreateOrderTrainPageProps {
    product: {
        id: number,
        vendor_id: string,
        product_name: string,
        product_description: string,
        product_price: number,
        product_discount: number,
        quantity: number,
        status: string,
        featured_status: string,
        product_categories: string[],
        product_tags: string[],
        product_images: string[],
        openOrders: any,
        reviews: any[]
    };
    similar_products: any[];
}

const createOpenOrder = ({product, similar_products}: ICreateOrderTrainPageProps) => {
    const router = useRouter();
    const [showImageGallery, setShowImageGallery] = useState<boolean>(false);
    const nextDiscount = calculateNextDiscount(4, product.product_discount, product.product_price);
    const [quantity, setQuantity] = useState<number | string>(1);
    const [selectedAddress, setSelectedAddress] = useState<any>({});
    const [showSelectAddressModal, setShowSelectAddressModal] = useState(false);
    const [showCreateAddressModal, setShowCreateAddressModal] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState(1000);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [validatingCoupon, setValidatingCoupon] = useState(false);

    const [paymentReference, setPaymentReference] = useState(generateRandomKey(8));
    const pay_stack_key = process.env.NEXT_PUBLIC_PAY_STACK_KEY!;

    const toggleImageGallery = () => setShowImageGallery(!showImageGallery);
    const [currentReviewPage, setCurrentReviewPage] = useState(0);

    let user: any = {};

    if(typeof window !== 'undefined') {
        injectStyle();
        user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
    }

    const itemsPerPage = 8;
    const reviewPages = [];

    for (let i = 0; i < product?.reviews?.length; i += itemsPerPage) {
        reviewPages.push(product?.reviews?.slice(i, i + itemsPerPage));
    }

    const selectAddressAndGetDeliveryCharge = async (address: any) => {
        // TODO: CALL NIMBLE ENDPOINT AND GET DELIVERY FEE
        setDeliveryFee(1000)

        setTotalAmount((Number(quantity) * product.product_price) + 1000)
    }

    const openOrderTrain = async () => {
        return axiosInstance.post('/api/open-order/store', {
            product_id: product.id,
            quantity,
            address_id: selectedAddress.id,
            order_delivery_fee: deliveryFee,
            reference: paymentReference
        }, {
            headers: {
                Authorization: user.access_token
            }
        })
    }

    const config = {
        reference: paymentReference,
        email: user?.email,
        amount: (totalAmount * 100),
        publicKey: pay_stack_key,
    };

    const onSuccess = async () => {
        setIsLoading(true);
        await openOrderTrain()
        .then(() => {
            toast.success('Payment successful')
            router.push(`/profile?path=orders`)
        })
        .catch(error => {
            console.log({error})
            toast.error(error?.response?.message || 'Error try agin later');
        })
        .finally(()=>setIsLoading(false))
    };
    
    const onClose = () => {
        console.log('çlosed');
    }

    const initializePayment = usePaystackPayment(config);
    
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


  return (
    <div
        className='w-full bg-white min-h-screen relative'
    >
        <Head>
            <title>{product.product_name}</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <Header search={false} />

        <ToastContainer />

        {
            product?.product_images && (
                <MyGallery 
                    show={showImageGallery}
                    setShow={toggleImageGallery}
                    slides={product?.product_images}
                />
            )
        }

        {
            showSelectAddressModal && <SelectAddressModal
                setShow={() => setShowSelectAddressModal(!showSelectAddressModal)}
                selectAddress={(address: any) => {
                    setSelectedAddress(address)
                    selectAddressAndGetDeliveryCharge(address)
                    setShowSelectAddressModal(false)
                }}
                showNewAddressModal={() => {
                    setShowSelectAddressModal(false);
                    setShowCreateAddressModal(true);
                }}
            />
        }

        {
            showCreateAddressModal && <NewAddressModal
                setShow={() => setShowCreateAddressModal(false)}
            />
        }

        <div className='w-full h-fit lg:h-[60vh] cursor-pointer flex align-middle mt-2' onClick={toggleImageGallery}>
            <SwiperSlider 
                slides={product?.product_images}
                slidesToShow={product?.product_images?.length > 2 ? 2 : 1}
            />
        </div>

        <div 
            className="flex flex-col md:flex-row w-full lg:w-[95%] mx-auto px-3 lg:px-5 py-4 mt-6 relative"
        >
            <div className="w-full md:w-[60%] flex flex-col lg:px-4">
                <h1 className="text-xl md:text-2xl justify-center mb-0 !text-center lg:!text-left capitalize">
                    {product?.product_name}
                </h1>
                <p className="text-gray-600 py-2 mb-0 line-clamp-4 !text-center lg:!text-left">
                    {product?.product_description}
                </p>

                <div className="grid grid-cols-2 gap-8 w-full mr-2 my-1 lg:justify-start">
                    <div 
                        className='flex flex-col lg:flex-row lg:gap-1'
                    >
                        <p className="text-gray-600 flex flex-col md:flex-row mb-0">
                            Price:
                        </p>
                        <span className='font-semibold text-green-600'>
                            {formatAmount(product?.product_price)}
                        </span>
                    </div>
                    <div 
                        className='flex flex-col lg:flex-row lg:gap-1'
                    >
                        <p className="text-gray-600 flex flex-col md:flex-row mb-0">
                            Current discount: 
                        </p>
                        <span className='font-semibold line-through'>
                            {formatAmount(calculateNextDiscount(4, product?.product_discount, product?.product_price))}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 w-full mr-2 my-1 lg:justify-start">
                    <div 
                        className='flex flex-col lg:flex-row lg:gap-1'
                    >
                        <p className="text-gray-600 flex flex-col md:flex-row mb-0">
                            Next Price:
                        </p>
                        <span className='font-semibold text-orange-600 animate-pulse'>
                            {formatAmount(product?.product_price - nextDiscount)}
                        </span>
                    </div>
                    <div 
                        className='flex flex-col lg:flex-row lg:gap-1'
                    >
                        <p className="text-gray-600 flex flex-col md:flex-row mb-0">
                            Next discount: 
                        </p>
                        <span className='font-semibold line-through'>
                            {formatAmount(calculateNextDiscount(3, product?.product_discount, product?.product_price))}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3 lg:px-4 w-full md:w-[40%] md:px-4 py-3 md:border-[1px] border-gray-200 shadow-sm">
                <p className="text-sm mb-0">
                    Buy this product at the current price and encourage others to do the same. As more people buy, the price lowers. <br />
                    You'll receive a refund for the price difference upon order completion.
                </p>

                <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-row items-center gap-2">
                        <p className="mr-4 lg:mr-0 mb-0 text-sm md:text-base">Quantity:</p>
                        <input
                            type="number"
                            value={quantity}
                            onChange={event => setQuantity(Number(event.target.value))}
                            className='outline-none bg-gray-100 border-gray-200 rounded-md w-fit py-2 pl-3 text-sm md:mr-4'
                        />
                    </div>
                    <div className="flex flex-row gap-1 justify-center lg:justify-end text-sm md:text-base">
                        <p className="mb-0">=</p>
                        <p className="text-green-400 mb-0 block lg:flex">{formatAmount(totalAmount)}</p>
                    </div>
                </div>

                {
                    deliveryFee && (
                        <div className="flex flex-row gap-1 lg:justify-start">
                            <p className="font-medium mb-0">Delivery Fee:
                                <span className="text-orange-500 font-semibold ml-1">{formatAmount(deliveryFee)}</span>
                            </p>
                        </div>
                    )
                }

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

                <div className="flex flex-row gap-2">
                    {
                        selectedAddress?.address && (
                            <div className="h-12 w-fit mx-auto">
                                <ButtonGhost
                                    action="Change address"
                                    onClick={() => setShowSelectAddressModal(true)}
                                />
                            </div>
                        )
                    }
                    <button
                        onClick={async () => {
                            if(!selectedAddress?.address) {
                                setShowSelectAddressModal(true)
                            }
                            else initializePayment(onSuccess, onClose)
                        }}
                        disabled={isLoading}
                        className="bg-orange-500 hover:bg-orange-700 text-white font-medium py-2 px-4 h-12 rounded-full w-[60%] !mx-auto whitespace-nowrap fixed bottom-4 left-4 right-4 lg:static"
                    >
                        {
                            selectedAddress?.address ? 
                            `Checkout ${formatAmount(totalAmount) }` : 
                            isLoading ? 
                            <BiLoaderCircle className="h-6 w-6 animate-spin" /> :
                            'Start Order Train'
                        }
                    </button>
                </div>

            </div>
            
                        
        </div>
        
        {
            similar_products && similar_products.length > 0 && (
                <div className='mt-10 w-[95%] ml-[5%]'>
                    <HorizontalSlider 
                        list={similar_products}
                        list_name='Similar items'
                    />
                </div>
            )
        }

        { reviewPages.length > 0 ?
            <div className="my-10 flex flex-col w-[90%] mx-auto mb-10">
                <h2 className="text-2xl font-mono text-orange-500 text-left mb-6">
                    Reviews
                </h2> 
                { reviewPages[currentReviewPage]?.map((review: any, index: number) => ( 
                    <div className="flex flex-col mb-4" key={`${review.name}${index}`}>
                        <h3 className="text-black justify-start font-normal text-base">
                            {review.name}
                        </h3>
                        <p className="text-gray-600">
                            {review.message}
                        </p>
                    </div>
                ))} 
                <div className='flex flex-row justify-end text-sm w-[80%] mx-auto'>
                    <button disabled={currentReviewPage === 0} onClick={() => setCurrentReviewPage(currentReviewPage - 1)} className='mr-3 cursor-pointer'>Previous</button>
                    <button disabled={currentReviewPage === reviewPages.length - 1} onClick={() => setCurrentReviewPage(currentReviewPage + 1)} className='mr-3 cursor-pointer'>Next</button>
                </div>
            </div> : 
            <div className='flex flex-col justify-center items-center gap-2 my-16'>
                <BsChat className='text-5xl text-orange-500'/>
                <p className='text-center text-xl font-medium text-orange-500'>No reviews yet</p>
            </div>
        }
    </div>
  )
}

export default createOpenOrder

export async function getServerSideProps(context: any) {
    try{
        const { product_id } = context.query

        const getProduct = await sendAxiosRequest(
            `/api/public/product/show?id=${product_id}`,
            "get",
            {},
            "",
            ""
        );
       
        return {
            props: {
                product: getProduct.data.product,
                similar_products: getProduct.data.similar_products
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