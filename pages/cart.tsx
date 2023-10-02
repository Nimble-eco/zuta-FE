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

interface ICartPageProps {
    similar_products: any[];
}

const cart = ({similar_products}: ICartPageProps) => {
  const [items, setItems] = useState<any>({});
  const [openOrderProducts, setOpenOrderProducts] = useState<any[]>(openOrderProductsDummyData.splice(0, 4));
  const router = useRouter();
  
  let user: any = {};

  if(typeof window !== 'undefined') {
    user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
  }

  const handleQuantityChange = (key: string, index: number, newQuantity: number) => {
    const updatedItems: any = JSON.parse(localStorage.getItem("cart")!);
    console.log({updatedItems, items})
    updatedItems[key][index].quantity = newQuantity;
    setItems(updatedItems);
    console.log('2', {updatedItems, items})
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  const handleRemove = (type: string, index: number) => {
    setItems(items[type].filter((item: any, i: number) => i !== index));
  };

//   const getFeaturedProductsInCategory = async () => {
//     let categoryList = items?.map((item) => item.categories);
//     let tagList = items?.map((item) => item.tags);

//     categoryList = categoryList.reduce((acc, curr) => acc.concat(curr), []);
//     tagList = tagList.reduce((acc, curr) => acc.concat(curr), []);

//     const res = await sendAxiosRequest('public/open-order/filter', 'post', {categories: categoryList, tags: tagList});

//     if(res.status === 200) {
//         const openOrderProductsList = res.data?.splice(0, 4);
//         setOpenOrderProducts(openOrderProductsList);
//     }
//   }

//   const getSimilarProductsInCategory = async () => {
//     let categoryList = items?.map((item) => item.categories);
//     let tagList = items?.map((item) => item.tags);

//     categoryList = categoryList.reduce((acc, curr) => acc.concat(curr), []);
//     tagList = tagList.reduce((acc, curr) => acc.concat(curr), []);

//     const res = await sendAxiosRequest('public/featured/filter', 'post', {categories: categoryList, tags: tagList});

//     if(res.status === 200) {
//         const similarProductsList = res.data?.splice(0, 4);
//     }
//   }


    useEffect(() => {
        let cart = JSON.parse(localStorage.getItem("cart")!);
        setItems(cart);
    }, []);
    console.log({items})

  return (
    <div className="flex flex-col bg-gray-100 relative">
        <Header />
        <div className="flex flex-col bg-white py-4 px-3 h-fit w-[90%] fixed bottom-0 left-[5%] right-[5%] shadow-md z-50 mb-4 lg:hidden">
            <Total items={items} />
            <button
                className="bg-orange-500 px-4 py-3 text-white rounded cursor-pointer"
                onClick={() => router.push('/checkout')}
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
                        onClick={() => router.push('/checkout')}
                    >
                        Proceed to Checkout
                    </button>
                </div>
                <div className="flex flex-col bg-white pl-2 rounded-md">
                    <h4 className="font-semibold my-3">Open orders for similar products</h4>
                    {
                        openOrderProducts?.map((product) => (
                            <div
                                className='flex flex-row cursor-pointer mb-6 h-28 text-sm'
                                // onClick={() => goToProductPage(product?.id)}
                                key={product.id}
                            >
                                <img
                                    src={product?.image}
                                    alt="product image"
                                    className='mr-3 h-full rounded-md'
                                />
                                
                                <div 
                                    className="flex flex-col py-2"
                                >
                                    <div className='flex flex-col mb-2'>
                                        <h3 className='text-base font-mono line-clamp-1 mb-1'>
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
                                        <span>
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

        {
            similar_products && similar_products.length > 0 && (
                <div className='mt-10 w-[98%] ml-[2%]'>
                    <HorizontalSlider
                        list={similar_products}
                        list_name='Similar items'
                    />
                </div>
            )
        }
    </div>
  );
};

export default cart;
