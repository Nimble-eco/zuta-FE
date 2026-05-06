import { useState } from 'react';
import { useRouter } from 'next/router';
import { parse } from 'cookie';
import Head from 'next/head';
import {
  ArrowLeft, Search, Train, Package, Star,
  Store, Users, LayoutGrid, X,
  PersonStanding,
} from 'lucide-react';
import Header from '../../Components/Header';
import ProductResultsTab from './components/ProductResultsTab';
import ReviewResultsTab from './components/ReviewResultsTab';
import TrainResultsTab from './components/TrainResultsTab';
import VendorResultsTab from './components/VendorResultsTab';
import TopResultsTab from './components/TopResultsTab';
import UsersResultTab from './components/UsersResultsTab';
import axiosInstance from '../../Utils/axiosConfig';
import FeaturedProductCard from '../../Components/cards/FeaturedProductCard';
import ExploreUserMiniCard from '../../Components/cards/ExploreUserMiniCard';
import Link from 'next/link';

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface IResultsPageProps {
  products: any[];
  openOrderProducts: any[];
  featuredProducts: any[];
  reviews: any[];
  vendors: any[];
  users: any[];
  usersSearchResult: any[];
}

/* ─── Tab config ─────────────────────────────────────────────────────────── */
const TABS = [
  { key: 'top',      label: 'Top results', icon: LayoutGrid },
  { key: 'train',    label: 'Trains',      icon: Train      },
  { key: 'products', label: 'Products',    icon: Package    },
  { key: 'reviews',  label: 'Reviews',     icon: Star       },
  { key: 'vendor',   label: 'Vendors',     icon: Store      },
  { key: 'users',    label: 'Users',       icon: Users      },
] as const;

type TabKey = typeof TABS[number]['key'];

/* ─── Page ───────────────────────────────────────────────────────────────── */
const ResultPage = ({
  products,
  openOrderProducts,
  featuredProducts,
  reviews,
  vendors,
  users,
  usersSearchResult
}: IResultsPageProps) => {
  const router = useRouter();
  const queryTab = (router.query.tab as TabKey) ?? 'top';
  const [searchString, setSearchString] = useState(router.query.search?.toString() ?? '');
  const [filterTab, setFilterTab] = useState<TabKey>(queryTab);
  const [inputValue, setInputValue] = useState(router.query.search?.toString() ?? '');

  const doSearch = (str: string) => {
    setSearchString(str);
    router.push(`/order-train/result?search=${encodeURIComponent(str)}&tab=${filterTab}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(inputValue);
  };

  const handleTabChange = (key: TabKey) => {
    setFilterTab(key);
    router.push(`/order-train/result?search=${encodeURIComponent(searchString)}&tab=${key}`, undefined, {
      shallow: true,
    });
  };

  /* Count helpers for badge display */
  const counts: Record<TabKey, number> = {
    top: products.length + openOrderProducts.length + usersSearchResult?.length + vendors?.length + reviews?.length,
    train: openOrderProducts.length,
    products: products.length,
    reviews: reviews.length,
    vendor: vendors.length,
    users: usersSearchResult.length,
  };

  console.log({vendors})

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <Head>
        <title>{searchString ? `"${searchString}" — Search` : 'Search results'} | Zuta</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Header search={false} />

      {/* ── SEARCH HEADER ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 sticky top-[56px] z-30">
        <div className="max-w-6xl mx-auto px-4 py-3">
          {/* Search bar row */}
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => router.back()}
              aria-label="Go back"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <form onSubmit={handleSubmit} className="flex-1 flex items-center bg-slate-100 rounded-xl overflow-hidden border border-transparent focus-within:border-orange-300 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search products, trains, vendors…"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none bg-transparent"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => { setInputValue(''); doSearch(''); }}
                  className="mr-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 transition-colors text-white text-sm font-semibold px-4 py-2.5 shrink-0"
              >
                Search
              </button>
            </form>
          </div>

          {/* Result count */}
          {searchString && (
            <p className="text-xs text-slate-400 mb-2 px-1">
              {counts[filterTab]} result{counts[filterTab] !== 1 ? 's' : ''} for{' '}
              <span className="font-semibold text-slate-600">"{searchString}"</span>
            </p>
          )}

          {/* Filter tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
            {TABS.map(({ key, label, icon: Icon }) => {
              const active = filterTab === key;
              return (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                    active
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  {counts[key] > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        active ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {counts[key]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── BODY: 3-col layout on desktop ──────────────────────────────────── */}
      <div className="max-w-full mx-auto px-4 py-6 flex gap-6">

        {/* Left sidebar — featured products */}
        <aside className="hidden lg:flex flex-col gap-4 w-56 shrink-0">
          <div className="bg-white rounded-2xl border-l border-slate-100 shadow-sm overflow-hidden">
            <div className="pt-3 pl-1.5 border-b border-slate-50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Featured products
              </h3>
            </div>
            <div className="flex flex-col gap-3 px-1.5">
              {
              featuredProducts?.length ? 
                featuredProducts?.slice(0, 4)
                .map((product: any) => (
                  <FeaturedProductCard key={product.id} product={product} />
                )) : null}
            </div>
          </div>
        </aside>

        {/* Center: results */}
        <main className="flex-1 min-w-0">
          {filterTab === 'top' && (
            <TopResultsTab
              search_string={searchString}
              orders={openOrderProducts}
              products={products}
              vendors={vendors}
              users={usersSearchResult}
              reviews={reviews}
            />
          )}
          {filterTab === 'train' && (
            <TrainResultsTab search_string={searchString} orders={openOrderProducts} />
          )}
          {filterTab === 'products' && (
            <ProductResultsTab search_string={searchString} products={products} />
          )}
          {filterTab === 'reviews' && (
            <ReviewResultsTab search_string={searchString} reviews={reviews} />
          )}
          {filterTab === 'vendor' && (
            <VendorResultsTab search_string={searchString} vendors={vendors} />
          )}
          {filterTab === 'users' && (
            <UsersResultTab search_string={searchString} users={usersSearchResult} />
          )}
        </main>

        {/* Right sidebar — who to follow */}
        <aside className="hidden md:flex flex-col gap-3 w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-36">
            <div className="px-4 py-3 border-b border-slate-50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Who to follow
              </h3>
            </div>
            <div className="p-1 flex flex-col gap-2">
              {
                users?.length ?
                users?.slice(0,5)?.map((u) => (
                  <ExploreUserMiniCard 
                    key={u.id} 
                    id={u.id} 
                    name={`${u.first_name} ${u?.last_name}`} 
                    image={u.picture} 
                    is_following={u?.is_following}
                  />
                )) : (
                  <div className="flex flex-col gap-2 items-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                      <PersonStanding className="w-8 h-8 text-slate-300" />
                    </div>
                    <Link href={'/auth/signIn'}>
                      <p className="text-sm text-slate-400 mt-1 cursor-pointer">
                        Sign in to follow Shoppers
                      </p>
                  </Link>
                  </div>
                )
              }
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ResultPage;

/* ─── Server-side data fetching ──────────────────────────────────────────── */
export async function getServerSideProps(context: any) {
  const cookies = parse(context.req.headers.cookie || '');
  const user = JSON.parse(cookies.user || 'null');
  const token = user?.access_token;

  try {
    const search = context.query.search ?? '';

    const [
      productsResult,
      openOrderProductsResult,
      featuredProductsResult,
      reviewResults,
      vendorResults,
      usersResult,
      usersIndexResult,
    ] = await Promise.allSettled([
      axiosInstance.post('/api/public/product/search/index', { search }),
      axiosInstance.post('/api/open-order/search/index', { search }),
      axiosInstance.post('/api/featured/product/search/index', { search }),
      axiosInstance.post('/api/review/product/search/index', { search }, { headers: { Authorization: token } }),
      axiosInstance.post('/api/public/vendor/search/index', { search }, { headers: { Authorization: token } }),
      axiosInstance.post('/api/public/user/search/index', { search }, { headers: { Authorization: token } }),
      axiosInstance.get('/api/public/user/index', { headers: { Authorization: token } }),
    ]);

    const safeData = (r: PromiseSettledResult<any>) =>
      r.status === 'fulfilled' ? r.value?.data?.data?.data ?? r.value?.data?.data ?? [] : [];
    
    return {
      props: {
        products: safeData(productsResult),
        openOrderProducts: safeData(openOrderProductsResult),
        featuredProducts: safeData(featuredProductsResult),
        reviews: safeData(reviewResults),
        vendors: safeData(vendorResults),
        usersSearchResult: safeData(usersResult),
        users: safeData(usersIndexResult),
      },
    };
  } catch (error: any) {
    console.error(error);
    if (error?.response?.status === 401) {
      return { redirect: { destination: '/auth/signIn', permanent: false } };
    }
    return {
      props: {
        products: [],
        openOrderProducts: [],
        featuredProducts: [],
        reviews: [],
        vendors: [],
        users: [],
        usersSearchResult: [],
      },
    };
  }
}