import { useRouter } from 'next/router';
import {MdArrowForward} from 'react-icons/md'
import CategoryCard from '../Components/cards/CategoryCard';
import OpenOrderProductCard from '../Components/cards/OpenOrderProductCard';
import Header from '../Components/Header';
import ProductComponent from '../Components/ProductComponent';
import SwiperSlider from '../Components/sliders/Swiper';
import { sendAxiosRequest } from '../Utils/sendAxiosRequest';
import { cataloguesDummyData } from '../data/catalogues';
import HorizontalSlider from '../Components/lists/HorizontalSlider';
import { ArrowRightCircle } from 'lucide-react';

interface IHomePageProps {
  products: any[];
  openOrders: any[];
  categories: any[];
  tags: any[];
  featured: any[];
  catalogues: any[];
}

const Home = ({products, openOrders, categories, tags, featured, catalogues}: IHomePageProps) => {
  const router = useRouter();

  const searchProducts = (searchStr: string) => {
    router.push(`/results?search=${searchStr}`)
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Header onSearch={searchProducts}/>

      <div
        className='flex flex-col justify-center w-full lg:w-[90%] md:w-[80%] mx-auto px-5 lg:px-0 py-10'
      >
        <div className='flex flex-col text-left'>
          <h2 className='text-2xl md:text-4xl text-gray-600 font-bold w-full lg:w-[80%] mb-6'>
            Let us buy {''}
            <span className='text-orange-500'>
              Together
            </span>  
          </h2>
          <div className='flex flex-col text-base justify-start w-full lg:w-[80%] font-mono font-semibold text-left text-gray-500'>
            <p className='pb-1'>
              Enjoy Wholesale prices
            </p>
            <p>
              Money back if the discount rate increases 
            </p>
          </div>
            
        </div>
      
        <div className='lg:h-[35vh] my-10 w-full mx-auto'>
          <SwiperSlider 
            slides={cataloguesDummyData}
            // slides={catalogues?.map(catalogue => catalogue.image)}
            slidesToShow={2}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 justify-between w-full lg:px-[5%] py-8 bg-gray-100 mb-16">
        <div className="hidden lg:flex lg:flex-row gap-4">
          {
            categories.length > 0 && categories?.slice(0,8).map((category: any, index: number) => (
              <CategoryCard 
                key={`${category.name} ${index}`}
                image={category?.image}
                title={category.name}
              />
            ))
          }
          <a
            href='/departments'
            className='my-auto flex flex-row gap-1 items-center'
          >
            <p className='text-orange-600 text-sm whitespace-nowrap'>See more</p>
            <ArrowRightCircle className='text-xl text-orange-600' />
          </a>
        </div>

        <div className="grid grid-cols-3 gap-3 md:grid-cols-3 lg:hidden px-5 max-w-full">
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
      
      <div className='flex flex-col gap-4 w-full lg:w-[90%] mx-auto px-4'>
        <div className='text-2xl mb-4 flex flex-row justify-between items-center'>
          <h2 className='font-semibold text-slate-800 text-xl'>Join Order Trains</h2>
          <a href='/order-train' className="flex flex-row gap-2 items-center text-base font-medium">
            <p className='text-orange-600 mb-0'>More</p>
            <ArrowRightCircle className='text-3xl text-orange-600' />
          </a>
        </div>

        <div className='flex flex-col md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4 xl:gap-6'>
          {
            openOrders.length > 0 && openOrders?.slice(0,8).map((order:any, index: number) => (
              <OpenOrderProductCard
                key={`${order.name} + ${index}`}
                order={order} 
              />
            ))
          }
        </div>
      </div>

      <div className='mb-4 px-4 w-full lg:w-[90%] mx-auto'>
        <HorizontalSlider
          list_name='Showcase'
          list={featured}
        />
      </div>
      
      <div className='flex flex-col gap-10 py-8 bg-gray-100 w-full lg:px-[5%]'>
        <div className='flex flex-col gap-2 w-full'>
          <div className='hidden lg:flex lg:flex-row gap-4'>
            {
              tags.length > 0 && tags?.slice(0,8).map((tag: any, index: number) => (
                <CategoryCard 
                  key={`${tag.name} ${index}`}
                  image={tag?.image}
                  title={tag.name}
                />
              ))
            }
            <a
              href='/departments'
              className='my-auto flex flex-row gap-1 items-center'
            >
              <p className='text-orange-600 text-sm whitespace-nowrap'>See more</p>
              <ArrowRightCircle className='text-xl text-orange-600' />
            </a>
          </div>

          <div className='grid grid-cols-3 gap-2 md:grid-cols-4 lg:hidden px-5'>
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
          
        <div className='flex flex-col md:grid md:grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6 px-4 lg:px-0'>
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
      const getFeaturedProducts = await sendAxiosRequest(
        '/api/featured/product/filter/index',
        'post',
        {status: 'active'},
        '',
        ''
      );
      const getAdvertBanners = await sendAxiosRequest(
        '/api/advert/banners/filter/index',
        'post',
        {enabled: 1},
        '',
        ''
      );

      const [productsResult, openOrdersResult, categoriesResult, tagsResult, featuredResult, bannersResult] = await Promise.allSettled([
        getProducts,
        getOpenOrders,
        getCategories,
        getTags,
        getFeaturedProducts,
        getAdvertBanners
      ]);

      const products = productsResult.status === 'fulfilled' && productsResult?.value ? productsResult?.value?.data : [];
      const openOrders = openOrdersResult.status === 'fulfilled' && openOrdersResult?.value ? openOrdersResult?.value?.data : [];
      const categories = categoriesResult.status === 'fulfilled' ? categoriesResult?.value?.data : [];
      const tags = tagsResult.status === 'fulfilled' ? tagsResult?.value?.data : [];      
      const featured = featuredResult.status === 'fulfilled' ? featuredResult?.value?.data : [];      
      const banners = bannersResult.status === 'fulfilled' ? bannersResult?.value?.data : [];      
   
      return {
        props: {
          products : products?.data ?? [],
          openOrders: openOrders?.data ?? [],
          categories: categories ?? [],
          tags: tags ?? [],
          featured: featured?.data ?? [],
          catalogues: banners?.data ??  []
        },
      }
  }
  catch(err: any) {
    console.log({err})
    const error = err?.toJSON();
    console.log({error})
    return {
      props: {
        products: [],
        openOrders: [],
        categories: [],
        tags: [],
        featured: [],
        catalogues: []
      },
    }
  }
}