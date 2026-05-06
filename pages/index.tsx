import { useRouter } from 'next/router';
import { ArrowRightCircle } from 'lucide-react';
import CategoryCard from '../Components/cards/CategoryCard';
import OpenOrderProductCard from '../Components/cards/OpenOrderProductCard';
import Header from '../Components/Header';
import ProductComponent from '../Components/ProductComponent';
import SwiperSlider from '../Components/sliders/Swiper';
import HorizontalSlider from '../Components/lists/HorizontalSlider';
import SocialProofBar from '../Components/SocialProofBar';
import VendorCTABanner from '../Components/VendorCTABanner';
import BottomNav from '../Components/navigation/BottomNav';
import { sendAxiosRequest } from '../Utils/sendAxiosRequest';
import { cataloguesDummyData } from '../data/catalogues';

interface IHomePageProps {
  products: any[];
  openOrders: any[];
  categories: any[];
  tags: any[];
  featured: any[];
  catalogues: any[];
}

/* ─── Trust pills shown in hero ─────────────────────────────────────────── */
const TRUST_PILLS = [
  { label: 'Wholesale prices', icon: '✓' },
  { label: 'Price protection', icon: '↑' },
  { label: 'Group buying', icon: '⚡' },
];

/* ─── Section wrapper ────────────────────────────────────────────────────── */
const SectionHeader = ({
  title,
  onMore,
  moreLabel = 'See all',
}: {
  title: string;
  onMore?: () => void;
  moreLabel?: string;
}) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-base font-semibold text-slate-800">{title}</h2>
    {onMore && (
      <button
        onClick={onMore}
        className="flex items-center gap-1 text-orange-500 text-sm font-medium hover:text-orange-600 transition-colors"
      >
        {moreLabel}
        <ArrowRightCircle className="w-4 h-4" />
      </button>
    )}
  </div>
);

/* ─── Page ───────────────────────────────────────────────────────────────── */
const Home = ({ products, openOrders, categories, tags, featured, catalogues }: IHomePageProps) => {
  const router = useRouter();

  const searchProducts = (searchStr: string) => router.push(`/results?search=${searchStr}`);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 pb-20 md:pb-0">
      <Header onSearch={searchProducts} />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="bg-white px-4 pt-5 pb-6 border-b border-slate-100">
        {/* Headline */}
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight mb-2">
            Buy together,{' '}
            <span className="text-orange-500">Save More</span>
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed max-w-md">
            Join group orders and unlock wholesale prices. Get refunded automatically if the discount grows after you join.
          </p>
        </div>

        {/* Trust pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {TRUST_PILLS.map((pill) => (
            <span
              key={pill.label}
              className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full"
            >
              <span>{pill.icon}</span>
              {pill.label}
            </span>
          ))}
        </div>

        {/* Banner slider */}
        <div className="h-44 md:h-56 w-full rounded-2xl overflow-hidden">
          <SwiperSlider
            slides={cataloguesDummyData}
            // slides={catalogues?.map(c => c.image)}
            slidesToShow={2}
            imageUrlSrc={false}
          />
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-5 mt-2 border-b border-slate-100">
        <SectionHeader
          title="Shop by category"
          onMore={() => router.push('/departments')}
        />

        {/* Desktop: single row */}
        <div className="hidden lg:flex flex-row items-center gap-3 overflow-x-auto pb-1">
          {categories.slice(0, 8).map((category: any, index: number) => (
            <div key={`cat-d-${index}`} className="min-w-[90px]">
              <CategoryCard image={category?.image} title={category.name} />
            </div>
          ))}
        </div>

        {/* Mobile / tablet: 4-col grid */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 lg:hidden">
          {categories.slice(0, 8).map((category: any, index: number) => (
            <CategoryCard
              key={`cat-m-${index}`}
              image={category?.image}
              title={category.name}
            />
          ))}
        </div>
      </section>

      {/* ── ORDER TRAINS ──────────────────────────────────────────────────── */}
      <section className="px-4 py-5 mt-2 bg-white border-b border-slate-100">
        <SectionHeader
          title="🚂 Join order trains"
          onMore={() => router.push('/order-train')}
          moreLabel="More"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {openOrders.slice(0, 8).map((order: any, index: number) => (
            <OpenOrderProductCard
              key={`order-${order.id ?? index}`}
              order={order}
            />
          ))}
        </div>
      </section>

      {/* ── SOCIAL PROOF ──────────────────────────────────────────────────── */}
      <SocialProofBar />

      {/* ── FEATURED / SHOWCASE ───────────────────────────────────────────── */}
      <section className="bg-white px-4 py-5 mt-2 border-b border-slate-100">
        <HorizontalSlider 
          list_name="✨ Featured picks" 
          list={featured} 
          page='/product?id='  
        />
      </section>

      {/* ── TAGS ──────────────────────────────────────────────────────────── */}
      {tags.length > 0 && (
        <section className="bg-white px-4 py-5 mt-2 border-b border-slate-100">
          <SectionHeader title="Trending now" onMore={() => router.push('/departments')} />

          {/* Horizontal scrollable chips */}
          <div className="flex flex-row gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {tags.slice(0, 10).map((tag: any, index: number) => (
              <button
                key={`tag-${index}`}
                onClick={() => router.push(`/results?tag=${encodeURIComponent(tag.name)}`)}
                className="flex items-center gap-1.5 shrink-0 px-3 py-2 bg-slate-50 hover:bg-orange-50 border border-slate-100 hover:border-orange-300 text-slate-600 hover:text-orange-600 text-xs font-medium rounded-full transition-all duration-200"
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

      {/* ── ALL PRODUCTS ──────────────────────────────────────────────────── */}
      <section className="px-4 py-5 mt-2 bg-white">
        <SectionHeader title="All products" />

        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.map((product: any, index: number) => (
            <ProductComponent
              key={`prod-${product.id ?? index}`}
              product={product}
            />
          ))}
        </div>
      </section>

      {/* ── VENDOR CTA ────────────────────────────────────────────────────── */}
      <VendorCTABanner />

      {/* ── MOBILE BOTTOM NAV ─────────────────────────────────────────────── */}
      <BottomNav />
    </div>
  );
};

export default Home;

/* ─── Server-side data fetching ─────────────────────────────────────────── */
export async function getServerSideProps() {
  try {
    const [
      productsResult,
      openOrdersResult,
      categoriesResult,
      tagsResult,
      featuredResult,
      bannersResult,
    ] = await Promise.allSettled([
      sendAxiosRequest('/api/public/product/index?properties=1', 'get', {}, '', ''),
      sendAxiosRequest('/api/open-order/filter/index', 'post', { status: 'open' }, '', ''),
      sendAxiosRequest('/api/product/category/index', 'get', {}, '', ''),
      sendAxiosRequest('/api/product/tag/index', 'get', {}, '', ''),
      sendAxiosRequest('/api/featured/product/filter/index', 'post', { status: 'active' }, '', ''),
      sendAxiosRequest('/api/advert/banners/filter/index', 'post', { enabled: 1 }, '', ''),
    ]);

    const val = (r: PromiseSettledResult<any>) =>
      r.status === 'fulfilled' ? r.value : null;

    return {
      props: {
        products: val(productsResult)?.data?.data ?? [],
        openOrders: val(openOrdersResult)?.data?.data ?? [],
        categories: val(categoriesResult)?.data ?? [],
        tags: val(tagsResult)?.data ?? [],
        featured: val(featuredResult)?.data?.data ?? [],
        catalogues: val(bannersResult)?.data?.data ?? [],
      },
    };
  } catch (err: any) {
    console.error(err?.toJSON?.() ?? err);
    return {
      props: {
        products: [],
        openOrders: [],
        categories: [],
        tags: [],
        featured: [],
        catalogues: [],
      },
    };
  }
}