import ExploreItemCard from "../../../Components/cards/ExploreItemCard";
import ExploreRevewCard from "../../../Components/cards/ExploreRevewCard";
import ExploreTrainCard from "../../../Components/cards/ExploreTrainCard";
import ExploreUserCard from "../../../Components/cards/ExploreUserCard";
import ExploreVendorCard from "../../../Components/cards/ExploreVendorCard";

interface ITopResultsTabProps {
    search_string: string;
    vendors: any[];
    products: any[];
    orders: any[];
    reviews: any[];
}

const TopResultsTab = ({search_string, vendors, products, orders, reviews}: ITopResultsTabProps) => {
    const mergedAndShuffledArray = [...vendors, ...products, ...orders, ...reviews]
    .map(item => ({
        ...item,
        type: item.vendor_name ? 'vendor' : item.product_images?.length ? 'product' : item.open_order_price ? 'order' : 'review'
    }))
    .sort(() => Math.random() - 0.5);

    return (
        <div className="flex flex-col gap-6 w-full">
            {
                mergedAndShuffledArray?.length > 0 ? mergedAndShuffledArray?.map((object) => (
                    object?.type === 'product' ?
                        <ExploreItemCard
                            key={object?.id}
                            id={object?.id}
                            name={object?.product_name}
                            message={object?.product_description}
                            banner_image={object?.vendor?.user?.picture}
                            images={object?.product_images}
                        /> : 
                    object?.type === 'order' ? 
                        <ExploreTrainCard
                            key={object?.id}
                            id={object?.id}
                            name={object?.product?.product_name}
                            username={object?.community?.title ?? object?.creator?.name}
                            message={object?.product?.product_description}
                            banner_image={object?.community?.banner_image ?? object?.creator?.picture}
                            images={object?.product?.product_images}
                        /> :
                    object?.type === 'review' ? 
                        <ExploreRevewCard
                            key={object?.id}
                            name={object?.user?.name}
                            message={object?.comment}
                            banner_image={object?.user?.picture}
                            images={object?.images}
                            product={object?.product}
                        /> :
                    object?.type === 'vendor' ? 
                        <ExploreVendorCard
                            id={object.id}
                            name={object?.vendor_name}
                            username={`${object?.vendor_city} - ${object?.vendor_state}`}
                            image={object?.user?.picture}
                        /> :
                    null
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
        </div>
    )
}

export default TopResultsTab