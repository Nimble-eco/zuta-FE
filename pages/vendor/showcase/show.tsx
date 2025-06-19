import { parse } from "cookie";
import axiosInstance from "../../../Utils/axiosConfig";
import VendorSideNavPanel from "../../../Components/vendor/layout/VendorSideNavPanel";
import { getDateAndTimeFromISODate } from "../../../Utils/convertIsoDateToDateString";
import { calculateTotalHours } from "../../../Utils/getHoursDifferenceFromDateTime";
import ButtonFull from "../../../Components/buttons/ButtonFull";
import { activateProductShowcaseAction, deactivateProductShowcaseAction, reactivateProductShowcaseAction, resumeProductShowcaseAction } from "../../../requests/showcase/showcase.request";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { toast } from 'react-toastify'
import { capitalizeFirstLetter } from "../../../Utils/capitalizeFirstLettersOfString";
import VendorNavBar from "../../../Components/vendor/layout/VendorNavBar";

interface IShowFeaturedProductPageProps {
  featuredProduct: any;
  mostViewedInCategories: any[]
}

const show = ({featuredProduct, mostViewedInCategories}: IShowFeaturedProductPageProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  let vendorId: string = '';

  if(typeof window !== 'undefined') {
    vendorId = JSON.parse(Cookies.get('user')!).vendor;
  }

  const getElapsedTime = () => {
    const elapsedHours = calculateTotalHours(featuredProduct?.featured_start_date, new Date(Date.now()).toISOString());
    return featuredProduct.featured_duration_in_hours - elapsedHours;
  }

  const activateProductFeature = async () => {
    setIsLoading(true);
    await activateProductShowcaseAction(featuredProduct?.id, vendorId)
    .then((response) => {
        if(response.status === 202) {
            router.push(response.data.data.pay_stack_checkout_url);
        }
    })
    .catch(error => {
        toast.error(error?.response?.data?.message || 'Error! Try again later');
    })
    .finally(() => setIsLoading(false));
  }

  const reactivateProductFeature = async () => {
    setIsLoading(true);
    await reactivateProductShowcaseAction(featuredProduct?.id, vendorId)
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

  const deactivateProductFeature = async () => {
    setIsLoading(true);
    await deactivateProductShowcaseAction(featuredProduct?.id, vendorId)
    .then((response) => {
      if(response.status === 202) {
        router.push(response.data.data.pay_stack_checkout_url);
      }
    })
    .catch(error => {
        toast.error(error?.response?.data?.message || 'Error! Try again later');
    })
    .finally(() => setIsLoading(false));
  }

  const resumeProductFeature = async () => {
    setIsLoading(true);
    await resumeProductShowcaseAction(featuredProduct?.id, vendorId)
    .then((response) => {
      if(response.status === 202) {
        return toast.success('Showcase resumed');
      }
    })
    .catch(error => {
        toast.error(error?.response?.data?.message || 'Error! Try again later');
    })
    .finally(() => setIsLoading(false));
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-auto">
      <div className="flex flex-row w-full mx-auto relative">
        <VendorSideNavPanel />
        <div className="min-h-screen bg-gray-100 flex flex-col w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%] rounded-md !px-2 lg:!px-4">
          <VendorNavBar />
          <div className="flex flex-row gap-4 flex-wrap">
            <div className="bg-white rounded-md shadow-md flex flex-col gap-1 px-4 py-2">
              <p className="text-lg font-semibold text-orange-600">Total Views before</p>
              <p className="text-slate font-medium">4</p>
            </div>

            <div className="bg-white rounded-md shadow-md flex flex-col gap-1 px-4 py-2">
              <p className="text-lg font-semibold text-orange-600">Total Views After</p>
              <p className="text-slate font-medium">9</p>
            </div>
          </div>

          <div className='flex flex-col'>
            <div className="flex flex-row justify-between my-4">
              <h2 className="!text-lg !font-medium text-slate my-auto">Showcase</h2>
              {
                featuredProduct?.status === 'active' ?
                  <div className="h-12 w-[15%]">
                    <ButtonFull
                      action="Pause"
                      onClick={deactivateProductFeature}
                    />
                  </div> : 
                featuredProduct?.status === 'inactive' && !featuredProduct.deactivation_date ?
                  <div className="h-12 w-[15%]">
                    <ButtonFull
                      action="Activate"
                      onClick={activateProductFeature}
                    />
                  </div> : 
                featuredProduct?.status === 'inactive' && 
                new Date(featuredProduct.deactivation_date) > new Date(featuredProduct?.featured_start_date) ?
                  <div className="h-12 w-[15%]">
                    <ButtonFull
                      action="Resume"
                      onClick={resumeProductFeature}
                    />
                  </div> : 
                featuredProduct?.status === 'completed' &&
                <div className="h-12 w-[15%]">
                  <ButtonFull
                    action="Reactivate"
                    loading={isLoading}
                    onClick={reactivateProductFeature}
                  />
                </div>
              }
             
            </div>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
              <div className="flex flex-col px-4 py-5 bg-white">
                <p className="text-lg font-medium">{capitalizeFirstLetter(featuredProduct.product_name)}</p>
                <p className="text-sm">{featuredProduct.product?.product_description}</p>
                <div className="flex flex-col gap-2 mt-3">
                  <p className="font-medium">Featured In:</p>
                  {
                    featuredProduct?.product_categories?.map((category: string) => (
                      <p key={category}>{category}</p>
                    ))
                  }
                </div>
              </div>

              <div className="flex flex-col px-4 py-5 gap-2 bg-white">
                <div className="flex flex-row gap-3">
                  <p className="">Status</p>
                  <p className="font-medium">{featuredProduct.status}</p>
                </div>
                <div className="flex flex-row gap-3">
                  <p className="">Start Date</p>
                  <p className="font-medium">{new Date(featuredProduct.featured_start_date).toDateString()}</p>
                </div>
                <div className="flex flex-row gap-3">
                  <p className="">End Date</p>
                  <p className="font-medium">{new Date(featuredProduct.featured_end_date).toDateString()}</p>
                </div>
                <div className="flex flex-row gap-3">
                  <p className="">Duration</p>
                  <p className="font-medium">{featuredProduct.featured_duration_in_hours}</p>
                </div>
                <div className="flex flex-row gap-3">
                  <p className="">Time Left</p>
                  <p className="font-medium">
                    {
                      new Date(featuredProduct.featured_start_date) < new Date(Date.now()) &&  
                      new Date(featuredProduct.featured_end_date) > new Date(Date.now()) ? 
                        getElapsedTime() :  
                      new Date(featuredProduct.featured_start_date) < new Date(Date.now()) &&
                      new Date(featuredProduct.featured_end_date) < new Date(Date.now()) ?
                        0 :
                      featuredProduct.featured_duration_in_hours
                    }
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
        </div>
    </div>
  )
}

export default show

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  const cookies = parse(context.req.headers.cookie || ''); 
  const user = JSON.parse(cookies.user || 'null');
  const token = user?.access_token;

  try {
    const getMyFeaturedProduct = await axiosInstance.get('/api/featured/product/show?id=' + id, {
      headers: {
        Authorization: token,
        team: user?.vendor
      }
    });

    const featuredProduct = getMyFeaturedProduct.data?.data.featured;
    const mostViewedInCategories = getMyFeaturedProduct.data?.data.most_viewed_products_in_categories;

    return {
      props: {
        featuredProduct,
        mostViewedInCategories
      }
    }
  } catch (error: any) {
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
        props: {featuredProduct: {}, mostViewedInCategory: []}
      }
  }
}