import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { Loader2, UserCheck, UserPlus } from 'lucide-react';

import { processImgUrl } from '../../Utils/helper';
import {
  checkUserFollowingStatusAction,
  followUserAction,
  unfollowUserAction,
} from '../../requests/user/user.request';

interface IExploreUserMiniCardProps {
  id: string;
  image?: string;
  name: string;
  redirect?: string;
  is_following: boolean;
}

const ExploreUserMiniCard = ({ id, image, name, redirect, is_following }: IExploreUserMiniCardProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ── Guard: only check follow status if logged in ──────────────────────
  const isLoggedIn = () => {
    try {
      const raw = Cookies.get('user');
      if (!raw || raw === 'undefined') return false;
      return !!JSON.parse(raw)?.access_token;
    } catch {
      return false;
    }
  };

  const followUser = async () => {
    if (!isLoggedIn()) { router.push('/auth/signIn'); return; }
    setLoading(true);
    followUserAction(id)
      .then((res) => {
        if (res.status === 200) {
          toast.success('Now following');
          if (redirect) setTimeout(() => router.push(redirect), 1500);
        }
      })
      .catch(() => toast.error('Could not follow user'))
      .finally(() => setLoading(false));
  };

  const unFollowUser = async () => {
    setLoading(true);
    unfollowUserAction(id)
      .then((res) => {
        if (res.status === 200) {
          toast.success('Unfollowed');
          if (redirect) setTimeout(() => router.push(redirect), 1500);
        }
      })
      .catch(() => toast.error('Could not unfollow user'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col gap-3 px-4 py-3 hover:bg-slate-200 transition-colors rounded-xl border-b border-gray-200">
        {/* Avatar + name */}
        <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push(`/order-train/public-user?id=${id}`)}
        >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                <img
                    src={image ? processImgUrl(image) : 'https://via.placeholder.com/100'}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div>
                <p className="text-sm font-semibold text-slate-800 leading-none capitalize !mb-1">{name}</p>
            </div>
        </div>

        {/* Follow / Unfollow */}
        <button
            onClick={is_following ? unFollowUser : followUser}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all w-fit ${
            is_following
                ? 'text-orange-600 hover:bg-red-50 hover:text-red-500'
                : 'text-orange-600 hover:bg-orange-600 hover:text-white'
            }`}
        >
            {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : is_following ? (
                <><UserCheck className="w-3.5 h-3.5" /> Following</>
            ) : (
                <><UserPlus className="w-3.5 h-3.5" /> Follow</>
            )}
        </button>
    </div>
  );
};

export default ExploreUserMiniCard;