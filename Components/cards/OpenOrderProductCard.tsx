import { useRouter } from 'next/router';
import { FC } from 'react';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { formatAmount } from '../../Utils/formatAmount';
import { processImgUrl } from '../../Utils/helper';

interface IOpenOrderProductCardProps {
  order: {
    id: string;
    open_order_price: number;
    open_order_discount: number;
    user_id: string;
    created_at: string | Date;
    subscribers_count: number;
    product: {
      product_name: string;
      product_id: string;
      product_description?: string;
      product_images: string[];
      product_price: number;
      product_discount?: number;
      reviews?: number;
    };
    subscribers_list: any[];
    target_subscribers?: number;
  };
}

/** Returns how urgently full this order is, for the progress bar colour */
const progressColor = (pct: number) => {
  if (pct >= 90) return 'bg-red-500';
  if (pct >= 60) return 'bg-orange-500';
  return 'bg-green-500';
};

const urgencyLabel = (pct: number) => {
  if (pct >= 90) return '🔥 Closing soon!';
  if (pct >= 60) return '⚡ Filling fast';
  return null;
};

const OpenOrderProductCard: FC<IOpenOrderProductCardProps> = ({ order }) => {
  const router = useRouter();

  const target = order.target_subscribers ?? 100;
  const fillPct = Math.min(100, Math.round((order.subscribers_count / target) * 100));
  const urgency = urgencyLabel(fillPct);

  return (
    <article
      onClick={() => router.push(`/openOrder?id=${order.id}`)}
      className="flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-40 bg-slate-100 overflow-hidden">
        <img
          src={processImgUrl(order.product?.product_images[0])}
          alt={order.product?.product_name}
          className="w-full h-full object-cover object-center"
        />

        {/* Subscribers badge — top left */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-orange-500 text-[11px] font-semibold px-2 py-1 rounded-lg border border-orange-100">
          <HiOutlineShoppingCart className="text-sm" />
          <span>{order.subscribers_count ?? 0} joined</span>
        </div>

        {/* Discount badge — top right */}
        <div className="absolute top-2 right-2 bg-red-500 text-white text-[11px] font-bold px-2 py-1 rounded-lg">
          {order.open_order_discount}% OFF
        </div>

        {/* Urgency tag on image — bottom */}
        {urgency && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
            <span className="text-white text-[11px] font-semibold">{urgency}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 px-3 py-3">
        <h3 className="text-[13px] font-medium text-slate-800 line-clamp-2 leading-snug capitalize">
          {order.product?.product_name}
        </h3>

        {/* Pricing row */}
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-base font-semibold text-green-600">
            {formatAmount(order.open_order_price)}
          </span>
          <span className="text-[11px] text-slate-400 line-through">
            {formatAmount(order.product?.product_price)}
          </span>
        </div>

        {/* Progress bar */}
        <div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor(fillPct)}`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {fillPct}% filled
          </p>
        </div>
      </div>
    </article>
  );
};

export default OpenOrderProductCard;