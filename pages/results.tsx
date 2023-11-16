import { useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { ToastContainer, toast} from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";
import Header from "../Components/Header";
import ProductComponent from "../Components/ProductComponent"
import ResultsPageSideNavPanel from "../Components/navigation/SideNavPanel";
import HorizontalSlider from "../Components/lists/HorizontalSlider";
import FeaturedProductCard from "../Components/cards/FeaturedProductCard";
import BottomDrawer from "../Components/drawer/BottomDrawer";
import { MdOutlineFilterList } from "react-icons/md";
import axiosInstance from "../Utils/axiosConfig";
import { useRouter } from "next/router";
import { filterPublicProductsByPriceAction, filterPublicProductsByRatingAction } from "../requests/publicProducts/public-products.request";

interface IResultsPageProps {
    products: any[];
    openOrderProducts: any[];
    featuredProducts: any[];
}

function results({products, openOrderProducts, featuredProducts}: IResultsPageProps) {
    const router = useRouter();
    const [data, setData] = useState(products);
    const [featuredProductsList, setFeaturedProductsList] = useState(featuredProducts);
    const [page, setPage] = useState(1);
    const [showMobileFilterDrawer, setShowMobileFilterDrawer] = useState<boolean>(false);
    const { search } = router.query;
    const [moreProducts, setMoreProducts] = useState(true);
    const [moreFeatures, setMoreFeatures] = useState(true);

    if (typeof window !== "undefined") injectStyle();

    const loadMoreData = async () => {
        await axiosInstance.post('/api/public/product/search/index', {
            search: search,
            pagination: page + 1
        })
        .then((response) => {
            if(response.data.data) {
                setData(data.concat(response.data.data));
                setPage(page + 1);
            }
            else setMoreProducts(false);
        })

    };

    const loadFeaturedProductsData = async () => {
        await axiosInstance.post('/api/public/product/search/index', {
            search: search,
            pagination: page + 1
        })
        .then((response) => {
            if(response.data.data) {
                setFeaturedProductsList(featuredProductsList.concat(response.data.data));
                setPage(page + 1);
            }
            else setMoreFeatures(false);
          
        })
    };

    const filterByPrice = async (start_price: number, end_price?: number) => {
        await filterPublicProductsByPriceAction({start_price, end_price, search: search as string})
        .then(response => {
            if(response.status === 200) {
                setData(response.data?.data?.data);
                toast.success('Products filtered successfully');
            }
            if(response.status === 204) {
                setData([]);
                toast.success('No Products in this range');
            }
        })
        .catch(error => {
            console.log({error});
            toast.error(error?.data?.response?.message || 'Error try again later');
        })
        .finally(() => setShowMobileFilterDrawer(false));
    }

    const filterByRating = async (rating: number) => {
        await filterPublicProductsByRatingAction({rating, search: search as string})
        .then(response => {
            if(response.status === 200) {
                setData(response.data?.data.data);
                toast.success('Products filtered successfully');
            }
            if(response.status === 204) {
                setData([]);
                toast.success('No Products in this range');
            }
        })
        .catch(error => {
            console.log({error});
            toast.error(error?.data?.response?.message || 'Error try again later');
        })
        .finally(() => setShowMobileFilterDrawer(false));
    }

    const sortResultsByPrice = (direction: string) => {
        let sortedData;
        if (direction === 'asc') sortedData = [...data].sort((a, b) => a.product_price - b.product_price);
        if (direction === 'desc') sortedData = [...data].sort((a, b) => b.product_price - a.product_price);
      
        if (sortedData) setData(sortedData);
    };

    return (
        <div
            className="flex flex-col w-full bg-white min-h-screen relative"
        >
            <Header />
            <ToastContainer />

            { showMobileFilterDrawer && <BottomDrawer 
                filterByPrice={filterByPrice}
                filterByRating={filterByRating}
            /> }

            <div className="flex flex-col md:flex-row shadow-md py-5 relative">
                <div className='flex flex-row relative'>
                    <p className="text-sm font-thin pl-4 mb-4 md:mb-0">Over {data?.length} results for tag</p>
                    <MdOutlineFilterList 
                        className="text-4xl cursor-pointer absolute right-3 md:hidden"
                        onClick={() => setShowMobileFilterDrawer(!showMobileFilterDrawer)}
                    />
                </div>
                <div
                    className="flex flex-row justify-center items-center min-w-fit bg-gray-100 rounded-xl px-3 py-2 md:absolute md:top-3 md:right-4 md:mb-10 sm:max-w-fit sm:ml-2 max-w-[80%] md:max-w-none"
                >
                    <select 
                        name="filter" 
                        onChange={(e) => sortResultsByPrice(e.target.value)}
                        className="cursor-pointer text-gray-600 min-w-fit outline-none bg-transparent"
                    >
                        <option 
                            value=""
                            className="py-3 border-b-2 border-solid border-gray-400 cursor-pointer"
                        >
                            Sort results
                        </option>
                        <option 
                            value="asc"
                            className="py-3 border-b-2 border-solid border-gray-400 cursor-pointer"
                        >
                            low to high price
                        </option>
                        <option 
                            value="desc"
                            className="py-3 border-b-2 border-solid border-gray-400 cursor-pointer"
                        >
                            high to low price
                        </option>
                    </select>
                </div>
            </div>

            <div className="flex flex-row relative w-full">
                <div className="hidden md:flex md:flex-col md:w-[25%] px-5">
                    <ResultsPageSideNavPanel 
                        filterByPrice={filterByPrice}
                        filterByRating={filterByRating}
                    />
                    <div className="md:w-full lg:w-[95%] mx-auto">
                        <InfiniteScroll
                            dataLength={featuredProductsList?.length}
                            next={loadFeaturedProductsData}
                            hasMore={moreFeatures}
                            loader={<h4 className="block text-center">...</h4>}
                            className='flex flex-col w-full gap-y-48'
                        >
                            {
                                featuredProductsList?.length > 0 && featuredProductsList?.map((product: any, index: number) => (
                                    <FeaturedProductCard 
                                        key={`${product.id}-${index}`}
                                        product={product}
                                    />
                                ))
                            }

                        </InfiniteScroll>
                    </div>
                </div>

                <div className="flex flex-col w-full md:w-[75%] mt-4 overflow-x-auto">
                    { openOrderProducts?.length > 0 && <div className='mt-10 xs:max-w-[18rem] sm:!max-w-[24rem] bmd:!max-w-xl md:!max-w-screen-md lg:!min-w-full'>
                        <HorizontalSlider 
                            list={openOrderProducts}
                            list_name='Open Orders Results'
                        />
                    </div>}
                    
                    <h3 className="text-lg font-bold mb-4 pl-12 lg:pl-6">Product Results</h3>
                    <div className="">
                        <InfiniteScroll
                            dataLength={data?.length}
                            next={loadMoreData}
                            hasMore={moreProducts}
                            loader={<h4 style={{ 
                                display: "block",
                                textAlign: 'center' 
                                }}>
                                    Loading...
                                </h4>
                            }
                            className='flex flex-col gap-y-10 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4 w-[90%] mx-auto lg:w-full px-8'
                        >
                            {data?.length > 0 ? data?.map((product: any, index: number) => (
                                <ProductComponent 
                                    key={index} 
                                    product={product} 
                                />
                            )) : <p className="text-center font-medium">No Products found</p>}
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default results

export async function getServerSideProps(context: any) {
    try{
        const search = context.query.search;

        const getProducts = await axiosInstance.post(
            `/api/public/product/search/index`,
            {search}
        );

        const getOpenOrders = await axiosInstance.post(
            '/api/open-order/search/index',
            {search}
        );

        const getFeaturedProducts = await axiosInstance.post(
            '/api/featured/product/search/index',
            {search}
        );

        const [productsResult, openOrderProductsResult, featuredProductsResult] = await Promise.allSettled([
            getProducts.data,
            getOpenOrders.data,
            getFeaturedProducts.data
        ]);

        const products = productsResult.status === 'fulfilled' && productsResult.value.data ? productsResult.value.data?.data : [];
        const openOrderProducts = openOrderProductsResult.status === 'fulfilled' && openOrderProductsResult.value.data ? openOrderProductsResult.value.data?.data : [];
        const featuredProducts = featuredProductsResult.status === 'fulfilled' && featuredProductsResult.value.data ? featuredProductsResult.value.data?.data : [];
        console.log({products, openOrderProducts, featuredProducts})

        return {
            props: {
                products,
                openOrderProducts,
                featuredProducts
            },
        }
    }
    catch(err) {
        console.log({err})
        return {
            props: {
                products: [],
                openOrderProducts: [],
                featuredProducts: []
            },
        }
    }
}