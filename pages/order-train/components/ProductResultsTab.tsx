import { useState } from "react";
import ExploreItemCard from "../../../Components/cards/ExploreItemCard";
import axiosInstance from "../../../Utils/axiosConfig";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2, Search } from "lucide-react";

interface IProductResultsTabProps {
    search_string?: string;
    products: any[];
}

const ProductResultsTab = ({search_string, products}: IProductResultsTabProps) => {
    const [productsData, setProductsData] = useState(products);
    const [page, setPage] = useState(1);
    const [moreProducts, setMoreProducts] = useState(products?.length > 0 ? true : false);

    const loadMoreData = async () => {
        await axiosInstance.post('/api/public/product/search/index', {
            search: search_string,
            pagination: page + 1
        })
        .then((response) => {
            if(response.data.data) {
                setProductsData(productsData.concat(response.data.data));
                setPage(page + 1);
            }
            else setMoreProducts(false);
        })
    };

  return (
    <div className="w-full">
        <InfiniteScroll
            dataLength={productsData?.length}
            next={loadMoreData}
            hasMore={moreProducts}
            loader={<Loader2 className="h-8 w-8 mx-auto mt-8 text-orange-500 animate-spin" />}
            className="flex flex-col gap-6"
        >
            {
                productsData?.length > 0 ? productsData?.map((product) => (
                    <ExploreItemCard
                        key={product?.id}
                        id={product?.id}
                        name={product?.product_name}
                        message={product?.product_description}
                        banner_image={product?.vendor?.user?.picture}
                        images={product?.product_images}

                    />
                )) : 
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                        <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <div className="text-center">
                        <p className="text-base font-semibold text-slate-600">
                            No results for &ldquo;{search_string}&rdquo;
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                            Try a different keyword or check your spelling
                        </p>
                    </div>
                </div>
            }
        </InfiniteScroll>
    </div>
  )
}

export default ProductResultsTab