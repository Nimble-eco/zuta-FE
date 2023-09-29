import Head from 'next/head'
import Cookies from 'js-cookie'
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { injectStyle } from "react-toastify/dist/inject-style";
import Header from "../Components/Header"
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import SwiperSlider from '../Components/sliders/Swiper';
import MyGallery from '../Components/sliders/MyGallery';
import HorizontalSlider from '../Components/lists/HorizontalSlider';
import VerticalTextSlider from '../Components/sliders/VerticalTextSlider';
import axiosInstance from '../Utils/axiosConfig';

interface IOpenOrderProductPageProps {
    product: any;
    similar_products: any[];
}

const openOrder = ({product, similar_products}: IOpenOrderProductPageProps) => {
    console.log({product})
    const [showImageGallery, setShowImageGallery] = useState<boolean>(false);
    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo('en-US')

    let user: any = {};

    if(typeof window !== 'undefined') {
        injectStyle();
        user = JSON.parse(Cookies.get('user')!);
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
        product?.subscribers?.map((order: any) => {
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
        console.log({cart})
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
            className='w-full bg-white min-h-screen relative'
        >
            <Head>
                <title>{product.name}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <Header />

            <MyGallery 
                show={showImageGallery}
                setShow={toggleImageGallery}
                slides={product?.product?.product_images}
            />
            <ToastContainer />

            <div 
                className="flex flex-col md:flex-row justify-between w-[95%] mx-auto px-5 py-4 mt-10"
            >
                <div className='w-full md:w-1/3 md:!mr-3 cursor-pointer max-w-1/3 h-fit' onClick={toggleImageGallery}>
                    <SwiperSlider 
                        slides={product?.product?.product_images}
                    />
                </div>
                <div className="w-[95%] mx-auto md:w-2/3 flex flex-col mt-10 md:mt-0 md:!ml-8">
                    <h1 className="text-xl md:text-3xl font-mono justify-center">
                        {product.product?.product_name}
                    </h1>
                    <p className="text-gray-600 py-2">
                        {product.product?.product_description}
                    </p>
                    <div className="flex flex-row gap-6 w-full my-1">
                        <div 
                            className='flex flex-row gap-2'
                        >
                            <p className="text-gray-600 flex flex-col md:flex-row">
                                Price:
                            </p>
                            <span className='font-bold text-green-500'>
                                {product.open_order_price}
                            </span>
                        </div>
                        <div 
                            className='flex flex-row gap-2'
                        >
                            <p className="text-gray-600">
                                Current discount: 
                            </p>
                            <span className='font-semibold line-through'>
                                {product.open_order_discount}
                            </span>
                        </div>
                          
                    </div>
                    <div
                        className='flex flex-row gap-6 my-1'
                    >
                        <div 
                            className='flex flex-row gap-2'
                        >
                            <p className="text-gray-600">
                                Next price: {" "}
                            </p>
                            <span className='text-orange-500 font-semibold'>
                                N{product.next_price}
                            </span>
                        </div>
                        <div 
                            className='flex flex-row gap-2'
                        >
                            <p className="text-gray-600 flex flex-col md:flex-row">
                                Next discount:
                            </p>
                            <span className='text-orange-500 font-medium line-through'>
                                {product.next_discount}
                            </span>
                        </div>   
                    </div>
                </div>
            </div>

            <div className='flex flex-col md:flex-row w-[90%] md:w-[50%] mx-auto justify-between mt-10'>
                <div className='max-w-[50%] mx-auto'>
                    <VerticalTextSlider 
                        list={getRecentOrderList()}
                        list_name='Recent orders'
                    />
                </div>

                <button
                    onClick={() => addToCart(product)}
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-[50%] mx-auto md:w-[40%] lg:w-[30%] md:ml-4 mt-3"
                >
                    Add to Cart
                </button>
            </div>

            <div className='mt-10 w-[95%] ml-[5%]'>
                <HorizontalSlider 
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
                product: getProduct.data.data.openOrder,
                similar_products: getProduct.data.data.similar_products.data
            }
        }
    }
    catch(err: any) {
        throw new Error(err.message);
    }
    
}