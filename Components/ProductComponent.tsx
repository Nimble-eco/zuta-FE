import { useRouter } from 'next/router';
import { FC } from 'react';
import { formatAmount } from '../Utils/formatAmount';
import { processImgUrl } from '../Utils/helper';

interface IProductComponentProps {
  product: {
    product_name: string;
    id: string | number;
    product_description?: string;
    product_images: string[];
    product_price: number;
    product_discount?: number;
    reviews?: any[];
  };
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-3 h-3 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const ProductComponent: FC<IProductComponentProps> = ({ product }) => {
  const router = useRouter();

  const getRating = () => {
    if (product?.reviews?.length) {
      const total = product.reviews.reduce((sum, r) => sum + r.score, 0);
      return total / product.reviews.length;
    }
    return 4;
  };

  return (
    <article
      onClick={() => router.push(`/product?id=${product.id}`)}
      className="flex flex-row bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Image */}
      <div className="w-28 shrink-0 bg-slate-100">
        <img
          src={processImgUrl(product?.product_images[0])}
          alt={product.product_name}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between px-3 py-3 flex-1 min-w-0">
        <div>
          <h3 className="text-[13px] font-medium text-slate-800 leading-snug capitalize line-clamp-2 mb-1">
            {product?.product_name}
          </h3>
          <p className="text-base font-semibold text-green-600">
            {formatAmount(product?.product_price)}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <StarRating rating={getRating()} />
          {product?.product_discount && product.product_discount > 0 && (
            <span className="text-[10px] font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
              {product.product_discount}% off
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductComponent;