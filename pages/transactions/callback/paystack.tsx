import {useEffect, useState } from "react";
import Cookies from "js-cookie";
import Header from "../../../Components/Header"
import { toast } from 'react-toastify';
import axiosInstance from "../../../Utils/axiosConfig";
import { useRouter } from "next/router";
import { PulseLoader } from "react-spinners";
import ButtonFull from "../../../Components/buttons/ButtonFull";
import RatingsCard from "../../../Components/cards/RatingsCard";
import ButtonGhost from "../../../Components/buttons/ButtonGhost";
import { createAnOrderAction } from "../../../requests/order/order.request";
import { joinOrderTrainAction } from "../../../requests/orderTrain/orderTrain.request";
import { storeFeedbackAction } from "../../../requests/feedback/feedback.request";
import MyDropDownInput from "../../../Components/inputs/MyDropDownInput";
import { feedbackTypes } from "../../../Utils/data";

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
            if(error?.response?.status === (401 || 403)) router.push('/auth/signIn');
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

                transactionData?.products?.map(async (product: any) => {
                    setCategory('order');
                    await createAnOrderAction({
                        ...transactionData,
                        product_id: Number(product.product_id),
                        quantity: Number(product.quantity),
                        address_id: Number(transactionData.address_id),
                        order_sub_amount: Number(transactionData.order_sub_amount),
                        order_service_fee: Number(transactionData.order_service_fee),
                        order_delivery_fee: Number(transactionData.order_delivery_fee),
                        order_paid: true,
                        order_payment_confirmed: true,
                    })
                });

                transactionData?.order_train?.map(async (product: any) => {
                    setCategory('order train');
                    await joinOrderTrainAction({
                        ...transactionData,
                        product_id: Number(product.product_id),
                        quantity: Number(product.quantity),
                        address_id: Number(transactionData.address_id),
                        order_sub_amount: Number(transactionData.order_sub_amount),
                        order_service_fee: Number(transactionData.order_service_fee),
                        order_delivery_fee: Number(transactionData.order_delivery_fee),
                        order_paid: true,
                        order_payment_confirmed: true,
                    })
                });

                toast.success('Order stored successfully')
            }
        })
        .finally(() => localStorage.removeItem('cart'));
    }, []);

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col relative">
        <Header />

        <div 
            className="w-[95%] flex flex-col lg:flex-row mx-auto mt-12"
        >
            <div className="flex flex-col w-[90%] mx-auto lg:w-[65%] lg:mr-[2%] mb-4 min-h-fit">
                <div className="flex flex-col gap-4 bg-white rounded-md px-4 py-4 relative min-h-[75%]">
                    <div className="flex flex-row justify-start gap-4 ">
                        <h2 className="text-lg font-semibold">Your Feedback</h2>
                    </div>

                    <div className="flex flex-col gap-4">
                        <MyDropDownInput
                            label="Type of feedback"
                            name="type"
                            value={type}
                            onSelect={(e: any)=>setType(e.target?.value)}
                            options={feedbackTypes}
                        />
                        <textarea 
                            name="user-experience"
                            className="h-48 rounded-[16px] bg-gray-100 outline-none px-4 py-5"
                            placeholder="Tell us about your experience"
                            onChange={(e)=>setComment(e.target.value)}
                        />
                        <div className="flex flex-col justify-center lg:flex-row-reverse lg:justify-evenly gap-4 items-center">
                            <div className="flex w-[80%] lg:w-[50%]">
                                <ButtonFull
                                    action="Submit"
                                    loading={isLoading}
                                    onClick={submitFeedback}
                                />
                            </div>
                            {
                                paymentStatus === 'success' ? (
                                <div className="h-10 w-[80%] lg:w-[50%]">
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
                <div className="bg-white h-full w-full rounded-md" />
            </div>

            <div className="flex flex-col w-[90%] mx-auto lg:w-[35%]">
                <div className="flex flex-col bg-white pl-2 rounded-md gap-3 py-3 min-h-[80vh]">
                    <p className="font-medium text-center">Featured Products</p>
                    {
                        featuredProducts?.map((product) => (
                            <div
                                className='flex flex-row cursor-pointer mb-6 h-28 text-sm'
                                // onClick={() => goToProductPage(product?.id)}
                                key={product.id}
                            >
                                <img
                                    src={product?.image}
                                    alt="product image"
                                    className='mr-3 h-full rounded-md'
                                />
                                
                                <div 
                                    className="flex flex-col py-2"
                                >
                                    <div className='flex flex-col mb-2'>
                                        <h3 className='text-base font-mono line-clamp-1 mb-1'>
                                            {product?.name}
                                        </h3>
                                        { product.rating && <RatingsCard rating={product.rating} /> }
                                    </div>
                                    <div 
                                        className='flex flex-col'
                                    >
                                        <p 
                                            className='text-orange-300 font-semibold mr-4'
                                        >
                                            {product.price}
                                        </p>
                                        <span>
                                            {product.discount}% Off
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>

            </div>
        </div>
        
    </div>
  )
}

export default paystack