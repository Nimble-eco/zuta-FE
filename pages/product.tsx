import Head from 'next/head'
import Cookies from 'js-cookie'
import { toast, ToastContainer } from 'react-toastify';
import { injectStyle } from "react-toastify/dist/inject-style";
import { useEffect, useState, useRef } from 'react';
import Header from "../Components/Header"
import { sendAxiosRequest } from '../Utils/sendAxiosRequest';
import SwiperSlider from '../Components/sliders/Swiper';
import { calculateNextDiscount } from '../Utils/calculateDiscount';
import MyGallery from '../Components/sliders/MyGallery';
import HorizontalSlider from '../Components/lists/HorizontalSlider';
import axiosInstance from '../Utils/axiosConfig';
import router from 'next/router';
import { formatAmount } from '../Utils/formatAmount';
import { capitalizeFirstLetter } from '../Utils/capitalizeFirstLettersOfString';
import ProductDetailsSideDrawer from "../Components/drawer/ProductDetailsSideDrawer";

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
    const ProductDetailsSideDrawerRef = useRef<any>(null);

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

        toast.success('Cart updated');

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
            <ProductDetailsSideDrawer
                title={product.product_name}
                description={product.product_description}
                ref={ProductDetailsSideDrawerRef}
            />

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
                className="flex flex-col md:flex-row w-full px-3 lg:px-8 py-4 mt-10 relative"
            >
                <div className='w-[80%] max-w-full md:w-1/3 !mx-auto md:!mx-0 lg:!mx-0 md:!mr-3 cursor-pointer h-full flex align-middle overflow-auto' onClick={toggleImageGallery}>
                    <SwiperSlider 
                        slides={product?.product_images}
                    />
                </div>
                <div className="w-full md:w-[35%] !mx-auto md:!mx-0 lg:!mx-[20px] flex flex-col mt-10 md:mt-0">
                    <h1 className="text-xl md:text-2xl justify-center mb-0 !text-center lg:!text-left">
                        {capitalizeFirstLetter(product.product_name)}
                    </h1>
                    
                    <p className="w-[80%] !mx-auto lg:!mx-0 text-gray-600 mb-2 lg:mb-0 line-clamp-4 lg:line-clamp-3 flex flex-row">
                        {product.product_description}
                        <span className="text-orange-500 text-sm cursor-pointer ml-1" onClick={() => ProductDetailsSideDrawerRef.current?.open()}>...more</span>
                    </p>
                    {
                        product.openOrders && (
                            <div className="flex flex-row gap-8 w-full mr-2 my-1 justify-center lg:justify-between">
                                <div 
                                    className='flex flex-col lg:flex-row lg:gap-1'
                                >
                                    <p className="text-gray-600 flex flex-col md:flex-row mb-0">
                                        Open Price:
                                    </p>
                                    <span className='font-semibold text-red-600 pulse'>
                                        {formatAmount(product.openOrders.open_order_price)}
                                    </span>
                                </div>
                                <div 
                                    className='flex flex-col lg:flex-row lg:gap-1'
                                >
                                    <p className="text-gray-600 flex flex-col md:flex-row mb-0">
                                        Open discount: 
                                    </p>
                                    <span className='font-semibold line-through'>
                                        {formatAmount(product.openOrders.open_order_discount)}
                                    </span>
                                </div>
                            </div>
                        )
                    }

                    <div className="flex flex-row gap-4 lg:gap-8 w-full mr-2 my-1 justify-center lg:justify-between">
                        <div 
                            className='flex flex-col lg:flex-row gap-1'
                        >
                            <p className="text-gray-600 flex flex-col md:flex-row">
                                Price:
                            </p>
                            <span className='font-semibold text-green-600'>
                                {formatAmount(product.product_price)}
                            </span>
                        </div>
                        <div 
                            className='flex flex-col lg:flex-row gap-1'
                        >
                            <p className="text-gray-600 flex flex-col md:flex-row">
                                Current discount: 
                            </p>
                            <span className='font-semibold line-through'>
                                {formatAmount(calculateNextDiscount(4, product.product_discount, product.product_price))}
                            </span>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => addToCart(product)}
                        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-[60%] md:w-[40%] !mx-auto lg:!mx-0 mt-3"
                    >
                        Add to Cart
                    </button>
                </div>

                <div className='bg-white shadow-2xl rounded-[20px] px-4 py-2 w-[240px] lg:w-fit !mx-auto flex flex-col gap-2 text-sm lg:text-base mt-4 lg:absolute lg:top-1 lg:right-4 lg:mx-0 lg:mt-0'>
                    <p className='text-black mb-0 whitespace-nowrap'>Buy this product at {" "}
                        <span className='text-orange-600'>{formatAmount(product.product_price - ((product.product_discount/100) * product.product_price))}</span>
                    </p>
                    <button
                        onClick={() => router.push(`/order-train/${product.id}`)}
                        className="border-orange-500 border-2 lg:border-0 lg:bg-orange-500 hover:bg-orange-700 text-orange-500 lg:text-white flex text-center justify-center font-bold py-2 px-4 rounded w-full mx-auto whitespace-nowrap"
                    >
                        Open Order Train
                    </button>
                    <p className='text-xs text-orange-900 mb-0 text-center'>Terms and conditions apply</p>
                </div>
                
                {
                    similarProductOpenOrder && (
                        <div className='bg-white shadow-gray-600 shadow-xl rounded-[20px] px-4 py-2 min-w-fit flex flex-col gap-2 absolute top-10 right-4'>
                            <p className='text-black mb-0'>A Similar product is selling at {" "}
                                <span className='text-orange-600'>{formatAmount(similarProductOpenOrder?.open_order_price)}</span>
                            </p>
                            <button
                                onClick={() => {}}
                                className="border-orange-500 border hover:bg-orange-700 text-white flex text-center justify-center font-bold py-2 px-4 rounded w-[80%] md:w-[80%] mx-auto whitespace-nowrap"
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
                <div className="my-10 flex flex-col w-[80%] lg:w-[90%] mx-auto mb-10">
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
        console.log({err})
        throw new Error(err.message);
    }
}