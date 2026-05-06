import { parse } from "cookie";
import axiosInstance from "../../../Utils/axiosConfig";
import { calculateTotalHours } from "../../../Utils/getHoursDifferenceFromDateTime";
import ButtonFull from "../../../Components/buttons/ButtonFull";
import { activateProductShowcaseAction, deactivateProductShowcaseAction, reactivateShowcaseByAdminAction, resumeProductShowcaseAction } from "../../../requests/showcase/showcase.request";
import { useState } from "react";
import { useRouter } from "next/router";
import { capitalizeFirstLetter } from "../../../Utils/capitalizeFirstLettersOfString";
import AdminSideNavPanel from "../../../Components/admin/layout/AdminSideNav";
import { toast } from "react-toastify";
import AdminNavBar from "../../../Components/admin/layout/AdminNavBar";

interface IShowFeaturedProductPageProps {
  featuredProduct: any;
  mostViewedInCategories: any[]
}

const show = ({featuredProduct}: IShowFeaturedProductPageProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const getElapsedTime = () => {
    const elapsedHours = calculateTotalHours(featuredProduct?.featured_start_date, new Date(Date.now()).toISOString());
    return featuredProduct.featured_duration_in_hours - elapsedHours;
  }

  const activateProductFeature = async () => {
    setIsLoading(true);
    await activateProductShowcaseAction(featuredProduct?.id)
    .then((response: any) => {
        if(response.status === 202) {
          toast.success(response?.message || 'Feature activated successfully');
          setTimeout(()=>router.reload(), 1200);
        }
    })
    .catch(error => {
        toast.error(error?.response?.data?.message || 'Error! Try again later');
    })
    .finally(() => setIsLoading(false));
  }

  const reactivateProductFeature = async () => {
    setIsLoading(true);
    await reactivateShowcaseByAdminAction(featuredProduct?.id)
    .then((response) => {
      if(response.status === 201) {
        toast.success('Showcase active');
      }
    })
    .catch(error => {
      toast.error(error?.response?.data?.message || 'Error! Try again later');
    })
    .finally(() => setIsLoading(false));
  }

  const deactivateProductFeature = async () => {
    setIsLoading(true);
    await deactivateProductShowcaseAction(featuredProduct?.id)
    .then((response: any) => {
      if(response.status === 202) {
        toast.success(response?.message || 'Action successfully');
        setTimeout(()=>router.reload(), 1200);
      }
    })
    .catch(error => {
        toast.error(error?.response?.data?.message || 'Error! Try again later');
    })
    .finally(() => setIsLoading(false));
  }

  const resumeProductFeature = async () => {
    setIsLoading(true);
    await resumeProductShowcaseAction(featuredProduct?.id)
    .then((response: any) => {
      if(response.status === 202) {
        toast.success(response?.message || 'Action successfully');
        setTimeout(()=>router.reload(), 1200);
      }
    })
    .catch(error => {
        toast.error(error?.response?.data?.message || 'Error! Try again later');
    })
    .finally(() => setIsLoading(false));
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-auto">
      <div className="flex flex-row w-[95%] mx-auto relative mb-10">
        <AdminSideNavPanel />
        <div className="min-h-screen bg-gray-100 flex flex-col w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%] rounded-md !px-2 lg:!px-0">
          <AdminNavBar />
          
          <div className='flex flex-col'>
            <div className="flex flex-row justify-between my-4">
              <h2 className="!text-lg !font-medium text-slate my-auto">Showcase</h2>
              {
                featuredProduct?.status === 'active' ?
                  <div className="h-12 w-[15%]">
                    <ButtonFull
                      action="Pause"
                      loading={isLoading}
                      onClick={deactivateProductFeature}
                    />
                  </div> : 
                featuredProduct?.status === 'inactive' && !featuredProduct.deactivation_date ?
                  <div className="h-12 w-[15%]">
                    <ButtonFull
                      action="Activate"
                      loading={isLoading}
                      onClick={activateProductFeature}
                    />
                  </div> : 
                featuredProduct?.status === 'inactive' && 
                new Date(featuredProduct.deactivation_date) < new Date(featuredProduct?.featured_end_date) ?
                  <div className="h-12 w-[15%]">
                    <ButtonFull
                      action="Resume"
                      loading={isLoading}
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
                <p className="text-sm line-clamp-6" dangerouslySetInnerHTML={{__html: featuredProduct.product?.product_description}} />
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
                  <p className="font-medium">{Number(featuredProduct.featured_duration_in_hours)?.toFixed(0)}</p>
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
                      featuredProduct.featured_duration_in_hours?.toFixed(2)
                    } hrs
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
        Authorization: token
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