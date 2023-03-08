import { useRouter } from 'next/router';
import RatingsCard from './RatingsCard';

interface IFeaturedProductComponentProps {
    product: {
        name: string,
        id: string;
        description?: string,
        image: string,
        price: number,
        discount?: number,
        rating?: number,
    }
}

const FeaturedProductCard = ({product}: IFeaturedProductComponentProps) => {
    const router = useRouter();
    const goToProductPage = (id : string) => {
        router.push(`/product?id=${id}`);
    }
  return (
        <div
            className='flex flex-col bg-white rounded-md shadow-xl'
        >
            <p className='font-thin text-sm mb-4'>Featured</p>
            <img
                src={product?.image}
                alt="product image"
                className='rounded-t-md justify-center mr-4 h-52 cursor-pointer w-full'
                onClick={() => goToProductPage(product?.id)}
            />
               
            <div 
                className="flex flex-col justify-between p-3 w-full"
            >
                <div className='flex flex-row justify-between mb-4'>
                    <h3 className='text-base font-mono line-clamp-2'>
                        {product?.name}
                    </h3>
                </div>
                <div className='flex flex-col'>
                    <p 
                        className='text-xl text-orange-300 font-semibold mb-3'
                    >
                        {product?.price}
                    </p>
                    <span 
                        className='text-base'
                    >
                        {product?.discount}% Off
                    </span>
                </div>
            </div>
        </div>
    )
}

export default FeaturedProductCard