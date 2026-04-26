import { processImgUrl } from '../../Utils/helper';
import { Star, MessageSquare } from 'lucide-react';
import ExploreItemCard from './ExploreItemCard';

interface IExploreReviewCardProps {
  banner_image?: string;
  name: string;
  message: string;
  images?: string[];
  videos?: string[];
  link?: string;
  product: any;
  score?: number;
}

const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`w-3 h-3 ${s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
      />
    ))}
  </div>
);

const ExploreReviewCard = ({
  banner_image,
  name,
  message,
  images,
  videos,
  link,
  product,
  score,
}: IExploreReviewCardProps) => {
  return (
    <article className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
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
            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
              <span className="text-slate-500 text-sm font-bold">
                {name?.[0]?.toUpperCase() ?? 'U'}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 capitalize leading-none">
            {name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {score !== undefined && <StarRow rating={score} />}
            <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <MessageSquare className="w-3 h-3" /> Review
            </span>
          </div>
        </div>
      </div>

      {/* Comment */}
      {message && (
        <p className="text-sm text-slate-600 leading-relaxed px-4 pb-3">
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
              src={video ? processImgUrl(video) : ''}
              className="h-32 w-48 shrink-0 rounded-xl object-cover bg-slate-100"
              controls
            />
          ))}
        </div>
      )}

      {/* External link */}
      {link && (
        <div className="px-4 pb-3">
          <a href={link} className="text-xs text-orange-500 font-medium hover:underline truncate block">
            {link}
          </a>
        </div>
      )}

      {/* Referenced product */}
      {product && (
        <div className="mx-4 mb-4 border border-slate-100 rounded-xl overflow-hidden">
          <ExploreItemCard
            id={product.id}
            message={product.product_description}
            name={product.product_name}
            banner_image={product?.product_images?.[0]}
            images={product?.product_images}
          />
        </div>
      )}
    </article>
  );
};

export default ExploreReviewCard;