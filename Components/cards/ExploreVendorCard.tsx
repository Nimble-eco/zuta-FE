import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { Loader2, Store, Bell, BellOff, MapPin } from 'lucide-react';
import { processImgUrl } from '../../Utils/helper';
import {
  subscribeToVendorAction,
  unsubscribeFromVendorAction,
} from '../../requests/user/user.request';

interface IExploreVendorCardProps {
  id: string;
  image?: string;
  name: string;
  username?: string;
  redirect?: any;
  is_subscribed: boolean;
}

const ExploreVendorCard = ({ id, image, name, username, redirect, is_subscribed }: IExploreVendorCardProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ── Guard: only check subscription status if logged in ───────────────
  const isLoggedIn = () => {
    try {
      const raw = Cookies.get('user');
      if (!raw || raw === 'undefined') return false;
      return !!JSON.parse(raw)?.access_token;
    } catch {
      return false;
    }
  };

  const handleSubscribe = async () => {
    if (!isLoggedIn()) { router.push('/auth/signIn'); return; }
    setLoading(true);
    subscribeToVendorAction(id)
      .then((res) => {
        if (res.status === 200) {
          toast.success('Subscribed to store');
          if (redirect) setTimeout(() => router.push(redirect), 1500);
        }
      })
      .catch(() => toast.error('Could not subscribe to store'))
      .finally(() => setLoading(false));
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    unsubscribeFromVendorAction(id)
      .then((res) => {
        if (res.status === 200) {
          toast.success('Unsubscribed from store');
          if (redirect) setTimeout(() => router.push(redirect), 1500);
        }
      })
      .catch(() => toast.error('Could not unsubscribe'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200">
      {/* Avatar + info */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => router.push(`/order-train/public-vendor?id=${id}`)}
      >
        <div className="w-11 h-11 rounded-xl overflow-hidden bg-orange-50 border border-orange-100 shrink-0 !flex !items-center !justify-center">
          {image ? (
            <img
              src={processImgUrl(image)}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Store className="w-5 h-5 my-auto mx-auto text-orange-400" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800 leading-none capitalize !mb-1">{name}</p>
          {username && (
            <div className="text-[11px] text-slate-400 mt-0.5 flex flex-row items-center gap-0.5">
              <MapPin className="w-3 h-3" />
              {username}
            </div>
          )}
        </div>
      </div>

      {/* Subscribe / Unsubscribe */}
      <button
        onClick={is_subscribed ? handleUnsubscribe : handleSubscribe}
        disabled={loading}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          is_subscribed
            ? 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500'
            : 'bg-orange-500 text-white hover:bg-orange-600'
        }`}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : is_subscribed ? (
          <><BellOff className="w-3.5 h-3.5" /> Subscribed</>
        ) : (
          <><Bell className="w-3.5 h-3.5" /> Subscribe</>
        )}
      </button>
    </div>
  );
};

export default ExploreVendorCard;