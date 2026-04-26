import { useState } from "react";
import axiosInstance from "../../../Utils/axiosConfig";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2, Search } from "lucide-react";
import ExploreReviewCard from "../../../Components/cards/ExploreRevewCard";

interface IReviewsResultsTabProps {
    search_string: string;
    reviews: any[];
}

const ReviewResultsTab = ({search_string, reviews}: IReviewsResultsTabProps) => {
    const [reviewsData, setReviewsData] = useState(reviews);
    const [page, setPage] = useState(1);
    const [moreReviews, setMoreReviews] = useState(reviews?.length > 0 ? true : false);

    const loadMoreData = async () => {
        await axiosInstance.post('/api/review/product/search/index', {
            search: search_string,
            pagination: page + 1
        })
        .then((response) => {
            if(response.data.data) {
                setReviewsData(reviewsData.concat(response.data.data));
                setPage(page + 1);
                if(response?.data?.data?.meta?.last_page <= page) setMoreReviews(false);
            }
            else setMoreReviews(false);
        })
    };

  return (
    <div className="w-full">
        <InfiniteScroll
            dataLength={reviewsData?.length}
            next={loadMoreData}
            hasMore={moreReviews}
            loader={<Loader2 className="h-8 w-8 mx-auto mt-8 text-orange-500 animate-spin" />}
            className="flex flex-col gap-6"
        >
            {
                reviewsData?.length > 0 ? reviewsData?.map(review => (
                    <ExploreReviewCard
                        key={review.id}
                        name={review.user?.name}
                        message={review.comment}
                        banner_image={review?.user?.picture}
                        images={review.images}
                        product={review?.product}
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

export default ReviewResultsTab