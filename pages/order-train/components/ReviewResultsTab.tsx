import { useState } from "react";
import ExploreRevewCard from "../../../Components/cards/ExploreRevewCard";
import axiosInstance from "../../../Utils/axiosConfig";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2 } from "lucide-react";

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
                    <ExploreRevewCard
                        key={review.id}
                        name={review.user?.name}
                        message={review.comment}
                        banner_image={review?.user?.picture}
                        images={review.images}
                        product={review?.product}
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

export default ReviewResultsTab