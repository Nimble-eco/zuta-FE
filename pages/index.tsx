import { useRouter } from 'next/router';
import {MdArrowForward} from 'react-icons/md'
import CategoryCard from '../Components/cards/CategoryCard';
import OpenOrderProductCard from '../Components/cards/OpenOrderProductCard';
import Header from '../Components/Header';
import ProductComponent from '../Components/ProductComponent';
import SwiperSlider from '../Components/sliders/Swiper';
import { sendAxiosRequest } from '../Utils/sendAxiosRequest';
import { cataloguesDummyData } from '../data/catalogues';

interface IHomePageProps {
  products: any[];
  openOrders: any[];
  categories: any[];
  tags: any[];
  catalogues: string[];
}

const Home = ({products, openOrders, categories, tags, catalogues}: IHomePageProps) => {
  const router = useRouter();

  const searchProducts = (searchStr: string) => {
    router.push(`/results?search=${searchStr}`)
  }

  const handleClick = (tag: string) => {
    router.push(`/results?tag=${tag}`);
  }

  return (

    <div 
      className=" min-h-screen"
    >
      <Header onSearch={searchProducts}/>

      <div
        className='flex flex-col justify-center w-full lg:w-[90%] md:w-[80%] mx-auto px-5 py-10 my-10'
      >
        <div className=' rounded-md w-[90%] md:w-[60%] flex flex-col text-left lg:pl-[4%]'>
          <h2
            className='text-2xl md:text-5xl text-gray-600 font-bold w-full lg:w-[80%] mb-8'
          >
            Make we buy am {''}
              <span 
                className='text-orange-500'
              >
                together
              </span>  
          </h2>
          <div 
            className='flex flex-col text-base justify-start w-full lg:w-[80%] font-mono font-semibold text-left text-gray-500'
          >
            <p className='pb-1'>
              Enjoy Wholesale prices
            </p>
            <p className='pb-1'>
              Money back if the discount rate increases 
            </p>
          </div>
            
        </div>
      </div>
      <div className='lg:h-[50vh] my-10 w-[80%] mx-auto'>
        <SwiperSlider 
          slides={cataloguesDummyData}
          slidesToShow={2}
        />
      </div>

      <div 
        className="flex flex-col gap-2 justify-between w-full px-[5%] lg:px-[10%] py-8 bg-gray-100 mb-16"
      >
        <span
          className='text-left text-xl font-mono pl-6 mb-2 text-gray-700 font-extrabold'
        >
          Categories
        </span>
        <div
          className="hidden lg:flex lg:flex-row gap-6 py-4 overflow-x-scroll"
        >
          {
            categories.length > 0 && categories?.map((category: any, index: number) => (
              <CategoryCard 
                key={`${category.name} ${index}`}
                image={category?.image}
                title={category.name}
              />
            ))
          }
        </div>

        <div
          className="grid grid-cols-3 gap-3 md:grid-cols-3 lg:hidden px-5 max-w-full"
        >
          {
            categories.length > 0 && categories?.slice(0, 8).map((category: any, index: number) => (
              <CategoryCard 
                key={`${category.name} ${index}`}
                image={category?.image}
                title={category.name}
              />
            ))
          }
        </div>
      </div>
      
      <div className='text-2xl mb-4 w-[90%] lg:w-[80%] ml-[12%] flex flex-row cursor-pointer'>
        <h2 className='font-semibold mr-3'>Open Orders</h2>
        <MdArrowForward className='text-4xl' />
      </div>

      <div
        className='flex flex-col md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4 xl:gap-6 justify-between w-[80%] mx-auto my-3 px-5 py-2'
      >
        {
          openOrders.length > 0 && openOrders?.map((order:any, index: number) => (
            <OpenOrderProductCard
              key={`${order.name} + ${index}`}
              order={order} 
            />
          ))
        }
      </div>
      
      <div 
        className='flex flex-col justify-between text-gray-800 my-16 w-full px-[5%] lg:px-[10%] py-8 mx-auto bg-gray-100'
      >
        <h2
          className='justify-start text-xl font-mono pl-6 mb-2 font-extrabold'
        >
          Tags
        </h2>
        <div className='hidden lg:flex lg:flex-row gap-4 px-5 overflow-x-scroll'>
          {
            tags.length > 0 && tags?.map((tag: any, index: number) => (
              <CategoryCard 
                key={`${tag.name} ${index}`}
                image={tag?.image}
                title={tag.name}
              />
            ))
          }
        </div>

        <div className='grid grid-cols-3 gap-3 md:grid-cols-3 lg:hidden px-5'>
          {
            tags.length > 0 && tags?.slice(0, 8).map((tag: any, index: number) => (
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
        className='flex flex-col md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4 xl:gap-6 justify-between w-[90%] lg:w-[80%] mx-auto my-3 px-5 py-2'
      >
        {
          products.length > 0 && products?.map((product:any, index: number) => (
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
        `/api/public/product/index?properties=1`,
        "get",
        {},
        "",
        ''
      )
      const getOpenOrders = await sendAxiosRequest(
        '/api/open-order/index?properties=1',
        'get',
        {},
        '',
        ''
      );
      const getCategories = await sendAxiosRequest(
        '/api/product/category/index',
        'get',
        {},
        '',
        ''
      );
      const getTags = await sendAxiosRequest(
        '/api/product/tag/index',
        'get',
        {},
        '',
        ''
      );

      const [productsResult, openOrdersResult, categoriesResult, tagsResult] = await Promise.allSettled([
        getProducts,
        getOpenOrders,
        getCategories,
        getTags
      ]);

      const products = productsResult.status === 'fulfilled' && productsResult?.value ? productsResult?.value?.data : [];
      const openOrders = openOrdersResult.status === 'fulfilled' && openOrdersResult?.value ? openOrdersResult?.value?.data : [];
      const categories = categoriesResult.status === 'fulfilled' ? categoriesResult?.value?.data : [];
      const tags = tagsResult.status === 'fulfilled' ? tagsResult?.value?.data : [];      
    
      return {
        props: {
          products : products.data ?? [],
          openOrders: openOrders.data ?? [],
          categories: categories.data,
          tags: tags.data,
          catalogues: []
        },
      }
  }
  catch(err) {
    console.log({err})
    return {
      props: {
        products: [],
        openOrders: [],
        categories: [],
        tags: [],
        catalogues: []
      },
    }
  }
}