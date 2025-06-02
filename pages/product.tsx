import Head from 'next/head'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify';
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
import { BsChat } from 'react-icons/bs';
import RatingsCard from '../Components/cards/RatingsCard';
import { processImgUrl } from '../Utils/helper';
import { Fade } from 'react-awesome-reveal';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

interface IProductPageProps {
    product: {
        id: number,
        vendor_id: string,
        product_name: string,
        product_introduction: string,
        product_description: string,
        product_summary?: string,
        product_price: number,
        product_discount: number,
        quantity: number,
        status: string,
        featured_status: string,
        product_categories: string[],
        product_tags: string[],
        product_images: string[],
        product_videos: string[],
        product_testimonials: string[],
        product_faqs: any[],
        openOrders: any,
        reviews: any[]
    };
    similar_products: any;
    featured_similar_products: any;
}

function product({product, similar_products, featured_similar_products}: IProductPageProps) {
    const [showImageGallery, setShowImageGallery] = useState<boolean>(false);
    const [similarProductOpenOrder, setSimilarProductOpenOrder] = useState<any>(null);
    const ProductDetailsSideDrawerRef = useRef<any>(null);
    const [selectedFAQ, setSelectedFAQ] = useState(product?.product_faqs?.length ? product?.product_faqs[0] : {});

    const toggleImageGallery = () => setShowImageGallery(!showImageGallery);
    const [currentReviewPage, setCurrentReviewPage] = useState(0);

    let user: any = {};

    if(typeof window !== 'undefined') {
        user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
    }

    const itemsPerPage = 8;
    const reviewPages = [];

    const getSimilarProductOpenOrder = () => {
        const similar_product = similar_products?.data?.find((item: any) => item.openOrders !== null);
        setSimilarProductOpenOrder(similar_product.openOrders);
    }

    for (let i = 0; i < product?.reviews?.length; i += itemsPerPage) {
        reviewPages.push(product?.reviews?.slice(i, i + itemsPerPage));
    }

    const totalReviews = product?.reviews?.length || 0;
    const fiveStarReviews = product?.reviews?.filter((review: any) => review.score === 5).length || 0;
    const fourStarReviews = product?.reviews?.filter((review: any) => review.score === 4).length || 0;
    const threeStarReviews = product?.reviews?.filter((review: any) => review.score === 3).length || 0;
    const twoStarReviews = product?.reviews?.filter((review: any) => review.score === 2).length || 0;
    const oneStarReviews = product?.reviews?.filter((review: any) => review.score === 1).length || 0;

    const percentageFiveStar = totalReviews > 0 ? (fiveStarReviews / totalReviews) * 100 : 0;
    const percentageFourStar = totalReviews > 0 ? (fourStarReviews / totalReviews) * 100 : 0;
    const percentageThreeStar = totalReviews > 0 ? (threeStarReviews / totalReviews) * 100 : 0;
    const percentageTwoStar = totalReviews > 0 ? (twoStarReviews / totalReviews) * 100 : 0;
    const percentageOneStar = totalReviews > 0 ? (oneStarReviews / totalReviews) * 100 : 0;

    const averageScore = totalReviews > 0 
    ? (product.reviews.reduce((acc: number, review: any) => acc + review.score, 0) / totalReviews).toFixed(1) 
    : 0; 

    const addToCart = async (newProduct:any) => {
        const cart: any = JSON.parse(localStorage.getItem('cart')!) || {products: [], bundles: [], subscriptions: []};
        let newCart = cart;
        let obj = newCart.products.find((item: any, i: number) => {
          if(item.id === newProduct.id){
            newCart.products[i].order_count++;
            newCart.products[i].quantity++;
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
            .catch((error)=>{console.log({error})})
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
                introduction={product.product_introduction}
                ref={ProductDetailsSideDrawerRef}
            />

            <Head>
                <title>{product.product_name}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <Header search={false} />

            <MyGallery 
                show={showImageGallery}
                setShow={toggleImageGallery}
                slides={product?.product_images ?? []}
            />

            <div className='flex flex-col gap-6 px-4 lg:px-28'>
                <div 
                    className="flex flex-col gap-6 md:flex-row w-full py-4 relative"
                >
                    <div className='w-[90%] max-w-full md:w-1/3 !mx-auto md:!mx-0 lg:!mx-0 md:!mr-3 cursor-pointer h-full lg:h-60' onClick={toggleImageGallery}>
                        <SwiperSlider 
                            slides={product?.product_images ?? []}
                        />
                    </div>
                    <div className="w-[90%] md:w-[35%] !mx-auto md:!mx-0 lg:!mx-[20px] flex flex-col">
                        <h1 className="text-xl md:text-2xl justify-center mb-0 !text-center lg:!text-left">
                            {capitalizeFirstLetter(product?.product_name)}
                        </h1>
                        
                        <p className="text-gray-600 mb-2 lg:mb-0">
                            <span className="line-clamp-4">{product?.product_introduction}</span>
                            <span className="text-orange-500 text-sm cursor-pointer ml-1" onClick={() => ProductDetailsSideDrawerRef.current?.open()}>...more</span>
                        </p>
                        {
                            product.openOrders && (
                                <div className="flex flex-row gap-8 w-full my-1 lg:justify-between">
                                    <div 
                                        className='flex flex-col lg:flex-row lg:gap-1'
                                    >
                                        <p className="text-gray-600 flex flex-col md:flex-row mb-0">
                                            Open Price:
                                        </p>
                                        <span className='font-semibold text-red-600 pulse'>
                                            {formatAmount(product?.openOrders.open_order_price)}
                                        </span>
                                    </div>
                                    <div 
                                        className='flex flex-col lg:flex-row lg:gap-1'
                                    >
                                        <p className="text-gray-600 flex flex-col md:flex-row mb-0">
                                            Open discount: 
                                        </p>
                                        <span className='font-semibold line-through'>
                                            {formatAmount(product?.openOrders.open_order_discount)}
                                        </span>
                                    </div>
                                </div>
                            )
                        }

                        <div className="flex flex-row gap-4 lg:gap-6 w-full my-1 justify-between">
                            <div 
                                className='flex flex-col lg:flex-row lg:gap-1'
                            >
                                <p className="text-gray-600 flex flex-col md:flex-row mb-0">
                                    Price:
                                </p>
                                <span className='font-semibold text-green-600'>
                                    {formatAmount(product?.product_price)}
                                </span>
                            </div>
                            <div 
                                className='flex flex-col lg:flex-row lg:gap-1'
                            >
                                <p className="text-gray-600 flex flex-col md:flex-row mb-0">
                                    Current discount: 
                                </p>
                                <span className='font-semibold line-through'>
                                    {formatAmount(calculateNextDiscount(4, product?.product_discount, product?.product_price))}
                                </span>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => addToCart(product)}
                            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-[60%] md:w-[40%] !mx-auto lg:!mx-0 mt-3 fixed bottom-6 left-4 right-4 lg:static"
                        >
                            Add to Cart
                        </button>
                    </div>

                    <div className='bg-white shadow-2xl rounded-[20px] px-4 py-2 w-[300px] lg:w-fit !mx-auto flex flex-col gap-2 text-sm lg:text-base mt-4 lg:absolute lg:top-1 lg:right-4 lg:mx-0 lg:mt-0'>
                        <p className='text-slate-600 mb-0 whitespace-nowrap font-medium text-sm'>Buy this product at {" "}
                            <span className='text-orange-600 font-semibold'>{formatAmount(product.product_price - ((product.product_discount/100) * product.product_price))}</span>
                        </p>
                        <button
                            onClick={() => router.push(`/order-train/${product?.id}`)}
                            className="border-orange-500 border-2 hover:bg-orange-700 text-orange-500 hover:text-white flex text-center justify-center font-bold py-2 px-4 rounded-md w-full mx-auto whitespace-nowrap"
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
                    product?.product_videos && (
                        <div className='flex flex-col w-full lg:min-w-[500px]'>
                            <div className="flex flex-row gap-4 overflow-x-auto justify-center">
                                {
                                    product?.product_videos?.map((video)=>(
                                        <div className='relative bg-gray-100 rounded-lg'>
                                            <video
                                                src={processImgUrl(video)}
                                                className='rounded-md h-60 w-64'
                                                controls={true}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }

                {
                    product?.product_testimonials && (
                        <div className='flex flex-col w-full lg:min-w-[500px] justify-center mt-4 bg-slate-900 rounded-xl p-4'>
                            <h3 className='font-semibold text-xl text-white text-center'>Hear from our customers</h3>
                            <div className="flex flex-row gap-4 overflow-x-auto justify-center">
                                {
                                    product?.product_testimonials?.map((video)=>(
                                        <div className='relative bg-gray-100 rounded-lg'>
                                            <video
                                                src={processImgUrl(video)}
                                                className='rounded-md h-48 !w-64'
                                                controls={true}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }

                { reviewPages.length > 0 ?
                    <div className="my-10 flex flex-col w-[90%] lg:w-full px-4 lg:px-8 mx-auto lg:mx-0 mb-10">
                        <div className='flex flex-col lg:flex-row gap-4 lg:gap-y-20'>
                            <div className='flex flex-col gap-4'>
                                <h2 className="text-2xl text-orange-500 font-semibold">
                                    Customer Reviews
                                </h2> 
                                <div className='flex flex-row gap-2 items-center'>
                                    <RatingsCard 
                                        rating={Number(averageScore)} 
                                        hight={8}
                                        width={8}
                                    />
                                    <p className='font-semibold !mb-0'>{averageScore} out of 5</p>
                                </div>
                                <p className='text-sm font-light !mb-4'>{totalReviews} ratings and reviews</p>
                                <div className='flex flex-row gap-3 items-center justify-between'>
                                    <p className='!mb-0 text-sm whitespace-nowrap'>5 Stars</p>
                                    <div className="relative h-6 bg-gray-200 rounded w-full lg:w-72">
                                        <div
                                            className="absolute h-full bg-orange-500 rounded-l"
                                            style={{ width: `${percentageFiveStar}%` }}
                                        />
                                    </div>
                                    <p className='!mb-0 text-sm whitespace-nowrap'>{percentageFiveStar}%</p>
                                </div>
                                <div className='flex flex-row gap-2 items-center justify-between'>
                                    <p className='!mb-0 text-sm whitespace-nowrap'>4 Stars</p>
                                    <div className="relative h-6 bg-gray-200 rounded w-full lg:w-72">
                                        <div
                                            className="absolute h-full bg-orange-500 rounded-l"
                                            style={{ width: `${percentageFourStar}%` }}
                                        />
                                    </div>
                                    <p className='!mb-0 text-sm whitespace-nowrap'>{percentageFourStar}%</p>
                                </div>
                                <div className='flex flex-row gap-2 items-center justify-between'>
                                    <p className='!mb-0 text-sm whitespace-nowrap'>3 Stars</p>
                                    <div className="relative h-6 bg-gray-200 rounded w-full lg:w-72">
                                        <div
                                            className="absolute h-full bg-orange-500 rounded-l"
                                            style={{ width: `${percentageThreeStar}%` }}
                                        />
                                    </div>
                                    <p className='!mb-0 text-sm whitespace-nowrap'>{percentageThreeStar}%</p>
                                </div>
                                <div className='flex flex-row gap-2 items-center justify-between'>
                                    <p className='!mb-0 text-sm whitespace-nowrap'>2 Stars</p>
                                    <div className="relative h-6 bg-gray-200 rounded w-full lg:w-72">
                                        <div
                                            className="absolute h-full bg-orange-500 rounded-l"
                                            style={{ width: `${percentageTwoStar}%` }}
                                        />
                                    </div>
                                    <p className='!mb-0 text-sm whitespace-nowrap'>{percentageTwoStar}%</p>
                                </div>
                                <div className='flex flex-row gap-2 items-center justify-between'>
                                    <p className='!mb-0 text-sm whitespace-nowrap'>1 Stars</p>
                                    <div className="relative h-6 bg-gray-200 rounded w-full lg:w-72">
                                        <div
                                            className="absolute h-full bg-orange-500 rounded-l"
                                            style={{ width: `${percentageOneStar}%` }}
                                        />
                                    </div>
                                    <p className='!mb-0 text-sm whitespace-nowrap'>{percentageOneStar}%</p>
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 w-full lg:ml-[5%]'>
                                <p className='text-xl font-semibold'>Latest reviews from customers</p>
                                { reviewPages[currentReviewPage]?.map((review: any, index: number) => ( 
                                    <div className="flex flex-col gap-3" key={`${review.name}${index}`}>
                                        <div className='flex flex-col'>
                                            <div className='flex flex-row gap-2 items-center'>
                                                {
                                                    review?.user?.picture ? (
                                                        <img 
                                                            src={processImgUrl(review?.user?.picture)}
                                                            alt='reviewer'
                                                            className='h-10 w-10 rounded-full object-cover object-center'
                                                        />
                                                    ) : null
                                                }
                                                <h3 className="text-black justify-start font-normal capitalize text-base">
                                                    {review.user?.name}
                                                </h3>
                                            </div>
                                            <RatingsCard rating={review.score} />
                                        </div>
                                        <p className="text-gray-600">
                                            {review.comment}
                                        </p>
                                    </div>
                                ))} 
                                <div className='flex flex-row justify-end text-sm'>
                                    <button disabled={currentReviewPage === 0} onClick={() => setCurrentReviewPage(currentReviewPage - 1)} className='mr-3 cursor-pointer'>Previous</button>
                                    <button disabled={currentReviewPage === reviewPages.length - 1} onClick={() => setCurrentReviewPage(currentReviewPage + 1)} className='mr-3 cursor-pointer'>Next</button>
                                </div>
                            </div>
                        </div>
                    </div> : 
                    <div className='flex flex-col justify-center items-center gap-2 my-16'>
                        <BsChat className='text-5xl text-orange-500'/>
                        <p className='text-center text-xl font-medium text-orange-500'>No reviews yet</p>
                    </div>
                }

                {
                    featured_similar_products && featured_similar_products?.data?.length > 0 && (
                        <div className='mt-4'>
                            <HorizontalSlider 
                                list={featured_similar_products?.data}
                                list_name='Recommended for you'
                            />
                        </div>
                    )
                }

                {
                    product?.product_summary && (
                        <div className="mt-4">
                            <div dangerouslySetInnerHTML={{__html: product?.product_summary}} />
                        </div>
                    )
                }

                {
                    product?.product_faqs?.length ? (
                        <div className="flex flex-col gap-4 px-4 lg:px-10 xl:px-20 mt-8 bg-white p-4 rounded-md">
                            <p className="text-center text-muted text-3xl font-semibold mb-10">
                                Frequently Asked Questions
                            </p>
                            <div className="flex flex-col gap-2">
                                <Fade cascade triggerOnce>
                                {
                                    product?.product_faqs?.map((faq: any, index: number) => (
                                        <div 
                                            key={faq?.question} 
                                            className="flex flex-col gap-1 border-b"
                                            onClick={()=>setSelectedFAQ(faq)}    
                                        >
                                            <div className="flex flex-row gap-4 justify-between">
                                                <div className="flex flex-row gap-4 items-center cursor-pointer">
                                                    <p className="bg-foreground w-10 h-10 flex justify-center items-center rounded-xl text-center">{index + 1}</p>
                                                    <p className="font-semibold text-lg capitalize">{faq?.question}</p>
                                                </div>
                                                {
                                                    selectedFAQ?.answer === faq?.answer ?
                                                    <MdKeyboardArrowUp className="text-3xl" /> :
                                                    <MdKeyboardArrowDown className="text-3xl" /> 
                                                }
                                            </div>
                                            {
                                                selectedFAQ?.answer === faq?.answer && (
                                                    <p className="text-muted bg-foreground p-4 rounded-xl">{selectedFAQ?.answer}</p>
                                                )
                                            }
                                        </div>
                                    ))
                                }
                                </Fade>
                            </div>
                        </div>
                    ) : null
                }

                {
                    similar_products && similar_products.data?.length > 0 && (
                        <div className='mt-10'>
                            <HorizontalSlider 
                                list={similar_products?.data}
                                list_name='Customers also viewed these items'
                            />
                        </div>
                    )
                }
            </div>
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
                product: getProduct?.data?.product,
                similar_products: getProduct?.data?.similar_products,
                featured_similar_products: getProduct?.data?.featured_similar_products,
            }
        }
    }
    catch(err: any) {
        console.log({err})
        return { 
            props: {
                product: {}, 
                similar_products: [], 
                featured_similar_products: []
            }
        }
    }
}