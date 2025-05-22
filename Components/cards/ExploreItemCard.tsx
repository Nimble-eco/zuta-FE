import { useRouter } from "next/router";
import { processImgUrl } from "../../Utils/helper";

interface IExploreItemCardProps {
    id: string;
    banner_image?: string;
    name: string;
    message: string;
    images?: string[];
    videos?: string[];
    link?: string;
}

const ExploreItemCard = ({id, banner_image, name, message, images, videos, link}: IExploreItemCardProps) => {
    const router = useRouter();
  return (
    <div className="flex flex-row gap-2 px-4 py-2 border-b border-gray-300 cursor-pointer" onClick={()=>router.push(`/product?id=${id}`)}>
        <img src={banner_image ? processImgUrl(banner_image) : 'https://via.placeholder.com/100'} alt={name} className="h-10 w-10 rounded-full object-cover object-center" />
        <div className="flex flex-col gap-2">
            <h4 className="font-bold text-slate-800 mb-0 capitalize">{name}</h4>
            <p className="">{message}</p>

            {
                link && <a href={link ?? '#0'} className="text-blue-600 no-underline">{link}</a>
            }

            {
                images && images?.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 overflow-x-scroll">
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
        </div>
    </div>
  )
}

export default ExploreItemCard