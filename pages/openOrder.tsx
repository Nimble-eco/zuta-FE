import Head from 'next/head';
import Cookies from 'js-cookie';
import { useRef, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { BsShieldCheck, BsTruck, BsArrowRight } from 'react-icons/bs';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

// Components & Utils
import Header from "../Components/Header";
import SwiperSlider from '../Components/sliders/Swiper';
import MyGallery from '../Components/sliders/MyGallery';
import VerticalTextSlider from '../Components/sliders/VerticalTextSlider';
import axiosInstance from '../Utils/axiosConfig';
import SimilarProductsHorizontalSlider from '../Components/lists/SimilarProductsHorizontalSlider';
import ProductDetailsSideDrawer from '../Components/drawer/ProductDetailsSideDrawer';
import RatingsCard from '../Components/cards/RatingsCard';
import { formatAmount } from '../Utils/formatAmount';
import { capitalizeFirstLetter, processImgUrl } from '../Utils/helper';
import en from 'javascript-time-ago/locale/en'
import TimeAgo from 'javascript-time-ago';
import { X, XCircle } from 'lucide-react';
import { Button } from '../Components/buttons/button';

interface IOpenOrderProductPageProps {
    product: any;
    similar_products: any[];
}

const openOrder = ({ product, similar_products }: IOpenOrderProductPageProps) => {
    const [showImageGallery, setShowImageGallery] = useState<boolean>(false);
    const [selectedFAQ, setSelectedFAQ] = useState(product?.product?.product_faqs?.[0] || null);
    const [currentReviewPage, setCurrentReviewPage] = useState(0);
    const ProductDetailsSideDrawerRef = useRef<any>(null);
    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo('en-US');

    let user: any = {};

    if(typeof window !== 'undefined') {
        user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
    }

    const toggleImageGallery = () => setShowImageGallery(!showImageGallery);

    // Logic for reviews
    const itemsPerPage = 6;
    const reviewPages = useMemo(() => {
        const pages = [];
        for (let i = 0; i < (product?.reviews?.length || 0); i += itemsPerPage) {
            pages.push(product?.reviews?.slice(i, i + itemsPerPage));
        }
        return pages;
    }, [product?.reviews]);

    const averageScore = useMemo(() => {
        if (!product?.reviews?.length) return 0;
        return (product.reviews.reduce((acc: number, r: any) => acc + r.score, 0) / product.reviews.length).toFixed(1);
    }, [product?.reviews]);

    const addToCart = async (newProduct: any) => {
        const cart: any = JSON.parse(localStorage.getItem('cart')!) || {products: [], bundles: [], subscriptions: []};
        let newCart = cart;
        let obj = newCart.subscriptions?.find((item: any, i: number) => {
            if(item.id === newProduct.id){
            newCart.subscriptions[i].quantity++;
            localStorage.setItem("cart", JSON.stringify(newCart));
            return true;
            }
        })
        if(!obj) {
            cart?.subscriptions.push({...newProduct, quantity: 1});
            localStorage.setItem("cart", JSON.stringify(cart));
        }

        window.dispatchEvent(new Event('cartUpdated'));
        toast.success('cart updated');

        if(user?.access_token) {
            await axiosInstance.post('/api/cart/update', {
                ...cart,
                user_id: user.id,
                open_order_products: cart.subscriptions
            }, {
                headers: {
                    Authorization: user.access_token
                }
            })
        }
    };
    console.log({product})

    return (
        <div className='!w-full bg-slate-50 min-h-screen pb-20 lg:pb-10 relative overflow-scroll'>
            <Head>
                <title>{product?.product_name || 'Product Details'}</title>
            </Head>

            <Header search={false} />
            
            <ProductDetailsSideDrawer
                title={product?.product?.product_name}
                description={product?.product?.product_description}
                introduction={product?.product?.product_introduction}
                ref={ProductDetailsSideDrawerRef}
            />

            <MyGallery 
                show={showImageGallery}
                setShow={toggleImageGallery}
                slides={product?.product?.product_images}
            />

            <main className='w-full px-4 pt-8 lg:pt-12'>
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
                    
                    {/* LEFT: Visuals & Content */}
                    <div className='lg:col-span-7 flex flex-col gap-10'>
                        {/* Image Section */}
                        <section className='bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100'>
                            <div className='aspect-square lg:aspect-video cursor-zoom-in' onClick={() => setShowImageGallery(true)}>
                                <SwiperSlider slides={product?.product?.product_images} />
                            </div>
                        </section>

                        {/* Description Section */}
                        <section className='space-y-4'>
                            <h1 className='text-3xl font-bold text-slate-900 capitalize leading-tight'>
                                {product?.product?.product_name}
                            </h1>
                            <div className='prose prose-slate max-w-none'>
                                <p className='text-slate-600 leading-relaxed'>
                                    {product?.product?.product_introduction}
                                    <button 
                                        onClick={() => ProductDetailsSideDrawerRef.current?.open()}
                                        className="text-orange-600 font-semibold ml-2 hover:underline"
                                    >
                                        View full details
                                    </button>
                                </p>
                            </div>
                        </section>

                        {/* Media Section (Videos) */}
                        {product?.product?.product_videos?.length > 0 && (
                            <section className='space-y-4'>
                                <h2 className='text-xl font-bold'>Watch in Action</h2>
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {product.product.product_videos.map((video: string, i: number) => (
                                        <video key={i} src={processImgUrl(video)} controls className='h-64 w-48 object-cover rounded-xl shadow-lg flex-shrink-0 bg-black' />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* RIGHT: Pricing & Sticky Actions */}
                    <div className='lg:col-span-5'>
                        <div className='sticky top-24 space-y-6'>
                            <div className='bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6'>
                                {/* Price Card */}
                                <div className='flex flex-col md:flex-row md:items-end justify-between'>
                                    <div>
                                        <p className='text-sm text-slate-500 font-medium'>Current Train Price</p>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-4xl font-black text-orange-600'>{formatAmount(product.open_order_price)}</span>
                                            <span className='text-lg text-slate-400 line-through'>{formatAmount(product.open_order_discount)}</span>
                                        </div>
                                    </div>
                                    {
                                        product?.status === 'open' && (
                                            <div className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit'>
                                                Live Deal
                                            </div>
                                        )
                                    }
                                </div>

                                {/* Order Train Progress Visualizer */}
                                <div className='bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200'>
                                    <p className='text-xs font-bold text-slate-600 uppercase mb-3 flex items-center gap-2'>
                                        <BsArrowRight className='text-orange-500'/> Next Price Drop
                                    </p>
                                    <div className='flex justify-between items-center mb-1'>
                                        <span className='text-sm font-semibold text-slate-700'>{formatAmount(product.next_price)}</span>
                                        <span className='text-xs text-slate-400'>Target: Next 5 orders</span>
                                    </div>
                                    <div className='w-full h-2 bg-slate-200 rounded-full overflow-hidden'>
                                        <div className='h-full bg-orange-500 w-[65%]' />
                                    </div>
                                </div>

                                {/* Trust Badges */}
                                <div className='grid grid-cols-2 gap-4 text-[11px] font-medium text-slate-500 uppercase'>
                                    <div className='flex items-center gap-2'><BsTruck className='text-lg text-orange-400'/> Fast Delivery</div>
                                    <div className='flex items-center gap-2'><BsShieldCheck className='text-lg text-orange-400'/> Secured Payment</div>
                                </div>

                                {/* CTA */}
                                <Button
                                    onClick={() => addToCart(product)}
                                    disabled={product?.status !== 'open'}
                                    className="w-full bg-orange-600 hover:bg-orange-700 h-14 font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-200 flex justify-center items-center gap-2 group"
                                >
                                    { product?.status === 'open' ? 'Join the Order Train' : 'Closed' }
                                    {
                                        product?.status === 'open' ?
                                        <BsArrowRight className='group-hover:translate-x-1 transition-transform'/> :
                                        <XCircle className='group-hover:translate-x-1 transition-transform text-red-800'/>
                                    }
                                </Button>
                            </div>

                            {/* Recent Activity */}
                            {product?.subscribersList?.length > 0 && (
                                <div className='bg-slate-900 rounded-2xl p-4 overflow-hidden relative'>
                                    <div className='relative z-10 text-white'>
                                        <VerticalTextSlider 
                                            list={product?.subscribersList.map((o: any) => `${capitalizeFirstLetter(o.name)} joined the train about ${timeAgo.format(new Date(o?.created_at))}`)} 
                                            list_name='Live Activity'
                                        />
                                    </div>
                                    <div className='absolute top-0 right-0 p-4 opacity-10 font-black text-3xl italic leading-none text-white'>LIVE</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTIONS: Full Width */}
                <div className='mt-20 space-y-20'>
                    
                    {/* Reviews */}
                    <section className='bg-white rounded-3xl p-8 lg:p-12 border border-slate-100'>
                        <div className='flex flex-col lg:flex-row gap-12'>
                            <div className='lg:w-1/3 space-y-6'>
                                <h2 className='text-3xl font-bold'>Community Feedback</h2>
                                <div className='flex items-center gap-4'>
                                    <div className='text-5xl font-black text-slate-900'>{averageScore}</div>
                                    <div>
                                        <RatingsCard rating={Number(averageScore)} hight={6} width={6} />
                                        <p className='text-sm text-slate-500'>{product?.reviews?.length} verified buyers</p>
                                    </div>
                                </div>
                                {/* Simplified Star Bars (Map these dynamically if needed) */}
                                <div className='space-y-2'>
                                    {[5,4,3,2,1].map(star => (
                                        <div key={star} className='flex items-center gap-3 text-sm'>
                                            <span className='w-4 font-bold'>{star}</span>
                                            <div className='flex-1 h-2 bg-slate-100 rounded-full overflow-hidden'>
                                                <div className='h-full bg-orange-500 w-[80%]' />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='lg:w-2/3 space-y-8'>
                                {reviewPages[currentReviewPage]?.map((review: any, i: number) => (
                                    <div key={i} className='border-b border-slate-100 pb-6'>
                                        <div className='flex items-center gap-3 mb-3'>
                                            <img src={processImgUrl(review.user?.picture)} className='w-10 h-10 rounded-full object-cover' alt="" />
                                            <div>
                                                <h4 className='font-bold text-slate-900'>{review.user?.name}</h4>
                                                <RatingsCard rating={review.score} />
                                            </div>
                                        </div>
                                        <p className='text-slate-600'>{review.comment}</p>
                                    </div>
                                ))}
                                {/* Pagination Controls */}
                                <div className='flex justify-between items-center pt-4'>
                                    <button disabled={currentReviewPage === 0} onClick={() => setCurrentReviewPage(p => p - 1)} className='px-4 py-2 text-sm font-bold disabled:opacity-30 uppercase tracking-widest'>Prev</button>
                                    <button disabled={currentReviewPage === reviewPages.length - 1} onClick={() => setCurrentReviewPage(p => p + 1)} className='px-4 py-2 text-sm font-bold disabled:opacity-30 uppercase tracking-widest'>Next</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Accordion */}
                    {product?.product?.product_faqs?.length > 0 && (
                        <section className='max-w-3xl mx-auto'>
                            <h2 className='text-3xl font-bold text-center mb-12'>Frequently Asked</h2>
                            <div className='space-y-4'>
                                {product.product.product_faqs.map((faq: any, i: number) => (
                                    <div 
                                        key={i} 
                                        className={`rounded-2xl border transition-all cursor-pointer ${selectedFAQ === faq ? 'border-orange-500 bg-orange-50' : 'border-slate-200 bg-white'}`}
                                        onClick={() => setSelectedFAQ(selectedFAQ === faq ? null : faq)}
                                    >
                                        <div className='p-5 flex justify-between items-center'>
                                            <span className='font-bold text-slate-800'>{faq.question}</span>
                                            {selectedFAQ === faq ? <MdKeyboardArrowUp size={24}/> : <MdKeyboardArrowDown size={24}/>}
                                        </div>
                                        {selectedFAQ === faq && (
                                            <div className='px-5 pb-5 text-slate-600 animate-fade-in'>
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Similar Products */}
                    {similar_products?.length > 0 && (
                        <section className='pb-20'>
                            <SimilarProductsHorizontalSlider 
                                list={similar_products}
                                list_name='People also viewed'
                            />
                        </section>
                    )}
                </div>
            </main>

            {/* Mobile Sticky CTA */}
            <div className='lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50'>
                <div className='flex items-center justify-between gap-4'>
                    <div>
                        <p className='text-[10px] uppercase font-bold text-slate-400'>Total Price</p>
                        <p className='text-xl font-black text-orange-600'>{formatAmount(product.open_order_price)}</p>
                    </div>
                    <button 
                        onClick={() => addToCart(product)}
                        className='bg-orange-600 text-white font-bold py-3 px-8 rounded-xl flex-1'
                    >
                        Join Train
                    </button>
                </div>
            </div>
        </div>
    );
};

export default openOrder;

export async function getServerSideProps(context: any) {
    try{
        const { id } = context.query;

        const getProduct = await axiosInstance.get(`/api/open-order/show?id=${id}&properties=1`);
      
        return {
            props: {
                product: getProduct.data.data,
                similar_products: getProduct.data.data.similar_products.data
            }
        }
    }
    catch(err: any) {
        console.log({err})
        return {
            props: {
                product: {},
                similar_products: []
            }
        }
    }
    
}