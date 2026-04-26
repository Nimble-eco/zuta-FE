import { useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast} from "react-toastify";
import Header from "../Components/Header";
import ProductComponent from "../Components/ProductComponent"
import ResultsPageSideNavPanel from "../Components/navigation/SideNavPanel";
import HorizontalSlider from "../Components/lists/HorizontalSlider";
import FeaturedProductCard from "../Components/cards/FeaturedProductCard";
import { MdOutlineFilterList } from "react-icons/md";
import axiosInstance from "../Utils/axiosConfig";
import { useRouter } from "next/router";
import { filterPublicProductsByPriceAction, filterPublicProductsByRatingAction } from "../requests/publicProducts/public-products.request";
import { Loader2, SearchX, SlidersHorizontal, X } from "lucide-react";

interface IResultsPageProps {
    products: any[];
    openOrderProducts: any[];
    featuredProducts: any[];
}

function results({products, openOrderProducts, featuredProducts}: IResultsPageProps) {
    const router = useRouter();
    const [featuredProductsList, setFeaturedProductsList] = useState(featuredProducts);
    const { search } = router.query;

    // States
    const [data, setData] = useState(products || []);
    const [featuredList, setFeaturedList] = useState(featuredProducts || []);
    const [productPage, setProductPage] = useState(1);
    const [featuredPage, setFeaturedPage] = useState(1);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const [hasMoreFeatures, setHasMoreFeatures] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        setData(products);
        setFeaturedList(featuredProducts);
        setProductPage(1);
        setFeaturedPage(1);
    }, [products, featuredProducts, search]);

    const loadMoreProducts = async () => {
        try {
            const res = await axiosInstance.post('/api/public/product/search/index', {
                search,
                pagination: productPage + 1
            });
            const newProducts = res?.data?.data;
            if (newProducts?.length > 0) {
                setData((prev: any) => [...prev, ...newProducts]);
                setProductPage(prev => prev + 1);
            } else {
                setHasMoreProducts(false);
            }
        } catch (err) {
            setHasMoreProducts(false);
        }
    };

    const loadFeaturedProductsData = async () => {
        await axiosInstance.post('/api/public/product/search/index', {
            search: search,
            pagination: featuredPage + 1
        })
        .then((response) => {
            if(response?.data?.data) {
                setFeaturedProductsList(featuredProductsList.concat(response.data.data));
                setFeaturedPage(prev => prev + 1);
            }
            else setHasMoreFeatures(false);
        })
    };

    const handleFilter = async (action: Function, params: any) => {
        setIsFiltering(true);
        try {
            const response = await action({ ...params, search });
            if (response.status === 200) {
                setData(response.data?.data?.data || response.data?.data);
                toast.success('Results updated');
            } else if (response.status === 204) {
                setData([]);
            }
        } catch (error) {
            toast.error('Filter failed');
        } finally {
            setIsFiltering(false);
            setShowMobileFilters(false);
        }
    };

    const sortData = (direction: string) => {
        const sorted = [...data].sort((a, b) => 
            direction === 'asc' ? a.product_price - b.product_price : b.product_price - a.product_price
        );
        setData(sorted);
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <Header />

            {/* Sub-Header / Breadcrumbs */}
            <div className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-10 shadow-sm">
                <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Search Results</p>
                        <h1 className="text-xl font-semibold text-slate-800 italic">"{search}"</h1>
                        <p className="text-sm text-slate-400">{data?.length} items found</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setShowMobileFilters(true)}
                            className="md:hidden flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            <SlidersHorizontal size={16} /> Filters
                        </button>
                        
                        <div className="relative">
                            <select 
                                onChange={(e) => sortData(e.target.value)}
                                className="appearance-none bg-slate-100 border-none rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer"
                            >
                                <option value="">Sort by: Relevance</option>
                                <option value="asc">Price: Low to High</option>
                                <option value="desc">Price: High to Low</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <MdOutlineFilterList />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-6 p-4 lg:p-6">
                
                {/* Desktop Sidebar */}
                <aside className="hidden md:block w-1/4 space-y-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <ResultsPageSideNavPanel 
                            filterByPrice={(s:any, e:any) => handleFilter(filterPublicProductsByPriceAction, {start_price: s, end_price: e})}
                            filterByRating={(r:any) => handleFilter(filterPublicProductsByRatingAction, {rating: r})}
                        />
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-800 ml-2">Featured Deals</h3>
                        <InfiniteScroll
                            dataLength={featuredList.length}
                            next={loadFeaturedProductsData}
                            hasMore={hasMoreFeatures}
                            loader={<Loader2 className="animate-spin mx-auto text-orange-500" />}
                            className="space-y-4"
                        >
                            {featuredList?.map((p: any, i: number) => (
                                <FeaturedProductCard key={`${p.id}-${i}`} product={p} />
                            ))}
                        </InfiniteScroll>
                    </div>
                </aside>

                {/* Main Content Area */}
                <section className="flex-1">
                    {/* Horizontal Slider for related orders */}
                    {openOrderProducts?.length > 0 && (
                        <div className="mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                            <HorizontalSlider 
                                list={openOrderProducts} 
                                list_name="Ongoing Group Orders" 
                            />
                        </div>
                    )}

                    {isFiltering ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-2xl" />
                            ))}
                        </div>
                    ) : data?.length > 0 ? (
                        <InfiniteScroll
                            dataLength={data.length}
                            next={loadMoreProducts}
                            hasMore={hasMoreProducts}
                            loader={<div className="col-span-full py-10 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div>}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
                        >
                            {data?.map((product: any, index: number) => (
                                <ProductComponent key={index} product={product} />
                            ))}
                        </InfiniteScroll>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <SearchX size={64} strokeWidth={1} className="mb-4" />
                            <h2 className="text-xl font-semibold text-slate-800">No products found</h2>
                            <p>Try adjusting your filters or search terms.</p>
                        </div>
                    )}
                </section>
            </div>

            {/* Mobile Filter Drawer (Simplified) */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold">Filters</h2>
                            <X className="cursor-pointer" onClick={() => setShowMobileFilters(false)} />
                        </div>
                        <ResultsPageSideNavPanel 
                            filterByPrice={(s:any, e:any) => handleFilter(filterPublicProductsByPriceAction, {start_price: s, end_price: e})}
                            filterByRating={(r:any) => handleFilter(filterPublicProductsByRatingAction, {rating: r})}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

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