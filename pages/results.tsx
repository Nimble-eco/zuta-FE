import { useEffect, useRef, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import Header from "../Components/Header";
import ProductComponent from "../Components/ProductComponent"
import ResultsPageSideNavPanel from "../Components/navigation/SideNavPanel";
import HorizontalSlider from "../Components/lists/HorizontalSlider";
import FeaturedProductCard from "../Components/cards/FeaturedProductCard";
import BottomDrawer from "../Components/drawer/BottomDrawer";
import { MdOutlineFilterList } from "react-icons/md";
import axiosInstance from "../Utils/axiosConfig";
import { useRouter } from "next/router";

interface IResultsPageProps {
    products: any[];
    openOrderProducts: any[];
    featuredProducts: any[];
}

function results({products, openOrderProducts, featuredProducts}: IResultsPageProps) {
    const router = useRouter();
    const [data, setData] = useState(products);
    const [featuredProductsList, setFeaturedProductsList] = useState(featuredProducts);
    const [sortType, setSortType] = useState('location')
    const cartRef = useRef<any>({});
    const [page, setPage] = useState(1);
    const [showMobileFilterDrawer, setShowMobileFilterDrawer] = useState<boolean>(false);
    const { search } = router.query;
    const [moreProducts, setMoreProducts] = useState(true);
    const [moreFeatures, setMoreFeatures] = useState(true);

    const loadMoreData = async () => {
        
        await axiosInstance.post('/api/public/product/search/index', {
            search: search,
            pagination: page + 1
        })
        .then((response) => {
            console.log({response})
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

    // useEffect(() => {
    //     const sortArray = (type: any) => {
    //         const types: any = {
    //             price: 'price',
    //             location: 'location',
    //             date: 'date'
    //         };
    //         const sortProperty = types[type];
    //         const sorted = [...props.products].sort((a, b) => b[sortProperty] - a[sortProperty]);
    //         setData(sorted);
    //     };
    //     sortArray(sortType);
    // }, [sortType]);

    return (
        <div
            className="flex flex-col w-full bg-white min-h-screen relative"
        >
            <Header />

            { showMobileFilterDrawer && <BottomDrawer /> }

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
                    <span
                        className="text-gray-600 text-sm font-semibold"
                    >
                        Sort By:
                    </span>
                    <select 
                        name="filter" 
                        onChange={(e) => setSortType(e.target.value)}
                        className="cursor-pointer text-gray-600 min-w-fit outline-none bg-transparent"
                    >
                        <option 
                            value="date"
                            className="py-3 border-b-2 border-solid border-gray-400"
                        >
                            Date added
                        </option>
                        <option 
                            value="location"
                            className="py-3 border-b-2 border-solid border-gray-400"
                        >
                            Location
                        </option>
                        <option 
                            value="price"
                            className="py-3 border-b-2 border-solid border-gray-400"
                        >
                            low to high price
                        </option>
                    </select>
                </div>
            </div>

            <div className="flex flex-row relative">
                <div className="hidden md:flex md:flex-col md:w-[25%] px-5">
                    <ResultsPageSideNavPanel />
                    <div className="md:w-full lg:w-[95%] mx-auto">
                        <InfiniteScroll
                            dataLength={featuredProductsList?.length}
                            next={loadFeaturedProductsData}
                            hasMore={moreFeatures}
                            loader={<h4 className="block text-center">...</h4>}
                            className='flex flex-col w-full gap-y-48'
                        >
                            {
                                featuredProductsList?.map((product: any, index: number) => (
                                    <FeaturedProductCard 
                                        key={`${product.id}-${index}`}
                                        product={product}
                                    />
                                ))
                            }

                        </InfiniteScroll>
                    </div>
                </div>

                <div className="flex flex-col md:w-[75%] mt-16">
                    { openOrderProducts?.length > 0 && <div className='mt-10 xs:max-w-[18rem] sm:!max-w-[24rem] bmd:!max-w-xl md:!max-w-screen-md lg:!min-w-full'>
                        <HorizontalSlider 
                            list={openOrderProducts}
                            list_name='Open Orders Results'
                        />
                    </div>}
                    
                    <h3 className="text-lg font-bold mb-4 pl-4">Product Results</h3>
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
                            className='flex flex-col gap-y-10 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4 md:w-full px-5'
                        >
                            {data.map((product: any, index: number) => (
                                <ProductComponent 
                                    key={index} 
                                    product={product} 
                                />
                            ))}
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