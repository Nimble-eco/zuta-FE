import { useState } from "react";
import axiosInstance from "../../../Utils/axiosConfig";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2 } from "lucide-react";
import ExploreVendorCard from "../../../Components/cards/ExploreVendorCard";

interface IVendorResultsTabProps {
    search_string: string;
    vendors: any[];
}

const VendorResultsTab = ({search_string, vendors}: IVendorResultsTabProps) => {
    const [vendorsData, setVendorsData] = useState(vendors);
    const [page, setPage] = useState(1);
    const [moreVendors, setMoreVendors] = useState(vendors?.length > 0 ? true : false);

    const loadMoreData = async () => {
        await axiosInstance.post('/api/open-order/search/index', {
            search: search_string,
            pagination: page + 1
        })
        .then((response) => {
            if(response.data.data) {
                setVendorsData(vendorsData.concat(response.data.data));
                setPage(page + 1);
            }
            else setMoreVendors(false);
        })
    };

  return (
    <div className="w-full">
        <InfiniteScroll
            dataLength={vendorsData?.length}
            next={loadMoreData}
            hasMore={moreVendors}
            loader={<Loader2 className="h-8 w-8 mx-auto mt-8 text-orange-500 animate-spin" />}
            className="flex flex-col gap-6 w-full"
        >
            {
                vendorsData?.length > 0 ? vendorsData?.map(vendor => (
                    <ExploreVendorCard
                        key={vendor?.id}
                        id={vendor.id}
                        name={vendor.vendor_name}
                        username={`${vendor?.vendor_city} - ${vendor?.vendor_state}`}
                        image={vendor?.user?.picture}
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

export default VendorResultsTab