import Head from 'next/head'
import Cookies from 'js-cookie'
import { useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { injectStyle } from "react-toastify/dist/inject-style";
import Header from "../Components/Header"
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import SwiperSlider from '../Components/sliders/Swiper';
import MyGallery from '../Components/sliders/MyGallery';
import VerticalTextSlider from '../Components/sliders/VerticalTextSlider';
import axiosInstance from '../Utils/axiosConfig';
import SimilarProductsHorizontalSlider from '../Components/lists/SimilarProductsHorizontalSlider';
import { formatAmount } from '../Utils/formatAmount';
import ProductDetailsSideDrawer from '../Components/drawer/ProductDetailsSideDrawer';

interface IOpenOrderProductPageProps {
    product: any;
    similar_products: any[];
}

const openOrder = ({product, similar_products}: IOpenOrderProductPageProps) => {
    const [showImageGallery, setShowImageGallery] = useState<boolean>(false);
    const ProductDetailsSideDrawerRef = useRef<any>(null);
    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo('en-US')

    let user: any = {};

    if(typeof window !== 'undefined') {
        injectStyle();
        user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
    }

    const toggleImageGallery = () => setShowImageGallery(!showImageGallery);

    const [currentReviewPage, setCurrentReviewPage] = useState(0);

    const itemsPerPage = 8;
    const reviewPages = [];

    for (let i = 0; i < product?.reviews?.length; i += itemsPerPage) {
        reviewPages.push(product?.reviews?.slice(i, i + itemsPerPage));
    }

    const getRecentOrderList = () => {
        const recentOrders: string[] = [];
        product?.subscribersList?.map((order: any) => {
            recentOrders.push(`${order?.user_id} purchased about ${timeAgo.format(new Date(order?.created_at))}`)
        });
        return recentOrders;
    }

    const addToCart = async (newProduct:any) => {
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
            .then((response) => console.log({response}))
            .catch(error => {
                console.log({error})
                // toast.error(error.response?.message || "You might need to log in")
            })
        }
    }

    return (
        <div
            className='w-full bg-white min-h-screen relative overflow-auto'
        >
            <Head>
                <title>{product.product_name}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <ProductDetailsSideDrawer
                title={product.product_name}
                description={product.product?.product_description}
                ref={ProductDetailsSideDrawerRef}
            />

            <Header />

            <MyGallery 
                show={showImageGallery}
                setShow={toggleImageGallery}
                slides={product?.product?.product_images}
            />
            <ToastContainer />

            <div 
                className="flex flex-col md:flex-row justify-between w-full px-5 py-4 mt-10"
            >
                <div className='w-full md:w-1/3 md:!mr-3 cursor-pointer max-w-1/3 h-fit' onClick={toggleImageGallery}>
                    <SwiperSlider 
                        slides={product?.product?.product_images}
                    />
                </div>
                <div className="w-[95%] mx-auto md:w-2/3 flex flex-col mt-10 md:mt-0 md:!ml-8">
                    <h1 className="text-xl md:text-3xl justify-center">
                        {product.product?.product_name}
                    </h1>
                    <p className="w-full text-gray-600 mb-2 lg:mb-0 line-clamp-4 lg:line-clamp-3 flex flex-row">
                        {product.product?.product_description}
                        <span className="text-orange-500 text-sm cursor-pointer ml-1" onClick={() => ProductDetailsSideDrawerRef.current?.open()}>...more</span>
                    </p>
                    <div className="flex flex-row gap-8 w-full mb-4">
                        <div 
                            className='flex flex-col lg:flex-row lg:gap-2'
                        >
                            <p className="text-gray-600 flex flex-col md:flex-row">
                                Price:
                            </p>
                            <span className='font-bold text-green-500'>
                                {formatAmount(product.open_order_price)}
                            </span>
                        </div>
                        <div 
                            className='flex flex-col lg:flex-row lg:gap-2'
                        >
                            <p className="text-gray-600">
                                Current discount: 
                            </p>
                            <span className='font-semibold line-through'>
                                {formatAmount(product.open_order_discount)}
                            </span>
                        </div>
                          
                    </div>
                    <div
                        className='flex flex-row gap-8'
                    >
                        <div 
                            className='flex flex-col lg:flex-row lg:gap-2'
                        >
                            <p className="text-gray-600">
                                Next price: {" "}
                            </p>
                            <span className='text-orange-500 font-semibold'>
                                {formatAmount(product.next_price)}
                            </span>
                        </div>
                        <div 
                            className='flex flex-col lg:flex-row lg:gap-2'
                        >
                            <p className="text-gray-600 flex flex-col md:flex-row">
                                Next discount:
                            </p>
                            <span className='text-orange-500 font-medium line-through'>
                                {formatAmount(product.next_discount)}
                            </span>
                        </div>   
                    </div>

                    <div className='flex flex-col md:flex-row gap-6 mt-6'>
                        <div className='max-w-[50%] !mx-auto md:!mx-0'>
                            <VerticalTextSlider 
                                list={getRecentOrderList()}
                                list_name='Recent orders'
                            />
                        </div>

                        <button
                            onClick={() => addToCart(product)}
                            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-[50%] !mx-auto md:w-[40%] md:!mx-0 lg:w-[30%] md:ml-4 mt-3 whitespace-nowrap"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            <div className='mt-10 w-[95%] ml-[5%]'>
                <SimilarProductsHorizontalSlider 
                    list={similar_products}
                    list_name='Similar items'
                />
            </div>

            { reviewPages.length > 0 ?
                <div className="my-10 flex flex-col w-[90%] mx-auto mb-10">
                    <h2 className="text-2xl font-mono text-orange-500 text-left mb-6">
                        Reviews
                    </h2> 
                    { reviewPages[currentReviewPage]?.map((review: any, index: number) => ( 
                        <div className="flex flex-col mb-4" key={`${review.name}${index}`}>
                            <h3 className="text-black justify-start font-normal text-base">
                                {review.name}
                            </h3>
                            <p className="text-gray-600">
                                {review.message}
                            </p>
                        </div>
                    ))} 
                    <div className='flex flex-row justify-end text-sm w-[80%] mx-auto'>
                        <button disabled={currentReviewPage === 0} onClick={() => setCurrentReviewPage(currentReviewPage - 1)} className='mr-3 cursor-pointer'>Previous</button>
                        <button disabled={currentReviewPage === reviewPages.length - 1} onClick={() => setCurrentReviewPage(currentReviewPage + 1)} className='mr-3 cursor-pointer'>Next</button>
                    </div>
                </div> : <p className='text-center text-xl mt-8'>No reviews yet</p>
            }
        </div>
  )
}

export default openOrder

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
        throw new Error(err.message);
    }
    
}