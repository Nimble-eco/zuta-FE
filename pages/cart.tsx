import { useState, useEffect } from "react";
import RatingsCard from "../Components/cards/RatingsCard";
import CartComponent from "../Components/cart/Cart";
import Total from "../Components/cart/Total";
import Header from "../Components/Header";
import HorizontalSlider from "../Components/lists/HorizontalSlider";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { formatAmount } from "../Utils/formatAmount";
import axiosInstance from "../Utils/axiosConfig";
import { processImgUrl } from "../Utils/helper";

const cart = () => {
    const [items, setItems] = useState<any>({});
    const [similar_products, setSimilarProducts] = useState<any>({});
    const [openOrderProducts, setOpenOrderProducts] = useState<any[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<any>({});
    const router = useRouter();

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
                    categoryList.push(objectItem?.product_categories ?? objectItem.product?.product_categories);
                    tagsList.push(objectItem?.product_tags ?? objectItem.product?.product_tags);
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

        const openOrdersRes = await axiosInstance.post('/api/open-order/filter/index', {
            product_categories: categoryList, 
            product_tags: tagsList
        });

        if(productsRes.status === 200) {
            setSimilarProducts(productsRes.data?.data?.splice(0, 6));
        }

        if(showcaseRes.status === 200) {
            setFeaturedProducts(showcaseRes?.data?.data?.splice(0, 6));
        }

        if(openOrdersRes?.status === 200) {
            setOpenOrderProducts(openOrdersRes?.data?.data?.data);
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
    <div className="flex flex-col bg-gray-100 relative min-h-screen overflow-scroll pb-40">
        <Header />
        <div className="flex flex-col gap-1 bg-white py-2 px-3 h-fit w-[90%] fixed bottom-0 left-[5%] right-[5%] shadow-md z-40 mb-4 lg:hidden">
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
                    <h4 className="font-semibold my-3 text-lg text-center">Join these order train</h4>
                    <div className="flex flex-col overflow-x-scroll lg:flex-col gap-4">
                        {
                            openOrderProducts?.map((order) => (
                                <a
                                    className='flex flex-col lg:flex-row cursor-pointer lg:h-28 text-sm bg-slate-800 rounded-md px-1 py-1 min-w-[10rem] '
                                    href={`/openOrder?id=${order?.id}`}
                                    key={order.id}
                                >
                                    <img
                                        src={
                                            order?.product?.product_images?.length ?
                                            processImgUrl(order?.product?.product_images[0]) : ''
                                        }
                                        alt="product image"
                                        className='lg:mr-3 h-40 lg:h-full rounded-md !object-cover !object-center'
                                    />
                                    
                                    <div 
                                        className="flex flex-col gap-1 py-2"
                                    >
                                        <div className='flex flex-col'>
                                            <h3 className='text-sm font-mono text-white line-clamp-2 capitalize'>
                                                {order?.product?.product_name}
                                            </h3>
                                            { order?.product.rating && <RatingsCard rating={order?.product.rating} /> }
                                        </div>
                                        <div 
                                            className='flex flex-row lg:flex-col'
                                        >
                                            <p 
                                                className='text-orange-300 font-semibold mr-4'
                                            >
                                                {formatAmount(order?.product?.product_price)}
                                            </p>
                                            <span className="text-xs text-gray-300">
                                                {order?.product?.product_discount}% Off
                                            </span>
                                        </div>
                                    </div>
                                </a>
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
                        page='/product?id='
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
                        page='/product?id='
                    />
                </div>
            )
        }
    </div>
  );
};

export default cart;