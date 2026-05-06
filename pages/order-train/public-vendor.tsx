import React, { useState } from 'react';
import { 
  Store, 
  Package, 
  MapPin, 
  CheckCircle2, 
  BellRing, 
  BellOff, 
  Share2,
  Info,
  User,
} from 'lucide-react';
import { parse } from 'cookie';
import axiosInstance from '../../Utils/axiosConfig';
import { useRouter } from 'next/router';
import { subscribeToVendorAction, unsubscribeFromVendorAction } from '../../requests/user/user.request';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { Button } from '../../Components/buttons/button';
import ProductComponent from '../../Components/ProductComponent';

interface IVendor {
  id: string;
  vendor_name: string;
  vendor_description: string | null;
  vendor_city: string;
  vendor_state: string;
  vendor_categories: string[];
  is_subscribed: boolean;
  joined_at: string;
  subscribers_count: number;
  user?: {
    name: string;
    picture: string | null;
  };
  products: any[]
}

interface IPublicVendorPageProps {
  vendor: IVendor;
}

const PublicVendorPage = ({ vendor }: IPublicVendorPageProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'store' | 'about' | 'reviews'>('store');
  const [loading, setLoading] = useState(false);
  
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
    subscribeToVendorAction(vendor?.id)
    .then((res) => {
    if (res.status === 200) {
      toast.success('Subscribed to store');
      setTimeout(() => router.reload(), 900);
    }
    })
    .catch(() => toast.error('Could not subscribe to store'))
    .finally(() => setLoading(false));
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    unsubscribeFromVendorAction(vendor?.id)
    .then((res) => {
    if (res.status === 200) {
        toast.success('Unsubscribed from store');
        setTimeout(() => router.reload(), 900);
    }
    })
    .catch(() => toast.error('Could not unsubscribe'))
    .finally(() => setLoading(false));
  };

  const shareUrl = `${window.location.origin}/order-train/public-vendor?id=${vendor?.id}`;
   
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied!");
  };

    console.log({vendor})

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Brand Hero Section */}
      <div className="relative h-[50vh] md:h-64 w-full bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
        
        <div className="absolute bottom-6 left-0 w-full px-4 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end gap-6 max-w-7xl mx-auto">
            {/* Vendor Logo/Avatar */}
            <div className="h-28 w-28 md:h-36 md:w-36 rounded-2xl bg-white p-1 shadow-2xl flex-shrink-0">
              <div className="h-full w-full rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                <Store size={48} />
              </div>
            </div>

            <div className="flex-grow mb-2">
              <div className="flex items-center gap-2 text-white">
                <h1 className="text-3xl md:text-4xl font-bold capitalize">{vendor.vendor_name}</h1>
                <CheckCircle2 className="text-blue-400 fill-blue-400/20" size={24} />
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-slate-300 text-sm">
                <span className="flex items-center gap-1"><MapPin size={16} /> {vendor.vendor_city}, {vendor.vendor_state}</span>
                <span className="flex items-center gap-1"><Package size={16} /> {vendor?.products?.length} Products</span>
                <span className="flex items-center gap-1"><User size={16} /> {vendor?.subscribers_count} Subscribers</span>
              </div>
            </div>

            <div className="flex gap-3 mb-2 w-full md:w-auto">
              <Button 
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 h-14 px-8 py-3 rounded-xl font-bold transition shadow-lg ${
                  vendor.is_subscribed 
                  ? 'bg-slate-700 text-white hover:bg-slate-600' 
                  : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
                isLoading={loading}
                disabled={loading}
                onClick={vendor?.is_subscribed ? handleUnsubscribe : handleSubscribe}
              >
                {vendor.is_subscribed ? <BellOff size={18} /> : <BellRing size={18} />}
                {vendor.is_subscribed ? 'Subscribed' : 'Subscribe'}
              </Button>
              <button onClick={handleCopyLink} className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Store Info</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Categories</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {vendor.vendor_categories.map(cat => (
                    <span key={cat} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-50">
                <p className="text-xs text-slate-400 uppercase font-semibold">Managed By</p>
                <div className="flex items-center gap-3 mt-2">
                   <div className="h-8 w-8 rounded-full bg-indigo-600 text-[10px] flex items-center justify-center text-white font-bold">
                     {vendor.user?.name.charAt(0)}
                   </div>
                   <p className="text-sm font-medium text-slate-700 !mb-0">{vendor.user?.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs & Content */}
        <div className="lg:col-span-3 pb-10">
          <div className="flex gap-8 border-b border-slate-200 mb-6">
            {(['store', 'about'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold capitalize transition-colors relative ${
                  activeTab === tab ? 'text-orange-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-600 rounded-full" />}
              </button>
            ))}
          </div>

          {activeTab === 'store' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
              {vendor?.products?.map((p: any, i: number) => (
                <ProductComponent
                  key={i}
                  product={p}
                />
              ))}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="bg-white p-8 rounded-2xl border border-slate-100 animate-in fade-in">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Info className="text-orange-500" /> About our Brand
              </h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {vendor.vendor_description || "No description provided."}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PublicVendorPage;

export async function getServerSideProps(context: any) {
    const cookies = parse(context.req.headers.cookie || '');
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;

    try {
        const vendor_id = context.query.id;

        const getVendor = await axiosInstance.get('/api/public/vendor/show', {
            params: {vendor_id},
            headers: { Authorization: token }
        });
        console.log({getVendor})

        const vendor = getVendor?.data?.data;

        return {
            props: { vendor }
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
            props: {vendor: {}}
        }
    }
}