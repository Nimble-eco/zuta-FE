import { processImgUrl } from "../../Utils/helper";
import ExploreItemCard from "./ExploreItemCard";

interface IExploreReviewCardProps {
    banner_image?: string;
    name: string;
    message: string;
    images?: string[];
    videos?: string[];
    link?: string;
    product: any;
}


const ExploreRevewCard = ({banner_image, name, message, link, images, videos, product}: IExploreReviewCardProps) => {
  return (
    <div className="flex flex-row gap-2 px-4 py-2 border-b border-gray-300">
        <img src={banner_image ? processImgUrl(banner_image) : 'https://via.placeholder.com/100'} alt={name} className="h-10 w-10 rounded-full object-cover object-center" />
        <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-slate-800 !mb-0 capitalize">{name}</h4>
            <p className="text-gray-700 text-sm">{message}</p>

            {
                link && <a href={link ?? '#0'} className="text-blue-600 no-underlinem">{link}</a>
            }

            {
                images && images?.length > 0 && (
                    <div className={`${images?.length > 1 ? 'grid grid-cols-2 lg:grid-cols-4' : 'flex flex-col w-full' } gap-2 overflow-x-scroll`}>
                        {
                            images?.map((image, index) => (
                                <img 
                                    key={index}
                                    src={image ? processImgUrl(image) : 'https://via.placeholder.com/100'} 
                                    alt="" 
                                    className="h-auto max-w-full object-center object-cover rounded-md" 
                                />
                            ))
                        }
                    </div>
                )
            }
            {
                videos && videos?.length > 0 && (
                    <div className="flex flex-row gap-3 overflow-x-scroll">
                        {
                            videos?.map((video, index) => (
                                <video 
                                    key={index}
                                    src={video ? processImgUrl(video) : 'https://via.placeholder.com/100'} 
                                    className="h-auto max-w-full object-center object-cover rounded-md" 
                                />
                            ))
                        }
                    </div>
                )
            }

            {
                product && (
                    <div className="w-[90%] border border-gray-300 rounded-xl">
                        <ExploreItemCard
                            id={product.id}
                            message={product.product_description}
                            name={product.product_name}
                            banner_image={product?.product_images[0]}
                            images={product?.product_images}
                        />
                    </div>
                )
            }
        </div>
    </div>
  )
}

export default ExploreRevewCard