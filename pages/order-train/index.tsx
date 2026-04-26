// import Header from "../../Components/Header"
// import { sendAxiosRequest } from "../../Utils/sendAxiosRequest";
// import OpenOrderProductCard from "../../Components/cards/OpenOrderProductCard";
// import FilterAndSearchGroup from "../../Components/inputs/FilterAndSearchGroup";
// import TextImageCard from "../../Components/cards/TextImageCard";
// import { useRouter } from "next/router";

// interface IOrderTrainProps {
//     openOrders: any[];
//     trendingOpenOrders: any[];
//     topSavingsOpenOrders: any[];
//     categories: any[];
//     tags: any[];
//     featured: any[];
//     catalogues: any[];
// }

// const OrderTrainIndex = ({openOrders, trendingOpenOrders, topSavingsOpenOrders, categories, tags, featured, catalogues}: IOrderTrainProps) => {
//     const router = useRouter();

//     const searchOpenOrders = (searchStr: string) => {
//         router.push(`/order-train/result?search=${searchStr}&tab=train`)
//     }

//   return (
//     <div className="flex flex-col w-full bg-white min-h-screen relative">
//         <Header search={false} />
//         <div className="flex flex-col gap-8 mt-2">
//             <div className="flex flex-col justify-center items-center gap-1 lg:gap-4 mx-4">
//                 <h1 className="text-4xl text-slate-700 font-bold">
//                     Let's buy it <span className="text-orange-500">Together</span>
//                 </h1>
//                 <p className="font-medium text-slate-600 text-center">Join open 
//                     <span className="text-slate-700 mx-1 !font-bold">order train</span> to enjoy 
//                     <span className="text-orange-500 mx-1">wholesale discount</span> 
//                     prices
//                 </p>
//             </div>

//             <div className="flex flex-col gap-4">
//                 <div className="flex flex-col gap-4 px-4 lg:px-20">
//                     <div className="w-[90%] lg:w-[60%] mx-auto">
//                         <FilterAndSearchGroup
//                             searchInputPlaceHolder="Search order train by product name, category, tags"
//                             onSearch={searchOpenOrders}
//                             onFilterButtonClick={()=>{}}
//                         />
//                     </div>

//                     <h4 className="text-slate-800 font-bold">Trending</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                         {
//                             trendingOpenOrders?.length > 0 && trendingOpenOrders?.map((order:any, index: number) => (
//                                 <OpenOrderProductCard
//                                     key={`${order.name} + ${index}`}
//                                     order={order} 
//                                 />
//                             ))
//                         }
//                     </div>
//                 </div>

//                 <div className="flex flex-col gap-2 justify-between w-full py-8 bg-gray-100 px-4 lg:px-20">
//                     <span className='text-base text-slate-800 font-bold'>
//                         Categories
//                     </span>
//                     <div className="flex flex-row gap-4 py-4 overflow-x-scroll">
//                         {
//                             categories?.length > 0 && categories?.map((category: any, index: number) => (
//                                 <TextImageCard 
//                                     key={`${category.name} ${index}`}
//                                     image={category?.image}
//                                     title={category.name}
//                                     link={`/order-train/result?search=${category.name}&tab=train`}
//                                 />
//                             ))
//                         }
//                     </div>
//                 </div>

//                 <div className="flex flex-col gap-4 px-4 lg:px-20">
//                     <h4 className="text-slate-800 font-bold">Top Savings</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                         {
//                             topSavingsOpenOrders?.length > 0 && topSavingsOpenOrders?.slice(0,10).map((order:any, index: number) => (
//                                 <OpenOrderProductCard
//                                     key={`${order.name} + ${index}`}
//                                     order={order} 
//                                 />
//                             ))
//                         }
//                     </div>
//                 </div>

//                 <div className="flex flex-col gap-2 justify-between w-full py-8 bg-gray-100 px-4 lg:px-20">
//                     <span className='text-base text-slate-800 font-bold'>
//                         Tags
//                     </span>
//                     <div className="flex flex-row gap-4 py-4 overflow-x-scroll">
//                         {
//                             tags?.length > 0 && tags?.map((tag: any, index: number) => (
//                                 <TextImageCard 
//                                     key={`${tag.name} ${index}`}
//                                     image={tag?.image}
//                                     title={tag.name}
//                                     link={`/order-train/result?search=${tag.name}&tab=train`}
//                                 />
//                             ))
//                         }
//                     </div>
//                 </div>
                
//                 <div className="flex flex-col gap-4 mb-16 px-4 lg:px-20">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                         {
//                             openOrders?.length > 0 && openOrders?.map((order:any, index: number) => (
//                                 <OpenOrderProductCard
//                                     key={`${order.name} + ${index}`}
//                                     order={order} 
//                                 />
//                             ))
//                         }
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default OrderTrainIndex

// export async function getServerSideProps() {
//     try{
//         const getOpenOrders = await sendAxiosRequest(
//             '/api/open-order/index?properties=1',
//             'get',
//             {},
//             '',
//             ''
//         );
//         const getTrendingOpenOrders = await sendAxiosRequest(
//             '/api/open-order/trending?properties=1',
//             'get',
//             {},
//             '',
//             ''
//         );
//         const getTopSavingsOpenOrders = await sendAxiosRequest(
//             '/api/open-order/savings?properties=1',
//             'get',
//             {},
//             '',
//             ''
//         );
//         const getCategories = await sendAxiosRequest(
//             '/api/product/category/index',
//             'get',
//             {},
//             '',
//             ''
//         );
//         const getTags = await sendAxiosRequest(
//             '/api/product/tag/index',
//             'get',
//             {},
//             '',
//             ''
//         );
//         const getFeaturedProducts = await sendAxiosRequest(
//             '/api/featured/product/filter/index',
//             'post',
//             {status: 'active'},
//             '',
//             ''
//         );
//         const getAdvertBanners = await sendAxiosRequest(
//             '/api/advert/banners/filter/index',
//             'post',
//             {enabled: 1},
//             '',
//             ''
//         );
  
//         const [openOrdersResult, trendingOpenOrdersResult, topSavingsOpenOrdersResult, categoriesResult, tagsResult, featuredResult, bannersResult] = await Promise.allSettled([
//             getOpenOrders,
//             getTrendingOpenOrders,
//             getTopSavingsOpenOrders,
//             getCategories,
//             getTags,
//             getFeaturedProducts,
//             getAdvertBanners
//         ]);
        
//         const openOrders = openOrdersResult.status === 'fulfilled' && openOrdersResult?.value ? openOrdersResult?.value?.data : [];
//         const trendingOpenOrders = trendingOpenOrdersResult.status === 'fulfilled' && trendingOpenOrdersResult?.value ? trendingOpenOrdersResult?.value?.data : [];
//         const topSavingsOpenOrders = topSavingsOpenOrdersResult.status === 'fulfilled' && topSavingsOpenOrdersResult?.value ? topSavingsOpenOrdersResult?.value?.data : [];
//         const categories = categoriesResult.status === 'fulfilled' ? categoriesResult?.value?.data : [];
//         const tags = tagsResult.status === 'fulfilled' ? tagsResult?.value?.data : [];      
//         const featured = featuredResult.status === 'fulfilled' ? featuredResult?.value?.data : [];      
//         const banners = bannersResult.status === 'fulfilled' ? bannersResult?.value?.data : [];      

//         return {
//             props: {
//                 openOrders: openOrders?.data ?? [],
//                 trendingOpenOrders: trendingOpenOrders ?? [],
//                 topSavingsOpenOrders: topSavingsOpenOrders?.data ?? [],
//                 categories: categories ?? [],
//                 tags: tags ?? [],
//                 featured: featured?.data ?? [],
//                 catalogues: banners?.data ??  []
//             },
//         }
//     } catch(error: any) {
//         console.log({error})
//         if(error?.response?.status === 401) {
//             return {
//                 redirect: {
//                   destination: '/auth/signIn',
//                   permanent: false
//                 }
//             }
//         }
//         return {
//             props: {
//                 openOrders: [],
//                 trendingOpenOrders: [],
//                 topSavingsOpenOrders: [],
//                 categories: [],
//                 tags: [],
//                 featured: [],
//                 catalogues: []
//             },
//         }
//     }
// }

import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Search, TrendingUp, Percent, Train, Users, Clock, Tag, Sparkles, ChevronRight, Filter } from 'lucide-react';
import Header from '../../Components/Header';
import OpenOrderProductCard from '../../Components/cards/OpenOrderProductCard';
import { sendAxiosRequest } from '../../Utils/sendAxiosRequest';

interface IOrderTrainProps {
  openOrders: any[];
  trendingOpenOrders: any[];
  topSavingsOpenOrders: any[];
  categories: any[];
  tags: any[];
  featured: any[];
  catalogues: any[];
}

/* ─── Section header ─────────────────────────────────────────────────────── */
const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  onMore,
  iconColor = 'text-orange-500',
  iconBg = 'bg-orange-50',
}: {
  icon: any;
  title: string;
  subtitle?: string;
  onMore?: () => void;
  iconColor?: string;
  iconBg?: string;
}) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <h2 className="text-base font-bold text-slate-800 leading-none">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {onMore && (
      <button
        onClick={onMore}
        className="flex items-center gap-1 text-orange-500 text-xs font-semibold hover:text-orange-600 transition-colors"
      >
        See all <ChevronRight className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

/* ─── Stats bar ──────────────────────────────────────────────────────────── */
const STATS = [
  { icon: Train, label: 'Active trains', value: '1,200+' },
  { icon: Users, label: 'Buyers joined', value: '48,000+' },
  { icon: Percent, label: 'Avg. savings', value: '32%' },
  { icon: Clock, label: 'Trains closing today', value: '14' },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */
const OrderTrainIndex = ({
  openOrders,
  trendingOpenOrders,
  topSavingsOpenOrders,
  categories,
  tags,
  featured,
  catalogues,
}: IOrderTrainProps) => {
  const router = useRouter();
  const [searchStr, setSearchStr] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchStr.trim()) {
      router.push(`/order-train/result?search=${encodeURIComponent(searchStr)}&tab=train`);
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <Head>
        <title>Order Trains — Buy Together, Save More</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Header search={false} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-slate-800 pt-10 pb-16 px-4 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <Train className="w-3.5 h-3.5" />
            Group buying · Wholesale prices
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
            Buy together,{' '}
            <span className="text-orange-400">save more</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto">
            Join an open order train for a product. As more people buy in, the price drops — 
            and everyone gets refunded the difference automatically.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-xl overflow-hidden shadow-lg max-w-xl mx-auto">
            <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
            <input
              type="text"
              placeholder="Search by product name, category, or tag…"
              value={searchStr}
              onChange={(e) => setSearchStr(e.target.value)}
              className="flex-1 px-3 py-3.5 text-sm text-slate-700 placeholder-slate-400 outline-none bg-transparent"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 transition-colors text-white font-semibold text-sm px-5 py-3.5 shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
          {STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center py-5 px-4 gap-1">
              <Icon className="w-4 h-4 text-orange-400 mb-1" />
              <span className="text-xl font-bold text-slate-800">{value}</span>
              <span className="text-[11px] text-slate-400 text-center">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-12">

        {/* ── FEATURED / CATALOGUES ────────────────────────────────────────── */}
        {catalogues?.length > 0 && (
          <section>
            <SectionHeader
              icon={Sparkles}
              title="Featured trains"
              subtitle="Handpicked order trains with the best deals"
              onMore={() => router.push('/order-train/result?tab=featured')}
            />
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
              {catalogues.map((catalogue: any, index: number) => (
                <div
                  key={index}
                  onClick={() => router.push(`/openOrder?id=${catalogue?.open_order_id ?? catalogue?.id}`)}
                  className="shrink-0 w-64 md:w-72 cursor-pointer rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200"
                >
                  <div className="relative h-36 bg-slate-200">
                    {catalogue?.image && (
                      <img
                        src={catalogue.image}
                        alt={catalogue?.title ?? 'Featured train'}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {catalogue?.discount && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white text-[11px] font-bold px-2 py-1 rounded-lg">
                        {catalogue.discount}% OFF
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white text-sm font-semibold leading-snug line-clamp-2">
                        {catalogue?.title ?? catalogue?.product?.product_name ?? 'Featured Deal'}
                      </p>
                    </div>
                  </div>
                  {catalogue?.subtitle && (
                    <div className="bg-white px-3 py-2">
                      <p className="text-xs text-slate-500 line-clamp-1">{catalogue.subtitle}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── FEATURED OPEN ORDERS (from featured prop) ────────────────────── */}
        {featured?.length > 0 && (
          <section>
            <SectionHeader
              icon={Sparkles}
              title="Editor's picks"
              subtitle="Top order trains selected by our team"
              iconColor="text-purple-500"
              iconBg="bg-purple-50"
              onMore={() => router.push('/order-train/result?tab=train&filter=featured')}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {featured.slice(0, 8).map((order: any, index: number) => (
                <OpenOrderProductCard
                  key={`featured-${order?.id ?? index}`}
                  order={order}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── TRENDING ─────────────────────────────────────────────────────── */}
        {trendingOpenOrders?.length > 0 && (
          <section>
            <SectionHeader
              icon={TrendingUp}
              title="Trending trains"
              subtitle="Most joined in the last 24 hours"
              iconColor="text-rose-500"
              iconBg="bg-rose-50"
              onMore={() => router.push('/order-train/result?tab=train&filter=trending')}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {trendingOpenOrders.slice(0, 8).map((order: any, index: number) => (
                <OpenOrderProductCard
                  key={`trend-${order?.id ?? index}`}
                  order={order}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
        {categories?.length > 0 && (
          <section>
            <SectionHeader
              icon={Tag}
              title="Browse by category"
              subtitle="Find trains in your favourite category"
              iconColor="text-blue-500"
              iconBg="bg-blue-50"
            />
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
              {categories.map((category: any, index: number) => (
                <button
                  key={`cat-${index}`}
                  onClick={() =>
                    router.push(`/order-train/result?search=${encodeURIComponent(category.name)}&tab=train`)
                  }
                  className="shrink-0 flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-slate-100 hover:border-orange-300 hover:shadow-sm transition-all duration-200 group min-w-[80px]"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-50 group-hover:bg-orange-100 transition-colors shrink-0">
                    {category?.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 group-hover:text-orange-600 transition-colors text-center leading-tight">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── TOP SAVINGS ──────────────────────────────────────────────────── */}
        {topSavingsOpenOrders?.length > 0 && (
          <section>
            <SectionHeader
              icon={Percent}
              title="Top savings"
              subtitle="Biggest discounts available right now"
              iconColor="text-green-600"
              iconBg="bg-green-50"
              onMore={() => router.push('/order-train/result?tab=train&filter=savings')}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {topSavingsOpenOrders.slice(0, 8).map((order: any, index: number) => (
                <OpenOrderProductCard
                  key={`saving-${order?.id ?? index}`}
                  order={order}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── TAGS ─────────────────────────────────────────────────────────── */}
        {tags?.length > 0 && (
          <section>
            <SectionHeader
              icon={Tag}
              title="Browse by tag"
              subtitle="Explore trains by product type"
              iconColor="text-slate-500"
              iconBg="bg-slate-100"
            />
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: any, index: number) => (
                <button
                  key={`tag-${index}`}
                  onClick={() =>
                    router.push(`/order-train/result?search=${encodeURIComponent(tag.name)}&tab=train`)
                  }
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-100 hover:border-orange-300 hover:bg-orange-50 text-slate-600 hover:text-orange-600 text-xs font-medium rounded-full transition-all duration-200"
                >
                  {tag?.image && (
                    <img src={tag.image} alt="" className="w-4 h-4 rounded-full object-cover" />
                  )}
                  {tag.name}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── ALL OPEN ORDERS ──────────────────────────────────────────────── */}
        {openOrders?.length > 0 && (
          <section className="pb-8">
            <SectionHeader
              icon={Train}
              title="All open trains"
              subtitle="Join any train and start saving"
              onMore={() => router.push('/order-train/result?tab=train')}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {openOrders.map((order: any, index: number) => (
                <OpenOrderProductCard
                  key={`order-${order?.id ?? index}`}
                  order={order}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {!openOrders?.length && !trendingOpenOrders?.length && !topSavingsOpenOrders?.length && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <Train className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-400 font-medium text-center">No order trains available right now</p>
            <p className="text-sm text-slate-300 text-center max-w-xs">
              Check back soon or search for a product to start your own train
            </p>
          </div>
        )}
      </div>

      {/* ── HOW IT WORKS — sticky bottom teaser ──────────────────────────── */}
      <div className="bg-slate-800 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">
            How order trains work
          </p>
          <h3 className="text-white text-xl font-bold mb-8">
            More buyers = lower prices for everyone
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Join a train', desc: 'Pay at the current price and lock your spot' },
              { step: '02', title: 'Others join in', desc: 'The train fills up as more buyers come' },
              { step: '03', title: 'Price drops', desc: 'Every new member pushes the price lower' },
              { step: '04', title: 'Get refunded', desc: 'Auto-refund if the final price is lower' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center gap-2">
                <span className="text-2xl font-black text-orange-500/30">{step}</span>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrainIndex;

/* ─── Server-side data fetching ──────────────────────────────────────────── */
export async function getServerSideProps() {
  try {
    const [
      openOrdersResult,
      trendingResult,
      topSavingsResult,
      categoriesResult,
      tagsResult,
      featuredResult,
      bannersResult,
    ] = await Promise.allSettled([
      sendAxiosRequest('/api/open-order/index?properties=1', 'get', {}, '', ''),
      sendAxiosRequest('/api/open-order/trending?properties=1', 'get', {}, '', ''),
      sendAxiosRequest('/api/open-order/savings?properties=1', 'get', {}, '', ''),
      sendAxiosRequest('/api/product/category/index', 'get', {}, '', ''),
      sendAxiosRequest('/api/product/tag/index', 'get', {}, '', ''),
      sendAxiosRequest('/api/featured/product/filter/index', 'post', { status: 'active' }, '', ''),
      sendAxiosRequest('/api/advert/banners/filter/index', 'post', { enabled: 1 }, '', ''),
    ]);

    const val = (r: PromiseSettledResult<any>) =>
      r.status === 'fulfilled' ? r.value : null;

    return {
      props: {
        openOrders: val(openOrdersResult)?.data?.data ?? [],
        trendingOpenOrders: val(trendingResult)?.data ?? [],
        topSavingsOpenOrders: val(topSavingsResult)?.data?.data ?? [],
        categories: val(categoriesResult)?.data ?? [],
        tags: val(tagsResult)?.data ?? [],
        featured: val(featuredResult)?.data?.data ?? [],
        catalogues: val(bannersResult)?.data?.data ?? [],
      },
    };
  } catch (error: any) {
    console.error(error);
    if (error?.response?.status === 401) {
      return { redirect: { destination: '/auth/signIn', permanent: false } };
    }
    return {
      props: {
        openOrders: [],
        trendingOpenOrders: [],
        topSavingsOpenOrders: [],
        categories: [],
        tags: [],
        featured: [],
        catalogues: [],
      },
    };
  }
}