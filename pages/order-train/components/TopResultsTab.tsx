import { Search } from 'lucide-react';
import ExploreItemCard from '../../../Components/cards/ExploreItemCard';
import ExploreTrainCard from '../../../Components/cards/ExploreTrainCard';
import ExploreVendorCard from '../../../Components/cards/ExploreVendorCard';
import ExploreReviewCard from '../../../Components/cards/ExploreRevewCard';
import ExploreUserCard from '../../../Components/cards/ExploreUserCard';

interface ITopResultsTabProps {
  search_string: string;
  vendors: any[];
  users: any[];
  products: any[];
  orders: any[];
  reviews: any[];
}

type ResultItem = {
  type: 'vendor' | 'product' | 'order' | 'review' | 'user';
  [key: string]: any;
};

const TopResultsTab = ({
  search_string,
  vendors,
  users,
  products,
  orders,
  reviews,
}: ITopResultsTabProps) => {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const safeVendors = Array.isArray(vendors) ? vendors : [];
  const safeUsers = Array.isArray(users) ? users : [];
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  const merged: ResultItem[] = [
    ...safeOrders.map((o) => ({ ...o, type: 'order' as const })),
    ...safeProducts.map((p) => ({ ...p, type: 'product' as const })),
    ...safeVendors.map((v) => ({ ...v, type: 'vendor' as const })),
    ...safeUsers.map((u) => ({ ...u, type: 'user' as const })),
    ...safeReviews.map((r) => ({ ...r, type: 'review' as const })),
  ].sort(() => Math.random() - 0.5);

  if (merged.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
          <Search className="w-8 h-8 text-slate-300" />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-slate-600">
            No results for &ldquo;{search_string}&rdquo;
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Try a different keyword or check your spelling
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {merged.map((object, index) => {
        if (object.type === 'product') {
          return (
            <ExploreItemCard
              key={`${object.id}-${index}`}
              id={object.id}
              name={object.product_name}
              message={object.product_description}
              banner_image={object.vendor?.user?.picture}
              images={object.product_images}
            />
          );
        }
        if (object.type === 'order') {
          return (
            <ExploreTrainCard
              key={`${object.id}-${index}`}
              id={object.id}
              name={object.product?.product_name}
              username={object.community?.title ?? object.creator?.name ?? ''}
              message={object.product?.product_description}
              banner_image={object.community?.banner_image ?? object.creator?.picture}
              images={object.product?.product_images}
              subscribers_count={object.subscribers_count}
              discount={object.open_order_discount}
            />
          );
        }
        if (object.type === 'review') {
          return (
            <ExploreReviewCard
              key={`${object.id}-${index}`}
              name={object.user?.name}
              message={object.comment}
              banner_image={object.user?.picture}
              images={object.images}
              product={object.product}
              score={object.score}
            />
          );
        }
        if (object.type === 'vendor') {
          return (
            <ExploreVendorCard
              key={`${object.id}-${index}`}
              id={object.id}
              name={object.vendor_name}
              username={`${object.vendor_city ?? ''} ${object.vendor_city && object.vendor_state ? '·' : ''} ${object.vendor_state ?? ''}`}
              image={object.user?.picture}
              is_subscribed={object?.is_subscribed}
            />
          );
        }
        if (object.type === 'user') {
          return (
            <ExploreUserCard
              key={`${object.id}-${index}`}
              id={object.id}
              name={object.name}
              image={object.picture}
              is_following={object?.is_following}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default TopResultsTab;