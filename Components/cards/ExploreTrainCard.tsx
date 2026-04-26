// import { useRouter } from "next/router";
// import { processImgUrl } from "../../Utils/helper";

// interface IExploreTrainCardProps {
//     id: string;
//     banner_image?: string;
//     name: string;
//     username: string;
//     message: string;
//     images?: string[];
//     videos?: string[];
//     link?: string;
// }

// const ExploreTrainCard = ({id, banner_image, name, username, message, images, videos, link}: IExploreTrainCardProps) => {
//     const router = useRouter();
//   return (
//     <div className="flex flex-row gap-2 px-4 py-2 border-b border-gray-300">
//         <img src={banner_image ? processImgUrl(banner_image) : 'https://via.placeholder.com/100'} alt={name} className="h-10 w-10 rounded-full object-cover object-center cursor-pointer" onClick={()=>router.push(`/openOrder?id=${id}`)}/>
//         <div className="flex flex-col gap-3">
//             <div className="flex flex-col">
//                 <h4 className="font-bold text-slate-800 mb-0 capitalize" onClick={()=>router.push(`/openOrder?id=${id}`)}>{name}</h4>
//                 <p className="text-xs font-semibold text-gray-600" >@{username}</p>
//             </div>
//             <p className="cursor-pointer" onClick={()=>router.push(`/openOrder?id=${id}`)}>{message}</p>

//             {
//                 link && <a href={link ?? '#0'} className="text-blue-600 no-underlinem">{link}</a>
//             }

//             {
//                 images && images?.length > 0 && (
//                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 overflow-x-scroll cursor-pointer" onClick={()=>router.push(`/openOrder?id=${id}`)}>
//                         {
//                             images?.map((image, index) => (
//                                 <img 
//                                     key={index}
//                                     src={image ? processImgUrl(image) : 'https://via.placeholder.com/100'} 
//                                     alt="" 
//                                     className="h-auto max-w-full object-center object-cover rounded-md" 
//                                 />
//                             ))
//                         }
//                     </div>
//                 )
//             }
//             {
//                 videos && videos?.length > 0 && (
//                     <div className="flex flex-row gap-3 overflow-x-scroll">
//                         {
//                             videos?.map((video, index) => (
//                                 <video 
//                                     key={index}
//                                     src={video ?? 'https://via.placeholder.com/100'} 
//                                     className="h-auto max-w-full object-center object-cover rounded-md" 
//                                 />
//                             ))
//                         }
//                     </div>
//                 )
//             }
//         </div>
//     </div>
//   )
// }

// export default ExploreTrainCard

import { useRouter } from 'next/router';
import { Train, Users } from 'lucide-react';
import { processImgUrl } from '../../Utils/helper';

interface IExploreTrainCardProps {
  id: string;
  banner_image?: string;
  name: string;
  username: string;
  message: string;
  images?: string[];
  videos?: string[];
  link?: string;
  subscribers_count?: number;
  discount?: number;
}

const ExploreTrainCard = ({
  id,
  banner_image,
  name,
  username,
  message,
  images,
  videos,
  link,
  subscribers_count,
  discount,
}: IExploreTrainCardProps) => {
  const router = useRouter();
  const goToTrain = () => router.push(`/openOrder?id=${id}`);

  return (
    <article
      onClick={goToTrain}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
          {banner_image ? (
            <img
              src={processImgUrl(banner_image)}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-orange-100 flex items-center justify-center">
              <Train className="w-5 h-5 text-orange-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 capitalize leading-none truncate">
            {name}
          </p>
          {username && (
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              @{username}
            </p>
          )}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 shrink-0">
          {discount && discount > 0 && (
            <span className="text-[11px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-lg">
              {discount}% OFF
            </span>
          )}
          <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
            <Train className="w-3 h-3" /> Train
          </span>
        </div>
      </div>

      {/* Description */}
      {message && (
        <p className="text-sm text-slate-500 leading-relaxed px-4 pb-3 line-clamp-2">
          {message}
        </p>
      )}

      {/* Image grid */}
      {images && images.length > 0 && (
        <div className={`px-4 pb-3 grid gap-2 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
          {images.slice(0, 4).map((image, index) => (
            <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
              <img
                src={image ? processImgUrl(image) : 'https://via.placeholder.com/200'}
                alt=""
                className="w-full h-full object-cover"
              />
              {index === 3 && images.length > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">+{images.length - 4}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Videos */}
      {videos && videos.length > 0 && (
        <div className="flex gap-3 overflow-x-auto px-4 pb-3 scrollbar-hide">
          {videos.map((video, index) => (
            <video
              key={index}
              src={video ?? ''}
              className="h-32 w-48 shrink-0 rounded-xl object-cover bg-slate-100"
              controls
              onClick={(e) => e.stopPropagation()}
            />
          ))}
        </div>
      )}

      {/* Footer: subscribers + CTA */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-50">
        {subscribers_count !== undefined && (
          <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <Users className="w-3.5 h-3.5" />
            {subscribers_count} joined
          </span>
        )}
        <span className="text-xs font-semibold text-orange-500 ml-auto">
          Join train →
        </span>
      </div>
    </article>
  );
};

export default ExploreTrainCard;