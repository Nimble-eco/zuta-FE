import Header from "../../Components/Header"
import { useState } from "react";
import { sendAxiosRequest } from "../../Utils/sendAxiosRequest";
import OpenOrderProductCard from "../../Components/cards/OpenOrderProductCard";
import FilterAndSearchGroup from "../../Components/inputs/FilterAndSearchGroup";
import TextImageCard from "../../Components/cards/TextImageCard";
import { useRouter } from "next/router";

interface IOrderTrainProps {
    openOrders: any[];
    trendingOpenOrders: any[];
    topSavingsOpenOrders: any[];
    categories: any[];
    tags: any[];
    featured: any[];
    catalogues: any[];
}

const OrderTrainIndex = ({openOrders, trendingOpenOrders, topSavingsOpenOrders, categories, tags, featured, catalogues}: IOrderTrainProps) => {
    const router = useRouter();

    const searchOpenOrders = (searchStr: string) => {
        router.push(`/order-train/result?search=${searchStr}&tab=train`)
    }

  return (
    <div className="flex flex-col w-full bg-white min-h-screen relative">
        <Header search={false} />
        <div className="flex flex-col gap-8 mt-2">
            <div className="flex flex-col justify-center items-center gap-1 lg:gap-4 mx-4">
                <h1 className="text-4xl text-slate-700 font-bold">
                    Let's buy it <span className="text-orange-500">Together</span>
                </h1>
                <p className="font-medium text-slate-600 text-center">Join open 
                    <span className="text-slate-700 mx-1 !font-bold">order train</span> to enjoy 
                    <span className="text-orange-500 mx-1">wholesale discount</span> 
                    prices
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 px-4 lg:px-20">
                    <div className="w-[90%] lg:w-[60%] mx-auto">
                        <FilterAndSearchGroup
                            searchInputPlaceHolder="Search order train by product name, category, tags"
                            onSearch={searchOpenOrders}
                            onFilterButtonClick={()=>{}}
                        />
                    </div>

                    <h4 className="text-slate-800 font-bold">Trending</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {
                            trendingOpenOrders?.length > 0 && trendingOpenOrders?.map((order:any, index: number) => (
                                <OpenOrderProductCard
                                    key={`${order.name} + ${index}`}
                                    order={order} 
                                />
                            ))
                        }
                    </div>
                </div>

                <div className="flex flex-col gap-2 justify-between w-full py-8 bg-gray-100 px-4 lg:px-20">
                    <span className='text-base text-slate-800 font-bold'>
                        Categories
                    </span>
                    <div className="flex flex-row gap-4 py-4 overflow-x-scroll">
                        {
                            categories?.length > 0 && categories?.map((category: any, index: number) => (
                                <TextImageCard 
                                    key={`${category.name} ${index}`}
                                    image={category?.image}
                                    title={category.name}
                                    link={`/order-train/result?search=${category.name}&tab=train`}
                                />
                            ))
                        }
                    </div>
                </div>

                <div className="flex flex-col gap-4 px-4 lg:px-20">
                    <h4 className="text-slate-800 font-bold">Top Savings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {
                            topSavingsOpenOrders?.length > 0 && topSavingsOpenOrders?.slice(0,10).map((order:any, index: number) => (
                                <OpenOrderProductCard
                                    key={`${order.name} + ${index}`}
                                    order={order} 
                                />
                            ))
                        }
                    </div>
                </div>

                <div className="flex flex-col gap-2 justify-between w-full py-8 bg-gray-100 px-4 lg:px-20">
                    <span className='text-base text-slate-800 font-bold'>
                        Tags
                    </span>
                    <div className="flex flex-row gap-4 py-4 overflow-x-scroll">
                        {
                            tags?.length > 0 && tags?.map((tag: any, index: number) => (
                                <TextImageCard 
                                    key={`${tag.name} ${index}`}
                                    image={tag?.image}
                                    title={tag.name}
                                    link={`/order-train/result?search=${tag.name}&tab=train`}
                                />
                            ))
                        }
                    </div>
                </div>
                
                <div className="flex flex-col gap-4 mb-16 px-4 lg:px-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {
                            openOrders?.length > 0 && openOrders?.map((order:any, index: number) => (
                                <OpenOrderProductCard
                                    key={`${order.name} + ${index}`}
                                    order={order} 
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default OrderTrainIndex

export async function getServerSideProps() {
    try{
        const getOpenOrders = await sendAxiosRequest(
            '/api/open-order/index?properties=1',
            'get',
            {},
            '',
            ''
        );
        const getTrendingOpenOrders = await sendAxiosRequest(
            '/api/open-order/trending?properties=1',
            'get',
            {},
            '',
            ''
        );
        const getTopSavingsOpenOrders = await sendAxiosRequest(
            '/api/open-order/savings?properties=1',
            'get',
            {},
            '',
            ''
        );
        const getCategories = await sendAxiosRequest(
            '/api/product/category/index',
            'get',
            {},
            '',
            ''
        );
        const getTags = await sendAxiosRequest(
            '/api/product/tag/index',
            'get',
            {},
            '',
            ''
        );
        const getFeaturedProducts = await sendAxiosRequest(
            '/api/featured/product/filter/index',
            'post',
            {status: 'active'},
            '',
            ''
        );
        const getAdvertBanners = await sendAxiosRequest(
            '/api/advert/banners/filter/index',
            'post',
            {enabled: 1},
            '',
            ''
        );
  
        const [openOrdersResult, trendingOpenOrdersResult, topSavingsOpenOrdersResult, categoriesResult, tagsResult, featuredResult, bannersResult] = await Promise.allSettled([
            getOpenOrders,
            getTrendingOpenOrders,
            getTopSavingsOpenOrders,
            getCategories,
            getTags,
            getFeaturedProducts,
            getAdvertBanners
        ]);
        
        const openOrders = openOrdersResult.status === 'fulfilled' && openOrdersResult?.value ? openOrdersResult?.value?.data : [];
        const trendingOpenOrders = trendingOpenOrdersResult.status === 'fulfilled' && trendingOpenOrdersResult?.value ? trendingOpenOrdersResult?.value?.data : [];
        const topSavingsOpenOrders = topSavingsOpenOrdersResult.status === 'fulfilled' && topSavingsOpenOrdersResult?.value ? topSavingsOpenOrdersResult?.value?.data : [];
        const categories = categoriesResult.status === 'fulfilled' ? categoriesResult?.value?.data : [];
        const tags = tagsResult.status === 'fulfilled' ? tagsResult?.value?.data : [];      
        const featured = featuredResult.status === 'fulfilled' ? featuredResult?.value?.data : [];      
        const banners = bannersResult.status === 'fulfilled' ? bannersResult?.value?.data : [];      

        return {
            props: {
                openOrders: openOrders?.data ?? [],
                trendingOpenOrders: trendingOpenOrders ?? [],
                topSavingsOpenOrders: topSavingsOpenOrders?.data ?? [],
                categories: categories ?? [],
                tags: tags ?? [],
                featured: featured?.data ?? [],
                catalogues: banners?.data ??  []
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
                openOrders: [],
                trendingOpenOrders: [],
                topSavingsOpenOrders: [],
                categories: [],
                tags: [],
                featured: [],
                catalogues: []
            },
        }
    }
}