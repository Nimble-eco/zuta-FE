import React, { useState } from 'react';
import { 
  Users, 
  Trophy, 
  UserPlus,
  BadgeCheck,
  Calendar,
  UserMinus
} from 'lucide-react';
import { parse } from 'cookie';
import axiosInstance from '../../Utils/axiosConfig';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { followUserAction, unfollowUserAction } from '../../requests/user/user.request';
import { toast } from 'react-toastify';
import { Button } from '../../Components/buttons/button';

interface IUserProfile {
  id: string;
  first_name: string;
  last_name: string;
  description: string | null;
  followers_count: number | null;
  following_count: number | null;
  orders_count: number | null;
  trains_count: number | null;
  points: string | number;
  picture: string | null;
  joined_at: string | null;
  communities: any[];
  is_following: boolean;
}

interface IPublicProfileProps {
    user: IUserProfile
}

const PublicProfile = ({ user }: IPublicProfileProps) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'about' | 'communities' | 'activity'>('about');
    const [loading, setLoading] = useState(false);

    const getInitials = (name: string) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase();
    };

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
        followUserAction(user?.id)
        .then((res) => {
        if (res.status === 200) {
            toast.success('Now following');
            setTimeout(() => router.reload(), 900);
        }
        })
        .catch(() => toast.error('Could not follow user'))
        .finally(() => setLoading(false));
    };

    const unFollowUser = async () => {
        setLoading(true);
        unfollowUserAction(user?.id)
        .then((res) => {
        if (res.status === 200) {
            toast.success('Unfollowed');
            setTimeout(() => router.reload(), 900);
        }
        })
        .catch(() => toast.error('Could not unfollow user'))
        .finally(() => setLoading(false));
    };
  console.log({user})

  return (
    <div className="min-h-screen bg-gray-50 pb-12 w-full">
      {/* 1. Header Section: Banner & Avatar */}
      <div className="relative h-48 w-full bg-gradient-to-r from-orange-400 to-rose-500">
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-24 md:translate-x-0">
          <div className="relative">
            {user.picture && !user.picture.includes('null') ? (
              <img 
                src={user.picture} 
                className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                alt={`${user.first_name} ${user.last_name}`}
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-indigo-600 text-3xl font-bold text-white shadow-lg">
                {getInitials(`${user.first_name} ${user.last_name}`)}
              </div>
            )}
            <div className="absolute bottom-1 right-1 rounded-full bg-white p-1 shadow">
              <BadgeCheck className="h-6 w-6 text-blue-500" fill="currentColor" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Identity & Primary Actions */}
      <div className="mx-auto max-w-5xl px-4 pt-20">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-start">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold capitalize text-gray-900">{user.first_name} {user?.last_name}</h1>
                <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm text-gray-500 md:justify-start">
                    <span className="flex items-center gap-1"><Calendar size={16}/> Joined {new Date(user?.joined_at!).toDateString()}</span>
                </div>
            </div>

            <div className="flex gap-3">
                {
                    user?.is_following ? (
                        <Button 
                            className="flex items-center gap-2 rounded-full bg-orange-600 px-6 py-2.5 font-semibold text-white transition hover:bg-orange-700 shadow-md"
                            isLoading={loading}
                            disabled={loading}
                            onClick={unFollowUser}
                        >
                            <UserMinus size={18} /> Unfollow
                        </Button>
                    ) : (
                        <Button 
                            className="flex items-center gap-2 rounded-full bg-orange-600 px-6 py-2.5 font-semibold text-white transition hover:bg-orange-700 shadow-md"
                            isLoading={loading}
                            disabled={loading}
                            onClick={followUser}
                        >
                            <UserPlus size={18} /> Follow
                        </Button>
                    )
                }                
            </div>
        </div>

        {/* 3. Social Commerce Metrics Bar */}
        <div className="mt-10 grid grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 md:grid-cols-5">
            <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{user.followers_count ?? 0}</p>
                <p className="text-xs uppercase tracking-wider text-gray-500">Followers</p>
            </div>
            <div className="text-center border-l border-gray-100">
                <p className="text-xl font-bold text-gray-900">{user.following_count ?? 0}</p>
                <p className="text-xs uppercase tracking-wider text-gray-500">Following</p>
            </div>
            <div className="text-center border-l border-gray-100">
                <p className="text-xl font-bold text-gray-900">{user.orders_count ?? 0}</p>
                <p className="text-xs uppercase tracking-wider text-gray-500">Orders</p>
            </div>
            <div className="text-center border-l border-gray-100">
                <p className="text-xl font-bold text-gray-900">{user.trains_count ?? 0}</p>
                <p className="text-xs uppercase tracking-wider text-gray-500">Trains</p>
            </div>
            <div className="col-span-2 md:col-span-1 text-center border-l border-gray-100">
                <div className="flex items-center justify-center gap-1 text-orange-500">
                    <Trophy size={18} />
                    <p className="text-xl font-bold">{user.points}</p>
                </div>
                <p className="text-xs uppercase tracking-wider text-gray-500">Zuta Points</p>
            </div>
        </div>

        {/* 4. Tab Navigation */}
        <div className="mt-8 border-b border-gray-200">
            <div className="flex gap-8">
                {(['about', 'communities'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-sm font-semibold capitalize transition-colors ${
                        activeTab === tab 
                        ? 'border-b-2 border-orange-600 text-orange-600' 
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>

        {/* 5. Tab Content Area */}
        <div className="mt-8">
            {activeTab === 'about' && (
                <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="text-lg font-bold text-gray-900">Bio</h3>
                    <p className="mt-3 leading-relaxed text-gray-600">
                        {user.description || "This shopper hasn't added a bio yet. They're likely too busy hunting for the best deals on Zuta!"}
                    </p>
                </div>
            )}

            {activeTab === 'communities' && (
                <div className="flex flex-col items-center justify-center rounded-3xl bg-gray-100/50 py-16 text-center animate-in fade-in zoom-in-95">
                    <Users className="mb-4 h-12 w-12 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-900">No Communities Yet</h3>
                    <p className="mt-2 text-gray-500">When {user?.first_name} joins shopping groups, they will appear here.</p>
                    
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;

export async function getServerSideProps(context: any) {
    const cookies = parse(context.req.headers.cookie || '');
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;

    try {
        const user_id = context.query.id;

        const getUser = await axiosInstance.get('/api/public/user/show', {
            params: {user_id},
            headers: { Authorization: token }
        });
        console.log({getUser})

        const user = getUser?.data?.data;

        return {
            props: { user }
        }
    } catch (error: any) {
        console.log({error})
        if(error?.response?.status === 401) {
            return {
                redirect: {
                    destination: '/auth/signIn',
                    permanent: false
                }
            }
        }
  
        return {
            props: {user: {}}
        }
    }
}