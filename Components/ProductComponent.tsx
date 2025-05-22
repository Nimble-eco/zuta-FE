import { useRouter } from 'next/router';
import { FC } from 'react'
import RatingsCard from './cards/RatingsCard';
import { formatAmount } from '../Utils/formatAmount';
import { processImgUrl } from '../Utils/helper';

interface IProductComponentProps {
    product: {
        product_name: string,
        id: string | number;
        product_description?: string,
        product_images: string[],
        product_price: number,
        product_discount?: number,
        reviews?: any[],
    }
}

const ProductComponent: FC<IProductComponentProps> = ({product}) => {
    const router = useRouter();
    const goToProductPage = (id : string) => router.push(`/product?id=${id}`);

    const getRating = () => {
        if(product?.reviews?.length) {
            let total = 0;
            product?.reviews?.forEach(review => {
                total += review.score;
            });
            return total/product?.reviews?.length;
        } else {
            return 4;
        }
    }

    return (
        <div className='flex flex-row bg-white rounded-md shadow-xl w-full'>
            <img
                src={processImgUrl(product?.product_images[0])}
                alt={product.product_name}
                className='!rounded-l-md h-32 cursor-pointer w-full lg:w-[50%] object-cover object-center'
                onClick={() => goToProductPage(product?.id as string)}
            />
               
            <div className="flex flex-col px-2 py-1 gap-1 lg:gap-4 w-full">
                <div className='flex justify-between flex-col gap-1 items-start'>
                    <h3 className='text-sm text-slate-800 line-clamp-2 capitalize font-semibold'>
                        {product?.product_name}
                    </h3>
                    <p className='text-base text-green-600 font-semibold'>
                        {formatAmount(product?.product_price)}
                    </p>
                </div>
                <div className='flex flex-row items-center gap-1 mt-2'>
                    <RatingsCard 
                        rating={getRating()} 
                        hight={4}
                        width={4}
                    /> 
                    <span className='text-xs text-slate-600 font-medium'>
                        {product?.product_discount}% Off
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ProductComponent
