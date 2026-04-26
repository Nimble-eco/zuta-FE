import { useState } from "react";
import ExploreTrainCard from "../../../Components/cards/ExploreTrainCard";
import axiosInstance from "../../../Utils/axiosConfig";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2, Search } from "lucide-react";
import Cookies from "js-cookie";

interface ITrainResultsTabProps {
    search_string?: string;
    orders: any[];
}

const TrainResultsTab = ({search_string, orders}: ITrainResultsTabProps) => {
    const [ordersData, setOrdersData] = useState(orders);
    const [page, setPage] = useState(1);
    const [moreOrders, setMoreOrders] = useState(orders?.length > 0 ? true : false);
    let token ='';

    if(typeof window !== 'undefined') {
        token = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null; 
    }

    const loadMoreData = async () => {
        await axiosInstance.post('/api/open-order/search/index', {
            search: search_string,
            pagination: page + 1
        }, { headers: {Authorization: token}})
        .then((response) => {
            if(response.data.data) {
                setOrdersData(ordersData.concat(response.data?.data?.data));
                setPage(page + 1);
                if(response?.data?.data?.meta?.last_page <= page) setMoreOrders(false);
            }
            else setMoreOrders(false);
        })
    };

  return (
    <div className="w-full">
        <InfiniteScroll
            dataLength={ordersData?.length}
            next={loadMoreData}
            hasMore={moreOrders}
            loader={<Loader2 className="h-8 w-8 mx-auto mt-8 text-orange-500 animate-spin" />}
            className="flex flex-col gap-6"
        >
            {
                ordersData?.length > 0 ? ordersData?.map((order) => (
                    <ExploreTrainCard
                        key={order?.id}
                        id={order?.id}
                        name={order?.product?.product_name}
                        username={order?.community?.title ?? order?.creator?.name}
                        message={order?.product?.product_description}
                        banner_image={order?.community?.banner_image ?? order?.creator?.picture}
                        images={order?.product?.product_images}

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

export default TrainResultsTab