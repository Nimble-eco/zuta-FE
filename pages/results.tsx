import { useEffect, useRef, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import Header from "../Components/Header";
import ProductComponent from "../Components/ProductComponent"
import ResultsPageSideNavPanel from "../Components/navigation/SideNavPanel";
import { productsDummyData } from "../data/products";
import { sendAxiosRequest } from "../Utils/sendAxiosRequest";
import HorizontalSlider from "../Components/lists/HorizontalSlider";
import { openOrderProductsDummyData } from "../data/openOrderProducts";
import FeaturedProductCard from "../Components/cards/FeaturedProductCard";
import BottomDrawer from "../Components/drawer/BottomDrawer";
import { MdOutlineFilterList } from "react-icons/md";

interface IResultsPageProps {
    products: any[];
    openOrderProducts: any[];
    featuredProducts: any[];
}

function results({products, openOrderProducts, featuredProducts}: IResultsPageProps) {
    const [data, setData] = useState(products?.slice(0, 6));
    const [featuredProductsList, setFeaturedProductsList] = useState(products?.slice(0, 1));
    const [sortType, setSortType] = useState('location')
    const cartRef = useRef<any>({});
    const [page, setPage] = useState(1);
    const [showMobileFilterDrawer, setShowMobileFilterDrawer] = useState<boolean>(false);

    const loadMoreData = () => {
        console.log('loading more data');
        setTimeout(() => setData(data.concat(data)), 3000);
    };

    const loadFeaturedProductsData = () => {
        console.log('loading more data');
        setTimeout(() => setFeaturedProductsList(featuredProductsList.concat(data.slice(0,1))), 3000);
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
                            dataLength={data?.length}
                            next={loadFeaturedProductsData}
                            hasMore={true}
                            loader={<h4>Loading...</h4>}
                            endMessage={
                                <p style={{ textAlign: 'center' }}>
                                    End of list
                                </p>
                            }
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
                    
                    <h3 className="text-lg font-bold mb-4 pl-4">RESULTS</h3>
                    <div className="">
                        <InfiniteScroll
                            dataLength={data?.length}
                            next={loadMoreData}
                            hasMore={true}
                            loader={<h4>Loading...</h4>}
                            endMessage={
                                <p style={{ textAlign: 'center' }}>
                                    End of list
                                </p>
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
        // const res = await sendAxiosRequest(
        //     `/api/products/search/${search}`,
        //     "get",
        //     {},
        //     "",
        //     ''
        // )
        return {
            props: {
                products: productsDummyData,
                openOrderProducts: openOrderProductsDummyData
            },
        }
    }
    catch(err) {
        return {
            props: {
                products: [],
                openOrderProducts: [],
            },
        }
    }
}