import Head from 'next/head'
import { useRef, useState } from 'react';
import Cart from '../Components/Cart';
import Header from "../Components/Header"
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { sendAxiosRequest } from '../Utils/sendAxiosRequest';
import SwiperSlider from '../Components/sliders/Swiper';
import { calculateDiscount } from '../Utils/calculateDiscount';
import MyGallery from '../Components/sliders/MyGallery';
import { productsDummyData } from '../data/products';
import HorizontalSlider from '../Components/lists/HorizontalSlider';
import VerticalTextSlider from '../Components/sliders/VerticalTextSlider';
import { openOrderProductDummyData } from '../data/openOrderProduct';

interface IOpenOrderProductPageProps {
    product: any;
    similar_products: any[];
}

const openOrder = ({product, similar_products}: IOpenOrderProductPageProps) => {
    const cartRef = useRef<any>({});
    const [showImageGallery, setShowImageGallery] = useState<boolean>(false);
    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo('en-US')

    const toggleImageGallery = () => setShowImageGallery(!showImageGallery);

    const [currentReviewPage, setCurrentReviewPage] = useState(0);

    const itemsPerPage = 8;
    const reviewPages = [];

    for (let i = 0; i < product?.reviews?.length; i += itemsPerPage) {
        reviewPages.push(product?.reviews?.slice(i, i + itemsPerPage));
    }

    const addToCart = (newProduct:any) => {
        cartRef.current?.addToCart(newProduct);
    }

    const getRecentOrderList = () => {
        const recentOrders: string[] = [];
        product?.recent_orders?.map((order: any) => {
            recentOrders.push(`${order?.user_id} purchased about ${timeAgo.format(new Date(order?.created_at))}`)
        });
        return recentOrders;
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
                slides={product?.images}
            />

            <div 
                className="flex flex-col md:flex-row justify-between w-[95%] mx-auto px-5 py-4 mt-10"
            >
                <div className='w-full md:w-1/3 md:!mr-3 cursor-pointer max-w-1/3 h-fit' onClick={toggleImageGallery}>
                    <SwiperSlider 
                        slides={product?.images}
                    />
                </div>
                <div className="w-[95%] mx-auto md:w-2/3 flex flex-col mt-10 md:mt-0 md:!ml-8">
                    <h1 className="text-xl md:text-3xl font-mono justify-center">
                        {product.name}
                    </h1>
                    <p className="text-gray-600 py-2">
                        {product.description}
                    </p>
                    <div className="flex flex-row justify-between w-full md:w-[70%] mr-2 my-1 text-sm">
                        <div 
                            className='flex flex-row w-[50%] justify-between'
                        >
                            <p className="text-gray-600 pr-5 flex flex-col md:flex-row">
                                Price:
                                <span className='font-semibold'>
                                    {product.price}
                                </span>
                            </p>
                        </div>
                        <div 
                            className='flex flex-row w-[50%] justify-between'
                        >
                            <p className="text-gray-600 pr-5 flex flex-col md:flex-row">
                                Current discount: 
                                <span className='font-semibold line-through'>
                                    {calculateDiscount(product.discount, product.price)}
                                </span>
                            </p>
                        </div>
                          
                    </div>
                    <div
                        className='flex flex-row justify-between w-full md:w-[70%] my-1 text-sm'
                    >
                        <div 
                            className='flex flex-row w-[50%] mr-2'
                        >
                            <p className="text-gray-600 pr-5 flex flex-col md:flex-row">
                                Potential price: {" "}
                                <span className='text-orange-500 font-thin'>
                                    N{product.potential_price}
                                </span>
                            </p>
                        </div>
                        <div 
                            className='flex flex-row w-[50%] justify-between'
                        >
                            <p className="text-gray-600 pr-5 flex flex-col md:flex-row">
                                Potential discount:
                                <span className='text-orange-500 font-thin line-through'>
                                    {calculateDiscount(product.potential_discount, product.price)}
                                </span>
                            </p>
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
                    list={productsDummyData}
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
        const { id } = context.query

        // const getProduct = await sendAxiosRequest(
        //     `/api/open-order/product/${id}`,
        //     "get",
        //     {},
        //     "",
        //     ""
        // );

        // const getProdctSimilarProducts = await sendAxiosRequest(
        //     `/api/products/similar/${id}`,
        //     'get',
        //     {},
        //     '',
        //     ''
        // );

        // const [productData, similar_products] = await Promise.all([
        //     getProduct,
        //     getProdctProducts
        // ]);



        return {
            props: {
                product: openOrderProductDummyData,
                similar_products: productsDummyData
            }
        }
    }
    catch(err: any) {
        throw new Error(err.message);
    }
    
}