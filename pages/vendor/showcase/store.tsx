import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify'
import { injectStyle } from "react-toastify/dist/inject-style";
import VendorSideNavPanel from "../../../Components/vendor/layout/VendorSideNavPanel"
import { parse } from "cookie";
import axiosInstance from "../../../Utils/axiosConfig";
import { capitalizeFirstLetter } from "../../../Utils/capitalizeFirstLettersOfString";
import { formatAmount } from "../../../Utils/formatAmount";
import ButtonFull from "../../../Components/buttons/ButtonFull";
import { calculateTotalHours } from "../../../Utils/getHoursDifferenceFromDateTime";
import ButtonGhost from "../../../Components/buttons/ButtonGhost";
import Cookies from "js-cookie";
import { storeProductShowcaseAction } from "../../../requests/showcase/showcase.request";
import { useRouter } from "next/router";

interface IStoreProductFeaturePageProps {
    product: any;
    rate: any
}

const store = ({product, rate}: IStoreProductFeaturePageProps) => {
    const router = useRouter();
    const [featuredDetails, setFeaturedDetails] = useState({
        featured_start_date: '',
        featured_end_date: '',
    });
    const [totalHours, setTotalHours] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    let vendorId: string = '';

    if(typeof window !== 'undefined') {
        injectStyle();
        vendorId = JSON.parse(Cookies.get('user')!).vendor;
    }

    const handleChange = (e: any) => {
        setFeaturedDetails({
            ...featuredDetails,
            [e.target.name]: e.target.value
        });
    }

    const getFeaturedHours = () => {
        if(!featuredDetails.featured_start_date || !featuredDetails.featured_end_date) {
            toast.error('Fill all inputs');
            return;
        }

        let hours = calculateTotalHours(
            featuredDetails.featured_start_date,
            featuredDetails.featured_end_date,
        )

        setTotalHours(hours ?? 0);
    }

    const storeProductFeature = async () => {
        if(!totalHours) return toast.error('Please fill all inputs!');

        setIsLoading(true);
        await storeProductShowcaseAction({
            ...featuredDetails,
            product_id: product.id,
            vendor_id: vendorId,
            featured_duration_in_hours: totalHours,
        })
        .then((response) => {
            if(response.status === 201) {
                router.push(response.data.data.pay_stack_checkout_url);
            }
        })
        .catch(error => {
            toast.error(error?.response?.data?.message || 'Error! Try again later');
        })
        .finally(() => setIsLoading(false));
    }

    console.log({featuredDetails})

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        <ToastContainer />
        <div className="flex flex-row w-[95%] mx-auto mt-8 relative mb-10">
            <VendorSideNavPanel />
            <div className="flex flex-col w-[80%] absolute right-0 left-[21%]">
                <div className='flex flex-row my-4 justify-between'>
                    <h2 className="text-2xl font-bold my-auto text-slate-700 mb-4">Showcase: {capitalizeFirstLetter(product.product_name)}</h2>
                    
                    <div className="w-[20%] h-14 hidden lg:flex">
                        <ButtonFull
                            action="Showcase"
                            loading={isLoading}                        
                            onClick={storeProductFeature}
                        />
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-6 lg:grid lg:grid-cols-2">
                    <div className="flex flex-col text-gray-700">

                        <div className='flex flex-row bg-white gap-10 px-4 py-6'>
                            <div className='flex flex-col bg-gray-100 rounded-md px-4 py-3'>
                                <label className="text-sm font-semibold">Start Date And Time:</label>
                                <input 
                                    type="datetime-local"
                                    name="featured_start_date"
                                    value={featuredDetails.featured_start_date}
                                    onChange={handleChange}
                                    className="bg-transparent"
                                />
                            </div>
                            
                        </div>

                        <div className='flex flex-row bg-white px-4 py-6 mt-4 relative'>
                            <div className='flex flex-col bg-gray-100 rounded-md px-4 py-3'>
                                <label className="text-sm font-semibold">End Date And Time:</label>
                                <input 
                                    type="datetime-local"
                                    name="featured_end_date"
                                    value={featuredDetails.featured_end_date}
                                    onChange={handleChange}
                                    className="bg-transparent"
                                />
                            </div>
                            <div className="w-[10%] absolute right-20 bottom-4 h-10">
                                <ButtonGhost
                                    action="Get Amount"
                                    onClick={getFeaturedHours}
                                />
                            </div>
                        </div>

                        
                    </div>

                    <div className="flex flex-col text-gray-700 bg-white px-4 pt-4">
                        <p className="text-sm mb-4">Show Your product to more customers</p>
                        <p className="text-sm">
                            Yor product will be featured in the product categories it belongs to at the time of payment.<br/> 
                            Different Product categories incur different rates
                        </p>
                        <span className=" font-semibold my-3">Rate</span>
                        {
                            rate?.featured_categories && rate?.featured_categories?.length > 0 && rate?.featured_categories?.map((category_rate: any) => (
                                <div className="flex flex-row gap-2 px-4 mb-2">
                                    <p>{category_rate.name}</p>
                                    <p>{category_rate.amount}</p>
                                </div>
                            ))
                        }
                        <div className="flex flex-row gap-2 mt-3 font-semibold">
                            <p>Rate Total:</p>
                            <p>{rate.featuredRatePerHour}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row justify-center text-lg mt-4 font-semibold align-middle py-6 bg-white">
                    <p className="mr-2">Amount:</p>
                    <p className="text-orange-500">{formatAmount(rate.featuredRatePerHour * product?.product_price * totalHours)}</p>
                </div>

                <div className="w-[40%] lg:w-[30%] mx-auto my-6 h-14 lg:hidden">
                    <ButtonFull
                        action="Showcase"
                        loading={isLoading}                        
                        onClick={storeProductFeature}
                    />
                </div>
            </div>
        </div>
    </div>
  )
}

export default store


export async function getServerSideProps(context: any) {
    const { product_id } = context.query;
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;

    try {
        const getProductShowcaseRate = await axiosInstance.get('/api/featured/product/rate?product_id=' + product_id, {
            headers: {
                Authorization: token,
                team: user?.vendor
            }
        });

        const [myProductRateResult] = await Promise.allSettled([
            getProductShowcaseRate
        ]);

        const myProductShowcaseRate = myProductRateResult.status === 'fulfilled' ? myProductRateResult?.value?.data : [];
       
        return {
            props: {
                rate: myProductShowcaseRate.data ?? [],
                product: myProductShowcaseRate.data?.product
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
                rate: {},
                product: {}
            }
        }
    }
}