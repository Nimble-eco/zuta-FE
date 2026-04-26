// import { useRouter } from "next/router";
// import { processImgUrl } from "../../Utils/helper";

// interface IExploreItemCardProps {
//     id: string;
//     banner_image?: string;
//     name: string;
//     message: string;
//     images?: string[];
//     videos?: string[];
//     link?: string;
// }

// const ExploreItemCard = ({id, banner_image, name, message, images, videos, link}: IExploreItemCardProps) => {
//     const router = useRouter();
//   return (
//     <div className="flex flex-row gap-2 px-4 py-2 border-b border-gray-300 cursor-pointer" onClick={()=>router.push(`/product?id=${id}`)}>
//         <img src={banner_image ? processImgUrl(banner_image) : 'https://via.placeholder.com/100'} alt={name} className="h-10 w-10 rounded-full object-cover object-center" />
//         <div className="flex flex-col gap-2">
//             <h4 className="font-bold text-slate-800 mb-0 capitalize">{name}</h4>
//             <p className="">{message}</p>

//             {
//                 link && <a href={link ?? '#0'} className="text-blue-600 no-underline">{link}</a>
//             }

//             {
//                 images && images?.length > 0 && (
//                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 overflow-x-scroll">
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
//                                     src={video ? processImgUrl(video) : 'https://via.placeholder.com/100'} 
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

// export default ExploreItemCard

import { useRouter } from 'next/router';
import { Package } from 'lucide-react';
import { processImgUrl } from '../../Utils/helper';

interface IExploreItemCardProps {
  id: string;
  banner_image?: string;
  name: string;
  message: string;
  images?: string[];
  videos?: string[];
  link?: string;
}

const ExploreItemCard = ({
  id,
  banner_image,
  name,
  message,
  images,
  videos,
  link,
}: IExploreItemCardProps) => {
  const router = useRouter();

  return (
    <article
      onClick={() => router.push(`/product?id=${id}`)}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-orange-50 border border-orange-100 shrink-0 flex items-center justify-center">
          {banner_image ? (
            <img
              src={processImgUrl(banner_image)}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="w-5 h-5 text-orange-300" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 capitalize leading-none truncate">
            {name}
          </p>
          <span className="text-[11px] font-medium text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">
            Product
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
        <div className={`px-4 pb-4 grid gap-2 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
          {images.slice(0, 4).map((image, index) => (
            <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
              <img
                src={image ? processImgUrl(image) : 'https://via.placeholder.com/200'}
                alt=""
                className="w-full h-full object-cover"
              />
              {/* Overlay count for 4+ images */}
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
        <div className="flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide">
          {videos.map((video, index) => (
            <video
              key={index}
              src={video ? processImgUrl(video) : ''}
              className="h-32 w-48 shrink-0 rounded-xl object-cover bg-slate-100"
              controls
            />
          ))}
        </div>
      )}

      {/* External link */}
      {link && (
        <div className="px-4 pb-4">
          <a href={link} className="text-xs text-orange-500 font-medium hover:underline truncate block">
            {link}
          </a>
        </div>
      )}
    </article>
  );
};

export default ExploreItemCard;