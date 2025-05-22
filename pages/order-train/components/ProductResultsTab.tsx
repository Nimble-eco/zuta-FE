import { useState } from "react";
import ExploreItemCard from "../../../Components/cards/ExploreItemCard";
import axiosInstance from "../../../Utils/axiosConfig";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2 } from "lucide-react";

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
                <div className="flex flex-col justify-center px-4 gap-4">
                    <h3 className="text-2xl font-bold text-slate-600">
                        No results for "#{search_string}"
                    </h3>
                    <p className="text-xs font-medium text-gray-500">
                        Try searching for something else
                    </p>
                </div>
            }
        </InfiniteScroll>
    </div>
  )
}

export default ProductResultsTab