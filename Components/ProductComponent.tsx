import { useRouter } from 'next/router';
import { FC } from 'react'
import RatingsCard from './cards/RatingsCard';
import { formatAmount } from '../Utils/formatAmount';

interface IProductComponentProps {
    product: {
        product_name: string,
        id: string;
        product_description?: string,
        product_images: string[],
        product_price: number,
        product_discount?: number,
        reviews?: number,
    }
}

const ProductComponent: FC<IProductComponentProps> = ({product}) => {
    const router = useRouter();
    const goToProductPage = (id : string) => {
        router.push(`/product?id=${id}`);
    }

    return (
        <div
            className='flex xs:flex-col sm:!flex-col md:!flex-col bg-white rounded-md mb-4 shadow-xl w-fit min-w-full'
        >
            <img
                src={product?.product_images[0]}
                alt={product.product_name}
                className='xs:rounded-t-md sm:!rounded-l-md md:rounded-t-md lg:!rounded-l-none lg:!rounded-t-md justify-center h-48 cursor-pointer w-full'
                onClick={() => goToProductPage(product?.id)}
            />
               
            <div 
                className="flex flex-col md:justify-between p-3 w-full"
            >
                <div className='flex flex-col md:flex-row justify-between mb-4'>
                    <h3 className='text-sm font-mono line-clamp-2 mb-4 md:mb-0'>
                        {product?.product_name}
                    </h3>
                    { product?.reviews && <RatingsCard rating={product.reviews} /> }
                </div>
                <div 
                    className='flex flex-row mb-4'
                >
                    <p 
                        className='text-base text-green-600 font-semibold mr-4'
                    >
                        {formatAmount(product?.product_price)}
                    </p>
                    <span 
                        className='text-base'
                    >
                        {product?.product_discount}% Off
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ProductComponent
