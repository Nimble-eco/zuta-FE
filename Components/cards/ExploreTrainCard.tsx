import { useRouter } from "next/router";
import { processImgUrl } from "../../Utils/helper";

interface IExploreTrainCardProps {
    id: string;
    banner_image?: string;
    name: string;
    username: string;
    message: string;
    images?: string[];
    videos?: string[];
    link?: string;
}

const ExploreTrainCard = ({id, banner_image, name, username, message, images, videos, link}: IExploreTrainCardProps) => {
    const router = useRouter();
  return (
    <div className="flex flex-row gap-2 px-4 py-2 border-b border-gray-300">
        <img src={banner_image ? processImgUrl(banner_image) : 'https://via.placeholder.com/100'} alt={name} className="h-10 w-10 rounded-full object-cover object-center cursor-pointer" onClick={()=>router.push(`/openOrder?id=${id}`)}/>
        <div className="flex flex-col gap-3">
            <div className="flex flex-col">
                <h4 className="font-bold text-slate-800 mb-0 capitalize" onClick={()=>router.push(`/openOrder?id=${id}`)}>{name}</h4>
                <p className="text-xs font-semibold text-gray-600" >@{username}</p>
            </div>
            <p className="cursor-pointer" onClick={()=>router.push(`/openOrder?id=${id}`)}>{message}</p>

            {
                link && <a href={link ?? '#0'} className="text-blue-600 no-underlinem">{link}</a>
            }

            {
                images && images?.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 overflow-x-scroll cursor-pointer" onClick={()=>router.push(`/openOrder?id=${id}`)}>
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
                                    src={video ?? 'https://via.placeholder.com/100'} 
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

export default ExploreTrainCard