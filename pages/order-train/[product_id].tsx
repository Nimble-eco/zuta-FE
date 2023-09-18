import { useState, useEffect } from "react";
import Cookies from 'js-cookie'
import { toast, ToastContainer } from 'react-toastify';
import { injectStyle } from "react-toastify/dist/inject-style";
import Head from "next/head";
import Header from "../../Components/Header";
import MyGallery from "../../Components/sliders/MyGallery";
import SwiperSlider from "../../Components/sliders/Swiper";
import { calculateNextDiscount } from "../../Utils/calculateDiscount";
import HorizontalSlider from "../../Components/lists/HorizontalSlider";
import { sendAxiosRequest } from "../../Utils/sendAxiosRequest";
import axiosInstance from "../../Utils/axiosConfig";

interface ICreateOrderTrainPageProps {
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

const createOpenOrder = ({product, similar_products}: ICreateOrderTrainPageProps) => {
    const [showImageGallery, setShowImageGallery] = useState<boolean>(false);
    const nextDiscount = calculateNextDiscount(4, product.product_discount, product.product_price);
    const [quantity, setQuantity] = useState<number | string>(1);

    const toggleImageGallery = () => setShowImageGallery(!showImageGallery);
    const [currentReviewPage, setCurrentReviewPage] = useState(0);

    let user: any = {};

    if(typeof window !== 'undefined') {
        injectStyle();
        user = JSON.parse(Cookies.get('user')!);
    }

    const itemsPerPage = 8;
    const reviewPages = [];

    for (let i = 0; i < product?.reviews?.length; i += itemsPerPage) {
        reviewPages.push(product?.reviews?.slice(i, i + itemsPerPage));
    }

    const openOrderTrain = async () => {
        await axiosInstance.post('/api/open-order/store', {
            product_id: product.id,
            quantity
        }, {
            headers: {
                Authorization: user.access_token
            }
        })
        .then((response) => {
            console.log({response})
        })
    }

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

        <div className='w-full h-[50vh] cursor-pointer flex align-middle mt-2' onClick={toggleImageGallery}>
            <SwiperSlider 
                slides={product?.product_images}
            />
        </div>

        <div 
            className="flex flex-col md:flex-row w-[95%] mx-auto px-5 py-4 mt-6 relative"
        >
            <div className="w-full md:w-[60%] flex flex-col lg:px-4">
                <h1 className="text-xl md:text-2xl justify-center mb-0">
                    {product.product_name}
                </h1>
                <p className="text-gray-600 py-2 mb-0 line-clamp-4">
                    {product.product_description}
                </p>

                <div className="flex flex-row gap-8 w-full mr-2 my-1">
                    <div 
                        className='flex flex-row gap-1'
                    >
                        <p className="text-gray-600 flex flex-col md:flex-row">
                            Price:
                        </p>
                        <span className='font-semibold text-green-600'>
                            N{product.product_price}
                        </span>
                    </div>
                    <div 
                        className='flex flex-row gap-1'
                    >
                        <p className="text-gray-600 flex flex-col md:flex-row">
                            Current discount: 
                        </p>
                        <span className='font-semibold line-through'>
                            N{calculateNextDiscount(4, product.product_discount, product.product_price)}
                        </span>
                    </div>
                </div>

                <div className="flex flex-row gap-8 w-full mr-2 my-1">
                    <div 
                        className='flex flex-row gap-1'
                    >
                        <p className="text-gray-600 flex flex-col md:flex-row">
                            Next Price:
                        </p>
                        <span className='font-semibold text-orange-600 animate-pulse'>
                            N{(product.product_price - nextDiscount).toFixed(2)}
                        </span>
                    </div>
                    <div 
                        className='flex flex-row gap-1'
                    >
                        <p className="text-gray-600 flex flex-col md:flex-row">
                            Next discount: 
                        </p>
                        <span className='font-semibold line-through'>
                            N{calculateNextDiscount(3, product.product_discount, product.product_price)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 lg:px-4 w-full md:w-[40%]">
                <p className="text-sm">
                    When an order train is opened for a product, users will place their orders for the product, 
                    those orders accumulate as one order and the price of the product is reduced.<br />
                    The difference between the amount a user pays for an item and the final amount will be refunded back to the user. 
                </p>

                <div className="flex flex-row gap-4">
                    <p className="">Quantity:</p>
                    <input
                        type="number"
                        value={quantity}
                        onChange={event => setQuantity(Number(event.target.value))}
                        className='outline-none bg-gray-100 border-gray-200 rounded-md w-fit mb-4 py-2 pl-3 text-sm md:mr-4'
                    />
                </div>

                <button
                    onClick={() => openOrderTrain()}
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-[60%] md:w-[40%] mx-auto md:!mx-0 lg:!mx-0 mt-3 whitespace-nowrap"
                >
                    Start Order Train
                </button>

            </div>
            
                        
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

export default createOpenOrder

export async function getServerSideProps(context: any) {
    try{
        const { product_id } = context.query

        const getProduct = await sendAxiosRequest(
            `/api/public/product/show?id=${product_id}`,
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