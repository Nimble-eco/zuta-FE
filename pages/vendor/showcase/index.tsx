import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify'
import { injectStyle } from "react-toastify/dist/inject-style";
import ColumnTextInput from "../../../Components/inputs/ColumnTextInput";
import FilterContainer from "../../../Components/modals/containers/FilterContainer";
import VendorSideNavPanel from "../../../Components/vendor/layout/VendorSideNavPanel";
import FilterAndSearchGroup from "../../../Components/inputs/FilterAndSearchGroup";
import ButtonGhost from "../../../Components/buttons/ButtonGhost";
import MyTable from "../../../Components/tables/MyTable";
import { getDateAndTimeFromISODate } from "../../../Utils/convertIsoDateToDateString";
import PaginationBar from "../../../Components/navigation/PaginationBar";
import { parse } from "cookie";
import axiosInstance from "../../../Utils/axiosConfig";

interface IProductShowcaseIndexPageProps {
    featured_products: any
}

const index = ({featured_products}: IProductShowcaseIndexPageProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [featuredProducts, setFeaturedProducts] = useState(featured_products);
    let vendorId: string = '';
    const [filterByDetails, setFilterByDetails] = useState({
        product_id: 0,
        product_name: '',
    })
    
    if(typeof window !== 'undefined') {
        injectStyle();
        vendorId = JSON.parse(Cookies.get('user')!).vendor;
    }

    const [showFilterInput, setShowFilterInput] = useState<boolean>(false);

    const handleFilterByDetailsChange = (e: any) => {
        setFilterByDetails((prevState) => ({
            ...prevState,
            [e.target.name] : e.target.value
        }))
    }
    console.log({featuredProducts})

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        <ToastContainer />
        {
            showFilterInput && <FilterContainer 
                show={showFilterInput}
                setShow={() => setShowFilterInput(!showFilterInput)}
                onFilter={() => {}}
                children={[
                    <>
                        <ColumnTextInput 
                            label="Product ID"
                            name="product_id"
                            value={filterByDetails?.product_id}
                            placeHolder="Enter a product id here"
                            onInputChange={handleFilterByDetailsChange}
                        />

                    </>
                ]}
            />
        }

        <div className="flex flex-row w-[95%] mx-auto mt-8 relative mb-10">
            <VendorSideNavPanel />
            
            <div className="flex flex-col w-[80%] absolute right-0 left-[21%]">
                <h2 className="text-2xl font-bold text-slate-700 mb-4">Product Showcase</h2>
                <div className="flex flex-row text-sm font-semibold !text-gray-400 px-4 pt-5 bg-white">
                    <a href="#0" className="hover:!text-orange-500 mr-3">
                        All
                    </a>
                    <a href="#0" className="hover:!text-orange-500 mr-3">
                        Pending
                    </a>
                    <a href="#0" className="hover:!text-orange-500 mr-3">
                        Ongoing
                    </a>
                    <a href="#0" className="hover:!text-orange-500 mr-3">
                        Closed
                    </a>
                </div>

                <div className="flex flex-row py-3 px-4 relative bg-white justify-between">
                    <div className="w-[full]">
                        <FilterAndSearchGroup 
                            searchInputPlaceHolder="Search product name, category"
                            onSearch={() => {}}
                            onFilterButtonClick={() => setShowFilterInput(!showFilterInput)}
                            isSearching={loading}
                        />
                    </div>
                </div>

                <div className="flex flex-col pb-8 bg-white text-gray-700">
                    <MyTable
                        headings={['product_name', 'featured_amount', 'paid', 'featured_payment_confirmed', 'status', 'start_date', 'end_date']}
                        content={featuredProducts?.data?.map((featuredProduct: any) => ({
                            ...featuredProduct,
                            paid: featuredProduct.featured_paid_true ? 'Paid' : 'Not Paid',
                            payment_confirmed: featuredProduct.featured_payment_confirmed ? 'Confirmed' : 'Unconfirmed',
                            start_date: getDateAndTimeFromISODate(featuredProduct.featured_start_date),
                            end_date: getDateAndTimeFromISODate(featuredProduct.featured_end_date),
                        }))} 
                        onRowButtonClick={(order: any) => router.push('order-train/show?id='+ order.id)}
                    />
                    <PaginationBar 
                        paginator={featuredProducts?.meta}
                        paginateData={() => {}}
                    />
                </div>
            </div>
        </div>
    </div>
  )
}

export default index


export async function getServerSideProps(context: any) {
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;

    try {
        const getMyFeaturedProducts = await axiosInstance.get('/api/featured/product/me', {
            headers: {
                Authorization: token,
                team: user?.vendor
            }
        });

        const [myFeaturedProductsResult] = await Promise.allSettled([
            getMyFeaturedProducts
        ]);

        const myFeaturedProducts = myFeaturedProductsResult.status === 'fulfilled' ? myFeaturedProductsResult?.value?.data : [];
        
        return {
            props: {
                featured_products: myFeaturedProducts.data ?? {},
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
                featured_products: {},
            }
        }
    }
}