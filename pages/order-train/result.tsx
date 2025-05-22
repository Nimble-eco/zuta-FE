import { ArrowLeftCircle } from "lucide-react"
import Header from "../../Components/Header"
import { useState } from "react"
import ExploreUserCard from "../../Components/cards/ExploreUserCard";
import { useRouter } from "next/router";
import axiosInstance from "../../Utils/axiosConfig";
import { parse } from "cookie";
import ProductResultsTab from "./components/ProductResultsTab";
import ReviewResultsTab from "./components/ReviewResultsTab";
import TrainResultsTab from "./components/TrainResultsTab";
import VendorResultsTab from "./components/VendorResultsTab";
import TopResultsTab from "./components/TopResultsTab";
import { productsDummyData } from "../../data/products";
import ProductComponent from "../../Components/ProductComponent";
import UsersResultTab from "./components/UsersResultsTab";

interface IResultsPageProps {
    products: any[];
    openOrderProducts: any[];
    featuredProducts: any[];
    reviews: any[];
    vendors: any[];
    users: any[];
}

const Result = ({products, openOrderProducts, featuredProducts, reviews, vendors, users}: IResultsPageProps) => {
    const router = useRouter();
    const queryTab = router.query.tab;
    const [searchString, setSearchString] = useState(router.query.search?.toString() ?? '');
    const [filterTab, setFilterTab] = useState(queryTab ?? 'top');
    
    const search = async () => router.push(`/order-train/result?search=${searchString}`);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            search();
        }
    };

  return (
    <div className="flex flex-col w-full bg-white min-h-screen relative">
        <Header search={false} />
        <div className="flex flex-row justify-center gap-4 items-center lg:w-[50%] lg:mx-auto py-1 mb-2 text-gray-800">
            <ArrowLeftCircle className="h-7 w-7 cursor-pointer" onClick={()=>router.back()}/>
            <form>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchString}
                    onChange={(e)=>setSearchString(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-gray-200 rounded-xl border-0 outline-none px-4 py-2 lg:w-[28rem]" 
                />
            </form>
        </div>
        <div className="flex flex-row flex-wrap justify-center gap-2 items-center">
            <FilterTagCard
                title="top"
                onClick={()=>setFilterTab('top')}
                active={filterTab === 'top'}
            />
            <FilterTagCard
                title="train"
                onClick={()=>setFilterTab('train')}
                active={filterTab === 'train'}
            />
            <FilterTagCard
                title="product"
                onClick={()=>setFilterTab('products')}
                active={filterTab === 'products'}
            />
            <FilterTagCard
                title="reviews"
                onClick={()=>setFilterTab('reviews')}
                active={filterTab === 'reviews'}
            />
            <FilterTagCard
                title="vendors"
                onClick={()=>setFilterTab('vendor')}
                active={filterTab === 'vendor'}
            />
            <FilterTagCard
                title="users"
                onClick={()=>setFilterTab('users')}
                active={filterTab === 'users'}
            />
        </div>

        <div className="flex flex-row">
            <div className="hidden md:flex flex-col gap-4 md:w-[23%] px-4 justify-center items-center">
                <h5 className="font-bold text-slate-600">Featured products</h5>
                {
                    productsDummyData?.slice(0,4).map((product) => (
                        <ProductComponent
                            key={product.id}
                            product={product}
                        />
                    ))
                }
            </div>
            <div className="flex flex-col gap-6 items-center mt-8 w-full lg:w-[50%] lg:mx-auto lg:border-l lg:border-r lg:border-gray-300">
                {
                    filterTab === 'products' && (
                        <ProductResultsTab 
                            search_string={searchString}
                            products={products}
                        />
                    )
                }

                {
                    filterTab === 'reviews' && (
                        <ReviewResultsTab
                            search_string={searchString}
                            reviews={reviews}
                        />
                    )
                }

                {
                    filterTab === 'train' && (
                        <TrainResultsTab
                            search_string={searchString}
                            orders={openOrderProducts}
                        />
                    )
                }

                {
                    filterTab === 'vendor' && (
                        <VendorResultsTab
                            search_string={searchString}
                            vendors={vendors}
                        />
                    )
                }

                {
                    filterTab === 'users' && (
                        <UsersResultTab
                            search_string={searchString}
                            users={users}
                        />
                    )
                }

                {
                    filterTab === 'top' && (
                        <TopResultsTab
                            search_string={searchString}
                            orders={openOrderProducts}
                            products={products}
                            vendors={vendors}
                            reviews={reviews}
                        />
                    )
                }
            </div>
            <div className="hidden md:flex flex-col gap-4 md:w-[25%] md:mx-4 border border-gray-300 rounded-xl py-6 h-fit">
                <h5 className="font-bold text-slate-600 px-4">Who to follow</h5>
                <ExploreUserCard
                    id="1"
                    name="jemiseu"
                    image="https://via.placeholder.com/100"
                />  
                <ExploreUserCard
                    id="1"
                    name="jemiseu"
                    image="https://via.placeholder.com/100"
                />  
                <ExploreUserCard
                    id="1"
                    name="jemiseu"
                    image="https://via.placeholder.com/100"
                />  
            </div>
        </div>
    </div>
  )
}

export default Result

interface IFilterTagCarProps {
    title: string;
    onClick: any;
    active?: boolean;
}

export const FilterTagCard = ({title, onClick, active}: IFilterTagCarProps) => {
    return (
        <button 
            type="button" 
            onClick={onClick} 
            className={`text-sm capitalize ${active ? 'text-white bg-orange-700' : 'text-orange-700 bg-gray-200'} font-semibold px-4 py-1 flex justify-center items-center rounded-md shadow-md`}
        >
            {title}
        </button>
    )
}

export async function getServerSideProps(context: any) {
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;

    try{
        const search = context.query.search;

        const getProducts = await axiosInstance.post(
            `/api/public/product/search/index`,
            {search}
        );

        const searchPublicVendors = await axiosInstance.post(
            `/api/public/vendor/search/index`,
            {search},
            {headers: {Authorization: token}}
        );

        const searchUsers = await axiosInstance.post(
            `/api/public/user/search/index`,
            {search},
            {headers: {Authorization: token}}
        );

        const getOpenOrders = await axiosInstance.post(
            '/api/open-order/search/index',
            {search}
        );

        const getReviews = await axiosInstance.post(
            '/api/review/product/search/index',
            {search},
            {headers: {Authorization: token}}
        );

        const getFeaturedProducts = await axiosInstance.post(
            '/api/featured/product/search/index',
            {search}
        );

        const [productsResult, openOrderProductsResult, featuredProductsResult, reviewResults, vendorResults, usersResult] = await Promise.allSettled([
            getProducts.data,
            getOpenOrders.data,
            getFeaturedProducts.data,
            getReviews.data,
            searchPublicVendors.data,
            searchUsers.data,
        ]);

        const products = productsResult.status === 'fulfilled' && productsResult.value.data ? productsResult.value.data?.data : [];
        const openOrderProducts = openOrderProductsResult.status === 'fulfilled' && openOrderProductsResult.value.data ? openOrderProductsResult.value.data?.data : [];
        const featuredProducts = featuredProductsResult.status === 'fulfilled' && featuredProductsResult.value.data ? featuredProductsResult.value.data?.data : [];
        const reviews = reviewResults.status === 'fulfilled' && reviewResults.value.data ? reviewResults.value.data?.data : [];
        const vendors = vendorResults.status === 'fulfilled' && vendorResults.value.data ? vendorResults.value.data?.data : [];
        const users = usersResult.status === 'fulfilled' && usersResult.value.data ? usersResult.value.data?.data : [];
        
        return {
            props: {
                products,
                openOrderProducts,
                featuredProducts,
                reviews,
                vendors,
                users,
            },
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
                products: [],
                openOrderProducts: [],
                featuredProducts: [],
                reviews: [],
                vendors: [],
                users: [],
            },
        }
    }
}