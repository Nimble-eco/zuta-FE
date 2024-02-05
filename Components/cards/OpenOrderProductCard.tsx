import { useRouter } from 'next/router';
import { FC } from 'react'
import { HiOutlineShoppingCart } from 'react-icons/hi'
import RatingsCard from './RatingsCard';
import { formatAmount } from '../../Utils/formatAmount';

interface IOpenOrderProductCardProps {
    order: {
        id: string,
        open_order_price: number,
        open_order_discount: number,
        user_id: string,
        created_at: string | Date,
        subscribers_count: number,
        product: {
            product_name: string,
            product_id: string;
            product_description?: string,
            product_images: string[],
            product_price: number,
            product_discount?: number,
            reviews?: number,
        },
        subscribers_list: any[]
    }
}

const OpenOrderProductCard: FC<IOpenOrderProductCardProps> = ({order}) => {
    const router = useRouter();
    const goToProductPage = (id : string) => {
        router.push(`/openOrder?id=${id}`);
    }

    return (
        <div
            className='flex flex-col bg-white rounded-md mb-8 shadow-xl'
        >
            <div className='relative'>
                <div className='bg-white rounded-md text-center px-3 py-2 flex flex-row absolute top-2 left-2'>
                    <HiOutlineShoppingCart className='text-lg text-orange-300 mr-1 my-auto' />
                    <span className=''>{order?.subscribers_count ?? 10}</span>
                </div>
                <img
                    src={order.product?.product_images[0]}
                    alt="product image"
                    width={100}
                    height={200}
                    className='rounded-t-md justify-center mr-4 h-48 cursor-pointer w-full'
                    onClick={() => goToProductPage(order.id)}
                />
            </div>
            <div 
                className="flex flex-col justify-between p-2 px-4 w-full"
            >
                <div className='flex flex-row justify-between mb-3'>
                    <h3 className='text-base font-mono line-clamp-1'>
                        {order.product?.product_name}
                    </h3>
                    { order.product?.reviews && <RatingsCard rating={order.product.reviews} /> }
                </div>
            
                <div className='flex flex-row mb-4 align-middle'>
                    <p className='text-base text-green-600 font-semibold mr-2'>
                        {formatAmount(order?.open_order_price)}
                    </p>
                    <p className='text-sm font-thin line-through mr-2 my-auto'>
                        {formatAmount(order.product?.product_price)}
                    </p>
                    <span className='text-sm my-auto'>
                        {order?.open_order_discount}% Off
                    </span>
                </div>
            </div>
        </div>
    )
}

export default OpenOrderProductCard
