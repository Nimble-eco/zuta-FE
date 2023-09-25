import Head from 'next/head'
import Cookies from 'js-cookie'
import { toast, ToastContainer } from 'react-toastify';
import { injectStyle } from "react-toastify/dist/inject-style";
import { useEffect, useState } from 'react';
import Header from "../Components/Header"
import { sendAxiosRequest } from '../Utils/sendAxiosRequest';
import SwiperSlider from '../Components/sliders/Swiper';
import { calculateDiscount, calculateNextDiscount } from '../Utils/calculateDiscount';
import MyGallery from '../Components/sliders/MyGallery';
import HorizontalSlider from '../Components/lists/HorizontalSlider';
import axiosInstance from '../Utils/axiosConfig';
import router from 'next/router';

interface IProductPageProps {
    product: {
        id: number,
        vendor_id: string,
        product_name: string,
        product_description: string,
        product_price: number,
        product_discount: number,
        quantity: number,
        status: string,
        featured_status: string,
        product_categories: string[],
        product_tags: string[],
        product_images: string[],
        openOrders: any,
        reviews: any[]
    };
    similar_products: any[];
}

function product({product, similar_products}: IProductPageProps) {
    const [showImageGallery, setShowImageGallery] = useState<boolean>(false);
    const [similarProductOpenOrder, setSimilarProductOpenOrder] = useState<any>(null);

    const toggleImageGallery = () => setShowImageGallery(!showImageGallery);
    const [currentReviewPage, setCurrentReviewPage] = useState(0);

    let user: any = {};

    if(typeof window !== 'undefined') {
        injectStyle();
        user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
    }

    const itemsPerPage = 8;
    const reviewPages = [];

    const getSimilarProductOpenOrder = () => {
        const similar_product = similar_products.find((item) => item.openOrders !== null);
        setSimilarProductOpenOrder(similar_product.openOrders);
    }

    for (let i = 0; i < product?.reviews?.length; i += itemsPerPage) {
        reviewPages.push(product?.reviews?.slice(i, i + itemsPerPage));
    }

    const addToCart = async (newProduct:any) => {
        console.log({newProduct})
        const cart: any = JSON.parse(localStorage.getItem('cart')!) || {products: [], bundles: [], subscriptions: []};
        let newCart = cart;
        let obj = newCart.products.find((item: any, i: number) => {
          if(item.id === newProduct.id){
            newCart.products[i].order_count++;
            localStorage.setItem("cart", JSON.stringify(newCart));
            return true;
          }
        })
        if(!obj) {
            cart?.products.push({
                ...newProduct, 
                product_id: newProduct.id, 
                order_count: 1,
                quantity: 1,
                price: newProduct.product_price
            });
            localStorage.setItem("cart", JSON.stringify(cart));
        }

        if(user?.access_token) {
            await axiosInstance.post('/api/cart/update', {
                ...cart,
                user_id: user.id
            }, {
                headers: {
                    Authorization: user.access_token
                }
            })
            .then((response) => console.log({response}))
            .catch(error => {
                toast.error(error.response?.message || "Error try again later")
            })
        }
    }
    
    useEffect(() => {
        if(similar_products.length > 0) getSimilarProductOpenOrder();
    }, []);

    return (
        <div
            className='w-full bg-white min-h-screen relative'
        >
            <Head>
                <title>{product.product_name}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <Header search={false} />

            <ToastContainer />

            <MyGallery 
                show={showImageGallery}
                setShow={toggleImageGallery}
                slides={product?.product_images}
            />

            <div 
                className="flex flex-col md:flex-row w-[95%] mx-auto px-5 py-4 mt-10 relative"
            >
                <div className='w-full md:w-1/3 md:!mr-3 cursor-pointer max-w-1/3 h-full flex align-middle' onClick={toggleImageGallery}>
                    <SwiperSlider 
                        slides={product?.product_images}
                    />
                </div>
                <div className="w-[95%] md:w-[35%] md:!mx-0 lg:!mx-0 flex flex-col mt-10 md:mt-0">
                    <h1 className="text-xl md:text-2xl justify-center mb-0">
                        {product.product_name}
                    </h1>
                    <p className="text-gray-600 py-2 mb-0">
                        {product.product_description}
                    </p>
                    {
                        product.openOrders && (
                            <div className="flex flex-row gap-8 w-full mr-2 my-1">
                                <div 
                                    className='flex flex-row gap-1'
                                >
                                    <p className="text-gray-600 flex flex-col md:flex-row">
                                        Open Price:
                                    </p>
                                    <span className='font-semibold text-red-600 pulse'>
                                        {product.openOrders.open_order_price}
                                    </span>
                                </div>
                                <div 
                                    className='flex flex-row gap-1'
                                >
                                    <p className="text-gray-600 flex flex-col md:flex-row">
                                        Open discount: 
                                    </p>
                                    <span className='font-semibold line-through'>
                                        {product.openOrders.open_order_discount}
                                    </span>
                                </div>
                            </div>
                        )
                    }

                    <div className="flex flex-row gap-8 w-full mr-2 my-1">
                        <div 
                            className='flex flex-row gap-1'
                        >
                            <p className="text-gray-600 flex flex-col md:flex-row">
                                Price:
                            </p>
                            <span className='font-semibold text-green-600'>
                                {product.product_price}
                            </span>
                        </div>
                        <div 
                            className='flex flex-row gap-1'
                        >
                            <p className="text-gray-600 flex flex-col md:flex-row">
                                Current discount: 
                            </p>
                            <span className='font-semibold line-through'>
                                {calculateNextDiscount(4, product.product_discount, product.product_price)}
                            </span>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => addToCart(product)}
                        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-[60%] md:w-[40%] mt-3"
                    >
                        Add to Cart
                    </button>
                </div>

                <div className='bg-white shadow-gray-600 shadow-xl rounded-[20px] px-4 py-2 min-w-fit flex flex-col gap-2 absolute top-1 right-4'>
                    <p className='text-black mb-0'>Buy this product at {" "}
                        <span className='text-orange-600'> N {product.product_price - ((product.product_discount/100) * product.product_price)}</span>
                    </p>
                    <button
                        onClick={() => router.push(`/order-train/${product.id}`)}
                        className="bg-orange-500 hover:bg-orange-700 text-white flex text-center justify-center font-bold py-2 px-4 rounded w-[80%] md:w-[80%] mx-auto whitespace-nowrap"
                    >
                        Open Order Train
                    </button>
                    <p className='text-xs text-orange-900 mb-0 text-center'>Terms and conditions apply</p>
                </div>
                
                {
                    similarProductOpenOrder && (
                        <div className='bg-white shadow-gray-600 shadow-xl rounded-[20px] px-4 py-2 min-w-fit flex flex-col gap-2 absolute top-10 right-4'>
                            <p className='text-black mb-0'>A Similar product is selling at {" "}
                                <span className='text-orange-600'> N {similarProductOpenOrder?.open_order_price}</span>
                            </p>
                            <button
                                onClick={() => {}}
                                className="bg-orange-500 hover:bg-orange-700 text-white flex text-center justify-center font-bold py-2 px-4 rounded w-[80%] md:w-[80%] mx-auto whitespace-nowrap"
                            >
                                Join Order Train
                            </button>
                            <p className='text-xs text-orange-900 mb-0 text-center'>Terms and conditions apply</p>
                        </div>
                    )
                }
               
            </div>
            
            {
                similar_products && similar_products.length > 0 && (
                    <div className='mt-10 w-[95%] ml-[5%]'>
                        <HorizontalSlider 
                            list={similar_products}
                            list_name='Similar items'
                        />
                    </div>
                )
            }

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

export default product

export async function getServerSideProps(context: any) {
    try{
        const { id } = context.query

        const getProduct = await sendAxiosRequest(
            `/api/public/product/show?id=${id}`,
            "get",
            {},
            "",
            ""
        );
       
        return {
            props: {
                product: getProduct.data.product,
                similar_products: getProduct.data.similar_products
            }
        }
    }
    catch(err: any) {
        throw new Error(err.message);
    }
}