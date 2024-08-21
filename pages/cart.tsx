import { useState, useEffect } from "react";
import RatingsCard from "../Components/cards/RatingsCard";
import CartComponent from "../Components/cart/Cart";
import Total from "../Components/cart/Total";
import Header from "../Components/Header";
import HorizontalSlider from "../Components/lists/HorizontalSlider";
import { openOrderProductsDummyData } from "../data/openOrderProducts";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { formatAmount } from "../Utils/formatAmount";
import axiosInstance from "../Utils/axiosConfig";


const cart = () => {
    const [items, setItems] = useState<any>({});
    const [similar_products, setSimilarProducts] = useState<any>({});
    const [openOrderProducts, setOpenOrderProducts] = useState<any[]>(openOrderProductsDummyData.splice(0, 4));
    const [featuredProducts, setFeaturedProducts] = useState<any>({});
    const router = useRouter();
  
    let user: any = {};

    if(typeof window !== 'undefined') {
        user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
    }

    const handleQuantityChange = (key: string, index: number, newQuantity: number) => {
        const updatedItems: any = JSON.parse(localStorage.getItem("cart")!);
        updatedItems[key][index].quantity = newQuantity;
        setItems(updatedItems);
        localStorage.setItem("cart", JSON.stringify(updatedItems));
    };

    const handleRemove = (type: string, index: number) => {
        const updatedItems = {
            ...items, 
            [type]: items[type].filter((item: any, i: number) => i !== index)
        };
        setItems(updatedItems);
        localStorage.setItem("cart", JSON.stringify(updatedItems));
    };

    const getProductsInCategory = async (items: any) => {
        let categoryList: any[] = [];
        let tagsList: any[] = [];
        for (const [propertyName, propertyArray] of Object.entries(items)) {
            if (Array.isArray(propertyArray)) {
                for (const objectItem of propertyArray) {
                    categoryList.push(objectItem.product_categories);
                    tagsList.push(objectItem.product_tags)
                }
            }
        }

        categoryList = categoryList.reduce((acc, curr) => acc.concat(curr), []);
        tagsList = tagsList.reduce((acc, curr) => acc.concat(curr), []);

        const showcaseRes = await axiosInstance.post('/api/featured/product/filter/index', {
            product_categories: categoryList, 
            product_tags: tagsList
        });

        const productsRes = await axiosInstance.post('/api/public/product/filter/index', {
            product_categories: categoryList, 
            product_tags: tagsList
        });

        if(productsRes.status === 200) {
            setSimilarProducts(productsRes.data?.data?.splice(0, 6));
        }

        if(showcaseRes.status === 200) {
            setFeaturedProducts(showcaseRes?.data?.data?.splice(0, 6));
        }
    }

    useEffect(() => {
        let isMounted = true;

        if(isMounted) {
            let cart = JSON.parse(localStorage.getItem("cart")!);
            setItems(cart);
            getProductsInCategory(cart ?? {});
        }

        return () => {
            isMounted = false;
        }

    }, []);

  return (
    <div className="flex flex-col bg-gray-100 relative min-h-screen overflow-scroll">
        <Header />
        <div className="flex flex-col bg-white py-4 px-3 h-fit w-[90%] fixed bottom-0 left-[5%] right-[5%] shadow-md z-50 mb-4 lg:hidden">
            <Total items={items} />
            <button
                className="bg-orange-500 px-4 py-3 text-white rounded cursor-pointer"
                onClick={() => {
                    localStorage.setItem("cart", JSON.stringify(items));
                    router.push('/checkout')
                }}
            >
                Proceed to Checkout
            </button>
        </div>
        <div className="w-[95%] flex flex-col lg:flex-row mx-auto mt-12">
            <div className="w-[90%] mx-auto lg:w-[70%] lg:mr-[2%] flex flex-col mb-4">
                <CartComponent items={items} onQuantityChange={handleQuantityChange} onRemove={handleRemove} />
                <div className="bg-white h-full rounded-md"></div>
            </div>
            <div className="flex flex-col w-[90%] mx-auto lg:w-[25%]">
                <div className="hidden lg:flex flex-col bg-white py-4 px-3 h-fit mb-4 rounded-md">
                    <Total items={items} />
                    <button
                        className="bg-orange-500 px-4 py-3 text-white rounded cursor-pointer"
                        onClick={() => {
                            localStorage.setItem("cart", JSON.stringify(items));
                            router.push('/checkout')
                        }}
                    >
                        Proceed to Checkout
                    </button>
                </div>
                <div className="flex flex-col py-3 bg-white pl-2 rounded-md">
                    <h4 className="font-semibold my-3 text-sm text-center">Join these order train</h4>
                    <div className="flex flex-row overflow-x-scroll lg:flex-col gap-4">
                        {
                            openOrderProducts?.map((product) => (
                                <div
                                    className='flex flex-col lg:flex-row cursor-pointer lg:h-28 text-sm bg-gray-100 lg:bg-transparent px-2 py-3 min-w-[10rem] '
                                    // onClick={() => goToProductPage(product?.id)}
                                    key={product.id}
                                >
                                    <img
                                        src={product?.image}
                                        alt="product image"
                                        className='lg:mr-3 h-24 lg:h-full rounded-md'
                                    />
                                    
                                    <div 
                                        className="flex flex-col py-2"
                                    >
                                        <div className='flex flex-col mb-2'>
                                            <h3 className='text-sm font-mono line-clamp-1 mb-1'>
                                                {product?.name}
                                            </h3>
                                            { product.rating && <RatingsCard rating={product.rating} /> }
                                        </div>
                                        <div 
                                            className='flex flex-col'
                                        >
                                            <p 
                                                className='text-orange-300 font-semibold mr-4'
                                            >
                                                {formatAmount(product.price)}
                                            </p>
                                            <span className="text-xs">
                                                {product.discount}% Off
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>

        {
            featuredProducts?.data?.data && featuredProducts?.data?.data?.length > 0 && (
                <div className='mt-10 w-[98%] ml-[2%]'>
                    <HorizontalSlider
                        list={featuredProducts}
                        list_name='Recommended for you'
                    />
                </div>
            )
        }

        {
            similar_products && similar_products.length > 0 && (
                <div className='mt-10 w-[98%] ml-[2%]'>
                    <HorizontalSlider
                        list={similar_products}
                        list_name='You might also like'
                    />
                </div>
            )
        }
    </div>
  );
};

export default cart;

export async function getServerSideProps(context: any) {
    try{
        const search = context.query.search;

        const getProducts = await axiosInstance.post(
            `/api/public/product/search/index`,
            {search}
        );

        const getOpenOrders = await axiosInstance.post(
            '/api/open-order/search/index',
            {search}
        );

        const getFeaturedProducts = await axiosInstance.post(
            '/api/featured/product/search/index',
            {search}
        );

        const [productsResult, openOrderProductsResult, featuredProductsResult] = await Promise.allSettled([
            getProducts.data,
            getOpenOrders.data,
            getFeaturedProducts.data
        ]);

        const products = productsResult.status === 'fulfilled' && productsResult.value.data ? productsResult.value.data?.data : [];
        const openOrderProducts = openOrderProductsResult.status === 'fulfilled' && openOrderProductsResult.value.data ? openOrderProductsResult.value.data?.data : [];
        const featuredProducts = featuredProductsResult.status === 'fulfilled' && featuredProductsResult.value.data ? featuredProductsResult.value.data?.data : [];
        console.log({products, openOrderProducts, featuredProducts})

        return {
            props: {
                products,
                openOrderProducts,
                featuredProducts
            },
        }
    }
    catch(err) {
        console.log({err})
        return {
            props: {
                products: [],
                openOrderProducts: [],
                featuredProducts: []
            },
        }
    }
}