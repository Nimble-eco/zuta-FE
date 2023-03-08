import { useRouter } from 'next/router';
import { FC } from 'react'
import RatingsCard from './cards/RatingsCard';

interface IProductComponentProps {
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

const ProductComponent: FC<IProductComponentProps> = ({product}) => {
    const router = useRouter();
    const goToProductPage = (id : string) => {
        router.push(`/product?id=${id}`);
    }

    return (
        <div
            className='flex xs:flex-col sm:!flex-row md:!flex-col bg-white rounded-md mb-4 shadow-xl w-fit min-w-[95%]'
        >
            <img
                src={product?.image}
                alt="product image"
                className='xs:rounded-t-md sm:!rounded-l-md md:rounded-t-md justify-center h-48 cursor-pointer w-full'
                onClick={() => goToProductPage(product?.id)}
            />
               
            <div 
                className="flex flex-col md:justify-between p-3 w-full"
            >
                <div className='flex flex-col md:flex-row justify-between mb-4'>
                    <h3 className='text-sm font-mono line-clamp-2 mb-4 md:mb-0'>
                        {product?.name}
                    </h3>
                    { product?.rating && <RatingsCard rating={product.rating} /> }
                </div>
                <div 
                    className='flex flex-row mb-4'
                >
                    <p 
                        className='text-base text-orange-300 font-semibold mr-4'
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

export default ProductComponent
