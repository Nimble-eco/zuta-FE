import { useRouter } from "next/router";
import {useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import axiosInstance from "../../../../Utils/axiosConfig";
import ButtonFull from "../../../../Components/buttons/ButtonFull";
import { PulseLoader } from "react-spinners";
import Header from "../../../../Components/Header";
import ButtonGhost from "../../../../Components/buttons/ButtonGhost";
import RatingsCard from "../../../../Components/cards/RatingsCard";

const paystack = () => {
    const router = useRouter();
    let userCookie: any = {};
    const [isLoading, setIsLoading]= useState(false);
    const [paymentStatus, setPaymentStatus] = useState<string>('');
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

    if(typeof window !== 'undefined'){
        userCookie = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null; 
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
                toast.success('Payment verified successfully')
            }
        })
        .finally(() => localStorage.removeItem('cart'));
    }, []);

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col relative">
        <Header />

        <div 
            className="w-[95%] flex flex-col lg:flex-row gap-4 mx-auto mt-12"
        >
            <div className="flex flex-col w-[90%] gap-4 mx-auto lg:w-[65%] lg:mr-[2%] mb-4 min-h-fit">
                <div className="flex flex-col bg-white rounded-md px-4 !py-4 relative min-h-[75%]">
                    <div className="flex flex-row justify-start gap-4 ">
                        <h2 className="text-xl font-semibold">{paymentStatus === 'success' ? 'Verified' : 'Verifying'}</h2>
                        <div>
                            <PulseLoader 
                                size={10}
                                loading={isLoading}
                                color="#FFA500"
                            />
                        </div>
                    </div>

                    {
                        paymentStatus === 'success' ? (
                            <div className="flex flex-row justify-between align-middle">
                                <p className="text-left text-green-600">Payment successful</p>
                                <div className="h-10 w-[20%]">
                                    <ButtonFull
                                        action="View Showcase"
                                        onClick={() => router.push('/vendor/showcase')}
                                    />
                                </div>
                            </div>
                        ) : null
                    }

                    <div className="flex flex-col gap-4 w-[98%] mx-auto mb-4">
                        <textarea 
                            name="user-experience"
                            className="h-48 rounded-[16px] bg-gray-100 w-full outline-none mt-10 px-4 py-5"
                            placeholder="Tell us about your experience"
                        />
                        <div className="flex w-[20%] ml-[80%] h-10 !mb-4 justify-end">
                            <ButtonGhost
                                action="Submit"
                                onClick={() => {}}
                            />
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