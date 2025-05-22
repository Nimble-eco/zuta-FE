import { useState } from "react";
import ExploreTrainCard from "../../../Components/cards/ExploreTrainCard";
import axiosInstance from "../../../Utils/axiosConfig";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2 } from "lucide-react";
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

export default TrainResultsTab