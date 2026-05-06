// import { useState, useEffect } from "react";
// import RatingsCard from "../Components/cards/RatingsCard";
// import CartComponent from "../Components/cart/Cart";
// import Total from "../Components/cart/Total";
// import Header from "../Components/Header";
// import HorizontalSlider from "../Components/lists/HorizontalSlider";
// import { useRouter } from "next/router";
// import { formatAmount } from "../Utils/formatAmount";
// import axiosInstance from "../Utils/axiosConfig";
// import { processImgUrl } from "../Utils/helper";

// const cart = () => {
//     const [items, setItems] = useState<any>({});
//     const [similar_products, setSimilarProducts] = useState<any>({});
//     const [openOrderProducts, setOpenOrderProducts] = useState<any[]>([]);
//     const [featuredProducts, setFeaturedProducts] = useState<any>({});
//     const router = useRouter();

//     const handleQuantityChange = (key: string, index: number, newQuantity: number) => {
//         const updatedItems: any = JSON.parse(localStorage.getItem("cart")!);
//         updatedItems[key][index].quantity = newQuantity;
//         setItems(updatedItems);
//         localStorage.setItem("cart", JSON.stringify(updatedItems));
//     };

//     const handleRemove = (type: string, index: number) => {
//         const updatedItems = {
//             ...items, 
//             [type]: items[type].filter((_: any, i: number) => i !== index)
//         };
//         setItems(updatedItems);
//         localStorage.setItem("cart", JSON.stringify(updatedItems));
//     };

//     const getProductsInCategory = async (items: any) => {
//         let categoryList: any[] = [];
//         let tagsList: any[] = [];
//         for (const [propertyName, propertyArray] of Object.entries(items)) {
//             if (Array.isArray(propertyArray)) {
//                 for (const objectItem of propertyArray) {
//                     categoryList.push(objectItem?.product_categories ?? objectItem.product?.product_categories);
//                     tagsList.push(objectItem?.product_tags ?? objectItem.product?.product_tags);
//                 }
//             }
//         }

//         categoryList = categoryList.reduce((acc, curr) => acc.concat(curr), []);
//         tagsList = tagsList.reduce((acc, curr) => acc.concat(curr), []);

//         const showcaseRes = await axiosInstance.post('/api/featured/product/filter/index', {
//             product_categories: categoryList, 
//             product_tags: tagsList
//         });

//         const productsRes = await axiosInstance.post('/api/public/product/filter/index', {
//             product_categories: categoryList, 
//             product_tags: tagsList
//         });

//         const openOrdersRes = await axiosInstance.post('/api/open-order/filter/index', {
//             product_categories: categoryList, 
//             product_tags: tagsList
//         });

//         if(productsRes.status === 200) {
//             setSimilarProducts(productsRes.data?.data?.data?.splice(0, 6));
//         }

//         if(showcaseRes.status === 200) {
//             setFeaturedProducts(showcaseRes?.data?.data?.splice(0, 6));
//         }

//         if(openOrdersRes?.status === 200) {
//             setOpenOrderProducts(openOrdersRes?.data?.data?.data);
//         }
//     }

//     useEffect(() => {
//         let isMounted = true;

//         if(isMounted) {
//             let cart = JSON.parse(localStorage.getItem("cart")!);
//             setItems(cart);
//             getProductsInCategory(cart ?? {});
//         }

//         return () => {
//             isMounted = false;
//         }

//     }, []);

//   return (
//     <div className="flex flex-col bg-gray-100 relative min-h-screen overflow-scroll pb-40">
//         <Header />
//         <div className="flex flex-col gap-1 bg-white py-2 px-3 h-fit w-[90%] fixed bottom-0 left-[5%] right-[5%] shadow-md z-40 mb-4 lg:hidden">
//             <Total items={items} />
//             <button
//                 className="bg-orange-500 px-4 py-3 text-white rounded cursor-pointer"
//                 onClick={() => {
//                     localStorage.setItem("cart", JSON.stringify(items));
//                     router.push('/checkout')
//                 }}
//             >
//                 Proceed to Checkout
//             </button>
//         </div>
//         <div className="w-[95%] flex flex-col lg:flex-row mx-auto mt-12">
//             <div className="w-[90%] mx-auto lg:w-[70%] lg:mr-[2%] flex flex-col mb-4">
//                 <CartComponent items={items} onQuantityChange={handleQuantityChange} onRemove={handleRemove} />
//                 <div className="bg-white h-full rounded-md"></div>
//             </div>
//             <div className="flex flex-col w-[90%] mx-auto lg:w-[25%]">
//                 <div className="hidden lg:flex flex-col bg-white py-4 px-3 h-fit mb-4 rounded-md">
//                     <Total items={items} />
//                     <button
//                         className="bg-orange-500 px-4 py-3 text-white rounded cursor-pointer"
//                         onClick={() => {
//                             localStorage.setItem("cart", JSON.stringify(items));
//                             router.push('/checkout')
//                         }}
//                     >
//                         Proceed to Checkout
//                     </button>
//                 </div>
//                 <div className="flex flex-col py-3 bg-white pl-2 rounded-md">
//                     <h4 className="font-semibold my-3 text-lg text-center">Join these order train</h4>
//                     <div className="flex flex-col overflow-x-scroll lg:flex-col gap-4">
//                         {
//                             openOrderProducts?.map((order) => (
//                                 <a
//                                     className='flex flex-col lg:flex-row cursor-pointer lg:h-28 text-sm bg-slate-800 rounded-md px-1 py-1 min-w-[10rem] '
//                                     href={`/openOrder?id=${order?.id}`}
//                                     key={order.id}
//                                 >
//                                     <img
//                                         src={
//                                             order?.product?.product_images?.length ?
//                                             processImgUrl(order?.product?.product_images[0]) : ''
//                                         }
//                                         alt="product image"
//                                         className='lg:mr-3 h-40 lg:h-full rounded-md !object-cover !object-center'
//                                     />
                                    
//                                     <div 
//                                         className="flex flex-col gap-1 py-2"
//                                     >
//                                         <div className='flex flex-col'>
//                                             <h3 className='text-sm font-mono text-white line-clamp-2 capitalize'>
//                                                 {order?.product?.product_name}
//                                             </h3>
//                                             { order?.product.rating && <RatingsCard rating={order?.product.rating} /> }
//                                         </div>
//                                         <div 
//                                             className='flex flex-row lg:flex-col'
//                                         >
//                                             <p 
//                                                 className='text-orange-300 font-semibold mr-4'
//                                             >
//                                                 {formatAmount(order?.product?.product_price)}
//                                             </p>
//                                             <span className="text-xs text-gray-300">
//                                                 {order?.product?.product_discount}% Off
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </a>
//                             ))
//                         }
//                     </div>
//                 </div>
//             </div>
//         </div>

//         {
//             featuredProducts?.data?.data && featuredProducts?.data?.data?.length > 0 && (
//                 <div className='mt-10 w-[98%] ml-[2%]'>
//                     <HorizontalSlider
//                         list={featuredProducts}
//                         list_name='Recommended for you'
//                         page='/product?id='
//                     />
//                 </div>
//             )
//         }

//         {
//             similar_products && similar_products.length > 0 && (
//                 <div className='mt-10 w-[98%] ml-[2%]'>
//                     <HorizontalSlider
//                         list={similar_products}
//                         list_name='You might also like'
//                         page='/product?id='
//                     />
//                 </div>
//             )
//         }
//     </div>
//   );
// };

// export default cart;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  ShoppingBag, Trash2, Plus, Minus, Train,
  ChevronRight, Tag, Package, ArrowLeft, Loader2,
} from 'lucide-react';
import Header from '../Components/Header';
import CartComponent from '../Components/cart/Cart';
import HorizontalSlider from '../Components/lists/HorizontalSlider';
import axiosInstance from '../Utils/axiosConfig';
import { formatAmount } from '../Utils/formatAmount';
import { processImgUrl } from '../Utils/helper';

/* ─── Inline Total calculator ────────────────────────────────────────────── */
const getCartTotals = (items: any) => {
    let subtotal = 0;
    let count = 0;

    if (!items || typeof items !== 'object') return { subtotal, count };
    
    for (const arr of Object.values(items)) {
        if (!Array.isArray(arr)) continue;
        for (const item of arr as any[]) {
            const price = item?.price ?? item?.open_order_price ?? item?.product_price  ?? 0;
            const qty = item?.quantity ?? 1;
            subtotal += price * qty;
            count += qty;
        }
    }

    return { subtotal, count };
};

/* ─── Empty state ─────────────────────────────────────────────────────────── */
const EmptyCart = ({ onBrowse }: { onBrowse: () => void }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-5 bg-white rounded-2xl border border-slate-100">
    <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center">
      <ShoppingBag className="w-10 h-10 text-orange-300" />
    </div>
    <div className="text-center">
      <p className="text-lg font-bold text-slate-700">Your cart is empty</p>
      <p className="text-sm text-slate-400 mt-1 max-w-xs">
        You haven't added any items yet. Browse products and join order trains to start saving.
      </p>
    </div>
    <button
      onClick={onBrowse}
      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white font-semibold px-6 py-3 rounded-xl text-sm"
    >
      Browse products
    </button>
  </div>
);

/* ─── Order train sidebar card ────────────────────────────────────────────── */
const OrderTrainSideCard = ({ order }: { order: any }) => (
  <a
    href={`/openOrder?id=${order?.id}`}
    className="flex flex-row gap-3 items-center bg-white border border-slate-100 hover:border-orange-200 rounded-xl p-3 transition-all hover:shadow-sm group"
  >
    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
      <img
        src={
          order?.product?.product_images?.length
            ? processImgUrl(order.product.product_images[0])
            : 'https://via.placeholder.com/100'
        }
        alt={order?.product?.product_name}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-slate-700 capitalize line-clamp-2 leading-snug">
        {order?.product?.product_name}
      </p>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-sm font-bold text-orange-500">
          {formatAmount(order?.open_order_price ?? order?.product?.product_price)}
        </span>
        {order?.open_order_discount > 0 && (
          <span className="text-[10px] font-semibold text-white bg-red-500 px-1.5 py-0.5 rounded">
            {order.open_order_discount}% OFF
          </span>
        )}
      </div>
    </div>
    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-orange-400 transition-colors shrink-0" />
  </a>
);

/* ─── Page ───────────────────────────────────────────────────────────────── */
const CartPage = () => {
  const router = useRouter();
  const [items, setItems] = useState<any>({});
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [openOrderProducts, setOpenOrderProducts] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const { subtotal, count } = getCartTotals(items);
  const isEmpty = count === 0;

  const handleQuantityChange = (key: string, index: number, newQuantity: number) => {
    const updated: any = JSON.parse(localStorage.getItem('cart')!);
    updated[key][index].quantity = newQuantity;
    setItems({ ...updated });
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const handleRemove = (type: string, index: number) => {
    const updated = {
      ...items,
      [type]: items[type].filter((_: any, i: number) => i !== index),
    };
    setItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const getRecommendations = async (cartItems: any) => {
    // 1. Check if the cart is actually empty to avoid useless API calls
    const cartValues = Object.values(cartItems).flat();
    if (cartValues.length === 0) {
        setFeaturedProducts([]);
        setSimilarProducts([]);
        setOpenOrderProducts([]);
        return;
    }

    setLoadingRecommendations(true);
    try {
      const categorySet = new Set<string>();
      const tagsSet = new Set<string>();

      // 2. Efficient extraction using Sets to remove duplicates
      for (const item of cartValues as any[]) {
          const cats = item?.product_categories ?? item?.product?.product_categories ?? [];
          const tags = item?.product_tags ?? item?.product?.product_tags ?? [];
          
          if (Array.isArray(cats)) cats.forEach(c => categorySet.add(c));
          if (Array.isArray(tags)) tags.forEach(t => tagsSet.add(t));
      }

      const payload = { 
          product_categories: Array.from(categorySet), 
          product_tags: Array.from(tagsSet) 
      };

      const [showcaseRes, productsRes, openOrdersRes] = await Promise.allSettled([
          axiosInstance.post('/api/featured/product/filter/index', payload),
          axiosInstance.post('/api/public/product/filter/index', payload),
          axiosInstance.post('/api/open-order/filter/index', {...payload, status: 'open'}),
      ]);

      // Helper to extract data from AdonisJS paginated response
      // Path: res.value (Promise) -> .data (Axios) -> .data (Adonis JSON) -> .data (Lucid Paginate Array)
      const extractData = (res: any) => {
          if (res.status === 'fulfilled' && res.value.status === 200) {
              return res.value.data?.data?.data || res.value.data?.data || [];
          }
          return []; // Return empty array for 204 or failed requests
      };

      setFeaturedProducts(extractData(showcaseRes).slice(0, 6));
      setSimilarProducts(extractData(productsRes).slice(0, 6));
      setOpenOrderProducts(extractData(openOrdersRes));

    } catch (err) {
      console.error('Failed to load recommendations', err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') ?? 'null') ?? {};
    setItems(cart);
    getRecommendations(cart);
  }, []);

  const handleCheckout = () => {
    setCheckingOut(true);
    localStorage.setItem('cart', JSON.stringify(items));
    router.push('/checkout');
  };

  /* ── Order summary panel (shared between desktop sidebar + mobile sticky) */
  const OrderSummary = ({ compact = false }: { compact?: boolean }) => (
    <div className={compact ? '' : 'bg-white rounded-2xl border border-slate-100 shadow-sm p-5'}>
      {!compact && (
        <h2 className="text-base font-bold text-slate-800 mb-4">Order summary</h2>
      )}

      <div className="space-y-2.5 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">
            Subtotal ({count} item{count !== 1 ? 's' : ''})
          </span>
          <span className="font-semibold text-slate-800">{formatAmount(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Delivery</span>
          <span className="text-green-600 font-medium">Calculated at checkout</span>
        </div>
        <div className="pt-2 border-t border-slate-100 flex justify-between">
          <span className="font-bold text-slate-800">Total</span>
          <span className="text-xl font-black text-slate-800">{formatAmount(subtotal)}</span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={isEmpty || checkingOut}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all text-white font-bold py-3.5 rounded-xl text-sm"
      >
        {checkingOut ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Proceed to checkout
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>

      {!isEmpty && (
        <p className="text-[11px] text-slate-400 text-center mt-3">
          Secured checkout · Price protection guaranteed
        </p>
      )}
    </div>
  );

  console.log({openOrderProducts, featuredProducts, similarProducts})

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-32 md:pb-10">
      <Header />

      <main className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-6 space-y-6">

        {/* ── Page title ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:border-orange-300 transition-colors text-slate-600 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-none">
              My cart
            </h1>
            {!isEmpty && (
              <p className="text-xs text-slate-400 mt-0.5">
                {count} item{count !== 1 ? 's' : ''} · {formatAmount(subtotal)} total
              </p>
            )}
          </div>
        </div>

        {/* ── Main layout ─────────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Left: cart items */}
          <div className="flex-1 min-w-0 space-y-4">
            {isEmpty ? (
              <EmptyCart onBrowse={() => router.push('/')} />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-50">
                  <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-orange-500" />
                    Cart items
                  </h2>
                </div>
                <div className="p-4">
                  <CartComponent
                    items={items}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                  />
                </div>
              </div>
            )}

            {featuredProducts.length > 0 && (
              <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <HorizontalSlider
                  list={featuredProducts}
                  list_name="✨ Recommended for you"
                  page="/product?id="
                />
              </section>
            )}
          </div>

          {/* Right: summary + order trains */}
          <div className="w-full lg:w-80 shrink-0 space-y-4">

            {/* Order summary — desktop */}
            <div className="hidden lg:block">
              <OrderSummary />
            </div>

            {/* Order trains upsell */}
            {openOrderProducts.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-50 flex items-center gap-2">
                  <Train className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-none">
                      Join order trains
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Get these items at group prices
                    </p>
                  </div>
                </div>
                <div className="p-3 flex flex-col gap-2 max-h-80 overflow-y-auto">
                  {openOrderProducts.map((order) => (
                    <OrderTrainSideCard key={order.id} order={order} />
                  ))}
                </div>
              </div>
            )}

            {/* Promo placeholder */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-orange-700 leading-none mb-1">
                    Price protection
                  </p>
                  <p className="text-[11px] text-orange-600/80 leading-relaxed">
                    Join an order train for any product in your cart and get refunded automatically if the price drops.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Recommendations ─────────────────────────────────────────────── */}
        {!loadingRecommendations && (
          <>
            {similarProducts.length > 0 && (
              <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <HorizontalSlider
                  list={similarProducts}
                  list_name="You might also like"
                  page="/product?id="
                />
              </section>
            )}
          </>
        )}

        {loadingRecommendations && (
          <div className="flex items-center justify-center gap-2 py-10 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading recommendations…</span>
          </div>
        )}
      </main>

      {/* ── Mobile sticky footer ─────────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-100 px-4 pt-3 pb-safe pb-4">
        {!isEmpty && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">
              {count} item{count !== 1 ? 's' : ''}
            </span>
            <span className="text-base font-black text-slate-800">
              {formatAmount(subtotal)}
            </span>
          </div>
        )}
        <button
          onClick={handleCheckout}
          disabled={isEmpty || checkingOut}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all text-white font-bold py-3.5 rounded-xl text-sm"
        >
          {checkingOut ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Proceed to checkout
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CartPage;