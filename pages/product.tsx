import Head from 'next/head';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useEffect, useState, useRef } from 'react';
import router from 'next/router';
import { Fade } from 'react-awesome-reveal';
import Header from '../Components/Header';
import { sendAxiosRequest } from '../Utils/sendAxiosRequest';
import SwiperSlider from '../Components/sliders/Swiper';
import { calculateNextDiscount } from '../Utils/calculateDiscount';
import MyGallery from '../Components/sliders/MyGallery';
import HorizontalSlider from '../Components/lists/HorizontalSlider';
import axiosInstance from '../Utils/axiosConfig';
import { formatAmount } from '../Utils/formatAmount';
import { capitalizeFirstLetter } from '../Utils/capitalizeFirstLettersOfString';
import ProductDetailsSideDrawer from '../Components/drawer/ProductDetailsSideDrawer';
import { processImgUrl } from '../Utils/helper';
import { couponValidateAction } from '../requests/coupons/coupons.requests';

import {
  ShoppingCart, Zap, ChevronDown, ChevronUp,
  MessageCircle, Star, Users, Info, PlayCircle,
  Tag, CheckCircle2, Loader2, TrendingDown,
  ChevronRight, Sparkles,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface IProductPageProps {
  product: {
    id: number;
    vendor_id: string;
    product_name: string;
    product_introduction: string;
    product_description: string;
    product_summary?: string;
    product_price: number;
    product_discount: number;
    quantity: number;
    status: string;
    featured_status: string;
    product_categories: string[];
    product_tags: string[];
    product_images: string[];
    product_videos: string[];
    product_testimonials: string[];
    product_faqs: any[];
    openOrders: any;
    reviews: any[];
  };
  similar_products: any;
  featured_similar_products: any;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const StarRow = ({
  rating,
  height = 4,
  width = 4,
}: {
  rating: number;
  height?: number;
  width?: number;
}) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-${width} h-${height} ${
          star <= Math.round(rating)
            ? 'text-amber-400 fill-amber-400'
            : 'text-slate-200 fill-slate-200'
        }`}
      />
    ))}
  </div>
);

const RatingBar = ({ label, pct }: { label: string; pct: number }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs text-slate-500 w-12 shrink-0">{label}</span>
    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-amber-400 rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
    <span className="text-xs text-slate-400 w-8 text-right shrink-0">
      {Math.round(pct)}%
    </span>
  </div>
);

/* ─── Discount tier row ──────────────────────────────────────────────────── */
interface DiscountTier {
  label: string;
  minBuyers: number;
  discountPct: number;
  price: number;
  isCurrent?: boolean;
}

const DiscountTierRow = ({ tier }: { tier: DiscountTier }) => (
  <div
    className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
      tier.isCurrent
        ? 'bg-orange-500 text-white'
        : 'bg-slate-50 text-slate-600'
    }`}
  >
    <div className="flex items-center gap-2">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
          tier.isCurrent
            ? 'bg-white text-orange-500'
            : 'bg-slate-200 text-slate-500'
        }`}
      >
        {tier.minBuyers}+
      </div>
      <span className="text-xs font-medium">{tier.label}</span>
    </div>
    <div className="text-right">
      <p
        className={`text-sm font-bold leading-none ${
          tier.isCurrent ? 'text-white' : 'text-slate-800'
        }`}
      >
        {formatAmount(tier.price)}
      </p>
      <p
        className={`text-[10px] mt-0.5 ${
          tier.isCurrent ? 'text-orange-100' : 'text-slate-400'
        }`}
      >
        {tier.discountPct}% off
      </p>
    </div>
  </div>
);

/* ─── Page ───────────────────────────────────────────────────────────────── */
function ProductPage({
  product,
  similar_products,
  featured_similar_products,
}: IProductPageProps) {
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [similarProductOpenOrder, setSimilarProductOpenOrder] = useState<any>(null);
  const drawerRef = useRef<any>(null);
  const [selectedFAQ, setSelectedFAQ] = useState<any>(
    product?.product_faqs?.length ? product.product_faqs[0] : {}
  );
  const [currentReviewPage, setCurrentReviewPage] = useState(0);

  /* Coupon state */
  const [couponCode, setCouponCode] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  let user: any = {};
  if (typeof window !== 'undefined') {
    user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
  }

  /* Reviews math */
  const itemsPerPage = 8;
  const reviewPages: any[][] = [];
  for (let i = 0; i < product?.reviews?.length; i += itemsPerPage) {
    reviewPages.push(product.reviews.slice(i, i + itemsPerPage));
  }
  const totalReviews = product?.reviews?.length || 0;
  const countForScore = (s: number) =>
    product?.reviews?.filter((r: any) => r.score === s).length || 0;
  const pctForScore = (s: number) =>
    totalReviews > 0 ? (countForScore(s) / totalReviews) * 100 : 0;
  const averageScore =
    totalReviews > 0
      ? (
          product.reviews.reduce((acc: number, r: any) => acc + r.score, 0) /
          totalReviews
        ).toFixed(1)
      : '0';

  /* Pricing */
  const basePrice = product?.product_price ?? 0;
  const baseDiscount = product?.product_discount ?? 0;
  const regularDiscountedPrice = basePrice - (baseDiscount / 100) * basePrice;
  const effectivePrice = Math.max(0, regularDiscountedPrice - couponDiscount);

  /* Order train discount tiers */
  const trainTiers: DiscountTier[] = [
    {
        label: 'Starter (you join)',
        minBuyers: 1,
        discountPct: baseDiscount,
        price: basePrice - calculateNextDiscount(4, baseDiscount, basePrice),
        isCurrent: true,
    },
    {
        label: 'Small group',
        minBuyers: 5,
        discountPct: Math.min(baseDiscount + 5, 60),
        price: basePrice - calculateNextDiscount(3, baseDiscount, basePrice),
    },
    {
        label: 'Growing train',
        minBuyers: 15,
        discountPct: Math.min(baseDiscount + 10, 70),
        price: basePrice - calculateNextDiscount(2, baseDiscount, basePrice),
    },
    {
        label: 'Full train 🎉',
        minBuyers: 30,
        discountPct: Math.min(baseDiscount + 15, 80),
        price: basePrice - calculateNextDiscount(1, baseDiscount, basePrice),
    },
  ];

  const bestTrainPrice = trainTiers[trainTiers.length - 1].price;
  const maxSaving = basePrice - bestTrainPrice;

  /* Coupon validation */
  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    couponValidateAction(couponCode)
      .then((response) => {
        if (response.status === 200) {
          const coupon = response?.data?.data;
          setCouponDiscount(coupon?.amount ?? 0);
          setCouponApplied(true);
          toast.success(
            `Coupon applied! You save an extra ${formatAmount(coupon?.amount)}`
          );
        }
      })
      .catch(() => toast.error('Invalid or expired coupon code'))
      .finally(() => setValidatingCoupon(false));
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponApplied(false);
  };

  /* Cart */
  const addToCart = async (newProduct: any) => {
    const cart: any = JSON.parse(localStorage.getItem('cart')!) || {
      products: [],
      bundles: [],
      subscriptions: [],
    };
    let found = false;
    cart.products = cart.products.map((item: any) => {
      if (item.id === newProduct.id) {
        found = true;
        return {
          ...item,
          order_count: item.order_count + 1,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    if (!found) {
      cart.products.push({
        ...newProduct,
        product_id: newProduct.id,
        order_count: 1,
        quantity: 1,
        price: newProduct.product_price,
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success('Added to cart');
    if (user?.access_token) {
      await axiosInstance
        .post(
          '/api/cart/update',
          { ...cart, user_id: user.id },
          { headers: { Authorization: user.access_token } }
        )
        .catch(console.error);
    }
  };

  useEffect(() => {
    if (similar_products?.data?.length > 0) {
      const sp = similar_products.data.find(
        (item: any) => item.openOrders !== null
      );
      if (sp) setSimilarProductOpenOrder(sp.openOrders);
    }
  }, []);

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <Head>
        <title>{product.product_name}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <ProductDetailsSideDrawer
        title={product.product_name}
        description={product.product_description}
        introduction={product.product_introduction}
        ref={drawerRef}
      />

      <Header search={false} />

      <MyGallery
        show={showImageGallery}
        setShow={() => setShowImageGallery(false)}
        slides={product?.product_images ?? []}
      />

      <main className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 pb-28 md:pb-10">

        {/* ── PRODUCT HERO ────────────────────────────────────────────────── */}
        <section className="flex flex-col lg:flex-row gap-6 lg:gap-10">

          {/* Image */}
          <div
            className="w-full lg:w-[380px] shrink-0 cursor-zoom-in"
            onClick={() => setShowImageGallery(true)}
          >
            <div className="h-72 md:h-96 lg:h-[420px] rounded-2xl overflow-hidden bg-slate-200">
              <SwiperSlider slides={product?.product_images ?? []} />
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">
              Tap image to view full gallery
            </p>
          </div>

          {/* Info panel */}
          <div className="flex-1 flex flex-col gap-4">

            {/* Categories + name + intro */}
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {product.product_categories?.slice(0, 3).map((cat: string) => (
                  <span
                    key={cat}
                    className="text-[11px] font-medium text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug capitalize mb-2">
                {capitalizeFirstLetter(product?.product_name)}
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                {product?.product_introduction}
                <button
                  onClick={() => drawerRef.current?.open()}
                  className="text-orange-500 font-medium ml-1 hover:underline"
                >
                  Read more
                </button>
              </p>
            </div>

            {/* Ratings */}
            {totalReviews > 0 && (
              <div className="flex items-center gap-2">
                <StarRow rating={Number(averageScore)} />
                <span className="text-sm font-semibold text-slate-700">
                  {averageScore}
                </span>
                <span className="text-sm text-slate-400">
                  ({totalReviews} reviews)
                </span>
              </div>
            )}

            {/* ── PRICING CARD ─────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

              {/* Current price header */}
              <div className="px-4 pt-4 pb-3 border-b border-slate-50">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                  Price
                </p>
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-800">
                      {formatAmount(
                        couponApplied ? effectivePrice : basePrice
                        // couponApplied ? effectivePrice : regularDiscountedPrice
                      )}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {baseDiscount > 0 && (
                      <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                        {baseDiscount}% off
                      </span>
                    )}
                    {couponApplied && (
                      <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        −{formatAmount(couponDiscount)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Active open order */}
              {product.openOrders && (
                <div className="mx-4 mt-3 flex items-center justify-between bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-[10px] text-orange-600 font-semibold uppercase tracking-wider mb-0.5">
                      🚂 Active order train price
                    </p>
                    <p className="text-xl font-black text-orange-600">
                      {formatAmount(product.openOrders.open_order_price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 line-through mb-1">
                      {formatAmount(basePrice)}
                    </p>
                    <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-lg">
                      {product.openOrders.open_order_discount}% OFF
                    </span>
                  </div>
                </div>
              )}

              {/* ── ORDER TRAIN DISCOUNT TIERS ──────────────────────────────── */}
              <div className="px-4 pt-3 pb-3">
                <div className="flex items-center gap-2 mb-2.5">
                  <TrendingDown className="w-4 h-4 text-orange-500" />
                  <p className="text-xs font-bold text-slate-700">
                    Price drops as more people join your train
                  </p>
                </div>

                <div className="space-y-1.5">
                  {trainTiers.map((tier, i) => (
                    <DiscountTierRow key={i} tier={tier} />
                  ))}
                </div>

                {/* Max saving callout */}
                <div className="mt-3 flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5">
                  <Sparkles className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-green-700 font-medium leading-snug">
                    Start a train and save up to{' '}
                    <span className="font-black text-green-800">
                      {formatAmount(maxSaving)}
                    </span>{' '}
                    when the train fills — you'll be refunded automatically.
                  </p>
                </div>
              </div>

              {/* ── COUPON CODE ──────────────────────────────────────────────── */}
              <div className="px-4 py-3 border-t border-slate-50">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
                  Have a coupon?
                </p>

                {couponApplied ? (
                  /* Applied state */
                  <div className="flex items-center justify-between bg-purple-50 border border-purple-100 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-purple-700 leading-none">
                          "{couponCode}" applied
                        </p>
                        <p className="text-[11px] text-purple-500 mt-0.5">
                          Saving {formatAmount(couponDiscount)} on this order
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[11px] font-semibold text-purple-400 hover:text-red-500 transition-colors ml-2 shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  /* Input state */
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 flex-1 border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 focus-within:border-orange-300 focus-within:bg-white transition-all">
                      <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') validateCoupon();
                        }}
                        placeholder="COUPON CODE"
                        className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 uppercase font-mono tracking-wider"
                      />
                    </div>
                    <button
                      onClick={validateCoupon}
                      disabled={!couponCode.trim() || validatingCoupon}
                      className={`flex items-center justify-center gap-1.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                        couponCode.trim()
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {validatingCoupon ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Apply'
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Info footer */}
              <div className="px-4 pb-3 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-300 mt-0.5 shrink-0" />
                <p className="text-[11px] text-slate-400 leading-snug">
                  Train prices shown are estimates based on buyer tiers. Actual
                  price depends on final join count — refunds are automatic.
                </p>
              </div>
            </div>

            {/* ── CTA BUTTONS ──────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow-sm shadow-orange-200"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to cart
              </button>
              <button
                onClick={() => router.push(`/order-train/${product?.id}`)}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white active:scale-95 transition-all font-bold py-3.5 px-6 rounded-xl text-sm"
              >
                <Zap className="w-4 h-4" />
                Start order train
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              Terms and conditions apply · Price protection guaranteed
            </p>

            {/* Similar product nudge */}
            {similarProductOpenOrder && (
              <div className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <div>
                  <p className="text-xs text-amber-700 font-medium mb-0.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Similar product available
                  </p>
                  <p className="text-sm font-bold text-amber-800">
                    {formatAmount(similarProductOpenOrder?.open_order_price)}
                  </p>
                </div>
                <button
                  onClick={() =>
                    router.push(`/openOrder?id=${similarProductOpenOrder?.id}`)
                  }
                  className="text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 transition-colors px-3 py-2 rounded-lg flex items-center gap-1"
                >
                  Join train <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── PRODUCT VIDEOS ──────────────────────────────────────────────── */}
        {product?.product_videos?.length > 0 && (
          <section className="mt-10">
            <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-orange-500" />
              Product videos
            </h2>
            <div className="flex flex-row gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.product_videos.map((video, i) => (
                <div
                  key={i}
                  className="shrink-0 rounded-xl overflow-hidden bg-slate-900"
                >
                  <video
                    src={processImgUrl(video)}
                    className="h-56 w-72 object-cover rounded-xl"
                    controls
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
        {product?.product_testimonials?.length > 0 && (
          <section className="mt-10 bg-slate-800 rounded-2xl p-5">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-orange-400" />
              Hear from our customers
            </h2>
            <div className="flex flex-row gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.product_testimonials.map((video, i) => (
                <div key={i} className="shrink-0 rounded-xl overflow-hidden">
                  <video
                    src={processImgUrl(video)}
                    className="h-52 w-64 object-cover rounded-xl"
                    controls
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── REVIEWS ─────────────────────────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            Customer reviews
          </h2>

          {reviewPages.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Summary */}
              <div className="lg:w-72 shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 h-fit space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-slate-800">
                    {averageScore}
                  </span>
                  <div>
                    <StarRow rating={Number(averageScore)} />
                    <p className="text-xs text-slate-400 mt-1">
                      {totalReviews} ratings
                    </p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <RatingBar
                      key={star}
                      label={`${star} star`}
                      pct={pctForScore(star)}
                    />
                  ))}
                </div>
              </div>

              {/* Review cards */}
              <div className="flex-1 space-y-4">
                <p className="text-sm font-semibold text-slate-600">
                  Latest reviews
                </p>
                {reviewPages[currentReviewPage]?.map(
                  (review: any, index: number) => (
                    <div
                      key={`${review.user?.name}${index}`}
                      className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-2"
                    >
                      <div className="flex items-center gap-3">
                        {review?.user?.picture ? (
                          <img
                            src={processImgUrl(review.user.picture)}
                            alt={review.user?.name}
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                            <span className="text-orange-600 text-sm font-semibold">
                              {review.user?.name?.[0]?.toUpperCase() ?? 'U'}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-slate-800 capitalize leading-none mb-0.5">
                            {review.user?.name}
                          </p>
                          <StarRow rating={review.score} height={3} width={3} />
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  )
                )}

                {reviewPages.length > 1 && (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      disabled={currentReviewPage === 0}
                      onClick={() => setCurrentReviewPage((p) => p - 1)}
                      className="text-sm font-medium text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Previous
                    </button>
                    <span className="text-xs text-slate-400">
                      {currentReviewPage + 1} / {reviewPages.length}
                    </span>
                    <button
                      disabled={currentReviewPage === reviewPages.length - 1}
                      onClick={() => setCurrentReviewPage((p) => p + 1)}
                      className="text-sm font-medium text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-16 bg-white rounded-2xl border border-slate-100">
              <MessageCircle className="w-12 h-12 text-slate-200" />
              <p className="text-slate-400 font-medium">No reviews yet</p>
              <p className="text-sm text-slate-300">
                Be the first to review this product
              </p>
            </div>
          )}
        </section>

        {/* ── FEATURED SIMILAR ────────────────────────────────────────────── */}
        {featured_similar_products?.data?.length > 0 && (
          <section className="mt-10">
            <HorizontalSlider
              list={featured_similar_products.data}
              list_name="Recommended for you"
              type='FEATURED'
              page='/product?id='
            />
          </section>
        )}

        {/* ── PRODUCT SUMMARY HTML ────────────────────────────────────────── */}
        {product?.product_summary && (
          <section className="mt-10 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div
              dangerouslySetInnerHTML={{ __html: product.product_summary }}
              className="prose prose-sm max-w-none text-slate-600
                prose-headings:text-slate-800 prose-headings:font-semibold
                prose-a:text-orange-500 prose-strong:text-slate-700"
            />
          </section>
        )}

        {/* ── FAQs ────────────────────────────────────────────────────────── */}
        {product?.product_faqs?.length > 0 && (
          <section className="mt-10">
            <h2 className="text-base font-semibold text-slate-800 mb-5">
              Frequently asked questions
            </h2>
            <div className="space-y-2">
              <Fade cascade triggerOnce>
                {product.product_faqs.map((faq: any, index: number) => {
                  const isOpen = selectedFAQ?.question === faq?.question;
                  return (
                    <div
                      key={faq?.question}
                      className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                        isOpen
                          ? 'border-orange-200 shadow-sm'
                          : 'border-slate-100'
                      }`}
                    >
                      <button
                        onClick={() => setSelectedFAQ(isOpen ? {} : faq)}
                        className="flex items-center justify-between w-full text-left px-5 py-4 gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-orange-50 text-orange-500 text-xs font-bold flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <p className="text-sm font-medium text-slate-700 capitalize leading-snug">
                            {faq?.question}
                          </p>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-orange-500 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 pt-0">
                          <p className="text-sm text-slate-500 leading-relaxed bg-slate-50 rounded-lg px-4 py-3">
                            {faq?.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </Fade>
            </div>
          </section>
        )}

        {/* ── SIMILAR PRODUCTS ────────────────────────────────────────────── */}
        {similar_products?.data?.length > 0 && (
          <section className="mt-10">
            <HorizontalSlider
              list={similar_products.data}
              list_name="Customers also viewed"
              type='PRODUCT'
              page='/product?id='
            />
          </section>
        )}
      </main>

      {/* ── MOBILE STICKY CTA ───────────────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-2">
        {couponApplied && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-purple-600 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Coupon applied · saving {formatAmount(couponDiscount)}
          </div>
        )}
        <div className="flex gap-3">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white font-bold py-3.5 rounded-xl text-sm active:scale-95 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to cart
          </button>
          <button
            onClick={() => router.push(`/order-train/${product?.id}`)}
            className="flex-1 flex items-center justify-center gap-2 border-2 border-orange-500 text-orange-500 font-bold py-3.5 rounded-xl text-sm active:scale-95 transition-all"
          >
            <Zap className="w-4 h-4" />
            Order train
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;

/* ─── Server-side data fetching ──────────────────────────────────────────── */
export async function getServerSideProps(context: any) {
  try {
    const { id } = context.query;
    const getProduct = await sendAxiosRequest(
      `/api/public/product/show?id=${id}`,
      'get',
      {},
      '',
      ''
    );
    return {
      props: {
        product: getProduct?.data?.product,
        similar_products: getProduct?.data?.similar_products,
        featured_similar_products: getProduct?.data?.featured_similar_products,
      },
    };
  } catch (err: any) {
    console.error(err);
    return {
      props: {
        product: {},
        similar_products: [],
        featured_similar_products: [],
      },
    };
  }
}