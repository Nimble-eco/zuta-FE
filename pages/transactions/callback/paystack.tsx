import {useEffect, useState } from "react";
import Cookies from "js-cookie";
import Header from "../../../Components/Header"
import { toast } from 'react-toastify';
import axiosInstance from "../../../Utils/axiosConfig";
import { useRouter } from "next/router";
import ButtonFull from "../../../Components/buttons/ButtonFull";
import RatingsCard from "../../../Components/cards/RatingsCard";
import ButtonGhost from "../../../Components/buttons/ButtonGhost";
import { updateOrderRequest } from "../../../requests/order/order.request";
import { updateOrderTrainStatusAction } from "../../../requests/orderTrain/orderTrain.request";
import { storeFeedbackAction } from "../../../requests/feedback/feedback.request";
import { feedbackTypes } from "../../../Utils/data";
import { capitalizeFirstLetter } from "../../../Utils/helper";

const paystack = () => {
    const router = useRouter();
    let userCookie: any = {};
    const [isLoading, setIsLoading]= useState(false);
    const [paymentStatus, setPaymentStatus] = useState<string>('');
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const [comment, setComment] = useState('');
    const [type, setType] = useState('');
    const [category, setCategory] = useState('');

    if(typeof window !== 'undefined'){
        userCookie = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null; 
    }

    const submitFeedback = async () => {
        if(!comment) return toast.error('Add a comment');
       
        setIsLoading(true);

        await storeFeedbackAction({type, category, comment})
        .then(response => {
            if(response.status === 201) return toast.success('Thank you for reaching out, your feedback has been noted');
        })
        .catch(error => {
            console.log({error})
            toast.error(
                error?.response?.data?.message ||
                error?.response?.data  || 
                'Error submitting feedback'
            );
            if(error?.response?.status === 401 || error?.response?.status === 403) router.push('/auth/signIn');
            if(error?.response?.status === 422) {
                const errors = error?.response?.data?.error?.errors;
                errors?.map((validationError: any) => {
                    toast.error(`${validationError?.field} ${validationError?.rule}`);
                })
            }
        })
        .finally(()=>setIsLoading(false))
    }

    useEffect(() => {
        const queryParams = new URLSearchParams(router.asPath.split('?')[1]);
        const trxref = queryParams.get('trxref');
        const reference = queryParams.get('reference');
      
        setIsLoading(true)

        axiosInstance.post('/api/payment/verify/paystack', {
            reference,
            trxref
        }, {
            headers: {Authorization: userCookie.access_token}
        })
        .then((response) => {
            setIsLoading(false)
            if(response.data?.message?.toLowerCase() === 'payment successful') {
                const status = response.data.message.toLowerCase() === 'payment successful' ? 'success' : 'unsuccessful';
                setPaymentStatus(status);

                const transactionData: any = response.data.data.metadata;

                transactionData?.orders?.forEach(async (order: any) => {
                    setCategory('order');
                    await updateOrderRequest({
                        id: order,
                        order_paid: true,
                        order_payment_confirmed: true,
                    });
                });

                transactionData?.order_train?.forEach(async (order_id: string) => {
                    setCategory('order train');
                    await updateOrderTrainStatusAction({
                        id: order_id,
                        order_paid: true,
                        order_payment_confirmed: true,
                    });
                });

                toast.success('Order stored successfully')
            }
        })
        .finally(() => localStorage.removeItem('cart'));
    }, []);

    const getShowcase = async () => {
        const showcaseRes = await axiosInstance.get('/api/featured/product/index?properties=1');

        if(showcaseRes.status === 200) {
            setFeaturedProducts(showcaseRes?.data?.data?.splice(0, 6));
        }
    }

    useEffect(()=>{
       getShowcase();
    },[]);

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col relative overflow-scroll">
        <Header />

        <div 
            className="w-full flex flex-col lg:flex-row gap-6 lg:gap-10 mx-auto mt-12 px-4"
        >
            <div className="flex flex-col w-[90%] mx-auto lg:w-[65%] mb-4 min-h-fit">
                <div className="flex flex-col gap-4 bg-white rounded-md px-4 py-4 relative min-h-[75%]">
                    <h2 className="text-lg font-semibold text-center">Please drop us a message</h2>

                    <div className="flex flex-col gap-4">
                        <select 
                            name={'type'} 
                            className='text-gray-500 text-sm bg-gray-100 rounded-md py-2 px-4 w-full' 
                            value={type as string} 
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value={''}>Type of feedback</option>
                            {
                                feedbackTypes?.map((item: any, index: number) => (
                                    <option 
                                        value={item.value ?? item.name} 
                                        key={`${item.value ?? item.name} ${index}`}
                                        className="mb-3 border-b border-gray-200 py-2"
                                    >
                                        {capitalizeFirstLetter(item.title || item.name)}
                                    </option>
                                ))
                            }
                        </select>
                        <textarea 
                            name="user-experience"
                            className="h-48 rounded-md bg-gray-100 outline-none px-4 py-5"
                            placeholder="Tell us about your experience"
                            onChange={(e)=>setComment(e.target.value)}
                        />
                        <div className="flex flex-col justify-center lg:flex-row-reverse lg:justify-evenly gap-4 items-center">
                            <div className="flex w-[80%] lg:w-[50%]">
                                <ButtonFull
                                    action="Submit"
                                    loading={isLoading}
                                    disabled={!comment || isLoading}
                                    onClick={submitFeedback}
                                />
                            </div>
                            {
                                paymentStatus === 'success' ? (
                                <div className="h-12 w-[80%] lg:w-[50%]">
                                    <ButtonGhost
                                        action="View my orders"
                                        loading={isLoading}
                                        onClick={() => router.push('/profile?path=orders')}
                                    />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-[90%] mx-auto lg:w-[35%]">
                <div className="flex flex-col bg-white pl-2 rounded-md gap-3 py-3 min-h-[80vh]">
                    <p className="font-medium text-center">Featured Products</p>
                    {
                        featuredProducts?.map((product) => (
                            <a
                                href={`/product?id=${product?.id}`}
                                className='flex flex-row cursor-pointer mb-6 h-28 text-sm'
                                key={product.id}
                            >
                                <img
                                    src={product?.product?.product_images[0]}
                                    alt="product image"
                                    className='mr-3 h-full rounded-md'
                                />
                                
                                <div 
                                    className="flex flex-col py-2"
                                >
                                    <div className='flex flex-col mb-2'>
                                        <h3 className='text-base font-mono line-clamp-1 mb-1'>
                                            {product?.product_name}
                                        </h3>
                                        { product?.product?.reviews && <RatingsCard rating={product?.product?.reviews} /> }
                                    </div>
                                    <div 
                                        className='flex flex-col'
                                    >
                                        <p 
                                            className='text-orange-300 font-semibold mr-4'
                                        >
                                            {product?.product?.product_price}
                                        </p>
                                        <span>
                                            {product?.product?.product_discount}% Off
                                        </span>
                                    </div>
                                </div>
                            </a>
                        ))
                    }
                </div>

            </div>
        </div>
        
    </div>
  )
}

export default paystack