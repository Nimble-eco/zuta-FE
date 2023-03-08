import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import {MdArrowForward} from 'react-icons/md'
import CategoryCard from '../Components/cards/CategoryCard';
import OpenOrderProductCard from '../Components/cards/OpenOrderProductCard';
import Header from '../Components/Header';
import ProductComponent from '../Components/ProductComponent';
import SwiperSlider from '../Components/sliders/Swiper';
import { cataloguesDummyData } from '../data/catalogues';
import { categoriesDummyData } from '../data/categories';
import { openOrderProductsDummyData } from '../data/openOrderProducts';
import { productsDummyData } from '../data/products';
import { tagsDummyData } from '../data/tags';
import { sendAxiosRequest } from '../Utils/sendAxiosRequest';


interface IHomePageProps {
  products: any[];
  openOrders: any[];
  categories: any[];
  tags: any[];
  catalogues: string[];
}

const Home = ({products, openOrders, categories, tags, catalogues}: IHomePageProps) => {
  const router = useRouter();
  const cartRef = useRef<any>({});

  if(typeof window !== 'undefined'){
    localStorage.removeItem('cart');
    localStorage.removeItem('total');
  }

  const handleClick = (tag: string) => {
    router.push(`/results?tag=${tag}`);
  }

  return (

    <div 
      className=" min-h-screen"
    >
      <Header />

      <div
        className='flex flex-col justify-center w-[90%] md:w-[80%] mx-auto px-5 py-10 my-10'
      >
        <div className=' rounded-md w-[90%] md:w-[60%] flex flex-col text-left'>
          <h2
            className='text-2xl md:text-5xl text-gray-600 font-bold w-[80%] mb-8'
          >
            Make we buy am {''}
              <span 
                className='text-orange-500'
              >
                together
              </span>  
          </h2>
          <div 
            className='flex flex-col text-base justify-start w-[80%] font-mono font-semibold text-left text-gray-500'
          >
            <p className='pb-1'>
              Get wholesale discounts
            </p>
            <p className='pb-1'>
              Money back if the discount rate increases 
            </p>
          </div>
            
        </div>
      </div>
      <div className='h-[50vh] my-10 w-[80%] mx-auto'>
        <SwiperSlider 
          slides={catalogues}
        />
      </div>
      <div 
        className="flex flex-col justify-between w-[80%] mx-auto my-16"
      >
        <span
          className='text-left text-xl font-mono pl-6 mb-5 text-gray-700 font-extrabold'
        >
          Categories
        </span>
        <div
          className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:flex lg:flex-row justify-between px-5 max-w-full"
        >
          {
            categories && categories.map((category: any, index: number) => (
              <CategoryCard 
                key={`${category.name} ${index}`}
                image={category?.image}
                title={category.name}
              />
            ))
          }
        </div>
      </div>
      
      <div className='text-2xl mb-4 w-[80%] ml-[12%] flex flex-row cursor-pointer'>
        <h2 className='font-semibold mr-3'>Open Orders</h2>
        <MdArrowForward className='text-4xl' />
      </div>

      <div
        className='flex flex-col md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4 xl:gap-6 justify-between w-[80%] mx-auto my-3 px-5 py-2'
      >
        {
          openOrders?.map((product:any, index: number) => (
            <OpenOrderProductCard
              key={`${product.name} + ${index}`}
              product={product} 
            />
          ))
        }
      </div>
      
      <div 
        className='flex flex-col justify-between text-gray-800 my-16 w-full md:w-[80%] mx-auto'
      >
        <h2
          className='justify-start text-xl font-mono pl-6 mb-5 font-extrabold'
        >
          Tags
        </h2>
        <div className='grid grid-cols-2 gap-3 md:grid-cols-3 lg:flex lg:flex-row justify-between px-5'>
          {
            tags && tags.map((tag: any, index: number) => (
              <CategoryCard 
                key={`${tag.name} ${index}`}
                image={tag?.image}
                title={tag.name}
              />
            ))
          }
        </div>
      </div>

      <div
        className='flex flex-col md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4 xl:gap-6 justify-between w-[80%] mx-auto my-3 px-5 py-2'
      >
        {
          products?.map((product:any, index: number) => (
            <ProductComponent 
              key={`${product.name} + ${index}`}
              product={product} 
            />
          ))
        }
      </div>
    </div>

  )
}

export default Home

export async function getServerSideProps() {
  try{
      const getProducts = await sendAxiosRequest(
        `/api/products/all`,
        "get",
        {},
        "",
        ''
      )
      const getOpenOrders = await sendAxiosRequest(
        '/api/open-orders/all',
        'get',
        {},
        '',
        ''
      );

      const [products, openOrders] = await Promise.all([
        getProducts.products,
        getOpenOrders. orders
      ]);

      const categories: any[] = categoriesDummyData;
      const tags: any[] = tagsDummyData;
      const catalogues: any[] = cataloguesDummyData;

      return {
        props: {
          products: productsDummyData,
          openOrders: openOrderProductsDummyData,
          categories,
          tags,
          catalogues
        },
      }
  }
  catch(err) {
    return {
      props: {
        products: productsDummyData,
        openOrders: openOrderProductsDummyData,
        categories: categoriesDummyData,
        tags: tagsDummyData,
        catalogues: cataloguesDummyData
      },
    }
  }
}